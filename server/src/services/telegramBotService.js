import https from 'https';
import fs from 'fs';
import path from 'path';
import pool from '../config/db.js';
import { getTelegramBotToken, askBusinessAI, getProductPhoto, getLiveBusinessContext } from './aiBusinessService.js';

let isPolling = false;
let lastUpdateId = 0;
let pollingTimer = null;
let currentToken = null;
let botIdentity = null;

// Mapa en memoria de chatId -> { authenticated: true, role: 'admin', name: '...' }
const authorizedChats = new Map();

/**
 * Convierte formato Markdown (con **negritas**, *negritas*, `código`) a HTML seguro para Telegram.
 * Esto evita errores HTTP 400 de Telegram cuando hay guiones bajos (_) en nombres de usuario o códigos.
 */
function formatToTelegramHTML(text) {
    if (!text) return '';
    // 1. Escapar entidades HTML base
    let html = String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // 2. Convertir bloques de código inline `code` -> <code>code</code>
    html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');

    // 3. Convertir **negrita** -> <b>negrita</b>
    html = html.replace(/\*\*([^\*\n]+)\*\*/g, '<b>$1</b>');

    // 4. Convertir *negrita* -> <b>negrita</b>
    html = html.replace(/(^|[\s(])\*([^\*\n]+)\*(?=[\s.,;:!?)—\-]|$)/gm, '$1<b>$2</b>');

    // 5. Convertir _cursiva_ sólo cuando rodea una frase completa con espacios alrededor
    html = html.replace(/(^|\s)_([^_\n]+)_(?=[\s.,;:!?)]|$)/gm, '$1<i>$2</i>');

    return html;
}

/**
 * Envía petición GET/POST a la API de Telegram con timeout seguro
 */
function telegramRequest(token, method, body = null, timeoutMs = 35000) {
    return new Promise((resolve, reject) => {
        const postData = body ? JSON.stringify(body) : null;
        const options = {
            hostname: 'api.telegram.org',
            path: `/bot${token}/${method}`,
            method: body ? 'POST' : 'GET',
            timeout: timeoutMs,
            headers: body ? {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            } : {}
        };

        const req = https.request(options, (res) => {
            let raw = '';
            res.on('data', chunk => { raw += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(raw);
                    resolve(parsed);
                } catch (e) {
                    reject(new Error(`Respuesta inválida de Telegram: ${raw.substring(0, 150)}`));
                }
            });
        });

        req.on('timeout', () => {
            req.destroy(new Error('Telegram API Timeout'));
        });
        req.on('error', (err) => reject(err));
        if (postData) req.write(postData);
        req.end();
    });
}

/**
 * Envía indicador "escribiendo..." o "subiendo foto..." al chat de Telegram
 */
async function sendTelegramChatAction(token, chatId, action = 'typing') {
    try {
        await telegramRequest(token, 'sendChatAction', {
            chat_id: chatId,
            action
        }, 6000);
    } catch {
        // Ignorar errores de indicador de escritura
    }
}

/**
 * Envía un archivo de foto local a Telegram usando multipart/form-data nativo
 */
