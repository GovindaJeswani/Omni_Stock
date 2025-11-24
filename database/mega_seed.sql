-- mega_seed.sql

-- 1. Clean All Data (Cascade)
TRUNCATE TABLE demand_forecast, price_history, order_items, orders, inventory, products, suppliers RESTART IDENTITY CASCADE;

-- 2. Create Suppliers
INSERT INTO suppliers (name, contact_email) VALUES 
('Global Tech', 'sales@globaltech.com'),
('Fashion Forward', 'supply@fashion.com'),
('Home Depot', 'contact@homedepot.com');

-- 3. Insert 5000 Products (Stable Unsplash Images)
INSERT INTO products (name, description, category, price, cost_price, image_url, supplier_id)
SELECT 
    CASE (i % 5)
        WHEN 0 THEN 'TechDevice Pro ' || i
        WHEN 1 THEN 'Urban Wear Item ' || i
        WHEN 2 THEN 'Modern Home Decor ' || i
        WHEN 3 THEN 'Smart Gadget X ' || i
        ELSE 'Office Essential ' || i
    END,
    'Premium quality item. Batch ' || i,
    CASE (i % 5)
        WHEN 0 THEN 'Electronics'
        WHEN 1 THEN 'Fashion'
        WHEN 2 THEN 'Home & Living'
        WHEN 3 THEN 'Electronics'
        ELSE 'Office Supplies'
    END,
    (random() * 200 + 20)::numeric(10,2),
    (random() * 80 + 10)::numeric(10,2),

    -- 🔥 STABLE UNSPLASH IMAGE SEED
    'https://source.unsplash.com/seed/' || i || '/600x400/?' ||
    CASE (i % 5)
        WHEN 0 THEN 'electronics,tech,gadget'
        WHEN 1 THEN 'fashion,clothes,apparel'
        WHEN 2 THEN 'home,interior,decor'
        WHEN 3 THEN 'electronics,smart'
        ELSE 'office,workspace,supplies'
    END,

    -- Supplier random assignment
    (SELECT supplier_id FROM suppliers ORDER BY random() LIMIT 1)

FROM generate_series(1, 5000) AS s(i);

-- 4. Inventory (Random 10–200 Stock)
INSERT INTO inventory (product_id, warehouse_id, quantity)
SELECT product_id,
       (SELECT warehouse_id FROM warehouses LIMIT 1),
       (random() * 190 + 10)::int
FROM products;

-- 5. Generate 500 Orders
INSERT INTO orders (order_id, customer_email, total_amount, status, created_at)
SELECT 
    uuid_generate_v4(),
    'user' || i || '@test.com',
    (random() * 2000 + 100)::numeric(10,2),
    'CONFIRMED',
    NOW() - (random() * 30 || ' days')::interval
FROM generate_series(1, 500);

SELECT 'Database seeded successfully: 5000 products + 500 orders' AS status;
