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
