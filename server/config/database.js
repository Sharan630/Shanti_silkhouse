const { Pool } = require('pg');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../config.env') });

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // Connection pool settings to handle timeouts
  max: 20, // Maximum number of clients in the pool
  min: 2, // Minimum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 20000, // Return an error after 20 seconds if connection could not be established
  query_timeout: 60000, // Query timeout in milliseconds
  statement_timeout: 60000, // Statement timeout in milliseconds
  // Keep connections alive
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  // Retry configuration
  retryDelayMs: 1000,
  retryAttempts: 3
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to Neon database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Add connection retry logic
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

// Test connection on startup
connectWithRetry();

// Utility function for safe database queries
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
