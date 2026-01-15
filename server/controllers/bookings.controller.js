import pool from '../config/db.pg.js';

/**
 * @desc    إنشاء حجز جديد
 * @route   POST /api/bookings
 * @access  Student
 */
export const createBooking = async (req, res) => {
    const { courseId, monthYear } = req.body;
    const studentId = req.user.id;

    try {
        // Check if course exists and is active
        const { rows: courses } = await pool.query('SELECT id, is_active FROM courses WHERE id = $1', [courseId]);
        if (courses.length === 0) {
            return res.status(404).json({ success: false, message: 'الدورة غير موجودة' });
        }
        if (!courses[0].is_active) {
            return res.status(400).json({ success: false, message: 'الدورة غير متاحة حاليًا' });
        }

        // Check for existing booking
        const { rows: existing } = await pool.query(
            'SELECT id FROM bookings WHERE student_id = $1 AND course_id = $2 AND month_year = $3',
            [studentId, courseId, monthYear]
        );
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'لديك حجز مسبق لهذه الدورة في هذا الشهر' });
        }

        const { rows } = await pool.query(
            'INSERT INTO bookings (student_id, course_id, month_year, status) VALUES ($1, $2, $3, $4) RETURNING id',
            [studentId, courseId, monthYear, 'pending']
        );

        res.status(201).json({
            success: true,
            message: 'تم استلام طلب الحجز بنجاح',
            data: { id: rows[0].id, status: 'pending' }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم', error: error.message });
    }
};

/**
 * @desc    جلب حجوزاتي (للطالب)
 * @route   GET /api/bookings/my
 * @access  Student
 */
export const getMyBookings = async (req, res) => {
    try {
        const { rows: bookings } = await pool.query(
            `SELECT b.id, b.student_id, b.course_id, b.month_year, b.status, b.created_at,
                    c.title, c.description, c.price_per_month, c.cover_image
             FROM bookings b
             JOIN courses c ON b.course_id = c.id
             WHERE b.student_id = $1
             ORDER BY b.created_at DESC`,
            [req.user.id]
        );

        const formatted = bookings.map(b => ({
            _id: b.id,
            status: b.status,
            monthYear: b.month_year,
            createdAt: b.created_at,
            course: {
                _id: b.course_id,
                title: b.title,
                description: b.description,
                pricePerMonth: b.price_per_month,
                coverImage: b.cover_image
            }
        }));

        res.status(200).json({ success: true, count: formatted.length, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم', error: error.message });
    }
};

/**
 * @desc    جلب كل الحجوزات (للأدمن)
 * @route   GET /api/bookings
 * @access  Admin/Accountant
 */
export const getAllBookings = async (req, res) => {
    try {
        const { rows: bookings } = await pool.query(
            `SELECT b.id, b.student_id, b.course_id, b.month_year, b.status, b.created_at,
                    s.name as student_name, s.email as student_email,
                    c.title as course_title
             FROM bookings b
             JOIN students s ON b.student_id = s.id
             JOIN courses c ON b.course_id = c.id
             ORDER BY b.created_at DESC`
        );

        const formatted = bookings.map(b => ({
            _id: b.id,
            status: b.status,
            monthYear: b.month_year,
            createdAt: b.created_at,
            student: { name: b.student_name, email: b.student_email },
            course: { title: b.course_title }
        }));

        res.status(200).json({ success: true, count: formatted.length, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم', error: error.message });
    }
};

/**
 * @desc    تحديث حالة الحجز
 * @route   PATCH /api/bookings/:id
 * @access  Admin/Accountant
 */
export const updateBookingStatus = async (req, res) => {
    const { status } = req.body;
    try {
        await pool.query('UPDATE bookings SET status = $1 WHERE id = $2', [status, req.params.id]);
        res.status(200).json({ success: true, message: 'تم تحديث حالة الحجز بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطأ في الخادم', error: error.message });
    }
};
