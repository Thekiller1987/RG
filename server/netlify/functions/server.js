// 1. Importar las librerías
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const serverless = require('serverless-http'); // <--- NUEVA LIBRERÍA

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
const router = express.Router(); // Usamos un Router para enrutar dentro de la función

// 3. Configurar Middlewares
// Reemplaza [TU-DOMINIO-DE-NETLIFY] con https://rg11.netlify.app
const allowedOrigins = [
    'http://localhost:3000', 
    'http://localhost:3001',
    'https://rg11.netlify.app', 
    'https://qfytudzenhpqvoxclmat.supabase.co'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // Este log se mantiene para debugging de CORS en los logs de Netlify
            console.error('Bloqueado por CORS:', origin);
            callback(new Error('No permitido por CORS'));
        }
    }
};

app.use(cors(corsOptions));
app.use(express.json());

// 4. No necesitamos el puerto aquí, Netlify lo maneja.

// 5. Usar las rutas
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

// Ruta de prueba
router.get('/', (req, res) => {
    res.send('¡API de MultirepuestosRG funcionando en Netlify Functions! 🚀');
});

// Enlaza el router de Express a la aplicación bajo el prefijo /api
// CORRECCIÓN: Cambiamos '/api' por '/' para evitar el prefijo doble (Netlify ya lo añade)
app.use('/', router); 

// 6. Exportar la función Serverless (El Servidor ya no "Escucha")
// El 'handler' es el punto de entrada que Netlify ejecutará.
module.exports.handler = serverless(app);
