// server/src/controllers/userController.js
const db = require('../config/db.js');
const bcrypt = require('bcryptjs');
const {
  PERMISSIONS_CATALOG,
  ALL_PERMISSION_KEYS,
  getAllPermissionsEnabled,
  getDefaultPermissionsForRole,
  isMasterAdminUser,
  resolveUserPermissions,
  logUserActivity
} = require('../services/permissionsService.js');

// @desc    Obtener catálogo de permisos y plantillas por rol
// @route   GET /api/users/permissions-catalog
// @access  Private/Admin
const getPermissionsCatalog = async (_req, res) => {
  try {
    res.json({
      catalog: PERMISSIONS_CATALOG,
      totalPermissions: ALL_PERMISSION_KEYS.length,
      templates: {
        Administrador: getDefaultPermissionsForRole('Administrador'),
        Gerente: getDefaultPermissionsForRole('Gerente'),
        Contador: getDefaultPermissionsForRole('Contador'),
        'Encargado de Inventario': getDefaultPermissionsForRole('Encargado de Inventario'),
        Cajero: getDefaultPermissionsForRole('Cajero'),
        Vendedor: getDefaultPermissionsForRole('Vendedor')
      }
    });
  } catch (error) {
    console.error('[UserController] Error en getPermissionsCatalog:', error);
    res.status(500).json({ msg: 'Error obteniendo catálogo de permisos.' });
  }
};

