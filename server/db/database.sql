-- This script will set up the initial database schema for the Real Estate Portfolio Management Suite.

-- Properties Table: Stores all details about a property.
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    property_type VARCHAR(50),
    purchase_price NUMERIC(12, 2),
    bedrooms INTEGER,
    bathrooms NUMERIC(4, 1),
    square_feet INTEGER,
    year_built INTEGER,
    lot_size INTEGER,
    units INTEGER DEFAULT 1,
    down_payment_percent NUMERIC(5, 2),
    interest_rate NUMERIC(5, 3),
    loan_term INTEGER,
    rental_income NUMERIC(10, 2),
    other_income NUMERIC(10, 2),
    closing_costs NUMERIC(10, 2),
    repair_costs NUMERIC(10, 2),
    appreciation_rate NUMERIC(5, 2),
    rent_increase_rate NUMERIC(5, 2),
    property_tax NUMERIC(10, 2),
    insurance NUMERIC(10, 2),
    hoa_fees NUMERIC(10, 2),
    maintenance_rate NUMERIC(5, 2),
    vacancy_rate NUMERIC(5, 2),
    management_rate NUMERIC(5, 2),
    utilities NUMERIC(10, 2),
    capex_rate NUMERIC(5, 2),
    other_expenses NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tenants Table: Stores information about tenants.
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone_number VARCHAR(20),
    move_in_date DATE,
    move_out_date DATE,
    communication_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Leases Table: Manages lease agreements, linking tenants to properties.
