-- add_low_stock_items.sql

-- 1. Insert 10 Low-Stock Special Items
INSERT INTO products (name, description, category, price, cost_price, image_url, supplier_id)
VALUES
('🔥 Flash Sale: RTX 4090 Card', 'Limited stock graphic card.', 'Electronics', 1500, 1200, 'https://source.unsplash.com/seed/rtx4090/600x400/?graphics-card,gpu', (SELECT supplier_id FROM suppliers LIMIT 1)),
('🔥 Limited Ed. Sneakers', 'Rare collector sneakers.', 'Fashion', 250, 100, 'https://source.unsplash.com/seed/sneakers/600x400/?sneakers,fashion', (SELECT supplier_id FROM suppliers LIMIT 1)),
('🔥 PS5 Pro Console', 'Next-gen console.', 'Electronics', 499, 450, 'https://source.unsplash.com/seed/ps5pro/600x400/?ps5,gaming', (SELECT supplier_id FROM suppliers LIMIT 1)),
('🔥 Concert Ticket: VIP', 'Front row seats.', 'Home & Living', 300, 50, 'https://source.unsplash.com/seed/vipconcert/600x400/?concert,ticket', (SELECT supplier_id FROM suppliers LIMIT 1)),
('🔥 Developer Laptop Special', 'High specs laptop.', 'Electronics', 999, 800, 'https://source.unsplash.com/seed/devlaptop/600x400/?laptop,developer', (SELECT supplier_id FROM suppliers LIMIT 1)),
('🔥 1g Gold Bar', 'Pure gold.', 'Home & Living', 65, 60, 'https://source.unsplash.com/seed/goldbar/600x400/?gold,investment', (SELECT supplier_id FROM suppliers LIMIT 1)),
('🔥 Signed Jersey', 'Authentic jersey.', 'Fashion', 120, 40, 'https://source.unsplash.com/seed/jersey/600x400/?jersey,sports', (SELECT supplier_id FROM suppliers LIMIT 1)),
('🔥 Drone FlyMore Kit', 'Camera drone.', 'Electronics', 850, 600, 'https://source.unsplash.com/seed/drone/600x400/?drone,photography', (SELECT supplier_id FROM suppliers LIMIT 1)),
('🔥 Retro Arcade Cabinet', 'Full arcade.', 'Electronics', 1200, 900, 'https://source.unsplash.com/seed/arcade/600x400/?arcade,retro', (SELECT supplier_id FROM suppliers LIMIT 1)),
('🔥 Designer Handbag', 'Luxury bag.', 'Fashion', 2200, 1500, 'https://source.unsplash.com/seed/handbag/600x400/?handbag,luxury', (SELECT supplier_id FROM suppliers LIMIT 1));

-- 2. Give them stock between 3–8
UPDATE inventory
SET quantity = floor(random() * 6 + 3)::int
WHERE product_id IN (SELECT product_id FROM products WHERE name LIKE '🔥%');

-- 3. Verify
SELECT p.name, i.quantity
FROM products p
JOIN inventory i ON p.product_id = i.product_id
WHERE p.name LIKE '🔥%';
