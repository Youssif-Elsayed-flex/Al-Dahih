import express from 'express';
import {
    initiateVodafoneCash,
    confirmVodafoneCash,
    approvePayment,
    getMyPayments,
    getPendingVodafonePayments,
} from '../controllers/payments.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { studentOnly, authorize } from '../middleware/role.middleware.js';

const router = express.Router();

// Student routes
router.post('/vodafone-cash', protect, studentOnly, initiateVodafoneCash);
router.post('/confirm-vodafone', protect, studentOnly, confirmVodafoneCash);
router.get('/my', protect, studentOnly, getMyPayments);

// Admin/Accountant routes
router.patch('/approve/:id', protect, authorize('admin', 'accountant'), approvePayment);
router.get('/pending-vodafone', protect, authorize('admin', 'accountant'), getPendingVodafonePayments);

export default router;
