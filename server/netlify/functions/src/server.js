// ==========================================================
// ARCHIVO: server/netlify/functions/server.js
// VERSIÓN FINAL PARA NETLIFY
// ==========================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const serverless = require('serverless-http');

// Conexión a BD
const db = require('../../src/config/db.js');

// Rutas
const authRoutes = require('../../src/routes/authRoutes.js');
const userRoutes = require('../../src/routes/userRoutes.js');
const productRoutes = require('../../src/routes/productRoutes.js');
const categoryRoutes = require('../../src/routes/categoryRoutes.js');
const providerRoutes = require('../../src/routes/providerRoutes.js');
const clientRoutes = require('../../src/routes/clientRoutes.js');
const orderRoutes = require('../../src/routes/orderRoutes.js');
const financeRoutes = require('../../src/routes/financeRoutes.js');
const salesRoutes = require('../../src/routes/salesRoutes.js');
const reportRoutes = require('../../src/routes/reportRoutes.js');

const app = express();
const router = express.Router();

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

// Montar rutas **sin prefijo**: Netlify ya redirige desde /api/*
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

// Ruta de prueba
router.get('/', (req, res) => {
  res.json({ message: '¡API de MultirepuestosRG funcionando! 🚀' });
});

app.use(router);

module.exports.handler = serverless(app);
