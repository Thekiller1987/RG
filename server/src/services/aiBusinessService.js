// server/src/services/aiBusinessService.js
const pool = require('../config/db');

// Caché en memoria para evitar consumo redundante de tokens en preguntas repetidas durante la defensa
const queryResponseCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 segundos de caché

/**
 * Recopila en tiempo real las métricas y estado del negocio directamente desde la BD.
 */
async function getLiveBusinessContext() {
  const context = {
    fechaHoraActual: new Date().toLocaleString('es-NI', { timeZone: 'America/Managua' }),
    cajaHoy: null,
    ventasHoy: null,
    ventasMes: null,
    ventasSemana: null,
    ventasSemanaDetalle: [],
    ventasVendedorSemana: [],
    ventasVendedorMes: [],
    ultimosCierresCaja: [],
    empleadosActivos: [],
    stockCritico: [],
    topClientesDeudores: [],
    topProductosVendidos: [],
    resumenInventario: null
  };

  try {
    // 1. Estado de Cajas de Hoy
    const [cajas] = await pool.query(`
      SELECT id, usuario_id, usuario_nombre, fecha_apertura, fecha_cierre, monto_inicial, detalles_json 
      FROM cierres_caja 
      WHERE DATE(fecha_apertura) = CURDATE() OR fecha_cierre IS NULL
      ORDER BY id DESC LIMIT 5
    `);

    if (cajas.length > 0) {
      let totalVentasCajas = 0;
      let totalEfectivoEsperado = 0;
      let totalNoEfectivo = 0;
      const abiertas = [];

      cajas.forEach(c => {
        let det = {};
        try {
          det = typeof c.detalles_json === 'string' ? JSON.parse(c.detalles_json) : (c.detalles_json || {});
        } catch (e) { det = {}; }

        const txs = det.transactions || [];
        let ventasCaja = 0;
        let efCaja = Number(c.monto_inicial || det.initialAmount || 0);
        let noEfCaja = 0;

        txs.forEach(t => {
          const type = (t.type || '').toLowerCase();
          const pd = t.pagoDetalles || {};
          const amt = Number(t.amount || 0);

          if (type.startsWith('venta')) {
            const vTotal = Number(pd.totalVenta || amt || 0);
            ventasCaja += vTotal;
            const ef = Number(pd.efectivo || 0) - Number(pd.cambio || 0) + (Number(pd.dolares || 0) * 36.6);
            efCaja += ef;
            noEfCaja += (Number(pd.tarjeta || 0) + Number(pd.transferencia || 0) + Number(pd.credito || 0));
          } else if (type === 'salida' || type === 'gasto') {
            efCaja -= Math.abs(amt);
          } else if (type === 'cancelacion' || type === 'devolucion') {
            ventasCaja -= Math.abs(amt);
            efCaja -= Math.abs(amt);
          }
        });

        const isAbierta = !c.fecha_cierre;
        if (isAbierta) {
          abiertas.push({
            cajaId: c.id,
            usuarioNombre: c.usuario_nombre,
            montoInicial: Number(c.monto_inicial || 0),
            ventasTurno: ventasCaja,
            efectivoEsperado: efCaja,
            noEfectivo: noEfCaja
          });
        }

        totalVentasCajas += ventasCaja;
        totalEfectivoEsperado += efCaja;
        totalNoEfectivo += noEfCaja;
      });

      context.cajaHoy = {
        totalCajasRegistradas: cajas.length,
        cajasAbiertas: abiertas,
        efectivoEsperadoTotalCordobas: totalEfectivoEsperado,
        ventasTurnoCajas: totalVentasCajas,
        totalCobrosNoEfectivo: totalNoEfectivo
      };
    }

    // 2. Resumen de Ventas Facturadas de Hoy
    const [ventasHoyRows] = await pool.query(`
      SELECT 
        COUNT(id_venta) AS total_tickets,
        COALESCE(SUM(total_venta), 0) AS total_facturado,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.efectivo')) AS DECIMAL(10,2))), 0) AS ventas_efectivo,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.tarjeta')) AS DECIMAL(10,2))), 0) AS ventas_tarjeta,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.transferencia')) AS DECIMAL(10,2))), 0) AS ventas_transferencia,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.credito')) AS DECIMAL(10,2))), 0) AS ventas_credito
      FROM ventas
      WHERE DATE(fecha) = CURDATE() AND estado != 'CANCELADA'
    `);
    context.ventasHoy = ventasHoyRows[0] || {};

    // 2b. Resumen de Ventas Facturadas del Mes Actual
    const [ventasMesRows] = await pool.query(`
      SELECT 
        COUNT(id_venta) AS total_tickets_mes,
        COALESCE(SUM(total_venta), 0) AS total_facturado_mes,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.efectivo')) AS DECIMAL(10,2))), 0) AS ventas_efectivo_mes,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.credito')) AS DECIMAL(10,2))), 0) AS ventas_credito_mes
      FROM ventas
      WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE()) AND estado != 'CANCELADA'
    `);
    context.ventasMes = ventasMesRows[0] || {};

    // 2c. Resumen de Ventas de Toda la Semana (Últimos 7 días) y Desglose Diario
    const [ventasSemanaRows] = await pool.query(`
      SELECT 
        DATE(fecha) AS dia,
        DAYNAME(fecha) AS dia_nombre,
        COUNT(id_venta) AS tickets,
        COALESCE(SUM(total_venta), 0) AS total_dia,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.efectivo')) AS DECIMAL(10,2))), 0) AS efectivo_dia,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.credito')) AS DECIMAL(10,2))), 0) AS credito_dia,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.tarjeta')) AS DECIMAL(10,2))), 0) AS tarjeta_dia,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.transferencia')) AS DECIMAL(10,2))), 0) AS transferencia_dia
      FROM ventas
      WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND estado != 'CANCELADA'
      GROUP BY DATE(fecha), DAYNAME(fecha)
      ORDER BY dia DESC
    `);
    context.ventasSemanaDetalle = ventasSemanaRows;
    const totalSem = ventasSemanaRows.reduce((a, b) => a + Number(b.total_dia || 0), 0);
    const ticketsSem = ventasSemanaRows.reduce((a, b) => a + Number(b.tickets || 0), 0);
    const efecSem = ventasSemanaRows.reduce((a, b) => a + Number(b.efectivo_dia || 0), 0);
    const credSem = ventasSemanaRows.reduce((a, b) => a + Number(b.credito_dia || 0), 0);
    context.ventasSemana = {
      total_facturado_semana: totalSem,
      total_tickets_semana: ticketsSem,
      total_efectivo_semana: efecSem,
      total_credito_semana: credSem,
      promedio_diario: ventasSemanaRows.length ? (totalSem / ventasSemanaRows.length) : 0
    };

    // 2d. Ventas por Empleado / Vendedor (Últimos 7 días)
    const [ventasVendedorSemanaRows] = await pool.query(`
      SELECT 
        COALESCE(e.nombre, u.nombre_usuario, 'Caja Principal') AS vendedor,
        COUNT(v.id_venta) AS tickets,
        COALESCE(SUM(v.total_venta), 0) AS total_vendido
      FROM ventas v
      LEFT JOIN empleados e ON v.id_empleado = e.id_empleado
      LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
      WHERE v.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND v.estado != 'CANCELADA'
      GROUP BY vendedor
      ORDER BY total_vendido DESC
      LIMIT 8
    `);
    context.ventasVendedorSemana = ventasVendedorSemanaRows;

    // 2e. Ventas por Empleado / Vendedor (Mes Actual)
    const [ventasVendedorMesRows] = await pool.query(`
      SELECT 
        COALESCE(e.nombre, u.nombre_usuario, 'Caja Principal') AS vendedor,
        COUNT(v.id_venta) AS tickets,
        COALESCE(SUM(v.total_venta), 0) AS total_vendido
      FROM ventas v
      LEFT JOIN empleados e ON v.id_empleado = e.id_empleado
      LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
      WHERE MONTH(v.fecha) = MONTH(CURDATE()) AND YEAR(v.fecha) = YEAR(CURDATE()) AND v.estado != 'CANCELADA'
      GROUP BY vendedor
      ORDER BY total_vendido DESC
      LIMIT 8
    `);
    context.ventasVendedorMes = ventasVendedorMesRows;

    // 2f. Últimos Cierres y Venta por Caja (Arqueos)
    const [ultimosCierresRows] = await pool.query(`
      SELECT 
        id AS caja_id,
        usuario_nombre,
        DATE_FORMAT(fecha_apertura, '%Y-%m-%d %H:%i') AS apertura,
        DATE_FORMAT(fecha_cierre, '%Y-%m-%d %H:%i') AS cierre,
        IF(fecha_cierre IS NULL, 'ABIERTA', 'CERRADA') AS estado,
        monto_inicial,
        total_ventas_efectivo,
        total_ventas_tarjeta,
        total_ventas_transferencia,
        total_ventas_credito,
        (COALESCE(total_ventas_efectivo,0) + COALESCE(total_ventas_tarjeta,0) + COALESCE(total_ventas_transferencia,0) + COALESCE(total_ventas_credito,0)) AS total_ventas_caja,
        final_esperado,
        final_real,
        diferencia
      FROM cierres_caja
      ORDER BY id DESC
      LIMIT 5
    `);
    context.ultimosCierresCaja = ultimosCierresRows;

    // 2g. Plantilla de Personal / Vendedores Activos
    const [empleadosRows] = await pool.query(`
      SELECT id_empleado, nombre, cargo, activo 
      FROM empleados 
      WHERE activo = 1
      ORDER BY nombre ASC
    `);
    context.empleadosActivos = empleadosRows;

    // 3. Resumen Global de Inventario
    const [invRows] = await pool.query(`
      SELECT 
        COUNT(id_producto) AS total_productos_distintos,
        COALESCE(SUM(existencia), 0) AS total_unidades_fisicas,
        COALESCE(SUM(existencia * costo), 0) AS valor_total_costo,
        COALESCE(SUM(existencia * venta), 0) AS valor_total_venta
      FROM productos
    `);
    context.resumenInventario = invRows[0] || {};

    // 4. Productos con Stock Crítico (menos de 5 unidades)
    const [stockBajoRows] = await pool.query(`
      SELECT id_producto, codigo, nombre, existencia, venta, mayoreo, costo
      FROM productos
      WHERE existencia <= 5
      ORDER BY existencia ASC, nombre ASC
      LIMIT 12
    `);
    context.stockCritico = stockBajoRows;

    // 5. Clientes con Mayor Deuda Pendiente
    const [deudoresRows] = await pool.query(`
      SELECT id_cliente, nombre, telefono, saldo_pendiente, limite_credito
      FROM clientes
      WHERE saldo_pendiente > 0
      ORDER BY saldo_pendiente DESC
      LIMIT 8
    `);
    context.topClientesDeudores = deudoresRows;

    // 6. Top 6 Productos Más Vendidos del Último Mes
    const [topProdRows] = await pool.query(`
      SELECT p.nombre, p.codigo, SUM(dv.cantidad) as total_unidades, SUM(dv.cantidad * dv.precio_unitario) as total_generado
      FROM detalle_ventas dv
      JOIN ventas v ON dv.id_venta = v.id_venta
      JOIN productos p ON dv.id_producto = p.id_producto
      WHERE v.fecha >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND v.estado != 'CANCELADA'
      GROUP BY p.id_producto, p.nombre, p.codigo
      ORDER BY total_unidades DESC
      LIMIT 6
    `);
    context.topProductosVendidos = topProdRows;

  } catch (error) {
    console.error('[AIBusinessService] Error recopilando contexto:', error.message);
  }

  return context;
}

