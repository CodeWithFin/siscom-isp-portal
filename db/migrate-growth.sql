-- Idempotent migration for existing deployments
CREATE TABLE IF NOT EXISTS growth_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code VARCHAR(32) UNIQUE NOT NULL,
    kind VARCHAR(40) NOT NULL CHECK (kind IN ('INFRASTRUCTURE', 'BILLING_FINANCE')),
    status VARCHAR(30) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'APPROVED', 'REJECTED')),
    isp_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(120) NOT NULL,
    ca_licence VARCHAR(120) NOT NULL,
    county VARCHAR(80) NOT NULL,
    active_subscribers INT NOT NULL,
    arpu NUMERIC(14, 2) NOT NULL,
    billing_system VARCHAR(120) NOT NULL,
    payment_channels VARCHAR(120) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    notes TEXT,
    monthly_collections NUMERIC(14, 2) NOT NULL DEFAULT 0,
    indicative_limit NUMERIC(14, 2) NOT NULL DEFAULT 0,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    financing JSONB,
    access_finance BOOLEAN NOT NULL DEFAULT FALSE,
    consent JSONB NOT NULL,
    customer_care_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_growth_applications_status ON growth_applications(status);
CREATE INDEX IF NOT EXISTS idx_growth_applications_ref ON growth_applications(reference_code);
CREATE INDEX IF NOT EXISTS idx_growth_applications_created ON growth_applications(created_at DESC);
