async function test() {
    try {
        const mysql = require('mysql2/promise');
        const pool = mysql.createPool({ host: '64.23.228.145', user: 'appuser', password: 'AppSegura_2025!', database: 'multirepuestosrg' });
        const [users] = await pool.query('SELECT id_usuario, nombre_usuario, rol FROM usuarios');
        console.log("USERS:", users);

        // Check their opened sessions
        const [cajas] = await pool.query('SELECT id, usuario_id, usuario_nombre, fecha_cierre FROM cierres_caja WHERE fecha_cierre IS NULL');
        console.log("ACTIVE CAJAS IN DB:", cajas);

        process.exit(0);
    } catch (e) {
        console.log("Global Error:", e.message);
        process.exit(1);
    }
}
test();
