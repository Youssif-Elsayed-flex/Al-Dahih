import express from 'express';
import {
    getMyChildren,
    getChildPayments,
    getChildAttendance,
    getChildCourses,
    linkStudentToParent,
    unlinkStudentFromParent,
    getAllParents,
    getParentById,
} from '../controllers/parents.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { parentOnly, authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/my-children', protect, parentOnly, getMyChildren);
router.get('/child-payments/:studentId', protect, parentOnly, getChildPayments);
router.get('/child-attendance/:studentId', protect, parentOnly, getChildAttendance);
router.get('/child-courses/:studentId', protect, parentOnly, getChildCourses);
router.post('/link-student', protect, parentOnly, linkStudentToParent);
router.delete('/unlink-student/:studentId', protect, parentOnly, unlinkStudentFromParent);

router.get('/', protect, authorize('admin'), getAllParents);
router.get('/:id', protect, authorize('admin'), getParentById);

export default router;
