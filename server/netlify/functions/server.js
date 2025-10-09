// ==========================================================
// ARCHIVO: server/server.js
// Este es tu ÚNICO archivo de servidor.
// ==========================================================

// 1. Importar las librerías
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const serverless = require('serverless-http'); 

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

// 2. Crear una instancia de Express
const app = express();

// 3. Configurar Middlewares
const allowedOrigins = [
    'http://localhost:3000', 
    'http://localhost:5173', // Puerto común de Vite
    'https://rg11.netlify.app', 
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error('Bloqueado por CORS:', origin);
            callback(new Error('No permitido por CORS'));
        }
    }
};

app.use(cors(corsOptions));
app.use(express.json());

// 4. Montar todas las rutas en un router base
// Esto es importante para que Netlify las maneje bien.
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/providers', providerRoutes);
apiRouter.use('/clients', clientRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/finances', financeRoutes);
apiRouter.use('/sales', salesRoutes); 
apiRouter.use('/reports', reportRoutes);

// Ruta de prueba
apiRouter.get('/', (req, res) => {
    res.send('¡API de MultirepuestosRG funcionando en Netlify Functions! 🚀');
});

// Usamos el router en la app. Netlify quita el prefijo /api,
// así que lo montamos en la raíz '/'.
app.use('/', apiRouter); 

// 5. Exportar la función Serverless
// Esto es lo que Netlify usará para ejecutar todo tu servidor.
module.exports.handler = serverless(app);
