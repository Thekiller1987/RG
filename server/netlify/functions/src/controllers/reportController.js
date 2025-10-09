const { pool } = require('../config/db'); // CAMBIO 1: Importamos el pool desestructurado

// --- OBTENER RESUMEN DE VENTAS Y GANANCIAS ---
const getSalesSummaryReport = async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        return res.status(400).json({ msg: 'Por favor, especifica una fecha de inicio y fin.' });
    }
    try {
        const sql = `
            SELECT
                COALESCE(SUM(dv.cantidad * dv.precio_unitario), 0) AS ventas_brutas,
                COALESCE(SUM(dv.cantidad * (dv.precio_unitario - p.costo)), 0) AS ganancia_total
            FROM ventas AS v
            JOIN detalle_ventas AS dv ON v.id_venta = dv.id_venta
            JOIN productos AS p ON dv.id_producto = p.id_producto
            -- CAMBIO 2: Usar $1 y $2 para parámetros y tipado a timestamp
            WHERE v.estado = 'COMPLETADA' AND v.fecha BETWEEN $1::timestamp AND $2::timestamp;
        `;
        // CAMBIO 3: pool.query() en lugar de db.query()
        const result = await pool.query(sql, [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
        
        // CAMBIO 4: Obtener el resultado de la agregación de .rows[0]
        res.json(result.rows[0]); 
    } catch (error) {
        console.error('Error en reporte de resumen de ventas:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

// --- OBTENER VALOR TOTAL DEL INVENTARIO ---
const getInventoryValueReport = async (req, res) => {
    try {
        // COALESCE asegura que devuelva 0 si no hay productos
        const sql = `
            SELECT COALESCE(SUM(p.costo * p.existencia), 0) AS valor_total_inventario
            FROM productos AS p;
        `;
        // CAMBIO: pool.query() y obtener .rows[0]
        const result = await pool.query(sql);
        res.json(result.rows[0]);
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
        const sql = `
            SELECT u.nombre_usuario, COUNT(v.id_venta) AS cantidad_ventas, COALESCE(SUM(v.total_venta), 0) AS total_vendido
            FROM ventas AS v
            JOIN usuarios AS u ON v.id_usuario = u.id_usuario
            -- CAMBIO: Usar $1 y $2 para parámetros y tipado
            WHERE v.estado = 'COMPLETADA' AND v.fecha BETWEEN $1::timestamp AND $2::timestamp
            GROUP BY u.nombre_usuario ORDER BY total_vendido DESC;
        `;
        // CAMBIO: pool.query() y obtener .rows
        const result = await pool.query(sql, [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en reporte de ventas por usuario:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

// --- OBTENER PRODUCTOS MÁS VENDIDOS ---
const getTopProductsReport = async (req, res) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ msg: 'Fechas requeridas.' });
    try {
        const sql = `
            SELECT p.nombre, COALESCE(SUM(dv.cantidad), 0) AS total_unidades_vendidas
            FROM detalle_ventas AS dv
            JOIN productos AS p ON dv.id_producto = p.id_producto
            JOIN ventas AS v ON dv.id_venta = v.id_venta
            -- CAMBIO: Usar $1 y $2 para parámetros y tipado
            WHERE v.estado = 'COMPLETADA' AND v.fecha BETWEEN $1::timestamp AND $2::timestamp
            GROUP BY p.nombre ORDER BY total_unidades_vendidas DESC LIMIT 10;
        `;
        // CAMBIO: pool.query() y obtener .rows
        const result = await pool.query(sql, [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
        res.json(result.rows);
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
        const sql = `
            -- CAMBIO 1: PostgreSQL usa CAST(fecha AS DATE) o fecha::date
            SELECT fecha::date AS dia, COALESCE(SUM(total_venta), 0) AS total_diario
            FROM ventas
            -- CAMBIO 2: Usar $1 y $2 para parámetros y tipado
            WHERE estado = 'COMPLETADA' AND fecha BETWEEN $1::timestamp AND $2::timestamp
            GROUP BY fecha::date ORDER BY dia ASC;
        `;
        // CAMBIO: pool.query() y obtener .rows
        const result = await pool.query(sql, [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en reporte para gráfica:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

module.exports = {
    getSalesSummaryReport,
    getInventoryValueReport,
    getSalesByUserReport,
    getTopProductsReport,
    getSalesChartReport
};