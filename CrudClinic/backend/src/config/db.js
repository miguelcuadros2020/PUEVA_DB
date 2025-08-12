// config/db.js
// Configura la conexión al pool de PostgreSQL usando variables de entorno
// Todas las consultas deben ejecutarse con placeholders ($1, $2, ...) para prevenir SQL injection

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Log de error del pool (no detiene el proceso pero avisa)
pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

module.exports = pool;