/**
 * Busca repuestos específicos permitiendo múltiples palabras clave (AND) para máxima precisión.
 * Incluye bandera tiene_imagen para saber si el producto cuenta con fotografía en Base64.
 */
async function searchProductsForQuery(queryText) {
  if (!queryText || !String(queryText).trim()) return [];
  try {
    const rawTokens = String(queryText).trim().split(/\s+/).filter(t => t.length >= 2);
    if (!rawTokens.length) return [];

    // 1. Búsqueda con todos los tokens usando AND (ej: 'aceite' AND 'maxima')
    const conditions = [];
    const params = [];
    rawTokens.forEach(t => {
      const pattern = `%${t}%`;
      conditions.push(`(nombre LIKE ? OR codigo LIKE ? OR descripcion LIKE ?)`);
      params.push(pattern, pattern, pattern);
    });

    const [rowsAnd] = await pool.query(`
      SELECT id_producto, codigo, nombre, descripcion, existencia, stock_reservado, venta, mayoreo, costo,
             IF(imagen IS NOT NULL AND CHAR_LENGTH(imagen) > 20, 1, 0) AS tiene_imagen
      FROM productos
      WHERE ${conditions.join(' AND ')}
      LIMIT 12
    `, params);

    if (rowsAnd.length > 0) {
      return rowsAnd;
    }

    // 2. Si no hubo coincidencias exactas con todos los tokens juntos y había más de 1 token, intentar coincidencia OR
    if (rawTokens.length > 1) {
      const [rowsOr] = await pool.query(`
        SELECT id_producto, codigo, nombre, descripcion, existencia, stock_reservado, venta, mayoreo, costo,
               IF(imagen IS NOT NULL AND CHAR_LENGTH(imagen) > 20, 1, 0) AS tiene_imagen
        FROM productos
        WHERE ${conditions.join(' OR ')}
        LIMIT 8
      `, params);
      return rowsOr;
    }

    return [];
  } catch (e) {
    console.error('[AIBusinessService] Error buscando repuestos:', e.message);
    return [];
  }
}

/**
 * Obtiene la fotografía en Base64 de un repuesto según la consulta o el historial.
 */
