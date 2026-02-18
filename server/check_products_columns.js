
const db = require('./src/config/db');

async function checkColumns() {
    try {
        const [rows] = await db.query("SHOW COLUMNS FROM productos");
        console.log("Columns in productos table:");
        rows.forEach(row => console.log(`- ${row.Field} (${row.Type})`));
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkColumns();
