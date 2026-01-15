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
    registerEmployeeValidation,
    registerParentValidation,
    loginValidation,
    validate,
} from '../middleware/validation.middleware.js';

const router = express.Router();

router.post('/register-student', registerStudentValidation, validate, registerStudent);

router.post('/register-employee', registerEmployeeValidation, validate, registerEmployee);

router.post('/register-parent', registerParentValidation, validate, registerParent);

router.post('/login', loginValidation, validate, login);

router.post('/logout', logout);

router.get('/me', protect, getMe);

router.post('/reset-password', resetPassword);

export default router;