async function getProductPhoto(question, history = []) {
  // Limpiar términos para encontrar el nombre o código del repuesto
  const cleaned = question
    .replace(/[¿?¡!.,:;()_]/g, ' ')
    .replace(/\b(muestrame|muéstrame|muestra|ver|enseñame|enséñame|dame|pon|mostrar|foto|fotos|fotografia|fotografía|imagen|imagenes|imágenes|del|de\s+la|de\s+los|de\s+las|de|el|la|los|las|un|una|repuesto|repuestos|producto|productos|porfa|favor|tienes|como\s+se\s+ve|cómo\s+se\s+ve)\b/gi, ' ')
    .trim();

  let searchTerm = cleaned;

  // Si no se especificó un producto en la pregunta (ej. el usuario sólo dijo "muestrame la foto"):
  // Buscar en el historial el último repuesto mencionado
  if (!searchTerm || searchTerm.length < 2) {
    if (Array.isArray(history) && history.length > 0) {
      for (let i = history.length - 1; i >= 0; i--) {
        const msgText = String(history[i].text || '');
        const codeMatch = msgText.match(/`([^`]+)`/) || msgText.match(/C[oó]d(?:igo)?:\s*([A-Za-z0-9_.-]+)/i);
        const nameMatch = msgText.match(/\*\*([^*]+)\*\*/) || msgText.match(/•\s*([A-Za-z0-9\s_.-]+?)(?:\s*\(|\s*\[|\n|$)/);

        if (codeMatch && codeMatch[1] && codeMatch[1].trim() !== 'S/C') {
          searchTerm = codeMatch[1].trim();
          break;
        } else if (nameMatch && nameMatch[1] && !nameMatch[1].includes('Repuestos') && !nameMatch[1].includes('Resumen') && !nameMatch[1].includes('Ventas')) {
          searchTerm = nameMatch[1].trim();
          break;
        }
      }
    }
  }

  if (!searchTerm || searchTerm.length < 2) {
    return {
      answer: `📷 Para mostrarte la fotografía de un repuesto, por favor indícame su nombre o código. Por ejemplo:\n• *"Muéstrame la foto de llanta 100.90-17"*\n• *"Foto de flasher"*\n• *"Foto de empaque culata"*`,
      image: null,
      product: null
    };
  }

  try {
    const tokens = searchTerm.split(/\s+/).filter(t => t.length >= 2);
    const conditions = [];
    const params = [];
    tokens.forEach(t => {
      const p = `%${t}%`;
      conditions.push('(nombre LIKE ? OR codigo LIKE ? OR descripcion LIKE ?)');
      params.push(p, p, p);
    });

    // 1. Intentar con AND priorizando productos que SÍ tengan imagen cargada
    let [rows] = await pool.query(`
      SELECT id_producto, codigo, nombre, descripcion, existencia, stock_reservado, venta, mayoreo, imagen
      FROM productos
      WHERE ${conditions.join(' AND ')}
      ORDER BY (imagen IS NOT NULL AND CHAR_LENGTH(imagen) > 20) DESC, existencia DESC
      LIMIT 1
    `, params);

    // 2. Si no hubo coincidencia con AND y había más de 1 token, intentar OR
    if (!rows.length && tokens.length > 1) {
      const [rowsOr] = await pool.query(`
        SELECT id_producto, codigo, nombre, descripcion, existencia, stock_reservado, venta, mayoreo, imagen
        FROM productos
        WHERE ${conditions.join(' OR ')}
        ORDER BY (imagen IS NOT NULL AND CHAR_LENGTH(imagen) > 20) DESC, existencia DESC
        LIMIT 1
      `, params);
      rows = rowsOr;
    }

    if (!rows.length) {
      return {
        answer: `🔍 No encontré ningún repuesto en el catálogo que coincida con **"${searchTerm}"**. Por favor verifica el nombre o código e intenta nuevamente.`,
        image: null,
        product: null
      };
    }

    const prod = rows[0];
    const rawImg = prod.imagen ? (Buffer.isBuffer(prod.imagen) ? prod.imagen.toString('utf-8') : String(prod.imagen)) : null;
    const hasImage = rawImg && rawImg.length > 20;

    let base64Image = null;
    if (hasImage) {
      base64Image = rawImg.startsWith('data:') ? rawImg : `data:image/jpeg;base64,${rawImg}`;
    }

    const prodInfo = {
      id: prod.id_producto,
      codigo: prod.codigo,
      nombre: prod.nombre,
      existencia: prod.existencia,
      stock_reservado: prod.stock_reservado || 0,
      venta: prod.venta,
      mayoreo: prod.mayoreo || prod.venta
    };

    if (hasImage) {
      const text = `📷 Aquí tienes la fotografía de **${prod.nombre}**:\n\n` +
        `• **Código:** \`${prod.codigo || 'S/C'}\`\n` +
        `• **Existencia:** **${prod.existencia} unidades** (Reservado: ${prod.stock_reservado || 0})\n` +
        `• **Precio Venta:** **C$ ${Number(prod.venta).toLocaleString()}** | Mayoreo: **C$ ${Number(prod.mayoreo || prod.venta).toLocaleString()}**`;

      return {
        answer: text,
        image: base64Image,
        product: prodInfo
      };
    } else {
      const text = `📷 El repuesto **${prod.nombre}** (Cód: \`${prod.codigo || 'S/C'}\`) está registrado en el inventario:\n\n` +
        `• **Existencia:** **${prod.existencia} unidades**\n` +
        `• **Precio:** **C$ ${Number(prod.venta).toLocaleString()}**\n\n` +
        `⚠️ Actualmente este repuesto **no tiene una fotografía cargada** en la base de datos. Puedes asignarla desde el módulo de Gestión de Inventario.`;

      return {
        answer: text,
        image: null,
        product: prodInfo
      };
    }
  } catch (err) {
    console.error('[AIBusinessService] Error buscando foto del repuesto:', err.message);
    return {
      answer: `⚠️ Ocurrió un error al consultar la imagen del producto: ${err.message}`,
      image: null,
      product: null
    };
  }
}

/**
 * Extrae el nombre del empleado o usuario mencionado en una consulta.
 */
function extractEmployeeName(question, activeEmployees = []) {
  const q = question.toLowerCase().trim();

  // Nombres conocidos del negocio (waskar, miguelito, walter, rosa, etc.)
  const knownNames = [
    'waskar', 'miguelito', 'walter', 'rosa', 'carlos', 'admin', 'lisamara',
    ...activeEmployees.map(e => e.nombre.toLowerCase().split(/\s+/)[0])
  ];

  for (const name of knownNames) {
    if (name.length >= 3 && q.includes(name)) {
      return name;
    }
  }

  // Patrones regex
  const patterns = [
    /(?:ventas?|reporte|facturaci[oó]n|tickets?)\s+(?:de\s+)?([a-zA-ZáéíóúñÁÉÍÓÚÑ]+)/i,
    /(?:cu[aá]nto\s+(?:ha\s+)?vendi[oó])\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ]+)/i,
    /(?:qu[eé]\s+(?:ha\s+)?vendido)\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ]+)/i
  ];

  const IGNORE_WORDS = new Set([
    'hoy', 'ayer', 'antier', 'mes', 'semana', 'ano', 'año', 'caja', 'cajas', 'tienda', 'negocio',
    'inventario', 'repuesto', 'repuestos', 'producto', 'productos', 'contado', 'credito', 'crédito',
    'efectivo', 'todos', 'cada', 'un', 'una', 'el', 'la', 'los', 'las', 'del', 'dia', 'día', 'general'
  ]);

  for (const pat of patterns) {
    const match = q.match(pat);
    if (match && match[1]) {
      const cand = match[1].trim().toLowerCase();
      if (!IGNORE_WORDS.has(cand) && cand.length >= 3) {
        return cand;
      }
    }
  }

  return null;
}

/**
 * Genera el reporte de ventas completo para un vendedor o usuario específico (ej: Waskar).
 */
