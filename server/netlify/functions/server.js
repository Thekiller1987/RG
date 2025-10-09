// ==========================================================
// ARCHIVO: server/netlify/functions/server.js
// VERSIÓN FINAL Y CORREGIDA
// ==========================================================

// 1. Importar las librerías
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const serverless = require('serverless-http'); 

// Importamos la conexión a la BD
// CORRECCIÓN: La ruta ahora sube dos niveles para encontrar la carpeta 'src'
const db = require('../../src/config/db.js'); 

// Importamos nuestras rutas
// CORRECCIÓN: Todas las rutas ahora suben dos niveles
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

// 2. Crear una instancia de Express
const app = express();
const router = express.Router(); 

// 3. Configurar Middlewares
const allowedOrigins = [
    'http://localhost:3000', 
    'http://localhost:5173', // Puerto común de Vite
    'https://rg11.netlify.app' // Tu dominio de Netlify
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
};

app.use(cors(corsOptions));
app.use(express.json());

// 4. Usar las rutas
// Todas las rutas se añaden al router de Express
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

// Ruta de prueba para verificar que la API responde
router.get('/', (req, res) => {
    res.json({ message: '¡API de MultirepuestosRG funcionando! 🚀' });
});

// CORRECCIÓN CRÍTICA:
// Montamos nuestro router en la ruta base "/api".
// Netlify redirige las peticiones de "/api/*" aquí, y el router se encarga del resto.
app.use('/api', router); 

// 5. Exportar la función Serverless que Netlify ejecutará
module.exports.handler = serverless(app);