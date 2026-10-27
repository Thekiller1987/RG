// server/src/services/telegramBotService.js
const pool = require('../config/db');
const { askBusinessAI, getLiveBusinessContext, searchProductsForQuery, getProductPhoto } = require('./aiBusinessService');

let isPolling = false;
let pollingAbortController = null;
let lastUpdateId = 0;
const authenticatedChats = new Set();
const telegramHistories = new Map(); // Historial en memoria por chatId // Chats que han ingresado el PIN

/**
 * Obtiene el token del bot de Telegram desde .env o business_config.
 */
async function getTelegramToken() {
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN.trim()) {
    return process.env.TELEGRAM_BOT_TOKEN.trim();
  }
  try {
    const [rows] = await pool.query('SELECT telegram_bot_token FROM business_config WHERE id = 1 LIMIT 1');
    if (rows.length && rows[0].telegram_bot_token && rows[0].telegram_bot_token.trim()) {
      return rows[0].telegram_bot_token.trim();
    }
  } catch (e) {
    // Si la columna aún no existe
  }
  return null;
}

/**
 * Envía un mensaje a un chat de Telegram.
 */
async function sendTelegramMessage(token, chatId, text, options = {}) {
  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text: text,
      parse_mode: options.parseMode || 'Markdown',
      disable_web_page_preview: true
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      // Si falla por Markdown (por ejemplo caracteres especiales no escapados), reintentar en texto plano
      if (payload.parse_mode === 'Markdown') {
        delete payload.parse_mode;
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    }
  } catch (e) {
    console.error(`[TelegramBot] Error enviando mensaje al chat ${chatId}:`, e.message);
  }
}

/**
 * Envía una fotografía en Base64 a un chat de Telegram usando FormData nativo de Node.js.
 */
async function sendTelegramPhoto(token, chatId, base64Image, caption = '') {
  try {
    const raw = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(raw, 'base64');
    const formData = new FormData();
    formData.append('chat_id', String(chatId));
    formData.append('photo', new Blob([buffer], { type: 'image/jpeg' }), 'repuesto.jpg');
    if (caption) {
      formData.append('caption', caption.substring(0, 1024));
    }

    const url = `https://api.telegram.org/bot${token}/sendPhoto`;
    const res = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      if (caption) {
        await sendTelegramMessage(token, chatId, caption);
      }
    }
  } catch (e) {
    console.error(`[TelegramBot] Error enviando foto al chat ${chatId}:`, e.message);
    if (caption) {
      await sendTelegramMessage(token, chatId, caption);
    }
  }
}

/**
 * Procesa un mensaje entrante de Telegram.
 */
