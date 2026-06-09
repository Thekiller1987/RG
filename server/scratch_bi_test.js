const db = require('./src/config/db');

async function testBi() {
    try {
        console.log('1. Probando conteo de productos...');
        const [prodCountResult] = await db.query('SELECT COUNT(*) AS total FROM productos WHERE activo = 1');
        console.log('Total productos:', prodCountResult[0]?.total);

        console.log('2. Probando promedio de margen...');
        const [marginResult] = await db.query(`
            SELECT 
                COALESCE(SUM(dv.cantidad * dv.precio_unitario), 0) AS total_ventas,
                COALESCE(SUM(dv.cantidad * p.costo), 0) AS total_costo
            FROM detalle_ventas dv
            JOIN ventas v ON dv.id_venta = v.id_venta
            JOIN productos p ON dv.id_producto = p.id_producto
            WHERE v.estado = 'COMPLETADA'
        `);
        console.log('Margen result:', marginResult[0]);

        console.log('3. Probando riesgo de estancamiento...');
        const [stagnantResult] = await db.query(`
            SELECT COUNT(*) AS total
            FROM productos p
            WHERE p.activo = 1 AND p.existencia > 0 AND p.id_producto NOT IN (
                SELECT DISTINCT dv.id_producto
                FROM detalle_ventas dv
                JOIN ventas v ON dv.id_venta = v.id_venta
                WHERE v.estado = 'COMPLETADA' AND v.fecha >= DATE_SUB(NOW(), INTERVAL 180 DAY)
            )
        `);
        console.log('Estancamiento:', stagnantResult[0]?.total);

        console.log('4. Probando ventas semanales...');
        const [weeklySalesResult] = await db.query(`
            SELECT 
                YEARWEEK(fecha, 1) AS año_semana,
                DATE_FORMAT(MIN(fecha), '%d/%m') AS etiqueta,
                SUM(total_venta) AS total
            FROM ventas
            WHERE estado = 'COMPLETADA' AND fecha >= DATE_SUB(NOW(), INTERVAL 8 WEEK)
            GROUP BY año_semana
            ORDER BY año_semana ASC;
        `);
        console.log('Ventas semanales rows count:', weeklySalesResult.length);

        console.log('5. Probando márgenes por categoría...');
        const [categoryMarginsResult] = await db.query(`
            SELECT 
                COALESCE(c.nombre, 'General') AS categoria,
                SUM(dv.cantidad * dv.precio_unitario) AS ventas_categoria,
                SUM(dv.cantidad * p.costo) AS costo_categoria
            FROM detalle_ventas dv
            JOIN ventas v ON dv.id_venta = v.id_venta
            JOIN productos p ON dv.id_producto = p.id_producto
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
            WHERE v.estado = 'COMPLETADA'
            GROUP BY p.id_categoria, c.nombre
            ORDER BY ventas_categoria DESC
            LIMIT 5;
        `);
        console.log('Márgenes por categoría rows count:', categoryMarginsResult.length);

        console.log('6. Probando promedio de ventas...');
        const [avgSaleResult] = await db.query(`
            SELECT AVG(total_venta) AS promedio FROM ventas WHERE estado = 'COMPLETADA'
        `);
        const averageSale = Number(avgSaleResult[0]?.promedio || 150);
        console.log('Promedio venta:', averageSale);

        console.log('7. Probando ventas inusualmente altas...');
        const thresholdHighSale = Math.max(800, averageSale * 3);
        const [highSalesResult] = await db.query(`
            SELECT v.id_venta, v.total_venta, DATE_FORMAT(v.fecha, '%H:%i') AS hora, u.nombre_usuario
            FROM ventas v
            JOIN usuarios u ON v.id_usuario = u.id_usuario
            WHERE v.estado = 'COMPLETADA' AND v.total_venta > ?
            ORDER BY v.fecha DESC
            LIMIT 2;
        `, [thresholdHighSale]);
        console.log('Ventas altas rows count:', highSalesResult.length);

        console.log('8. Probando descuadres de caja...');
        const [cashDiscrepancyResult] = await db.query(`
            SELECT id, diferencia, usuario_nombre, DATE_FORMAT(fecha_cierre, '%d/%m %H:%i') AS fecha_cierre_fmt
            FROM cierres_caja
            WHERE fecha_cierre IS NOT NULL AND diferencia != 0
            ORDER BY fecha_cierre DESC
            LIMIT 2;
        `);
        console.log('Descuadres caja rows count:', cashDiscrepancyResult.length);

        console.log('9. Probando stockouts...');
        const [stockoutResult] = await db.query(`
            SELECT nombre, codigo
            FROM productos
            WHERE activo = 1 AND existencia = 0
            ORDER BY id_producto DESC
            LIMIT 2;
        `);
        console.log('Stockouts rows count:', stockoutResult.length);

        console.log('🎉 TODAS LAS CONSULTAS SQL EJECUTADAS CON ÉXITO.');
    } catch (e) {
        console.error('❌ FALLÓ UNA CONSULTA:', e.message);
        console.error(e);
    } finally {
        process.exit(0);
    }
}

testBi();
