const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');
if (!process.env.DATABASE_URL) {
  const envPath = path.join(__dirname, '../config.env');
  dotenv.config({ path: envPath });
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },

  max: 20, // Maximum number of clients in the pool
  min: 2, // Minimum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 20000, // Return an error after 20 seconds if connection could not be established
  query_timeout: 60000, // Query timeout in milliseconds
  statement_timeout: 60000, // Statement timeout in milliseconds

  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,

  retryDelayMs: 1000,
  retryAttempts: 3
});
pool.on('connect', () => {
  console.log('Connected to Neon database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});
const connectWithRetry = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connection test successful');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};
connectWithRetry();
const safeQuery = async (text, params = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { pool, safeQuery };
