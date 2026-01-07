import { body, validationResult } from 'express-validator';

/**
 * قواعد التحقق من تسجيل الطالب
 */
export const registerStudentValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('الاسم مطلوب')
        .isLength({ min: 2 })
        .withMessage('الاسم يجب أن يكون حرفين على الأقل'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('البريد الإلكتروني مطلوب')
        .isEmail()
        .withMessage('صيغة البريد الإلكتروني غير صحيحة')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('كلمة المرور مطلوبة')
        .isLength({ min: 6 })
        .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),

    body('phone')
        .optional()
        .trim()
        .isMobilePhone('ar-EG')
        .withMessage('رقم الهاتف غير صحيح'),
];

/**
 * قواعد التحقق من تسجيل الدخول
 */
export const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('البريد الإلكتروني مطلوب')
        .isEmail()
        .withMessage('صيغة البريد الإلكتروني غير صحيحة')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('كلمة المرور مطلوبة'),
];

/**
 * قواعد التحقق من إنشاء دورة
 */
export const createCourseValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('عنوان الدورة مطلوب')
        .isLength({ min: 3 })
        .withMessage('عنوان الدورة يجب أن يكون 3 أحرف على الأقل'),

    body('pricePerMonth')
        .notEmpty()
        .withMessage('سعر الدورة مطلوب')
        .isNumeric()
        .withMessage('السعر يجب أن يكون رقمًا')
        .custom((value) => value >= 0)
        .withMessage('السعر لا يمكن أن يكون سالبًا'),

    body('maxStudents')
        .optional()
        .isInt({ min: 1 })
        .withMessage('عدد الطلاب يجب أن يكون رقمًا صحيحًا أكبر من 0'),
];

/**
 * قواعد التحقق من الحجز
 */
export const createBookingValidation = [
    body('courseId')
        .notEmpty()
        .withMessage('معرف الدورة مطلوب')
        .isInt()
        .withMessage('معرف الدورة غير صحيح'),

    body('monthYear')
        .notEmpty()
        .withMessage('الشهر والسنة مطلوبان')
        .matches(/^\d{4}-\d{2}$/)
        .withMessage('صيغة الشهر والسنة يجب أن تكون YYYY-MM'),
];

/**
 * Middleware للتحقق من النتائج
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'بيانات غير صحيحة',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};