// @desc    Obtener todos los usuarios con sus permisos y métricas de trazabilidad
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (_req, res) => {
  try {
    const [users] = await db.query(`
      SELECT id_usuario, nombre_usuario, nombre_completo, rol, permisos_json, activo, es_principal, ultimo_acceso
      FROM usuarios
      ORDER BY es_principal DESC, id_usuario ASC
    `);

    // Métricas de ventas por usuario (histórico + hoy en hora Managua UTC-6)
    const [salesMetrics] = await db.query(`
      SELECT 
        id_usuario,
        COUNT(CASE WHEN estado != 'CANCELADA' AND total_venta >= 0 THEN 1 END) AS total_ventas,
        COALESCE(SUM(CASE WHEN estado != 'CANCELADA' THEN total_venta ELSE 0 END), 0) AS monto_total_vendido,
        COUNT(CASE WHEN estado != 'CANCELADA' AND DATE(DATE_SUB(fecha, INTERVAL 6 HOUR)) = DATE(DATE_SUB(NOW(), INTERVAL 6 HOUR)) THEN 1 END) AS ventas_hoy,
        COALESCE(SUM(CASE WHEN estado != 'CANCELADA' AND DATE(DATE_SUB(fecha, INTERVAL 6 HOUR)) = DATE(DATE_SUB(NOW(), INTERVAL 6 HOUR)) THEN total_venta ELSE 0 END), 0) AS monto_vendido_hoy,
        COUNT(CASE WHEN estado = 'CANCELADA' OR total_venta < 0 THEN 1 END) AS devoluciones_count,
        MAX(fecha) AS ultima_venta_fecha
      FROM ventas
      GROUP BY id_usuario
    `).catch(() => [[]]);

    // Métricas de cajas operadas por usuario
    const [cajaMetrics] = await db.query(`
      SELECT 
        usuario_id,
        LOWER(TRIM(usuario_nombre)) AS uname,
        COUNT(*) AS cajas_operadas,
        MAX(fecha_apertura) AS ultima_caja_fecha
      FROM cierres_caja
      GROUP BY usuario_id, LOWER(TRIM(usuario_nombre))
    `).catch(() => [[]]);

    // Métricas de auditoría por usuario
    const [auditMetrics] = await db.query(`
      SELECT 
        id_usuario,
        LOWER(TRIM(nombre_usuario)) AS uname,
        COUNT(*) AS acciones_auditadas,
        MAX(fecha) AS ultima_auditoria_fecha
      FROM auditoria_usuarios
      GROUP BY id_usuario, LOWER(TRIM(nombre_usuario))
    `).catch(() => [[]]);

    const salesByUserId = new Map();
    (salesMetrics || []).forEach(s => {
      if (s.id_usuario != null) salesByUserId.set(Number(s.id_usuario), s);
    });

    const enrichedUsers = users.map(u => {
      const isMaster = isMasterAdminUser(u);
      const permisos = resolveUserPermissions(u);
      const permisosActivosCount = ALL_PERMISSION_KEYS.filter(k => permisos[k] === true).length;

      const sMetric = salesByUserId.get(Number(u.id_usuario)) || {};
      const unameLow = String(u.nombre_usuario || '').trim().toLowerCase();

      let cajasOperadas = 0;
      let ultimaCajaFecha = null;
      (cajaMetrics || []).forEach(c => {
        if (Number(c.usuario_id) === Number(u.id_usuario) || c.uname === unameLow) {
          cajasOperadas += Number(c.cajas_operadas || 0);
          if (c.ultima_caja_fecha && (!ultimaCajaFecha || new Date(c.ultima_caja_fecha) > new Date(ultimaCajaFecha))) {
            ultimaCajaFecha = c.ultima_caja_fecha;
          }
        }
      });

      let accionesAuditadas = 0;
      let ultimaAuditoriaFecha = null;
      (auditMetrics || []).forEach(a => {
        if (Number(a.id_usuario) === Number(u.id_usuario) || a.uname === unameLow) {
          accionesAuditadas += Number(a.acciones_auditadas || 0);
          if (a.ultima_auditoria_fecha && (!ultimaAuditoriaFecha || new Date(a.ultima_auditoria_fecha) > new Date(ultimaAuditoriaFecha))) {
            ultimaAuditoriaFecha = a.ultima_auditoria_fecha;
          }
        }
      });

      const lastActivityCandidate = [u.ultimo_acceso, sMetric.ultima_venta_fecha, ultimaCajaFecha, ultimaAuditoriaFecha]
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a))[0] || null;

      return {
        id_usuario: u.id_usuario,
        nombre_usuario: u.nombre_usuario,
        nombre_completo: u.nombre_completo || u.nombre_usuario,
        rol: isMaster ? 'Administrador' : u.rol,
        es_principal: isMaster,
        activo: isMaster ? true : Number(u.activo ?? 1) === 1,
        ultimo_acceso: lastActivityCandidate,
        permisos,
        permisos_activos_count: permisosActivosCount,
        permisos_totales_count: ALL_PERMISSION_KEYS.length,
        trazabilidad: {
          total_ventas: Number(sMetric.total_ventas || 0),
          monto_total_vendido: Number(sMetric.monto_total_vendido || 0),
          ventas_hoy: Number(sMetric.ventas_hoy || 0),
          monto_vendido_hoy: Number(sMetric.monto_vendido_hoy || 0),
          devoluciones_count: Number(sMetric.devoluciones_count || 0),
          cajas_operadas: cajasOperadas,
          acciones_auditadas: accionesAuditadas,
          ultima_actividad: lastActivityCandidate
        }
      };
    });

    res.json(enrichedUsers);
  } catch (error) {
    console.error('[UserController] Error en getAllUsers:', error);
    res.status(500).send('Error en el servidor');
  }
};

