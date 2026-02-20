const mysql = require('mysql2/promise');

async function test() {
    const pool = mysql.createPool({
        host: '64.23.228.145',
        user: 'appuser',
        password: 'AppSegura_2025!',
        database: 'multirepuestosrg',
    });

    try {
        const [rows, fields] = await pool.query('DESCRIBE cierres_caja');
        console.log(rows);
        process.exit(0);
    } catch (e) {
        console.log("ERROR", e);
        process.exit(1);
    }
}
test();
