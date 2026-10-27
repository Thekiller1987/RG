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
        COALESCE(SUM(CASE WHEN tipo_pago LIKE '%efectivo%' OR metodo_pago LIKE '%efectivo%' THEN total_venta ELSE 0 END), 0) AS ventas_efectivo,
        COALESCE(SUM(CASE WHEN tipo_pago LIKE '%tarjeta%' OR metodo_pago LIKE '%tarjeta%' THEN total_venta ELSE 0 END), 0) AS ventas_tarjeta,
        COALESCE(SUM(CASE WHEN tipo_pago LIKE '%transfer%' OR metodo_pago LIKE '%transfer%' THEN total_venta ELSE 0 END), 0) AS ventas_transferencia,
        COALESCE(SUM(CASE WHEN tipo_pago LIKE '%credito%' OR metodo_pago LIKE '%credito%' THEN total_venta ELSE 0 END), 0) AS ventas_credito
      FROM ventas
      WHERE DATE(fecha) = CURDATE() AND estado != 'CANCELADA'
    `);
    context.ventasHoy = ventasHoyRows[0] || {};

    // 2b. Resumen de Ventas Facturadas del Mes Actual
    const [ventasMesRows] = await pool.query(`
      SELECT 
        COUNT(id_venta) AS total_tickets_mes,
        COALESCE(SUM(total_venta), 0) AS total_facturado_mes,
        COALESCE(SUM(CASE WHEN tipo_pago LIKE '%efectivo%' OR metodo_pago LIKE '%efectivo%' THEN total_venta ELSE 0 END), 0) AS ventas_efectivo_mes,
        COALESCE(SUM(CASE WHEN tipo_pago LIKE '%credito%' OR metodo_pago LIKE '%credito%' THEN total_venta ELSE 0 END), 0) AS ventas_credito_mes
      FROM ventas
      WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE()) AND estado != 'CANCELADA'
    `);
    context.ventasMes = ventasMesRows[0] || {};

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
 * Ej: "aceite maxima" busca productos que contengan "aceite" Y "maxima".
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
      SELECT id_producto, codigo, nombre, descripcion, existencia, stock_reservado, venta, mayoreo, costo
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
        SELECT id_producto, codigo, nombre, descripcion, existencia, stock_reservado, venta, mayoreo, costo
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
 * Obtiene la API Key de Gemini desde la base de datos o desde process.env.
 * Prioriza la base de datos para que la clave guardada en business_config mande siempre.
 */
async function getGeminiApiKey() {
  const sanitize = (key) => (key ? String(key).trim().replace(/[\r\n"']/g, '') : null);

  // 1. Priorizar base de datos (donde está la clave verificada del negocio)
  try {
    const [rows] = await pool.query('SELECT gemini_api_key FROM business_config WHERE id = 1 LIMIT 1');
    if (rows.length && rows[0].gemini_api_key) {
      const k = sanitize(rows[0].gemini_api_key);
      if (k) return k;
    }
  } catch (e) {
    // Si la columna aún no existe o hay error
  }

  // 2. Si no hay en BD, buscar en process.env
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    const k = sanitize(process.env.GEMINI_API_KEY);
    if (k) return k;
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

  // Ventas de hoy / Mes / Dinero / Caja
  if (q.includes('venta') || q.includes('vendido') || q.includes('hoy') || q.includes('mes') || q.includes('caja') || q.includes('dinero') || q.includes('cuanto hay')) {
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
    `• 📦 *"Repuestos con stock bajo"* o buscar un repuesto por nombre/código.\n` +
    `• 💳 *"¿Qué clientes tienen deudas pendientes?"*\n` +
    `• 🏆 *"¿Cuáles son los productos más vendidos?"*\n` +
    `• 📊 *"Resumen de inventario y capital"*\n\n` +
    `*(💡 Estoy conectada a la base de datos de tu empresa en tiempo real).*`;
}

/**
 * Genera un resumen compacto de métricas para ahorrar hasta 80% de tokens por consulta.
 */
function formatCompactBusinessContext(context, specificProducts = []) {
  const v = context.ventasHoy || {};
  const vMes = context.ventasMes || {};
  const c = context.cajaHoy || {};
  const inv = context.resumenInventario || {};

  let text = `DATOS EN TIEMPO REAL (BASE DE DATOS MULTIREPUESTOS RG):\n`;
  text += `- Fecha/Hora: ${context.fechaHoraActual}\n`;
  text += `- Ventas Hoy: Facturado C$ ${Number(v.total_facturado || 0).toLocaleString()} en ${v.total_tickets || 0} tickets (Efectivo: C$ ${Number(v.ventas_efectivo || 0).toLocaleString()}, Digital: C$ ${(Number(v.ventas_tarjeta || 0) + Number(v.ventas_transferencia || 0)).toLocaleString()}, Crédito: C$ ${Number(v.ventas_credito || 0).toLocaleString()})\n`;
  text += `- Ventas del Mes: Facturado C$ ${Number(vMes.total_facturado_mes || 0).toLocaleString()} en ${vMes.total_tickets_mes || 0} tickets (Efectivo Mes: C$ ${Number(vMes.ventas_efectivo_mes || 0).toLocaleString()}, Crédito Mes: C$ ${Number(vMes.ventas_credito_mes || 0).toLocaleString()})\n`;
  text += `- Cajas Activas: ${(c.cajasAbiertas || []).length} abiertas. Efectivo esperado en cajón: C$ ${Number(c.efectivoEsperadoTotalCordobas || 0).toLocaleString()}\n`;
  text += `- Inventario: ${Number(inv.total_productos_distintos || 0).toLocaleString()} repuestos (${Number(inv.total_unidades_fisicas || 0).toLocaleString()} unidades). Valor venta: C$ ${Number(inv.valor_total_venta || 0).toLocaleString()}\n`;

  if (context.stockCritico && context.stockCritico.length > 0) {
    const crit = context.stockCritico.slice(0, 5).map(p => `${p.nombre} (Cód: ${p.codigo || 'S/C'}): ${p.existencia} uds`).join('; ');
    text += `- Stock Crítico (<=5): ${crit}\n`;
  }

  if (context.topClientesDeudores && context.topClientesDeudores.length > 0) {
    const deud = context.topClientesDeudores.slice(0, 4).map(d => `${d.nombre}: C$ ${Number(d.saldo_pendiente || 0).toLocaleString()}`).join('; ');
    text += `- Clientes con Deuda: ${deud}\n`;
  }

  if (context.topProductosVendidos && context.topProductosVendidos.length > 0) {
    const top = context.topProductosVendidos.slice(0, 4).map(t => `${t.nombre} (${t.total_unidades} uds)`).join('; ');
    text += `- Top Más Vendidos: ${top}\n`;
  }

  if (specificProducts && specificProducts.length > 0) {
    const prods = specificProducts.slice(0, 5).map(p => `• ${p.nombre} (Cód: ${p.codigo || 'S/C'}) -> Stock: ${p.existencia} uds | Venta: C$ ${Number(p.venta || 0).toLocaleString()} | Mayoreo: C$ ${Number(p.mayoreo || p.venta || 0).toLocaleString()}`).join('\n');
    text += `REPUESTOS RELEVANTES:\n${prods}\n`;
  }

  return text;
}

/**
 * Consulta al motor de IA con identidad estricta ADA y ahorro máximo de tokens.
 */
async function queryGemini(apiKey, question, context, history = [], specificProducts = []) {
  const cleanKey = String(apiKey || '').trim().replace(/[\r\n"']/g, '');

  const CANDIDATE_MODELS = [
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-flash-latest'
  ];

  const systemInstruction = `
