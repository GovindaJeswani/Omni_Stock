-- 03_schema_logs.sql
-- Audit Logs and System Alerts

-- 1. AUDIT LOGS (Partitioned by LIST - Log Level or Range - Date)
-- Let's use RANGE by date again as it's most common for cleanup policies.
CREATE TABLE audit_logs (
    log_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    action_type VARCHAR(50) NOT NULL, -- 'ORDER_PLACED', 'STOCK_UPDATE', 'PRICE_CHANGE'
    table_name VARCHAR(50),
    record_id UUID,
    old_value JSONB, -- Using JSONB for flexible schema (Postgres Feature)
    new_value JSONB,
    performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (log_id, performed_at)
) PARTITION BY RANGE (performed_at);

CREATE TABLE audit_logs_2024 PARTITION OF audit_logs
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
    
CREATE TABLE audit_logs_default PARTITION OF audit_logs DEFAULT;

-- 2. PRICE HISTORY (For Dynamic Pricing ML Training)
CREATE TABLE price_history (
    history_id SERIAL PRIMARY KEY,
    product_id UUID REFERENCES products(product_id),
    old_price DECIMAL(10,2),
    new_price DECIMAL(10,2),
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    reason VARCHAR(100) -- 'MANUAL', 'AI_DYNAMIC_PRICING', 'PROMO'
);

-- 3. SYSTEM ALERTS
CREATE TABLE system_alerts (
    alert_id SERIAL PRIMARY KEY,
    alert_type VARCHAR(50), -- 'LOW_STOCK', 'ANOMALY_DETECTED'
    message TEXT,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);