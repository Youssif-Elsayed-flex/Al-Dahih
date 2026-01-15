import jwt from 'jsonwebtoken';
import pool from '../config/db.pg.js';

export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) return res.status(401).json({ success: false, message: 'غير مصرّح، الرجاء تسجيل الدخول أولاً' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = null;
        let userType = null;

        let { rows } = await pool.query('SELECT id, name, email, role, is_active FROM employees WHERE id = $1', [decoded.id]);
        if (rows.length > 0) {
            user = rows[0];
            userType = 'employee';
        }

        if (!user) {
            ({ rows } = await pool.query('SELECT id, name, email, phone, avatar, is_active FROM students WHERE id = $1', [decoded.id]));
            if (rows.length > 0) {
                user = rows[0];
                userType = 'student';
            }
        }

        if (!user) {
            ({ rows } = await pool.query('SELECT id, name, email, phone, is_active FROM parents WHERE id = $1', [decoded.id]));
            if (rows.length > 0) {
                user = rows[0];
                userType = 'parent';
            }
        }

        if (!user) return res.status(401).json({ success: false, message: 'المستخدم غير موجود' });
        if (!user.is_active) return res.status(403).json({ success: false, message: 'الحساب غير نشط' });

        req.user = user;
        req.userType = userType;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'التوكن غير صالح' });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (req.userType !== 'employee') {
            return res.status(403).json({ success: false, message: 'غير مصرّح لهذا الإجراء' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'غير مصرّح لهذا الإجراء' });
        }
        next();
    };
};
