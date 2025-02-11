const { Pool } = require("pg");
require('dotenv').config({ path: "./config/.env" });

console.log('DB_HOST:', process.env.DB_HOST);

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

module.exports = pool;