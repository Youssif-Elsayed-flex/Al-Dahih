import pool from '../config/db.pg.js';

// Helper to format course object
const formatCourse = (course) => ({
    _id: course.id,
    title: course.title,
    description: course.description,
    pricePerMonth: course.price_per_month, // SQL: price_per_month
    daysPerWeek: course.days_per_week,     // SQL: days_per_week
    startAt: course.start_at,
    endAt: course.end_at,
    maxStudents: course.max_students,
    teacherId: course.teacher_id,
    coverImage: course.cover_image,
    isActive: course.is_active,
    createdAt: course.created_at,
    updatedAt: course.updated_at
});

/**
 * @desc    الحصول على جميع الدورات
 * @route   GET /api/courses
 * @access  Public
 */
export const getCourses = async (req, res) => {
    try {
        const { isActive } = req.query;
        let queryText = 'SELECT * FROM courses';
        const params = [];

        if (isActive !== undefined) {
            queryText += ' WHERE is_active = $1';
            params.push(isActive === 'true');
        } else {
            queryText += ' WHERE is_active = true';
        }

        queryText += ' ORDER BY created_at DESC';

        const { rows: courses } = await pool.query(queryText, params);
        res.status(200).json({ success: true, count: courses.length, data: courses.map(formatCourse) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    جلب كورس معين
 * @route   GET /api/courses/:id
 * @access  Public
 */
export const getCourse = async (req, res) => {
    try {
        const { rows: courses } = await pool.query('SELECT * FROM courses WHERE id = $1', [req.params.id]);
        if (courses.length === 0) {
            return res.status(404).json({ success: false, message: 'الدورة غير موجودة' });
        }
        res.status(200).json({ success: true, data: formatCourse(courses[0]) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    إنشاء كورس جديد
 * @route   POST /api/courses
 * @access  Admin
 */
export const createCourse = async (req, res) => {
    const { title, description, price_per_month, days_per_week, start_at, end_at, max_students, teacher_id } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO courses (title, description, price_per_month, days_per_week, start_at, end_at, max_students, teacher_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [title, description, price_per_month, JSON.stringify(days_per_week), start_at, end_at, max_students, teacher_id]
        );
        res.status(201).json({ success: true, message: 'تم إنشاء الدورة بنجاح', data: formatCourse(rows[0]) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    تحديث دورة
 * @route   PATCH /api/courses/:id
 * @access  Admin
 */
export const updateCourse = async (req, res) => {
    const { title, description, price_per_month, days_per_week, start_at, end_at, max_students, teacher_id, is_active } = req.body;
    try {
        await pool.query(
            'UPDATE courses SET title = $1, description = $2, price_per_month = $3, days_per_week = $4, start_at = $5, end_at = $6, max_students = $7, teacher_id = $8, is_active = $9 WHERE id = $10',
            [title, description, price_per_month, JSON.stringify(days_per_week), start_at, end_at, max_students, teacher_id, is_active, req.params.id]
        );
        res.status(200).json({ success: true, message: 'تم تحديث الدورة بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    حذف دورة
 * @route   DELETE /api/courses/:id
 * @access  Admin
 */
export const deleteCourse = async (req, res) => {
    try {
        await pool.query('DELETE FROM courses WHERE id = $1', [req.params.id]);
        res.status(200).json({ success: true, message: 'تم حذف الدورة بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
