const pool = require('../config/db');

// **************************************************
// FUNCIÓN createSale (AÑADE CRÉDITO A SALDO_PENDIENTE)
// **************************************************
const createSale = async (req, res) => {
    const connection = await pool.getConnection();
    
    // Desestructurar datos de la venta para logs
    const { totalVenta, items, pagoDetalles, userId, clientId } = req.body;
    console.log(`LOG: Iniciando transacción para nueva venta. Cliente ID: ${clientId}, Total: ${totalVenta}`);
    console.log(`LOG: Pago Detalles recibidos:`, pagoDetalles); // Log detallado de pagos

    try {
        await connection.beginTransaction();
        
        if (!totalVenta && totalVenta !== 0 || !items || items.length === 0 || !pagoDetalles || !userId) {
            console.error("ERROR: Faltan datos o no hay productos.");
            return res.status(400).json({ message: 'Faltan datos o no hay productos en la venta.' });
        }
        
        const montoCredito = pagoDetalles.credito || 0; 
        
        const saleData = {
            fecha: new Date(),
            total_venta: totalVenta,
            subtotal: req.body.subtotal || totalVenta,
            descuento: req.body.descuento || 0,
            estado: 'COMPLETADA',
            id_usuario: userId,
            id_cliente: clientId,
            pago_detalles: JSON.stringify({ ...pagoDetalles, tasaDolarAlMomento: req.body.tasaDolarAlMomento }),
            tipo_venta: montoCredito > 0 ? 'CREDITO' : 'CONTADO',
            referencia_pedido: req.body.referencia_pedido 
        };

        // 1. Insertar la venta principal
        const [saleResult] = await connection.query('INSERT INTO ventas SET ?', saleData);
        const saleId = saleResult.insertId;
        console.log(`LOG: Venta insertada con ID: ${saleId}`);
        
        // 2. LÓGICA DE NEGOCIO: Sumar crédito
        if (montoCredito > 0 && clientId) {
            await connection.query(
                'UPDATE clientes SET saldo_pendiente = saldo_pendiente + ? WHERE id_cliente = ?', 
                [montoCredito, clientId]
            );
            console.log(`LOG: Crédito de C$${montoCredito.toFixed(2)} sumado al cliente ID: ${clientId}`);
        } else {
             console.log(`LOG: No se sumó crédito. Monto: ${montoCredito}, Cliente ID: ${clientId}`);
        }
        
        // 3. Descontar Stock y registrar detalle de venta
        for (const item of items) {
            await connection.query(
                'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [saleId, item.id || item.id_producto, item.quantity, item.precio]
            );
            
            const [product] = await connection.query('SELECT existencia, nombre FROM productos WHERE id_producto = ? FOR UPDATE', [item.id || item.id_producto]);
            
            if (product.length === 0 || product[0].existencia < item.quantity) {
                throw new Error(`Stock insuficiente para el producto: ${product[0]?.nombre || item.nombre}`);
            }
            
            await connection.query('UPDATE productos SET existencia = existencia - ? WHERE id_producto = ?', [item.quantity, item.id || item.id_producto]);
            console.log(`LOG: Stock actualizado para producto ID ${item.id || item.id_producto}. Cantidad: -${item.quantity}`);
        }

        await connection.commit();
        console.log(`LOG: Transacción Venta #${saleId} completada exitosamente.`);
        
        // Consultar la venta final (opcional, para asegurar que los datos estén frescos)
        const [newSale] = await connection.query('SELECT * FROM ventas WHERE id_venta = ?', [saleId]);
        
        res.status(201).json({ 
            message: 'Venta creada exitosamente', 
            saleId,
            saleData: { ...newSale[0], items, pagoDetalles } 
        });

    } catch (error) {
        await connection.rollback();
        console.error('ERROR CRÍTICO en transacción de venta:', error);
        res.status(500).json({ message: error.message || 'Error en el servidor al crear la venta' });
    } finally {
        if (connection) connection.release();
    }
};

