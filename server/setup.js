const { Pool, Client } = require('pg');
require('dotenv').config({ path: './config/.env' });

const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const dbPass = process.env.DB_PASS;

async function createDatabase() {
  try {
    console.log('Creating database...');
    const client = new Client({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPass,
      database: 'postgres' // Connect to the default database to create a new database
    });
    await client.connect();
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`Database ${dbName} created successfully`);
    await client.end();
  } catch (error) {
    if (error.code === '42P04') {
      console.log(`Database ${dbName} already exists`);
    } else {
      console.error('Error creating database:', error);
      process.exit(1);
    }
  }
}

async function createTables() {
  try {
    console.log('Creating tables...');
    const pool = new Pool({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPass,
      database: dbName,
    });
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
    await pool.end();
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
}

async function runMigrations() {
  await createDatabase();
  await createTables();
}

runMigrations();
