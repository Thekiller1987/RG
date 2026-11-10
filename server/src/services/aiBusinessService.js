// server/src/services/aiBusinessService.js
const pool = require('../config/db');

// Caché en memoria para evitar consumo redundante de tokens en preguntas repetidas durante la defensa
const queryResponseCache = new Map();
const CACHE_TTL_MS = 45 * 1000; // 45 segundos de caché

/**
 * Recopila en tiempo real las métricas y estado del negocio directamente desde la BD
 * usando la hora local de Managua (UTC-6) y respetando ajustes de caja.
 */
async function getLiveBusinessContext() {
  const safe = (v) => { const n = Number(v); return (isNaN(n) || !isFinite(n)) ? 0 : n; };

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
    // 1. Estado de Cajas de Hoy (Hora Managua UTC-6) + cálculo unificado con POS y Gestión de Cajas
    const [cajas] = await pool.query(`
      SELECT id, usuario_id, usuario_nombre, fecha_apertura, fecha_cierre, monto_inicial,
             total_ventas_efectivo, total_ventas_tarjeta, total_ventas_transferencia, total_ventas_credito,
             final_esperado, final_real, diferencia, detalles_json 
      FROM cierres_caja 
      WHERE DATE(DATE_SUB(fecha_apertura, INTERVAL 6 HOUR)) = DATE(DATE_SUB(NOW(), INTERVAL 6 HOUR))
         OR ((fecha_cierre IS NULL OR fecha_cierre < '2000-01-01') AND fecha_apertura >= NOW() - INTERVAL 24 HOUR)
      ORDER BY id DESC
    `);

    let totalVentasCajasHoy = 0;
    let totalEfectivoVentasCajasHoy = 0;
    let totalTarjetaCajasHoy = 0;
    let totalTransfCajasHoy = 0;
    let totalCreditoCajasHoy = 0;
    let totalAbonosCajasHoy = 0;
    let totalSalidasCajasHoy = 0;
    let totalEfectivoEsperadoHoy = 0;
    let totalTicketsCajasHoy = 0;
    const abiertas = [];
    const cerradasHoy = [];

    if (cajas.length > 0) {
      cajas.forEach(c => {
        let det = {};
        try {
          det = typeof c.detalles_json === 'string' ? JSON.parse(c.detalles_json) : (c.detalles_json || {});
        } catch (e) { det = {}; }

        const rawTxs = Array.isArray(det.transactions) ? det.transactions : [];
        const seenIds = new Set();
        const txs = [];
        for (const tx of rawTxs) {
          if (tx?.id && seenIds.has(tx.id)) continue;
          if (tx?.id) seenIds.add(tx.id);
          txs.push(tx);
        }

        const tasa = safe(det.tasaDolar) || 36.60;
        const inicial = Math.max(0, safe(det.initialAmount ?? c.monto_inicial ?? 0));

        let ventasCaja = 0;
        let vEfecC = 0;
        let vDol = 0;
        let vTar = 0;
        let vTransf = 0;
        let vCred = 0;
        let abonosCaja = 0;
        let entradasCaja = 0;
        let salidasCaja = 0;
        let devEfecC = 0;
        let ticketsCaja = 0;

        txs.forEach(t => {
          let type = (t?.type || '').toLowerCase().trim();
          type = type.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          let pd = t?.pagoDetalles || {};
          if (typeof pd === 'string') { try { pd = JSON.parse(pd); } catch { pd = {}; } }
          if (!pd || typeof pd !== 'object') pd = {};

          const amt = safe(t.amount);
          const totalVenta = safe(pd.totalVenta) || amt;
          const txEf = safe(pd.efectivo);
          const txDol = safe(pd.dolares);
          const txCam = safe(pd.cambio);
          const txIng = safe(pd.ingresoCaja);
          const tar = safe(pd.tarjeta);
          const tr = safe(pd.transferencia);
          const cr = safe(pd.credito);

          if (type.startsWith('venta')) {
            const rev = Math.abs(totalVenta || amt);
            ventasCaja += rev;
            ticketsCaja += 1;

            if (txEf > 0.001 || txDol > 0.001 || txCam > 0.001) {
              vEfecC += (txEf - txCam);
              vDol += txDol;
            } else if (txIng > 0.001) {
              vEfecC += txIng;
            } else {
              const noEf = tar + tr + cr;
              const res = totalVenta - noEf;
              if (res > 0.001) vEfecC += res;
            }
            vTar += tar;
            vTransf += tr;
            vCred += cr;
          } else if (type.includes('abono') || type.includes('liquid') || type.includes('pedido') || type.includes('apartado')) {
            let ef = 0;
            let dol = 0;
            if (txDol > 0.001) {
              dol = txDol;
              ef = txEf - txCam;
            } else if (txEf > 0.001) {
              ef = txEf - txCam;
            } else if (txIng > 0.001) {
              ef = txIng;
            } else {
              ef = Math.max(0, amt - (tar + tr));
            }
            abonosCaja += ef + (dol * tasa) + tar + tr;
            vEfecC += ef;
            vDol += dol;
          } else if (type === 'entrada') {
            entradasCaja += Math.abs(amt);
          } else if (type === 'salida' || type === 'gasto') {
            salidasCaja += Math.abs(amt);
          } else if (type.includes('devolucion') || type.includes('cancelacion') || type.includes('anulacion')) {
            const revAmt = Math.abs(totalVenta || amt);
            ventasCaja -= revAmt;
            if (pd.ingresoCaja !== undefined && pd.ingresoCaja !== null) {
              devEfecC += Math.abs(safe(pd.ingresoCaja));
            } else if (txEf > 0.001) {
              devEfecC += txEf;
            } else {
              const cashPart = Math.abs(amt) - (tar + tr + cr);
              if (cashPart > 0.001) devEfecC += cashPart;
            }
          } else if (type === 'ajuste') {
            const target = pd.target || t.target || 'efectivo';
            const txTime = new Date(t.at || 0).getTime();
            const isPairedDuplicate = target === 'ventas_totales' && txs.some(other => {
              if (other === t) return false;
              if ((other?.type || '').toLowerCase().trim() !== 'ajuste') return false;
              let opd = other?.pagoDetalles || {};
              if (typeof opd === 'string') { try { opd = JSON.parse(opd); } catch { opd = {}; } }
              const oTarget = opd.target || other.target || '';
              if (!oTarget || oTarget === 'ventas_totales') return false;
              const oTime = new Date(other.at || 0).getTime();
              return Math.abs(oTime - txTime) < 5000;
            });

            if (target === 'efectivo') {
              vEfecC += amt;
              ventasCaja += amt;
            } else if (target === 'dolares') {
              vDol += amt;
              ventasCaja += (amt * tasa);
            } else if (target === 'tarjeta') {
              vTar += amt;
              ventasCaja += amt;
            } else if (target === 'transferencia') {
              vTransf += amt;
              ventasCaja += amt;
            } else if (target === 'credito') {
              vCred += amt;
              ventasCaja += amt;
            } else if (target === 'ventas_totales' && !isPairedDuplicate) {
              vEfecC += amt;
              ventasCaja += amt;
            }
          }
        });

        ventasCaja = Math.max(0, safe(ventasCaja));
        const netEfecC = vEfecC - devEfecC + entradasCaja - salidasCaja;
        const efEsperadoCaja = safe(inicial + netEfecC + (vDol * tasa));
        const noEfCaja = safe(vTar + vTransf + vCred);

        const isAbierta = !c.fecha_cierre || new Date(c.fecha_cierre) < new Date('2000-01-01');
        const boxInfo = {
          cajaId: c.id,
          usuarioNombre: c.usuario_nombre || 'Caja General',
          montoInicial: inicial,
          ventasTurno: ventasCaja,
          efectivoEsperado: efEsperadoCaja,
          noEfectivo: noEfCaja,
          tickets: ticketsCaja
        };

        if (isAbierta) {
          abiertas.push(boxInfo);
        } else {
          cerradasHoy.push(boxInfo);
        }

        totalVentasCajasHoy += ventasCaja;
        totalEfectivoVentasCajasHoy += Math.max(0, vEfecC - devEfecC + (vDol * tasa));
        totalTarjetaCajasHoy += vTar;
        totalTransfCajasHoy += vTransf;
        totalCreditoCajasHoy += vCred;
        totalAbonosCajasHoy += abonosCaja;
        totalSalidasCajasHoy += salidasCaja;
        totalEfectivoEsperadoHoy += efEsperadoCaja;
        totalTicketsCajasHoy += ticketsCaja;
      });

      context.cajaHoy = {
        totalCajasRegistradas: cajas.length,
        cajasAbiertas: abiertas,
        cajasCerradasHoy: cerradasHoy,
        efectivoEsperadoTotalCordobas: safe(totalEfectivoEsperadoHoy),
        ventasTurnoCajas: safe(totalVentasCajasHoy),
        totalCobrosNoEfectivo: safe(totalTarjetaCajasHoy + totalTransfCajasHoy + totalCreditoCajasHoy),
        totalAbonosHoy: safe(totalAbonosCajasHoy),
        totalSalidasHoy: safe(totalSalidasCajasHoy)
      };
    }

    // 2. Resumen de Ventas Facturadas de Hoy (Sincronizado con Cajas de Hoy si existen cajas registradas)
    const [ventasHoyRows] = await pool.query(`
      SELECT 
        COUNT(id_venta) AS total_tickets,
        COALESCE(SUM(total_venta), 0) AS total_facturado,
        COALESCE(SUM(
          GREATEST(0, COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.efectivo')) AS DECIMAL(10,2)), 0) - COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.cambio')) AS DECIMAL(10,2)), 0))
        ), 0) AS ventas_efectivo,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.tarjeta')) AS DECIMAL(10,2))), 0) AS ventas_tarjeta,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.transferencia')) AS DECIMAL(10,2))), 0) AS ventas_transferencia,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.credito')) AS DECIMAL(10,2))), 0) AS ventas_credito
      FROM ventas
      WHERE DATE(DATE_SUB(fecha, INTERVAL 6 HOUR)) = DATE(DATE_SUB(NOW(), INTERVAL 6 HOUR))
        AND estado != 'CANCELADA'
    `);

    if (cajas.length > 0) {
      context.ventasHoy = {
        total_tickets: totalTicketsCajasHoy || Number(ventasHoyRows[0]?.total_tickets || 0),
        total_facturado: safe(totalVentasCajasHoy),
        ventas_efectivo: safe(totalEfectivoVentasCajasHoy),
        ventas_tarjeta: safe(totalTarjetaCajasHoy),
        ventas_transferencia: safe(totalTransfCajasHoy),
        ventas_credito: safe(totalCreditoCajasHoy)
      };
    } else {
      context.ventasHoy = ventasHoyRows[0] || {
        total_tickets: 0,
        total_facturado: 0,
        ventas_efectivo: 0,
        ventas_tarjeta: 0,
        ventas_transferencia: 0,
        ventas_credito: 0
      };
    }

    // 2b. Resumen de Ventas Facturadas del Mes Actual (Hora Managua)
    const [ventasMesRows] = await pool.query(`
      SELECT 
        COUNT(id_venta) AS total_tickets_mes,
        COALESCE(SUM(total_venta), 0) AS total_facturado_mes,
        COALESCE(SUM(
          GREATEST(0, COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.efectivo')) AS DECIMAL(10,2)), 0) - COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.cambio')) AS DECIMAL(10,2)), 0))
        ), 0) AS ventas_efectivo_mes,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.tarjeta')) AS DECIMAL(10,2))), 0) AS ventas_tarjeta_mes,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.transferencia')) AS DECIMAL(10,2))), 0) AS ventas_transferencia_mes,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.credito')) AS DECIMAL(10,2))), 0) AS ventas_credito_mes
      FROM ventas
      WHERE MONTH(DATE_SUB(fecha, INTERVAL 6 HOUR)) = MONTH(DATE_SUB(NOW(), INTERVAL 6 HOUR))
        AND YEAR(DATE_SUB(fecha, INTERVAL 6 HOUR)) = YEAR(DATE_SUB(NOW(), INTERVAL 6 HOUR))
        AND estado != 'CANCELADA'
    `);
    context.ventasMes = ventasMesRows[0] || {};

    // 2c. Resumen de Ventas de Toda la Semana (Últimos 7 días) y Desglose Diario
    const [ventasSemanaRows] = await pool.query(`
      SELECT 
        DATE(DATE_SUB(fecha, INTERVAL 6 HOUR)) AS dia,
        DAYNAME(DATE_SUB(fecha, INTERVAL 6 HOUR)) AS dia_nombre,
        COUNT(id_venta) AS tickets,
        COALESCE(SUM(total_venta), 0) AS total_dia,
        COALESCE(SUM(
          GREATEST(0, COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.efectivo')) AS DECIMAL(10,2)), 0) - COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.cambio')) AS DECIMAL(10,2)), 0))
        ), 0) AS efectivo_dia,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.credito')) AS DECIMAL(10,2))), 0) AS credito_dia,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.tarjeta')) AS DECIMAL(10,2))), 0) AS tarjeta_dia,
        COALESCE(SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(pago_detalles, '$.transferencia')) AS DECIMAL(10,2))), 0) AS transferencia_dia
      FROM ventas
      WHERE DATE_SUB(fecha, INTERVAL 6 HOUR) >= DATE_SUB(DATE(DATE_SUB(NOW(), INTERVAL 6 HOUR)), INTERVAL 7 DAY)
        AND estado != 'CANCELADA'
      GROUP BY DATE(DATE_SUB(fecha, INTERVAL 6 HOUR)), DAYNAME(DATE_SUB(fecha, INTERVAL 6 HOUR))
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
      WHERE DATE_SUB(v.fecha, INTERVAL 6 HOUR) >= DATE_SUB(DATE(DATE_SUB(NOW(), INTERVAL 6 HOUR)), INTERVAL 7 DAY)
        AND v.estado != 'CANCELADA'
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
      WHERE MONTH(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) = MONTH(DATE_SUB(NOW(), INTERVAL 6 HOUR))
        AND YEAR(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) = YEAR(DATE_SUB(NOW(), INTERVAL 6 HOUR))
        AND v.estado != 'CANCELADA'
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
        IF(fecha_cierre IS NULL OR fecha_cierre < '2000-01-01', 'ABIERTA', 'CERRADA') AS estado,
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
      LIMIT 10
    `);
    context.topClientesDeudores = deudoresRows;

    // 6. Top 8 Productos Más Vendidos del Último Mes
    const [topProdRows] = await pool.query(`
      SELECT p.nombre, p.codigo, SUM(dv.cantidad) as total_unidades, SUM(dv.cantidad * dv.precio_unitario) as total_generado
      FROM detalle_ventas dv
      JOIN ventas v ON dv.id_venta = v.id_venta
      JOIN productos p ON dv.id_producto = p.id_producto
      WHERE v.fecha >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND v.estado != 'CANCELADA'
      GROUP BY p.id_producto, p.nombre, p.codigo
      ORDER BY total_unidades DESC
      LIMIT 8
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
      ORDER BY (imagen IS NOT NULL AND CHAR_LENGTH(imagen) > 20) DESC, existencia DESC
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
        ORDER BY (imagen IS NOT NULL AND CHAR_LENGTH(imagen) > 20) DESC, existencia DESC
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
  const cleaned = question
    .replace(/[¿?¡!.,:;()_]/g, ' ')
    .replace(/\b(muestrame|muéstrame|muestra|ver|enseñame|enséñame|dame|pon|mostrar|foto|fotos|fotografia|fotografía|imagen|imagenes|imágenes|del|de\s+la|de\s+los|de\s+las|de|el|la|los|las|un|una|repuesto|repuestos|producto|productos|porfa|favor|tienes|como\s+se\s+ve|cómo\s+se\s+ve|catalogo|catálogo)\b/gi, ' ')
    .trim();

  let searchTerm = cleaned;

  // Si no se especificó un producto en la pregunta (ej. el usuario sólo dijo "muéstrame la foto" o dio clic al chip):
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
        } else if (nameMatch && nameMatch[1] && !nameMatch[1].includes('Repuestos') && !nameMatch[1].includes('Resumen') && !nameMatch[1].includes('Ventas') && !nameMatch[1].includes('ADA')) {
          searchTerm = nameMatch[1].trim();
          break;
        }
      }
    }
  }

  // Si aún no hay término (ej. tocó el botón "Foto de Repuesto" directamente al abrir el chat), mostrar un producto con foto real del catálogo
  if (!searchTerm || searchTerm.length < 2) {
    try {
      const [sampleRows] = await pool.query(`
        SELECT id_producto, codigo, nombre, descripcion, existencia, stock_reservado, venta, mayoreo, imagen
        FROM productos
        WHERE imagen IS NOT NULL AND CHAR_LENGTH(imagen) > 100 AND existencia > 0
        ORDER BY existencia DESC
        LIMIT 1
      `);
      if (sampleRows.length > 0) {
        const prod = sampleRows[0];
        const rawImg = Buffer.isBuffer(prod.imagen) ? prod.imagen.toString('utf-8') : String(prod.imagen);
        const base64Image = rawImg.startsWith('data:') ? rawImg : `data:image/jpeg;base64,${rawImg}`;
        const prodInfo = {
          id: prod.id_producto,
          codigo: prod.codigo,
          nombre: prod.nombre,
          existencia: prod.existencia,
          stock_reservado: prod.stock_reservado || 0,
          venta: prod.venta,
          mayoreo: prod.mayoreo || prod.venta
        };
        return {
          answer: `📷 Aquí tienes un ejemplo del catálogo con fotografía (**${prod.nombre}**):\n\n` +
            `• **Código:** \`${prod.codigo || 'S/C'}\`\n` +
            `• **Existencia:** **${prod.existencia} unidades** (Reservado: ${prod.stock_reservado || 0})\n` +
            `• **Precio Venta:** **C$ ${Number(prod.venta).toLocaleString()}** | Mayoreo: **C$ ${Number(prod.mayoreo || prod.venta).toLocaleString()}**\n\n` +
            `💡 *También puedes pedirme la foto de cualquier repuesto por nombre o código (ej: "Foto de casco", "Foto de llanta", "Foto de bujía").*`,
          image: base64Image,
          product: prodInfo
        };
      }
    } catch (e) {}

    return {
      answer: `📷 Para mostrarte la fotografía de un repuesto, indícame su nombre o código. Por ejemplo:\n• *"Muéstrame la foto de llanta 100/90-17"*\n• *"Foto de casco"*\n• *"Foto de bujía"*`,
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

    const firstTokenPrefix = `${tokens[0]}%`;

    // 1. Intentar con AND priorizando productos que tengan imagen y cuyo nombre empiece por la palabra buscada
    let [rows] = await pool.query(`
      SELECT id_producto, codigo, nombre, descripcion, existencia, stock_reservado, venta, mayoreo, imagen
      FROM productos
      WHERE ${conditions.join(' AND ')}
      ORDER BY (imagen IS NOT NULL AND CHAR_LENGTH(imagen) > 20) DESC,
               (nombre LIKE ?) DESC,
               existencia DESC
      LIMIT 1
    `, [...params, firstTokenPrefix]);

    // 2. Si no hubo coincidencia con AND y había más de 1 token, intentar OR
    if (!rows.length && tokens.length > 1) {
      const [rowsOr] = await pool.query(`
        SELECT id_producto, codigo, nombre, descripcion, existencia, stock_reservado, venta, mayoreo, imagen
        FROM productos
        WHERE ${conditions.join(' OR ')}
        ORDER BY (imagen IS NOT NULL AND CHAR_LENGTH(imagen) > 20) DESC,
                 (nombre LIKE ?) DESC,
                 existencia DESC
        LIMIT 1
      `, [...params, firstTokenPrefix]);
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

  const knownNames = [
    'waskar', 'miguelito', 'walter', 'rosa', 'carlos', 'admin', 'lisamara', 'multirepuestorg',
    ...activeEmployees.map(e => e.nombre.toLowerCase().split(/\s+/)[0])
  ];

  for (const name of knownNames) {
    if (name.length >= 3 && q.includes(name)) {
      return name;
    }
  }

  const patterns = [
    /(?:ventas?|reporte|facturaci[oó]n|tickets?)\s+(?:de\s+)?([a-zA-ZáéíóúñÁÉÍÓÚÑ]+)/i,
    /(?:cu[aá]nto\s+(?:ha\s+)?vendi[oó])\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ]+)/i,
    /(?:qu[eé]\s+(?:ha\s+)?vendido)\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ]+)/i
  ];

  const IGNORE_WORDS = new Set([
    'hoy', 'ayer', 'antier', 'mes', 'semana', 'ano', 'año', 'caja', 'cajas', 'tienda', 'negocio',
    'inventario', 'repuesto', 'repuestos', 'producto', 'productos', 'contado', 'credito', 'crédito',
    'efectivo', 'todos', 'cada', 'un', 'una', 'el', 'la', 'los', 'las', 'del', 'dia', 'día', 'general',
    'toda', 'todo', 'este', 'esta', 'emplead', 'empleado', 'empleados', 'vendedor', 'vendedores'
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

    const [metricsRows] = await pool.query(`
      SELECT
        -- Hoy (Hora Managua)
        COALESCE(SUM(CASE WHEN DATE(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) = DATE(DATE_SUB(NOW(), INTERVAL 6 HOUR)) THEN v.total_venta ELSE 0 END), 0) AS total_hoy,
        COUNT(CASE WHEN DATE(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) = DATE(DATE_SUB(NOW(), INTERVAL 6 HOUR)) THEN v.id_venta ELSE NULL END) AS tickets_hoy,
        COALESCE(SUM(CASE WHEN DATE(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) = DATE(DATE_SUB(NOW(), INTERVAL 6 HOUR)) THEN GREATEST(0, COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(v.pago_detalles, '$.efectivo')) AS DECIMAL(10,2)), 0) - COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(v.pago_detalles, '$.cambio')) AS DECIMAL(10,2)), 0)) ELSE 0 END), 0) AS efec_hoy,
        COALESCE(SUM(CASE WHEN DATE(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) = DATE(DATE_SUB(NOW(), INTERVAL 6 HOUR)) THEN (COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(v.pago_detalles, '$.tarjeta')) AS DECIMAL(10,2)), 0) + COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(v.pago_detalles, '$.transferencia')) AS DECIMAL(10,2)), 0)) ELSE 0 END), 0) AS digital_hoy,
        COALESCE(SUM(CASE WHEN DATE(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) = DATE(DATE_SUB(NOW(), INTERVAL 6 HOUR)) THEN COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(v.pago_detalles, '$.credito')) AS DECIMAL(10,2)), 0) ELSE 0 END), 0) AS cred_hoy,

        -- Mes Actual
        COALESCE(SUM(CASE WHEN MONTH(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) = MONTH(DATE_SUB(NOW(), INTERVAL 6 HOUR)) AND YEAR(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) = YEAR(DATE_SUB(NOW(), INTERVAL 6 HOUR)) THEN v.total_venta ELSE 0 END), 0) AS total_mes,
        COUNT(CASE WHEN MONTH(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) = MONTH(DATE_SUB(NOW(), INTERVAL 6 HOUR)) AND YEAR(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) = YEAR(DATE_SUB(NOW(), INTERVAL 6 HOUR)) THEN v.id_venta ELSE NULL END) AS tickets_mes,
        COALESCE(SUM(CASE WHEN MONTH(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) = MONTH(DATE_SUB(NOW(), INTERVAL 6 HOUR)) AND YEAR(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) = YEAR(DATE_SUB(NOW(), INTERVAL 6 HOUR)) THEN GREATEST(0, COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(v.pago_detalles, '$.efectivo')) AS DECIMAL(10,2)), 0) - COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(v.pago_detalles, '$.cambio')) AS DECIMAL(10,2)), 0)) ELSE 0 END), 0) AS efec_mes,
        COALESCE(SUM(CASE WHEN MONTH(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) = MONTH(DATE_SUB(NOW(), INTERVAL 6 HOUR)) AND YEAR(DATE_SUB(v.fecha, INTERVAL 6 HOUR)) = YEAR(DATE_SUB(NOW(), INTERVAL 6 HOUR)) THEN COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(v.pago_detalles, '$.credito')) AS DECIMAL(10,2)), 0) ELSE 0 END), 0) AS cred_mes,

        -- Últimos 7 Días
        COALESCE(SUM(CASE WHEN DATE_SUB(v.fecha, INTERVAL 6 HOUR) >= DATE_SUB(DATE(DATE_SUB(NOW(), INTERVAL 6 HOUR)), INTERVAL 7 DAY) THEN v.total_venta ELSE 0 END), 0) AS total_semana,
        COUNT(CASE WHEN DATE_SUB(v.fecha, INTERVAL 6 HOUR) >= DATE_SUB(DATE(DATE_SUB(NOW(), INTERVAL 6 HOUR)), INTERVAL 7 DAY) THEN v.id_venta ELSE NULL END) AS tickets_semana,

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

    const [ultimas] = await pool.query(`
      SELECT v.id_venta, v.fecha, v.total_venta,
             COALESCE(e.nombre, u.nombre_usuario) AS vendedor
      FROM ventas v
      LEFT JOIN empleados e ON v.id_empleado = e.id_empleado
      LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
      WHERE (LOWER(e.nombre) LIKE ? OR LOWER(u.nombre_usuario) LIKE ?)
        AND v.estado != 'CANCELADA'
      ORDER BY v.id_venta DESC
      LIMIT 3
    `, [term, term]);

    const [cajas] = await pool.query(`
      SELECT id, usuario_nombre, monto_inicial, fecha_apertura, fecha_cierre
      FROM cierres_caja
      WHERE (LOWER(usuario_nombre) LIKE ? OR usuario_id = ?)
        AND (DATE(DATE_SUB(fecha_apertura, INTERVAL 6 HOUR)) = DATE(DATE_SUB(NOW(), INTERVAL 6 HOUR)) OR fecha_cierre IS NULL)
      ORDER BY id DESC LIMIT 1
    `, [term, userMatches[0]?.id_usuario || -1]);

    const cajaActiva = cajas[0];

    let resp = `👤 **Reporte de Ventas — ${officialName.toUpperCase()}** *(${roleInfo})*:\n\n`;

    resp += `📅 **Ventas de Hoy:**\n`;
    if (Number(m.total_hoy) > 0 || Number(m.tickets_hoy) > 0) {
      resp += `• **Total Facturado Hoy:** **C$ ${Number(m.total_hoy).toLocaleString()}** (${m.tickets_hoy} facturas)\n`;
      resp += `• **En Efectivo:** C$ ${Number(m.efec_hoy).toLocaleString()} | **Al Crédito:** C$ ${Number(m.cred_hoy).toLocaleString()}`;
      if (Number(m.digital_hoy) > 0) resp += ` | **Digital:** C$ ${Number(m.digital_hoy).toLocaleString()}`;
      resp += `\n\n`;
    } else {
      resp += `• Sin ventas individuales asignadas hoy (C$ 0 — las ventas de hoy están operando en la caja general **multirepuestorg**).\n\n`;
    }

    resp += `🗓️ **Acumulado en el Mes Actual:**\n`;
    if (Number(m.total_mes) > 0) {
      resp += `• **Total Facturado:** **C$ ${Number(m.total_mes).toLocaleString()}** (${m.tickets_mes} facturas)\n`;
      resp += `• **En Efectivo:** C$ ${Number(m.efec_mes).toLocaleString()} | **Al Crédito:** C$ ${Number(m.cred_mes).toLocaleString()}\n\n`;
    } else {
      resp += `• Sin facturas directas asignadas este mes (operando bajo caja general **multirepuestorg**).\n\n`;
    }

    resp += `📊 **Rendimiento Últimos 7 Días:**\n`;
    if (Number(m.total_semana) > 0) {
      resp += `• **Facturado en la Semana:** **C$ ${Number(m.total_semana).toLocaleString()}** (${m.tickets_semana} facturas)\n\n`;
    } else {
      resp += `• Sin ventas individuales en los últimos 7 días.\n\n`;
    }

    resp += `🏆 **Historial Acumulado en el Sistema:**\n`;
    resp += `• **Total Histórico Facturado:** **C$ ${Number(m.total_historico || 0).toLocaleString()}** (${Number(m.tickets_historico || 0).toLocaleString()} facturas emitidas)\n`;
    if (m.ultima_venta) {
      const fUlt = new Date(m.ultima_venta).toLocaleDateString('es-NI', { timeZone: 'America/Managua' });
      resp += `• **Última Venta Directa Registrada:** ${fUlt}\n`;
    }

    if (ultimas.length > 0) {
      resp += `\n🧾 **Últimos Tickets Emitidos por ${officialName}:**\n`;
      ultimas.forEach(u => {
        const fechaStr = new Date(u.fecha).toLocaleDateString('es-NI', { timeZone: 'America/Managua' });
        resp += `• **Ticket #${u.id_venta}** (${fechaStr}): **C$ ${Number(u.total_venta).toLocaleString()}**\n`;
      });
    }

    if (cajaActiva) {
      const estadoCaja = (cajaActiva.fecha_cierre && new Date(cajaActiva.fecha_cierre) >= new Date('2000-01-01')) ? 'Cerrada' : '🟢 ABIERTA';
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

  try {
    const [rows] = await pool.query('SELECT gemini_api_key FROM business_config WHERE id = 1 LIMIT 1');
    if (rows.length && rows[0].gemini_api_key) {
      const k = sanitize(rows[0].gemini_api_key);
      if (k) return k;
    }
  } catch (e) {}

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    const k = sanitize(process.env.GEMINI_API_KEY);
    if (k) return k;
  }
  return null;
}

