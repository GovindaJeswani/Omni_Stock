// D:\Adbms\omnistock\server\app.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Database Connection (Ensure it runs on startup)
const { pool } = require('./src/config/db'); 

// 2. Import Routes
const orderRoutes = require('./src/routes/orderRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const productRoutes = require('./src/routes/productRoutes')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Setup
app.use(cors()); // Enable CORS for client communication
app.use(express.json()); // Parse incoming JSON bodies

// --- API Routes ---
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/products', productRoutes); 

// Root check
app.get('/', (req, res) => {
    res.json({ message: 'OmniStock AI Backend Running', status: 'OK' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    // Check DB connection status (reported in db.js)
    pool.query('SELECT NOW()').then(res => {
        console.log(`⏰ DB Time Check: ${res.rows[0].now}`);
    });
});