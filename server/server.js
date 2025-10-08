// 1. Importar las librerías
const express = require('express');
const cors = require('cors');
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


// 2. Crear una instancia de Express
const app = express();

// 3. Configurar Middlewares
app.use(cors());
app.use(express.json());

// 4. Definir el puerto
const PORT = process.env.PORT || 3001;

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

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡API de MultirepuestosRG funcionando! 🚀');
});

// 6. Poner el servidor a escuchar
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});