// server/src/services/permissionsService.js
const db = require('../config/db.js');
const bcrypt = require('bcryptjs');

/**
 * Catálogo maestro de permisos granulares del sistema Multirepuestos RG.
 * Cada permiso controla si el usuario puede VER un módulo o EJECUTAR una acción específica.
 */
const PERMISSIONS_CATALOG = [
  // 1. Punto de Venta (POS)
  { key: 'pos.acceso', category: 'Punto de Venta (POS)', label: 'Acceder al Punto de Venta (POS)', description: 'Permite entrar a la pantalla de facturación POS' },
  { key: 'pos.cobrar', category: 'Punto de Venta (POS)', label: 'Facturar y cobrar ventas', description: 'Permite procesar y emitir facturas de venta' },
  { key: 'pos.descuentos', category: 'Punto de Venta (POS)', label: 'Aplicar descuentos y modificar precios', description: 'Permite otorgar descuentos o ajustar precio en el carrito' },
  { key: 'pos.venta_credito', category: 'Punto de Venta (POS)', label: 'Facturar ventas al crédito', description: 'Permite emitir facturas a crédito a clientes autorizados' },
  { key: 'pos.devoluciones', category: 'Punto de Venta (POS)', label: 'Realizar devoluciones y anular facturas', description: 'Permite procesar devoluciones parciales/totales o cancelar tickets' },
  { key: 'pos.historial_ventas', category: 'Punto de Venta (POS)', label: 'Ver historial de ventas en POS', description: 'Permite abrir el modal de historial de tickets emitidos' },
  { key: 'pos.cambiar_vendedor', category: 'Punto de Venta (POS)', label: 'Asignar o cambiar vendedor en factura', description: 'Permite elegir qué empleado comisiona la venta' },

  // 2. Venta Mayorista y Proformas
  { key: 'pos_mayorista.acceso', category: 'Mayorista y Proformas', label: 'Acceder a Venta Mayorista', description: 'Permite entrar al portal y POS de ventas al por mayor' },
  { key: 'mayorista.promociones', category: 'Mayorista y Proformas', label: 'Gestionar promociones mayoristas', description: 'Permite crear, editar o activar promociones de mayoreo' },
  { key: 'mayorista.catalogo', category: 'Mayorista y Proformas', label: 'Ver catálogo mayorista', description: 'Permite consultar el catálogo de precios al por mayor' },
  { key: 'pedidos_apartados.acceso', category: 'Mayorista y Proformas', label: 'Ver Proformas, Pedidos y Apartados', description: 'Permite acceder al módulo de cotizaciones y apartados' },
  { key: 'pedidos_apartados.gestionar', category: 'Mayorista y Proformas', label: 'Crear y editar proformas/apartados', description: 'Permite guardar, modificar o convertir proformas y apartados' },

  // 3. Caja y Arqueos
  { key: 'caja.abrir_cerrar', category: 'Caja y Arqueos', label: 'Abrir y cerrar turno de caja', description: 'Permite realizar apertura y cierre/arqueo de su turno de caja' },
  { key: 'caja.movimientos', category: 'Caja y Arqueos', label: 'Registrar entradas y salidas de caja', description: 'Permite registrar gastos o ingresos manuales de efectivo en cajón' },
  { key: 'caja.ajuste_secreto', category: 'Caja y Arqueos', label: 'Acceso al Menú Secreto de Caja', description: 'Permite usar el ajuste especial de caja con PIN administrativo' },
  { key: 'caja_reportes.ver', category: 'Caja y Arqueos', label: 'Ver módulo Gestión y Reportes de Cajas', description: 'Permite entrar al panel consolidado de arqueos y cajas' },
  { key: 'caja_reportes.auditar', category: 'Caja y Arqueos', label: 'Auditar todas las cajas y turnos', description: 'Permite inspeccionar detalles completos de cualquier cajero' },

  // 4. Inventario, Carga Masiva y Traslados
  { key: 'inventario.ver', category: 'Inventario y Bodega', label: 'Ver módulo de Inventario', description: 'Permite consultar la lista de productos y existencias' },
  { key: 'inventario.crear', category: 'Inventario y Bodega', label: 'Crear nuevos productos, categorías y proveedores', description: 'Permite registrar nuevos ítems en el catálogo' },
  { key: 'inventario.editar', category: 'Inventario y Bodega', label: 'Editar productos, stock y precios', description: 'Permite modificar existencias, nombres, códigos y precios de venta' },
  { key: 'inventario.eliminar', category: 'Inventario y Bodega', label: 'Eliminar productos del inventario', description: 'Permite borrar productos del catálogo' },
  { key: 'inventario.ver_costos', category: 'Inventario y Bodega', label: 'Ver precios de costo y márgenes', description: 'Permite visualizar cuánto cuesta cada repuesto y su margen' },
  { key: 'inventario.codigos_barra', category: 'Inventario y Bodega', label: 'Generar e imprimir códigos de barra / tickets', description: 'Permite usar el generador de etiquetas de código de barras' },
  { key: 'carga_masiva.acceso', category: 'Inventario y Bodega', label: 'Acceder a Carga Masiva (CSV)', description: 'Permite importar o actualizar inventario por lotes desde archivo' },
  { key: 'salidas_inventario.acceso', category: 'Inventario y Bodega', label: 'Acceder a Traslados y Salidas de Inventario', description: 'Permite descontar mercancía por traslados, garantía o merma' },

  // 5. Clientes, Créditos, Proveedores y Solicitudes
  { key: 'clientes_creditos.ver', category: 'Clientes, Créditos y Proveedores', label: 'Ver módulo Clientes y Créditos', description: 'Permite consultar cartera de clientes y estados de cuenta' },
  { key: 'clientes.crear_editar', category: 'Clientes, Créditos y Proveedores', label: 'Crear y editar clientes / límites de crédito', description: 'Permite dar de alta clientes y modificar sus datos o cupo' },
  { key: 'clientes.registrar_abono', category: 'Clientes, Créditos y Proveedores', label: 'Registrar abonos de clientes', description: 'Permite cobrar y aplicar abonos a cuentas por cobrar' },
  { key: 'clientes.anular_abono', category: 'Clientes, Créditos y Proveedores', label: 'Anular abonos registrados', description: 'Permite revertir un abono aplicado a un cliente' },
  { key: 'clientes.eliminar', category: 'Clientes, Créditos y Proveedores', label: 'Eliminar clientes', description: 'Permite borrar registros de clientes sin saldo' },
  { key: 'facturas_proveedores.acceso', category: 'Clientes, Créditos y Proveedores', label: 'Ver y gestionar Facturas de Proveedores', description: 'Permite controlar cuentas por pagar y vencimientos de proveedores' },
  { key: 'solicitudes.acceso', category: 'Clientes, Créditos y Proveedores', label: 'Ver y registrar Solicitudes de Repuestos', description: 'Permite anotar y gestionar pedidos o repuestos solicitados' },

  // 6. Finanzas, Reportes, IA y Administración
  { key: 'finanzas.ver', category: 'Finanzas, Reportes y Administración', label: 'Ver Dashboard Financiero', description: 'Permite ver ventas totales, ganancias, valor de inventario y gráficas' },
  { key: 'finanzas.registrar_movimientos', category: 'Finanzas, Reportes y Administración', label: 'Registrar ingresos y egresos financieros', description: 'Permite cargar gastos operativos o ingresos extra en Finanzas' },
  { key: 'reportes_ventas.ver', category: 'Finanzas, Reportes y Administración', label: 'Ver Reporte de Ventas Detallado', description: 'Permite auditar ventas por producto, rango de fechas y usuario' },
  { key: 'bi_consola.ver', category: 'Finanzas, Reportes y Administración', label: 'Ver Consola BI & Analítica', description: 'Permite acceder al panel ejecutivo de Inteligencia de Negocios' },
  { key: 'empleados.acceso', category: 'Finanzas, Reportes y Administración', label: 'Gestionar Empleados y Vendedores', description: 'Permite administrar la plantilla básica de vendedores activos' },
  { key: 'usuarios.acceso', category: 'Finanzas, Reportes y Administración', label: 'Gestionar Usuarios, Permisos y Trazabilidad', description: 'Permite crear usuarios, marcar permisos y auditar acciones' },
  { key: 'configuracion.acceso', category: 'Finanzas, Reportes y Administración', label: 'Modificar Configuración del Negocio', description: 'Permite editar datos de empresa, RUC, teléfonos y formato de ticket' },
  { key: 'ia_asistente.acceso', category: 'Finanzas, Reportes y Administración', label: 'Usar Asistente de Inteligencia Artificial (ADA)', description: 'Permite abrir y consultar el asistente flotante de IA' },

  // 7. Planilla, Nómina y Comisiones por Ganancia (Exclusivo Dueño / Usuarios Especiales)
  { key: 'planilla.acceso', category: 'Planilla y Comisiones (Especial / Dueño)', label: 'Acceder a Planilla y Pago por Comisiones', description: 'Acceso exclusivo para ver cálculos de nómina y comisiones de empleados' },
  { key: 'planilla.ver_ganancias', category: 'Planilla y Comisiones (Especial / Dueño)', label: 'Ver ganancia real generada por cada vendedor', description: 'Permite ver costos vs precios de venta y utilidad neta por empleado' },
  { key: 'planilla.reglas_comision', category: 'Planilla y Comisiones (Especial / Dueño)', label: 'Configurar salarios y reglas de comisión sobre ganancia', description: 'Permite definir porcentajes sobre ganancia, metas mínimas, márgenes y bonos' },
  { key: 'planilla.liquidar_pagos', category: 'Planilla y Comisiones (Especial / Dueño)', label: 'Registrar pagos de planilla, vales y colillas', description: 'Permite liquidar comisiones, aplicar deducciones/adelantos e imprimir colillas' }
];

