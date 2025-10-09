// ==========================================================
// ARCHIVO: server/src/controllers/authController.js
// VERSIÓN DE DIAGNÓSTICO (TEMPORAL Y NO SEGURA)
// ==========================================================

const db = require('../config/db');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs'); // Comentamos bcrypt temporalmente

exports.login = async (req, res) => {
  const { nombre_usuario, password } = req.body;
  console.log(`--- [DIAGNÓSTICO] Intento de login para usuario: ${nombre_usuario} ---`);

  if (!nombre_usuario || !password) {
    return res.status(400).json({ msg: 'Por favor, ingrese todos los campos' });
  }

  try {
    const userQuery = 'SELECT * FROM usuarios WHERE nombre_usuario = $1';
    const { rows } = await db.query(userQuery, [nombre_usuario]);
    const user = rows[0];

    if (!user) {
      console.log(`--- [DIAGNÓSTICO] Usuario '${nombre_usuario}' no encontrado en la BD.`);
      return res.status(400).json({ msg: 'Usuario no encontrado' });
    }

    // --- PRUEBA DE DIAGNÓSTICO ---
    // En lugar de comparar la contraseña, simplemente devolveremos el usuario si lo encontramos.
    // Esto nos dirá si la conexión y la consulta a la base de datos funcionan.
    console.log(`--- [DIAGNÓSTICO] ¡Usuario encontrado! Saltando comparación de contraseña.`);
    console.log(user);

    const payload = { user: { id: user.id_usuario, rol: user.rol } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        console.log(`--- [DIAGNÓSTICO] Token generado exitosamente.`);
        res.json({
          token,
          user: { id: user.id_usuario, nombre: user.nombre_usuario, rol: user.rol },
        });
      }
    );
    
  } catch (err) {
    console.error('--- [DIAGNÓSTICO] Error en el controlador de login:', err.message);
    res.status(500).send('Error en el servidor durante el diagnóstico');
  }
};

exports.getMe = async (req, res) => {
    try {
        const userQuery = 'SELECT id_usuario, nombre_usuario, rol FROM usuarios WHERE id_usuario = $1';
        const { rows } = await db.query(userQuery, [req.user.id]);
        if (!rows[0]) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el Servidor');
    }
};