// ==========================================================
// ARCHIVO: server/server.js
// VERSIÓN FINAL PARA RENDER
// ==========================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Conexión a BD - La ruta ahora es relativa a la carpeta 'server'
const db = require('./src/config/db.js'); 

// Rutas - Corregidas para funcionar desde la carpeta 'server'
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

const app = express();

// CORS - Permite que tu frontend en Netlify se comunique con tu backend en Render
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://rg11.netlify.app' // ¡MUY IMPORTANTE!
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
// Ahora la URL completa será: https://tu-backend.onrender.com/api/auth/login
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

app.use('/api', router); // Usamos /api como base para todas las rutas

// Ruta de prueba para saber si el servidor está vivo
app.get('/', (req, res) => {
  res.send('Servidor de MultirepuestosRG funcionando en Render! 🚀');
});

// CAMBIO CRÍTICO: Iniciar el servidor para Render
const PORT = process.env.PORT || 3001; // Render asignará el puerto automáticamente
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});