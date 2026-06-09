const db = require('./src/config/db');

async function testUpdatedBi() {
    try {
        console.log('1. Probando consulta de ventas inusualmente altas con GROUP_CONCAT...');
        const thresholdHighSale = 800;
        const [highSalesResult] = await db.query(`
            SELECT 
                v.id_venta, 
                v.total_venta, 
                DATE_FORMAT(v.fecha, '%H:%i') AS hora, 
                u.nombre_usuario,
                GROUP_CONCAT(CONCAT(p.nombre, ' (x', dv.cantidad, ')') SEPARATOR ', ') AS productos
            FROM ventas v
            JOIN usuarios u ON v.id_usuario = u.id_usuario
            JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
            JOIN productos p ON dv.id_producto = p.id_producto
            WHERE v.estado = 'COMPLETADA' AND v.total_venta > ?
            GROUP BY v.id_venta, u.nombre_usuario, v.fecha
            ORDER BY v.fecha DESC
            LIMIT 2;
        `, [thresholdHighSale]);
        console.log('Ventas altas result:', highSalesResult);

        console.log('2. Probando distribución de métodos de pago...');
        const [paymentDistributionResult] = await db.query(`
            SELECT 
                COALESCE(metodo_pago, 'Efectivo') AS metodo, 
                SUM(total_venta) AS total
            FROM ventas
            WHERE estado = 'COMPLETADA' AND fecha >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY metodo;
        `);
        console.log('Payment distribution:', paymentDistributionResult);

        console.log('3. Probando ticket promedio...');
        const [avgTicketResult] = await db.query(`
            SELECT COALESCE(AVG(total_venta), 0) AS ticket_promedio FROM ventas WHERE estado = 'COMPLETADA'
        `);
        console.log('Ticket promedio:', avgTicketResult[0]?.ticket_promedio);

        console.log('🎉 TODAS LAS NUEVAS CONSULTAS COMPILAN Y CORREN PERFECTAMENTE.');
    } catch (e) {
        console.error('❌ ERROR EN CONSULTA:', e.message);
        console.error(e);
    } finally {
        process.exit(0);
    }
}

testUpdatedBi();
