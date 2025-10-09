const { pool } = require('../config/db');

// Función auxiliar para obtener y liberar un cliente de la piscina
const getClient = async () => await pool.connect(); 

// **************************************************
// FUNCIÓN createSale (AÑADE CRÉDITO A SALDO_PENDIENTE)
// **************************************************
const createSale = async (req, res) => {
    // CAMBIO 1: Usar pool.connect() para manejar la transacción
    const client = await getClient();
    
    // Desestructurar datos de la venta para logs
    const { totalVenta, items, pagoDetalles, userId, clientId } = req.body;
    
    // ELIMINACIÓN: Quitamos logs innecesarios para producción
    // console.log(`LOG: Iniciando transacción para nueva venta. Cliente ID: ${clientId}, Total: ${totalVenta}`);
    // console.log(`LOG: Pago Detalles recibidos:`, pagoDetalles); 

    try {
        await client.query('BEGIN'); // Iniciar Transacción
        
        if (!totalVenta && totalVenta !== 0 || !items || items.length === 0 || !pagoDetalles || !userId) {
            console.error("ERROR: Faltan datos o no hay productos.");
            return res.status(400).json({ message: 'Faltan datos o no hay productos en la venta.' });
        }
        
        const montoCredito = pagoDetalles.credito || 0; 
        
        // 1. Insertar la venta principal
        // CAMBIO 2: De 'INSERT INTO ventas SET ?' a 'VALUES' con $1, $2, ... y RETURNING
        const saleData = [
            totalVenta,
            req.body.subtotal || totalVenta,
            req.body.descuento || 0,
            'COMPLETADA',
            userId,
            clientId,
            JSON.stringify({ ...pagoDetalles, tasaDolarAlMomento: req.body.tasaDolarAlMomento }),
            montoCredito > 0 ? 'CREDITO' : 'CONTADO',
            req.body.referencia_pedido 
        ];

        const saleQuery = `
            INSERT INTO ventas (fecha, total_venta, subtotal, descuento, estado, id_usuario, id_cliente, pago_detalles, tipo_venta, referencia_pedido) 
            VALUES (NOW(), $1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id_venta;
        `;
        const saleResult = await client.query(saleQuery, saleData);
        const saleId = saleResult.rows[0].id_venta;
        // console.log(`LOG: Venta insertada con ID: ${saleId}`); // Log simplificado
        
        // 2. LÓGICA DE NEGOCIO: Sumar crédito
        if (montoCredito > 0 && clientId) {
            // CAMBIO 3: Usar $1 y $2, no es necesaria la función GREATEST aquí.
            await client.query(
                'UPDATE clientes SET saldo_pendiente = saldo_pendiente + $1 WHERE id_cliente = $2', 
                [montoCredito, clientId]
            );
            // console.log(`LOG: Crédito de C$${montoCredito.toFixed(2)} sumado al cliente ID: ${clientId}`); // Log simplificado
        }
        
        // 3. Descontar Stock y registrar detalle de venta
        for (const item of items) {
            const itemId = item.id || item.id_producto;
            
            // Insertar Detalle de Venta
            // CAMBIO 4: Usar $1, $2, $3, $4
            await client.query(
                'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
                [saleId, itemId, item.quantity, item.precio]
            );
            
            // Obtener stock y bloquear fila (FOR UPDATE)
            // CAMBIO 5: Usar $1 y FOR UPDATE
            const productResult = await client.query('SELECT existencia, nombre FROM productos WHERE id_producto = $1 FOR UPDATE', [itemId]);
            const product = productResult.rows;
            
            if (product.length === 0 || product[0].existencia < item.quantity) {
                // Si falla el stock, se hace rollback en el catch.
                throw new Error(`Stock insuficiente para el producto: ${product[0]?.nombre || item.nombre}`);
            }
            
            // Actualizar Stock
            // CAMBIO 6: Usar $1 y $2
            await client.query('UPDATE productos SET existencia = existencia - $1 WHERE id_producto = $2', [item.quantity, itemId]);
            // console.log(`LOG: Stock actualizado para producto ID ${itemId}. Cantidad: -${item.quantity}`); // Log simplificado
        }

        await client.query('COMMIT'); // Finalizar Transacción
        // console.log(`LOG: Transacción Venta #${saleId} completada exitosamente.`); // Log simplificado
        
        // Consultar la venta final (opcional, para asegurar que los datos estén frescos)
        const newSaleResult = await client.query('SELECT * FROM ventas WHERE id_venta = $1', [saleId]);
        
        res.status(201).json({ 
            message: 'Venta creada exitosamente', 
            saleId,
            saleData: { ...newSaleResult.rows[0], items, pagoDetalles } 
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('ERROR CRÍTICO en transacción de venta:', error);
        res.status(500).json({ message: error.message || 'Error en el servidor al crear la venta' });
    } finally {
        // Liberar el cliente a la piscina
        client.release();
    }
};

// **************************************************
// FUNCIÓN cancelSale (RESTA CRÉDITO Y REVIERTE STOCK)
// **************************************************
const cancelSale = async (req, res) => {
    const { id } = req.params;
    const client = await getClient();
    // console.log(`LOG: Iniciando cancelación de Venta #${id}`); // Log simplificado
    
    try {
        await client.query('BEGIN');
        
        // 1. OBTENER VENTA
        // CAMBIO 1: Usar $1 y FOR UPDATE, y obtener .rows
        const saleResult = await client.query("SELECT id_cliente, estado, pago_detalles FROM ventas WHERE id_venta = $1 FOR UPDATE", [id]);
        const sale = saleResult.rows;
        
        if (sale.length === 0) throw new Error('La venta no existe.');
        // Usamos la constante 'CANCELADA' en mayúsculas de PostgreSQL
        if (sale[0].estado === 'CANCELADA') throw new Error('Esta venta ya fue cancelada.'); 
        
        const saleData = sale[0];
        const clientId = saleData.id_cliente;

        let detalles = {};
        // En PostgreSQL (JSONB), el campo ya puede ser un objeto si se insertó correctamente.
        try {
            detalles = typeof saleData.pago_detalles === 'string' ? JSON.parse(saleData.pago_detalles) : saleData.pago_detalles || {};
        } catch (e) {
            console.warn(`Advertencia: No se pudo parsear pago_detalles para Venta #${id}. Asumiendo 0 crédito.`, e);
        }
        
        const montoCredito = detalles.credito || 0;
        
        // 2. REVERTIR STOCK
        // CAMBIO 2: Usar $1 y obtener .rows
        const itemsResult = await client.query('SELECT id_producto, cantidad FROM detalle_ventas WHERE id_venta = $1', [id]);
        const items = itemsResult.rows;

        for (const item of items) {
            // CAMBIO 3: Usar $1 y $2
            await client.query('UPDATE productos SET existencia = existencia + $1 WHERE id_producto = $2', [item.cantidad, item.id_producto]);
            // console.log(`LOG: Stock revertido para producto ID ${item.id_producto}. Cantidad: +${item.cantidad}`); // Log simplificado
        }
        
        // 3. LÓGICA DE NEGOCIO: Reversión del crédito
        if (montoCredito > 0 && clientId) {
            // CAMBIO 4: Usar $1 y $2 y la función GREATEST de PostgreSQL
            await client.query(
                'UPDATE clientes SET saldo_pendiente = GREATEST(0, saldo_pendiente - $1) WHERE id_cliente = $2', 
                [montoCredito, clientId]
            );
            // console.log(`LOG: Crédito de C$${montoCredito.toFixed(2)} revertido al cliente ID: ${clientId}`); // Log simplificado
        }
        
        // 4. MARCAR VENTA COMO CANCELADA
        // CAMBIO 5: Usar $1 y $2
        await client.query('UPDATE ventas SET estado = $1 WHERE id_venta = $2', ['CANCELADA', id]);
        // console.log(`LOG: Venta #${id} marcada como CANCELADA.`); // Log simplificado
        
        await client.query('COMMIT');
        res.status(200).json({ message: 'Venta cancelada exitosamente, stock y crédito revertidos.' });
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('ERROR CRÍTICO en la cancelación de venta:', error);
        res.status(500).json({ message: error.message || 'Error en el servidor al cancelar la venta' });
    } finally {
        client.release();
    }
};

// **************************************************
// FUNCIÓN createReturn (DEVOLUCIÓN PARCIAL)
// **************************************************
const createReturn = async (req, res) => {
    const client = await getClient();
    try {
        await client.query('BEGIN');
        const { originalSaleId, item, quantity, userId } = req.body;
        
        if (!originalSaleId || !item || !quantity || !userId) {
            return res.status(400).json({ message: 'Faltan datos para la devolución.' });
        }
        
        const returnAmount = item.precio * quantity;
        const pagoDetalles = { efectivo: returnAmount, ingresoCaja: returnAmount * -1, devueltoDeVenta: originalSaleId };
        
        // 1. Insertar la Devolución (Venta con total negativo)
        // CAMBIO 1: Usar $1, $2, $3 y NOW()
        const insertSaleQuery = `
            INSERT INTO ventas (fecha, total_venta, estado, id_usuario, pago_detalles, tipo_venta) 
            VALUES (NOW(), $1, $2, $3, $4, 'DEVOLUCION')
            RETURNING id_venta;
        `;
        const insertSaleResult = await client.query(insertSaleQuery, 
            [returnAmount * -1, 'DEVOLUCION', userId, JSON.stringify(pagoDetalles)]
        );
        const returnId = insertSaleResult.rows[0].id_venta;
        
        // 2. Insertar Detalle de Venta
        // CAMBIO 2: Usar $1, $2, $3, $4
        await client.query(
            'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
            [returnId, item.id || item.id_producto, quantity, item.precio]
        );
        
        // 3. Revertir Stock
        // CAMBIO 3: Usar $1 y $2
        await client.query('UPDATE productos SET existencia = existencia + $1 WHERE id_producto = $2', [quantity, item.id || item.id_producto]);
        
        await client.query('COMMIT');
        res.status(201).json({ message: 'Devolución procesada exitosamente', returnId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en transacción de devolución:', error);
        res.status(500).json({ message: error.message || 'Error en el servidor al procesar la devolución' });
    } finally {
        client.release();
    }
};

// **************************************************
// FUNCIÓN getSales (OBTIENE VENTAS DEL DÍA)
// **************************************************
const getSales = async (req, res) => {
    try {
        // ELIMINACIÓN: Quitamos logs innecesarios para producción
        // console.log("LOG: Intentando obtener ventas del día.");
        
        // CAMBIO CRÍTICO: Usar CURRENT_DATE y ::date para la fecha
        const salesResult = await pool.query(`
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
            WHERE v.fecha::date = CURRENT_DATE 
            ORDER BY v.fecha DESC
        `);
        const sales = salesResult.rows;

        if (sales.length === 0) {
            // console.log("LOG: No se encontraron ventas para hoy."); // Log simplificado
            return res.json([]);
        }

        const saleIds = sales.map(s => s.id);
        
        // CAMBIO: Usar $1 y la función ANY (PostgreSQL) para el array de IDs
        const detailsResult = await pool.query(`
            SELECT 
                dv.id_venta, 
                p.id_producto AS id,
                p.nombre,
                dv.cantidad AS quantity,
                dv.precio_unitario AS precio
            FROM detalle_ventas dv
            JOIN productos p ON dv.id_producto = p.id_producto
            WHERE dv.id_venta = ANY($1::int[])
        `, [saleIds]);
        const details = detailsResult.rows;
        
        // console.log(`LOG: Se encontraron ${sales.length} ventas y ${details.length} detalles de venta.`); // Log simplificado

        // Combinar los datos de forma segura
        const salesWithDetails = sales.map(sale => {
            let parsedPagoDetalles = {};
            try {
                // Intenta parsear si es una cadena JSON. En PostgreSQL (JSONB), a veces es un objeto directo.
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