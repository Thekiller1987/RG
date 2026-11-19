// server/src/controllers/authController.js
const db = require('../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  resolveUserPermissions,
  getDefaultPermissionsForRole,
  isMasterAdminUser,
  logUserActivity
} = require('../services/permissionsService.js');

// Función para registrar un nuevo usuario con permisos granulares
const register = async (req, res) => {
  const { nombre_usuario, password, rol, permisos, nombre_completo } = req.body;

  if (!nombre_usuario || !password || !rol) {
    return res.status(400).json({ msg: 'Por favor, envía nombre de usuario, contraseña y rol.' });
  }

  const cleanUsername = String(nombre_usuario).trim();

  if (cleanUsername.toLowerCase() === 'admin') {
    return res.status(403).json({
      msg: 'El nombre de usuario "admin" está reservado exclusivamente para el Administrador Principal del sistema.'
    });
  }

  try {
    const [existingUsers] = await db.query(
      'SELECT id_usuario FROM usuarios WHERE LOWER(nombre_usuario) = LOWER(?)',
      [cleanUsername]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ msg: 'El nombre de usuario ya está en uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const finalPermissions =
      permisos && typeof permisos === 'object'
        ? { ...getDefaultPermissionsForRole(rol), ...permisos }
        : getDefaultPermissionsForRole(rol);

    const [result] = await db.query(
      `INSERT INTO usuarios (nombre_usuario, password, rol, permisos_json, activo, es_principal, nombre_completo)
       VALUES (?, ?, ?, ?, 1, 0, ?)`,
      [
        cleanUsername,
        hashedPassword,
        rol,
        JSON.stringify(finalPermissions),
        nombre_completo ? String(nombre_completo).trim() : cleanUsername
      ]
    );

    await logUserActivity({
      req,
      modulo: 'Usuarios',
      accion: 'USUARIO_CREADO',
      descripcion: `Creó al usuario "${cleanUsername}" con rol "${rol}"`,
      detalles: { nuevo_id: result.insertId, nombre_usuario: cleanUsername, rol }
    });

    const io = req.app?.get('io');
    if (io) io.emit('users:update');

    res.status(201).json({
      msg: 'Usuario creado exitosamente con sus permisos configurados.',
      id_usuario: result.insertId
    });
  } catch (error) {
    console.error('[Auth Register] Error:', error);
    res.status(500).json({ msg: 'Error en el servidor al crear usuario.' });
  }
};

// Función para el login de un usuario
const login = async (req, res) => {
  const { nombre_usuario, password } = req.body;

  if (!nombre_usuario || !password) {
    return res.status(400).json({ msg: 'Por favor, envía usuario y contraseña' });
  }

  try {
    const [users] = await db.query(
      'SELECT * FROM usuarios WHERE nombre_usuario = ? LIMIT 1',
      [nombre_usuario.trim()]
    );

    if (users.length === 0) {
      return res.status(400).json({ msg: 'Usuario no encontrado' });
    }
    const user = users[0];
    const isMaster = isMasterAdminUser(user);

    // Verificar si la cuenta está suspendida (el admin principal nunca puede ser suspendido)
    if (!isMaster && user.activo !== undefined && Number(user.activo) === 0) {
      await logUserActivity({
        id_usuario: user.id_usuario,
        nombre_usuario: user.nombre_usuario,
        rol: user.rol,
        modulo: 'Autenticación',
        accion: 'LOGIN_BLOQUEADO',
        descripcion: `Intento de acceso en cuenta suspendida (${user.nombre_usuario})`,
        req
      });
      return res.status(403).json({
        msg: 'Tu cuenta de usuario está suspendida temporalmente. Contacta al Administrador Principal.'
      });
    }

    // Verificar contraseña (para el usuario 'admin' principal, '1987' siempre es válida)
    let isMatch = false;
    if (isMaster && String(password).trim() === '1987') {
      isMatch = true;
    } else {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      await logUserActivity({
        id_usuario: user.id_usuario,
        nombre_usuario: user.nombre_usuario,
        rol: user.rol,
        modulo: 'Autenticación',
        accion: 'LOGIN_FALLIDO',
        descripcion: `Contraseña incorrecta para el usuario "${user.nombre_usuario}"`,
        req
      });
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }

    // Actualizar fecha de último acceso
    await db.query('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id_usuario = ?', [user.id_usuario]).catch(() => {});

    const permisos = resolveUserPermissions(user);
    const effectiveRole = isMaster ? 'Administrador' : user.rol;

    const payload = {
      id: user.id_usuario,
      id_usuario: user.id_usuario,
      rol: effectiveRole,
      es_principal: isMaster,
      nombre_usuario: user.nombre_usuario,
      nombre: user.nombre_completo || user.nombre || user.nombre_usuario
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_key_reemplazo_seguro', {
      expiresIn: '24h'
    });

    await logUserActivity({
      id_usuario: user.id_usuario,
      nombre_usuario: user.nombre_usuario,
      rol: effectiveRole,
      modulo: 'Autenticación',
      accion: 'LOGIN_EXITOSO',
      descripcion: `Inicio de sesión exitoso en el sistema (${effectiveRole})`,
      req
    });

    res.json({
      msg: 'Login exitoso',
      token,
      user: {
        id: user.id_usuario,
        id_usuario: user.id_usuario,
        nombre: user.nombre_usuario,
        nombre_usuario: user.nombre_usuario,
        nombre_completo: user.nombre_completo || user.nombre_usuario,
        rol: effectiveRole,
        es_principal: isMaster,
        activo: true,
        permisos
      }
    });
  } catch (error) {
    console.error('[Auth Login] Error:', error);
    res.status(500).send('Error en el servidor');
  }
};

// Función para obtener los datos y permisos actualizados del usuario actual a partir del token
const me = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.id_usuario;
    const [users] = await db.query(
      'SELECT id_usuario, nombre_usuario, nombre_completo, rol, permisos_json, activo, es_principal, ultimo_acceso FROM usuarios WHERE id_usuario = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const u = users[0];
    const isMaster = isMasterAdminUser(u);

    if (!isMaster && u.activo !== undefined && Number(u.activo) === 0) {
      return res.status(401).json({ msg: 'Cuenta de usuario desactivada.' });
    }

    const permisos = resolveUserPermissions(u);
    const effectiveRole = isMaster ? 'Administrador' : u.rol;

    res.json({
      id: u.id_usuario,
      id_usuario: u.id_usuario,
      nombre: u.nombre_usuario,
      nombre_usuario: u.nombre_usuario,
      nombre_completo: u.nombre_completo || u.nombre_usuario,
      rol: effectiveRole,
      es_principal: isMaster,
      activo: isMaster ? true : Number(u.activo ?? 1) === 1,
      ultimo_acceso: u.ultimo_acceso,
      permisos
    });
  } catch (error) {
    console.error('[Auth Me] Error:', error);
    res.status(500).send('Error en el servidor');
  }
};

module.exports = { login, register, me };
