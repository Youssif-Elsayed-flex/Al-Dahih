import express from 'express';
import {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    toggleEmployeeStatus,
    deleteEmployee,
    getTeachers,
} from '../controllers/employees.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/teachers', protect, getTeachers);

router.use(protect, authorize('admin'));

router.post('/', createEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.patch('/:id', updateEmployee);
router.patch('/:id/toggle-status', toggleEmployeeStatus);
router.delete('/:id', deleteEmployee);

export default router;
