const pool = require('./src/config/db');

(async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM business_config WHERE id = 1');
        console.log('DATABASE CONFIG:', JSON.stringify(rows[0], null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
