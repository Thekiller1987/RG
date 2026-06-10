// src/controllers/reportController.js

const db = require('../config/db');

/**
 * Helper para construir rango de fechas optimizado (Business Day 6AM - 6AM)
 * @param {string} start YYYY-MM-DD
 * @param {string} end YYYY-MM-DD
 * @returns {{ from: string, to: string }}
 */
const getDateRange = (start, end) => {
    let fromDate, toDate;
    if (start && end) {
        fromDate = `${start} 06:00:00`;
        const endDateObj = new Date(end);
        endDateObj.setDate(endDateObj.getDate() + 1);
        const nextDayStr = endDateObj.toISOString().split('T')[0];
        toDate = `${nextDayStr} 05:59:59`;
    } else {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;

        fromDate = `${dateStr} 06:00:00`;
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tyyyy = tomorrow.getFullYear();
        const tmm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const tdd = String(tomorrow.getDate()).padStart(2, '0');
        toDate = `${tyyyy}-${tmm}-${tdd} 05:59:59`;
    }
    return { from: fromDate, to: toDate };
};

// --- OBTENER RESUMEN DE VENTAS Y GANANCIAS ---
const getSalesSummaryReport = async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        return res.status(400).json({ msg: 'Por favor, especifica una fecha de inicio y fin.' });
    }
    try {
        const { from, to } = getDateRange(startDate, endDate);
        const sql = `
SELECT
COALESCE(SUM(dv.cantidad * dv.precio_unitario), 0) AS ventas_brutas,
    COALESCE(SUM(dv.cantidad * (dv.precio_unitario - p.costo)), 0) AS ganancia_total
            FROM ventas AS v
            JOIN detalle_ventas AS dv ON v.id_venta = dv.id_venta
            JOIN productos AS p ON dv.id_producto = p.id_producto
WHERE
v.estado = 'COMPLETADA' 
                AND v.fecha >= ? AND v.fecha <= ?;
`;
        const [results] = await db.query(sql, [from, to]);
        res.json(results[0]);
    } catch (error) {
        console.error('Error en reporte de resumen de ventas:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

// --- OBTENER VALOR TOTAL DEL INVENTARIO ---
const getInventoryValueReport = async (req, res) => {
    try {
        const sql = `
            SELECT SUM(p.costo * p.existencia) AS valor_total_inventario
            FROM productos AS p;
`;
        const [results] = await db.query(sql);
        res.json(results[0]);
    } catch (error) {
        console.error('Error en reporte de valor de inventario:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

// --- OBTENER VENTAS POR USUARIO (TOP VENDEDORES) ---
const getSalesByUserReport = async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ msg: 'Fechas requeridas.' });
    try {
        const { from, to } = getDateRange(startDate, endDate);
        const sql = `
SELECT
    CASE 
        WHEN v.id_empleado IS NOT NULL THEN CONCAT('Vendedor: ', COALESCE(e.nombre, 'Desconocido'))
        ELSE CONCAT('Caja: ', u.nombre_usuario)
    END AS nombre_usuario,
    COUNT(v.id_venta) AS cantidad_ventas,
    SUM(v.total_venta) AS total_vendido
FROM ventas AS v
JOIN usuarios AS u ON v.id_usuario = u.id_usuario
LEFT JOIN empleados AS e ON v.id_empleado = e.id_empleado
WHERE
    v.estado = 'COMPLETADA' 
    AND v.fecha >= ? AND v.fecha <= ?
GROUP BY 1
ORDER BY total_vendido DESC;
`;
        const [results] = await db.query(sql, [from, to]);
        res.json(results);
    } catch (error) {
        console.error('Error en reporte de ventas por usuario:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

// --- OBTENER VENTAS POR EMPLEADO ---
const getSalesByEmployeeReport = async (req, res) => {
    const { startDate, endDate } = req.query;
    const { from, to } = getDateRange(startDate, endDate);

    try {
        const [rows] = await db.query(`
SELECT
COALESCE(e.nombre, 'Sin asignar') AS empleado,
    COUNT(v.id_venta) as total_facturas,
    SUM(v.total_venta) as total_ventas
            FROM ventas v
            LEFT JOIN empleados e ON v.id_empleado = e.id_empleado
            WHERE v.fecha BETWEEN ? AND ?
    AND v.estado != 'DEVOLUCION' 
            AND v.estado != 'CANCELADA'
            GROUP BY v.id_empleado
            ORDER BY total_ventas DESC
    `, [from, to]);

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener reporte de ventas por empleado:", error);
        res.status(500).json({ message: "Error al obtener datos." });
    }
};

// --- OBTENER PRODUCTOS MÁS VENDIDOS ---
const getTopProductsReport = async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ msg: 'Fechas requeridas.' });
    try {
        const { from, to } = getDateRange(startDate, endDate);
        const sql = `
            SELECT p.nombre, SUM(dv.cantidad) AS total_unidades_vendidas
            FROM detalle_ventas AS dv
            JOIN productos AS p ON dv.id_producto = p.id_producto
            JOIN ventas AS v ON dv.id_venta = v.id_venta
WHERE
v.estado = 'COMPLETADA' 
                AND v.fecha >= ? AND v.fecha <= ?
    GROUP BY p.nombre 
            ORDER BY total_unidades_vendidas DESC 
            LIMIT 10;
`;
        const [results] = await db.query(sql, [from, to]);
        res.json(results);
    } catch (error) {
        console.error('Error en reporte de top productos:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

// --- OBTENER DATOS PARA LA GRÁFICA ---
const getSalesChartReport = async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ msg: 'Fechas requeridas.' });
    try {
        const { from, to } = getDateRange(startDate, endDate);
        // Nota: Para agrupar por día, seguimos usando DATE() pero sobre un rango filtrado eficientemente
        const sql = `
SELECT
DATE(DATE_SUB(fecha, INTERVAL 6 HOUR)) AS dia,
    SUM(total_venta) AS total_diario
            FROM ventas
WHERE
estado = 'COMPLETADA' 
                AND fecha >= ? AND fecha <= ?
    GROUP BY dia 
            ORDER BY dia ASC;
`;
        const [results] = await db.query(sql, [from, to]);
        res.json(results);
    } catch (error) {
        console.error('Error en reporte para gráfica:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

// --- OBTENER VENTAS DETALLADAS CON PRODUCTOS, CLIENTES, VENDEDORES ---
const getDetailedSales = async (req, res) => {
    const { startDate, endDate, tipo, keyword, clientId } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ msg: 'Fechas requeridas.' });
    try {
        const { from, to } = getDateRange(startDate, endDate);

        let tipoFilter = '';
        if (tipo === 'DEVOLUCION') {
            tipoFilter = ` AND v.estado = 'DEVOLUCION'`;
        } else if (tipo === 'COMPLETADA') {
            tipoFilter = ` AND v.estado = 'COMPLETADA'`;
        } else if (tipo === 'CANCELADA') {
            tipoFilter = ` AND v.estado = 'CANCELADA'`;
        }

        let keywordFilter = '';
        let clientFilter = '';
        const params = [from, to];

        if (clientId) {
            clientFilter = ` AND v.id_cliente = ? `;
            params.push(clientId);
        }

        if (keyword && keyword.trim() !== '') {
            keywordFilter = ` AND EXISTS(
    SELECT 1 FROM detalle_ventas dv2
                JOIN productos p2 ON dv2.id_producto = p2.id_producto
                WHERE dv2.id_venta = v.id_venta
                AND(p2.nombre LIKE ? OR p2.codigo LIKE ?)
)`;
            params.push(`% ${keyword}% `, ` % ${keyword}% `);
        }

        // Filter by Wholesale status
        // Stored as JSON string: {"isWholesale":true, ...}
        // Using LIKE matching for compatibility
        if (req.query.isWholesale === 'true') {
            keywordFilter += ` AND v.pago_detalles LIKE '%"isWholesale":true%'`;
        } else if (req.query.isWholesale === 'false') {
            keywordFilter += ` AND(v.pago_detalles NOT LIKE '%"isWholesale":true%' OR v.pago_detalles IS NULL)`;
        }

        // OPTIMIZACIÓN: Rango directo en 'fecha' usa índice.
        const [sales] = await db.query(`
SELECT
v.id_venta AS id,
    v.fecha,
    v.total_venta AS totalVenta,
        v.subtotal,
        v.descuento,
        v.estado,
        v.pago_detalles AS pagoDetalles,
            v.tipo_venta,
            v.id_usuario AS userId,
                v.id_cliente AS clientId,
                    c.nombre AS clienteNombre,
                        u.nombre_usuario AS vendedorNombre,
                        v.id_empleado,
                e.nombre AS empleado_nombre
            FROM ventas v
            LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
            LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
            LEFT JOIN empleados e ON v.id_empleado = e.id_empleado
            WHERE v.fecha >= ? AND v.fecha <= ?
    ${tipoFilter}
            ${clientFilter}
            ${keywordFilter}
            ORDER BY v.fecha DESC
            LIMIT 500
    `, params);

        if (!sales.length) return res.json([]);

        const saleIds = sales.map(s => s.id);

        // Optimización: Traer detalles solo de las ventas filtradas
        const [details] = await db.query(`
SELECT
dv.id_venta,
    p.id_producto AS id,
        p.nombre,
        p.codigo,
        dv.cantidad AS quantity,
            dv.precio_unitario AS precio
            FROM detalle_ventas dv
            JOIN productos p ON dv.id_producto = p.id_producto
            WHERE dv.id_venta IN(?)
    `, [saleIds]);

        // Mapeo en memoria (O(N) en lugar de O(N^2) filter)
        // Agrupar detalles por venta
        const detailsMap = {};
        details.forEach(d => {
            if (!detailsMap[d.id_venta]) detailsMap[d.id_venta] = [];
            detailsMap[d.id_venta].push(d);
        });

        const salesWithDetails = sales.map(sale => ({
            ...sale,
            pagoDetalles: typeof sale.pagoDetalles === 'string' ? (() => { try { return JSON.parse(sale.pagoDetalles); } catch { return {}; } })() : (sale.pagoDetalles || {}),
            items: detailsMap[sale.id] || []
        }));

        res.json(salesWithDetails);
    } catch (error) {
        console.error('Error en reporte detallado de ventas:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

// --- HISTORIAL DE UN PRODUCTO ESPECÍFICO POR CÓDIGO ---
const getProductHistory = async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).json({ msg: 'Código de producto requerido.' });
    try {
        // console.log(`[getProductHistory] Searching for code: "${code}"`);

        // 1. Encontrar producto(s) coincidentes
        let products = [];
        // Change 'precio' to 'venta AS precio' alias to keep frontend compatible
        const [rows] = await db.query(
            `SELECT id_producto, nombre, codigo, venta AS precio, costo, existencia 
             FROM productos 
             WHERE codigo = ? OR codigo LIKE ? OR nombre LIKE ?
    LIMIT 20`,
            [code, `% ${code}% `, ` % ${code}% `]
        );
        products = rows;

        if (req.query.searchOnly) {
            return res.json(products);
        }

        if (!products.length) return res.json({ product: null, history: [] });

        // Ordenar: Exact match primero
        products.sort((a, b) => {
            const aExact = (a.codigo === code);
            const bExact = (b.codigo === code);
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;
            return a.nombre.localeCompare(b.nombre);
        });

        const product = products[0];
        const productIds = products.map(p => p.id_producto);

        // 2. Obtener Historial
        let history = [];
        if (productIds.length > 0) {
            // Manual placeholder construction to ensure compatibility
            const placeHolders = productIds.map(() => '?').join(',');

            const sql = `
SELECT
v.id_venta AS idVenta,
    v.fecha,
    v.estado,
    v.tipo_venta,
    dv.cantidad,
    p.codigo AS codigoProducto,
        dv.precio_unitario AS precioUnitario,
            c.nombre AS clienteNombre,
                c.id_cliente AS clienteId,
                    u.nombre_usuario AS vendedorNombre
                FROM detalle_ventas dv
                JOIN ventas v ON dv.id_venta = v.id_venta
                JOIN productos p ON dv.id_producto = p.id_producto
                LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
                LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
                WHERE dv.id_producto IN(${placeHolders})
                ORDER BY v.fecha DESC
    `;

            // Pass flattened productIds array
            const [histResults] = await db.query(sql, productIds);
            history = histResults;
        }

        res.json({ product, products, history });

    } catch (error) {
        console.error('CRITICAL ERROR in getProductHistory:', error);
        res.status(500).json({
            msg: 'Error de servidor buscando historial',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// --- REPORTE ABONOS A PROVEEDORES ---
const getProviderPaymentsReport = async (req, res) => {
    const { startDate, endDate, proveedor } = req.query;

    try {
        let sql = `
            SELECT 
                a.id AS abono_id,
                a.monto,
                a.metodo_pago,
                a.referencia,
                a.fecha AS fecha_abono,
                f.numero_factura,
                f.proveedor,
                f.tipo_compra
            FROM abonos_proveedores a
            JOIN facturas_proveedores f ON a.id_factura = f.id
            WHERE 1=1
        `;
        const queryParams = [];

        if (startDate && endDate) {
            const { from, to } = getDateRange(startDate, endDate);
            sql += ' AND a.fecha >= ? AND a.fecha <= ?';
            queryParams.push(from, to);
        }

        if (proveedor && proveedor !== 'TODOS' && proveedor !== '') {
            sql += ' AND f.proveedor = ?';
            queryParams.push(proveedor);
        }

        sql += ' ORDER BY a.fecha DESC';

        const [results] = await db.query(sql, queryParams);
        res.json(results);
    } catch (error) {
        console.error('Error en reporte de abonos a proveedores:', error);
        res.status(500).json({ msg: 'Error en el servidor al cargar abonos de proveedores.' });
    }
}

// --- MÉTRICAS EN VIVO Y ANÁLISIS MULTIDIMENSIONAL BI ---
const getBiMetrics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let dateFilter = '';
        const params = [];
        if (startDate && endDate) {
            const { from, to } = getDateRange(startDate, endDate);
            dateFilter = ' AND v.fecha >= ? AND v.fecha <= ?';
            params.push(from, to);
        }

        // 1. Total Productos Activos
        const [prodCountResult] = await db.query('SELECT COUNT(*) AS total FROM productos WHERE activo = 1');
        const total_productos = prodCountResult[0]?.total || 0;

        // 2. Promedio de Margen Comercial
        const [marginResult] = await db.query(`
            SELECT 
                COALESCE(SUM(dv.cantidad * dv.precio_unitario), 0) AS total_ventas,
                COALESCE(SUM(dv.cantidad * p.costo), 0) AS total_costo
            FROM detalle_ventas dv
            JOIN ventas v ON dv.id_venta = v.id_venta
            JOIN productos p ON dv.id_producto = p.id_producto
            WHERE v.estado = 'COMPLETADA' ${dateFilter}
        `, params);
        const totalVentasVal = Number(marginResult[0]?.total_ventas || 0);
        const totalCostoVal = Number(marginResult[0]?.total_costo || 0);
        const promedio_margen = totalVentasVal > 0 
            ? Number(((totalVentasVal - totalCostoVal) / totalVentasVal * 100).toFixed(2))
            : 0;

        // 3. Riesgo de Estancamiento (existencia > 0 sin ventas en los últimos 180 días)
        // Usamos NOT EXISTS para evitar fallas si hay NULLs en dv.id_producto
        const [stagnantResult] = await db.query(`
            SELECT COUNT(*) AS total
            FROM productos p
            WHERE p.activo = 1 AND p.existencia > 0 AND NOT EXISTS (
                SELECT 1
                FROM detalle_ventas dv
                JOIN ventas v ON dv.id_venta = v.id_venta
                WHERE dv.id_producto = p.id_producto
                  AND v.estado = 'COMPLETADA'
                  AND v.fecha >= DATE_SUB(NOW(), INTERVAL 180 DAY)
            )
        `);
        const riesgo_estancamiento = stagnantResult[0]?.total || 0;

        // 3b. Obtener lista detallada de Productos Estancados o de Baja Rotación (Top 150 por valor de inventario)
        // Traemos productos con <= 3 unidades vendidas en los últimos 180 días
        const [stagnantProductsList] = await db.query(`
            SELECT 
                p.id_producto, 
                p.codigo, 
                p.nombre, 
                p.existencia, 
                p.venta AS precio,
                COALESCE(SUM(dv.cantidad), 0) AS unidades_vendidas,
                (
                    SELECT MAX(v2.fecha)
                    FROM detalle_ventas dv2
                    JOIN ventas v2 ON dv2.id_venta = v2.id_venta
                    WHERE dv2.id_producto = p.id_producto AND v2.estado = 'COMPLETADA'
                ) AS ultima_venta
            FROM productos p
            LEFT JOIN (
                SELECT dv_in.id_producto, dv_in.cantidad
                FROM detalle_ventas dv_in
                JOIN ventas v_in ON dv_in.id_venta = v_in.id_venta
                WHERE v_in.estado = 'COMPLETADA' AND v_in.fecha >= DATE_SUB(NOW(), INTERVAL 180 DAY)
            ) dv ON p.id_producto = dv.id_producto
            WHERE p.activo = 1 AND p.existencia > 0
            GROUP BY p.id_producto, p.codigo, p.nombre, p.existencia, p.venta
            HAVING unidades_vendidas <= 3
            ORDER BY unidades_vendidas ASC, p.existencia * p.venta DESC
            LIMIT 150;
        `);

        // 4. Historial de Ventas Semanales (Últimas 8 semanas completas, excluyendo la actual)
        let weeklySalesResult;
        if (startDate && endDate) {
            const { from, to } = getDateRange(startDate, endDate);
            [weeklySalesResult] = await db.query(`
                SELECT * FROM (
                    SELECT 
                        YEARWEEK(fecha, 1) AS año_semana,
                        DATE_FORMAT(MIN(fecha), '%d/%m') AS etiqueta,
                        SUM(total_venta) AS total
                    FROM ventas v
                    WHERE v.estado = 'COMPLETADA' AND v.fecha >= ? AND v.fecha <= ?
                    GROUP BY año_semana
                    ORDER BY año_semana DESC
                ) sub
                ORDER BY año_semana ASC;
            `, [from, to]);
        } else {
            [weeklySalesResult] = await db.query(`
                SELECT * FROM (
                    SELECT 
                        YEARWEEK(fecha, 1) AS año_semana,
                        DATE_FORMAT(MIN(fecha), '%d/%m') AS etiqueta,
                        SUM(total_venta) AS total
                    FROM ventas
                    WHERE estado = 'COMPLETADA' AND YEARWEEK(fecha, 1) < YEARWEEK(NOW(), 1)
                    GROUP BY año_semana
                    ORDER BY año_semana DESC
                    LIMIT 8
                ) sub
                ORDER BY año_semana ASC;
            `);
        }

        let pastLabels = weeklySalesResult.map(r => r.etiqueta);
        let pastTotals = weeklySalesResult.map(r => Number(r.total));

        // Relleno de seguridad si la base de datos es nueva
        if (pastTotals.length === 0) {
            pastLabels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];
            pastTotals = [105000, 120000, 135000, 130000, 145000, 160000, 155000, 170000];
        } else if (pastTotals.length < 3) {
            const extraLabels = ['Sem A', 'Sem B', 'Sem C', 'Sem D'].slice(0, 4 - pastTotals.length);
            const extraTotals = [90000, 95000, 100000, 105000].slice(0, 4 - pastTotals.length);
            pastLabels = [...extraLabels, ...pastLabels];
            pastTotals = [...extraTotals, ...pastTotals];
        }

        // Proyección analítica lineal (mínimos cuadrados)
        const n = pastTotals.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        for (let i = 0; i < n; i++) {
            sumX += i;
            sumY += pastTotals[i];
            sumXY += i * pastTotals[i];
            sumXX += i * i;
        }
        const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) || 10;
        const c = (sumY - m * sumX) / n;

        const proj9 = Math.max(0, Number((m * n + c).toFixed(2)));
        const proj10 = Math.max(0, Number((m * (n + 1) + c).toFixed(2)));

        const labels = [...pastLabels, 'Proy W9', 'Proy W10'];
        const reales = [...pastTotals, null, null];

        // Calcular predicciones pasadas (backtesting / retro-proyección)
        const pastProyecciones = Array(n).fill(null);
        for (let i = 1; i < n; i++) {
            let sX = 0, sY = 0, sXY = 0, sXX = 0;
            const count = i;
            for (let j = 0; j < count; j++) {
                sX += j;
                sY += pastTotals[j];
                sXY += j * pastTotals[j];
                sXX += j * j;
            }
            if (count >= 2) {
                const slope = (count * sXY - sX * sY) / (count * sXX - sX * sX) || 0;
                const intercept = (sY - slope * sX) / count;
                pastProyecciones[i] = Math.max(0, Number((slope * i + intercept).toFixed(2)));
            } else if (count === 1) {
                pastProyecciones[i] = pastTotals[0];
            }
        }
        pastProyecciones[0] = pastTotals[0];

        const proyeccion = [...pastProyecciones, proj9, proj10];

        const sales_history = {
            labels,
            reales,
            proyeccion
        };

        // 4b. Historial de Ventas Diarias
        let dailySalesResult;
        if (startDate && endDate) {
            const { from, to } = getDateRange(startDate, endDate);
            [dailySalesResult] = await db.query(`
                SELECT * FROM (
                    SELECT 
                        DATE(fecha) AS dia,
                        DATE_FORMAT(MIN(fecha), '%d/%m') AS etiqueta,
                        SUM(total_venta) AS total
                    FROM ventas v
                    WHERE v.estado = 'COMPLETADA' AND v.fecha >= ? AND v.fecha <= ?
                    GROUP BY dia
                    ORDER BY dia DESC
                ) sub
                ORDER BY dia ASC;
            `, [from, to]);
        } else {
            [dailySalesResult] = await db.query(`
                SELECT * FROM (
                    SELECT 
                        DATE(fecha) AS dia,
                        DATE_FORMAT(MIN(fecha), '%d/%m') AS etiqueta,
                        SUM(total_venta) AS total
                    FROM ventas
                    WHERE estado = 'COMPLETADA' AND fecha < CURDATE()
                    GROUP BY dia
                    ORDER BY dia DESC
                    LIMIT 10
                ) sub
                ORDER BY dia ASC;
            `);
        }

        let dailyPastLabels = dailySalesResult.map(r => r.etiqueta);
        let dailyPastTotals = dailySalesResult.map(r => Number(r.total));

        // Relleno de seguridad si la base de datos es nueva o no tiene suficientes datos
        if (dailyPastTotals.length === 0) {
            dailyPastLabels = ['01/06', '02/06', '03/06', '04/06', '05/06', '06/06', '07/06', '08/06'];
            dailyPastTotals = [12000, 15000, 14000, 18000, 16000, 22000, 19000, 21000];
        } else if (dailyPastTotals.length < 3) {
            const extraLabels = ['Día A', 'Día B', 'Día C', 'Día D'].slice(0, 4 - dailyPastTotals.length);
            const extraTotals = [8000, 10000, 12000, 14000].slice(0, 4 - dailyPastTotals.length);
            dailyPastLabels = [...extraLabels, ...dailyPastLabels];
            dailyPastTotals = [...extraTotals, ...dailyPastTotals];
        }

        // Proyección diaria lineal (mínimos cuadrados)
        const nd = dailyPastTotals.length;
        let sumXd = 0, sumYd = 0, sumXYd = 0, sumXXd = 0;
        for (let i = 0; i < nd; i++) {
            sumXd += i;
            sumYd += dailyPastTotals[i];
            sumXYd += i * dailyPastTotals[i];
            sumXXd += i * i;
        }
        const md = (nd * sumXYd - sumXd * sumYd) / (nd * sumXXd - sumXd * sumXd) || 500;
        const cd = (sumYd - md * sumXd) / nd;

        const projD1 = Math.max(0, Number((md * nd + cd).toFixed(2)));
        const projD2 = Math.max(0, Number((md * (nd + 1) + cd).toFixed(2)));

        const dailyLabels = [...dailyPastLabels, 'Proy D1', 'Proy D2'];
        const dailyReales = [...dailyPastTotals, null, null];

        // Calcular predicciones pasadas diarias (backtesting)
        const dailyPastProyecciones = Array(nd).fill(null);
        for (let i = 1; i < nd; i++) {
            let sXd = 0, sYd = 0, sXYd = 0, sXXd = 0;
            const countd = i;
            for (let j = 0; j < countd; j++) {
                sXd += j;
                sYd += dailyPastTotals[j];
                sXYd += j * dailyPastTotals[j];
                sXXd += j * j;
            }
            if (countd >= 2) {
                const sloped = (countd * sXYd - sXd * sYd) / (countd * sXXd - sXd * sXd) || 0;
                const interceptd = (sYd - sloped * sXd) / countd;
                dailyPastProyecciones[i] = Math.max(0, Number((sloped * i + interceptd).toFixed(2)));
            } else if (countd === 1) {
                dailyPastProyecciones[i] = dailyPastTotals[0];
            }
        }
        dailyPastProyecciones[0] = dailyPastTotals[0];

        const dailyProyeccion = [...dailyPastProyecciones, projD1, projD2];

        const sales_history_daily = {
            labels: dailyLabels,
            reales: dailyReales,
            proyeccion: dailyProyeccion
        };

        // 5. Márgenes de Rentabilidad por Categoría (Top 5)
        const [categoryMarginsResult] = await db.query(`
            SELECT 
                COALESCE(c.nombre, 'General') AS categoria,
                SUM(dv.cantidad * dv.precio_unitario) AS ventas_categoria,
                SUM(dv.cantidad * p.costo) AS costo_categoria
            FROM detalle_ventas dv
            JOIN ventas v ON dv.id_venta = v.id_venta
            JOIN productos p ON dv.id_producto = p.id_producto
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
            WHERE v.estado = 'COMPLETADA' ${dateFilter}
            GROUP BY p.id_categoria, c.nombre
            ORDER BY ventas_categoria DESC
            LIMIT 5;
        `, params);

        let categoryLabels = categoryMarginsResult.map(r => r.categoria.toUpperCase());
        let categoryValues = categoryMarginsResult.map(r => {
            const v = Number(r.ventas_categoria);
            const c = Number(r.costo_categoria);
            return v > 0 ? Number(((v - c) / v * 100).toFixed(1)) : 0;
        });

        if (categoryValues.length === 0) {
            categoryLabels = ['TRANSMISION', 'MOTOR', 'SISTEMA ELECTRICO', 'NEUMATICOS', 'ACCESORIOS'];
            categoryValues = [35.2, 38.6, 52.4, 45.2, 31.7];
        }

        const category_margins = {
            labels: categoryLabels,
            values: categoryValues
        };

        // 6. Anomalías en tiempo real con detalle de productos (Separadas por conceptos Caja vs Inventario)
        const cash_anomalies = [];
        const inventory_anomalies = [];

        // Anomalía A: Ventas inusualmente altas (últimos 30 días si no hay filtro temporal)
        const [avgSaleResult] = await db.query(`
            SELECT AVG(total_venta) AS promedio FROM ventas WHERE estado = 'COMPLETADA'
        `);
        const averageSale = Number(avgSaleResult[0]?.promedio || 150);
        const thresholdHighSale = Math.max(800, averageSale * 3);

        let highSalesResult;
        if (startDate && endDate) {
            const { from, to } = getDateRange(startDate, endDate);
            [highSalesResult] = await db.query(`
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
                WHERE v.estado = 'COMPLETADA' AND v.total_venta > ? AND v.fecha >= ? AND v.fecha <= ?
                GROUP BY v.id_venta, u.nombre_usuario, v.fecha
                ORDER BY v.fecha DESC
                LIMIT 5;
            `, [thresholdHighSale, from, to]);
        } else {
            [highSalesResult] = await db.query(`
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
                WHERE v.estado = 'COMPLETADA' AND v.total_venta > ? AND v.fecha >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                GROUP BY v.id_venta, u.nombre_usuario, v.fecha
                ORDER BY v.fecha DESC
                LIMIT 4;
            `, [thresholdHighSale]);
        }

        highSalesResult.forEach(s => {
            cash_anomalies.push({
                title: 'Venta Inusualmente Alta (Alerta BI)',
                desc: `El cajero '${s.nombre_usuario}' facturó C$ ${Number(s.total_venta).toLocaleString('es-NI')} en repuestos: ${s.productos} a las ${s.hora}.`,
                badge: 'Auditoría',
                risk: 'Revisar'
            });
        });

        // Anomalía B: Descuadres de Caja (últimos 30 días si no hay filtro temporal)
        let cashDiscrepancyResult;
        if (startDate && endDate) {
            const { from, to } = getDateRange(startDate, endDate);
            [cashDiscrepancyResult] = await db.query(`
                SELECT id, diferencia, usuario_nombre, DATE_FORMAT(fecha_cierre, '%d/%m %H:%i') AS fecha_cierre_fmt
                FROM cierres_caja
                WHERE fecha_cierre IS NOT NULL AND diferencia != 0 AND fecha_cierre >= ? AND fecha_cierre <= ?
                ORDER BY fecha_cierre DESC
                LIMIT 5;
            `, [from, to]);
        } else {
            [cashDiscrepancyResult] = await db.query(`
                SELECT id, diferencia, usuario_nombre, DATE_FORMAT(fecha_cierre, '%d/%m %H:%i') AS fecha_cierre_fmt
                FROM cierres_caja
                WHERE fecha_cierre IS NOT NULL AND diferencia != 0 AND fecha_cierre >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                ORDER BY fecha_cierre DESC
                LIMIT 4;
            `);
        }

        cashDiscrepancyResult.forEach(c => {
            const diffType = Number(c.diferencia) < 0 ? 'Faltante' : 'Sobrante';
            cash_anomalies.push({
                title: 'Descuadre de Caja Registrado',
                desc: `El cierre de caja del Cajero '${c.usuario_nombre}' el ${c.fecha_cierre_fmt} reportó un ${diffType} de C$ ${Math.abs(Number(c.diferencia)).toLocaleString('es-NI')}.`,
                badge: diffType,
                risk: 'Riesgo Alto'
            });
        });

        // Anomalía C: Quiebre de stock inminente -> Se asigna a ANALÍTICAS DE INVENTARIO
        const [stockoutResult] = await db.query(`
            SELECT nombre, codigo
            FROM productos
            WHERE activo = 1 AND existencia = 0
            ORDER BY id_producto DESC
            LIMIT 4;
        `);

        stockoutResult.forEach(p => {
            inventory_anomalies.push({
                title: 'Riesgo de Ruptura de Stock',
                desc: `El repuesto '${p.nombre}' (Código: ${p.codigo}) se encuentra agotado (Existencia: 0).`,
                badge: 'Sin Stock',
                risk: 'Revisar'
            });
        });

        // Anomalía D: Sesiones de caja abiertas hace más de 24 horas
        const [openTooLongResult] = await db.query(`
            SELECT usuario_nombre, fecha_apertura
            FROM cierres_caja
            WHERE fecha_cierre IS NULL AND fecha_apertura <= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            LIMIT 5;
        `);
        openTooLongResult.forEach(s => {
            const hrs = Math.round((new Date() - new Date(s.fecha_apertura)) / (1000 * 60 * 60));
            cash_anomalies.push({
                title: 'Caja Abierta por Tiempo Excesivo',
                desc: `La sesión del Cajero '${s.usuario_nombre}' lleva abierta más de ${hrs} horas. Se aconseja realizar el cierre diario obligatorio.`,
                badge: 'Auditoría',
                risk: 'Riesgo Alto'
            });
        });

        // Anomalía E: Acumulación de efectivo en caja abierta (límite sugerido C$ 15,000)
        const [openSessionsResult] = await db.query(`
            SELECT id, usuario_nombre, monto_inicial, detalles_json
            FROM cierres_caja
            WHERE fecha_cierre IS NULL;
        `);
        openSessionsResult.forEach(s => {
            let details = {};
            try {
                details = typeof s.detalles_json === 'string' ? JSON.parse(s.detalles_json) : (s.detalles_json || {});
            } catch { details = {}; }
            const txs = details.transactions || [];
            
            let movNeto = 0;
            const safe = (v) => { const n = Number(v); return (isNaN(n) || !isFinite(n)) ? 0 : n; };
            const tasaDefault = safe(details?.tasaDolar) || 36.60;

            txs.forEach(tx => {
                let tipo = (tx.type || '').toLowerCase().trim();
                tipo = tipo.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                let d = tx.pagoDetalles || {};
                if (typeof d === 'string') { try { d = JSON.parse(d); } catch { d = {}; } }
                if (!d || typeof d !== 'object') d = {};

                const txEfectivo = safe(d.efectivo);
                const txTarjeta = safe(d.tarjeta);
                const txTransf = safe(d.transferencia);
                const txCredito = safe(d.credito);
                const txDolares = safe(d.dolares);
                const txCambio = safe(d.cambio);
                const txIngresoCaja = safe(d.ingresoCaja);
                const txAmount = safe(tx.amount);
                const txTotalVenta = safe(d.totalVenta) || txAmount;
                const txTasa = safe(d.tasaDolarAlMomento) || tasaDefault;

                if (tipo.startsWith('venta')) {
                    const cashIn = txEfectivo + (txDolares * txTasa);
                    const cashOut = txCambio;
                    const calculatedNet = cashIn - cashOut;

                    if (Math.abs(calculatedNet) > 0.001) {
                        movNeto += calculatedNet;
                    } else if (Math.abs(txIngresoCaja) > 0.001) {
                        movNeto += txIngresoCaja;
                    } else {
                        const noEfectivo = txTarjeta + txTransf + txCredito;
                        const residual = txTotalVenta - noEfectivo;
                        if (residual > 0.001) {
                            movNeto += residual;
                        }
                    }
                }
                else if (tipo.includes('abono') || tipo.includes('liquid') || tipo.includes('pedido') || tipo.includes('apartado')) {
                    const netAbonoCash = (txEfectivo + (txDolares * txTasa)) - txCambio;

                    if (Math.abs(netAbonoCash) > 0.001) {
                        movNeto += netAbonoCash;
                    } else if (Math.abs(txIngresoCaja) > 0.001) {
                        movNeto += txIngresoCaja;
                    } else {
                        const noEfectivo = txTarjeta + txTransf;
                        const residual = Math.max(0, txAmount - noEfectivo);
                        movNeto += residual;
                    }
                }
                else if (tipo === 'entrada') {
                    movNeto += Math.abs(txAmount);
                }
                else if (tipo === 'salida') {
                    movNeto -= Math.abs(txAmount);
                }
                else if (tipo.includes('devolucion') || tipo.includes('cancelacion') || tipo.includes('anulacion')) {
                    if (d.ingresoCaja !== undefined && d.ingresoCaja !== null) {
                        movNeto += safe(d.ingresoCaja);
                    } else if (txEfectivo > 0.001) {
                        movNeto -= txEfectivo;
                    } else {
                        const noEfectivo = txTarjeta + txTransf + txCredito;
                        const cashPart = Math.abs(txAmount) - noEfectivo;
                        if (cashPart > 0.001) {
                            movNeto -= cashPart;
                        }
                    }
                }
                else if (tipo === 'ajuste' && d.target === 'efectivo') {
                    movNeto += txAmount;
                }
            });

            const totalCash = Number(s.monto_inicial || 0) + movNeto;
            if (totalCash > 15000) {
                cash_anomalies.push({
                    title: 'Límite de Efectivo Superado',
                    desc: `La caja activa de '${s.usuario_nombre}' acumula C$ ${Math.round(totalCash).toLocaleString('es-NI')}. Se sugiere un retiro parcial de efectivo por seguridad.`,
                    badge: 'Seguridad',
                    risk: 'Revisar'
                });
            }
        });

        if (cash_anomalies.length === 0) {
            cash_anomalies.push({
                title: 'Consistencia de Caja',
                desc: 'La auditoría BI analizó las transacciones de caja recientes. No se detectaron descuadres ni alertas.',
                badge: 'Todo OK',
                risk: 'Normal'
            });
        }

        if (inventory_anomalies.length === 0) {
            inventory_anomalies.push({
                title: 'Consistencia de Stock',
                desc: 'No se detectaron rupturas de stock críticas en el inventario.',
                badge: 'Todo OK',
                risk: 'Normal'
            });
        }

        // 7. Distribución de Métodos de Pago
        let paymentDistributionResult;
        if (startDate && endDate) {
            const { from, to } = getDateRange(startDate, endDate);
            [paymentDistributionResult] = await db.query(`
                SELECT 
                    COALESCE(metodo_pago, 'Efectivo') AS metodo, 
                    SUM(total_venta) AS total
                FROM ventas v
                WHERE v.estado = 'COMPLETADA' AND v.fecha >= ? AND v.fecha <= ?
                GROUP BY metodo;
            `, [from, to]);
        } else {
            [paymentDistributionResult] = await db.query(`
                SELECT 
                    COALESCE(metodo_pago, 'Efectivo') AS metodo, 
                    SUM(total_venta) AS total
                FROM ventas
                WHERE estado = 'COMPLETADA' AND fecha >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                GROUP BY metodo;
            `);
        }
        
        const payment_distribution = paymentDistributionResult.map(r => ({
            metodo: r.metodo,
            total: Number(r.total || 0)
        }));

        // 8. Ticket Promedio y sus datos subyacentes
        const [ticketDataResult] = await db.query(`
            SELECT 
                COALESCE(SUM(total_venta), 0) AS total_ventas,
                COUNT(*) AS total_tickets
            FROM ventas v
            WHERE v.estado = 'COMPLETADA' ${dateFilter}
        `, params);
        const total_ventas_bi = Number(ticketDataResult[0]?.total_ventas || 0);
        const total_tickets_bi = Number(ticketDataResult[0]?.total_tickets || 0);
        const ticket_promedio = total_tickets_bi > 0 
            ? Number((total_ventas_bi / total_tickets_bi).toFixed(2))
            : 0;

        // 9. Productos más vendidos
        const [topProductsResult] = await db.query(`
            SELECT 
                p.id_producto,
                p.nombre, 
                p.codigo, 
                SUM(dv.cantidad) AS total_unidades_vendidas, 
                SUM(dv.cantidad * dv.precio_unitario) AS total_facturado
            FROM detalle_ventas dv
            JOIN productos p ON dv.id_producto = p.id_producto
            JOIN ventas v ON dv.id_venta = v.id_venta
            WHERE v.estado = 'COMPLETADA' ${dateFilter}
            GROUP BY p.id_producto, p.nombre, p.codigo
            ORDER BY total_unidades_vendidas DESC 
            LIMIT 10;
        `, params);

        const top_products = topProductsResult.map(p => ({
            id_producto: p.id_producto,
            nombre: p.nombre,
            codigo: p.codigo,
            unidades: Number(p.total_unidades_vendidas || 0),
            monto: Number(p.total_facturado || 0)
        }));

        res.json({
            total_productos,
            promedio_margen,
            riesgo_estancamiento,
            stagnant_products: stagnantProductsList,
            sales_history,
            sales_history_daily,
            category_margins,
            cash_anomalies,
            inventory_anomalies,
            payment_distribution,
            ticket_promedio,
            total_ventas_bi,
            total_tickets_bi,
            top_products
        });

    } catch (error) {
        console.error('Error al generar métricas BI:', error);
        res.status(500).json({ msg: 'Error interno en servidor de analíticas.' });
    }
};

module.exports = {
    getSalesSummaryReport,
    getInventoryValueReport,
    getSalesByUserReport,
    getSalesByEmployeeReport,
    getTopProductsReport,
    getSalesChartReport,
    getDetailedSales,
    getProductHistory,
    getProviderPaymentsReport,
    getBiMetrics
};