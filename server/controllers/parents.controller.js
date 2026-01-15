import pool from '../config/db.pg.js';

const formatStudent = (s) => ({
    _id: s.id,
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone,
    parentPhone: s.parent_phone,
    educationLevel: s.education_level,
    birthDate: s.birth_date,
    avatar: s.avatar,
    isActive: s.is_active,
    createdAt: s.created_at
});

const formatParent = (p) => ({
    _id: p.id,
    id: p.id,
    name: p.name,
    email: p.email,
    phone: p.phone,
    isActive: p.is_active,
    createdAt: p.created_at
});

export const getMyChildren = async (req, res) => {
    try {
        const { rows: children } = await pool.query(
            `SELECT s.* FROM students s
             JOIN parent_students ps ON s.id = ps.student_id
             WHERE ps.parent_id = $1`,
            [req.user.id]
        );
        res.status(200).json({ success: true, count: children.length, data: children.map(formatStudent) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getChildPayments = async (req, res) => {
    try {
        const { rows: isLinked } = await pool.query(
            'SELECT 1 FROM parent_students WHERE parent_id = $1 AND student_id = $2',
            [req.user.id, req.params.studentId]
        );
        if (isLinked.length === 0) {
            return res.status(403).json({ success: false, message: 'هذا الطالب ليس من أبنائك' });
        }

        const { rows: payments } = await pool.query(
            `SELECT p.*, c.title as course_title 
             FROM payments p
             JOIN bookings b ON p.booking_id = b.id
             JOIN courses c ON b.course_id = c.id
             WHERE p.student_id = $1
             ORDER BY p.created_at DESC`,
            [req.params.studentId]
        );
        const formatted = payments.map(p => ({
            _id: p.id,
            amount: p.amount,
            method: p.method,
            status: p.status,
            createdAt: p.created_at,
            paidAt: p.paid_at,
            courseTitle: p.course_title
        }));
        res.status(200).json({ success: true, count: formatted.length, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getChildAttendance = async (req, res) => {
    try {
        const { rows: isLinked } = await pool.query(
            'SELECT 1 FROM parent_students WHERE parent_id = $1 AND student_id = $2',
            [req.user.id, req.params.studentId]
        );
        if (isLinked.length === 0) {
            return res.status(403).json({ success: false, message: 'هذا الطالب ليس من أبنائك' });
        }

        const { rows: attendance } = await pool.query(
            `SELECT a.*, c.title as course_title
             FROM attendance a
             JOIN courses c ON a.course_id = c.id
             WHERE a.student_id = $1
             ORDER BY a.date DESC`,
            [req.params.studentId]
        );
        const formatted = attendance.map(a => ({
            _id: a.id,
            date: a.date,
            status: a.status,
            courseTitle: a.course_title
        }));
        res.status(200).json({ success: true, count: formatted.length, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getChildCourses = async (req, res) => {
    try {
        const { rows: isLinked } = await pool.query(
            'SELECT 1 FROM parent_students WHERE parent_id = $1 AND student_id = $2',
            [req.user.id, req.params.studentId]
        );
        if (isLinked.length === 0) {
            return res.status(403).json({ success: false, message: 'هذا الطالب ليس من أبنائك' });
        }

        const { rows: bookings } = await pool.query(
            `SELECT b.*, c.title as course_title, c.description, c.price_per_month, c.cover_image
             FROM bookings b
             JOIN courses c ON b.course_id = c.id
             WHERE b.student_id = $1 AND b.status = 'confirmed'`,
            [req.params.studentId]
        );

        const formatted = bookings.map(b => ({
            _id: b.id,
            courseId: b.course_id,
            courseTitle: b.course_title,
            description: b.description,
            pricePerMonth: b.price_per_month,
            coverImage: b.cover_image,
            monthYear: b.month_year
        }));

        res.status(200).json({ success: true, count: formatted.length, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const linkStudentToParent = async (req, res) => {
    const { studentEmail } = req.body;
    try {
        const { rows: students } = await pool.query('SELECT id FROM students WHERE email = $1', [studentEmail]);
        if (students.length === 0) {
            return res.status(404).json({ success: false, message: 'الطالب غير موجود' });
        }

        const studentId = students[0].id;

        const { rows: existing } = await pool.query(
            'SELECT 1 FROM parent_students WHERE parent_id = $1 AND student_id = $2',
            [req.user.id, studentId]
        );
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'الطالب مرتبط بك بالفعل' });
        }

        await pool.query(
            'INSERT INTO parent_students (parent_id, student_id) VALUES ($1, $2)',
            [req.user.id, studentId]
        );

        res.status(201).json({ success: true, message: 'تم ربط الطالب بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const unlinkStudentFromParent = async (req, res) => {
    try {
        const { rows } = await pool.query(
            'DELETE FROM parent_students WHERE parent_id = $1 AND student_id = $2 RETURNING *',
            [req.user.id, req.params.studentId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'الطالب غير مرتبط بك' });
        }

        res.status(200).json({ success: true, message: 'تم إلغاء ربط الطالب بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllParents = async (req, res) => {
    try {
        const { rows: parents } = await pool.query('SELECT id, name, email, phone, is_active, created_at FROM parents ORDER BY created_at DESC');
        res.status(200).json({ success: true, count: parents.length, data: parents.map(formatParent) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getParentById = async (req, res) => {
    try {
        const { rows: parents } = await pool.query('SELECT id, name, email, phone, is_active, created_at FROM parents WHERE id = $1', [req.params.id]);
        if (parents.length === 0) {
            return res.status(404).json({ success: false, message: 'ولي الأمر غير موجود' });
        }

        const { rows: children } = await pool.query(
            `SELECT s.id, s.name, s.email FROM students s
             JOIN parent_students ps ON s.id = ps.student_id
             WHERE ps.parent_id = $1`,
            [req.params.id]
        );

        const parent = formatParent(parents[0]);
        parent.children = children.map(c => ({ _id: c.id, id: c.id, name: c.name, email: c.email }));

        res.status(200).json({ success: true, data: parent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
