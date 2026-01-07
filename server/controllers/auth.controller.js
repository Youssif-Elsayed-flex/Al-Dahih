import pool from '../config/db.mysql.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';

/**
 * @desc    تسجيل موظف جديد (مدرس - عام)
 * @route   POST /api/auth/register-employee
 * @access  Public
 */
export const registerEmployee = async (req, res) => {
    const { name, email, password, phone, subject, role = 'teacher' } = req.body;

    try {
        const [existing] = await pool.execute('SELECT id FROM employees WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجّل بالفعل' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.execute(
            'INSERT INTO employees (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, role]
        );

        res.status(201).json({
            success: true,
            message: 'تم التسجيل بنجاح، بانتظار موافقة الإدارة',
            data: { status: 'pending' }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    تسجيل طالب جديد
 * @route   POST /api/auth/register-student
 * @access  Public
 */
export const registerStudent = async (req, res) => {
    const { name, email, password, phone, parentPhone } = req.body;

    try {
        const [existing] = await pool.execute('SELECT id FROM students WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجّل بالفعل' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO students (name, email, password, phone, parent_phone) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, parentPhone]
        );

        const studentId = result.insertId;
        const token = generateToken(studentId);

        res.cookie('token', token, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });

        res.status(201).json({
            success: true,
            message: 'تم التسجيل بنجاح',
            data: {
                user: { id: studentId, name, email, userType: 'student' }
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    تسجيل ولي أمر جديد
 * @route   POST /api/auth/register-parent
 * @access  Public
 */
export const registerParent = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        const [existing] = await pool.execute('SELECT id FROM parents WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجّل بالفعل' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO parents (name, email, password, phone) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, phone]
        );

        const token = generateToken(result.insertId);
        res.cookie('token', token, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });

        res.status(201).json({
            success: true,
            message: 'تم التسجيل بنجاح',
            data: { user: { id: result.insertId, name, email, userType: 'parent' } }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    تسجيل الدخول (طلاب + موظفين)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Search in Students
        let [users] = await pool.execute('SELECT * FROM students WHERE email = ?', [email]);
        let userType = 'student';

        if (users.length === 0) {
            // Search in Employees
            [users] = await pool.execute('SELECT * FROM employees WHERE email = ?', [email]);
            userType = 'employee';
        }

        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        if (!user.is_active) {
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
            id: user.id,
            name: user.name,
            email: user.email,
            userType,
        };

        if (userType === 'student') {
            userData.avatar = user.avatar;
            userData.phone = user.phone;
        } else {
            userData.role = user.role;
        }

        res.status(200).json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            data: { user: userData },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    تسجيل الخروج
 * @route   POST /api/auth/logout
 * @access  Public
 */
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

/**
 * @desc    جلب بيانات المستخدم الحالي (للتحقق من الجلسة)
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
    // المستخدم موجود بالفعل في req.user بفضل middleware الحماية
    const user = req.user;
    const userType = req.userType;

    const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        userType,
    };

    if (userType === 'student') {
        userData.avatar = user.avatar;
        userData.phone = user.phone;
    } else {
        userData.role = user.role;
    }

    res.status(200).json({
        success: true,
        data: {
            user: userData,
        },
    });
};

/**
 * @desc    استعادة كلمة المرور (إرسال رابط)
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // البحث عن الطالب
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'البريد الإلكتروني غير مسجّل',
            });
        }

        // توليد token مؤقت (سنبسّط هنا)
        const resetToken = generateToken(student._id);
        student.resetToken = resetToken;
        await student.save({ validateBeforeSave: false });

        // إرسال البريد
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        await sendEmail({
            to: student.email,
            subject: 'استعادة كلمة المرور - منصة الدحّيح',
            html: `
        <div style="font-family: Tajawal, Arial, sans-serif; direction: rtl; text-align: right; padding: 20px;">
          <h2>مرحبًا ${student.name}</h2>
          <p>لاستعادة كلمة المرور، اضغط على الرابط التالي:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            استعادة كلمة المرور
          </a>
          <p>إذا لم تطلب استعادة كلمة المرور، تجاهل هذه الرسالة.</p>
        </div>
      `,
        });

        res.status(200).json({
            success: true,
            message: 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني',
        });

    } catch (error) {
        if (process.env.NODE_ENV !== 'production' && !global.isConnected) {
            console.warn('⚠️ Mock Mode: Simulating password reset (Database Offline)');
            return res.status(200).json({
                success: true,
                message: 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني (وضع المحاكاة)',
            });
        }
        console.error('خطأ في استعادة كلمة المرور:', error.message);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم',
            error: error.message,
        });
    }
};
