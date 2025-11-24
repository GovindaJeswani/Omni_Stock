-- 01_schema_core.sql
-- Core Reference Tables

-- 1. SUPPLIERS
CREATE TABLE suppliers (
    supplier_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100) UNIQUE NOT NULL,
    reliability_score DECIMAL(3,2) DEFAULT 1.00 CHECK (reliability_score BETWEEN 0 AND 1),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS
CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    cost_price DECIMAL(10,2) NOT NULL CHECK (cost_price >= 0), -- For profit calc
    supplier_id UUID REFERENCES suppliers(supplier_id),
    reorder_level INT DEFAULT 10, -- Threshold for alerts
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WAREHOUSES
CREATE TABLE warehouses (
    warehouse_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    manager_name VARCHAR(100)
);

-- 4. INVENTORY (The critical table for locking)
-- We separate inventory from products because 1 product can be in multiple warehouses
CREATE TABLE inventory (
    inventory_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
    warehouse_id UUID REFERENCES warehouses(warehouse_id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraint: A product can only appear once per warehouse
    UNIQUE(product_id, warehouse_id)
);