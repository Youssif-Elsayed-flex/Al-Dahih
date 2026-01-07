import pool from '../config/db.mysql.js';

/**
 * @desc    الحصول على الملف الشخصي للطالب
 * @route   GET /api/students/my-profile
 * @access  Student
 */
export const getMyProfile = async (req, res) => {
    try {
        const [students] = await pool.execute('SELECT * FROM students WHERE id = ?', [req.user.id]);
        if (students.length === 0) return res.status(404).json({ success: false, message: 'الطالب غير موجود' });
        res.status(200).json({ success: true, data: students[0] });
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
    const { name, phone, parent_phone, birth_date, education_level } = req.body;
    try {
        await pool.execute(
            'UPDATE students SET name = ?, phone = ?, parent_phone = ?, birth_date = ?, education_level = ? WHERE id = ?',
            [name, phone, parent_phone, birth_date, education_level, req.user.id]
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
        const [students] = await pool.execute('SELECT * FROM students ORDER BY created_at DESC');
        res.status(200).json({ success: true, count: students.length, data: students });
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
        await pool.execute('UPDATE students SET is_active = ? WHERE id = ?', [isActive, req.params.id]);
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
        await pool.execute('DELETE FROM students WHERE id = ?', [req.params.id]);
        res.status(200).json({ success: true, message: 'تم حذف الطالب بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