Eres ADA, la Inteligencia Artificial oficial de Negocios y Operaciones de "Multirepuestos RG", empresa líder de repuestos automotrices y de motos en Nicaragua.
Tu función es asistir a la gerencia, propietarios y vendedores con respuestas ejecutivas, precisas, profesionales y concisas basadas en los datos en vivo del negocio.

REGLAS DE IDENTIDAD Y SEGURIDAD:
1. TU IDENTIDAD ES ÚNICAMENTE "ADA". NUNCA menciones que eres Gemini, Google, OpenAI ni modelos externos. Si te preguntan quién eres o qué modelo eres, responde siempre: "Soy ADA, el Asistente Inteligente de Negocios desarrollado a medida para Multirepuestos RG".
2. RESTRICCIÓN ESTRICTA DE ÁMBITO (SOLO NEGOCIO): Únicamente tienes autorización para responder sobre operaciones de Multirepuestos RG (ventas, cajas, dinero en cajón, precios de repuestos, existencia, inventario, clientes deudores y métricas del negocio).
3. SI EL USUARIO HACE PREGUNTAS FUERA DEL NEGOCIO (ej. poemas, chistes, recetas, tareas escolares, política, historia, programación o temas ajenos): DEBES RECHAZAR LA PREGUNTA AMABLEMENTE: "Estimado usuario, como asistente oficial de Multirepuestos RG, solo estoy capacitada para atender consultas operativas, financieras y de inventario de nuestra empresa. ¿En qué aspecto del negocio puedo colaborarle?".
4. FORMATO: Responde en español formal nicaragüense, claro, conciso, usando Markdown elegante (viñetas y negritas). Usa "C$" para Córdobas y "$" para Dólares. Nunca inventes productos que no existan en el catálogo.

