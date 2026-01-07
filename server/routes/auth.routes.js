import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
    registerStudent,
    registerEmployee,
    registerParent,
    login,
    logout,
    getMe,
    resetPassword,
} from '../controllers/auth.controller.js';

import {
    registerStudentValidation,
    loginValidation,
    validate,
} from '../middleware/validation.middleware.js';

const router = express.Router();

// تسجيل طالب جديد
router.post('/register-student', registerStudentValidation, validate, registerStudent);

// تسجيل موظف (مدرس)
router.post('/register-employee', validate, registerEmployee);

// تسجيل ولي أمر
router.post('/register-parent', validate, registerParent);

// تسجيل الدخول
router.post('/login', loginValidation, validate, login);

// تسجيل الخروج
router.post('/logout', logout);

// التحقق من الجلسة
router.get('/me', protect, getMe);

// استعادة كلمة المرور
router.post('/reset-password', resetPassword);

export default router;
