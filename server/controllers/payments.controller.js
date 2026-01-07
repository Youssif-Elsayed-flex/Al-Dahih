import pool from '../config/db.mysql.js';

/**
 * @desc    بدء دفع بفودافون كاش
 * @route   POST /api/payments/vodafone-cash
 * @access  Student
 */
export const initiateVodafoneCash = async (req, res) => {
    const { bookingId } = req.body;
    try {
        const [bookings] = await pool.execute(
            'SELECT b.*, c.price_per_month, c.title FROM bookings b JOIN courses c ON b.course_id = c.id WHERE b.id = ?',
            [bookingId]
        );
        if (bookings.length === 0) return res.status(404).json({ success: false, message: 'الحجز غير موجود' });

        const booking = bookings[0];
        const [result] = await pool.execute(
            'INSERT INTO payments (student_id, booking_id, amount, method, status) VALUES (?, ?, ?, "vodafoneCash", "pending")',
            [req.user.id, bookingId, booking.price_per_month]
        );

        res.status(201).json({
            success: true,
            data: { paymentId: result.insertId, amount: booking.price_per_month, vodafoneNumber: '01012345678' }
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
        await pool.execute('UPDATE payments SET trans_id = ? WHERE id = ? AND student_id = ?', [transId, paymentId, req.user.id]);
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
        const [payments] = await pool.execute('SELECT booking_id FROM payments WHERE id = ?', [req.params.id]);
        if (payments.length === 0) return res.status(404).json({ success: false, message: 'عملية الدفع غير موجودة' });

        await pool.execute('UPDATE payments SET status = "paid", paid_at = NOW() WHERE id = ?', [req.params.id]);
        await pool.execute('UPDATE bookings SET status = "confirmed" WHERE id = ?', [payments[0].booking_id]);

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
        const [payments] = await pool.execute(
            `SELECT p.*, c.title as course_title 
             FROM payments p
             JOIN bookings b ON p.booking_id = b.id
             JOIN courses c ON b.course_id = c.id
             WHERE p.student_id = ?
             ORDER BY p.created_at DESC`,
            [req.user.id]
        );
        res.status(200).json({ success: true, count: payments.length, data: payments });
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
        const [payments] = await pool.execute(
            `SELECT p.*, s.name as student_name, s.phone as student_phone, c.title as course_title
             FROM payments p
             JOIN students s ON p.student_id = s.id
             JOIN bookings b ON p.booking_id = b.id
             JOIN courses c ON b.course_id = c.id
             WHERE p.method = "vodafoneCash" AND p.status = "pending" AND p.trans_id IS NOT NULL`
        );
        res.status(200).json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