${formatCompactBusinessContext(context, specificProducts)}
`;

  // Construir historial compacto (máximo 2 mensajes para no inflar tokens)
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
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 650 // Amplio espacio para listas de productos y balances sin truncamiento
    }
  };

  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(cleanKey)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

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
        // Si el error es de autenticación (401/403), no tiene sentido probar más modelos con la misma clave
        if (response.status === 401 || response.status === 403) {
          break;
        }
        continue;
      }

      const data = await response.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (textOutput) {
        return textOutput;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('No se pudo obtener respuesta del motor de IA.');
}

/**
 * Función principal: Responde cualquier pregunta del negocio con IA o fallback local.
 * Incluye caché en memoria de 60s para respuestas idénticas (0 tokens gastados en repeticiones).
 */
async function askBusinessAI({ question, history = [], userId = null }) {
  if (!question || !question.trim()) {
    return {
      answer: "Por favor escribe una consulta o pregunta sobre Multirepuestos RG.",
      provider: "none"
    };
  }

  const normalizedQuestion = question.trim().toLowerCase();

  // Verificar si la respuesta está en caché (vital para la defensa: 0ms y 0 tokens gastados)
  const cached = queryResponseCache.get(normalizedQuestion);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return {
      answer: cached.answer,
      provider: "ada-cached",
      hasKey: true
    };
  }

  const context = await getLiveBusinessContext();

  // Buscar repuestos específicos si se menciona algún término de producto
  const STOP_WORDS = new Set([
    'cuanto', 'cuantos', 'cuanta', 'cuantas', 'donde', 'precio', 'precios', 'costo', 'cuesta', 
    'repuesto', 'repuestos', 'tienen', 'tenemos', 'hay', 'vende', 'venden', 'stock', 'quedan', 
    'queda', 'existencia', 'existencias', 'por', 'para', 'con', 'del', 'las', 'los', 'una', 
    'uno', 'unos', 'unas', 'que', 'como', 'cual', 'cuales', 'sobre', 'este', 'esta', 'estos',
    'estas', 'favor', 'porfa', 'hola', 'buenas', 'dime', 'consultar', 'busca', 'buscar'
  ]);

  const cleanWords = question
    .toLowerCase()
    .replace(/[¿?¡!.,:;()_]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !STOP_WORDS.has(w));

  let specificProducts = [];
  if (cleanWords.length > 0) {
    specificProducts = await searchProductsForQuery(cleanWords.join(' '));
  }

  const apiKey = await getGeminiApiKey();

  if (apiKey) {
    try {
      const adaAnswer = await queryGemini(apiKey, question, context, history, specificProducts);

      // Guardar en caché para consultas idénticas (ahorra tokens)
      queryResponseCache.set(normalizedQuestion, {
        answer: adaAnswer,
        timestamp: Date.now()
      });

      return {
        answer: adaAnswer,
        provider: "ada",
        hasKey: true
      };
    } catch (err) {
      console.error('[ADA] Fallo al invocar IA externa, usando motor local:', err.message);
      const fallback = generateLocalFallbackResponse(question, context, specificProducts);
      return {
        answer: fallback,
        provider: "local-fallback",
        hasKey: true
      };
    }
  }

  // Sin API Key configurada todavía: usamos motor local
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
