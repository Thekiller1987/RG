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
            WHERE 
                v.estado = 'COMPLETADA' 
                AND DATE(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) BETWEEN ? AND ?;
        `;
        // Los parámetros son las fechas YYYY-MM-DD, y el backend las compara contra la fecha LOCAL
        const [results] = await db.query(sql, [startDate, endDate]);
        res.json(results[0]);
    } catch (error) {
        console.error('Error en reporte de resumen de ventas:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

// --- OBTENER VALOR TOTAL DEL INVENTARIO ---
// (No requiere ajuste de zona horaria)
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
            SELECT 
                u.nombre_usuario, 
                COUNT(v.id_venta) AS cantidad_ventas, 
                SUM(v.total_venta) AS total_vendido
            FROM ventas AS v
            JOIN usuarios AS u ON v.id_usuario = u.id_usuario
            WHERE 
                v.estado = 'COMPLETADA' 
                AND DATE(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) BETWEEN ? AND ?
            GROUP BY u.nombre_usuario 
            ORDER BY total_vendido DESC;
        `;
        const [results] = await db.query(sql, [startDate, endDate]);
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
            WHERE 
                v.estado = 'COMPLETADA' 
                AND DATE(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) BETWEEN ? AND ?
            GROUP BY p.nombre 
            ORDER BY total_unidades_vendidas DESC 
            LIMIT 10;
        `;
        const [results] = await db.query(sql, [startDate, endDate]);
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
            SELECT 
                DATE(DATE_SUB(fecha, INTERVAL 6 HOUR)) AS dia, 
                SUM(total_venta) AS total_diario
            FROM ventas
            WHERE 
                estado = 'COMPLETADA' 
                AND DATE(DATE_SUB(fecha, INTERVAL 6 HOUR)) BETWEEN ? AND ?
            GROUP BY dia 
            ORDER BY dia ASC;
        `;
        const [results] = await db.query(sql, [startDate, endDate]);
        res.json(results);
    } catch (error) {
        console.error('Error en reporte para gráfica:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

// --- OBTENER VENTAS DETALLADAS CON PRODUCTOS, CLIENTES, VENDEDORES ---
const getDetailedSales = async (req, res) => {
    const { startDate, endDate, tipo } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ msg: 'Fechas requeridas.' });
    try {
        let tipoFilter = '';
        const params = [startDate, endDate];
        if (tipo === 'DEVOLUCION') {
            tipoFilter = ` AND v.estado = 'DEVOLUCION'`;
        } else if (tipo === 'COMPLETADA') {
            tipoFilter = ` AND v.estado = 'COMPLETADA'`;
        } else if (tipo === 'CANCELADA') {
            tipoFilter = ` AND v.estado = 'CANCELADA'`;
        }

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
                u.nombre_usuario AS vendedorNombre
            FROM ventas v
            LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
            LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
            WHERE DATE(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) BETWEEN ? AND ?
            ${tipoFilter}
            ORDER BY v.fecha DESC
            LIMIT 500
        `, params);

        if (!sales.length) return res.json([]);

        const saleIds = sales.map(s => s.id);
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
            WHERE dv.id_venta IN (?)
        `, [saleIds]);

        const salesWithDetails = sales.map(sale => ({
            ...sale,
            pagoDetalles: typeof sale.pagoDetalles === 'string' ? (() => { try { return JSON.parse(sale.pagoDetalles); } catch { return {}; } })() : (sale.pagoDetalles || {}),
            items: details.filter(d => d.id_venta === sale.id)
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
        // Buscar producto por código
        const [products] = await db.query(
            `SELECT id_producto, nombre, codigo, precio, costo, existencia FROM productos WHERE codigo LIKE ? LIMIT 10`,
            [`%${code}%`]
        );

        if (!products.length) return res.json({ product: null, history: [] });

        const productIds = products.map(p => p.id_producto);
        const product = products[0]; // Producto principal

        // Obtener historial de ventas de ese producto
        const [history] = await db.query(`
            SELECT 
                v.id_venta AS idVenta,
                v.fecha,
                v.estado,
                v.tipo_venta,
                dv.cantidad,
                dv.precio_unitario AS precioUnitario,
                c.nombre AS clienteNombre,
                c.id_cliente AS clienteId,
                u.nombre_usuario AS vendedorNombre
            FROM detalle_ventas dv
            JOIN ventas v ON dv.id_venta = v.id_venta
            LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
            LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
            WHERE dv.id_producto IN (?)
            ORDER BY v.fecha DESC
            LIMIT 200
        `, [productIds]);

        res.json({ product, products, history });
    } catch (error) {
        console.error('Error buscando historial de producto:', error);
        res.status(500).json({ msg: 'Error en el servidor.' });
    }
};

module.exports = {
    getSalesSummaryReport,
    getInventoryValueReport,
    getSalesByUserReport,
    getTopProductsReport,
    getSalesChartReport,
    getDetailedSales,
    getProductHistory
};