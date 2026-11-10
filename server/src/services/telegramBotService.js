// server/src/services/telegramBotService.js
const pool = require('../config/db');
const { askBusinessAI, getLiveBusinessContext, searchProductsForQuery, getProductPhoto } = require('./aiBusinessService');

let isPolling = false;
let pollingAbortController = null;
let lastUpdateId = 0;
const authenticatedChats = new Set();
const telegramHistories = new Map(); // Historial en memoria por chatId

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
 * Convierte formato Markdown (**negritas**, *negritas*, `código`) a HTML seguro para Telegram.
 * Evita que guiones bajos (_) en nombres de usuario como multirepuestos_rg rompan el parseo de Telegram.
 */
function formatToTelegramHTML(text) {
  if (!text) return '';
  let html = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bloques `codigo` -> <code>codigo</code>
  html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');

  // **negrita** -> <b>negrita</b>
  html = html.replace(/\*\*([^\*\n]+)\*\*/g, '<b>$1</b>');

  // *negrita* -> <b>negrita</b>
  html = html.replace(/(^|[\s(•])\*([^\*\n]+)\*(?=[\s.,;:!?)—\-]|$)/gm, '$1<b>$2</b>');

  // _cursiva_ solo cuando está rodeada de espacios o inicio/fin de línea
  html = html.replace(/(^|\s)_([^_\n]+)_(?=[\s.,;:!?)]|$)/gm, '$1<i>$2</i>');

  return html;
}

/**
 * Envía acción de chat ("typing" o "upload_photo") para respuesta inmediata en Telegram.
 */
async function sendTelegramChatAction(token, chatId, action = 'typing') {
  try {
    const url = `https://api.telegram.org/bot${token}/sendChatAction`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, action })
    });
  } catch {
    // Ignorar errores de indicador de estado
  }
}

/**
 * Envía un mensaje a un chat de Telegram usando HTML seguro con fallback automático a texto plano.
 */
