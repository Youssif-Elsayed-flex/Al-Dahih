import express from 'express';
import {
    getMyProfile,
    updateMyProfile,
    getAllStudents,
    toggleStudentStatus,
    deleteStudent,
} from '../controllers/students.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { studentOnly, authorize } from '../middleware/role.middleware.js';
import { upload, handleUploadError } from '../middleware/upload.middleware.js';

const router = express.Router();

// Student routes
router.get('/my-profile', protect, studentOnly, getMyProfile);
router.patch(
    '/update-profile',
    protect,
    studentOnly,
    upload.single('avatar'),
    handleUploadError,
    updateMyProfile
);

// Admin routes
router.get('/', protect, authorize('admin'), getAllStudents);
router.patch('/:id/toggle-status', protect, authorize('admin'), toggleStudentStatus);
router.delete('/:id', protect, authorize('admin'), deleteStudent);

export default router;
