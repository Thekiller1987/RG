const pool = require('../config/db');

// GET /api/employees
exports.getAll = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM empleados WHERE activo = 1 ORDER BY nombre ASC'
        );
        res.json(rows);
    } catch (err) {
        console.error('Error getAll empleados:', err);
        res.status(500).json({ message: 'Error al obtener empleados' });
    }
};

// POST /api/employees
exports.create = async (req, res) => {
    try {
        const { nombre, telefono, cargo } = req.body;
        if (!nombre || !nombre.trim()) {
            return res.status(400).json({ message: 'El nombre es requerido' });
        }
        const [result] = await pool.query(
            'INSERT INTO empleados (nombre, telefono, cargo) VALUES (?, ?, ?)',
            [nombre.trim(), telefono || null, cargo || 'Vendedor']
        );
        const [newEmp] = await pool.query('SELECT * FROM empleados WHERE id_empleado = ?', [result.insertId]);
        res.status(201).json(newEmp[0]);
    } catch (err) {
        console.error('Error create empleado:', err);
        res.status(500).json({ message: 'Error al crear empleado' });
    }
};

// PUT /api/employees/:id
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, telefono, cargo } = req.body;
        if (!nombre || !nombre.trim()) {
            return res.status(400).json({ message: 'El nombre es requerido' });
        }
        await pool.query(
            'UPDATE empleados SET nombre = ?, telefono = ?, cargo = ? WHERE id_empleado = ?',
            [nombre.trim(), telefono || null, cargo || 'Vendedor', id]
        );
        const [updated] = await pool.query('SELECT * FROM empleados WHERE id_empleado = ?', [id]);
        res.json(updated[0]);
    } catch (err) {
        console.error('Error update empleado:', err);
        res.status(500).json({ message: 'Error al actualizar empleado' });
    }
};

// DELETE /api/employees/:id (soft delete)
exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('UPDATE empleados SET activo = 0 WHERE id_empleado = ?', [id]);
        res.json({ message: 'Empleado desactivado' });
    } catch (err) {
        console.error('Error remove empleado:', err);
        res.status(500).json({ message: 'Error al desactivar empleado' });
    }
};
