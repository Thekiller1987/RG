// ==========================================================
// ARCHIVO: server/server.js
// VERSIÓN AJUSTADA PARA FLY.IO (Puerto 8080)
// ==========================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Asegúrate de que tu archivo db.js usa las variables de entorno para Supabase.
// La conexión a BD se mantiene igual, las variables se configuran en Fly.io
const db = require('./src/config/db.js'); 

// Rutas (Mantenemos la misma estructura de rutas)
const authRoutes = require('./src/routes/authRoutes.js');
const userRoutes = require('./src/routes/userRoutes.js');
const productRoutes = require('./src/routes/productRoutes.js');
const categoryRoutes = require('./src/routes/categoryRoutes.js');
const providerRoutes = require('./src/routes/providerRoutes.js');
const clientRoutes = require('./src/routes/clientRoutes.js');
const orderRoutes = require('./src/routes/orderRoutes.js');
const financeRoutes = require('./src/routes/financeRoutes.js');
const salesRoutes = require('src/routes/salesRoutes.js');
const reportRoutes = require('./src/routes/reportRoutes.js');
const inventoryUploadRoutes = require('./src/routes/inventoryUploadRoute.js');

const app = express();

// --- Configuración CORS ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://rg11.netlify.app',
  // IMPORTANTE: Asegúrate de reemplazar "TU-FLY-IO-DOMAIN.fly.dev" 
  // con la URL real que Fly.io te asigne (ej: https://multirepuestos-rg-api.fly.dev)
  'https://TU-FLY-IO-DOMAIN.fly.dev' 
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
}));
app.use(express.json());

// --- Montar Rutas ---
const router = express.Router();
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/providers', providerRoutes);
router.use('/clients', clientRoutes);
router.use('/orders', orderRoutes);
router.use('/finances', financeRoutes);
router.use('/sales', salesRoutes);
router.use('/reports', reportRoutes);
router.use('/inventory', inventoryUploadRoutes);

app.use('/api', router);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor de MultirepuestosRG funcionando en Fly.io! 🚀');
});

// --- Iniciar el servidor ---
// CAMBIO CLAVE: Usamos 8080 como puerto predeterminado para el contenedor Fly.io
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});