/**
 * Generador de respuesta local determinístico, instantáneo y 100% cuadrado con la BD.
 */
function generateLocalFallbackResponse(question, context, specificProducts = []) {
  const q = question.toLowerCase();

  // Saludo / Identidad
  if (/^(hola|buenos dias|buenos días|buenas tardes|buenas noches|quien eres|quién eres|que eres|qué eres|que haces|qué haces|ayuda)\b/i.test(q.trim())) {
    return `👋 ¡Hola! Soy **ADA**, el Asistente Inteligente de Negocios desarrollado a medida para **Multirepuestos RG**.\n\n` +
      `Estoy conectada en tiempo real a la base de datos de tu empresa y puedo responderte al instante sobre:\n` +
      `• 💵 **Ventas de hoy y dinero en caja**\n` +
      `• 🗓️ **Ventas del mes y de toda la semana**\n` +
      `• 👥 **Rendimiento por vendedor / empleado** (ej: *"Ventas de Waskar"*)\n` +
      `• 💰 **Últimos cierres y arqueos de caja**\n` +
      `• 🏆 **Productos más vendidos y valor del inventario**\n` +
      `• 💳 **Clientes con deuda pendiente (Cuentas por Cobrar)**\n` +
      `• ⚠️ **Stock crítico y fotografías de repuestos**`;
  }

  const isBusinessMetricQuestion = q.includes('semana') || q.includes('emplead') || q.includes('vendedor') || 
    q.includes('caja') || q.includes('cierre') || q.includes('arqueo') || q.includes('quien vendio') || 
    q.includes('quien vendió') || q.includes('cuanto se vendio') || q.includes('cuanto se ha vendido') || 
    q.includes('cuanto hemos vendido') || q.includes('mejor dia') || q.includes('mejor día') ||
    q.includes('mes') || q.includes('mensual') || q.includes('hoy') || q.includes('facturad') ||
    q.includes('total de venta') || q.includes('dinero') || q.includes('deuda') || q.includes('debe') ||
    q.includes('mas vendido') || q.includes('más vendido') || q.includes('valor del inventario') ||
    q.includes('stock critico') || q.includes('stock crítico') || q.includes('stock bajo');

  // Si preguntó por productos específicos y encontramos coincidencias (y NO es consulta de métricas)
  if (specificProducts.length > 0 && !isBusinessMetricQuestion) {
    let resp = `🔍 **Repuestos encontrados en el catálogo de Multirepuestos RG:**\n\n`;
    specificProducts.forEach(p => {
      resp += `• **${p.nombre}** (Cód: \`${p.codigo || 'S/C'}\`)\n`;
      resp += `  - Existencia: **${p.existencia} unidades** (Reservado: ${p.stock_reservado || 0})\n`;
      resp += `  - Precio Venta: **C$ ${Number(p.venta || 0).toLocaleString()}** | Mayoreo: **C$ ${Number(p.mayoreo || p.venta || 0).toLocaleString()}**\n`;
      if (p.tiene_imagen) {
        resp += `  - 📸 *Escribe "foto de ${p.codigo || p.nombre.split(' ')[0]}" para ver su fotografía.*\n`;
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

    let resp = `👥 **Rendimiento de Ventas por Empleado / Vendedor — Multirepuestos RG:**\n\n`;
    resp += `🏆 **Ventas en los Últimos 7 Días:**\n`;
    if (vSem.length > 0) {
      vSem.forEach((v, i) => {
        resp += `${i + 1}. **${v.vendedor}**: **C$ ${Number(v.total_vendido).toLocaleString()}** (${v.tickets} facturas)\n`;
      });
    } else {
      resp += `• No hay registro de ventas en los últimos 7 días.\n`;
    }

    if (vMes.length > 0) {
      resp += `\n📅 **Acumulado en el Mes Actual:**\n`;
      vMes.forEach((v, i) => {
        resp += `${i + 1}. **${v.vendedor}**: **C$ ${Number(v.total_vendido).toLocaleString()}** (${v.tickets} facturas)\n`;
      });
    }

    if (emps.length > 0) {
      resp += `\n🧑‍💼 **Plantilla de Vendedores Activos:** ${emps.map(e => e.nombre).join(', ')}.\n`;
      resp += `💡 *Puedes consultar el reporte individual de cualquiera (ej: "Ventas de Waskar", "Ventas de Miguelito").*`;
    }
    return resp;
  }

  // 2. Ventas de Toda la Semana
  if (q.includes('semana') || q.includes('semanal') || q.includes('ultimos 7') || q.includes('últimos 7') || q.includes('mejor dia') || q.includes('mejor día')) {
    const vSem = context.ventasSemana || {};
    const det = context.ventasSemanaDetalle || [];
    const diasTrad = { 'Monday': 'Lunes', 'Tuesday': 'Martes', 'Wednesday': 'Miércoles', 'Thursday': 'Jueves', 'Friday': 'Viernes', 'Saturday': 'Sábado', 'Sunday': 'Domingo' };

    let resp = `📅 **Ventas de Toda la Semana (Últimos 7 Días) — Multirepuestos RG:**\n\n`;
    resp += `• **Total Facturado en la Semana:** **C$ ${Number(vSem.total_facturado_semana || 0).toLocaleString()}**\n`;
    resp += `• **Tickets Emitidos:** **${vSem.total_tickets_semana || 0} facturas**\n`;
    resp += `• **Promedio Diario:** **C$ ${Math.round(vSem.promedio_diario || 0).toLocaleString()}**\n`;
    resp += `• **En Efectivo:** C$ ${Number(vSem.total_efectivo_semana || 0).toLocaleString()}\n`;
    resp += `• **Al Crédito:** C$ ${Number(vSem.total_credito_semana || 0).toLocaleString()}\n\n`;
    
    if (det.length > 0) {
      const mejorDia = [...det].sort((a, b) => Number(b.total_dia || 0) - Number(a.total_dia || 0))[0];
      if (mejorDia) {
        const mNom = diasTrad[mejorDia.dia_nombre] || mejorDia.dia_nombre;
        const mFec = bestDateStr(mejorDia.dia);
        resp += `🌟 **Mejor Día de la Semana:** **${mNom}** (${mFec}) con **C$ ${Number(mejorDia.total_dia).toLocaleString()}** (${mejorDia.tickets} facturas)\n\n`;
      }

      resp += `📊 **Desglose Día por Día:**\n`;
      det.forEach(d => {
        const diaNom = diasTrad[d.dia_nombre] || d.dia_nombre;
        const fechaStr = bestDateStr(d.dia);
        resp += `• **${diaNom}** (${fechaStr}): **C$ ${Number(d.total_dia).toLocaleString()}** (${d.tickets} facturas)\n`;
      });
    }
    return resp;
  }

  // 2b. Ventas del Mes Actual
  if (q.includes('mes') || q.includes('mensual')) {
    const vMes = context.ventasMes || {};
    const vHoy = context.ventasHoy || {};
    const vendMes = context.ventasVendedorMes || [];
    const digMes = Number(vMes.ventas_tarjeta_mes || 0) + Number(vMes.ventas_transferencia_mes || 0);

    let resp = `🗓️ **Resumen de Ventas del Mes Actual — Multirepuestos RG:**\n\n`;
    resp += `• **Total Facturado en el Mes:** **C$ ${Number(vMes.total_facturado_mes || 0).toLocaleString()}**\n`;
    resp += `• **Facturas / Tickets Emitidos:** **${Number(vMes.total_tickets_mes || 0).toLocaleString()} facturas**\n`;
    resp += `• **Ventas en Efectivo:** C$ ${Number(vMes.ventas_efectivo_mes || 0).toLocaleString()}\n`;
    if (digMes > 0) resp += `• **Cobros Digitales (Tarjeta/Transf):** C$ ${digMes.toLocaleString()}\n`;
    resp += `• **Ventas al Crédito:** C$ ${Number(vMes.ventas_credito_mes || 0).toLocaleString()}\n`;
    resp += `• **Ventas Registradas Hoy:** C$ ${Number(vHoy.total_facturado || 0).toLocaleString()} (${vHoy.total_tickets || 0} tickets)\n\n`;

    if (vendMes.length > 0) {
      resp += `👥 **Top Vendedores en el Mes:**\n`;
      vendMes.slice(0, 5).forEach((v, i) => {
        resp += `${i + 1}. **${v.vendedor}**: **C$ ${Number(v.total_vendido).toLocaleString()}** (${v.tickets} facturas)\n`;
      });
    }

    return resp;
  }

  // 3. Venta por Caja / Arqueos y Cierres de Caja
  if (q.includes('cierre') || q.includes('arqueo') || q.includes('por caja') || q.includes('cerraron') || q.includes('cerro') || q.includes('cerró') || (q.includes('caja') && !q.includes('hoy'))) {
    const cHoy = context.cajaHoy || {};
    const cierres = context.ultimosCierresCaja || [];

    let resp = `💵 **Venta por Caja y Arqueos Recientes — Multirepuestos RG:**\n\n`;
    resp += `• **Efectivo esperado en cajón hoy:** **C$ ${Number(cHoy.efectivoEsperadoTotalCordobas || 0).toLocaleString()}**\n`;
    resp += `• **Cajas abiertas actualmente:** **${(cHoy.cajasAbiertas || []).length} abierta(s)**\n\n`;

    if (cierres.length > 0) {
      resp += `📋 **Últimos Cierres y Arqueos Registrados:**\n`;
      cierres.forEach(c => {
        const dif = Number(c.diferencia || 0);
        const estadoDif = Math.abs(dif) < 0.5 ? '✅ Cuadrada exacta' : (dif > 0 ? `⚠️ Sobrante: +C$ ${dif.toLocaleString()}` : `❌ Faltante: -C$ ${Math.abs(dif).toLocaleString()}`);
        resp += `• **Caja #${c.caja_id}** [${c.estado}] (${c.usuario_nombre || 'Usuario'} — ${c.apertura}):\n`;
        resp += `  - Fondo Inicial: C$ ${Number(c.monto_inicial || 0).toLocaleString()} | Ventas Turno: **C$ ${Number(c.total_ventas_caja || 0).toLocaleString()}**\n`;
        resp += `  - Esperado: **C$ ${Number(c.final_esperado || 0).toLocaleString()}** | Contado Real: **C$ ${Number(c.final_real || 0).toLocaleString()}**\n`;
        resp += `  - Resultado Arqueo: ${estadoDif}\n\n`;
      });
    }
    return resp;
  }

  // 4. Stock bajo / por agotarse
  if (q.includes('stock') || q.includes('agot') || q.includes('bajo') || q.includes('critico') || q.includes('crítico') || q.includes('pocos') || q.includes('falta')) {
    const criticos = context.stockCritico || [];
    if (!criticos.length) return "✅ ¡Buenas noticias! No hay productos con stock menor o igual a 5 unidades actualmente.";
    let resp = `⚠️ **Productos con Stock Crítico (Menos de 5 unidades):**\n\n`;
    criticos.slice(0, 10).forEach(p => {
      resp += `• **${p.nombre}** (Cód: \`${p.codigo || 'S/C'}\`) ➔ **Quedan ${p.existencia} unid.** | Venta: **C$ ${Number(p.venta).toLocaleString()}** (Mayoreo: C$ ${Number(p.mayoreo || p.venta).toLocaleString()})\n`;
    });
    return resp;
  }

  // 5. Clientes / Deudas / Créditos
  if (q.includes('deuda') || q.includes('debe') || q.includes('deudores') || q.includes('credito') || q.includes('crédito') || q.includes('cliente') || q.includes('cobrar')) {
    const deudores = context.topClientesDeudores || [];
    if (!deudores.length) return "✅ Todos los clientes están al día con sus cuentas por cobrar (C$ 0.00 pendiente).";
    const totalCartera = deudores.reduce((acc, c) => acc + Number(c.saldo_pendiente || 0), 0);
    let resp = `💳 **Clientes con Saldo Pendiente (Cuentas por Cobrar):**\n\n`;
    deudores.forEach((c, idx) => {
      resp += `${idx + 1}. **${c.nombre}**: **C$ ${Number(c.saldo_pendiente || 0).toLocaleString()}** ${c.telefono ? `(📞 ${c.telefono})` : ''}\n`;
    });
    resp += `\n📌 **Total en Top Cuentas por Cobrar:** **C$ ${totalCartera.toLocaleString()}**`;
    return resp;
  }

  // 6. Más vendidos
  if (q.includes('mas vendido') || q.includes('más vendido') || q.includes('top') || q.includes('popular') || q.includes('estrella') || q.includes('rotacion') || q.includes('rotación')) {
    const top = context.topProductosVendidos || [];
    if (!top.length) return "No hay registro de productos vendidos en los últimos 30 días.";
    let resp = `🏆 **Top Productos Más Vendidos del Último Mes — Multirepuestos RG:**\n\n`;
    top.forEach((p, idx) => {
      resp += `${idx + 1}. **${p.nombre}** (Cód: \`${p.codigo || 'S/C'}\`) ➔ **${p.total_unidades} unidades** vendidas (**C$ ${Number(p.total_generado || 0).toLocaleString()}**)\n`;
    });
    return resp;
  }

  // 7. Inventario general
  if (q.includes('inventario') || q.includes('capital') || q.includes('mercaderia') || q.includes('mercadería') || q.includes('valor')) {
    const inv = context.resumenInventario || {};
    const utilidadPotencial = Number(inv.valor_total_venta || 0) - Number(inv.valor_total_costo || 0);
    return `📦 **Resumen General de Inventario — Multirepuestos RG:**\n\n` +
      `• **Total de Repuestos Distintos (SKUs):** **${Number(inv.total_productos_distintos || 0).toLocaleString()} ítems**\n` +
      `• **Unidades Totales Físicas en Bodega:** **${Number(inv.total_unidades_fisicas || 0).toLocaleString()} unidades**\n` +
      `• **Valoración a Costo de Inversión:** **C$ ${Number(inv.valor_total_costo || 0).toLocaleString()}**\n` +
      `• **Valoración a Precio de Venta:** **C$ ${Number(inv.valor_total_venta || 0).toLocaleString()}**\n` +
      `• **Margen Bruto Potencial:** **C$ ${Math.max(0, utilidadPotencial).toLocaleString()}**`;
  }

  // 8. Ventas de hoy / Dinero en caja general
  if (q.includes('venta') || q.includes('vendido') || q.includes('hoy') || q.includes('caja') || q.includes('dinero') || q.includes('cuanto hay') || q.includes('cuánto hay')) {
    const vHoy = context.ventasHoy || {};
    const vMes = context.ventasMes || {};
    const cHoy = context.cajaHoy || {};
    const digHoy = Number(vHoy.ventas_tarjeta || 0) + Number(vHoy.ventas_transferencia || 0);

    return `📊 **Resumen de Ventas y Caja de Hoy — Multirepuestos RG:**\n` +
      `📅 *Actualizado:* ${context.fechaHoraActual}\n\n` +
      `💰 **Ventas Facturadas Hoy:**\n` +
      `• **Total Facturado Neto:** **C$ ${Number(vHoy.total_facturado || 0).toLocaleString()}** (${vHoy.total_tickets || 0} facturas)\n` +
      `• **Efectivo Cobrado:** C$ ${Number(vHoy.ventas_efectivo || 0).toLocaleString()}\n` +
      `• **Cobros Digitales (Tarjeta/Transf):** C$ ${digHoy.toLocaleString()}\n` +
      `• **Ventas al Crédito:** C$ ${Number(vHoy.ventas_credito || 0).toLocaleString()}\n\n` +
      `💵 **Estado de Cajas de Hoy:**\n` +
      `• **Efectivo Físico Esperado en Cajón:** **C$ ${Number(cHoy.efectivoEsperadoTotalCordobas || 0).toLocaleString()}**\n` +
      `• **Cajas en Operación:** **${(cHoy.cajasAbiertas || []).length} abierta(s)** · **${(cHoy.cajasCerradasHoy || []).length} cerrada(s)**\n` +
      (Number(cHoy.totalAbonosHoy) > 0 ? `• **Abonos Recibidos Hoy:** C$ ${Number(cHoy.totalAbonosHoy).toLocaleString()}\n` : '') +
      (Number(cHoy.totalSalidasHoy) > 0 ? `• **Salidas / Gastos de Caja Hoy:** -C$ ${Number(cHoy.totalSalidasHoy).toLocaleString()}\n` : '') +
      `\n🗓️ **Acumulado del Mes:** **C$ ${Number(vMes.total_facturado_mes || 0).toLocaleString()}** (${vMes.total_tickets_mes || 0} facturas)`;
  }

  // Respuesta general guiando al usuario
  return `🤖 **ADA — Asistente Inteligente de Multirepuestos RG**\n\n` +
    `Estoy lista para responder tus consultas en tiempo real. Puedes preguntarme por:\n` +
    `• 💵 *"¿Cuánto se ha vendido hoy y qué hay en caja?"*\n` +
    `• 🗓️ *"¿Cuáles son las ventas del mes?"*\n` +
    `• 📅 *"¿Cuánto hemos vendido en toda la semana?"*\n` +
    `• 👤 *"Ventas de Waskar"* o *"¿Cuánto vendió cada vendedor?"*\n` +
    `• 🏆 *"¿Cuáles son los productos más vendidos?"*\n` +
    `• 💳 *"¿Quiénes son los clientes con deuda pendiente?"*\n` +
    `• 📦 *"¿Cuál es el valor total del inventario?"* o *"Stock bajo"*\n` +
    `• 📷 *"Muéstrame la foto de [repuesto]"*`;
}

function bestDateStr(d) {
  if (!d) return '';
  if (typeof d === 'string') return d.substring(0, 10);
  try {
    return new Date(d).toISOString().substring(0, 10);
  } catch {
    return String(d).substring(0, 10);
  }
}

/**
 * Genera un resumen completo de todas las métricas en vivo para el modelo de lenguaje.
 */
function formatCompactBusinessContext(context, specificProducts = []) {
  const v = context.ventasHoy || {};
  const vSem = context.ventasSemana || {};
  const vMes = context.ventasMes || {};
  const c = context.cajaHoy || {};
  const inv = context.resumenInventario || {};

  let text = `DATOS EN TIEMPO REAL (BASE DE DATOS MULTIREPUESTOS RG):\n`;
  text += `- Fecha/Hora Local Managua: ${context.fechaHoraActual}\n`;
  text += `- Ventas Hoy: Total Facturado C$ ${Number(v.total_facturado || 0).toLocaleString()} en ${v.total_tickets || 0} tickets (Efectivo: C$ ${Number(v.ventas_efectivo || 0).toLocaleString()}, Digital: C$ ${(Number(v.ventas_tarjeta || 0) + Number(v.ventas_transferencia || 0)).toLocaleString()}, Crédito: C$ ${Number(v.ventas_credito || 0).toLocaleString()})\n`;
  text += `- Estado Cajas Hoy: ${(c.cajasAbiertas || []).length} abierta(s), ${(c.cajasCerradasHoy || []).length} cerrada(s). Efectivo esperado en cajón: C$ ${Number(c.efectivoEsperadoTotalCordobas || 0).toLocaleString()}. Abonos hoy: C$ ${Number(c.totalAbonosHoy || 0).toLocaleString()}. Salidas/Gastos hoy: C$ ${Number(c.totalSalidasHoy || 0).toLocaleString()}\n`;

  if (vSem.total_facturado_semana > 0) {
    text += `- Ventas Toda la Semana (Últimos 7 días): Total C$ ${Number(vSem.total_facturado_semana).toLocaleString()} en ${vSem.total_tickets_semana} tickets (Efectivo: C$ ${Number(vSem.total_efectivo_semana).toLocaleString()}, Crédito: C$ ${Number(vSem.total_credito_semana).toLocaleString()}, Promedio diario: C$ ${Math.round(vSem.promedio_diario).toLocaleString()})\n`;
  }
  if (context.ventasSemanaDetalle && context.ventasSemanaDetalle.length > 0) {
    const detSem = context.ventasSemanaDetalle.map(d => `${bestDateStr(d.dia)} (${d.dia_nombre}): C$ ${Number(d.total_dia).toLocaleString()} (${d.tickets} tks)`).join('; ');
    text += `- Desglose Diario Semana: ${detSem}\n`;
  }

  text += `- Ventas del Mes Actual: Total Facturado C$ ${Number(vMes.total_facturado_mes || 0).toLocaleString()} en ${vMes.total_tickets_mes || 0} tickets (Efectivo Mes: C$ ${Number(vMes.ventas_efectivo_mes || 0).toLocaleString()}, Crédito Mes: C$ ${Number(vMes.ventas_credito_mes || 0).toLocaleString()})\n`;

  if (context.ventasVendedorMes && context.ventasVendedorMes.length > 0) {
    const vend = context.ventasVendedorMes.map(v => `${v.vendedor}: C$ ${Number(v.total_vendido).toLocaleString()} (${v.tickets} tks)`).join('; ');
    text += `- Ventas por Vendedor (Mes Actual): ${vend}\n`;
  }

  if (context.empleadosActivos && context.empleadosActivos.length > 0) {
    const emps = context.empleadosActivos.map(e => `${e.nombre} (${e.cargo})`).join(', ');
    text += `- Personal Activo Registrado: ${emps}\n`;
  }

  if (context.ultimosCierresCaja && context.ultimosCierresCaja.length > 0) {
    const cierresTxt = context.ultimosCierresCaja.map(ci => `Caja #${ci.caja_id} [${ci.estado}] (${ci.usuario_nombre}, Apertura: ${ci.apertura}): Inicial C$ ${Number(ci.monto_inicial || 0).toLocaleString()}, Ventas C$ ${Number(ci.total_ventas_caja || 0).toLocaleString()}, Esperado C$ ${Number(ci.final_esperado || 0).toLocaleString()}, Real C$ ${Number(ci.final_real || 0).toLocaleString()}, Diferencia C$ ${Number(ci.diferencia || 0).toLocaleString()}`).join(' | ');
    text += `- Últimos Cierres/Arqueos de Caja: ${cierresTxt}\n`;
  }

  text += `- Inventario Global: ${Number(inv.total_productos_distintos || 0).toLocaleString()} productos distintos (${Number(inv.total_unidades_fisicas || 0).toLocaleString()} unidades físicas). Valor Costo: C$ ${Number(inv.valor_total_costo || 0).toLocaleString()}. Valor Venta: C$ ${Number(inv.valor_total_venta || 0).toLocaleString()}\n`;

  if (context.topProductosVendidos && context.topProductosVendidos.length > 0) {
    const topP = context.topProductosVendidos.map((p, i) => `${i + 1}. ${p.nombre} (Cód: ${p.codigo || 'S/C'}): ${p.total_unidades} uds, C$ ${Number(p.total_generado || 0).toLocaleString()}`).join('; ');
    text += `- Top Productos Más Vendidos (Últimos 30 días): ${topP}\n`;
  }

  if (context.topClientesDeudores && context.topClientesDeudores.length > 0) {
    const deud = context.topClientesDeudores.map(d => `${d.nombre}: Saldo C$ ${Number(d.saldo_pendiente || 0).toLocaleString()} (Tel: ${d.telefono || 'N/A'})`).join('; ');
    text += `- Clientes con Deuda Pendiente (Cuentas por Cobrar): ${deud}\n`;
  }

  if (context.stockCritico && context.stockCritico.length > 0) {
    const crit = context.stockCritico.slice(0, 8).map(p => `${p.nombre} (Cód: ${p.codigo || 'S/C'}): ${p.existencia} uds, Venta C$ ${Number(p.venta || 0).toLocaleString()}`).join('; ');
    text += `- Productos con Stock Crítico (<= 5 uds): ${crit}\n`;
  }

  if (specificProducts && specificProducts.length > 0) {
    const prods = specificProducts.slice(0, 8).map(p => `• ${p.nombre} (Cód: ${p.codigo || 'S/C'}) -> Stock: ${p.existencia} uds | Venta: C$ ${Number(p.venta || 0).toLocaleString()} | Mayoreo: C$ ${Number(p.mayoreo || p.venta || 0).toLocaleString()}`).join('\n');
    text += `REPUESTOS ENCONTRADOS EN BÚSQUEDA:\n${prods}\n`;
  }

  return text;
}

/**
 * Consulta al motor de IA externo con protección anti-truncamiento.
 */
async function queryGemini(apiKey, question, context, history = [], specificProducts = []) {
  const cleanKey = String(apiKey || '').trim().replace(/[\r\n"']/g, '');

  const CANDIDATE_MODELS = [
    'gemini-2.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-3.5-flash'
  ];

  const systemInstruction = `
Eres ADA, la Inteligencia Artificial oficial de Negocios y Operaciones de "Multirepuestos RG", empresa líder de repuestos automotrices y de motos en Nicaragua.
Tu función es asistir a la gerencia, propietarios y vendedores con respuestas ejecutivas, precisas, completas y profesionales basadas en los datos en vivo del negocio.

REGLAS DE IDENTIDAD Y SEGURIDAD:
1. TU IDENTIDAD ES ÚNICAMENTE "ADA". NUNCA menciones que eres Gemini, Google, OpenAI ni modelos externos. Si te preguntan quién eres o qué modelo eres, responde siempre: "Soy ADA, el Asistente Inteligente de Negocios desarrollado a medida para Multirepuestos RG".
2. RESTRICCIÓN ESTRICTA DE ÁMBITO (SOLO NEGOCIO): Únicamente tienes autorización para responder sobre operaciones de Multirepuestos RG (ventas de la semana, del mes, hoy, rendimiento de empleados/vendedores, arqueos y ventas por caja, precios de repuestos, existencia, inventario, clientes deudores, productos más vendidos y métricas del negocio).
3. SI EL USUARIO HACE PREGUNTAS FUERA DEL NEGOCIO: Rechaza amablemente indicando que solo estás autorizada para consultas empresariales de Multirepuestos RG.
4. FORMATO: Responde siempre de forma completa (nunca dejes frases inconclusas), usando español formal nicaragüense y Markdown limpio (**negritas** y viñetas •). Usa "C$" para Córdobas y "$" para Dólares.

${formatCompactBusinessContext(context, specificProducts)}
`;

  const contents = [];
  if (Array.isArray(history)) {
    history.slice(-2).forEach(h => {
      if (h.role && h.text) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: String(h.text).substring(0, 300) }]
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
      maxOutputTokens: 4096
    }
  };

  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(cleanKey)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

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
      const candidate = data?.candidates?.[0];
      const parts = candidate?.content?.parts || [];
      const textOutput = parts
        .filter(p => !p.thought && typeof p.text === 'string')
        .map(p => p.text)
        .join('')
        .trim();

      // Protección anti-truncamiento: si la respuesta quedó truncada o es demasiado corta, probar siguiente o usar motor local
      if (textOutput && textOutput.length >= 45 && candidate?.finishReason !== 'MAX_TOKENS') {
        return textOutput;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Respuesta incompleta o no disponible del motor externo.');
}

/**
 * Detecta si la pregunta corresponde a un reporte estructurado directo para responder en <100ms sin riesgo de fallo ni truncamiento.
 */
function isDirectStructuredReportQuery(q) {
  return (
    q.includes('vendido hoy') ||
    q.includes('ventas de hoy') ||
    q.includes('ventas hoy') ||
    q.includes('hay en caja') ||
    q.includes('hay en la caja') ||
    q.includes('estado de caja') ||
    q.includes('estado de la caja') ||
    q.includes('ventas del mes') ||
    q.includes('ventas mes') ||
    q.includes('toda la semana') ||
    q.includes('ultima semana') ||
    q.includes('última semana') ||
    q.includes('ventas de la semana') ||
    q.includes('cada empleado') ||
    q.includes('cada vendedor') ||
    q.includes('por empleado') ||
    q.includes('por vendedor') ||
    q.includes('ultimas cajas') ||
    q.includes('últimas cajas') ||
    q.includes('cerraron las') ||
    q.includes('stock critico') ||
    q.includes('stock crítico') ||
    q.includes('stock bajo') ||
    q.includes('bajo stock') ||
    q.includes('agotados') ||
    q.includes('deuda pendiente') ||
    q.includes('deben dinero') ||
    q.includes('clientes que deben') ||
    q.includes('clientes deudores') ||
    q.includes('cuentas por cobrar') ||
    q.includes('mas vendidos') ||
    q.includes('más vendidos') ||
    q.includes('valor total del inventario') ||
    q.includes('valor del inventario') ||
    q.includes('resumen de inventario')
  );
}

/**
 * Función principal: Responde cualquier pregunta del negocio con precisión total.
 */
async function askBusinessAI(input, maybeHistory = []) {
  const question = typeof input === 'string' ? input : input?.question;
  const history = typeof input === 'string' ? maybeHistory : (input?.history || []);
  const userId = typeof input === 'object' ? (input?.userId || null) : null;

  if (!question || !question.trim()) {
    return {
      answer: "Por favor escribe una consulta o pregunta sobre Multirepuestos RG.",
      reply: "Por favor escribe una consulta o pregunta sobre Multirepuestos RG.",
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
    normalizedQuestion.includes('reporte') || normalizedQuestion.includes('cuanto') || normalizedQuestion.includes('cuánto') ||
    normalizedQuestion.includes('factur') || normalizedQuestion.includes('ticket') || normalizedQuestion.includes('de')
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

  const context = await getLiveBusinessContext();

  // 3. SI ES UN REPORTE EJECUTIVO ESTRUCTURADO ESTÁNDAR, RESPONDER AL INSTANTE CON DATOS EXACTOS DE LA BD
  if (isDirectStructuredReportQuery(normalizedQuestion)) {
    const directAnswer = generateLocalFallbackResponse(rawQ, context, []);
    return {
      answer: directAnswer,
      image: null,
      product: null,
      provider: "ada-realtime-db",
      hasKey: true
    };
  }

  // 4. Verificar si la respuesta está en caché (45s)
  const cached = queryResponseCache.get(normalizedQuestion);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return {
      answer: cached.answer,
      image: cached.image || null,
      product: cached.product || null,
      provider: "ada-cached",
      hasKey: true
    };
  }

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
    'ver', 'reporte', 'reportes', 'resumen', 'detalle', 'foto', 'fotos', 'imagen', 'imagenes',
    'clientes', 'cliente', 'deuda', 'deudas', 'deben', 'inventario', 'valor', 'productos', 'producto'
  ]);

  const isBusinessMetric = normalizedQuestion.includes('semana') || normalizedQuestion.includes('emplead') || 
    normalizedQuestion.includes('vendedor') || normalizedQuestion.includes('caja') || normalizedQuestion.includes('cierre') || 
    normalizedQuestion.includes('arqueo') || normalizedQuestion.includes('quien vendio') || normalizedQuestion.includes('quien vendió') || 
    normalizedQuestion.includes('cuanto se vendio') || normalizedQuestion.includes('cuanto se ha vendido') || 
    normalizedQuestion.includes('cuanto hemos vendido') || normalizedQuestion.includes('mejor dia') || 
    normalizedQuestion.includes('mes') || normalizedQuestion.includes('mensual') || normalizedQuestion.includes('hoy') || 
    normalizedQuestion.includes('facturad') || normalizedQuestion.includes('total de venta') ||
    normalizedQuestion.includes('deuda') || normalizedQuestion.includes('debe') || normalizedQuestion.includes('inventario');

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
      console.error('[ADA] Usando motor local determinístico:', err.message);
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
