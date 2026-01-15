import pool from './config/db.mysql.js';

async function checkSchema() {
    try {
        console.log('Checking students table schema...');
        const [rows] = await pool.execute(`DESCRIBE students`);
        console.table(rows);
        process.exit(0);
    } catch (error) {
        console.error('Error checking schema:', error.message);
        process.exit(1);
    }
}

checkSchema();
