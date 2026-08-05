const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Al importar db.js, se ejecutará la prueba de conexión a PostgreSQL
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors());
app.use(express.json()); // Permite recibir datos JSON en las peticiones

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor Ártemis funcionando y conectado a la BD',
    timestamp: new Date()
  });
});

// Encender el servidor
app.listen(PORT, () => {
  console.log(`[LOG - SERVIDOR]: Servidor Express corriendo en http://localhost:${PORT}`);
});