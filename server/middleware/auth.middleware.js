import jwt from 'jsonwebtoken';
import pool from '../config/db.mysql.js';

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

        // Search in Students
        let [users] = await pool.execute('SELECT id, name, email, is_active FROM students WHERE id = ?', [decoded.id]);
        let userType = 'student';

        if (users.length === 0) {
            // Search in Employees
            [users] = await pool.execute('SELECT id, name, email, role, is_active FROM employees WHERE id = ?', [decoded.id]);
            userType = 'employee';
        }

        if (users.length === 0) return res.status(401).json({ success: false, message: 'المستخدم غير موجود' });

        const user = users[0];
        if (!user.is_active) return res.status(403).json({ success: false, message: 'الحساب غير نشط' });

        req.user = user;
        req.userType = userType;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'التوكن غير صالح' });
    }
};
