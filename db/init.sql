CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Temporary & Converted Credit Assessments
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token_hash VARCHAR(255) NOT NULL,
    statement_sha256 VARCHAR(64) NOT NULL,
    statement_period_days INT NOT NULL,
    avg_monthly_inflow NUMERIC(14, 2) NOT NULL,
    avg_monthly_outflow NUMERIC(14, 2) NOT NULL,
    avg_monthly_net_cashflow NUMERIC(14, 2) NOT NULL,
    multiplier NUMERIC(3, 1) NOT NULL DEFAULT 0.0,
    max_qualified_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    qualification_status VARCHAR(30) NOT NULL CHECK (qualification_status IN ('QUALIFIED', 'MANUAL_REVIEW', 'NOT_QUALIFIED', 'TAMPERED_REJECTED')),
    monthly_breakdown JSONB NOT NULL,
    risk_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
    decline_reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_converted BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Submitted ISP Loan Applications
CREATE TABLE loan_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code VARCHAR(20) UNIQUE NOT NULL,
    assessment_id UUID UNIQUE NOT NULL REFERENCES assessments(id) ON DELETE RESTRICT,
    isp_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    email VARCHAR(255),
    location VARCHAR(120) NOT NULL,
    kra_pin VARCHAR(50) NOT NULL,
    paybill_or_till VARCHAR(50),
    subscriber_band VARCHAR(50) NOT NULL,
    requested_amount NUMERIC(14, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'APPROVED', 'REJECTED')),
    customer_care_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assessments_expires_at ON assessments(expires_at) WHERE is_converted = FALSE;
CREATE INDEX idx_applications_status ON loan_applications(status);
CREATE INDEX idx_applications_ref ON loan_applications(reference_code);
CREATE INDEX idx_assessments_session ON assessments(session_token_hash);

-- 3. Growth console applications (infrastructure + billing finance)
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
