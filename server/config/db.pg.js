import pg from 'pg';
const { Pool } = pg;

// Connection string from environment or hardcoded as provided
// Note: In production, ALWAYS use environment variables.
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Ush71xBFcCOj@ep-spring-silence-a4ky7le0-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false // Neon requires SSL; check if strict verification is needed (often 'require' in string handles it, but node-pg needs this too sometimes)
    }
});

export const query = (text, params) => pool.query(text, params);

export const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ PostgreSQL متصل بنجاح');
        client.release();
        return true;
    } catch (error) {
        console.error('❌ خطأ في الاتصال بـ PostgreSQL:', error.message);
        return false;
    }
};

export default pool;
