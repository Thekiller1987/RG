// server/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../config/db.js');
const { isMasterAdminUser, resolveUserPermissions } = require('../services/permissionsService.js');

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'secret_key_reemplazo_seguro';
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
      next();
      return;
    } catch (error) {
      return res.status(401).json({ msg: 'No autorizado, el token falló o expiró' });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: 'No autorizado, no hay token' });
  }
};

// Middleware para verificar si el usuario es Administrador o tiene permiso de gestión de usuarios
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'No autenticado.' });
    }
    if (
      req.user.rol === 'Administrador' ||
      req.user.es_principal ||
      isMasterAdminUser(req.user)
    ) {
      return next();
    }

    // Verificar en BD si el usuario tiene el permiso granular 'usuarios.acceso'
    const userId = req.user.id_usuario || req.user.id;
    const [rows] = await db.query(
      'SELECT id_usuario, nombre_usuario, rol, permisos_json, es_principal, activo FROM usuarios WHERE id_usuario = ? LIMIT 1',
      [userId]
    );
    if (rows.length > 0 && Number(rows[0].activo ?? 1) === 1) {
      const perms = resolveUserPermissions(rows[0]);
      if (perms['usuarios.acceso'] || rows[0].rol === 'Administrador' || isMasterAdminUser(rows[0])) {
        return next();
      }
    }

    return res.status(403).json({ msg: 'Acceso denegado. No cuenta con permisos administrativos para esta acción.' });
  } catch (err) {
    return res.status(500).json({ msg: 'Error verificando permisos.' });
  }
};

// Middleware reutilizable para verificar un permiso granular específico
const requirePermission = (permissionKey) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ msg: 'No autenticado.' });
      }
      if (isMasterAdminUser(req.user)) {
        return next();
      }

      const userId = req.user.id_usuario || req.user.id;
      const [rows] = await db.query(
        'SELECT id_usuario, nombre_usuario, rol, permisos_json, es_principal, activo FROM usuarios WHERE id_usuario = ? LIMIT 1',
        [userId]
      );
      if (!rows.length || Number(rows[0].activo ?? 1) === 0) {
        return res.status(403).json({ msg: 'Cuenta de usuario inactiva o no encontrada.' });
      }

      const perms = resolveUserPermissions(rows[0]);
      if (perms[permissionKey] || isMasterAdminUser(rows[0])) {
        return next();
      }

      return res.status(403).json({
        msg: `Acceso denegado. Tu usuario no tiene habilitado el permiso "${permissionKey}".`
      });
    } catch (err) {
      return res.status(500).json({ msg: 'Error validando permiso de usuario.' });
    }
  };
};

module.exports = { verifyToken, isAdmin, requirePermission };
