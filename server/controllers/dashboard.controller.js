import pool from '../config/db.mysql.js';

/**
 * @desc    الحصول على إحصائيات لوحة التحكم
 * @route   GET /api/dashboard/stats
 * @access  Admin/Accountant
 */
export const getDashboardStats = async (req, res) => {
    try {
        const [studentCountRows] = await pool.execute('SELECT COUNT(*) as count FROM students');
        const [employeeCountRows] = await pool.execute('SELECT COUNT(*) as count FROM employees');
        const [courseCountRows] = await pool.execute('SELECT COUNT(*) as count FROM courses');
        const [bookingCountRows] = await pool.execute('SELECT COUNT(CASE WHEN status = "pending" THEN 1 END) as pendingBookings, COUNT(CASE WHEN status = "confirmed" THEN 1 END) as confirmedBookings FROM bookings');

        res.status(200).json({
            success: true,
            data: {
                students: studentCountRows[0].count,
                employees: employeeCountRows[0].count,
                courses: courseCountRows[0].count,
                pendingBookings: bookingCountRows[0].pendingBookings,
                confirmedBookings: bookingCountRows[0].confirmedBookings
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