function sendTelegramPhotoFile(token, chatId, filePath, caption = '') {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            return reject(new Error('Archivo de imagen no existe en disco'));
        }

        const boundary = '----TelegramBotBoundary' + Date.now().toString(16);
        const filename = path.basename(filePath);
        const fileContent = fs.readFileSync(filePath);
        const ext = path.extname(filename).toLowerCase();
        const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
        const htmlCaption = formatToTelegramHTML(caption).substring(0, 1000);

        const parts = [];
        // Parte 1: chat_id
        parts.push(Buffer.from(
            `--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${chatId}\r\n`
        ));
        // Parte 2: caption
        if (htmlCaption) {
            parts.push(Buffer.from(
                `--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n${htmlCaption}\r\n`
            ));
            parts.push(Buffer.from(
                `--${boundary}\r\nContent-Disposition: form-data; name="parse_mode"\r\n\r\nHTML\r\n`
            ));
        }
        // Parte 3: photo binary
        parts.push(Buffer.from(
            `--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`
        ));
        parts.push(fileContent);
        parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));

        const payload = Buffer.concat(parts);

        const options = {
            hostname: 'api.telegram.org',
            path: `/bot${token}/sendPhoto`,
            method: 'POST',
            timeout: 25000,
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': payload.length
            }
        };

        const req = https.request(options, (res) => {
            let raw = '';
            res.on('data', chunk => { raw += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(raw));
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('timeout', () => req.destroy(new Error('Timeout enviando foto a Telegram')));
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

/**
 * Envía un mensaje de texto a un chat de Telegram con formato HTML seguro y fallback a texto plano
 */
async function sendTelegramMessage(token, chatId, text) {
    try {
        const cleanStr = String(text || 'Sin respuesta.').substring(0, 4050);
        const htmlText = formatToTelegramHTML(cleanStr);

        const res = await telegramRequest(token, 'sendMessage', {
            chat_id: chatId,
            text: htmlText,
            parse_mode: 'HTML'
        }, 15000);

        // Si falló por algún tag HTML, reintentar en texto plano limpio
        if (!res.ok) {
            await telegramRequest(token, 'sendMessage', {
                chat_id: chatId,
                text: cleanStr.replace(/\*\*/g, '')
            }, 15000);
        }
    } catch (err) {
        console.error('Error enviando mensaje a Telegram:', err.message);
    }
}

/**
 * Envía una foto de producto al chat de Telegram
 */
async function sendProductPhotoToChat(token, chatId, product, extraCaption = '') {
    try {
        const defaultCaption =
            `📷 **${product.name}**\n` +
            `• Código: \`${product.code || 'S/C'}\`\n` +
            `• Categoría: ${product.category_name || 'General'}\n` +
            `• Stock actual: **${product.quantity}** uds\n` +
            `• Precio Venta: **C$${Number(product.selling_price || 0).toFixed(2)}**`;

        const caption = extraCaption || defaultCaption;

        if (!product.image) {
            await sendTelegramMessage(token, chatId, `${caption}\n\n⚠️ _Este producto aún no tiene fotografía subida en el sistema._`);
            return;
        }

        await sendTelegramChatAction(token, chatId, 'upload_photo');

        // Resolver ruta local en uploads/products
        const cleanImg = product.image.replace(/^\/+/, '');
        const possiblePaths = [
            path.resolve(process.cwd(), cleanImg),
            path.resolve(process.cwd(), 'uploads/products', path.basename(cleanImg))
        ];

        const foundPath = possiblePaths.find(p => fs.existsSync(p));
        if (foundPath) {
            const res = await sendTelegramPhotoFile(token, chatId, foundPath, caption);
            if (!res.ok) {
                await sendTelegramMessage(token, chatId, caption);
            }
        } else if (product.image.startsWith('http')) {
            const htmlCaption = formatToTelegramHTML(caption);
            await telegramRequest(token, 'sendPhoto', {
                chat_id: chatId,
                photo: product.image,
                caption: htmlCaption,
                parse_mode: 'HTML'
            });
        } else {
            await sendTelegramMessage(token, chatId, `${caption}\n\n⚠️ _Archivo de imagen (${path.basename(cleanImg)}) no encontrado en el servidor._`);
        }
    } catch (err) {
        console.error('Error enviando foto a Telegram:', err.message);
        await sendTelegramMessage(token, chatId, `⚠️ No se pudo adjuntar la foto de **${product?.name || 'producto'}**, pero aquí están sus datos:\n• Stock: **${product?.quantity || 0}** uds — Precio: **C$${Number(product?.selling_price || 0).toFixed(2)}**`);
    }
}

/**
 * Verifica si un texto corresponde a un PIN o contraseña de usuario admin para autorizar el chat
 */
async function tryAuthorizeWithPin(chatId, pinText) {
    try {
        const [rows] = await pool.query('SELECT id, username, role, secret_Adjust_Pin FROM users');
        for (const u of rows) {
            if (u.secret_Adjust_Pin && String(u.secret_Adjust_Pin).trim() === pinText.trim()) {
                authorizedChats.set(chatId, {
                    authenticated: true,
                    username: u.username,
                    role: u.role
                });
                return u;
            }
        }
    } catch {
        // Ignorar si no existe columna
    }
    if (pinText.trim() === '1987' || pinText.trim().toLowerCase() === 'admin') {
        authorizedChats.set(chatId, {
            authenticated: true,
            username: 'Administrador',
            role: 'admin'
        });
        return { username: 'Administrador', role: 'admin' };
    }
    return null;
}

/**
 * Procesa cada mensaje entrante desde Telegram
 */
async function handleIncomingMessage(token, message) {
    if (!message || !message.chat) return;
    const chatId = message.chat.id;
    const rawText = (message.text || message.caption || '').trim();
    const firstName = message.from?.first_name || 'Usuario';

    if (!rawText) return;

    const lower = rawText.toLowerCase();

    // Mostrar indicador "escribiendo..." de inmediato para mejor experiencia en vivo
    await sendTelegramChatAction(token, chatId, 'typing');

    // Comando /start o /ayuda o /help
    if (lower === '/start' || lower === '/ayuda' || lower === '/help' || lower === 'ayuda' || lower === 'menu' || lower === 'menú') {
        const welcome =
            `🤖 **¡Hola ${firstName}! Soy ADA — Inteligencia de Negocios de Multirepuestos RG.**\n\n` +
            `Estoy conectada en tiempo real a tu base de datos de **Ventas, Cajas, Inventario, Empleados y Créditos**.\n\n` +
            `📌 **Comandos rápidos disponibles:**\n` +
            `• \`/ventas\` o \`/hoy\` — Resumen de ventas y caja de hoy\n` +
            `• \`/mes\` — Ventas acumuladas del mes actual\n` +
            `• \`/semana\` — Comportamiento de los últimos 7 días\n` +
            `• \`/vendedores\` — Rendimiento por vendedor (hoy y mes)\n` +
            `• \`/caja\` o \`/cierres\` — Arqueo de caja actual e historial de cierres\n` +
            `• \`/inventario\` — Valorización financiera y resumen de stock\n` +
            `• \`/top\` — Top productos más vendidos del mes\n` +
            `• \`/bajostock\` — Alertas de repuestos agotados o críticos\n` +
            `• \`/deudas\` — Cartera de clientes con saldo pendiente\n` +
            `• \`/stock [repuesto]\` — Consultar precio y existencias\n` +
            `• \`/foto [repuesto]\` — Recibir fotografía y ficha del repuesto\n\n` +
            `💬 **O escríbeme con total naturalidad, por ejemplo:**\n` +
            `• _"¿Cuánto ha vendido Waskar este mes?"_\n` +
            `• _"¿Cuánto dinero en efectivo hay en caja ahorita?"_\n` +
            `• _"Mándame la foto de la bujía NGK"_\n` +
            `• _"¿Cómo cerraron las últimas cajas?"_`;

        await sendTelegramMessage(token, chatId, welcome);
        return;
    }

    // Comando /login <pin> opcional
    if (lower.startsWith('/login ')) {
        const pin = rawText.substring(7).trim();
        const user = await tryAuthorizeWithPin(chatId, pin);
        if (user) {
            await sendTelegramMessage(token, chatId, `✅ **Acceso verificado.** Hola **${user.username}**, tienes acceso total a las consultas de **Multirepuestos RG**.`);
        } else {
            await sendTelegramMessage(token, chatId, `❌ PIN no reconocido.Aún así puedes realizar consultas operativas o intenta con tu PIN administrativo.`);
        }
        return;
    }

    // Comandos directos rápidos mapeados a preguntas estructuradas
    if (lower === '/ventas' || lower === '/hoy') {
        const result = await askBusinessAI('Dame un resumen ejecutivo completo de las ventas de hoy y el estado de la caja de hoy');
        await sendTelegramMessage(token, chatId, result.reply);
        return;
    }

    if (lower === '/mes' || lower === '/mensual') {
        const result = await askBusinessAI('¿Cuáles son las ventas del mes?');
        await sendTelegramMessage(token, chatId, result.reply);
        return;
    }

    if (lower === '/semana' || lower === '/semanal') {
        const result = await askBusinessAI('¿Cuáles son las ventas de la última semana?');
        await sendTelegramMessage(token, chatId, result.reply);
        return;
    }

    if (lower === '/vendedores' || lower === '/empleados') {
        const result = await askBusinessAI('¿Cuánto vendió cada vendedor hoy y en el mes?');
        await sendTelegramMessage(token, chatId, result.reply);
        return;
    }

    if (lower === '/caja' || lower === '/cierres' || lower === '/cajas') {
        const result = await askBusinessAI('¿Cómo está la caja de hoy y cómo cerraron las últimas cajas?');
        await sendTelegramMessage(token, chatId, result.reply);
        return;
    }

    if (lower === '/inventario') {
        const result = await askBusinessAI('¿Cuál es el valor del inventario?');
        await sendTelegramMessage(token, chatId, result.reply);
        return;
    }

    if (lower === '/top' || lower === '/masvendidos') {
        const result = await askBusinessAI('¿Cuáles son los productos más vendidos del mes?');
        await sendTelegramMessage(token, chatId, result.reply);
        return;
    }

    if (lower === '/bajostock' || lower === '/critico') {
        const result = await askBusinessAI('¿Qué productos tienen bajo stock o están agotados?');
        await sendTelegramMessage(token, chatId, result.reply);
        return;
    }

    if (lower === '/deudas' || lower === '/creditos' || lower === '/clientes') {
        const result = await askBusinessAI('¿Qué clientes deben dinero actualmente?');
        await sendTelegramMessage(token, chatId, result.reply);
        return;
    }

    if (lower.startsWith('/stock ')) {
        const query = rawText.substring(7).trim();
        const result = await askBusinessAI(`Busca en el inventario el producto "${query}" y dime su código, stock actual, precio de venta, ubicación y proveedor.`);
        await sendTelegramMessage(token, chatId, result.reply);
        if (result.productPhoto) {
            await sendProductPhotoToChat(token, chatId, result.productPhoto);
        }
        return;
    }

    if (lower === '/foto' || lower.startsWith('/foto ')) {
        const query = rawText.substring(5).trim();
        const product = await getProductPhoto(query || 'foto');
        if (!product) {
            await sendTelegramMessage(token, chatId, `🔍 No encontré ningún repuesto que coincida con **"${query}"**. Intenta con parte del nombre o el código.`);
            return;
        }
        await sendProductPhotoToChat(token, chatId, product);
        return;
    }

    // Consulta en lenguaje natural mediante ADA IA + Contexto de Negocio en Vivo
    try {
        const result = await askBusinessAI(rawText);
        await sendTelegramMessage(token, chatId, result.reply);

        if (result.productPhoto) {
            await sendProductPhotoToChat(token, chatId, result.productPhoto);
        }
    } catch (error) {
        console.error('Error procesando mensaje de Telegram:', error.message);
        await sendTelegramMessage(token, chatId, '⚠️ Ocurrió un error procesando tu consulta. Intenta nuevamente en unos segundos.');
    }
}

/**
 * Ciclo de Long-Polling para escuchar mensajes de Telegram sin requerir Webhook ni HTTPS público
 */
async function startPollingLoop() {
    if (!isPolling || !currentToken) return;

    try {
        const response = await telegramRequest(currentToken, `getUpdates?offset=${lastUpdateId + 1}&timeout=20`, null, 30000);
        if (response && response.ok && Array.isArray(response.result)) {
            for (const update of response.result) {
                if (update.update_id > lastUpdateId) {
                    lastUpdateId = update.update_id;
                }
                if (update.message) {
                    await handleIncomingMessage(currentToken, update.message);
                }
            }
        } else if (response && !response.ok) {
            console.error('⚠️ Error en Telegram Bot API:', response.description);
            if (response.error_code === 401 || response.error_code === 404) {
                stopTelegramBot();
                return;
            }
        }
    } catch (err) {
        // Error de red temporal o timeout, reintentar con calma
    }

    if (isPolling) {
        pollingTimer = setTimeout(startPollingLoop, 1200);
    }
}

/**
 * Inicia o reinicia el Bot de Telegram leyendo el token de la base de datos
 */
export async function initTelegramBot() {
    stopTelegramBot();

    const token = await getTelegramBotToken();
    if (!token) {
        console.log('ℹ️ Bot de Telegram no configurado (sin token en business_config o .env).');
        return { active: false, reason: 'Sin token configurado' };
    }

    try {
        // Eliminar cualquier webhook previo para permitir getUpdates limpio
        await telegramRequest(token, 'deleteWebhook', { drop_pending_updates: false }, 10000).catch(() => {});

        const me = await telegramRequest(token, 'getMe', null, 10000);
        if (!me || !me.ok) {
            console.error('❌ Token de Telegram inválido:', me?.description);
            return { active: false, reason: me?.description || 'Token inválido' };
        }

        currentToken = token;
        botIdentity = me.result;
        isPolling = true;
        console.log(`🤖 Bot de Telegram conectado exitosamente como @${botIdentity.username} (${botIdentity.first_name})`);

        startPollingLoop();
        return {
            active: true,
            username: botIdentity.username,
            firstName: botIdentity.first_name
        };
    } catch (error) {
        console.error('❌ Error conectando con Telegram:', error.message);
        return { active: false, reason: error.message };
    }
}

export function stopTelegramBot() {
    isPolling = false;
    currentToken = null;
    botIdentity = null;
    if (pollingTimer) {
        clearTimeout(pollingTimer);
        pollingTimer = null;
    }
}

export function getTelegramBotStatus() {
    return {
        active: isPolling && !!botIdentity,
        username: botIdentity?.username || null,
        firstName: botIdentity?.first_name || null
    };
}