// @desc    Actualizar un usuario (rol, contraseña, estado activo y matriz completa de permisos)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre_usuario, nombre_completo, rol, password, permisos, activo } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const targetUser = users[0];
    const isMaster = isMasterAdminUser(targetUser);

    // BLINDAJE ABSOLUTO DEL USUARIO PRINCIPAL 'admin' (contraseña 1987)
    if (isMaster) {
      if (password && String(password).trim() !== '1987') {
        return res.status(403).json({
          msg: 'El usuario principal "admin" está blindado por el sistema: su contraseña fija es 1987 y no puede ser modificada.'
        });
      }
      if (activo !== undefined && (activo === false || Number(activo) === 0)) {
        return res.status(403).json({
          msg: 'El usuario principal "admin" no puede ser desactivado ni suspendido.'
        });
      }
      if (rol && String(rol).trim().toLowerCase() !== 'administrador') {
        return res.status(403).json({
          msg: 'El rol del usuario principal "admin" no puede ser cambiado.'
        });
      }

      // Asegurar que siempre conserve 1987 y 100% de permisos
      const salt = await bcrypt.genSalt(10);
      const hashed1987 = await bcrypt.hash('1987', salt);
      const allPerms = getAllPermissionsEnabled();

      await db.query(
        `UPDATE usuarios 
         SET rol = 'Administrador',
             password = ?,
             permisos_json = ?,
             activo = 1,
             es_principal = 1,
             nombre_completo = COALESCE(?, nombre_completo, 'Administrador Principal')
         WHERE id_usuario = ?`,
        [hashed1987, JSON.stringify(allPerms), nombre_completo || null, id]
      );

      return res.json({
        msg: 'El usuario principal "admin" mantiene su protección total (contraseña 1987 y 100% de permisos activos).',
        permisos: allPerms
      });
    }

    // Validación para usuarios normales: no pueden renombrarse a 'admin'
    let nextUsername = targetUser.nombre_usuario;
    if (nombre_usuario && String(nombre_usuario).trim()) {
      const candidateName = String(nombre_usuario).trim();
      if (candidateName.toLowerCase() === 'admin') {
        return res.status(403).json({ msg: 'El nombre "admin" está reservado para el Administrador Principal.' });
      }
      nextUsername = candidateName;
    }

    let hashedPassword = targetUser.password;
    if (password && String(password).trim()) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(String(password).trim(), salt);
    }

    const nextRole = rol || targetUser.rol;
    const nextActivo = activo !== undefined ? (activo ? 1 : 0) : Number(targetUser.activo ?? 1);
    const nextNombreCompleto = nombre_completo !== undefined
      ? String(nombre_completo).trim()
      : (targetUser.nombre_completo || nextUsername);

    // Construir mapa de permisos actualizado
    let nextPermissions = resolveUserPermissions(targetUser);
    if (permisos && typeof permisos === 'object') {
      const cleanPerms = {};
      ALL_PERMISSION_KEYS.forEach(k => {
        cleanPerms[k] = Boolean(permisos[k]);
      });
      nextPermissions = cleanPerms;
    } else if (rol && rol !== targetUser.rol) {
      nextPermissions = getDefaultPermissionsForRole(rol);
    }

    await db.query(
      `UPDATE usuarios 
       SET nombre_usuario = ?,
           nombre_completo = ?,
           rol = ?,
           password = ?,
           permisos_json = ?,
           activo = ?
       WHERE id_usuario = ?`,
      [
        nextUsername,
        nextNombreCompleto,
        nextRole,
        hashedPassword,
        JSON.stringify(nextPermissions),
        nextActivo,
        id
      ]
    );

    const activeCount = ALL_PERMISSION_KEYS.filter(k => nextPermissions[k]).length;

    await logUserActivity({
      req,
      modulo: 'Usuarios y Permisos',
      accion: 'PERMISOS_ACTUALIZADOS',
      descripcion: `Actualizó usuario "${nextUsername}" (Rol: ${nextRole}, Estado: ${nextActivo ? 'Activo' : 'Suspendido'}, Permisos: ${activeCount}/${ALL_PERMISSION_KEYS.length}${password ? ', Contraseña cambiada' : ''})`,
      detalles: {
        id_usuario_afectado: Number(id),
        nombre_usuario: nextUsername,
        rol: nextRole,
        activo: Boolean(nextActivo),
        permisos_activos: activeCount
      }
    });

    // Notificar en tiempo real por Socket.IO para que el usuario afectado actualice sus permisos al instante
    const io = req.app?.get('io');
    if (io) {
      io.emit('users:update');
      io.emit('user:permissions_updated', {
        id_usuario: Number(id),
        nombre_usuario: nextUsername,
        nombre_completo: nextNombreCompleto,
        rol: nextRole,
        activo: Boolean(nextActivo),
        permisos: nextPermissions
      });
    }

    res.json({
      msg: 'Usuario y permisos actualizados correctamente.',
      permisos: nextPermissions
    });
  } catch (error) {
    console.error('[UserController] Error en updateUser:', error);
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      return res.status(400).json({ msg: 'El nombre de usuario ya está en uso.' });
    }
    res.status(500).json({ msg: 'Error en el servidor: ' + error.message });
  }
};

