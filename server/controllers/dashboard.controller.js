import pool from '../config/db.pg.js';

export const getDashboardStats = async (req, res) => {
    try {
        const { rows: studentCountRows } = await pool.query('SELECT COUNT(*) as count FROM students');
        const { rows: employeeCountRows } = await pool.query('SELECT COUNT(*) as count FROM employees');
        const { rows: courseCountRows } = await pool.query('SELECT COUNT(*) as count FROM courses');
        const { rows: parentCountRows } = await pool.query('SELECT COUNT(*) as count FROM parents');
        const { rows: bookingCountRows } = await pool.query("SELECT COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending, COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed FROM bookings");
        const { rows: pendingTeachersRows } = await pool.query("SELECT COUNT(*) as count FROM employees WHERE is_active = false AND role = 'teacher'");
        const { rows: revenueRows } = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'paid'");

        const { rows: recentBookings } = await pool.query(`
            SELECT b.id as _id, b.status, b.month_year, b.created_at,
                   s.id as student_id, s.name as student_name,
                   c.id as course_id, c.title as course_title
            FROM bookings b
            JOIN students s ON b.student_id = s.id
            JOIN courses c ON b.course_id = c.id
            ORDER BY b.created_at DESC
            LIMIT 5
        `);

        const formattedBookings = recentBookings.map(b => ({
            _id: b._id,
            status: b.status,
            monthYear: b.month_year,
            createdAt: b.created_at,
            student: { _id: b.student_id, name: b.student_name },
            course: { _id: b.course_id, title: b.course_title }
        }));

        res.status(200).json({
            success: true,
            data: {
                counts: {
                    students: parseInt(studentCountRows[0].count),
                    employees: parseInt(employeeCountRows[0].count),
                    parents: parseInt(parentCountRows[0].count),
                    courses: parseInt(courseCountRows[0].count),
                    bookings: {
                        pending: parseInt(bookingCountRows[0].pending || 0),
                        confirmed: parseInt(bookingCountRows[0].confirmed || 0)
                    },
                    pendingTeachers: parseInt(pendingTeachersRows[0].count)
                },
                revenue: {
                    total: parseFloat(revenueRows[0].total)
                },
                recent: {
                    bookings: formattedBookings
                }
            }
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPendingEmployees = async (req, res) => {
    try {
        const { rows: employees } = await pool.query(
            'SELECT id, name, email, role, created_at FROM employees WHERE is_active = false ORDER BY created_at DESC'
        );
        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees.map(e => ({
                _id: e.id,
                id: e.id,
                name: e.name,
                email: e.email,
                role: e.role,
                createdAt: e.created_at
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const approveEmployee = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id FROM employees WHERE id = $1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'الموظف غير موجود' });
        }

        await pool.query('UPDATE employees SET is_active = true WHERE id = $1', [req.params.id]);
        res.status(200).json({ success: true, message: 'تم تفعيل حساب الموظف بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const rejectEmployee = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id FROM employees WHERE id = $1 AND is_active = false', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'الموظف غير موجود أو مفعل بالفعل' });
        }

        await pool.query('DELETE FROM employees WHERE id = $1', [req.params.id]);
        res.status(200).json({ success: true, message: 'تم رفض وحذف طلب الموظف' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