async function getEmployeeSalesReport(personQuery) {
  if (!personQuery || !String(personQuery).trim()) return null;
  const term = `%${String(personQuery).trim().toLowerCase()}%`;

  try {
    // 1. Buscar coincidencias en empleados y usuarios
    const [empMatches] = await pool.query(
      'SELECT id_empleado, nombre, cargo FROM empleados WHERE LOWER(nombre) LIKE ?',
      [term]
    );
    const [userMatches] = await pool.query(
      'SELECT id_usuario, nombre_usuario, rol FROM usuarios WHERE LOWER(nombre_usuario) LIKE ?',
      [term]
    );

    const hasMatch = empMatches.length > 0 || userMatches.length > 0;
    if (!hasMatch) {
      // Verificar si hay ventas registradas con ese nombre
      const [checkVentas] = await pool.query(`
        SELECT COUNT(v.id_venta) AS total
        FROM ventas v
        LEFT JOIN empleados e ON v.id_empleado = e.id_empleado
        LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
        WHERE (LOWER(e.nombre) LIKE ? OR LOWER(u.nombre_usuario) LIKE ?)
      `, [term, term]);

      if (!checkVentas[0] || Number(checkVentas[0].total) === 0) {
        return null;
      }
    }

    const officialName = empMatches[0]?.nombre || userMatches[0]?.nombre_usuario || personQuery;
    const roleInfo = empMatches[0]?.cargo || userMatches[0]?.rol || 'Vendedor';

    // 2. Métricas de ventas del vendedor / usuario
    const [metricsRows] = await pool.query(`
      SELECT
        -- Hoy
        COALESCE(SUM(CASE WHEN DATE(v.fecha) = CURDATE() THEN v.total_venta ELSE 0 END), 0) AS total_hoy,
        COUNT(CASE WHEN DATE(v.fecha) = CURDATE() THEN v.id_venta ELSE NULL END) AS tickets_hoy,
        COALESCE(SUM(CASE WHEN DATE(v.fecha) = CURDATE() THEN CAST(JSON_UNQUOTE(JSON_EXTRACT(v.pago_detalles, '$.efectivo')) AS DECIMAL(10,2)) ELSE 0 END), 0) AS efec_hoy,
        COALESCE(SUM(CASE WHEN DATE(v.fecha) = CURDATE() THEN (CAST(JSON_UNQUOTE(JSON_EXTRACT(v.pago_detalles, '$.tarjeta')) AS DECIMAL(10,2)) + CAST(JSON_UNQUOTE(JSON_EXTRACT(v.pago_detalles, '$.transferencia')) AS DECIMAL(10,2))) ELSE 0 END), 0) AS digital_hoy,
        COALESCE(SUM(CASE WHEN DATE(v.fecha) = CURDATE() THEN CAST(JSON_UNQUOTE(JSON_EXTRACT(v.pago_detalles, '$.credito')) AS DECIMAL(10,2)) ELSE 0 END), 0) AS cred_hoy,

        -- Mes Actual
        COALESCE(SUM(CASE WHEN MONTH(v.fecha) = MONTH(CURDATE()) AND YEAR(v.fecha) = YEAR(CURDATE()) THEN v.total_venta ELSE 0 END), 0) AS total_mes,
        COUNT(CASE WHEN MONTH(v.fecha) = MONTH(CURDATE()) AND YEAR(v.fecha) = YEAR(CURDATE()) THEN v.id_venta ELSE NULL END) AS tickets_mes,
        COALESCE(SUM(CASE WHEN MONTH(v.fecha) = MONTH(CURDATE()) AND YEAR(v.fecha) = YEAR(CURDATE()) THEN CAST(JSON_UNQUOTE(JSON_EXTRACT(v.pago_detalles, '$.efectivo')) AS DECIMAL(10,2)) ELSE 0 END), 0) AS efec_mes,
        COALESCE(SUM(CASE WHEN MONTH(v.fecha) = MONTH(CURDATE()) AND YEAR(v.fecha) = YEAR(CURDATE()) THEN CAST(JSON_UNQUOTE(JSON_EXTRACT(v.pago_detalles, '$.credito')) AS DECIMAL(10,2)) ELSE 0 END), 0) AS cred_mes,

        -- Últimos 7 Días
        COALESCE(SUM(CASE WHEN v.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN v.total_venta ELSE 0 END), 0) AS total_semana,
        COUNT(CASE WHEN v.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN v.id_venta ELSE NULL END) AS tickets_semana,

        -- Histórico total
        COALESCE(SUM(v.total_venta), 0) AS total_historico,
        COUNT(v.id_venta) AS tickets_historico,
        MAX(v.fecha) AS ultima_venta
      FROM ventas v
      LEFT JOIN empleados e ON v.id_empleado = e.id_empleado
      LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
      WHERE (LOWER(e.nombre) LIKE ? OR LOWER(u.nombre_usuario) LIKE ?)
        AND v.estado != 'CANCELADA'
    `, [term, term]);

    const m = metricsRows[0] || {};

    // 3. Últimas 3 ventas individuales
    const [ultimas] = await pool.query(`
      SELECT v.id_venta, v.fecha, v.total_venta, v.tipo_pago,
             COALESCE(e.nombre, u.nombre_usuario) AS vendedor
      FROM ventas v
      LEFT JOIN empleados e ON v.id_empleado = e.id_empleado
      LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
      WHERE (LOWER(e.nombre) LIKE ? OR LOWER(u.nombre_usuario) LIKE ?)
        AND v.estado != 'CANCELADA'
      ORDER BY v.id_venta DESC
      LIMIT 3
    `, [term, term]);

    // 4. Verificar si tiene caja activa hoy
    const [cajas] = await pool.query(`
      SELECT id, usuario_nombre, monto_inicial, fecha_apertura, fecha_cierre
      FROM cierres_caja
      WHERE (LOWER(usuario_nombre) LIKE ? OR usuario_id = ?)
        AND (DATE(fecha_apertura) = CURDATE() OR fecha_cierre IS NULL)
      ORDER BY id DESC LIMIT 1
    `, [term, userMatches[0]?.id_usuario || -1]);

    const cajaActiva = cajas[0];

    // Formatear reporte
    let resp = `👤 **Reporte de Ventas — ${officialName.toUpperCase()}** *(${roleInfo})*:\n\n`;

    resp += `📅 **Ventas de Hoy:**\n`;
    if (Number(m.total_hoy) > 0 || Number(m.tickets_hoy) > 0) {
      resp += `• **Total Facturado Hoy:** **C$ ${Number(m.total_hoy).toLocaleString()}** (${m.tickets_hoy} facturas)\n`;
      resp += `• **En Efectivo:** C$ ${Number(m.efec_hoy).toLocaleString()} | **Al Crédito:** C$ ${Number(m.cred_hoy).toLocaleString()}`;
      if (Number(m.digital_hoy) > 0) resp += ` | **Digital:** C$ ${Number(m.digital_hoy).toLocaleString()}`;
      resp += `\n\n`;
    } else {
      resp += `• No registra ventas facturadas el día de hoy (C$ 0 — 0 facturas).\n\n`;
    }

    resp += `🗓️ **Acumulado en el Mes Actual:**\n`;
    if (Number(m.total_mes) > 0) {
      resp += `• **Total Facturado:** **C$ ${Number(m.total_mes).toLocaleString()}** (${m.tickets_mes} facturas)\n`;
      resp += `• **En Efectivo:** C$ ${Number(m.efec_mes).toLocaleString()} | **Al Crédito:** C$ ${Number(m.cred_mes).toLocaleString()}\n\n`;
    } else {
      resp += `• No registra ventas en el mes en curso (C$ 0 — 0 facturas).\n\n`;
    }

    resp += `📊 **Rendimiento Últimos 7 Días:**\n`;
    if (Number(m.total_semana) > 0) {
      resp += `• **Facturado en la Semana:** **C$ ${Number(m.total_semana).toLocaleString()}** (${m.tickets_semana} facturas)\n\n`;
    } else {
      resp += `• Sin ventas en los últimos 7 días (C$ 0).\n\n`;
    }

    resp += `🏆 **Historial Acumulado en el Sistema:**\n`;
    resp += `• **Total Histórico Facturado:** **C$ ${Number(m.total_historico || 0).toLocaleString()}** (${Number(m.tickets_historico || 0).toLocaleString()} facturas emitidas)\n`;
    if (m.ultima_venta) {
      const fUlt = new Date(m.ultima_venta).toLocaleDateString('es-NI', { timeZone: 'America/Managua' });
      resp += `• **Última Venta Registrada:** ${fUlt}\n`;
    }

    if (ultimas.length > 0) {
      resp += `\n🧾 **Últimos Tickets Emitidos:**\n`;
      ultimas.forEach(u => {
        const fechaStr = new Date(u.fecha).toLocaleDateString('es-NI', { timeZone: 'America/Managua' });
        resp += `• **Ticket #${u.id_venta}** (${fechaStr}): **C$ ${Number(u.total_venta).toLocaleString()}**\n`;
      });
    }

    if (cajaActiva) {
      const estadoCaja = cajaActiva.fecha_cierre ? 'Cerrada' : '🟢 ABIERTA';
      resp += `\n💵 **Estado de Caja:** Caja #${cajaActiva.id} (${estadoCaja}) — Fondo inicial: C$ ${Number(cajaActiva.monto_inicial || 0).toLocaleString()}`;
    }

    return resp;
  } catch (error) {
    console.error('[AIBusinessService] Error obteniendo reporte de empleado:', error.message);
    return null;
  }
}

