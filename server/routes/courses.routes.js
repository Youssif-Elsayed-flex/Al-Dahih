import express from 'express';
import {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
} from '../controllers/courses.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { upload, handleUploadError } from '../middleware/upload.middleware.js';
import { createCourseValidation, validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Admin only routes
router.post(
    '/',
    protect,
    authorize('admin'),
    upload.single('coverImage'),
    handleUploadError,
    createCourseValidation,
    validate,
    createCourse
);

router.patch(
    '/:id',
    protect,
    authorize('admin'),
    upload.single('coverImage'),
    handleUploadError,
    updateCourse
);

router.delete('/:id', protect, authorize('admin'), deleteCourse);

export default router;
