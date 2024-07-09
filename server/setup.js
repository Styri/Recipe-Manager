// server/setup.js
const { execSync } = require('child_process');
const { Pool } = require('pg');
require('dotenv').config({ path: './config/.env' });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

async function createDatabase() {
  try {
    console.log('Creating database...');
    await pool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    console.log(`Database ${process.env.DB_NAME} created successfully`);
  } catch (error) {
    if (error.code === '42P04') {
      console.log(`Database ${process.env.DB_NAME} already exists`);
    } else {
      console.error('Error creating database:', error);
      process.exit(1);
    }
  }
}

async function createTables() {
  try {
    console.log('Creating tables...');
    const setupSQL = `
      CREATE TABLE IF NOT EXISTS recipes (
        recipe_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        favorite BOOLEAN DEFAULT FALSE
      );
    `;
    await pool.query(setupSQL);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
}

async function runMigrations() {
  try {
    await createDatabase();
    await createTables();
  } finally {
    pool.end();
  }
}

runMigrations();
