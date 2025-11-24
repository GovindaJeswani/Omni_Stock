// D:\Adbms\omnistock\server\src\routes\productRoutes.js

const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// GET /products
// Fetches a list of all products along with their total stock quantity.
router.get('/', async (req, res) => {
    // Implement simple pagination controls
    const limit = parseInt(req.query.limit) || 12;
    const offset = parseInt(req.query.offset) || 0;
    
    try {
        // SQL JOIN to combine product details with inventory stock
        const sql = `
            SELECT 
                p.product_id, 
                p.name, 
                p.description, 
                p.price, 
                p.category,
                -- Aggregate all warehouse quantities for total available stock
                COALESCE(SUM(i.quantity), 0) AS quantity 
            FROM products p
            LEFT JOIN inventory i ON p.product_id = i.product_id
            GROUP BY 
                p.product_id, p.name, p.description, p.price, p.category
            LIMIT $1 
            OFFSET $2;
        `;
        
        const result = await query(sql, [limit, offset]);
        
        res.json(result.rows);
        
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Database query failed." });
    }
});

module.exports = router;