const pool = require('./src/config/db.js');
const fs = require('fs');

async function listTables() {
    try {
        const [rows] = await pool.query('SHOW TABLES');
        fs.writeFileSync('tables.txt', JSON.stringify(rows, null, 2));
        console.log('Tables written to tables.txt');
        process.exit(0);
    } catch (err) {
        console.error('Error listing tables:', err);
        process.exit(1);
    }
}

listTables();