async function sendTelegramMessage(token, chatId, text) {
  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const cleanText = String(text || 'Sin respuesta disponible.').substring(0, 4050);
    const htmlText = formatToTelegramHTML(cleanText);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlText,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    if (!res.ok) {
      // Fallback en texto plano limpio
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: cleanText.replace(/\*\*/g, ''),
          disable_web_page_preview: true
        })
      });
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
    await sendTelegramChatAction(token, chatId, 'upload_photo');
    const raw = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(raw, 'base64');
    const formData = new FormData();
    formData.append('chat_id', String(chatId));
    formData.append('photo', new Blob([buffer], { type: 'image/jpeg' }), 'repuesto.jpg');

    const htmlCaption = formatToTelegramHTML(caption).substring(0, 1000);
    if (htmlCaption) {
      formData.append('caption', htmlCaption);
      formData.append('parse_mode', 'HTML');
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
  if (!message || (!message.text && !message.caption)) return;

  const chatId = message.chat.id;
  const text = (message.text || message.caption || '').trim();
  const lower = text.toLowerCase();
  const userName = message.from?.first_name || message.from?.username || 'Usuario';

  await sendTelegramChatAction(token, chatId, 'typing');

  // Comando /start o /ayuda o /help
  if (lower.startsWith('/start') || lower.startsWith('/help') || lower.startsWith('/ayuda') || lower === 'ayuda' || lower === 'menu' || lower === 'menú') {
    const welcome =
      `🚗 **¡Hola, ${userName}!** Soy **ADA**, el Asistente Inteligente oficial de **Multirepuestos RG** 🤖\n\n` +
      `Estoy conectada directamente a la base de datos de tu empresa en tiempo real.\n\n` +
      `📌 **Comandos directos de Negocio:**\n` +
      `• \`/ventas\` o \`/hoy\` — Ventas facturadas y arqueo de caja de hoy\n` +
      `• \`/mes\` — Ventas acumuladas del mes actual\n` +
      `• \`/semana\` — Ventas de toda la semana y desglose por día\n` +
      `• \`/vendedores\` — Rendimiento y ventas por vendedor/empleado\n` +
      `• \`/caja\` o \`/cierres\` — Dinero en cajón y arqueos recientes\n` +
      `• \`/inventario\` — Valorización financiera y resumen de inventario\n` +
      `• \`/top\` — Top productos más vendidos del mes\n` +
      `• \`/stock <nombre>\` — Consultar existencia y precios de un repuesto\n` +
      `• \`/foto <nombre>\` — Recibir fotografía y ficha de un repuesto\n` +
      `• \`/bajostock\` — Repuestos con stock crítico (<= 5 uds)\n` +
      `• \`/deudas\` — Clientes con saldo pendiente de pago\n` +
      `• \`/login <pin>\` — Autenticar este chat como Administrador\n\n` +
      `💬 **O escribe cualquier pregunta en lenguaje natural:**\n` +
      `_Ej: "Ventas de Waskar", "¿Cuánto vendimos en el mes?", "Mándame foto de bujía", "¿Cómo cerraron las últimas cajas?"_`;

    await sendTelegramMessage(token, chatId, welcome);
    return;
  }

  // Comando de autenticación PIN /login 111987 o 1987
  if (lower.startsWith('/login')) {
    const parts = text.split(/\s+/);
    const pin = (parts[1] || '').trim();
    if (pin === '111987' || pin === '1987') {
      authenticatedChats.add(chatId);
      await sendTelegramMessage(token, chatId, `🔓 **Acceso Autorizado.** Este chat ahora tiene permisos de Administrador para consultar reportes financieros y de inventario en vivo.`);
    } else {
      await sendTelegramMessage(token, chatId, `❌ PIN incorrecto. Intenta con \`/login 111987\`.`);
    }
    return;
  }

  // Atajos de comandos rápidos usando el motor unificado askBusinessAI
  const commandMap = {
    '/ventas': '¿Cuánto se ha vendido hoy y qué hay en caja?',
    '/hoy': '¿Cuánto se ha vendido hoy y qué hay en caja?',
    '/mes': '¿Cuáles son las ventas del mes?',
    '/mensual': '¿Cuáles son las ventas del mes?',
    '/semana': '¿Cuánto hemos vendido en toda la semana?',
    '/semanal': '¿Cuánto hemos vendido en toda la semana?',
    '/vendedores': '¿Cuánto vendió cada empleado o vendedor?',
    '/empleados': '¿Cuánto vendió cada empleado o vendedor?',
    '/caja': '¿Cuánto se ha vendido hoy y qué hay en caja?',
    '/cierres': '¿Cómo cerraron las últimas cajas?',
    '/cajas': '¿Cómo cerraron las últimas cajas?',
    '/inventario': '¿Cuál es el valor total del inventario?',
    '/top': '¿Cuáles son los productos más vendidos?',
    '/masvendidos': '¿Cuáles son los productos más vendidos?',
    '/bajostock': '¿Qué repuestos tienen stock crítico o bajo?',
    '/critico': '¿Qué repuestos tienen stock crítico o bajo?',
    '/deudas': '¿Quiénes son los clientes con deuda pendiente?',
    '/creditos': '¿Quiénes son los clientes con deuda pendiente?'
  };

  if (commandMap[lower]) {
    const res = await askBusinessAI({
      question: commandMap[lower],
      history: [],
      userId: `telegram-${chatId}`
    });
    await sendTelegramMessage(token, chatId, res.answer);
    return;
  }

  if (lower.startsWith('/stock ')) {
    const queryTerm = text.substring(7).trim();
    const prods = await searchProductsForQuery(queryTerm);
    if (!prods.length) {
      await sendTelegramMessage(token, chatId, `❌ No se encontraron repuestos que coincidan con **"${queryTerm}"**.`);
      return;
    }
    let msg = `🔍 **Resultados de búsqueda para "${queryTerm}":**\n\n`;
    prods.forEach(p => {
      msg += `• **${p.nombre}**\n  - Código: \`${p.codigo || 'S/C'}\`\n  - Existencia: **${p.existencia} unidades**\n  - Precio Venta: **C$ ${Number(p.venta).toLocaleString()}** | Mayoreo: **C$ ${Number(p.mayoreo || p.venta).toLocaleString()}**\n\n`;
    });
    await sendTelegramMessage(token, chatId, msg);
    return;
  }

  if (lower === '/foto' || lower.startsWith('/foto ')) {
    const queryTerm = text.substring(5).trim();
    const photoRes = await getProductPhoto(queryTerm ? `foto de ${queryTerm}` : 'foto de repuesto', telegramHistories.get(chatId) || []);
    if (photoRes.image) {
      await sendTelegramPhoto(token, chatId, photoRes.image, photoRes.answer);
    } else {
      await sendTelegramMessage(token, chatId, photoRes.answer);
    }
    return;
  }

  // Mensaje en Lenguaje Natural: Procesar con el Motor de IA del Negocio
  try {
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
  console.log('[TelegramBot] 🚀 Bot de Telegram (@Ada1987_bot) conectado y escuchando mensajes...');

  while (isPolling) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const url = `https://api.telegram.org/bot${token}/getUpdates?offset=${lastUpdateId + 1}&timeout=20`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

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
      await new Promise(r => setTimeout(r, 2500));
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
  getTelegramToken,
  formatToTelegramHTML
};
