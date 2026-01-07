import pool from '../config/db.mysql.js';
import bcrypt from 'bcryptjs';

export const seedAdmin = async () => {
    try {
        const [rows] = await pool.execute('SELECT * FROM employees WHERE role = "admin"');

        if (rows.length === 0) {
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@eldahih.com';
            const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            await pool.execute(
                'INSERT INTO employees (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)',
                ['المدير العام', adminEmail, hashedPassword, 'admin', true]
            );

            console.log('✅ تم إنشاء حساب الأدمن الافتراضي');
        }
    } catch (error) {
        console.error('❌ خطأ في إنشاء حساب الأدمن:', error.message);
    }
};
