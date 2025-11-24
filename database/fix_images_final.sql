-- D:\Adbms\omnistock\database\fix_images_final.sql

UPDATE products
SET image_url = CASE 
    WHEN category = 'Electronics' THEN 
        CASE (floor(random() * 5)::int)
            WHEN 0 THEN 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80' -- Laptop
            WHEN 1 THEN 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' -- Headphone
            WHEN 2 THEN 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80' -- Monitor
            WHEN 3 THEN 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80' -- Watch
            ELSE 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80' -- Keyboard
        END
    WHEN category = 'Fashion' THEN 
        CASE (floor(random() * 4)::int)
            WHEN 0 THEN 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80' -- Shirt
            WHEN 1 THEN 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' -- Shoe
            WHEN 2 THEN 'https://images.unsplash.com/photo-1551028919-ac66e6a39d44?auto=format&fit=crop&w=600&q=80' -- Jacket
            ELSE 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80' -- Bag
        END
    WHEN category = 'Home & Living' THEN
        CASE (floor(random() * 3)::int)
            WHEN 0 THEN 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80' -- Sofa
            WHEN 1 THEN 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80' -- Chair
            ELSE 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80' -- Decor
        END
    ELSE 
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80' -- Office/General
END;