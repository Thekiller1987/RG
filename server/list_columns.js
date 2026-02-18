
const fs = require('fs');
const db = require('./src/config/db');

async function listColumns() {
    try {
        const [rows] = await db.query("SHOW COLUMNS FROM productos");
        const output = rows.map(r => `${r.Field} (${r.Type})`).join('\n');
        fs.writeFileSync('columns.txt', output);
        console.log("Columns written to columns.txt");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

listColumns();
