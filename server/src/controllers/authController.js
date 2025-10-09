// ==========================================================
// ARCHIVO: server/src/controllers/authController.js
// VERSIÓN CORREGIDA PARA SUPABASE (PostgreSQL)
// ==========================================================

const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { nombre_usuario, password } = req.body;

  if (!nombre_usuario || !password) {
    return res.status(400).json({ msg: 'Por favor, ingrese todos los campos' });
  }

  try {
    // CORRECCIÓN: Se usa $1 en lugar de ? para la consulta de PostgreSQL
    const userQuery = 'SELECT * FROM usuarios WHERE nombre_usuario = $1';
    const { rows } = await db.query(userQuery, [nombre_usuario]);
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const payload = {
      user: {
        id: user.id_usuario,
        rol: user.rol,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        // Se devuelve el token y los datos del usuario para el frontend
        res.json({
          token,
          user: {
            id: user.id_usuario,
            nombre: user.nombre_usuario,
            rol: user.rol,
          },
        });
      }
    );
  } catch (err) {
    console.error('Error en el controlador de login:', err.message);
    res.status(500).send('Error en el servidor');
  }
};

exports.getMe = async (req, res) => {
    try {
        // CORRECCIÓN: Se usa $1 en lugar de ?
        const userQuery = 'SELECT id_usuario, nombre_usuario, rol FROM usuarios WHERE id_usuario = $1';
        const { rows } = await db.query(userQuery, [req.user.id]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el Servidor');
    }
};