const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'techmarket_db',
  user: 'postgres',
  password: process.env.DB_PASSWORD
});

module.exports = pool;