import multer from 'multer';
import path from 'path';

// إعداد التخزين في الذاكرة (سنرفع مباشرة لـ Cloudinary)
const storage = multer.memoryStorage();

// فلتر أنواع الملفات المسموح بها
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('الملف يجب أن يكون صورة (jpeg, jpg, png, webp)'), false);
    }
};

// إعداد multer
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 ميجابايت كحد أقصى
    },
});

/**
 * Middleware للتعامل مع أخطاء رفع الملفات
 */
export const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'حجم الملف كبير جدًا، الحد الأقصى 5 ميجابايت',
            });
        }
        return res.status(400).json({
            success: false,
            message: `خطأ في رفع الملف: ${err.message}`,
        });
    }

    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    next();
};
