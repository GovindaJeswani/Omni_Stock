// D:\Adbms\omnistock\server\src\services\orderService.js

const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * 🎯 CORE ADB DEMO FUNCTION
 * Simulates a 'Buy Now' transaction with explicit ACID control and Row-Level Locking.
 * This function is designed to prevent race conditions (negative stock, double-selling).
 * * @param {string} productId - The ID of the product being purchased.
 * @param {number} requestedQuantity - The amount the customer wants to buy.
 * @param {string} customerEmail - Customer identifier.
 * @returns {object} Transaction result.
 */
async function processOrderTransaction(productId, requestedQuantity, customerEmail) {
    // 1. Get a client connection from the pool
    // We must use a dedicated client for a multi-step transaction
    const client = await pool.connect(); 
    let orderResult = null;
    const orderId = uuidv4();

    try {
        // --- START TRANSACTION ---
        await client.query('BEGIN');
        
        console.log(`[Order ${orderId}] Transaction started.`);
        
        // 2. ROW-LEVEL LOCKING (SELECT FOR UPDATE)
        // This locks the specific row in the 'inventory' table corresponding to the product.
        // Any other concurrent transaction trying to read/update this row will wait until COMMIT/ROLLBACK.
        const inventoryQuery = `
            SELECT quantity, warehouse_id 
            FROM inventory 
            WHERE product_id = $1 
            ORDER BY quantity DESC -- Prioritize the warehouse with most stock
            LIMIT 1
            FOR UPDATE;
        `;
        const inventoryRes = await client.query(inventoryQuery, [productId]);

        if (inventoryRes.rows.length === 0) {
            throw new Error('Product not found in inventory.');
        }

        const { quantity: currentStock, warehouse_id } = inventoryRes.rows[0];

        // 3. CONCURRENCY CHECK
        if (currentStock < requestedQuantity) {
            // Rollback is necessary if the check fails
            await client.query('ROLLBACK');
            throw new Error(`Insufficient stock. Available: ${currentStock}, Requested: ${requestedQuantity}.`);
        }

        // 4. UPDATE INVENTORY (The D-Durable step)
        const newStock = currentStock - requestedQuantity;
        const inventoryUpdateQuery = `
            UPDATE inventory 
            SET quantity = $1, last_updated = NOW() 
            WHERE product_id = $2 AND warehouse_id = $3;
        `;
        await client.query(inventoryUpdateQuery, [newStock, productId, warehouse_id]);

        // 5. FETCH PRICE (Isolation Check)
        // Ensure price is read consistently within this transaction block
        const priceRes = await client.query('SELECT price FROM products WHERE product_id = $1', [productId]);
        const unitPrice = priceRes.rows[0].price;
        const totalAmount = unitPrice * requestedQuantity;
        
        // 6. CREATE ORDER RECORD
        const orderDate = new Date().toISOString();
        const orderQuery = `
            INSERT INTO orders (order_id, customer_email, total_amount, status, created_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING order_id, total_amount, created_at;
        `;
        orderResult = await client.query(orderQuery, [orderId, customerEmail, totalAmount, 'CONFIRMED', orderDate]);
        
        // 7. CREATE ORDER ITEM RECORD
        const orderItemQuery = `
            INSERT INTO order_items (order_id, order_created_at, product_id, quantity, unit_price)
            VALUES ($1, $2, $3, $4, $5);
        `;
        await client.query(orderItemQuery, [orderId, orderDate, productId, requestedQuantity, unitPrice]);
        
        // --- COMMIT TRANSACTION --- (Atomicity & Isolation)
        await client.query('COMMIT');
        console.log(`[Order ${orderId}] Transaction committed successfully. Stock remaining: ${newStock}`);

        return {
            success: true,
            message: 'Order processed successfully.',
            order: orderResult.rows[0],
            new_stock: newStock
        };

    } catch (error) {
        // --- ROLLBACK TRANSACTION --- (Atomicity)
        try {
            await client.query('ROLLBACK');
            console.error(`[Order ${orderId}] Transaction rolled back due to error: ${error.message}`);
        } catch (rollbackError) {
            console.error('Error during transaction rollback:', rollbackError);
        }
        
        throw { 
            success: false, 
            message: error.message, 
            code: 'TRANSACTION_FAILED' 
        };

    } finally {
        // 8. RELEASE CLIENT
        // Crucial step: Return the client back to the pool to prevent resource leaks
        client.release(); 
    }
}

module.exports = {
    processOrderTransaction,
};