const { Pool } = require('pg');
const dbConfig = require('./config/database-supabase');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// Use connection string for Supabase, otherwise use individual params
const pool = config.connectionString 
  ? new Pool({ connectionString: config.connectionString, ...config })
  : new Pool(config);

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  process.exit(-1);
});

// Query helper
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text: text.substring(0, 50), duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Transaction helper
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Get client from pool (for manual transaction management)
const getClient = () => pool.connect();

module.exports = {
  pool,
  query,
  transaction,
  getClient
};
