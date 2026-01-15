import pool from '../config/db.pg.js';
import bcrypt from 'bcryptjs';

export const seedAdmin = async () => {
    try {
        const { rows } = await pool.query('SELECT * FROM employees WHERE email = $1', ['admin@daheh.com']);

        if (rows.length === 0) {
            const adminEmail = 'admin@daheh.com';
            const adminPassword = 'admin123';
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            await pool.query(
                'INSERT INTO employees (name, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5)',
                ['المدير العام', adminEmail, hashedPassword, 'admin', true]
            );

            console.log('✅ تم إنشاء حساب الأدمن: admin@daheh.com / admin123');
        } else {
            console.log('✅ حساب الأدمن موجود مسبقاً: admin@daheh.com');
        }
    } catch (error) {
        console.error('❌ خطأ في إنشاء حساب الأدمن:', error.message);
    }
};