CREATE TABLE leases (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    tenant_id INTEGER REFERENCES tenants(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent_amount NUMERIC(10, 2) NOT NULL,
    security_deposit NUMERIC(10, 2),
    lease_document_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Financial Transactions Table: Tracks all income and expenses for each property.
CREATE TABLE financial_transactions (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- 'income' or 'expense'
    category VARCHAR(100) NOT NULL, -- e.g., 'Rent', 'Mortgage', 'Repairs', 'Insurance'
    description TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Document Storage Table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100), -- e.g., 'Deed', 'Inspection Report', 'Insurance Policy'
    file_url VARCHAR(255) NOT NULL,
    upload_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add some indexes for better performance on foreign keys and frequently queried columns.
CREATE INDEX idx_leases_property_id ON leases(property_id);
CREATE INDEX idx_leases_tenant_id ON leases(tenant_id);
CREATE INDEX idx_financial_transactions_property_id ON financial_transactions(property_id);
CREATE INDEX idx_documents_property_id ON documents(property_id);
CREATE INDEX idx_financial_transactions_date ON financial_transactions(transaction_date);

-- Extend existing tables and add new tables for expanded functionality

-- Add additional address and geo fields to properties
ALTER TABLE properties
    ADD COLUMN IF NOT EXISTS city VARCHAR(100),
    ADD COLUMN IF NOT EXISTS state VARCHAR(100),
    ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20),
    ADD COLUMN IF NOT EXISTS country VARCHAR(100),
    ADD COLUMN IF NOT EXISTS latitude NUMERIC(9, 6),
    ADD COLUMN IF NOT EXISTS longitude NUMERIC(9, 6),
    ADD COLUMN IF NOT EXISTS photo_url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS purchase_date DATE;

-- Units within a multi-unit property
CREATE TABLE IF NOT EXISTS property_units (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    unit_label VARCHAR(50) NOT NULL,
    bedrooms INTEGER,
    bathrooms NUMERIC(4, 1),
    square_feet INTEGER,
    market_rent NUMERIC(10, 2),
    current_rent NUMERIC(10, 2),
    occupied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_property_units_property_id ON property_units(property_id);

-- Link leases to specific units when applicable
ALTER TABLE leases
    ADD COLUMN IF NOT EXISTS unit_id INTEGER REFERENCES property_units(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_leases_unit_id ON leases(unit_id);

-- Loans & mortgages per property
CREATE TABLE IF NOT EXISTS loans (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    lender_name VARCHAR(255),
    loan_type VARCHAR(50),
    interest_rate NUMERIC(5, 3),
    origination_date DATE,
    term_months INTEGER,
    original_balance NUMERIC(12, 2),
    current_balance NUMERIC(12, 2),
    escrow_monthly NUMERIC(10, 2),
    monthly_payment NUMERIC(10, 2),
    extra_payment NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_loans_property_id ON loans(property_id);

-- Rent roll & payment tracking
CREATE TABLE IF NOT EXISTS rent_payments (
    id SERIAL PRIMARY KEY,
    lease_id INTEGER REFERENCES leases(id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    unit_id INTEGER REFERENCES property_units(id) ON DELETE SET NULL,
    tenant_id INTEGER REFERENCES tenants(id) ON DELETE SET NULL,
    due_date DATE NOT NULL,
    amount_due NUMERIC(10, 2) NOT NULL,
    amount_paid NUMERIC(10, 2),
    paid_date DATE,
    status VARCHAR(20) NOT NULL, -- e.g., 'paid', 'partial', 'late', 'unpaid'
    late_fee_amount NUMERIC(10, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_rent_payments_due_date ON rent_payments(due_date);
CREATE INDEX IF NOT EXISTS idx_rent_payments_lease_id ON rent_payments(lease_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_property_id ON rent_payments(property_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_tenant_id ON rent_payments(tenant_id);

-- System alerts/reminders (e.g., lease expiry, rent due)
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- 'lease', 'payment', 'property', etc.
    entity_id INTEGER NOT NULL,
    reminder_type VARCHAR(50) NOT NULL, -- 'lease_expiry', 'rent_due'
    remind_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'dismissed'
    channel VARCHAR(20), -- 'email', 'sms', 'web'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_alerts_remind_at ON alerts(remind_at);

-- Property valuations time series for portfolio value estimates
CREATE TABLE IF NOT EXISTS property_valuations (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    valuation_date DATE NOT NULL,
    estimated_value NUMERIC(12, 2) NOT NULL,
    source VARCHAR(100), -- 'manual', 'zillow', 'appraisal'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_property_valuations_property_date ON property_valuations(property_id, valuation_date);

-- Deal pipeline for acquisitions
CREATE TABLE IF NOT EXISTS deals (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    source VARCHAR(100), -- 'MLS', 'Zillow', 'Off-market', etc.
    status VARCHAR(50) NOT NULL DEFAULT 'Lead', -- 'Lead', 'Analyzing', 'Offer Made', 'Under Contract', 'Closed', 'Lost'
    notes TEXT,
    mls_id VARCHAR(100),
    zillow_url VARCHAR(255),
    list_price NUMERIC(12, 2),
    arv NUMERIC(12, 2),
    rehab_estimate NUMERIC(12, 2),
    closing_costs_estimate NUMERIC(12, 2),
    purchase_costs_estimate NUMERIC(12, 2),
    expected_rent NUMERIC(10, 2),
    holding_costs_estimate NUMERIC(12, 2),
    property_type VARCHAR(50),
    bedrooms INTEGER,
    bathrooms NUMERIC(4, 1),
    square_feet INTEGER,
    lot_size INTEGER,
    year_built INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    agent_name VARCHAR(255),
    agent_email VARCHAR(255),
    agent_phone VARCHAR(50)
);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at);

-- Communications log per tenant/property/lease
CREATE TABLE IF NOT EXISTS communications (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id) ON DELETE SET NULL,
    property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    lease_id INTEGER REFERENCES leases(id) ON DELETE SET NULL,
    channel VARCHAR(20), -- 'email', 'sms', 'phone', 'note'
    subject VARCHAR(255),
    body TEXT,
    communication_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_communications_tenant_id ON communications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_communications_property_id ON communications(property_id);

-- Extend documents to be attachable to tenants and leases as well
ALTER TABLE documents
    ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS lease_id INTEGER REFERENCES leases(id) ON DELETE SET NULL;
