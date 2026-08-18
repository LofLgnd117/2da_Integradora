const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

pool.connect()
  .then(() => console.log('🟢 Conexión exitosa a PostgreSQL (artemis_db)'))
  .catch(err => console.error('🔴 Error conectando a la base de datos', err.stack));

module.exports = pool;
