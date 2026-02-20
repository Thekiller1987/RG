const mysql = require('mysql2/promise');

async function test() {
    const pool = mysql.createPool({
        host: '64.23.228.145',
        user: 'appuser',
        password: 'AppSegura_2025!',
        database: 'multirepuestosrg',
    });

    try {
        const userId = 1;
        const usuarioNombre = 'Test User';
        const openedAt = new Date().toISOString();
        const initialAmount = 0;
        const initialJson = JSON.stringify({ transactions: [], session_id_legacy: `caja-${userId}-${Date.now()}`, tasaDolar: 36.6 });

        const [result] = await pool.query(`
      INSERT INTO cierres_caja (
        fecha_apertura, fecha_cierre, usuario_id, usuario_nombre, 
        monto_inicial, final_esperado, final_real, diferencia,
        total_ventas_efectivo, total_ventas_tarjeta, total_ventas_transferencia, total_ventas_credito,
        total_entradas, total_salidas, detalles_json
      ) VALUES (?, NULL, ?, ?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0, ?)
    `, [
            new Date(openedAt), userId, usuarioNombre,
            initialAmount, initialJson
        ]);

        console.log("INSERT SUCCESS", result);
        process.exit(0);
    } catch (e) {
        console.log("INSERT ERROR:", e.message);
        process.exit(1);
    }
}
test();
