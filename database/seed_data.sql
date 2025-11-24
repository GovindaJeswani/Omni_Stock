-- D:\Adbms\omnistock\database\seed_data.sql

-- 1. Suppliers (5 Records)
INSERT INTO suppliers (name, contact_email, reliability_score) VALUES
('TechGlobal Distributors', 'contact@techglobal.com', 0.95),
('Office Essentials Co.', 'sales@officeessentials.com', 0.88),
('Digital Gadgets Inc.', 'support@digitalgadgets.com', 0.99),
('EcoHome Goods Ltd.', 'info@ecohome.com', 0.75),
('Luxury Retail Partners', 'partners@luxuryretail.com', 0.92);

-- 2. Warehouses (3 Records)
INSERT INTO warehouses (location, capacity, manager_name) VALUES
('San Francisco - West Coast Hub', 100000, 'Alice Johnson'),
('Dallas - Central US Depot', 150000, 'Bob Smith'),
('New York - East Coast Terminal', 80000, 'Charlie Brown');

-- Store the IDs for later use in products and inventory
SELECT supplier_id, name INTO TEMP supplier_ids FROM suppliers;
SELECT warehouse_id, location INTO TEMP warehouse_ids FROM warehouses;


-- 3. Products (50 Records)
INSERT INTO products (name, description, category, price, cost_price, supplier_id, reorder_level)
SELECT
    'Product ' || s.i,
    'High-quality, durable ' || CASE WHEN s.i % 5 = 0 THEN 'Electronics' WHEN s.i % 5 = 1 THEN 'Furniture' ELSE 'Office Supplies' END || ' item.',
    CASE
        WHEN s.i % 5 = 0 THEN 'Electronics'
        WHEN s.i % 5 = 1 THEN 'Home & Kitchen'
        WHEN s.i % 5 = 2 THEN 'Office Supplies'
        WHEN s.i % 5 = 3 THEN 'Apparel'
        ELSE 'Health & Beauty'
    END,
    ROUND(CAST(random() * 900 + 10 AS NUMERIC), 2), -- Price between 10 and 910
    ROUND(CAST(random() * 200 + 5 AS NUMERIC), 2), -- Cost price
    (SELECT supplier_id FROM supplier_ids ORDER BY random() LIMIT 1),
    CASE WHEN random() < 0.2 THEN 50 ELSE 10 END -- 20% high reorder level
FROM generate_series(1, 50) AS s(i);

-- Store Product IDs for Order Items
SELECT product_id, price, cost_price INTO TEMP product_ids FROM products;



-- 4. Inventory (150 Records = 50 Products * 3 Warehouses)
INSERT INTO inventory (product_id, warehouse_id, quantity, last_updated)
SELECT
    p.product_id,
    w.warehouse_id,
    FLOOR(random() * 500 + 50)::INT, -- Quantity between 50 and 550
    NOW() - (INTERVAL '1 day' * FLOOR(random() * 30))
FROM
    products p
CROSS JOIN
    warehouses w;


	-- 5. Orders (10,000 Records)
-- Generating orders over 25 months (2024-2025 range for partitions)
INSERT INTO orders (order_id, customer_email, total_amount, status, created_at)
SELECT
    uuid_generate_v4(),
    'customer' || s.i || '@example.com',
    0.00, -- Placeholder, will update later
    CASE
        WHEN random() < 0.95 THEN 'CONFIRMED' -- 95% confirmed
        WHEN random() < 0.03 THEN 'PENDING'
        ELSE 'CANCELLED'
    END,
    NOW() - (INTERVAL '1 month' * FLOOR(random() * 25)) - (INTERVAL '1 day' * FLOOR(random() * 30)) - (INTERVAL '1 hour' * FLOOR(random() * 23)) -- Distribute over 25 months
FROM generate_series(1, 10000) AS s(i);

-- Store Order IDs and their partition key (created_at) for order_items FK
SELECT order_id, created_at INTO TEMP order_info FROM orders;


-- 6. Order Items (Approx 50,000 Records)
-- Loop through 10,000 orders and create 1-10 items per order
DO $$
DECLARE
    order_rec RECORD;
    num_items INT;
    item_counter INT;
    product_rec RECORD;
BEGIN
    FOR order_rec IN SELECT order_id, created_at FROM order_info
    LOOP
        num_items := FLOOR(random() * 10) + 1; -- 1 to 10 items per order
        
        FOR item_counter IN 1..num_items
        LOOP
            -- Select a random product
            SELECT product_id, price INTO product_rec FROM product_ids ORDER BY random() LIMIT 1;

            -- Insert the item
            INSERT INTO order_items (order_id, order_created_at, product_id, quantity, unit_price)
            VALUES (
                order_rec.order_id,
                order_rec.created_at,
                product_rec.product_id,
                FLOOR(random() * 5) + 1, -- Quantity 1 to 5
                product_rec.price
            );
        END LOOP;
    END LOOP;
END $$;


-- 7. Update total_amount in Orders
-- Important: Recalculate total amount from order_items
UPDATE orders o
SET total_amount = sub.calculated_total
FROM (
    SELECT
        order_id,
        SUM(quantity * unit_price) AS calculated_total
    FROM order_items
    GROUP BY order_id
) AS sub
WHERE o.order_id = sub.order_id;


-- 8. Cleanup Temp Tables
DROP TABLE supplier_ids;
DROP TABLE warehouse_ids;
DROP TABLE product_ids;
DROP TABLE order_info;

-- 9. Verification
SELECT 'Seed Data Insertion Complete' AS status,
       (SELECT COUNT(*) FROM products) AS products_count,
       (SELECT COUNT(*) FROM orders) AS orders_count,
       (SELECT COUNT(*) FROM order_items) AS order_items_count;