// 1. Importar las librerías
const express = require('express');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

// Importamos la conexión a la BD
const db = require('./src/config/db.js');

// Importamos nuestras rutas
const authRoutes = require('./src/routes/authRoutes.js');
const userRoutes = require('./src/routes/userRoutes.js');
const productRoutes = require('./src/routes/productRoutes.js');
const categoryRoutes = require('./src/routes/categoryRoutes.js');
const providerRoutes = require('./src/routes/providerRoutes.js');
const clientRoutes = require('./src/routes/clientRoutes.js');
const orderRoutes = require('./src/routes/orderRoutes.js');
const financeRoutes = require('./src/routes/financeRoutes.js');
const salesRoutes = require('./src/routes/salesRoutes.js');
const reportRoutes = require('./src/routes/reportRoutes.js');
const uploadRoutes = require('./src/routes/uploadRouter.js');
const cajaRoutes = require('./src/routes/cajaRoutes.js');
// NUEVA RUTA AGREGADA
const providerInvoiceRoutes = require('./src/routes/providerInvoiceRoutes.js');
const requestRoutes = require('./src/routes/requestRoutes.js');
const outflowRoutes = require('./src/routes/outflowRoutes.js');
const employeeRoutes = require('./src/routes/employeeRoutes.js');

// 2. Crear una instancia de Express
const app = express();

// Helper para CORS dinámico (permite LAN IPs)
const allowedOrigins = [
  'https://multirepuestosrg.netlify.app',
  'https://www.multirepuestosrg.com',
  'https://multirepuestosrg.com', // Added non-www version
  'https://sistema.multirepuestosrg.com',
  'http://sistema.multirepuestosrg.com',
  'http://localhost:5173',
  'http://64.23.228.145',
  'https://64.23.228.145'
];

const corsOriginHelper = (origin, callback) => {
  // Permitir requests sin origin (como apps móviles o Postman)
  if (!origin) return callback(null, true);

  // Orígenes explícitos
  if (allowedOrigins.includes(origin)) return callback(null, true);

  // Permitir IPs de red local (192.168.x.x, 10.x.x.x, 172.16.x.x)
  if (origin.startsWith('http://192.168.') ||
    origin.startsWith('http://10.') ||
    origin.startsWith('http://172.')) {
    return callback(null, true);
  }

  callback(new Error('Not allowed by CORS'));
};

const corsOptions = {
  origin: corsOriginHelper,
  credentials: true
};

// 3. Configurar Middlewares
// ★ Compresión gzip/brotli: Reduce JSON de productos de ~2MB a ~250KB
app.use(compression({ level: 6, threshold: 1024 })); // Solo comprimir si >1KB
app.use(cors({ origin: true, credentials: true }));

// Evita 413: payload grande (10MB cubre imágenes base64 sin consumir RAM excesiva)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Servir archivos estáticos (Imágenes subidas)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/uploads', express.static(path.join(__dirname, 'public/uploads')));

// 4. Definir el puerto
// Usamos BACKEND_PORT si existe (según tu .env), o PORT, o 3003 por defecto
const PORT = process.env.BACKEND_PORT || process.env.PORT || 3003;

// 4.5. Middleware global de Trazabilidad Automática de Acciones de Usuarios
const { initPermissionsAndAuditSchema, logUserActivity } = require('./src/services/permissionsService.js');

