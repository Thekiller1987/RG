// ==========================================================
// ARCHIVO: server/src/controllers/clientController.js
// VERSIÓN FINAL Y CORREGIDA
// ==========================================================

const db = require('../config/db'); // CORRECCIÓN: Se importa 'db'

// OBTENER TODOS LOS CLIENTES
exports.getAllClients = async (req, res) => {
    try {
        const query = `
            SELECT 
                c.id_cliente, c.nombre, c.telefono, c.direccion, c.limite_credito,
                COALESCE(c.saldo_pendiente, 0) AS saldo_pendiente 
            FROM clientes c ORDER BY c.nombre ASC;
        `;
        const { rows } = await db.query(query);

        const clientsWithBalance = rows.map(client => ({
            ...client,
            saldo_pendiente: parseFloat(client.saldo_pendiente)
        }));

        res.json(clientsWithBalance);
    } catch (error) {
        console.error("ERROR CRÍTICO (getAllClients):", error);
        res.status(500).json({ message: 'Error en el servidor al obtener clientes' });
    }
};

// CREAR UN CLIENTE
exports.createClient = async (req, res) => {
    const { nombre, telefono, direccion, limite_credito } = req.body;
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre del cliente es obligatorio.' });
    }
    try {
        const { rows } = await db.query(
            'INSERT INTO clientes (nombre, telefono, direccion, limite_credito) VALUES ($1, $2, $3, $4) RETURNING id_cliente',
            [nombre, telefono || null, direccion || null, limite_credito]
        );
        res.status(201).json({ message: 'Cliente creado exitosamente', id: rows[0].id_cliente });
    } catch (error) {
        console.error("ERROR CRÍTICO (createClient):", error);
        res.status(500).json({ message: 'Error al crear cliente' });
    }
};

// ACTUALIZAR UN CLIENTE
exports.updateClient = async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, direccion, limite_credito } = req.body;
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre del cliente es obligatorio.' });
    }
    try {
        await db.query(
            'UPDATE clientes SET nombre = $1, telefono = $2, direccion = $3, limite_credito = $4 WHERE id_cliente = $5',
            [nombre, telefono || null, direccion || null, limite_credito, id]
        );
        res.status(200).json({ message: 'Cliente actualizado exitosamente' });
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        res.status(500).json({ message: 'Error al actualizar cliente' });
    }
};

// ELIMINAR UN CLIENTE
exports.deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query('SELECT saldo_pendiente as saldo FROM clientes WHERE id_cliente = $1', [id]);
        
        if (rows.length > 0 && parseFloat(rows[0].saldo) > 0) {
            return res.status(400).json({ message: `No se puede eliminar. El cliente tiene un saldo pendiente de C$${parseFloat(rows[0].saldo).toFixed(2)}.` });
        }

        await db.query('DELETE FROM clientes WHERE id_cliente = $1', [id]);
        res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        if (error.code === '23503') {
             return res.status(500).json({ message: 'Error al eliminar cliente: El cliente tiene registros asociados (ventas, pedidos).' });
        }
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ message: 'Error al eliminar cliente.' });
    }
};

// AÑADIR ABONO A CRÉDITO
exports.addCreditPayment = async (req, res) => {
    const { id } = req.params;
    const { monto, pagoDetalles } = req.body;
    const userId = req.user ? req.user.id : null; 
    
    // CORRECCIÓN: Se obtiene un cliente de la base de datos para la transacción
    const client = await db.getClient(); 

    try {
        await client.query('BEGIN');
        
        await client.query(
            "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, id_cliente, pago_detalles, tipo_venta) VALUES (NOW(), $1, 'ABONO_CREDITO', $2, $3, $4, 'CREDITO')",
            [monto * -1, userId, id, JSON.stringify(pagoDetalles)]
        );
        
        await client.query(
            'UPDATE clientes SET saldo_pendiente = GREATEST(0, saldo_pendiente - $1) WHERE id_cliente = $2',
            [monto, id]
        );
        
        await client.query('COMMIT');
        res.status(200).json({ message: 'Abono a crédito registrado exitosamente.' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error al registrar abono a crédito:", error);
        res.status(500).json({ message: 'Error al registrar el abono' });
    } finally {
        client.release(); 
    }
};

// OBTENER CRÉDITOS DE UN CLIENTE
exports.getCreditosByClient = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT v.id_venta, v.fecha, v.total_venta AS total, v.estado 
            FROM ventas v
            WHERE v.id_cliente = $1 AND v.tipo_venta = 'CREDITO'
            ORDER BY v.fecha DESC
        `;
        const { rows } = await db.query(query, [id]); 
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener créditos:", error);
        res.status(500).json({ message: "Error al obtener créditos del cliente" });
    }
};

// OBTENER ABONOS DE UN CLIENTE
exports.getAbonosByClient = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT v.id_venta AS id_abono, v.fecha, ABS(v.total_venta) AS monto, u.nombre_usuario AS usuario
            FROM ventas v
            LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
            WHERE v.id_cliente = $1 AND v.estado = 'ABONO_CREDITO'
            ORDER BY v.fecha DESC
        `;
        const { rows } = await db.query(query, [id]);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener abonos:", error);
        res.status(500).json({ message: "Error al obtener abonos del cliente" });
    }
};