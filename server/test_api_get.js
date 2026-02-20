async function test() {
    const URL = 'https://multirepuestosrg.com/api';
    try {
        const mysql = require('mysql2/promise');
        const pool = mysql.createPool({ host: '64.23.228.145', user: 'appuser', password: 'AppSegura_2025!', database: 'multirepuestosrg' });
        const [users] = await pool.query('SELECT * FROM usuarios LIMIT 1');
        if (users.length === 0) { console.log("No users found"); return; }

        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: users[0].id_usuario, rol: users[0].rol }, 'un_secreto_muy_largo_y_dificil_de_adivinar', { expiresIn: '1d' });
        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

        console.log("Fetching active boxes AFTER opening...");
        const res = await fetch(`${URL}/caja/abiertas/activas`, { headers });
        console.log("Active Boxes:", await res.json());

        process.exit(0);
    } catch (e) {
        console.log("Global Error:", e.message);
        process.exit(1);
    }
}
test();
