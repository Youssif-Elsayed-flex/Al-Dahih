import express from 'express';
import {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus,
} from '../controllers/bookings.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { studentOnly, authorize } from '../middleware/role.middleware.js';
import { createBookingValidation, validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// Student routes
router.post('/', protect, studentOnly, createBookingValidation, validate, createBooking);
router.get('/my', protect, studentOnly, getMyBookings);

// Admin routes
router.get('/', protect, authorize('admin'), getAllBookings);
router.patch('/status/:id', protect, authorize('admin'), updateBookingStatus);

export default router;
