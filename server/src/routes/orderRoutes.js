// D:\Adbms\omnistock\server\src\routes\orderRoutes.js

const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');

// POST /api/v1/orders/buy
// Endpoint for the critical concurrency demo
router.post('/buy', async (req, res) => {
    const { productId, quantity, customerEmail } = req.body;

    if (!productId || !quantity || !customerEmail) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    try {
        const result = await orderService.processOrderTransaction(
            productId, 
            parseInt(quantity), 
            customerEmail
        );

        // The transaction successfully committed
        res.status(201).json({
            success: true,
            message: result.message,
            order: result.order,
            new_stock: result.new_stock,
            demo_status: "Transaction Committed with Row Lock"
        });

    } catch (error) {
        // The transaction was rolled back or failed before COMMIT
        res.status(409).json({ // 409 Conflict is appropriate for concurrency/stock issues
            success: false,
            message: error.message,
            demo_status: "Transaction Failed (Rolled Back)",
            code: error.code
        });
    }
});

module.exports = router;