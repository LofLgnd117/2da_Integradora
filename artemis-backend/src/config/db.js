const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Prueba automática de conexión al iniciar
pool.connect((err, client, release) => {
  if (err) {
    console.error('[ERROR - BASE DE DATOS]: Error al conectar con PostgreSQL ->', err.message);
  } else {
    console.log('[ÉXITO]: Conexión establecida correctamente con PostgreSQL (artemis_db)');
    release();
  }
});

module.exports = pool;