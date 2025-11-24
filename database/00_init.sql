-- 00_init.sql
-- Setup Database and Extensions

-- Enable UUID extension for unique identifiers (Better than Serial Ints for security)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Tablefunc for Pivot tables (Useful for analytics later)
CREATE EXTENSION IF NOT EXISTS tablefunc;

-- Set timezone
SET timezone = 'UTC';