/**
 * Obtiene la API Key de Gemini desde la base de datos o desde process.env.
 */
async function getGeminiApiKey() {
  const sanitize = (key) => (key ? String(key).trim().replace(/[\r\n"']/g, '') : null);

  // 1. Priorizar base de datos
  try {
    const [rows] = await pool.query('SELECT gemini_api_key FROM business_config WHERE id = 1 LIMIT 1');
    if (rows.length && rows[0].gemini_api_key) {
      const k = sanitize(rows[0].gemini_api_key);
      if (k) return k;
    }
  } catch (e) {}

  // 2. Si no hay en BD, buscar en process.env
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    const k = sanitize(process.env.GEMINI_API_KEY);
    if (k) return k;
  }
  return null;
}

/**
 * Generador de respuesta local inteligente.
 */
function generateLocalFallbackResponse(question, context, specificProducts = []) {
  const q = question.toLowerCase();

  const isBusinessMetricQuestion = q.includes('semana') || q.includes('emplead') || q.includes('vendedor') || 
    q.includes('caja') || q.includes('cierre') || q.includes('arqueo') || q.includes('quien vendio') || 
    q.includes('quien vendió') || q.includes('cuanto se vendio') || q.includes('cuanto se ha vendido') || 
    q.includes('cuanto hemos vendido') || q.includes('mejor dia') || q.includes('mejor día') ||
    q.includes('mes') || q.includes('mensual') || q.includes('hoy') || q.includes('facturad') ||
    q.includes('total de venta') || q.includes('dinero');

  // Si preguntó por productos específicos y encontramos coincidencias (y NO es consulta de métricas)
  if (specificProducts.length > 0 && !isBusinessMetricQuestion) {
    let resp = `🔍 **Repuestos encontrados en inventario:**\n\n`;
    specificProducts.forEach(p => {
      resp += `• **${p.nombre}** (Cód: \`${p.codigo || 'S/C'}\`)\n`;
      resp += `  - Existencia: **${p.existencia} unidades** (Reservado: ${p.stock_reservado || 0})\n`;
      resp += `  - Precio Público: **C$ ${Number(p.venta || 0).toLocaleString()}** | Mayoreo: **C$ ${Number(p.mayoreo || p.venta || 0).toLocaleString()}**\n`;
      if (p.tiene_imagen) {
        resp += `  - 📸 *Escribe "muéstrame la foto" para ver su imagen.*\n`;
      }
      resp += `\n`;
    });
    return resp;
  }

  // 1. Ventas por Empleado / Vendedor
  if (q.includes('emplead') || q.includes('vendedor') || q.includes('quien vendio') || q.includes('quien vendió') || q.includes('venden') || q.includes('personal')) {
    const vSem = context.ventasVendedorSemana || [];
    const vMes = context.ventasVendedorMes || [];
    const emps = context.empleadosActivos || [];

    let resp = `👥 **Rendimiento de Ventas por Empleado / Vendedor:**\n\n`;
    resp += `🏆 **Ventas en los Últimos 7 Días:**\n`;
    if (vSem.length > 0) {
      vSem.forEach((v, i) => {
        resp += `${i + 1}. **${v.vendedor}**: C$ ${Number(v.total_vendido).toLocaleString()} (${v.tickets} facturas)\n`;
      });
    } else {
      resp += `• No hay registro de ventas en los últimos 7 días.\n`;
    }

    if (vMes.length > 0) {
      resp += `\n📅 **Acumulado en el Mes Actual:**\n`;
      vMes.forEach((v, i) => {
        resp += `${i + 1}. **${v.vendedor}**: C$ ${Number(v.total_vendido).toLocaleString()} (${v.tickets} facturas)\n`;
      });
    }

    if (emps.length > 0) {
      resp += `\n🧑‍💼 **Plantilla de Vendedores Registrados:** ${emps.map(e => e.nombre).join(', ')}.\n`;
      resp += `💡 *Puedes preguntar por las ventas de cualquiera de ellos (ej: "ventas waskar").*`;
    }
    return resp;
  }

  // 2. Ventas de Toda la Semana
  if (q.includes('semana') || q.includes('semanal') || q.includes('ultimos 7') || q.includes('últimos 7')) {
    const vSem = context.ventasSemana || {};
    const det = context.ventasSemanaDetalle || [];
    const diasTrad = { 'Monday': 'Lunes', 'Tuesday': 'Martes', 'Wednesday': 'Miércoles', 'Thursday': 'Jueves', 'Friday': 'Viernes', 'Saturday': 'Sábado', 'Sunday': 'Domingo' };

    let resp = `📅 **Ventas de Toda la Semana (Últimos 7 Días) — Multirepuestos RG:**\n\n`;
    resp += `• **Total Facturado en la Semana:** C$ ${Number(vSem.total_facturado_semana || 0).toLocaleString()}\n`;
    resp += `• **Tickets Emitidos:** ${vSem.total_tickets_semana || 0} facturas\n`;
    resp += `• **Promedio Diario:** C$ ${Math.round(vSem.promedio_diario || 0).toLocaleString()}\n`;
    resp += `• **En Efectivo:** C$ ${Number(vSem.total_efectivo_semana || 0).toLocaleString()}\n`;
    resp += `• **Al Crédito:** C$ ${Number(vSem.total_credito_semana || 0).toLocaleString()}\n\n`;
    
    if (det.length > 0) {
      resp += `📊 **Desglose Día por Día:**\n`;
      det.forEach(d => {
        const diaNom = diasTrad[d.dia_nombre] || d.dia_nombre;
        const fechaStr = String(d.dia).substring(0, 10);
        resp += `• **${diaNom}** (${fechaStr}): **C$ ${Number(d.total_dia).toLocaleString()}** (${d.tickets} facturas)\n`;
      });
    }
    return resp;
  }

  // 2b. Ventas del Mes Actual (Específico)
  if (q.includes('mes') || q.includes('mensual')) {
    const vMes = context.ventasMes || {};
    const vHoy = context.ventasHoy || {};
    const vendMes = context.ventasVendedorMes || [];

    let resp = `🗓️ **Resumen de Ventas del Mes Actual — Multirepuestos RG:**\n\n`;
    resp += `• **Total Facturado en el Mes:** **C$ ${Number(vMes.total_facturado_mes || 0).toLocaleString()}**\n`;
    resp += `• **Facturas / Tickets Emitidos:** **${Number(vMes.total_tickets_mes || 0).toLocaleString()} facturas**\n`;
    resp += `• **Ventas en Efectivo:** C$ ${Number(vMes.ventas_efectivo_mes || 0).toLocaleString()}\n`;
    resp += `• **Ventas al Crédito:** C$ ${Number(vMes.ventas_credito_mes || 0).toLocaleString()}\n`;
    resp += `• **Ventas Registradas Hoy:** C$ ${Number(vHoy.total_facturado || 0).toLocaleString()} (${vHoy.total_tickets || 0} tickets)\n\n`;

    if (vendMes.length > 0) {
      resp += `👥 **Top Vendedores en el Mes:**\n`;
      vendMes.slice(0, 5).forEach((v, i) => {
        resp += `${i + 1}. **${v.vendedor}**: C$ ${Number(v.total_vendido).toLocaleString()} (${v.tickets} tks)\n`;
      });
    }

    return resp;
  }

  // 3. Venta por Caja / Arqueos y Cierres de Caja
  if (q.includes('cierre') || q.includes('arqueo') || q.includes('por caja') || (q.includes('caja') && !q.includes('hoy'))) {
    const cHoy = context.cajaHoy || {};
    const cierres = context.ultimosCierresCaja || [];

    let resp = `💵 **Venta por Caja y Arqueos Recientes — Multirepuestos RG:**\n\n`;
    resp += `• **Efectivo esperado en cajón hoy:** C$ ${Number(cHoy.efectivoEsperadoTotalCordobas || 0).toLocaleString()}\n`;
    resp += `• **Cajas abiertas actualmente:** ${(cHoy.cajasAbiertas || []).length} abiertas\n\n`;

    if (cierres.length > 0) {
      resp += `📋 **Últimos Cierres y Arqueos Registrados:**\n`;
      cierres.forEach(c => {
        const dif = Number(c.diferencia || 0);
        const estadoDif = dif === 0 ? '✅ Cuadrada exacta' : (dif > 0 ? `⚠️ Sobrante: +C$ ${dif.toLocaleString()}` : `❌ Faltante: -C$ ${Math.abs(dif).toLocaleString()}`);
        resp += `• **Caja #${c.caja_id}** [${c.estado}] (${c.usuario_nombre || 'Usuario'} — ${c.apertura}):\n`;
        resp += `  - Ventas del turno: **C$ ${Number(c.total_ventas_caja || 0).toLocaleString()}** (Efec: C$ ${Number(c.total_ventas_efectivo || 0).toLocaleString()})\n`;
        resp += `  - Cierre: Esperado **C$ ${Number(c.final_esperado || 0).toLocaleString()}** | Real entregado: **C$ ${Number(c.final_real || 0).toLocaleString()}**\n`;
        resp += `  - Arqueo: ${estadoDif}\n\n`;
      });
    }
    return resp;
  }

  // 4. Ventas de hoy / Dinero general
  if (q.includes('venta') || q.includes('vendido') || q.includes('hoy') || q.includes('caja') || q.includes('dinero') || q.includes('cuanto hay')) {
    const vHoy = context.ventasHoy || {};
    const vMes = context.ventasMes || {};
    const cHoy = context.cajaHoy || {};
    return `📊 **Resumen de Ventas y Caja — Multirepuestos RG:**\n\n` +
      `📅 *Fecha:* ${context.fechaHoraActual}\n\n` +
      `• **Total Facturado Hoy:** C$ ${Number(vHoy.total_facturado || 0).toLocaleString()} (${vHoy.total_tickets || 0} facturas)\n` +
      `• **Total Facturado en el Mes:** C$ ${Number(vMes.total_facturado_mes || 0).toLocaleString()} (${vMes.total_tickets_mes || 0} facturas)\n` +
      `• **Ventas en Efectivo Hoy:** C$ ${Number(vHoy.ventas_efectivo || 0).toLocaleString()}\n` +
      `• **Ventas al Crédito Hoy:** C$ ${Number(vHoy.ventas_credito || 0).toLocaleString()}\n\n` +
      `💵 **Estado de Caja Activa:**\n` +
      `• Efectivo esperado en cajón: **C$ ${Number(cHoy.efectivoEsperadoTotalCordobas || 0).toLocaleString()}**\n` +
      `• Cajas abiertas en el sistema: **${(cHoy.cajasAbiertas || []).length} caja(s)**.`;
  }

  // Stock bajo / por agotarse
  if (q.includes('stock') || q.includes('agot') || q.includes('bajo') || q.includes('pocos') || q.includes('falta')) {
    const criticos = context.stockCritico || [];
    if (!criticos.length) return "✅ ¡Buenas noticias! No hay productos con stock menor o igual a 5 unidades actualmente.";
    let resp = `⚠️ **Productos con Stock Crítico (Menos de 5 unidades):**\n\n`;
    criticos.slice(0, 10).forEach(p => {
      resp += `• **${p.nombre}** (Cód: \`${p.codigo || 'S/C'}\`) ➔ **Quedan ${p.existencia} unid.** (Venta: C$ ${Number(p.venta).toLocaleString()})\n`;
    });
    return resp;
  }

  // Clientes / Deudas / Créditos
  if (q.includes('deuda') || q.includes('debe') || q.includes('credito') || q.includes('cliente') || q.includes('cobrar')) {
    const deudores = context.topClientesDeudores || [];
    if (!deudores.length) return "✅ Todos los clientes están al día con sus créditos.";
    let resp = `💳 **Clientes con Mayor Saldo Pendiente (Cuentas por Cobrar):**\n\n`;
    deudores.forEach(c => {
      resp += `• **${c.nombre}**: Saldo: **C$ ${Number(c.saldo_pendiente || 0).toLocaleString()}** ${c.telefono ? `(Tel: ${c.telefono})` : ''}\n`;
    });
    return resp;
  }

  // Más vendidos
  if (q.includes('mas vendido') || q.includes('top') || q.includes('popular') || q.includes('estrella')) {
    const top = context.topProductosVendidos || [];
    if (!top.length) return "No hay registro de ventas en los últimos 30 días.";
    let resp = `🏆 **Top Productos Más Vendidos del Último Mes:**\n\n`;
    top.forEach((p, idx) => {
      resp += `${idx + 1}. **${p.nombre}** ➔ **${p.total_unidades} unidades** (Generó: C$ ${Number(p.total_generado || 0).toLocaleString()})\n`;
    });
    return resp;
  }

  // Inventario general
  if (q.includes('inventario') || q.includes('capital') || q.includes('mercaderia') || q.includes('valor')) {
    const inv = context.resumenInventario || {};
    return `📦 **Resumen General de Inventario Multirepuestos RG:**\n\n` +
      `• **Total de Repuestos Distintos:** ${Number(inv.total_productos_distintos || 0).toLocaleString()}\n` +
      `• **Unidades Totales Físicas:** ${Number(inv.total_unidades_fisicas || 0).toLocaleString()}\n` +
      `• **Valoración a Costo de Compra:** C$ ${Number(inv.valor_total_costo || 0).toLocaleString()}\n` +
      `• **Valoración a Precio de Venta:** C$ ${Number(inv.valor_total_venta || 0).toLocaleString()}`;
  }

  // Respuesta general guiando al usuario
  return `🤖 **ADA — Asistente Multirepuestos RG**\n\n` +
    `Estoy lista para ayudarte con las consultas de tu negocio. Puedes preguntarme directamente por:\n` +
    `• 💵 *"¿Cuánto se ha vendido hoy y qué hay en caja?"*\n` +
    `• 🗓️ *"¿Cuáles son las ventas del mes?"*\n` +
    `• 👤 *"Ventas de Waskar"* o de cualquier empleado.\n` +
    `• 📷 *"Muéstrame la foto de [repuesto]"* para ver fotos del catálogo.\n` +
    `• 📅 *"¿Cuánto hemos vendido en toda la semana y cuál fue el mejor día?"*\n` +
    `• 💰 *"¿Cómo cerraron las últimas cajas?"*\n` +
    `• 📦 *"Repuestos con stock bajo"* o buscar repuestos por nombre/código.\n\n` +
    `*(💡 Conectada a la base de datos de tu empresa en tiempo real).*`;
}

/**
 * Genera un resumen compacto de métricas para IA externa.
 */
function formatCompactBusinessContext(context, specificProducts = []) {
  const v = context.ventasHoy || {};
  const vSem = context.ventasSemana || {};
  const vMes = context.ventasMes || {};
  const c = context.cajaHoy || {};
  const inv = context.resumenInventario || {};

  let text = `DATOS EN TIEMPO REAL (BASE DE DATOS MULTIREPUESTOS RG):\n`;
  text += `- Fecha/Hora: ${context.fechaHoraActual}\n`;
  text += `- Ventas Hoy: Facturado C$ ${Number(v.total_facturado || 0).toLocaleString()} en ${v.total_tickets || 0} tickets (Efectivo: C$ ${Number(v.ventas_efectivo || 0).toLocaleString()}, Digital: C$ ${(Number(v.ventas_tarjeta || 0) + Number(v.ventas_transferencia || 0)).toLocaleString()}, Crédito: C$ ${Number(v.ventas_credito || 0).toLocaleString()})\n`;

  if (vSem.total_facturado_semana > 0) {
    text += `- Ventas Toda la Semana (Últimos 7 días): Facturado C$ ${Number(vSem.total_facturado_semana).toLocaleString()} en ${vSem.total_tickets_semana} tickets (Efectivo: C$ ${Number(vSem.total_efectivo_semana).toLocaleString()}, Crédito: C$ ${Number(vSem.total_credito_semana).toLocaleString()}, Promedio diario: C$ ${Math.round(vSem.promedio_diario).toLocaleString()})\n`;
  }

  text += `- Ventas del Mes: Facturado C$ ${Number(vMes.total_facturado_mes || 0).toLocaleString()} en ${vMes.total_tickets_mes || 0} tickets (Efectivo Mes: C$ ${Number(vMes.ventas_efectivo_mes || 0).toLocaleString()}, Crédito Mes: C$ ${Number(vMes.ventas_credito_mes || 0).toLocaleString()})\n`;

  if (context.ventasVendedorMes && context.ventasVendedorMes.length > 0) {
    const vend = context.ventasVendedorMes.map(v => `${v.vendedor}: C$ ${Number(v.total_vendido).toLocaleString()} (${v.tickets} tks)`).join('; ');
    text += `- Ventas por Vendedor (Mes Actual): ${vend}\n`;
  }

  if (context.empleadosActivos && context.empleadosActivos.length > 0) {
    const emps = context.empleadosActivos.map(e => `${e.nombre} (${e.cargo})`).join(', ');
    text += `- Personal Registrado: ${emps}\n`;
  }

  text += `- Cajas Activas: ${(c.cajasAbiertas || []).length} abiertas. Efectivo esperado en cajón: C$ ${Number(c.efectivoEsperadoTotalCordobas || 0).toLocaleString()}\n`;
  text += `- Inventario: ${Number(inv.total_productos_distintos || 0).toLocaleString()} repuestos (${Number(inv.total_unidades_fisicas || 0).toLocaleString()} unidades). Valor venta: C$ ${Number(inv.valor_total_venta || 0).toLocaleString()}\n`;

  if (specificProducts && specificProducts.length > 0) {
    const prods = specificProducts.slice(0, 5).map(p => `• ${p.nombre} (Cód: ${p.codigo || 'S/C'}) -> Stock: ${p.existencia} uds | Venta: C$ ${Number(p.venta || 0).toLocaleString()} | Mayoreo: C$ ${Number(p.mayoreo || p.venta || 0).toLocaleString()}`).join('\n');
    text += `REPUESTOS RELEVANTES:\n${prods}\n`;
  }

  return text;
}

/**
 * Consulta al motor de IA externo.
 */
async function queryGemini(apiKey, question, context, history = [], specificProducts = []) {
  const cleanKey = String(apiKey || '').trim().replace(/[\r\n"']/g, '');

  const CANDIDATE_MODELS = [
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.8-flash',
    'gemini-flash-latest'
  ];

  const systemInstruction = `
Eres ADA, la Inteligencia Artificial oficial de Negocios y Operaciones de "Multirepuestos RG", empresa líder de repuestos automotrices y de motos en Nicaragua.
Tu función es asistir a la gerencia, propietarios y vendedores con respuestas ejecutivas, precisas, profesionales y concisas basadas en los datos en vivo del negocio.

REGLAS DE IDENTIDAD Y SEGURIDAD:
1. TU IDENTIDAD ES ÚNICAMENTE "ADA". NUNCA menciones que eres Gemini, Google, OpenAI ni modelos externos. Si te preguntan quién eres o qué modelo eres, responde siempre: "Soy ADA, el Asistente Inteligente de Negocios desarrollado a medida para Multirepuestos RG".
2. RESTRICCIÓN ESTRICTA DE ÁMBITO (SOLO NEGOCIO): Únicamente tienes autorización para responder sobre operaciones de Multirepuestos RG (ventas de la semana, del mes, hoy, rendimiento de empleados/vendedores, arqueos y ventas por caja, precios de repuestos, existencia, inventario, clientes deudores y métricas del negocio).
3. SI EL USUARIO HACE PREGUNTAS FUERA DEL NEGOCIO: Rechaza amablemente indicando que solo estás autorizada para consultas de Multirepuestos RG.
4. FORMATO: Responde en español formal nicaragüense, claro, conciso, usando Markdown elegante (viñetas y negritas). Usa "C$" para Córdobas y "$" para Dólares.

${formatCompactBusinessContext(context, specificProducts)}
`;

  const contents = [];
  if (Array.isArray(history)) {
    history.slice(-2).forEach(h => {
      if (h.role && h.text) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text.substring(0, 300) }]
        });
      }
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: question }]
  });

  const requestBody = {
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1200,
      thinkingConfig: { thinkingBudget: 0 }
    }
  };

  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(cleanKey)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-goog-api-key': cleanKey
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        lastError = new Error(`Gemini [${model}] status ${response.status}: ${errorText}`);
        if (response.status === 401 || response.status === 403) break;
        continue;
      }

      const data = await response.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textOutput) return textOutput;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('No se pudo obtener respuesta del motor de IA.');
}

