-- Contenido para: src/main/resources/db/migration/master/V1__create_tenant_management.sql

CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(50) UNIQUE NOT NULL,
    db_name VARCHAR(50) UNIQUE NOT NULL,
    db_user VARCHAR(50) NOT NULL,
    db_password VARCHAR(100) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    subscription_plan VARCHAR(50) NOT NULL,
    subscription_start_date DATE NOT NULL,
    subscription_end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);
