import pool from '../config/db.pg.js';
import bcrypt from 'bcryptjs';

const formatEmployee = (e) => ({
    _id: e.id,
    id: e.id,
    name: e.name,
    email: e.email,
    role: e.role,
    salary: e.salary,
    permissions: e.permissions,
    isActive: e.is_active,
    joinDate: e.join_date,
    createdAt: e.created_at
});

export const createEmployee = async (req, res) => {
    const { name, email, password, role, salary } = req.body;
    try {
        const { rows: existing } = await pool.query('SELECT id FROM employees WHERE email = $1', [email]);
        if (existing.length > 0) return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجّل بالفعل' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const { rows } = await pool.query(
            'INSERT INTO employees (name, email, password, role, salary, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [name, email, hashedPassword, role, salary || 0, true]
        );

        res.status(201).json({ success: true, message: 'تم إنشاء الموظف بنجاح', data: { id: rows[0].id } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllEmployees = async (req, res) => {
    try {
        const { rows: employees } = await pool.query('SELECT id, name, email, role, salary, is_active, join_date, created_at, permissions FROM employees ORDER BY created_at DESC');
        res.status(200).json({ success: true, count: employees.length, data: employees.map(formatEmployee) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getEmployeeById = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, name, email, role, salary, is_active, join_date, created_at, permissions FROM employees WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'الموظف غير موجود' });
        }
        res.status(200).json({ success: true, data: formatEmployee(rows[0]) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateEmployee = async (req, res) => {
    const { name, role, salary, isActive, permissions } = req.body;
    try {
        const { rows: existing } = await pool.query('SELECT id FROM employees WHERE id = $1', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'الموظف غير موجود' });
        }

        await pool.query(
            'UPDATE employees SET name = $1, role = $2, salary = $3, is_active = $4, permissions = $5 WHERE id = $6',
            [name, role, salary, isActive, permissions ? JSON.stringify(permissions) : null, req.params.id]
        );
        res.status(200).json({ success: true, message: 'تم تحديث بيانات الموظف بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleEmployeeStatus = async (req, res) => {
    const { isActive } = req.body;
    try {
        const { rows } = await pool.query('SELECT id, role FROM employees WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'الموظف غير موجود' });
        }

        if (rows[0].role === 'admin') {
            return res.status(400).json({ success: false, message: 'لا يمكن تعطيل حساب مدير' });
        }

        await pool.query('UPDATE employees SET is_active = $1 WHERE id = $2', [isActive, req.params.id]);
        res.status(200).json({ success: true, message: isActive ? 'تم تفعيل الموظف بنجاح' : 'تم تعطيل الموظف بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, role FROM employees WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'الموظف غير موجود' });
        }

        if (rows[0].role === 'admin') {
            return res.status(400).json({ success: false, message: 'لا يمكن حذف حساب مدير' });
        }

        await pool.query('DELETE FROM employees WHERE id = $1', [req.params.id]);
        res.status(200).json({ success: true, message: 'تم حذف الموظف بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTeachers = async (req, res) => {
    try {
        const { rows: teachers } = await pool.query(
            "SELECT id, name, email, is_active, join_date, created_at FROM employees WHERE role = 'teacher' AND is_active = true ORDER BY name"
        );
        res.status(200).json({
            success: true,
            count: teachers.length,
            data: teachers.map(t => ({
                _id: t.id,
                id: t.id,
                name: t.name,
                email: t.email,
                isActive: t.is_active,
                joinDate: t.join_date,
                createdAt: t.created_at
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
