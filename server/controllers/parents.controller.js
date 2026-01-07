import pool from '../config/db.mysql.js';

/**
 * @desc    جلب أبنائي (لولي الأمر)
 * @route   GET /api/parents/my-children
 * @access  Parent
 */
export const getMyChildren = async (req, res) => {
    try {
        const [children] = await pool.execute(
            `SELECT s.* FROM students s
             JOIN parent_students ps ON s.id = ps.student_id
             WHERE ps.parent_id = ?`,
            [req.user.id]
        );
        res.status(200).json({ success: true, count: children.length, data: children });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    جلب مدفوعات الأبناء
 * @route   GET /api/parents/child-payments/:studentId
 * @access  Parent
 */
export const getChildPayments = async (req, res) => {
    try {
        const [payments] = await pool.execute(
            `SELECT p.*, c.title as course_title 
             FROM payments p
             JOIN bookings b ON p.booking_id = b.id
             JOIN courses c ON b.course_id = c.id
             WHERE p.student_id = ?`,
            [req.params.studentId]
        );
        res.status(200).json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    جلب غياب الأبناء
 * @route   GET /api/parents/child-attendance/:studentId
 * @access  Parent
 */
export const getChildAttendance = async (req, res) => {
    try {
        const [attendance] = await pool.execute(
            `SELECT a.*, c.title as course_title
             FROM attendance a
             JOIN courses c ON a.course_id = c.id
             WHERE a.student_id = ?`,
            [req.params.studentId]
        );
        res.status(200).json({ success: true, count: attendance.length, data: attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    جلب دورات الأبناء
 * @route   GET /api/parents/child-courses/:studentId
 * @access  Parent
 */
export const getChildCourses = async (req, res) => {
    try {
        const [bookings] = await pool.execute(
            `SELECT b.*, c.title as course_title, c.description, c.price_per_month, c.cover_image
             FROM bookings b
             JOIN courses c ON b.course_id = c.id
             WHERE b.student_id = ? AND b.status = 'confirmed'`,
            [req.params.studentId]
        );
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