app.use((req, res, next) => {
  const method = req.method;
  if (!['POST', 'PUT', 'DELETE'].includes(method)) return next();

  const url = req.originalUrl || req.url || '';
  // Excluir rutas que ya registran su propia auditoría detallada o son lecturas/chats
  if (
    url.startsWith('/api/auth/') ||
    url.startsWith('/api/users') ||
    url.startsWith('/api/ai/ask') ||
    url.includes('/validate-pin')
  ) {
    return next();
  }

  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      try {
        let actor = req.user;
        if (!actor && req.headers.authorization?.startsWith('Bearer ')) {
          const tok = req.headers.authorization.split(' ')[1];
          const secret = process.env.JWT_SECRET || 'secret_key_reemplazo_seguro';
          actor = require('jsonwebtoken').verify(tok, secret);
        }
        if (!actor) return;

        const body = req.body || {};
        let modulo = 'Sistema';
        let accion = `${method} ${url}`;
        let descripcion = '';

        if (url.startsWith('/api/products')) {
          modulo = 'Inventario';
          if (method === 'POST') {
            accion = 'PRODUCTO_CREADO';
            descripcion = `Creó producto "${body.nombre || body.codigo || 'Nuevo'}" (Cód: ${body.codigo || 'S/C'}, Stock: ${body.existencia ?? 0}, Venta: C$ ${body.venta ?? 0})`;
          } else if (method === 'PUT') {
            accion = 'PRODUCTO_EDITADO';
            descripcion = `Editó producto ID #${url.split('/').pop()} "${body.nombre || ''}" (Stock: ${body.existencia ?? 's/c'}, Venta: C$ ${body.venta ?? 's/c'})`;
          } else if (method === 'DELETE') {
            accion = 'PRODUCTO_ELIMINADO';
            descripcion = `Eliminó producto ID #${url.split('/').pop()}`;
          }
        } else if (url.startsWith('/api/sales')) {
          modulo = 'POS / Ventas';
          if (url.includes('devolucion') || url.includes('return') || url.includes('cancel')) {
            accion = 'DEVOLUCION_VENTA';
            descripcion = `Procesó devolución/anulación en ventas (${url})`;
          } else if (method === 'POST') {
            accion = 'VENTA_REGISTRADA';
            descripcion = `Registró venta por C$ ${Number(body.total_venta || body.total || 0).toFixed(2)}`;
          }
        } else if (url.startsWith('/api/caja')) {
          modulo = 'Caja y Arqueos';
          if (url.includes('/open') || url.includes('/abrir')) {
            accion = 'CAJA_APERTURA';
            descripcion = `Abrió turno de caja con monto inicial C$ ${Number(body.monto_inicial || body.initialAmount || 0).toFixed(2)}`;
          } else if (url.includes('/close') || url.includes('/cerrar')) {
            accion = 'CAJA_CIERRE';
            descripcion = `Cerró turno de caja`;
          } else if (url.includes('/tx') || url.includes('/movimiento')) {
            const tx = body.tx || body;
            // NUNCA dejar huella en auditoría de ajustes del menú secreto
            if (String(tx.type || '').toLowerCase() === 'ajuste' || tx.isSecret) {
              return;
            }
            accion = `CAJA_${String(tx.type || 'MOVIMIENTO').toUpperCase()}`;
            descripcion = `Registró movimiento de caja (${tx.type || 'tx'}): C$ ${Number(tx.amount || tx.monto || 0).toFixed(2)} ${tx.reason || tx.nota || ''}`.trim();
          }
        } else if (url.startsWith('/api/clients')) {
          modulo = 'Clientes y Créditos';
          if (url.includes('/abono')) {
            accion = method === 'DELETE' ? 'ABONO_ANULADO' : 'ABONO_REGISTRADO';
            descripcion = method === 'DELETE'
              ? `Anuló abono de cliente (${url})`
              : `Registró abono de cliente por C$ ${Number(body.monto || body.amount || 0).toFixed(2)}`;
          } else {
            accion = method === 'POST' ? 'CLIENTE_CREADO' : method === 'PUT' ? 'CLIENTE_EDITADO' : 'CLIENTE_ELIMINADO';
            descripcion = `${accion.replace('_', ' ')}: ${body.nombre || `ID #${url.split('/').pop()}`}`;
          }
        } else if (url.startsWith('/api/outflow')) {
          modulo = 'Traslados / Salidas';
          accion = 'SALIDA_INVENTARIO';
          descripcion = `Registró salida/traslado de inventario (${body.motivo || body.tipo || 'Salida'})`;
        } else if (url.startsWith('/api/upload')) {
          modulo = 'Carga Masiva';
          accion = 'CARGA_MASIVA_CSV';
          descripcion = `Ejecutó carga masiva de inventario (${Array.isArray(body.items) ? body.items.length : 0} ítems)`;
        } else if (url.startsWith('/api/finances')) {
          modulo = 'Finanzas';
          accion = url.includes('ingreso') ? 'INGRESO_FINANCIERO' : 'EGRESO_FINANCIERO';
          descripcion = `Registró movimiento financiero por C$ ${Number(body.monto || 0).toFixed(2)} (${body.descripcion || ''})`;
        } else if (url.startsWith('/api/orders')) {
          modulo = 'Proformas y Apartados';
          accion = `PEDIDO_${method}`;
          descripcion = `Operación en proformas/apartados (${method} ${url})`;
        } else if (url.startsWith('/api/facturas-proveedores')) {
          modulo = 'Facturas Proveedores';
          accion = `FACTURA_PROVEEDOR_${method}`;
          descripcion = `Gestión de factura de proveedor (${body.numero_factura || url})`;
        } else if (url.startsWith('/api/employees')) {
          modulo = 'Empleados';
          accion = `EMPLEADO_${method}`;
          descripcion = `Gestión de empleado ${body.nombre || ''}`;
        } else if (url.startsWith('/api/settings')) {
          modulo = 'Configuración';
          accion = 'CONFIG_ACTUALIZADA';
          descripcion = `Actualizó configuración general del negocio`;
        } else {
          return;
        }

        logUserActivity({
          id_usuario: actor.id_usuario || actor.id,
          nombre_usuario: actor.nombre_usuario || actor.nombre,
          rol: actor.rol,
          modulo,
          accion,
          descripcion,
          req
        });
      } catch (_) {}
    }
  });

  next();
});

