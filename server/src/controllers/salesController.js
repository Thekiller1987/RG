// sales.controller.js (CONTROLADOR COMPLETO Y CORREGIDO)

const pool = require('../config/db'); // Asume tu conexión a MySQL

// **************************************************
// FUNCIÓN createSale, cancelSale, createReturn (Se mantienen intactas y funcionales)
// **************************************************
const createSale = async (req, res) => { /* ... (código intacto) ... */ };
const cancelSale = async (req, res) => { /* ... (código intacto) ... */ };
const createReturn = async (req, res) => { /* ... (código intacto) ... */ };


// **************************************************
// FUNCIÓN getSales (OBTIENE VENTAS FILTRADAS POR FECHA) - FIX DE SEGURIDAD Y FILTRO
// **************************************************
const getSales = async (req, res) => {
    try {
        // 🚨 FIX CLAVE: Obtener la fecha del query string (ej. 2025-10-15)
        const { date } = req.query; 
        
        // Inicializar la condición y los parámetros para el query
        let dateCondition = '';
        const queryParams = [];

        if (date) {
            // USANDO PLACEHOLDER '?' PARA FECHA
            dateCondition = `DATE(v.fecha) = ?`;
            queryParams.push(date); // Agrega la fecha como parámetro seguro
            console.log(`LOG: Intentando obtener ventas para la fecha: ${date}`);
        } else {
            // Si no se proporciona fecha, usamos CURDATE()
            dateCondition = 'DATE(v.fecha) = CURDATE()'; 
            console.log("LOG: Intentando obtener ventas del día actual (CURDATE).");
        }
        
        // Construimos el query
        const [sales] = await pool.query(`
SELECT 
    v.id_venta AS id, 
    v.fecha, 
    v.total_venta AS totalVenta, 
    v.subtotal,
    v.descuento,
    v.estado, 
    v.pago_detalles AS pagoDetalles,
    v.id_usuario AS userId,
    v.id_cliente AS clientId,
    c.nombre AS clienteNombre,
    v.tipo_venta,
    v.referencia_pedido
FROM ventas v
LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
WHERE ${dateCondition} 
ORDER BY v.fecha DESC
        `, queryParams); // 👈 Pasamos los parámetros SQL al driver

        if (sales.length === 0) {
            console.log(`LOG: No se encontraron ventas para la condición: ${dateCondition}`);
            return res.json([]);
        }

        const saleIds = sales.map(s => s.id);
        
        // Obtener detalles de venta
        const [details] = await pool.query(`
SELECT 
    dv.id_venta, 
    p.id_producto AS id,
    p.nombre,
    dv.cantidad AS quantity,
    dv.precio_unitario AS precio
FROM detalle_ventas dv
JOIN productos p ON dv.id_producto = p.id_producto
WHERE dv.id_venta IN (?)
        `, [saleIds]);
        
        console.log(`LOG: Se encontraron ${sales.length} ventas y ${details.length} detalles de venta.`);

        // Combinar los datos de forma segura
        const salesWithDetails = sales.map(sale => {
            let parsedPagoDetalles = {};
            try {
                parsedPagoDetalles = typeof sale.pagoDetalles === 'string' && sale.pagoDetalles ? JSON.parse(sale.pagoDetalles) : sale.pagoDetalles || {};
            } catch (e) {
                console.warn(`Advertencia: Error al parsear pagoDetalles de Venta #${sale.id}.`, e);
            }

            return {
                ...sale,
                pagoDetalles: parsedPagoDetalles,
                items: details.filter(d => d.id_venta === sale.id)
            };
        });

        res.json(salesWithDetails);

    } catch (error) {
        console.error('ERROR CRÍTICO al obtener las ventas:', error);
        res.status(500).json({ message: 'Error en el servidor al obtener las ventas' });
    }
};

module.exports = {
    createSale,
    getSales,
    createReturn,
    cancelSale,
};