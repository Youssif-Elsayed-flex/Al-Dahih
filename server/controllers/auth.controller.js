import pool from '../config/db.pg.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';

const emailExists = async (email) => {
    const tables = ['students', 'employees', 'parents'];
    for (const table of tables) {
        const { rows } = await pool.query(`SELECT id FROM ${table} WHERE email = $1`, [email]);
        if (rows.length > 0) return true;
    }
    return false;
};

export const registerEmployee = async (req, res) => {
    const { name, email, password, phone, subject, role = 'teacher' } = req.body;

    try {
        if (await emailExists(email)) {
            return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجّل بالفعل' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { rows } = await pool.query(
            'INSERT INTO employees (name, email, password, role, salary, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            [name, email, hashedPassword, role, 0, null, false]
        );

        res.status(201).json({
            success: true,
            message: 'تم التسجيل بنجاح، بانتظار موافقة الإدارة',
            data: { id: rows[0].id, status: 'pending' }
        });
    } catch (error) {
        console.error('Register Employee Error:', error);
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
};

export const registerStudent = async (req, res) => {
    const { name, email, password, phone, parentPhone, educationLevel } = req.body;

    try {
        if (await emailExists(email)) {
            return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجّل بالفعل' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { rows } = await pool.query(
            'INSERT INTO students (name, email, password, phone, parent_phone, education_level, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            [name, email, hashedPassword, phone || null, parentPhone || null, educationLevel || null, true]
        );

        const studentId = rows[0].id;
        const token = generateToken(studentId);

        res.cookie('token', token, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(201).json({
            success: true,
            message: 'تم التسجيل بنجاح',
            token,
            data: {
                user: { _id: studentId, id: studentId, name, email, userType: 'student' }
            },
        });
    } catch (error) {
        console.error('Register Student Error:', error);
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
};

export const registerParent = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        if (await emailExists(email)) {
            return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجّل بالفعل' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const { rows } = await pool.query(
            'INSERT INTO parents (name, email, password, phone, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [name, email, hashedPassword, phone || null, true]
        );

        const token = generateToken(rows[0].id);
        res.cookie('token', token, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(201).json({
            success: true,
            message: 'تم التسجيل بنجاح',
            token,
            data: { user: { id: rows[0].id, _id: rows[0].id, name, email, userType: 'parent' } }
        });
    } catch (error) {
        console.error('Register Parent Error:', error);
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = null;
        let userType = null;

        let { rows } = await pool.query('SELECT * FROM employees WHERE email = $1', [email]);
        if (rows.length > 0) {
            user = rows[0];
            userType = 'employee';
        }

        if (!user) {
            ({ rows } = await pool.query('SELECT * FROM students WHERE email = $1', [email]));
            if (rows.length > 0) {
                user = rows[0];
                userType = 'student';
            }
        }

        if (!user) {
            ({ rows } = await pool.query('SELECT * FROM parents WHERE email = $1', [email]));
            if (rows.length > 0) {
                user = rows[0];
                userType = 'parent';
            }
        }

        if (!user) {
            return res.status(401).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        if (userType === 'employee' && !user.is_active) {
            return res.status(403).json({ success: false, message: 'الحساب غير نشط، يرجى التواصل مع الإدارة' });
        }

        const token = generateToken(user.id);
        res.cookie('token', token, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        const userData = {
            _id: user.id,
            id: user.id,
            name: user.name,
            email: user.email,
            userType,
        };

        if (userType === 'student') {
            userData.avatar = user.avatar;
            userData.phone = user.phone;
            userData.educationLevel = user.education_level;
        } else if (userType === 'employee') {
            userData.role = user.role;
        } else if (userType === 'parent') {
            userData.phone = user.phone;
        }

        res.status(200).json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            token,
            data: { user: userData },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'خطأ في الخادم' });
    }
};

export const logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: 'تم تسجيل الخروج بنجاح',
    });
};

export const getMe = async (req, res) => {
    const user = req.user;
    const userType = req.userType;

    const userData = {
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        userType,
    };

    if (userType === 'student') {
        userData.avatar = user.avatar;
        userData.phone = user.phone;
    } else if (userType === 'employee') {
        userData.role = user.role;
    } else if (userType === 'parent') {
        userData.phone = user.phone;
    }

    res.status(200).json({
        success: true,
        data: {
            user: userData,
        },
    });
};

export const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        let found = false;
        let { rows } = await pool.query('SELECT id FROM students WHERE email = $1', [email]);
        if (rows.length > 0) found = true;

        if (!found) {
            ({ rows } = await pool.query('SELECT id FROM employees WHERE email = $1', [email]));
            if (rows.length > 0) found = true;
        }

        if (!found) {
            ({ rows } = await pool.query('SELECT id FROM parents WHERE email = $1', [email]));
            if (rows.length > 0) found = true;
        }

        if (!found) {
            return res.status(404).json({
                success: false,
                message: 'البريد الإلكتروني غير مسجّل',
            });
        }

        res.status(200).json({
            success: true,
            message: 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني',
        });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
        });
    }
};
