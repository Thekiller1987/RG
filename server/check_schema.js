const pool = require('./src/config/db.js');
const fs = require('fs');

async function checkSchema() {
    try {
        const [rows] = await pool.query('DESCRIBE productos');
        fs.writeFileSync('schema_output_final.txt', JSON.stringify(rows, null, 2));
        console.log('Schema written to schema_output_final.txt');
        process.exit(0);
    } catch (err) {
        console.error('Error fetching schema:', err);
        process.exit(1);
    }
}

checkSchema();
