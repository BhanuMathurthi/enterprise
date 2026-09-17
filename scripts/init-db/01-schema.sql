-- Enterprise User Management PostgreSQL Schema
-- Table: enterprise_users

CREATE TABLE IF NOT EXISTS enterprise_users (
    id VARCHAR(64) PRIMARY KEY,
    external_identity_id VARCHAR(128) UNIQUE,
    username VARCHAR(128) NOT NULL UNIQUE,
    email VARCHAR(256) NOT NULL UNIQUE,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    date_of_birth VARCHAR(32),
    phone_number VARCHAR(64),
    status VARCHAR(32) NOT NULL,
    
    -- Address Fields
    street VARCHAR(256),
    city VARCHAR(128),
    state VARCHAR(64),
    zip_code VARCHAR(32),
    country VARCHAR(64),
    
    -- Enterprise Attributes
    department VARCHAR(128),
    employee_id VARCHAR(64),
    preferred_language VARCHAR(16) DEFAULT 'en',
    newsletter_opt_in BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON enterprise_users (email);
CREATE INDEX IF NOT EXISTS idx_users_username ON enterprise_users (username);
CREATE INDEX IF NOT EXISTS idx_users_status ON enterprise_users (status);
CREATE INDEX IF NOT EXISTS idx_users_external_id ON enterprise_users (external_identity_id);
CREATE INDEX IF NOT EXISTS idx_users_department ON enterprise_users (department);