const ALL_PERMISSION_KEYS = PERMISSIONS_CATALOG.map(p => p.key);

/**
 * Construye un objeto con todos los permisos en true (para admin principal y plantilla Administrador)
 */
function getAllPermissionsEnabled() {
  const map = {};
  ALL_PERMISSION_KEYS.forEach(k => { map[k] = true; });
  return map;
}

/**
 * Construye los permisos por defecto según el nombre del rol (Plantillas rápidas)
 */
function getDefaultPermissionsForRole(rol = 'Vendedor') {
  const norm = String(rol || '').trim().toLowerCase();
  if (norm === 'administrador' || norm === 'admin') {
    return getAllPermissionsEnabled();
  }

  const base = {};
  ALL_PERMISSION_KEYS.forEach(k => { base[k] = false; });

  if (norm === 'gerente' || norm === 'supervisor') {
    ALL_PERMISSION_KEYS.forEach(k => { base[k] = true; });
    base['caja.ajuste_secreto'] = false;
    base['usuarios.acceso'] = false;
    base['inventario.eliminar'] = false;
    base['clientes.eliminar'] = false;
    // Planilla y comisiones sobre ganancia queda reservado para Dueño / Usuarios Especiales
    base['planilla.acceso'] = false;
    base['planilla.ver_ganancias'] = false;
    base['planilla.reglas_comision'] = false;
    base['planilla.liquidar_pagos'] = false;
    return base;
  }

  if (norm === 'contador' || norm === 'encargado de finanzas') {
    base['clientes_creditos.ver'] = true;
    base['clientes.crear_editar'] = true;
    base['clientes.registrar_abono'] = true;
    base['facturas_proveedores.acceso'] = true;
    base['caja_reportes.ver'] = true;
    base['caja_reportes.auditar'] = true;
    base['finanzas.ver'] = true;
    base['finanzas.registrar_movimientos'] = true;
    base['reportes_ventas.ver'] = true;
    base['bi_consola.ver'] = true;
    base['inventario.ver'] = true;
    base['inventario.ver_costos'] = true;
    base['solicitudes.acceso'] = true;
    return base;
  }

  if (norm === 'encargado de inventario' || norm === 'bodeguero' || norm === 'inventario') {
    base['inventario.ver'] = true;
    base['inventario.crear'] = true;
    base['inventario.editar'] = true;
    base['inventario.codigos_barra'] = true;
    base['carga_masiva.acceso'] = true;
    base['salidas_inventario.acceso'] = true;
    base['mayorista.catalogo'] = true;
    base['pedidos_apartados.acceso'] = true;
    base['solicitudes.acceso'] = true;
    return base;
  }

  if (norm === 'cajero') {
    base['pos.acceso'] = true;
    base['pos.cobrar'] = true;
    base['pos.venta_credito'] = true;
    base['pos.historial_ventas'] = true;
    base['pos.cambiar_vendedor'] = true;
    base['caja.abrir_cerrar'] = true;
    base['caja.movimientos'] = true;
    base['pedidos_apartados.acceso'] = true;
    base['pedidos_apartados.gestionar'] = true;
    base['clientes_creditos.ver'] = true;
    base['clientes.registrar_abono'] = true;
    base['solicitudes.acceso'] = true;
    return base;
  }

  // Por defecto: Vendedor / Empleado
  base['pos.acceso'] = true;
  base['pos.cobrar'] = true;
  base['pos.historial_ventas'] = true;
  base['pos.cambiar_vendedor'] = true;
  base['caja.abrir_cerrar'] = true;
  base['pedidos_apartados.acceso'] = true;
  base['pedidos_apartados.gestionar'] = true;
  base['clientes_creditos.ver'] = true;
  base['inventario.ver'] = true;
  base['solicitudes.acceso'] = true;
  return base;
}