async function handleTelegramMessage(token, message) {
  if (!message || !message.text) return;

  const chatId = message.chat.id;
  const text = message.text.trim();
  const userName = message.from.first_name || message.from.username || 'Usuario';

  // Comando /start o /ayuda
  if (text.startsWith('/start') || text.startsWith('/help') || text.startsWith('/ayuda')) {
    const welcome = `🚗 *¡Hola, ${userName}!* Soy *ADA*, el Asistente Inteligente oficial de *Multirepuestos RG* 🤖\n\n` +
      `Estoy conectada directamente a la base de datos de tu empresa en tiempo real.\n\n` +
      `📌 *Comandos directos de Negocio:*\n` +
      `• /ventas — Ventas facturadas y cobros de hoy\n` +
      `• /semana — Ventas de toda la semana y desglose por día\n` +
      `• /vendedores — Rendimiento y ventas por vendedor/empleado\n` +
      `• /caja — Dinero en cajón y cajas abiertas hoy\n` +
      `• /cierres — Historial de ventas por caja y arqueos recientes\n` +
      `• /stock <nombre> — Consultar existencia y precios de un repuesto\n` +
      `• /bajostock — Repuestos con menos de 5 unidades\n` +
      `• /deudas — Clientes con saldo pendiente\n` +
      `• /login <pin> — Autenticar este chat como Administrador\n\n` +
      `💬 *O simplemente escribe cualquier pregunta en lenguaje natural:*\n` +
      `_Ej: "¿Cuánto vendimos en toda la semana?", "¿Quién es el vendedor que más factura?", "¿Cómo cerró la última caja?"_`;

    await sendTelegramMessage(token, chatId, welcome);
    return;
  }

  // Comando de autenticación PIN /login 111987
  if (text.startsWith('/login')) {
    const parts = text.split(/\s+/);
    const pin = parts[1] || '';
    if (pin.trim() === '111987') {
      authenticatedChats.add(chatId);
      await sendTelegramMessage(token, chatId, "✅ *¡Autenticación exitosa!* Tu chat ha sido verificado como Administrador. Tienes acceso completo a todas las consultas de la empresa.");
    } else {
      await sendTelegramMessage(token, chatId, "❌ *PIN incorrecto.* Por favor usa: `/login <pin_secreto>`.");
    }
    return;
  }

  // Comandos directos rápidos
  if (text === '/ventas' || text === '/hoy') {
    const ctx = await getLiveBusinessContext();
    const vHoy = ctx.ventasHoy || {};
    const cHoy = ctx.cajaHoy || {};
    const msg = `📊 *Ventas de Hoy — Multirepuestos RG*\n` +
      `📅 _${ctx.fechaHoraActual}_\n\n` +
      `• *Total Facturado:* C$ ${Number(vHoy.total_facturado || 0).toLocaleString()}\n` +
      `• *Tickets Emitidos:* ${vHoy.total_tickets || 0}\n` +
      `• *En Efectivo:* C$ ${Number(vHoy.ventas_efectivo || 0).toLocaleString()}\n` +
      `• *Digital (Tarjeta/Transf):* C$ ${(Number(vHoy.ventas_tarjeta || 0) + Number(vHoy.ventas_transferencia || 0)).toLocaleString()}\n` +
      `• *Crédito:* C$ ${Number(vHoy.ventas_credito || 0).toLocaleString()}\n\n` +
      `💵 *Efectivo en Cajón:* C$ ${Number(cHoy.efectivoEsperadoTotalCordobas || 0).toLocaleString()}`;
    await sendTelegramMessage(token, chatId, msg);
    return;
  }

  if (text.startsWith('/foto ')) {
    const queryTerm = text.replace('/foto ', '').trim();
    const photoRes = await getProductPhoto(queryTerm);
    if (photoRes.image) {
      await sendTelegramPhoto(token, chatId, photoRes.image, photoRes.answer);
    } else {
      await sendTelegramMessage(token, chatId, photoRes.answer);
    }
    return;
  }

  if (text === '/semana' || text === '/semanal') {
    const ctx = await getLiveBusinessContext();
    const vSem = ctx.ventasSemana || {};
    const det = ctx.ventasSemanaDetalle || [];
    const diasTrad = { 'Monday': 'Lunes', 'Tuesday': 'Martes', 'Wednesday': 'Miércoles', 'Thursday': 'Jueves', 'Friday': 'Viernes', 'Saturday': 'Sábado', 'Sunday': 'Domingo' };

    let msg = `📅 *Ventas de Toda la Semana (Últimos 7 Días) — Multirepuestos RG*\n\n` +
      `• *Total Facturado:* C$ ${Number(vSem.total_facturado_semana || 0).toLocaleString()}\n` +
      `• *Tickets Emitidos:* ${vSem.total_tickets_semana || 0} facturas\n` +
      `• *Promedio Diario:* C$ ${Math.round(vSem.promedio_diario || 0).toLocaleString()}\n` +
      `• *En Efectivo:* C$ ${Number(vSem.total_efectivo_semana || 0).toLocaleString()}\n` +
      `• *Al Crédito:* C$ ${Number(vSem.total_credito_semana || 0).toLocaleString()}\n\n` +
      `📊 *Desglose Día por Día:*\n`;

    det.forEach(d => {
      const diaNom = diasTrad[d.dia_nombre] || d.dia_nombre;
      const fStr = String(d.dia).substring(0, 10);
      msg += `• *${diaNom}* (${fStr}): C$ ${Number(d.total_dia).toLocaleString()} (${d.tickets} tks)\n`;
    });

    await sendTelegramMessage(token, chatId, msg);
    return;
  }

  if (text === '/vendedores' || text === '/empleados') {
    const ctx = await getLiveBusinessContext();
    const vSem = ctx.ventasVendedorSemana || [];
    const vMes = ctx.ventasVendedorMes || [];
    const emps = ctx.empleadosActivos || [];

    let msg = `👥 *Rendimiento de Ventas por Empleado / Vendedor*\n\n` +
      `🏆 *Ventas Últimos 7 Días:*\n`;
    vSem.forEach((v, i) => {
      msg += `${i + 1}. *${v.vendedor}*: C$ ${Number(v.total_vendido).toLocaleString()} (${v.tickets} facturas)\n`;
    });

    msg += `\n📅 *Acumulado en el Mes:*\n`;
    vMes.forEach((v, i) => {
      msg += `${i + 1}. *${v.vendedor}*: C$ ${Number(v.total_vendido).toLocaleString()} (${v.tickets} facturas)\n`;
    });

    if (emps.length > 0) {
      msg += `\n🧑‍💼 *Vendedores Registrados:* ${emps.map(e => e.nombre).join(', ')}`;
    }

    await sendTelegramMessage(token, chatId, msg);
    return;
  }

  if (text === '/cierres' || text === '/cajas') {
    const ctx = await getLiveBusinessContext();
    const cHoy = ctx.cajaHoy || {};
    const cierres = ctx.ultimosCierresCaja || [];

    let msg = `💰 *Venta por Caja y Arqueos Recientes — Multirepuestos RG*\n\n` +
      `• *Cajas Abiertas Hoy:* ${(cHoy.cajasAbiertas || []).length}\n` +
      `• *Efectivo Esperado en Cajón Hoy:* C$ ${Number(cHoy.efectivoEsperadoTotalCordobas || 0).toLocaleString()}\n\n` +
      `📋 *Últimos Turnos y Arqueos:*\n`;

    cierres.forEach(c => {
      const dif = Number(c.diferencia || 0);
      const difStr = dif === 0 ? '✅ Cuadrada exacta' : (dif > 0 ? `⚠️ Sobrante +C$ ${dif.toLocaleString()}` : `❌ Faltante -C$ ${Math.abs(dif).toLocaleString()}`);
      msg += `\n📦 *Caja #${c.caja_id}* [${c.estado}] (${c.usuario_nombre} — ${c.apertura}):\n` +
        `  • Ventas Turno: C$ ${Number(c.total_ventas_caja || 0).toLocaleString()} (Efec: C$ ${Number(c.total_ventas_efectivo || 0).toLocaleString()})\n` +
        `  • Esperado: C$ ${Number(c.final_esperado || 0).toLocaleString()} | Real: C$ ${Number(c.final_real || 0).toLocaleString()}\n` +
        `  • Arqueo: ${difStr}\n`;
    });

    await sendTelegramMessage(token, chatId, msg);
    return;
  }

  if (text === '/caja') {
    const ctx = await getLiveBusinessContext();
    const cHoy = ctx.cajaHoy || {};
    const abiertas = cHoy.cajasAbiertas || [];
    let msg = `💵 *Estado de Cajas — Multirepuestos RG*\n` +
      `📅 _${ctx.fechaHoraActual}_\n\n` +
      `• *Efectivo Esperado Total:* C$ ${Number(cHoy.efectivoEsperadoTotalCordobas || 0).toLocaleString()}\n` +
      `• *Ventas Turno Cajas:* C$ ${Number(cHoy.ventasTurnoCajas || 0).toLocaleString()}\n` +
      `• *Cajas Abiertas:* ${abiertas.length}\n`;

    abiertas.forEach((b, i) => {
      msg += `\n📦 *Caja #${b.cajaId}*: Fondo: C$ ${Number(b.montoInicial).toLocaleString()} | En Cajón: C$ ${Number(b.efectivoEsperado).toLocaleString()}`;
    });

    await sendTelegramMessage(token, chatId, msg);
    return;
  }

  if (text === '/bajostock' || text === '/critico') {
    const ctx = await getLiveBusinessContext();
    const criticos = ctx.stockCritico || [];
    if (!criticos.length) {
      await sendTelegramMessage(token, chatId, "✅ No hay repuestos con stock crítico (menor a 5 unidades).");
      return;
    }
    let msg = `⚠️ *Repuestos con Stock Crítico (Menos de 5 unidades):*\n\n`;
    criticos.slice(0, 10).forEach(p => {
      msg += `• *${p.nombre}* (Cód: \`${p.codigo || 'S/C'}\`)\n  ➔ *Quedan: ${p.existencia} unid.* | Venta: C$ ${Number(p.venta).toLocaleString()}\n`;
    });
    await sendTelegramMessage(token, chatId, msg);
    return;
  }

  if (text === '/deudas' || text === '/creditos') {
    const ctx = await getLiveBusinessContext();
    const deudores = ctx.topClientesDeudores || [];
    if (!deudores.length) {
      await sendTelegramMessage(token, chatId, "✅ No hay clientes con saldo pendiente de pago.");
      return;
    }
    let msg = `💳 *Cuentas por Cobrar (Top Clientes con Saldo Pendiente):*\n\n`;
    deudores.forEach((c, idx) => {
      msg += `${idx + 1}. *${c.nombre}*: C$ ${Number(c.saldo_pendiente || 0).toLocaleString()}${c.telefono ? ` (📞 ${c.telefono})` : ''}\n`;
    });
    await sendTelegramMessage(token, chatId, msg);
    return;
  }

  if (text.startsWith('/stock ')) {
    const queryTerm = text.replace('/stock ', '').trim();
    const prods = await searchProductsForQuery(queryTerm);
    if (!prods.length) {
      await sendTelegramMessage(token, chatId, `❌ No se encontraron repuestos que coincidan con "${queryTerm}".`);
      return;
    }
    let msg = `🔍 *Resultados de búsqueda para "${queryTerm}":*\n\n`;
    prods.forEach(p => {
      msg += `• *${p.nombre}*\n  - Código: \`${p.codigo || 'S/C'}\`\n  - Existencia: *${p.existencia} unidades*\n  - Precio Venta: *C$ ${Number(p.venta).toLocaleString()}* | Mayoreo: *C$ ${Number(p.mayoreo || p.venta).toLocaleString()}*\n\n`;
    });
    await sendTelegramMessage(token, chatId, msg);
    return;
  }

  // Mensaje en Lenguaje Natural: Procesar con el Motor de IA del Negocio
  try {
    // Notificar al usuario que estamos procesando
    await sendTelegramMessage(token, chatId, "⏳ _Consultando datos en tiempo real..._");

    const chatHist = telegramHistories.get(chatId) || [];

    const result = await askBusinessAI({
      question: text,
      history: chatHist,
      userId: `telegram-${chatId}`
    });

    // Guardar en el historial de conversación del chat
    chatHist.push({ role: 'user', text });
    chatHist.push({ role: 'assistant', text: result.answer });
    if (chatHist.length > 8) {
      chatHist.splice(0, chatHist.length - 8);
    }
    telegramHistories.set(chatId, chatHist);

    if (result.image) {
      await sendTelegramPhoto(token, chatId, result.image, result.answer);
    } else {
      await sendTelegramMessage(token, chatId, result.answer);
    }
  } catch (err) {
    console.error('[TelegramBot] Error procesando consulta con IA:', err.message);
    await sendTelegramMessage(token, chatId, `⚠️ Ocurrió un error al procesar tu consulta: ${err.message}`);
  }
}

