import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'dahih_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const connectMySQL = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL متصل بنجاح');
        connection.release();
        return true;
    } catch (error) {
        console.error(`❌ خطأ في الاتصال بـ MySQL: ${error.message}`);
        return false;
    }
};

export default pool;
