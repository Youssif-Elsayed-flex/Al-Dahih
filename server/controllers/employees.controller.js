import pool from '../config/db.mysql.js';
import bcrypt from 'bcryptjs';

/**
 * @desc    إنشاء موظف جديد
 * @route   POST /api/employees
 * @access  Admin
 */
export const createEmployee = async (req, res) => {
    const { name, email, password, role, salary } = req.body;
    try {
        const [existing] = await pool.execute('SELECT id FROM employees WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجّل بالفعل' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO employees (name, email, password, role, salary) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role, salary]
        );

        res.status(201).json({ success: true, message: 'تم إنشاء الموظف بنجاح', data: { id: result.insertId } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    جلب جميع الموظفين
 * @route   GET /api/employees
 * @access  Admin
 */
export const getAllEmployees = async (req, res) => {
    try {
        const [employees] = await pool.execute('SELECT id, name, email, role, salary, is_active, join_date FROM employees ORDER BY created_at DESC');
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    تحديث موظف
 * @route   PATCH /api/employees/:id
 * @access  Admin
 */
export const updateEmployee = async (req, res) => {
    const { name, role, salary, isActive } = req.body;
    try {
        await pool.execute(
            'UPDATE employees SET name = ?, role = ?, salary = ?, is_active = ? WHERE id = ?',
            [name, role, salary, isActive, req.params.id]
        );
        res.status(200).json({ success: true, message: 'تم تحديث بيانات الموظف بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    حذف موظف
 * @route   DELETE /api/employees/:id
 * @access  Admin
 */
export const deleteEmployee = async (req, res) => {
    try {
        await pool.execute('DELETE FROM employees WHERE id = ?', [req.params.id]);
        res.status(200).json({ success: true, message: 'تم حذف الموظف بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