// @desc    Eliminar un usuario (Protegiendo al admin principal)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [users] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const targetUser = users[0];
    if (isMasterAdminUser(targetUser)) {
      return res.status(403).json({
        msg: 'El usuario principal "admin" (contraseña 1987) es la cuenta maestra del sistema y NO puede ser eliminado.'
      });
    }

    const [result] = await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    await logUserActivity({
      req,
      modulo: 'Usuarios',
      accion: 'USUARIO_ELIMINADO',
      descripcion: `Eliminó al usuario "${targetUser.nombre_usuario}" (Rol: ${targetUser.rol})`,
      detalles: { id_eliminado: Number(id), nombre_usuario: targetUser.nombre_usuario }
    });

    const io = req.app?.get('io');
    if (io) io.emit('users:update');

    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('[UserController] Error en deleteUser:', error);
    if (error.code === 'ER_ROW_IS_REFERENCED' || error.errno === 1451) {
      return res.status(400).json({
        msg: 'Este usuario tiene facturas o arqueos históricos vinculados para trazabilidad. Puedes suspender su acceso o desmarcar sus permisos en lugar de borrarlo.'
      });
    }
    res.status(500).json({ msg: 'Error en el servidor: ' + error.message });
  }
};

// @desc    Obtener bitácora completa de trazabilidad por usuario (Auditoría en vivo + Historial operativo)
// @route   GET /api/users/traceability
// @access  Private/Admin
const getUserTraceability = async (req, res) => {
  try {
    const { userId, modulo, search, limit = 200 } = req.query;
    const maxLimit = Math.min(500, Math.max(20, Number(limit) || 200));

    // 1. Eventos registrados en la tabla auditoria_usuarios
    const auditWhere = [];
    const auditParams = [];
    if (userId && userId !== 'todos') {
      auditWhere.push('id_usuario = ?');
      auditParams.push(Number(userId));
    }
    if (modulo && modulo !== 'todos') {
      auditWhere.push('LOWER(modulo) LIKE LOWER(?)');
      auditParams.push(`%${modulo}%`);
    }
    if (search && String(search).trim()) {
      const s = `%${String(search).trim()}%`;
      auditWhere.push('(nombre_usuario LIKE ? OR accion LIKE ? OR descripcion LIKE ? OR modulo LIKE ?)');
      auditParams.push(s, s, s, s);
    }

    const [auditRows] = await db.query(
      `SELECT id_auditoria, id_usuario, nombre_usuario, rol, modulo, accion, descripcion, detalles_json, ip, fecha
       FROM auditoria_usuarios
       ${auditWhere.length ? 'WHERE ' + auditWhere.join(' AND ') : ''}
       ORDER BY fecha DESC, id_auditoria DESC
       LIMIT ?`,
      [...auditParams, maxLimit]
    ).catch(() => [[]]);

    // 2. Historial operativo directo de tablas transaccionales (Ventas, Devoluciones, Cajas, Salidas de Inventario)
    // para que la trazabilidad muestre toda la actividad real histórica y reciente de cada usuario
    const userFilterSql = userId && userId !== 'todos' ? 'AND v.id_usuario = ?' : '';
    const userFilterParams = userId && userId !== 'todos' ? [Number(userId)] : [];

    const [recentSales] = await db.query(
      `SELECT 
         v.id_venta, v.fecha, v.total_venta, v.estado, v.id_usuario, v.pago_detalles,
         COALESCE(u.nombre_usuario, 'Usuario') AS nombre_usuario,
         COALESCE(u.rol, 'Vendedor') AS rol,
         e.nombre AS empleado_nombre,
         c.nombre AS cliente_nombre
       FROM ventas v
       LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
       LEFT JOIN empleados e ON v.id_empleado = e.id_empleado
       LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
       WHERE 1=1 ${userFilterSql}
       ORDER BY v.fecha DESC
       LIMIT 120`,
      userFilterParams
    ).catch(() => [[]]);

    const cajaFilterSql = userId && userId !== 'todos' ? 'WHERE cc.usuario_id = ?' : '';
    const [recentCajas] = await db.query(
      `SELECT 
         cc.id, cc.usuario_id, cc.usuario_nombre, cc.fecha_apertura, cc.fecha_cierre,
         cc.monto_inicial, cc.final_esperado, cc.final_real, cc.diferencia,
         u.rol
       FROM cierres_caja cc
       LEFT JOIN usuarios u ON cc.usuario_id = u.id_usuario
       ${cajaFilterSql}
       ORDER BY cc.id DESC
       LIMIT 60`,
      userFilterParams
    ).catch(() => [[]]);

    // Unificar en una línea de tiempo cronológica enriquecida
    const timeline = [];

    (auditRows || []).forEach(a => {
      timeline.push({
        uid: `audit-${a.id_auditoria}`,
        source: 'auditoria',
        id_usuario: a.id_usuario,
        nombre_usuario: a.nombre_usuario,
        rol: a.rol || 'Usuario',
        modulo: a.modulo,
        accion: a.accion,
        descripcion: a.descripcion,
        ip: a.ip,
        fecha: a.fecha
      });
    });

    (recentSales || []).forEach(v => {
      const isReturn = v.estado === 'CANCELADA' || Number(v.total_venta) < 0;
      const empTag = v.empleado_nombre ? ` · Vendedor: ${v.empleado_nombre}` : '';
      const cliTag = v.cliente_nombre ? ` · Cliente: ${v.cliente_nombre}` : '';
      timeline.push({
        uid: `sale-${v.id_venta}`,
        source: 'operacion',
        id_usuario: v.id_usuario,
        nombre_usuario: v.nombre_usuario,
        rol: v.rol,
        modulo: 'POS / Ventas',
        accion: isReturn ? 'DEVOLUCIÓN / ANULACIÓN' : 'VENTA FACTURADA',
        descripcion: `${isReturn ? 'Devolución/Anulación' : 'Factura'} #${v.id_venta} por C$ ${Number(v.total_venta || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}${empTag}${cliTag}`,
        ip: null,
        fecha: v.fecha
      });
    });

    (recentCajas || []).forEach(c => {
      const isClosed = c.fecha_cierre && String(c.fecha_cierre) > '2000-01-01';
      timeline.push({
        uid: `caja-${c.id}`,
        source: 'operacion',
        id_usuario: c.usuario_id,
        nombre_usuario: c.usuario_nombre || `Usuario #${c.usuario_id}`,
        rol: c.rol || 'Cajero',
        modulo: 'Caja y Arqueos',
        accion: isClosed ? 'CIERRE DE CAJA' : 'APERTURA DE CAJA',
        descripcion: isClosed
          ? `Caja #${c.id} cerrada · Inicial: C$ ${Number(c.monto_inicial || 0).toFixed(2)} · Esperado: C$ ${Number(c.final_esperado || 0).toFixed(2)} · Real: C$ ${Number(c.final_real || 0).toFixed(2)}`
          : `Caja #${c.id} abierta en turno · Fondo inicial: C$ ${Number(c.monto_inicial || 0).toFixed(2)}`,
        ip: null,
        fecha: isClosed ? c.fecha_cierre : c.fecha_apertura
      });
    });

    // Filtrar timeline combinado si hay filtro de módulo o búsqueda
    const filteredTimeline = timeline
      .filter(item => {
        if (modulo && modulo !== 'todos') {
          if (!String(item.modulo || '').toLowerCase().includes(String(modulo).toLowerCase())) {
            return false;
          }
        }
        if (search && String(search).trim()) {
          const q = String(search).trim().toLowerCase();
          const match =
            String(item.nombre_usuario || '').toLowerCase().includes(q) ||
            String(item.accion || '').toLowerCase().includes(q) ||
            String(item.descripcion || '').toLowerCase().includes(q) ||
            String(item.modulo || '').toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, maxLimit);

    res.json({
      total: filteredTimeline.length,
      events: filteredTimeline
    });
  } catch (error) {
    console.error('[UserController] Error en getUserTraceability:', error);
    res.status(500).json({ msg: 'Error obteniendo trazabilidad de usuarios.' });
  }
};

module.exports = {
  getAllUsers,
  getPermissionsCatalog,
  updateUser,
  deleteUser,
  getUserTraceability
};