/**
 * Función principal: Responde cualquier pregunta del negocio con IA o fallback local.
 */
async function askBusinessAI({ question, history = [], userId = null }) {
  if (!question || !question.trim()) {
    return {
      answer: "Por favor escribe una consulta o pregunta sobre Multirepuestos RG.",
      image: null,
      product: null,
      provider: "none"
    };
  }

  const rawQ = question.trim();
  const normalizedQuestion = rawQ.toLowerCase();

  // 1. VERIFICAR SI PIDE FOTOGRAFÍA DE UN PRODUCTO
  const isPhotoQuery = /\b(foto|fotos|fotografia|fotografía|imagen|imagenes|imágenes)\b/i.test(rawQ) ||
    /\b(muestrame|muéstrame|muestra|enseñame|enséñame|ver)\s+(?:la\s+)?(?:foto|fotografia|fotografía|imagen)/i.test(rawQ) ||
    /\b(como\s+se\s+ve|cómo\s+se\s+ve)\b/i.test(rawQ);

  if (isPhotoQuery) {
    const photoResult = await getProductPhoto(rawQ, history);
    return {
      answer: photoResult.answer,
      image: photoResult.image,
      product: photoResult.product,
      provider: "ada-catalog-photo",
      hasKey: true
    };
  }

  // 2. VERIFICAR SI PREGUNTA POR VENTAS DE UN EMPLEADO / VENDEDOR ESPECÍFICO (ej: "ventas waskar", "ventas de waskar")
  const activeEmps = [];
  try {
    const [emps] = await pool.query('SELECT nombre FROM empleados WHERE activo = 1');
    emps.forEach(e => activeEmps.push(e));
  } catch (e) {}

  const targetEmployee = extractEmployeeName(rawQ, activeEmps);
  const isEmployeeSalesQuery = targetEmployee && (
    normalizedQuestion.includes('venta') || normalizedQuestion.includes('vendio') || normalizedQuestion.includes('vendió') ||
    normalizedQuestion.includes('reporte') || normalizedQuestion.includes('cuanto') || normalizedQuestion.includes('factur') ||
    normalizedQuestion.includes('ticket') || normalizedQuestion.includes('de')
  );

  if (isEmployeeSalesQuery) {
    const empReport = await getEmployeeSalesReport(targetEmployee);
    if (empReport) {
      return {
        answer: empReport,
        image: null,
        product: null,
        provider: "ada-employee-report",
        hasKey: true
      };
    }
  }

  // Verificar si la respuesta está en caché (60s)
  const cached = queryResponseCache.get(normalizedQuestion);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return {
      answer: cached.answer,
      image: null,
      product: null,
      provider: "ada-cached",
      hasKey: true
    };
  }

  const context = await getLiveBusinessContext();

  // STOP WORDS AMPLIADO para no disparar búsquedas de productos accidentales
  const STOP_WORDS = new Set([
    'cuanto', 'cuantos', 'cuanta', 'cuantas', 'donde', 'precio', 'precios', 'costo', 'cuesta', 
    'repuesto', 'repuestos', 'tienen', 'tenemos', 'hay', 'vende', 'venden', 'stock', 'quedan', 
    'queda', 'existencia', 'existencias', 'por', 'para', 'con', 'del', 'las', 'los', 'una', 
    'uno', 'unos', 'unas', 'que', 'como', 'cual', 'cuales', 'sobre', 'este', 'esta', 'estos',
    'estas', 'favor', 'porfa', 'hola', 'buenas', 'dime', 'consultar', 'busca', 'buscar',
    'semana', 'semanal', 'dias', 'dia', 'empleado', 'empleados', 'vendedor', 'vendedores',
    'caja', 'cajas', 'cierre', 'cierres', 'arqueo', 'arqueos', 'turno', 'turnos',
    'ayer', 'antier', 'mes', 'mensual', 'total', 'totales', 'quien', 'quién', 'quienes', 'quiénes',
    'vendio', 'vendió', 'vendieron', 'vendimos', 'venta', 'ventas', 'vendido', 'mas', 'más', 'cada',
    'diferencia', 'diferencias', 'hubo', 'cerraron', 'cerró', 'abrieron', 'abrió', 'mejor',
    'son', 'es', 'el', 'la', 'de', 'al', 'dame', 'dar', 'muestra', 'muestrame', 'muéstrame',
    'ver', 'reporte', 'reportes', 'resumen', 'detalle', 'foto', 'fotos', 'imagen', 'imagenes'
  ]);

  const isBusinessMetric = normalizedQuestion.includes('semana') || normalizedQuestion.includes('emplead') || 
    normalizedQuestion.includes('vendedor') || normalizedQuestion.includes('caja') || normalizedQuestion.includes('cierre') || 
    normalizedQuestion.includes('arqueo') || normalizedQuestion.includes('quien vendio') || normalizedQuestion.includes('quien vendió') || 
    normalizedQuestion.includes('cuanto se vendio') || normalizedQuestion.includes('cuanto se ha vendido') || 
    normalizedQuestion.includes('cuanto hemos vendido') || normalizedQuestion.includes('mejor dia') || 
    normalizedQuestion.includes('mes') || normalizedQuestion.includes('mensual') || normalizedQuestion.includes('hoy') || 
    normalizedQuestion.includes('facturad') || normalizedQuestion.includes('total de venta');

  let specificProducts = [];
  if (!isBusinessMetric) {
    const cleanWords = rawQ
      .toLowerCase()
      .replace(/[¿?¡!.,:;()_]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 3 && !STOP_WORDS.has(w));

    if (cleanWords.length > 0) {
      specificProducts = await searchProductsForQuery(cleanWords.join(' '));
    }
  }

  const apiKey = await getGeminiApiKey();

  if (apiKey) {
    try {
      const adaAnswer = await queryGemini(apiKey, rawQ, context, history, specificProducts);

      queryResponseCache.set(normalizedQuestion, {
        answer: adaAnswer,
        timestamp: Date.now()
      });

      return {
        answer: adaAnswer,
        image: null,
        product: null,
        provider: "ada",
        hasKey: true
      };
    } catch (err) {
      console.error('[ADA] Fallo al invocar IA externa, usando motor local:', err.message);
      const fallback = generateLocalFallbackResponse(rawQ, context, specificProducts);
      return {
        answer: fallback,
        image: null,
        product: null,
        provider: "local-fallback",
        hasKey: true
      };
    }
  }

  // Sin API Key configurada: usar motor local
  const localAnswer = generateLocalFallbackResponse(rawQ, context, specificProducts);
  return {
    answer: localAnswer,
    image: null,
    product: null,
    provider: "local-waiting-key",
    hasKey: false
  };
}

module.exports = {
  askBusinessAI,
  getLiveBusinessContext,
  getGeminiApiKey,
  searchProductsForQuery,
  getEmployeeSalesReport,
  getProductPhoto,
  extractEmployeeName
};