/**
 * Verifica si un usuario es el Super Administrador Principal inmutable ('admin')
 */
function isMasterAdminUser(userOrName) {
  if (!userOrName) return false;
  if (typeof userOrName === 'string') {
    return userOrName.trim().toLowerCase() === 'admin';
  }
  const username = String(userOrName.nombre_usuario || userOrName.nombre || '').trim().toLowerCase();
  return username === 'admin' || Number(userOrName.es_principal) === 1;
}

/**
 * Parsea y normaliza el mapa de permisos de un registro de usuario de la BD
 */
function resolveUserPermissions(userRow) {
  if (!userRow) return {};
  if (isMasterAdminUser(userRow)) {
    return getAllPermissionsEnabled();
  }

  const roleDefaults = getDefaultPermissionsForRole(userRow.rol);
  if (!userRow.permisos_json) {
    return roleDefaults;
  }

  try {
    const parsed = typeof userRow.permisos_json === 'string'
      ? JSON.parse(userRow.permisos_json)
      : userRow.permisos_json;

    if (parsed && typeof parsed === 'object') {
      const merged = { ...roleDefaults };
      ALL_PERMISSION_KEYS.forEach(k => {
        if (typeof parsed[k] === 'boolean') {
          merged[k] = parsed[k];
        }
      });
      return merged;
    }
  } catch (e) {
    // Fallback a permisos por rol si el JSON estaba corrupto
  }
  return roleDefaults;
}

