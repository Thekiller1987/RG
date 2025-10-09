// ==========================================================
// ARCHIVO: server/src/middleware/authMiddleware.js
// VERSIÓN FINAL Y CORREGIDA
// ==========================================================

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Exportamos directamente la función del middleware
module.exports = function (req, res, next) {
  // 1. Obtener el token del header
  const authHeader = req.header('Authorization');

  // 2. Verificar si no hay token o si no tiene el formato correcto
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  try {
    // 3. Extraer el token (quitando "Bearer ")
    const token = authHeader.split(' ')[1];

    // 4. Verificar el token con el secreto
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Si es válido, adjuntar el payload del usuario a la petición
    req.user = decoded.user;

    // 6. Continuar al siguiente paso (el controlador)
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token no es válido' });
  }
};