require('dotenv').config();
const db = require('./src/config/db');

async function checkCaja() {
    try {
        console.log("--- LATEST CAJA SESSIONS ---");
        const [sessions] = await db.query(`
            SELECT id, usuario_nombre, fecha_apertura, fecha_cierre, monto_inicial, 
                   final_esperado, final_real, total_ventas_efectivo, detalles_json
            FROM cierres_caja
            ORDER BY id DESC
            LIMIT 5
        `);

        sessions.forEach(s => {
            console.log(`ID: ${s.id} | User: ${s.usuario_nombre} | Opened: ${s.fecha_apertura} | Closed: ${s.fecha_cierre}`);
            console.log(`Initial: ${s.monto_inicial} | Expected: ${s.final_esperado} | Real: ${s.final_real} | Cash Sales: ${s.total_ventas_efectivo}`);

            let details = {};
            try {
                details = typeof s.detalles_json === 'string' ? JSON.parse(s.detalles_json) : (s.detalles_json || {});
            } catch (e) { details = {}; }

            const transactions = details.transactions || [];
            console.log(`Transactions Count: ${transactions.length}`);
            if (transactions.length > 0) {
                console.log("Last 2 transactions:");
                transactions.slice(-2).forEach(tx => {
                    console.log(`  - Type: ${tx.type} | Amount: ${tx.amount} | Note: ${tx.note}`);
                    console.log(`    PagoDetalles: ${JSON.stringify(tx.pagoDetalles)}`);
                });
            }
            console.log("----------------------------");
        });

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkCaja();