// 5. Usar las rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/caja', cajaRoutes);
// NUEVA RUTA AGREGADA
app.use('/api/facturas-proveedores', providerInvoiceRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/outflow', outflowRoutes);
app.use('/api/employees', employeeRoutes);

const settingsRoutes = require('./src/routes/settingsRoutes.js');
app.use('/api/settings', settingsRoutes);

const wholesaleRoutes = require('./src/routes/wholesaleRoutes.js');
app.use('/api/wholesale', wholesaleRoutes);

const aiRoutes = require('./src/routes/aiRoutes.js');
app.use('/api/ai', aiRoutes);

app.get('/', (_req, res) => {
  res.send('¡API de MultirepuestosRG funcionando! 🚀');
});

// 6. Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

// 7. Configuración de Socket.IO con Autenticación JWT y Sincronización en Tiempo Real
const { Server } = require('socket.io');
const http = require('http');
const jwt = require('jsonwebtoken');

// Crear servidor HTTP explícito para soportar Socket.IO + Express
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: corsOptions
});

// Helper para calcular reservas activas en tiempo real
async function calculateGlobalReservations() {
  try {
    const [cartRows] = await db.query(
      "SELECT user_id, carts_json FROM active_carts WHERE updated_at > NOW() - INTERVAL 60 MINUTE"
    );
    const totalByProduct = {};
    const userReservations = {};

    (cartRows || []).forEach(c => {
      const uId = c.user_id;
      let items = c.carts_json;
      if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch (e) { items = []; }
      }
      if (!Array.isArray(items)) items = [];

      items.forEach(ticket => {
        if (ticket.items && Array.isArray(ticket.items)) {
          ticket.items.forEach(item => {
            const pid = item.id_producto || item.id;
            const qty = Number(item.quantity || item.cantidad || 0);
            if (pid && qty > 0) {
              totalByProduct[pid] = (totalByProduct[pid] || 0) + qty;
              if (!userReservations[uId]) userReservations[uId] = {};
              userReservations[uId][pid] = (userReservations[uId][pid] || 0) + qty;
            }
          });
        }
      });
    });

    return { totalByProduct, userReservations };
  } catch (err) {
    console.error('[calculateGlobalReservations] Error:', err.message);
    return { totalByProduct: {}, userReservations: {} };
  }
}

// Middleware de autenticación JWT en Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'secret_key_reemplazo_seguro';
      const decoded = jwt.verify(token, secret);
      socket.user = decoded;
    } catch (err) {
      console.warn('⚠️ Socket auth token inválido o expirado:', err.message);
      socket.user = null;
    }
  }
  next();
});

io.on('connection', async (socket) => {
  const userInfo = socket.user ? `(Usuario: ${socket.user.nombre_usuario || socket.user.id || 'N/A'})` : '(Sin JWT)';
  console.log(`✅ Cliente conectado al socket: ${socket.id} ${userInfo}`);

  // Enviar estado actual de reservas al conectar
  try {
    const reservations = await calculateGlobalReservations();
    socket.emit('stock:reservations_update', reservations);
  } catch (e) { }

  // Evento: Sincronización de carrito en tiempo real
  socket.on('cart:update', async (payload) => {
    try {
      const userId = payload?.userId || socket.user?.id_usuario || socket.user?.id;
      const carts = payload?.carts;
      if (userId && Array.isArray(carts)) {
        const jsonStr = JSON.stringify(carts);
        await db.query(`
          INSERT INTO active_carts (user_id, carts_json) VALUES (?, ?)
          ON DUPLICATE KEY UPDATE carts_json = VALUES(carts_json)
        `, [userId, jsonStr]);

        const resData = await calculateGlobalReservations();
        io.emit('stock:reservations_update', { ...resData, updatedByUserId: userId });
      }
    } catch (err) {
      console.error('[Socket cart:update] Error:', err.message);
    }
  });

  // Evento: Liberar carrito / Ticket eliminado
  socket.on('cart:release', async (payload) => {
    try {
      const userId = payload?.userId || socket.user?.id_usuario || socket.user?.id;
      if (userId) {
        if (payload?.carts) {
          const jsonStr = JSON.stringify(payload.carts);
          await db.query(`
            INSERT INTO active_carts (user_id, carts_json) VALUES (?, ?)
            ON DUPLICATE KEY UPDATE carts_json = VALUES(carts_json)
          `, [userId, jsonStr]);
        } else {
          await db.query('DELETE FROM active_carts WHERE user_id = ?', [userId]);
        }
        const resData = await calculateGlobalReservations();
        io.emit('stock:reservations_update', { ...resData, updatedByUserId: userId });
      }
    } catch (err) {
      console.error('[Socket cart:release] Error:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

app.set('io', io);
app.set('calculateGlobalReservations', calculateGlobalReservations);

// 8. Iniciar Servidor
// Importante: Usamos httpServer.listen en lugar de app.listen para que WS funcione
const { initTelegramBot } = require('./src/services/telegramBotService');

httpServer.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  // Inicializar esquema de permisos granulares, usuario principal admin (1987) y tabla de trazabilidad
  await initPermissionsAndAuditSchema();
  // Iniciar bot de Telegram si el token está presente
  initTelegramBot();
});