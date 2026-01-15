const pool = require('../config/db');

// Helper for names
function displayName(u) {
    if (!u) return 'Desconocido';
    if (typeof u === 'string') return u;
    return u.nombre || u.name || u.nombre_usuario || 'Desconocido';
}

exports.createRequest = async (req, res) => {
    const { descripcion, usuario_id, usuario_nombre } = req.body;

    if (!descripcion) {
        return res.status(400).json({ message: 'La descripción es obligatoria' });
    }

    try {
        const [result] = await pool.query(`
      INSERT INTO solicitudes (descripcion, usuario_id, usuario_nombre, estado, check_mark)
      VALUES (?, ?, ?, 'pendiente', 0)
    `, [descripcion, usuario_id || null, usuario_nombre || 'Desconocido']);

        res.status(201).json({
            id: result.insertId,
            descripcion,
            estado: 'pendiente',
            usuario_id,
            usuario_nombre,
            check_mark: false,
            fecha_creacion: new Date()
        });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ message: 'Error creando solicitud' });
    }
};

exports.getRequests = async (req, res) => {
    try {
        const [rows] = await pool.query(`
      SELECT * FROM solicitudes 
      ORDER BY FIELD(estado, 'pendiente', 'completado'), fecha_creacion DESC 
      LIMIT 100
    `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Error obteniendo solicitudes' });
    }
};

exports.toggleRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body; // boolean

    try {
        const newState = completed ? 'completado' : 'pendiente';
        const checkMark = completed ? 1 : 0;

        await pool.query(`
      UPDATE solicitudes 
      SET estado = ?, check_mark = ? 
      WHERE id = ?
    `, [newState, checkMark, id]);

        res.json({ success: true, id, estado: newState, check_mark: Boolean(checkMark) });
    } catch (error) {
        console.error('Error toggling request:', error);
        res.status(500).json({ message: 'Error actualizando solicitud' });
    }
};
