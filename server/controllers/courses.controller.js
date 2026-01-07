import pool from '../config/db.mysql.js';

/**
 * @desc    الحصول على جميع الدورات
 * @route   GET /api/courses
 * @access  Public
 */
export const getCourses = async (req, res) => {
    try {
        const { isActive } = req.query;
        let query = 'SELECT * FROM courses';
        const params = [];

        if (isActive !== undefined) {
            query += ' WHERE is_active = ?';
            params.push(isActive === 'true' ? 1 : 0);
        } else {
            query += ' WHERE is_active = 1';
        }

        query += ' ORDER BY created_at DESC';

        const [courses] = await pool.execute(query, params);
        res.status(200).json({ success: true, count: courses.length, data: courses });
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
        const [courses] = await pool.execute('SELECT * FROM courses WHERE id = ?', [req.params.id]);
        if (courses.length === 0) {
            return res.status(404).json({ success: false, message: 'الدورة غير موجودة' });
        }
        res.status(200).json({ success: true, data: courses[0] });
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
        const [result] = await pool.execute(
            'INSERT INTO courses (title, description, price_per_month, days_per_week, start_at, end_at, max_students, teacher_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, price_per_month, days_per_week, start_at, end_at, max_students, teacher_id]
        );
        res.status(201).json({ success: true, message: 'تم إنشاء الدورة بنجاح', data: { id: result.insertId } });
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
        await pool.execute(
            'UPDATE courses SET title = ?, description = ?, price_per_month = ?, days_per_week = ?, start_at = ?, end_at = ?, max_students = ?, teacher_id = ?, is_active = ? WHERE id = ?',
            [title, description, price_per_month, days_per_week, start_at, end_at, max_students, teacher_id, is_active, req.params.id]
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
        await pool.execute('DELETE FROM courses WHERE id = ?', [req.params.id]);
        res.status(200).json({ success: true, message: 'تم حذف الدورة بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
