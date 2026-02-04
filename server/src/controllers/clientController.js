const pool = require('../config/db');

// --- (Las funciones getAllClients, createClient, updateClient, deleteClient, addCreditPayment no cambian) ---
const getAllClients = async (req, res) => {
    console.log("LOG: Intentando obtener todos los clientes...");

    try {
        const query = `SELECT 
            c.id_cliente,
            c.nombre,
            c.telefono,
            c.direccion,
            c.limite_credito,
            COALESCE(c.saldo_pendiente, 0) as saldo_pendiente 
        FROM clientes c
        ORDER BY c.nombre ASC;
        `;

        const [clients] = await pool.query(query);
        const clientsWithBalance = clients.map(client => ({
            ...client,
            saldo_pendiente: parseFloat(client.saldo_pendiente)
        }));

        res.json(clientsWithBalance);
    } catch (error) {
        console.error("ERROR CRÍTICO (getAllClients):", error);
        res.status(500).json({ message: 'Error en el servidor al obtener clientes' });
    }
};

const createClient = async (req, res) => {
    const { nombre, telefono, direccion, limite_credito } = req.body;
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre del cliente es obligatorio.' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO clientes (nombre, telefono, direccion, limite_credito) VALUES (?, ?, ?, ?)',
            [nombre, telefono || null, direccion || null, limite_credito]
        );
        res.status(201).json({ message: 'Cliente creado exitosamente', id: result.insertId });
    } catch (error) {
        console.error("ERROR CRÍTICO (createClient):", error);
        res.status(500).json({ message: 'Error al crear cliente' });
    }
};

const updateClient = async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, direccion, limite_credito } = req.body;
    if (!nombre) {
        return res.status(400).json({ message: 'El nombre del cliente es obligatorio.' });
    }
    try {
        await pool.query(
            'UPDATE clientes SET nombre = ?, telefono = ?, direccion = ?, limite_credito = ? WHERE id_cliente = ?',
            [nombre, telefono || null, direccion || null, limite_credito, id]
        );
        res.status(200).json({ message: 'Cliente actualizado exitosamente' });
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        res.status(500).json({ message: 'Error al actualizar cliente' });
    }
};

const deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT saldo_pendiente as saldo FROM clientes WHERE id_cliente = ?', [id]);

        if (rows.length > 0 && parseFloat(rows[0].saldo) > 0) {
            return res.status(400).json({ message: `No se puede eliminar. El cliente tiene un saldo pendiente de C$${parseFloat(rows[0].saldo).toFixed(2)}.` });
        }

        await pool.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
        res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ message: 'Error al eliminar cliente, puede que tenga facturas asociadas.' });
    }
};

const addCreditPayment = async (req, res) => {
    const { id } = req.params;
    const { monto, pagoDetalles } = req.body;
    const { id: userId } = req.user;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        await connection.query(
            "INSERT INTO ventas (fecha, total_venta, estado, id_usuario, id_cliente, pago_detalles, tipo_venta) VALUES (NOW(), ?, 'ABONO_CREDITO', ?, ?, ?, 'CREDITO')",
            [monto * -1, userId, id, JSON.stringify(pagoDetalles)]
        );

        await connection.query(
            'UPDATE clientes SET saldo_pendiente = GREATEST(0, saldo_pendiente - ?) WHERE id_cliente = ?',
            [monto, id]
        );

        await connection.commit();
        res.status(200).json({ message: 'Abono a crédito registrado exitosamente.' });

    } catch (error) {
        await connection.rollback();
        console.error("ERROR CRÍTICO en addCreditPayment:", error);
        console.error("Detalles del error SQL:", error.sqlMessage || error.message);
        console.error("Parametros recibidos -> ID:", id, "Monto:", monto, "User:", userId);
        res.status(500).json({ message: 'Error al registrar el abono. Consulte logs del servidor.', error: error.message });
    } finally {
        if (connection) connection.release();
    }
};

// ===================================================================
// =================== CORRECCIÓN EN LAS CONSULTAS ===================
// ===================================================================

const getCreditosByClient = async (req, res) => {
    const { id } = req.params;
    try {
        // --- CORRECCIÓN AQUÍ: Se eliminó "v.saldo" porque no existe en la tabla "ventas" ---
        const query = `
            SELECT v.id_venta, v.fecha, v.total_venta AS total, v.estado 
            FROM ventas v
            WHERE v.id_cliente = ? AND v.tipo_venta = 'CREDITO'
            ORDER BY v.fecha DESC
        `;
        const [rows] = await pool.query(query, [id]);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener créditos:", error);
        res.status(500).json({ message: "Error al obtener créditos del cliente" });
    }
};

const getAbonosByClient = async (req, res) => {
    const { id } = req.params;
    try {
        // --- CORRECCIÓN AQUÍ: Se cambió "u.nombre" por "u.nombre_usuario" que es el nombre correcto de la columna ---
        const query = `
            SELECT v.id_venta AS id_abono, v.fecha, ABS(v.total_venta) AS monto, u.nombre_usuario AS usuario, v.pago_detalles AS pagoDetalles
            FROM ventas v
            LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
            WHERE v.id_cliente = ? AND v.estado = 'ABONO_CREDITO'
            ORDER BY v.fecha DESC
        `;
        const [rows] = await pool.query(query, [id]);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener abonos:", error);
        res.status(500).json({ message: "Error al obtener abonos del cliente" });
    }
};

module.exports = {
    getAllClients,
    createClient,
    updateClient,
    deleteClient,
    addCreditPayment,
    getCreditosByClient,
    getAbonosByClient,
};