-- Wellness SaaS Database Schema
-- For tracking real business metrics and optimization history

CREATE DATABASE IF NOT EXISTS wellness_saas;
USE wellness_saas;

-- User funnel tracking
CREATE TABLE user_funnel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    visitor_ip VARCHAR(45),
    source VARCHAR(100),
    medium VARCHAR(100),
    campaign VARCHAR(100),
    landing_page VARCHAR(255),
    signed_up BOOLEAN DEFAULT FALSE,
    converted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session (session_id),
    INDEX idx_created_at (created_at),
    INDEX idx_source (source)
);

-- Subscription tracking
CREATE TABLE subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    user_id INT,
    plan_name VARCHAR(100),
    status ENUM('active', 'canceled', 'past_due', 'unpaid') DEFAULT 'active',
    amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    canceled_at TIMESTAMP NULL,
    INDEX idx_stripe_id (stripe_subscription_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Pricing tiers
CREATE TABLE pricing_tiers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tier_name VARCHAR(100) UNIQUE,
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    interval VARCHAR(20) DEFAULT 'month',
    features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pricing change history
CREATE TABLE pricing_changes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tier_name VARCHAR(100),
    old_price DECIMAL(10,2),
    new_price DECIMAL(10,2),
    reason TEXT,
    implemented BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    implemented_at TIMESTAMP NULL,
    INDEX idx_tier (tier_name),
    INDEX idx_created_at (created_at)
);

-- Conversion events
CREATE TABLE conversion_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    event_type ENUM('page_view', 'signup', 'trial_start', 'conversion', 'churn'),
    event_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at)
);

-- Agent performance tracking
CREATE TABLE agent_performance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    agent_name VARCHAR(100),
    action_name VARCHAR(100),
    status ENUM('success', 'failed', 'partial'),
    execution_time_ms INT,
    result_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_agent (agent_name),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Business metrics snapshot
CREATE TABLE metrics_snapshot (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    conversion_rate DECIMAL(5,4),
    revenue_per_visitor DECIMAL(10,2),
    churn_rate DECIMAL(5,4),
    monthly_revenue DECIMAL(10,2),
    total_subscriptions INT,
    total_visitors INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (date),
    INDEX idx_date (date)
);

-- Insert default pricing tiers
INSERT INTO pricing_tiers (tier_name, price, features) VALUES
('basic', 29.99, '["Core wellness features", "Basic analytics", "Email support"]'),
('pro', 49.99, '["Advanced features", "Priority support", "Custom integrations"]'),
('enterprise', 99.99, '["Full feature set", "Dedicated support", "Custom development"]');

-- Create logs directory for Winston
-- This will be created by the application 