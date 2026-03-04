require('dotenv').config();
const db = require('./src/config/db');
const fs = require('fs');

async function checkCaja() {
    let output = "";
    const log = (msg) => {
        console.log(msg);
        output += msg + "\n";
    };

    try {
        log("--- LATEST CAJA SESSIONS ---");
        const [sessions] = await db.query(`
            SELECT id, usuario_nombre, fecha_apertura, fecha_cierre, monto_inicial, 
                   final_esperado, final_real, total_ventas_efectivo, detalles_json
            FROM cierres_caja
            ORDER BY id DESC
            LIMIT 5
        `);

        sessions.forEach(s => {
            log(`ID: ${s.id} | User: ${s.usuario_nombre} | Opened: ${s.fecha_apertura} | Closed: ${s.fecha_cierre}`);
            log(`Initial: ${s.monto_inicial} | Expected: ${s.final_esperado} | Real: ${s.final_real} | Cash Sales: ${s.total_ventas_efectivo}`);

            let details = {};
            try {
                details = typeof s.detalles_json === 'string' ? JSON.parse(s.detalles_json) : (s.detalles_json || {});
            } catch (e) { details = {}; }

            const transactions = details.transactions || [];
            log(`Transactions Count: ${transactions.length}`);
            if (transactions.length > 0) {
                log("Last 2 transactions:");
                transactions.slice(-2).forEach(tx => {
                    log(`  - Type: ${tx.type} | Amount: ${tx.amount} | Note: ${tx.note}`);
                    log(`    PagoDetalles: ${JSON.stringify(tx.pagoDetalles)}`);
                });
            }
            log("----------------------------");
        });

        fs.writeFileSync('debug_output_utf8.txt', output, 'utf8');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkCaja();
