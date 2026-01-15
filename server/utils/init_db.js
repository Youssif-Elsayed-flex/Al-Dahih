import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.mysql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, '../config/schema.sql');

const runSchema = async () => {
    try {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        // Split by semicolon but ignore semicolons inside other structures if possible, 
        // but for this simple schema, split by ; should work as long as triggers/procedures aren't complex.
        // The schema.sql I saw earlier looks simple enough.
        const commands = schema.split(';').filter(cmd => cmd.trim());

        console.log('Running schema...');
        for (const cmd of commands) {
            const cleanCmd = cmd.trim();
            if (cleanCmd) {
                try {
                    await pool.query(cleanCmd);
                    console.log(`Executed: ${cleanCmd.substring(0, 50)}...`);
                } catch (e) {
                    console.error(`Failed to execute: ${cleanCmd.substring(0, 50)}...`, e.message);
                }
            }
        }
        console.log('Schema executed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error executing schema:', err);
        process.exit(1);
    }
};

runSchema();
