const mysql = require('mysql2/promise');
require('dotenv').config({ path: __dirname + '/../.env' });

async function runMigration() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'appuser',
        password: process.env.DB_PASSWORD || 'AppSegura_2025!',
        database: process.env.DB_DATABASE || 'multirepuestosrg',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        console.log("Conectando a BD...");

        // 1. Obtener facturas que tienen monto_abonado > 0
        const [facturas] = await pool.query(`
            SELECT id, numero_factura, proveedor, monto_abonado, fecha_emision, estado
            FROM facturas_proveedores
            WHERE monto_abonado > 0
        `);

        console.log(`Se encontraron ${facturas.length} facturas con abonos previos.`);

        let inserted = 0;

        for (const fact of facturas) {
            // Verificar si YA tiene abonos en la tabla nueva
            const [abonos] = await pool.query(`
                SELECT id FROM abonos_proveedores WHERE id_factura = ?
            `, [fact.id]);

            if (abonos.length === 0) {
                // Esta factura tiene pagos previos pero no están en la tabla nueva.
                // Insertaremos un abono "sintético" de migración
                // Usaremos la fecha_emision y el estado para saber cuándo se pagó (aproximado).
                // Como no tenemos la fecha real de pago, usaremos la de emisión como referencia o NOW().
                const fechaAbono = fact.fecha_emision;

                await pool.query(`
                    INSERT INTO abonos_proveedores (id_factura, monto, metodo_pago, referencia, fecha)
                    VALUES (?, ?, 'EFECTIVO', 'Migración (Histórico)', ?)
                `, [fact.id, fact.monto_abonado, fechaAbono]);

                inserted++;
                console.log(`Migrado pago de factura #${fact.numero_factura} (${fact.proveedor}) -> C$${fact.monto_abonado}`);
            }
        }

        console.log(`=== MIGRACIÓN COMPLETADA. Se insertaron ${inserted} registros históricos. ===`);

    } catch (err) {
        console.error("Error en migración:", err);
    } finally {
        await pool.end();
    }
}

runMigration();
