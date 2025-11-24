// D:\Adbms\omnistock\server\src\config\db.js

const { Pool } = require('pg');
require('dotenv').config();

// Configuration for the PostgreSQL Connection Pool
// Connection pooling improves performance by reusing existing connections.
const pool = new Pool({
    user: process.env.DB_USER || 'omnistock_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'omnistock',
    password: process.env.DB_PASSWORD || 'your_strong_password',
    port: process.env.DB_PORT || 5432,
    max: 20, // Max number of clients in the pool (High enough for demo concurrency)
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // How long to wait for a connection
});

// Test connection on startup
pool.on('connect', () => {
    console.log('✅ Connected successfully to PostgreSQL.');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    process.exit(-1); // Exit process with error
});

// Function to run simple queries
const query = (text, params) => pool.query(text, params);

// Export the pool and the query function
module.exports = {
    pool,
    query,
};