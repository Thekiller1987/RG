
const db = require('../config/db');

// --- ACCESS CONTROL ---

const validatePin = async (req, res) => {
    const { pin } = req.body;
    try {
        const [rows] = await db.query('SELECT mayorista_pin FROM business_config WHERE id = 1');
        if (!rows.length) return res.status(404).json({ message: 'Configuración no encontrada.' });

        const validPin = rows[0].mayorista_pin || '0000';
        if (pin === validPin) {
            return res.json({ success: true, message: 'Acceso concedido.' });
        } else {
            return res.status(401).json({ success: false, message: 'PIN incorrecto.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error validando PIN.' });
    }
};

// --- PROMOTIONS ---

const getPromotions = async (req, res) => {
    try {
        const [promos] = await db.query(`
            SELECT pm.*, p.nombre AS nombre_producto, c.nombre AS nombre_categoria
            FROM promociones_mayorista pm
            LEFT JOIN productos p ON pm.id_producto = p.id_producto
            LEFT JOIN categorias c ON pm.id_categoria = c.id_categoria
            ORDER BY pm.fecha_inicio DESC
        `);
        res.json(promos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo promociones.' });
    }
};

const createPromotion = async (req, res) => {
    const {
        nombre, tipo, valor, cantidad_minima,
        id_producto, id_categoria, tipo_cliente, fecha_inicio, fecha_fin
    } = req.body;

    try {
        const [result] = await db.query(`
            INSERT INTO promociones_mayorista 
            (nombre, tipo, valor, cantidad_minima, id_producto, id_categoria, tipo_cliente, fecha_inicio, fecha_fin, activa)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `, [nombre, tipo, valor, cantidad_minima || 1, id_producto || null, id_categoria || null, tipo_cliente || null, fecha_inicio, fecha_fin]);

        res.status(201).json({ id: result.insertId, message: 'Promoción creada exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creando promoción.' });
    }
};

const updatePromotion = async (req, res) => {
    const { id } = req.params;
    const {
        nombre, tipo, valor, cantidad_minima,
        id_producto, id_categoria, tipo_cliente, fecha_inicio, fecha_fin
    } = req.body;

    try {
        await db.query(`
            UPDATE promociones_mayorista 
            SET nombre=?, tipo=?, valor=?, cantidad_minima=?, id_producto=?, id_categoria=?, tipo_cliente=?, fecha_inicio=?, fecha_fin=?
            WHERE id_promocion=?
        `, [nombre, tipo, valor, cantidad_minima, id_producto, id_categoria, tipo_cliente, fecha_inicio, fecha_fin, id]);

        res.json({ message: 'Promoción actualizada.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error actualizando promoción.' });
    }
};

const togglePromotionStatus = async (req, res) => {
    const { id } = req.params;
    const { activa } = req.body; // boolean

    try {
        await db.query('UPDATE promociones_mayorista SET activa = ? WHERE id_promocion = ?', [activa ? 1 : 0, id]);
        res.json({ message: `Promoción ${activa ? 'activada' : 'desactivada'}.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error cambiando estado de promoción.' });
    }
};

const deletePromotion = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM promociones_mayorista WHERE id_promocion = ?', [id]);
        res.json({ message: 'Promoción eliminada.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error eliminando promoción.' });
    }
};

module.exports = {
    validatePin,
    getPromotions,
    createPromotion,
    updatePromotion,
    togglePromotionStatus,
    deletePromotion
};
