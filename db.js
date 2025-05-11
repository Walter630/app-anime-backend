const mysql = require('mysql2/promise');
require('dotenv').config(); // Carrega variáveis do .env localmente

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'animedb',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('✅ Conectado ao MySQL');

module.exports = db;
