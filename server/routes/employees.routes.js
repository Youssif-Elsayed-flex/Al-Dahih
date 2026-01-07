import express from 'express';
import {
    createEmployee,
    getAllEmployees,
    updateEmployee,
    deleteEmployee,
} from '../controllers/employees.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

// All routes are admin only
router.use(protect, authorize('admin'));

router.post('/', createEmployee);
router.get('/', getAllEmployees);
router.patch('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
