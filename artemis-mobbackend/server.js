const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  throw new Error('Falta JWT_SECRET en el archivo .env');
}

const { uploadDir } = require('./src/middleware/upload');
const authRoutes = require('./src/routes/authRoutes');
const recipeRoutes = require('./src/routes/recipeRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

// CORS_ORIGIN admite una lista separada por comas. Sin esta variable, se
// permite cualquier origen (útil en desarrollo, cuando la IP local cambia
// según la red Wi-Fi a la que esté conectado el celular con Expo).
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : true;
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

app.get('/', (req, res) => {
  res.json({ mensaje: '¡El servidor de Ártemis está vivo y funcionando!' });
});

app.use('/api', authRoutes);
app.use('/api/recetas', recipeRoutes);
app.use('/api/usuarios', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
