import pool from '../config/db.pg.js';

// Helper to format payment object
const formatPayment = (p) => ({
    _id: p.id,
    id: p.id,
    amount: p.amount,
    method: p.method,
    status: p.status,
    transId: p.trans_id, // SQL: trans_id
    paidAt: p.paid_at,
    createdAt: p.created_at,
    // Construct nested object if course_title exists (from joins)
    booking: p.course_title ? {
        course: {
            title: p.course_title
        }
    } : undefined,
    // Add flat properties if needed for Admin dashboard
    studentName: p.student_name,
    studentPhone: p.student_phone
});

/**
 * @desc    بدء دفع بفودافون كاش
 * @route   POST /api/payments/vodafone-cash
 * @access  Student
 */
export const initiateVodafoneCash = async (req, res) => {
    const { bookingId } = req.body;
    try {
        const { rows: bookings } = await pool.query(
            'SELECT b.*, c.price_per_month, c.title FROM bookings b JOIN courses c ON b.course_id = c.id WHERE b.id = $1',
            [bookingId]
        );
        if (bookings.length === 0) return res.status(404).json({ success: false, message: 'الحجز غير موجود' });

        const booking = bookings[0];
        const { rows } = await pool.query(
            'INSERT INTO payments (student_id, booking_id, amount, method, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, bookingId, booking.price_per_month, 'vodafoneCash', 'pending']
        );

        res.status(201).json({
            success: true,
            data: {
                paymentId: rows[0].id,
                amount: booking.price_per_month,
                vodafoneNumber: process.env.VODAFONE_NUMBER || '01012345678',
                ...formatPayment(rows[0])
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    تأكيد دفع فودافون (كود التحويل)
 * @route   POST /api/payments/confirm-vodafone
 * @access  Student
 */
export const confirmVodafoneCash = async (req, res) => {
    const { paymentId, transId } = req.body;
    try {
        await pool.query('UPDATE payments SET trans_id = $1 WHERE id = $2 AND student_id = $3', [transId, paymentId, req.user.id]);
        res.status(200).json({ success: true, message: 'تم استلام الكود بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    تأكيد دفع من المحاسب
 * @route   PATCH /api/payments/approve/:id
 * @access  Admin/Accountant
 */
export const approvePayment = async (req, res) => {
    try {
        const { rows: payments } = await pool.query('SELECT booking_id FROM payments WHERE id = $1', [req.params.id]);
        if (payments.length === 0) return res.status(404).json({ success: false, message: 'عملية الدفع غير موجودة' });

        await pool.query("UPDATE payments SET status = 'paid', paid_at = NOW() WHERE id = $1", [req.params.id]);
        await pool.query("UPDATE bookings SET status = 'confirmed' WHERE id = $1", [payments[0].booking_id]);

        res.status(200).json({ success: true, message: 'تم تأكيد الدفع بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    جلب مدفوعاتي (للطالب)
 * @route   GET /api/payments/my
 * @access  Student
 */
export const getMyPayments = async (req, res) => {
    try {
        const { rows: payments } = await pool.query(
            `SELECT p.*, c.title as course_title 
             FROM payments p
             JOIN bookings b ON p.booking_id = b.id
             JOIN courses c ON b.course_id = c.id
             WHERE p.student_id = $1
             ORDER BY p.created_at DESC`,
            [req.user.id]
        );
        res.status(200).json({ success: true, count: payments.length, data: payments.map(formatPayment) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    جلب المدفوعات المعلقة (للأدمن)
 * @route   GET /api/payments/pending-vodafone
 * @access  Admin/Accountant
 */
export const getPendingVodafonePayments = async (req, res) => {
    try {
        const { rows: payments } = await pool.query(
            `SELECT p.*, s.name as student_name, s.phone as student_phone, c.title as course_title
             FROM payments p
             JOIN students s ON p.student_id = s.id
             JOIN bookings b ON p.booking_id = b.id
             JOIN courses c ON b.course_id = c.id
             WHERE p.method = 'vodafoneCash' AND p.status = 'pending' AND p.trans_id IS NOT NULL`
        );
        res.status(200).json({ success: true, count: payments.length, data: payments.map(formatPayment) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
