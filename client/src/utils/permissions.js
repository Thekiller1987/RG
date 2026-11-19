// client/src/utils/permissions.js

export const PERMISSIONS_CATALOG = [
  // 1. Punto de Venta (POS)
  { key: 'pos.acceso', category: 'Punto de Venta (POS)', label: 'Acceder al Punto de Venta (POS)', description: 'Permite ver y entrar a la pantalla de facturación POS' },
  { key: 'pos.cobrar', category: 'Punto de Venta (POS)', label: 'Facturar y cobrar ventas', description: 'Permite procesar pagos y emitir facturas de venta' },
  { key: 'pos.descuentos', category: 'Punto de Venta (POS)', label: 'Aplicar descuentos y modificar precios', description: 'Permite otorgar descuentos o ajustar precios en el carrito' },
  { key: 'pos.venta_credito', category: 'Punto de Venta (POS)', label: 'Facturar ventas al crédito', description: 'Permite emitir facturas a crédito a clientes autorizados' },
  { key: 'pos.devoluciones', category: 'Punto de Venta (POS)', label: 'Realizar devoluciones y anular facturas', description: 'Permite procesar devoluciones o cancelar tickets emitidos' },
  { key: 'pos.historial_ventas', category: 'Punto de Venta (POS)', label: 'Ver historial de ventas en POS', description: 'Permite abrir el historial de facturas desde el POS' },
  { key: 'pos.cambiar_vendedor', category: 'Punto de Venta (POS)', label: 'Asignar o cambiar vendedor en factura', description: 'Permite seleccionar qué empleado comisiona la venta' },

  // 2. Venta Mayorista y Proformas
  { key: 'pos_mayorista.acceso', category: 'Mayorista y Proformas', label: 'Acceder a Venta Mayorista', description: 'Permite entrar al portal y POS de ventas al por mayor' },
  { key: 'mayorista.promociones', category: 'Mayorista y Proformas', label: 'Gestionar promociones mayoristas', description: 'Permite crear, editar o eliminar promociones de mayoreo' },
  { key: 'mayorista.catalogo', category: 'Mayorista y Proformas', label: 'Ver catálogo mayorista', description: 'Permite consultar el catálogo de precios al por mayor' },
  { key: 'pedidos_apartados.acceso', category: 'Mayorista y Proformas', label: 'Ver Proformas, Pedidos y Apartados', description: 'Permite acceder al módulo de cotizaciones y apartados' },
  { key: 'pedidos_apartados.gestionar', category: 'Mayorista y Proformas', label: 'Crear y editar proformas/apartados', description: 'Permite guardar, modificar o facturar proformas y apartados' },

  // 3. Caja y Arqueos
  { key: 'caja.abrir_cerrar', category: 'Caja y Arqueos', label: 'Abrir y cerrar turno de caja', description: 'Permite realizar apertura y cierre/arqueo de su turno de caja' },
  { key: 'caja.movimientos', category: 'Caja y Arqueos', label: 'Registrar entradas y salidas de caja', description: 'Permite registrar gastos o ingresos manuales de efectivo en cajón' },
  { key: 'caja_reportes.ver', category: 'Caja y Arqueos', label: 'Ver módulo Gestión y Reportes de Cajas', description: 'Permite entrar al panel consolidado de arqueos y cajas' },
  { key: 'caja_reportes.auditar', category: 'Caja y Arqueos', label: 'Auditar todas las cajas y turnos', description: 'Permite inspeccionar detalles completos de cualquier cajero' },

  // 4. Inventario y Bodega
  { key: 'inventario.ver', category: 'Inventario y Bodega', label: 'Ver módulo de Inventario', description: 'Permite consultar la lista de productos y existencias' },
  { key: 'inventario.crear', category: 'Inventario y Bodega', label: 'Crear nuevos productos, categorías y proveedores', description: 'Permite registrar nuevos ítems en el catálogo' },
  { key: 'inventario.editar', category: 'Inventario y Bodega', label: 'Editar productos, stock y precios', description: 'Permite modificar existencias, nombres, códigos y precios de venta' },
  { key: 'inventario.eliminar', category: 'Inventario y Bodega', label: 'Eliminar productos del inventario', description: 'Permite borrar productos del catálogo' },
  { key: 'inventario.ver_costos', category: 'Inventario y Bodega', label: 'Ver precios de costo y márgenes', description: 'Permite visualizar el costo de compra y margen de ganancia' },
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

/**
 * Mapa maestro de los Módulos del Sistema y sus funciones internas para visualizar
 * qué módulos tiene habilitados o bloqueados cada usuario.
 */
export const SYSTEM_MODULES_MAP = [
  {
    id: 'pos',
    name: 'Punto de Venta (POS)',
    route: '/pos',
    accessKey: 'pos.acceso',
    color: '#2563eb',
    functions: ['pos.acceso', 'pos.cobrar', 'pos.descuentos', 'pos.venta_credito', 'pos.devoluciones', 'pos.historial_ventas', 'pos.cambiar_vendedor']
  },
  {
    id: 'mayorista',
    name: 'Venta Mayorista',
    route: '/wholesale-pos',
    accessKey: 'pos_mayorista.acceso',
    color: '#8b5cf6',
    functions: ['pos_mayorista.acceso', 'mayorista.promociones', 'mayorista.catalogo']
  },
  {
    id: 'proformas',
    name: 'Proformas y Apartados',
    route: '/orders',
    accessKey: 'pedidos_apartados.acceso',
    color: '#eab308',
    functions: ['pedidos_apartados.acceso', 'pedidos_apartados.gestionar']
  },
  {
    id: 'caja',
    name: 'Gestión y Arqueos de Caja',
    route: '/cash-report',
    accessKey: 'caja_reportes.ver',
    color: '#dc2626',
    functions: ['caja.abrir_cerrar', 'caja.movimientos', 'caja_reportes.ver', 'caja_reportes.auditar']
  },
  {
    id: 'inventario',
    name: 'Gestión de Inventario',
    route: '/inventory',
    accessKey: 'inventario.ver',
    color: '#16a34a',
    functions: ['inventario.ver', 'inventario.crear', 'inventario.editar', 'inventario.eliminar', 'inventario.ver_costos', 'inventario.codigos_barra']
  },
  {
    id: 'carga_masiva',
    name: 'Carga Masiva CSV',
    route: '/upload/inventory',
    accessKey: 'carga_masiva.acceso',
    color: '#7c3aed',
    functions: ['carga_masiva.acceso']
  },
  {
    id: 'traslados',
    name: 'Traslados / Salidas',
    route: '/traslados',
    accessKey: 'salidas_inventario.acceso',
    color: '#ef4444',
    functions: ['salidas_inventario.acceso']
  },
  {
    id: 'clientes',
    name: 'Clientes y Créditos',
    route: '/credits',
    accessKey: 'clientes_creditos.ver',
    color: '#0284c7',
    functions: ['clientes_creditos.ver', 'clientes.crear_editar', 'clientes.registrar_abono', 'clientes.anular_abono', 'clientes.eliminar']
  },
  {
    id: 'proveedores',
    name: 'Facturas Proveedores',
    route: '/invoices',
    accessKey: 'facturas_proveedores.acceso',
    color: '#db2777',
    functions: ['facturas_proveedores.acceso']
  },
  {
    id: 'finanzas',
    name: 'Dashboard Financiero',
    route: '/finances',
    accessKey: 'finanzas.ver',
    color: '#059669',
    functions: ['finanzas.ver', 'finanzas.registrar_movimientos']
  },
  {
    id: 'reportes_ventas',
    name: 'Reporte de Ventas Detallado',
    route: '/detailed-sales-report',
    accessKey: 'reportes_ventas.ver',
    color: '#4f46e5',
    functions: ['reportes_ventas.ver']
  },
  {
    id: 'bi_consola',
    name: 'Consola BI & Analítica',
    route: '/bi-console',
    accessKey: 'bi_consola.ver',
    color: '#ea580c',
    functions: ['bi_consola.ver']
  },
  {
    id: 'planilla',
    name: 'Planilla y Comisiones (Dueño)',
    route: '/empleados',
    accessKey: 'planilla.acceso',
    color: '#0f766e',
    functions: ['planilla.acceso', 'planilla.ver_ganancias', 'planilla.reglas_comision', 'planilla.liquidar_pagos', 'empleados.acceso']
  },
  {
    id: 'usuarios',
    name: 'Usuarios y Trazabilidad',
    route: '/admin/users',
    accessKey: 'usuarios.acceso',
    color: '#e11d48',
    functions: ['usuarios.acceso']
  },
  {
    id: 'solicitudes',
    name: 'Solicitudes de Repuestos',
    route: '/solicitudes',
    accessKey: 'solicitudes.acceso',
    color: '#f97316',
    functions: ['solicitudes.acceso']
  },
  {
    id: 'configuracion',
    name: 'Configuración del Negocio',
    route: '/settings',
    accessKey: 'configuracion.acceso',
    color: '#334155',
    functions: ['configuracion.acceso', 'ia_asistente.acceso']
  }
];

export const ALL_PERMISSION_KEYS = PERMISSIONS_CATALOG.map(p => p.key);

export const PERMISSION_CATEGORIES = Array.from(
  new Set(PERMISSIONS_CATALOG.map(p => p.category))
);

export function getPermissionMeta(permissionKey) {
  return PERMISSIONS_CATALOG.find(p => p.key === permissionKey) || {
    key: permissionKey,
    category: 'Sistema',
    label: permissionKey,
    description: 'Acción protegida por control de permisos'
  };
}

export function getAllPermissionsEnabled() {
  const map = {};
  ALL_PERMISSION_KEYS.forEach(k => { map[k] = true; });
  return map;
}

export function getDefaultPermissionsForRole(rol = 'Vendedor') {
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

  // Vendedor / Empleado
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

export function isMasterAdmin(user) {
  if (!user) return false;
  const uname = String(user.nombre_usuario || user.nombre || '').trim().toLowerCase();
  return uname === 'admin' || Boolean(user.es_principal);
}

/**
 * Verifica si el usuario actual tiene habilitado un permiso específico (casilla marcada).
 */
export function checkUserPermission(user, permissionKey) {
  if (!user) return false;
  if (!permissionKey) return true;
  if (isMasterAdmin(user)) return true;

  const userPerms = user.permisos && typeof user.permisos === 'object'
    ? user.permisos
    : getDefaultPermissionsForRole(user.rol);

  if (typeof userPerms[permissionKey] === 'boolean') {
    return userPerms[permissionKey];
  }

  const defaults = getDefaultPermissionsForRole(user.rol);
  return Boolean(defaults[permissionKey]);
}
