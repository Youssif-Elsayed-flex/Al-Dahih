import express from 'express';
import { getDashboardStats, getPendingEmployees, approveEmployee, rejectEmployee } from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin', 'accountant'), getDashboardStats);

router.get('/pending-employees', protect, authorize('admin'), getPendingEmployees);

router.patch('/approve-employee/:id', protect, authorize('admin'), approveEmployee);

router.delete('/reject-employee/:id', protect, authorize('admin'), rejectEmployee);

export default router;
