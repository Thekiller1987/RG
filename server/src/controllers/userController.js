// ==========================================================
// ARCHIVO: server/src/controllers/userController.js
// VERSIÓN FINAL Y CORREGIDA PARA RENDER Y SUPABASE
// ==========================================================

const db = require('../config/db');
const bcrypt = require('bcryptjs');

// OBTENER TODOS LOS USUARIOS
// exports.getAllUsers es la forma correcta de exportar
exports.getAllUsers = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id_usuario, nombre_usuario, rol FROM usuarios ORDER BY nombre_usuario');
    res.json(rows);
  } catch (err) {
    console.error('Error en getAllUsers:', err.message);
    res.status(500).send('Error en el servidor');
  }
};

// CREAR UN NUEVO USUARIO
exports.createUser = async (req, res) => {
  const { nombre_usuario, password, rol } = req.body;

  if (!nombre_usuario || !password || !rol) {
    return res.status(400).json({ msg: 'Por favor, ingrese todos los campos' });
  }

  try {
    const userQuery = 'SELECT * FROM usuarios WHERE nombre_usuario = $1';
    const existingUser = await db.query(userQuery, [nombre_usuario]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ msg: 'El nombre de usuario ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserQuery = 'INSERT INTO usuarios (nombre_usuario, password, rol) VALUES ($1, $2, $3) RETURNING id_usuario, nombre_usuario, rol';
    const { rows } = await db.query(newUserQuery, [nombre_usuario, hashedPassword, rol]);

    res.status(201).json({ msg: 'Usuario creado exitosamente', user: rows[0] });
  } catch (err) {
    console.error('Error en createUser:', err.message);
    res.status(500).send('Error en el servidor');
  }
};

// ACTUALIZAR UN USUARIO
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, rol } = req.body;

    try {
        const { rows } = await db.query(
            'UPDATE usuarios SET nombre_usuario = $1, rol = $2 WHERE id_usuario = $3 RETURNING id_usuario, nombre_usuario, rol',
            [nombre_usuario, rol, id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.json({ msg: 'Usuario actualizado', user: rows[0] });
    } catch (err) {
        console.error('Error en updateUser:', err.message);
        res.status(500).send('Error en el servidor');
    }
};

// ELIMINAR UN USUARIO
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM usuarios WHERE id_usuario = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.json({ msg: 'Usuario eliminado' });
    } catch (err) {
        console.error('Error en deleteUser:', err.message);
        res.status(500).send('Error en el servidor');
    }
};