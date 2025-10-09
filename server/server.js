// ==========================================================
// ARCHIVO: server/server.js
// VERSIÓN FINAL PARA RENDER (CON TODAS LAS RUTAS)
// ==========================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Conexión a BD
const db = require('./src/config/db.js'); 

// Rutas
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
// AÑADIDO: Importar la nueva ruta de subida de inventario
const inventoryUploadRoutes = require('./src/routes/inventoryUploadRoute.js');

const app = express();

// CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://rg11.netlify.app'
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

// Montar rutas en el prefijo /api
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
// AÑADIDO: Usar la nueva ruta de subida de inventario
router.use('/inventory', inventoryUploadRoutes);

app.use('/api', router);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor de MultirepuestosRG funcionando en Render! 🚀');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});