/**
 * Ciclo de Long-Polling para recibir mensajes de Telegram sin librerías externas.
 */
async function startPollingLoop(token) {
  isPolling = true;
  console.log('[TelegramBot] 🚀 Bot de Telegram conectado y escuchando mensajes...');

  while (isPolling) {
    try {
      const url = `https://api.telegram.org/bot${token}/getUpdates?offset=${lastUpdateId + 1}&timeout=20`;
      const res = await fetch(url, { signal: pollingAbortController?.signal });

      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.result)) {
          for (const update of data.result) {
            lastUpdateId = update.update_id;
            if (update.message) {
              await handleTelegramMessage(token, update.message);
            }
          }
        }
      } else {
        const errText = await res.text();
        console.warn(`[TelegramBot] getUpdates falló [${res.status}]: ${errText}. Reintentando en 5s...`);
        await new Promise(r => setTimeout(r, 5000));
      }
    } catch (err) {
      if (!isPolling) break;
      // Errores de red o timeout
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

/**
 * Inicializa el bot de Telegram al arrancar el servidor Node.js.
 */
async function initTelegramBot() {
  const token = await getTelegramToken();
  if (!token) {
    console.log('[TelegramBot] 💤 Inactivo (No se ha configurado TELEGRAM_BOT_TOKEN en .env ni en ajustes)');
    return;
  }

  if (isPolling) {
    console.log('[TelegramBot] Ya se encuentra en ejecución.');
    return;
  }

  pollingAbortController = new AbortController();
  startPollingLoop(token).catch(err => {
    console.error('[TelegramBot] Error crítico en ciclo de polling:', err.message);
  });
}

/**
 * Detiene el bot de Telegram de forma limpia.
 */
function stopTelegramBot() {
  isPolling = false;
  if (pollingAbortController) {
    pollingAbortController.abort();
    pollingAbortController = null;
  }
}

/**
 * Reinicia el bot (por ejemplo al guardar nuevo token en Configuración).
 */
async function restartTelegramBot() {
  stopTelegramBot();
  await new Promise(r => setTimeout(r, 1000));
  await initTelegramBot();
}

module.exports = {
  initTelegramBot,
  stopTelegramBot,
  restartTelegramBot,
  getTelegramToken
};