/**
 * Registra un evento en la bitácora de trazabilidad de usuarios (`auditoria_usuarios`)
 */
async function logUserActivity({
  id_usuario = null,
  nombre_usuario = 'Sistema',
  rol = null,
  modulo = 'General',
  accion = 'ACCION',
  descripcion = '',
  detalles = null,
  req = null
}) {
  try {
    const userId = id_usuario || req?.user?.id_usuario || req?.user?.id || null;
    let userName = nombre_usuario;
    let userRole = rol || req?.user?.rol || null;

    if ((!userName || userName === 'Sistema') && req?.user) {
      userName = req.user.nombre_usuario || req.user.nombre || `Usuario #${userId}`;
    }

    const ip = req
      ? (req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '').toString().substring(0, 60)
      : null;

    const detallesStr = detalles
      ? (typeof detalles === 'string' ? detalles : JSON.stringify(detalles))
      : null;

    await db.query(
      `INSERT INTO auditoria_usuarios 
        (id_usuario, nombre_usuario, rol, modulo, accion, descripcion, detalles_json, ip, fecha)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [userId, String(userName || 'Usuario').substring(0, 100), userRole, modulo, accion, descripcion, detallesStr, ip]
    );
  } catch (err) {
    console.error('[AuditLog] Error registrando actividad:', err.message);
  }
}

/**
 * Inicializa las columnas de permisos, la tabla de auditoría/trazabilidad,
 * y blinda al usuario principal 'admin' con contraseña '1987' y todos los permisos.
 */
async function initPermissionsAndAuditSchema() {
  try {
    // 1. Crear tabla de auditoría y trazabilidad de usuarios
    await db.query(`
      CREATE TABLE IF NOT EXISTS auditoria_usuarios (
        id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
        id_usuario INT NULL,
        nombre_usuario VARCHAR(100) NOT NULL,
        rol VARCHAR(60) NULL,
        modulo VARCHAR(80) NOT NULL,
        accion VARCHAR(120) NOT NULL,
        descripcion TEXT NULL,
        detalles_json LONGTEXT NULL,
        ip VARCHAR(64) NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_audit_user (id_usuario),
        INDEX idx_audit_fecha (fecha),
        INDEX idx_audit_modulo (modulo)
      )
    `);

    // 2. Verificar/agregar columnas en tabla `usuarios`
    const [cols] = await db.query(`SHOW COLUMNS FROM usuarios`);
    const colNames = new Set(cols.map(c => c.Field));

    if (!colNames.has('permisos_json')) {
      await db.query(`ALTER TABLE usuarios ADD COLUMN permisos_json LONGTEXT NULL`);
    }
    if (!colNames.has('activo')) {
      await db.query(`ALTER TABLE usuarios ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1`);
    }
    if (!colNames.has('es_principal')) {
      await db.query(`ALTER TABLE usuarios ADD COLUMN es_principal TINYINT(1) NOT NULL DEFAULT 0`);
    }
    if (!colNames.has('nombre_completo')) {
      await db.query(`ALTER TABLE usuarios ADD COLUMN nombre_completo VARCHAR(150) NULL`);
    }
    if (!colNames.has('ultimo_acceso')) {
      await db.query(`ALTER TABLE usuarios ADD COLUMN ultimo_acceso DATETIME NULL`);
    }

    // 3. Blindar usuario principal 'admin' con contraseña '1987' y 100% de permisos
    const allPermsJson = JSON.stringify(getAllPermissionsEnabled());
    const salt = await bcrypt.genSalt(10);
    const hashed1987 = await bcrypt.hash('1987', salt);

    const [adminRows] = await db.query(
      `SELECT id_usuario, password FROM usuarios WHERE LOWER(nombre_usuario) = 'admin' LIMIT 1`
    );

    if (adminRows.length > 0) {
      const adminId = adminRows[0].id_usuario;
      const is1987 = await bcrypt.compare('1987', adminRows[0].password || '').catch(() => false);
      const pwdToUse = is1987 ? adminRows[0].password : hashed1987;

      await db.query(
        `UPDATE usuarios 
         SET rol = 'Administrador',
             password = ?,
             permisos_json = ?,
             activo = 1,
             es_principal = 1,
             nombre_completo = COALESCE(nombre_completo, 'Administrador Principal')
         WHERE id_usuario = ?`,
        [pwdToUse, allPermsJson, adminId]
      );
    } else {
      await db.query(
        `INSERT INTO usuarios (nombre_usuario, password, rol, permisos_json, activo, es_principal, nombre_completo)
         VALUES ('admin', ?, 'Administrador', ?, 1, 1, 'Administrador Principal')`,
        [hashed1987, allPermsJson]
      );
    }

    // 4. Inicializar o completar nuevas llaves de permisos en usuarios existentes
    const [existingUsers] = await db.query(
      `SELECT id_usuario, nombre_usuario, rol, permisos_json FROM usuarios WHERE LOWER(nombre_usuario) != 'admin'`
    );
    for (const u of existingUsers) {
      const resolved = resolveUserPermissions(u);
      await db.query(
        `UPDATE usuarios SET permisos_json = ? WHERE id_usuario = ?`,
        [JSON.stringify(resolved), u.id_usuario]
      );
    }

    // 5. Inicializar esquema de Planilla, Nómina y Comisiones por Reglas de Ganancia en `empleados`
    try {
      const [empCols] = await db.query(`SHOW COLUMNS FROM empleados`);
      const empColNames = new Set(empCols.map(c => c.Field));

      const alterQueries = [
        ['id_usuario_vinculado', 'ALTER TABLE empleados ADD COLUMN id_usuario_vinculado INT NULL'],
        ['salario_base', 'ALTER TABLE empleados ADD COLUMN salario_base DECIMAL(12,2) NOT NULL DEFAULT 0.00'],
        ['frecuencia_pago', "ALTER TABLE empleados ADD COLUMN frecuencia_pago VARCHAR(30) NOT NULL DEFAULT 'Quincenal'"],
        ['tipo_comision', "ALTER TABLE empleados ADD COLUMN tipo_comision VARCHAR(40) NOT NULL DEFAULT 'PORCENTAJE_GANANCIA'"],
        ['porcentaje_comision_ganancia', 'ALTER TABLE empleados ADD COLUMN porcentaje_comision_ganancia DECIMAL(6,2) NOT NULL DEFAULT 5.00'],
        ['porcentaje_comision_venta', 'ALTER TABLE empleados ADD COLUMN porcentaje_comision_venta DECIMAL(6,2) NOT NULL DEFAULT 0.00'],
        ['meta_ganancia_minima', 'ALTER TABLE empleados ADD COLUMN meta_ganancia_minima DECIMAL(12,2) NOT NULL DEFAULT 0.00'],
        ['margen_minimo_producto', 'ALTER TABLE empleados ADD COLUMN margen_minimo_producto DECIMAL(6,2) NOT NULL DEFAULT 0.00'],
        ['meta_ganancia_objetivo', 'ALTER TABLE empleados ADD COLUMN meta_ganancia_objetivo DECIMAL(12,2) NOT NULL DEFAULT 0.00'],
        ['porcentaje_nivel2_ganancia', 'ALTER TABLE empleados ADD COLUMN porcentaje_nivel2_ganancia DECIMAL(6,2) NOT NULL DEFAULT 0.00'],
        ['bono_meta_ganancia', 'ALTER TABLE empleados ADD COLUMN bono_meta_ganancia DECIMAL(12,2) NOT NULL DEFAULT 0.00'],
        ['incluir_ventas_usuario', 'ALTER TABLE empleados ADD COLUMN incluir_ventas_usuario TINYINT(1) NOT NULL DEFAULT 1'],
        ['notas_contrato', 'ALTER TABLE empleados ADD COLUMN notas_contrato TEXT NULL']
      ];

      for (const [col, sql] of alterQueries) {
        if (!empColNames.has(col)) {
          await db.query(sql);
        }
      }

      // Auto-vincular empleados existentes con usuarios del sistema por nombre en JS (evitando conflictos de collation MySQL)
      try {
        const [allEmps] = await db.query('SELECT id_empleado, nombre, id_usuario_vinculado FROM empleados');
        const [allUsrs] = await db.query('SELECT id_usuario, nombre_usuario FROM usuarios');
        for (const emp of allEmps) {
          if (emp.id_usuario_vinculado) continue;
          const eName = String(emp.nombre || '').trim().toLowerCase();
          const matchedUser = allUsrs.find(u => {
            const uName = String(u.nombre_usuario || '').trim().toLowerCase();
            return (
              eName === uName ||
              (eName.includes('waskar') && uName.includes('waskar')) ||
              (eName.includes('miguelito') && uName.includes('miguelito')) ||
              (eName.includes('walter') && uName.includes('walter')) ||
              (eName.includes('lisa') && uName.includes('lisa'))
            );
          });
          if (matchedUser) {
            await db.query('UPDATE empleados SET id_usuario_vinculado = ? WHERE id_empleado = ?', [
              matchedUser.id_usuario,
              emp.id_empleado
            ]);
          }
        }
      } catch (_) {}

      await db.query(`
        CREATE TABLE IF NOT EXISTS planilla_movimientos (
          id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
          id_empleado INT NOT NULL,
          tipo VARCHAR(30) NOT NULL,
          monto DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          concepto VARCHAR(255) NOT NULL,
          fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
          liquidado TINYINT(1) NOT NULL DEFAULT 0,
          id_pago_planilla INT NULL,
          registrado_por VARCHAR(100) NULL,
          INDEX idx_pm_emp (id_empleado),
          INDEX idx_pm_fecha (fecha)
        )
      `);

      await db.query(`
        CREATE TABLE IF NOT EXISTS planilla_pagos (
          id_pago INT AUTO_INCREMENT PRIMARY KEY,
          id_empleado INT NOT NULL,
          empleado_nombre VARCHAR(150) NOT NULL,
          fecha_inicio DATE NOT NULL,
          fecha_fin DATE NOT NULL,
          frecuencia_pago VARCHAR(30) NULL,
          total_facturas INT NOT NULL DEFAULT 0,
          total_vendido DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          total_costo DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          ganancia_generada DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          ganancia_comisionable DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          regla_aplicada VARCHAR(180) NULL,
          salario_base DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          comision_ganancia DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          comision_venta DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          bono_meta DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          bonos_extra DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          deducciones_adelantos DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          total_neto_pagado DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          metodo_pago VARCHAR(40) DEFAULT 'Efectivo',
          notas TEXT NULL,
          pagado_por VARCHAR(100) NULL,
          fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
          detalles_json LONGTEXT NULL,
          INDEX idx_pp_emp (id_empleado),
          INDEX idx_pp_fecha (fecha_pago)
        )
      `);
    } catch (empErr) {
      console.error('⚠️ Error inicializando tablas de planilla:', empErr.message);
    }

    console.log('✅ Sistema de Permisos Granulares, Planilla por Comisiones, Usuario Principal (admin/1987) y Trazabilidad verificado.');
  } catch (err) {
    console.error('❌ Error inicializando esquema de permisos y trazabilidad:', err.message);
  }
}

module.exports = {
  PERMISSIONS_CATALOG,
  ALL_PERMISSION_KEYS,
  getAllPermissionsEnabled,
  getDefaultPermissionsForRole,
  isMasterAdminUser,
  resolveUserPermissions,
  logUserActivity,
  initPermissionsAndAuditSchema
};

