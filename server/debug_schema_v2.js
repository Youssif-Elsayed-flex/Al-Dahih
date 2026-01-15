import pool from './config/db.mysql.js';

async function checkSchema() {
    try {
        console.log('START_CHECK');
        const [rows] = await pool.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'students' AND TABLE_SCHEMA = 'dahih_db'
        `);
        console.log(JSON.stringify(rows, null, 2));
        console.log('END_CHECK');
        process.exit(0);
    } catch (error) {
        console.error('ERROR:', error.message);
        process.exit(1);
    }
}

checkSchema();
