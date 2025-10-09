const { pool } = require('../config/db.js'); // Importamos el pool desestructurado
const bcrypt = require('../../node_modules/bcryptjs/umd/index.js');
const jwt = require('jsonwebtoken');

// Función para registrar un nuevo usuario
const register = async (req, res) => {
  const { nombre_usuario, password, rol } = req.body;

  if (!nombre_usuario || !password || !rol) {
    return res.status(400).json({ msg: 'Por favor, envía todos los campos' });
  }

  try {
    // 1. Verificar si el usuario ya existe
    // CAMBIO: Usar pool.query() y $1
    const resultExisting = await pool.query('SELECT * FROM usuarios WHERE nombre_usuario = $1', [nombre_usuario]);
    const existingUsers = resultExisting.rows; // CAMBIO: Obtener resultados de .rows

    if (existingUsers.length > 0) {
      return res.status(400).json({ msg: 'El nombre de usuario ya está en uso' });
    }

    // 2. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insertar el nuevo usuario
    // CAMBIO: Usar $1, $2, $3 para los parámetros
    await pool.query('INSERT INTO usuarios (nombre_usuario, password, rol) VALUES ($1, $2, $3)', [nombre_usuario, hashedPassword, rol]);

    res.status(201).json({ msg: 'Usuario creado exitosamente' });

  } catch (error) {
    // Mantenemos el console.error para debugging en Netlify Logs
    console.error('Error en el servidor durante el registro:', error); 
    res.status(500).send('Error en el servidor');
  }
};


// Función para el login de un usuario
const login = async (req, res) => {
  const { nombre_usuario, password } = req.body;

  // Validar que se recibieron los datos
  if (!nombre_usuario || !password) {
    return res.status(400).json({ msg: 'Por favor, envía usuario y contraseña' });
  }

  try {
    // 1. Buscar al usuario en la base de datos
    // CAMBIO: Usar pool.query() y $1
    const resultUsers = await pool.query('SELECT * FROM usuarios WHERE nombre_usuario = $1', [nombre_usuario]);
    const users = resultUsers.rows; // CAMBIO: Obtener resultados de .rows
    
    if (users.length === 0) {
      return res.status(400).json({ msg: 'Usuario no encontrado' });
    }
    const user = users[0];

    // 2. Comparar la contraseña enviada con la encriptada en la BD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }

    // 3. Si todo es correcto, crear el token
    const payload = {
      id: user.id_usuario,
      rol: user.rol,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '8h', 
    });

    // 4. Enviar el token al cliente
    res.json({
      msg: 'Login exitoso',
      token,
      user: {
        id: user.id_usuario,
        nombre: user.nombre_usuario,
        rol: user.rol,
      }
    });

  } catch (error) {
    // Mantenemos el console.error para debugging en Netlify Logs
    console.error('Error en el servidor durante el login:', error);
    res.status(500).send('Error en el servidor');
  }
};

module.exports = { login, register };