// **************************************************
// FUNCIÓN cancelSale (RESTA CRÉDITO Y REVIERTE STOCK)
// **************************************************
const cancelSale = async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    console.log(`LOG: Iniciando cancelación de Venta #${id}`);
    
    try {
        await connection.beginTransaction();
        
        // 1. OBTENER VENTA
        const [sale] = await connection.query('SELECT id_cliente, estado, pago_detalles FROM ventas WHERE id_venta = ? FOR UPDATE', [id]);
        
        if (sale.length === 0) throw new Error('La venta no existe.');
        if (sale[0].estado === 'CANCELADA') throw new Error('Esta venta ya fue cancelada.');
        
        const saleData = sale[0];
        const clientId = saleData.id_cliente;

        let detalles = {};
        try {
            detalles = typeof saleData.pago_detalles === 'string' ? JSON.parse(saleData.pago_detalles) : saleData.pago_detalles;
        } catch (e) {
            console.warn(`Advertencia: No se pudo parsear pago_detalles para Venta #${id}. Asumiendo 0 crédito.`, e);
        }
        
        const montoCredito = detalles.credito || 0;
        
        // 2. REVERTIR STOCK
        const [items] = await connection.query('SELECT id_producto, cantidad FROM detalle_ventas WHERE id_venta = ?', [id]);
        for (const item of items) {
            await connection.query('UPDATE productos SET existencia = existencia + ? WHERE id_producto = ?', [item.cantidad, item.id_producto]);
            console.log(`LOG: Stock revertido para producto ID ${item.id_producto}. Cantidad: +${item.cantidad}`);
        }
        
        // 3. LÓGICA DE NEGOCIO: Reversión del crédito
        if (montoCredito > 0 && clientId) {
            await connection.query(
                'UPDATE clientes SET saldo_pendiente = GREATEST(0, saldo_pendiente - ?) WHERE id_cliente = ?', 
                [montoCredito, clientId]
            );
            console.log(`LOG: Crédito de C$${montoCredito.toFixed(2)} revertido al cliente ID: ${clientId}`);
        }
        
        // 4. MARCAR VENTA COMO CANCELADA
        await connection.query('UPDATE ventas SET estado = ? WHERE id_venta = ?', ['CANCELADA', id]);
        console.log(`LOG: Venta #${id} marcada como CANCELADA.`);
        
        await connection.commit();
        res.status(200).json({ message: 'Venta cancelada exitosamente, stock y crédito revertidos.' });
        
    } catch (error) {
        await connection.rollback();
        console.error('ERROR CRÍTICO en la cancelación de venta:', error);
        res.status(500).json({ message: error.message || 'Error en el servidor al cancelar la venta' });
    } finally {
        if (connection) connection.release();
    }
};

// **************************************************
// FUNCIÓN createReturn (DEVOLUCIÓN PARCIAL)
// **************************************************
const createReturn = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { originalSaleId, item, quantity, userId } = req.body;
        
        if (!originalSaleId || !item || !quantity || !userId) {
            return res.status(400).json({ message: 'Faltan datos para la devolución.' });
        }
        
        const returnAmount = item.precio * quantity;
        const pagoDetalles = { efectivo: returnAmount, ingresoCaja: returnAmount * -1, devueltoDeVenta: originalSaleId };
        
        const [insertSaleResult] = await connection.query(
            "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta) VALUES (NOW(), ?, ?, ?, ?, 'DEVOLUCION')",
            [returnAmount * -1, 'DEVOLUCION', userId, JSON.stringify(pagoDetalles)]
        );
        const returnId = insertSaleResult.insertId;
        
        await connection.query(
            'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
            [returnId, item.id || item.id_producto, quantity, item.precio]
        );
        await connection.query('UPDATE productos SET existencia = existencia + ? WHERE id_producto = ?', [quantity, item.id || item.id_producto]);
        
        await connection.commit();
        res.status(201).json({ message: 'Devolución procesada exitosamente', returnId });
    } catch (error) {
        await connection.rollback();
        console.error('Error en transacción de devolución:', error);
        res.status(500).json({ message: error.message || 'Error en el servidor al procesar la devolución' });
    } finally {
        if (connection) connection.release();
    }
};

// **************************************************
// FUNCIÓN getSales (OBTIENE VENTAS DEL DÍA)
// **************************************************
const getSales = async (req, res) => {
    try {
        console.log("LOG: Intentando obtener ventas del día.");
        
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
WHERE DATE(v.fecha) = CURDATE() 
ORDER BY v.fecha DESC
        `);

        if (sales.length === 0) {
            console.log("LOG: No se encontraron ventas para hoy.");
            return res.json([]);
        }

        const saleIds = sales.map(s => s.id);
        
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
                // Intenta parsear si es una cadena JSON
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