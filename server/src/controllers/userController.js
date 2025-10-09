const { pool } = require('../config/db.js');
const bcrypt = require('../../node_modules/bcryptjs/umd/index.js');

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        // CAMBIO 1: Usar pool.query()
        const result = await pool.query('SELECT id_usuario, nombre_usuario, rol FROM usuarios');
        
        // CAMBIO 2: Obtener resultados de .rows
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

// @desc    Actualizar un usuario (rol y/o contraseña)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { rol, password } = req.body;

    try {
        // 1. Buscar al usuario existente
        // CAMBIO 1: Usar pool.query() y $1
        const result = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id]);
        const users = result.rows; // CAMBIO 2: Obtener resultados de .rows

        if (users.length === 0) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        let hashedPassword = users[0].password;
        // 2. Si se envía una nueva contraseña, la encriptamos
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // 3. Actualizar la base de datos
        // CAMBIO 3: Usar $1, $2, $3
        // Nota: COALESCE(rol, users[0].rol) no es necesario aquí si se maneja en el backend JS
        await pool.query('UPDATE usuarios SET rol = $1, password = $2 WHERE id_usuario = $3', [
            rol || users[0].rol, // Si no se envía un nuevo rol, mantenemos el existente
            hashedPassword,
            id,
        ]);

        res.json({ msg: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

// @desc    Eliminar un usuario
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        // CAMBIO 1: Usar pool.query() y $1
        const result = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1', [id]);
        
        // CAMBIO 2: PostgreSQL usa .rowCount en lugar de .affectedRows
        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        
        res.json({ msg: 'Usuario eliminado correctamente' });
    } catch (error) {
        // En PostgreSQL, 23503 es Foreign Key Violation
        if (error.code === '23503') {
             return res.status(400).json({ msg: 'No se puede eliminar el usuario porque tiene registros asociados (ventas, movimientos, etc.).' });
        }
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

module.exports = {
    getAllUsers,
    updateUser,
    deleteUser,
};