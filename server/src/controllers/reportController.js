// src/controllers/reportController.js

const db = require('../config/db');

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
            WHERE v.estado = 'COMPLETADA' AND v.fecha BETWEEN ? AND ?;
        `;
        const [results] = await db.query(sql, [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
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
        const sql = `
            SELECT u.nombre_usuario, COUNT(v.id_venta) AS cantidad_ventas, SUM(v.total_venta) AS total_vendido
            FROM ventas AS v
            JOIN usuarios AS u ON v.id_usuario = u.id_usuario
            WHERE v.estado = 'COMPLETADA' AND v.fecha BETWEEN ? AND ?
            GROUP BY u.nombre_usuario ORDER BY total_vendido DESC;
        `;
        const [results] = await db.query(sql, [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
        res.json(results);
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
            SELECT p.nombre, SUM(dv.cantidad) AS total_unidades_vendidas
            FROM detalle_ventas AS dv
            JOIN productos AS p ON dv.id_producto = p.id_producto
            JOIN ventas AS v ON dv.id_venta = v.id_venta
            WHERE v.estado = 'COMPLETADA' AND v.fecha BETWEEN ? AND ?
            GROUP BY p.nombre ORDER BY total_unidades_vendidas DESC LIMIT 10;
        `;
        const [results] = await db.query(sql, [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
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
        const sql = `
            SELECT DATE(fecha) AS dia, SUM(total_venta) AS total_diario
            FROM ventas
            WHERE estado = 'COMPLETADA' AND fecha BETWEEN ? AND ?
            GROUP BY DATE(fecha) ORDER BY dia ASC;
        `;
        const [results] = await db.query(sql, [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
        res.json(results);
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