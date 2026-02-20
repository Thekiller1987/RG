async function test() {
    const URL = 'https://multirepuestosrg.com/api';
    try {
        const mysql = require('mysql2/promise');
        const pool = mysql.createPool({ host: '64.23.228.145', user: 'appuser', password: 'AppSegura_2025!', database: 'multirepuestosrg' });
        const [users] = await pool.query('SELECT * FROM usuarios LIMIT 1');
        if (users.length === 0) { console.log("No users found"); return; }

        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: users[0].id_usuario, rol: users[0].rol }, 'un_secreto_muy_largo_y_dificil_de_adivinar', { expiresIn: '1d' });

        // 2. Fetch Active boxes
        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
        console.log("Fetching active boxes...");
        const res1 = await fetch(`${URL}/caja/abiertas/activas`, { headers });
        console.log("Active Boxes:", await res1.json());

        // 3. Try to open a box
        console.log("Opening box for User ID:", users[0].id_usuario);
        const sessionData = {
            userId: users[0].id_usuario,
            openedAt: new Date().toISOString(),
            openedBy: { id: users[0].id_usuario, name: users[0].nombre_usuario },
            initialAmount: 100,
            tasaDolar: 36.6
        };

        const res2 = await fetch(`${URL}/caja/session/open`, { method: 'POST', headers, body: JSON.stringify(sessionData) });
        const text2 = await res2.text();
        console.log("Open Box Res:", res2.status, text2);

        process.exit(0);
    } catch (e) {
        console.log("Global Error:", e.message);
        process.exit(1);
    }
}
test();
