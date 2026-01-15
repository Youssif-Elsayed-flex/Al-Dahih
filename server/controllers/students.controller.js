import pool from '../config/db.pg.js';

// Helper to format student object
const formatStudent = (s) => ({
    _id: s.id,
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone,
    parentPhone: s.parent_phone, // SQL: parent_phone
    educationLevel: s.education_level, // SQL: education_level
    birthDate: s.birth_date, // SQL: birth_date
    avatar: s.avatar,
    isActive: s.is_active,
    createdAt: s.created_at,
    updatedAt: s.updated_at
});

/**
 * @desc    الحصول على الملف الشخصي للطالب
 * @route   GET /api/students/my-profile
 * @access  Student
 */
export const getMyProfile = async (req, res) => {
    try {
        const { rows: students } = await pool.query('SELECT * FROM students WHERE id = $1', [req.user.id]);
        if (students.length === 0) return res.status(404).json({ success: false, message: 'الطالب غير موجود' });
        res.status(200).json({ success: true, data: formatStudent(students[0]) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    تحديث الملف الشخصي للطالب
 * @route   PATCH /api/students/update-profile
 * @access  Student
 */
export const updateMyProfile = async (req, res) => {
    // Frontend sends camelCase
    const { name, phone, parentPhone, birthDate, educationLevel } = req.body;
    try {
        await pool.query(
            'UPDATE students SET name = $1, phone = $2, parent_phone = $3, birth_date = $4, education_level = $5 WHERE id = $6',
            [name, phone, parentPhone, birthDate, educationLevel, req.user.id]
        );
        res.status(200).json({ success: true, message: 'تم تحديث الملف الشخصي بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    الحصول على جميع الطلاب
 * @route   GET /api/students
 * @access  Admin
 */
export const getAllStudents = async (req, res) => {
    try {
        const { rows: students } = await pool.query('SELECT * FROM students ORDER BY created_at DESC');
        res.status(200).json({ success: true, count: students.length, data: students.map(formatStudent) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    تغيير حالة حساب الطالب
 * @route   PATCH /api/students/:id/toggle-status
 * @access  Admin
 */
export const toggleStudentStatus = async (req, res) => {
    const { isActive } = req.body;
    try {
        await pool.query('UPDATE students SET is_active = $1 WHERE id = $2', [isActive, req.params.id]);
        res.status(200).json({ success: true, message: 'تم تغيير حالة الحساب بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    حذف طالب
 * @route   DELETE /api/students/:id
 * @access  Admin
 */
export const deleteStudent = async (req, res) => {
    try {
        await pool.query('DELETE FROM students WHERE id = $1', [req.params.id]);
        res.status(200).json({ success: true, message: 'تم حذف الطالب بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
