// server/src/services/aiBusinessService.js
const pool = require('../config/db');

/**
 * Recopila en tiempo real las métricas y estado del negocio directamente desde la BD.
 */
async function getLiveBusinessContext() {
  const context = {
    fechaHoraActual: new Date().toLocaleString('es-NI', { timeZone: 'America/Managua' }),
    cajaHoy: null,
    ventasHoy: null,
    stockCritico: [],
    topClientesDeudores: [],
    topProductosVendidos: [],
    resumenInventario: null
  };

  try {
    // 1. Estado de Cajas de Hoy
    const [cajas] = await pool.query(`
      SELECT id, id_usuario, fecha_apertura, fecha_cierre, monto_inicial, monto_final, estado, detalles_json 
      FROM cierres_caja 
      WHERE DATE(fecha_apertura) = CURDATE() OR estado = 'abierta'
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

        if (c.estado === 'abierta') {
          abiertas.push({
            cajaId: c.id,
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
        COALESCE(SUM(CASE WHEN tipo_pago LIKE '%efectivo%' OR metodo_pago LIKE '%efectivo%' THEN total_venta ELSE 0 END), 0) AS ventas_efectivo,
        COALESCE(SUM(CASE WHEN tipo_pago LIKE '%tarjeta%' OR metodo_pago LIKE '%tarjeta%' THEN total_venta ELSE 0 END), 0) AS ventas_tarjeta,
        COALESCE(SUM(CASE WHEN tipo_pago LIKE '%transfer%' OR metodo_pago LIKE '%transfer%' THEN total_venta ELSE 0 END), 0) AS ventas_transferencia,
        COALESCE(SUM(CASE WHEN tipo_pago LIKE '%credito%' OR metodo_pago LIKE '%credito%' THEN total_venta ELSE 0 END), 0) AS ventas_credito
      FROM ventas
      WHERE DATE(fecha) = CURDATE() AND estado != 'CANCELADA'
    `);
    context.ventasHoy = ventasHoyRows[0] || {};

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
 * Busca repuestos específicos por coincidencia de texto (para responder dudas de productos puntuales).
 */
async function searchProductsForQuery(queryText) {
  if (!queryText || queryText.length < 2) return [];
  try {
    const clean = `%${queryText.trim()}%`;
    const [rows] = await pool.query(`
      SELECT id_producto, codigo, nombre, descripcion, existencia, stock_reservado, venta, mayoreo, costo
      FROM productos
      WHERE nombre LIKE ? OR codigo LIKE ? OR descripcion LIKE ?
      LIMIT 8
    `, [clean, clean, clean]);
    return rows;
  } catch (e) {
    console.error('[AIBusinessService] Error buscando repuestos:', e.message);
    return [];
  }
}

/**
 * Obtiene la API Key de Gemini desde process.env o desde la tabla business_config.
 */
async function getGeminiApiKey() {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    return process.env.GEMINI_API_KEY.trim();
  }
  try {
    const [rows] = await pool.query('SELECT gemini_api_key FROM business_config WHERE id = 1 LIMIT 1');
    if (rows.length && rows[0].gemini_api_key && rows[0].gemini_api_key.trim()) {
      return rows[0].gemini_api_key.trim();
    }
  } catch (e) {
    // Si la columna aún no existe o hay error
  }
  return null;
}

/**
 * Generador de respuesta local inteligente cuando aún no se ha ingresado la API Key de Gemini.
 * Esto asegura que el sistema responda de inmediato con datos reales sin romperse.
 */
function generateLocalFallbackResponse(question, context, specificProducts = []) {
  const q = question.toLowerCase();

  // Si preguntó por productos específicos y encontramos coincidencias
  if (specificProducts.length > 0) {
    let resp = `🔍 **Repuestos encontrados en inventario:**\n\n`;
    specificProducts.forEach(p => {
      resp += `• **${p.nombre}** (Cód: \`${p.codigo || 'S/C'}\`)\n`;
      resp += `  - Existencia: **${p.existencia} unidades** (Reservado: ${p.stock_reservado || 0})\n`;
      resp += `  - Precio Público: **C$ ${Number(p.venta || 0).toLocaleString()}** | Mayoreo: **C$ ${Number(p.mayoreo || p.venta || 0).toLocaleString()}**\n\n`;
    });
    return resp;
  }

  // Ventas de hoy / Dinero / Caja
  if (q.includes('venta') || q.includes('hoy') || q.includes('caja') || q.includes('dinero') || q.includes('cuanto hay')) {
    const vHoy = context.ventasHoy || {};
    const cHoy = context.cajaHoy || {};
    return `📊 **Resumen de Ventas y Caja de Hoy (${context.fechaHoraActual}):**\n\n` +
      `• **Total Facturado Hoy:** C$ ${Number(vHoy.total_facturado || 0).toLocaleString()} (${vHoy.total_tickets || 0} facturas)\n` +
      `• **Ventas en Efectivo:** C$ ${Number(vHoy.ventas_efectivo || 0).toLocaleString()}\n` +
      `• **Ventas Digitales (Tarjeta/Transf):** C$ ${(Number(vHoy.ventas_tarjeta || 0) + Number(vHoy.ventas_transferencia || 0)).toLocaleString()}\n` +
      `• **Ventas al Crédito:** C$ ${Number(vHoy.ventas_credito || 0).toLocaleString()}\n\n` +
      `💵 **Estado de Caja Activa:**\n` +
      `• Efectivo esperado a tener en cajón: **C$ ${Number(cHoy.efectivoEsperadoTotalCordobas || 0).toLocaleString()}**\n` +
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
  return `🤖 **Asistente Multirepuestos RG (Modo Local)**\n\n` +
    `Estoy listo para ayudarte con las consultas de tu negocio. Puedes preguntarme directamente por:\n` +
    `• 💵 *"¿Cuánto se ha vendido hoy y qué hay en caja?"*\n` +
    `• 📦 *"Repuestos con stock bajo"* o buscar un repuesto por nombre/código.\n` +
    `• 💳 *"¿Qué clientes tienen deudas pendientes?"*\n` +
    `• 🏆 *"¿Cuáles son los productos más vendidos?"*\n` +
    `• 📊 *"Resumen de inventario y capital"*\n\n` +
    `*(💡 Nota: El motor completo de IA libre se activará automáticamente en cuanto pegues tu clave \`GEMINI_API_KEY\` en el archivo .env o en Configuración)*.`;
}

/**
 * Consulta al modelo Google Gemini con contexto en vivo inyectado.
 */
async function queryGemini(apiKey, question, context, history = [], specificProducts = []) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const systemInstruction = `
Eres el Asistente Inteligente oficial de "Multirepuestos RG", una prestigiosa empresa de repuestos de vehículos y motos ubicada en Nicaragua.
Tu misión es asistir al dueño, gerentes y vendedores brindando respuestas precisas, profesionales, ejecutivas y amables basadas en los datos reales del negocio.

INFORMACIÓN EN TIEMPO REAL DEL NEGOCIO (DATOS VERÍDICOS DE LA BASE DE DATOS):
- Fecha y Hora Local: ${context.fechaHoraActual}
- Moneda Oficial: Córdobas (C$) y Dólares ($) con tasa de cambio de referencia 36.60.

VENTAS Y CAJA DE HOY:
${JSON.stringify(context.ventasHoy, null, 2)}
ESTADO DE CAJAS ACTIVAS:
${JSON.stringify(context.cajaHoy, null, 2)}

INVENTARIO RESUMEN:
${JSON.stringify(context.resumenInventario, null, 2)}

PRODUCTOS CON STOCK CRÍTICO (5 O MENOS UNIDADES):
${JSON.stringify(context.stockCritico, null, 2)}

TOP CLIENTES CON CRÉDITO Y SALDO PENDIENTE:
${JSON.stringify(context.topClientesDeudores, null, 2)}

TOP PRODUCTOS MÁS VENDIDOS RECIENTES:
${JSON.stringify(context.topProductosVendidos, null, 2)}

${specificProducts.length > 0 ? `REPUESTOS RELEVANTES ENCONTRADOS PARA ESTA PREGUNTA ESPECÍFICA:\n${JSON.stringify(specificProducts, null, 2)}` : ''}

REGLAS DE RESPUESTA:
1. Responde siempre en español nicaragüense/latino profesional, claro y conciso.
2. Utiliza formato Markdown elegante (negritas, viñetas, emojis sobrios).
3. Usa siempre "C$" para Córdobas y "$" para Dólares.
4. Si te preguntan si hay un repuesto o su precio, usa los datos del inventario. Si no existe en el catálogo, indícalo amablemente sin inventar.
5. No divulgues contraseñas de usuarios ni hashes bajo ninguna circunstancia.
`;

  // Construir historial en formato Gemini
  const contents = [];

  // Agregar historial previo si existe
  if (Array.isArray(history)) {
    history.slice(-6).forEach(h => {
      if (h.role && h.text) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    });
  }

  // Agregar pregunta actual
  contents.push({
    role: 'user',
    parts: [{ text: question }]
  });

  const requestBody = {
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1000
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error [${response.status}]: ${errorText}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textOutput) {
    throw new Error('Respuesta vacía recibida de Gemini.');
  }

  return textOutput;
}

/**
 * Función principal: Responde cualquier pregunta del negocio.
 * Se apoya en Gemini si la API Key está presente, o en el motor local enriquecido como fallback.
 */
async function askBusinessAI({ question, history = [], userId = null }) {
  if (!question || !question.trim()) {
    return {
      answer: "Por favor escribe una consulta o pregunta sobre el negocio.",
      provider: "none"
    };
  }

  const context = await getLiveBusinessContext();

  // Intentar buscar repuestos específicos en base al texto de la consulta
  const words = question.split(/\s+/).filter(w => w.length >= 3 && !['cuanto', 'donde', 'precio', 'repuesto', 'repuestos', 'tienen', 'vende', 'venden', 'stock', 'quedan', 'cuantos'].includes(w.toLowerCase()));
  let specificProducts = [];
  if (words.length > 0) {
    specificProducts = await searchProductsForQuery(words.join(' '));
    if (!specificProducts.length && words.length > 1) {
      specificProducts = await searchProductsForQuery(words[0]);
    }
  }

  const apiKey = await getGeminiApiKey();

  if (apiKey) {
    try {
      const geminiAnswer = await queryGemini(apiKey, question, context, history, specificProducts);
      return {
        answer: geminiAnswer,
        provider: "gemini",
        hasKey: true
      };
    } catch (err) {
      console.error('[AIBusinessService] Fallo al invocar Gemini, usando fallback local:', err.message);
      const fallback = generateLocalFallbackResponse(question, context, specificProducts);
      return {
        answer: fallback + `\n\n*(⚠️ Aviso: Hubo un detalle al contactar con la API de Gemini: ${err.message}. Mostrando respuesta local).*`,
        provider: "local-fallback",
        hasKey: true
      };
    }
  }

  // Sin API Key configurada todavía: usamos motor local enriquecido
  const localAnswer = generateLocalFallbackResponse(question, context, specificProducts);
  return {
    answer: localAnswer,
    provider: "local-waiting-key",
    hasKey: false
  };
}

module.exports = {
  askBusinessAI,
  getLiveBusinessContext,
  getGeminiApiKey,
  searchProductsForQuery
};
