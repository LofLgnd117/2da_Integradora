const express = require('express');
const cors = require('cors');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  throw new Error('Falta JWT_SECRET en el archivo .env');
}

// Al importar db.js, se ejecutará la prueba de conexión a PostgreSQL
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
// CORS_ORIGIN admite una lista separada por comas (p. ej. "http://localhost:5173,https://mi-dominio.com").
// Si no se define, se usa el origen del dev server de Vite como valor por defecto seguro.
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json()); // Permite recibir datos JSON en las peticiones
const path = require('path'); // Asegúrate de importar 'path' arriba del archivo

// ... middlewares anteriores (cors, express.json) ...
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// 1. Importar rutas
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// 2. Usar rutas con el prefijo /api/recipes
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor Ártemis funcionando y conectado a la BD',
    timestamp: new Date()
  });
});

// ... app.listen(PORT, ...) ...

// Encender el servidor
app.listen(PORT, () => {
  console.log(`[LOG - SERVIDOR]: Servidor Express corriendo en http://localhost:${PORT}`);
});