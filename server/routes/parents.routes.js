import express from 'express';
import {
    getMyChildren,
    getChildPayments,
    getChildAttendance,
    getChildCourses,
} from '../controllers/parents.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require parent authentication
router.use(protect);

router.get('/my-children', getMyChildren);
router.get('/child-payments/:studentId', getChildPayments);
router.get('/child-attendance/:studentId', getChildAttendance);
router.get('/child-courses/:studentId', getChildCourses);

export default router;
