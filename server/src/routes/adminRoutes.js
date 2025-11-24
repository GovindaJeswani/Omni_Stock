// D:\Adbms\omnistock\server\src\routes\adminRoutes.js

const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { getDemandForecast } = require('../services/aiService');

// --- 1. GET OVERVIEW STATS (Dynamic KPIs) ---
router.get('/stats/overview', async (req, res) => {
    try {
        const [revenueRes, ordersRes, lowStockRes, productsRes] = await Promise.all([
            query(`SELECT SUM(total_amount) as total FROM orders`), // Removed COALESCE wrapper to debug nulls
            query(`SELECT COUNT(*) as count FROM orders`),
            query(`SELECT COUNT(*) as count FROM inventory WHERE quantity < 20`),
            query(`SELECT COUNT(*) as count FROM products`)
        ]);

        res.json({
            // Fix: Handle null if no orders exist yet
            totalRevenue: parseFloat(revenueRes.rows[0].total || 0), 
            totalOrders: parseInt(ordersRes.rows[0].count),
            lowStockCount: parseInt(lowStockRes.rows[0].count),
            activeSkus: parseInt(productsRes.rows[0].count)
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
});

// --- 2. EXISTING ROUTES ---
router.get('/analytics/demand-forecast', async (req, res) => {
    try {
        const result = await query(`
            SELECT df.product_id, p.name, df.forecast_date, df.predicted_demand
            FROM demand_forecast df
            JOIN products p ON df.product_id = p.product_id
            ORDER BY df.forecast_date ASC LIMIT 50;
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch forecast." });
    }
});

router.post('/ai/trigger-forecast', async (req, res) => {
    try {
        const productRes = await query(`SELECT product_id FROM products LIMIT 50`);
        const productIds = productRes.rows.map(row => row.product_id);
        const forecastData = await getDemandForecast(productIds, 30);
        res.json({ message: "Success", count: forecastData.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;