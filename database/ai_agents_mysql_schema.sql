-- AI Agents MySQL Database Schema
-- Created for Chudi's Micro SaaS Apps - Wellness Agent System

-- Drop database if exists and create new one
DROP DATABASE IF EXISTS ai_agents_db;
CREATE DATABASE ai_agents_db;
USE ai_agents_db;

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- CORE AGENT TABLES
-- =====================================================

-- Agents table - stores information about each AI agent
CREATE TABLE agents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    class_name VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive', 'maintenance', 'error') DEFAULT 'active',
    version VARCHAR(20) DEFAULT '1.0.0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_execution TIMESTAMP NULL,
    config JSON,
    INDEX idx_agent_name (name),
    INDEX idx_agent_status (status)
);

-- Agent states table - tracks current state of each agent
CREATE TABLE agent_states (
    id INT PRIMARY KEY AUTO_INCREMENT,
    agent_id INT NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    state_data JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    INDEX idx_agent_state (agent_id, state_name),
    INDEX idx_active_states (is_active)
);

-- =====================================================
-- ACTION AND EXECUTION TABLES
-- =====================================================

-- Actions table - defines available actions for each agent
CREATE TABLE actions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    agent_id INT NOT NULL,
    action_name VARCHAR(100) NOT NULL,
    description TEXT,
    parameters JSON,
    expected_duration INT DEFAULT 30, -- in seconds
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    UNIQUE KEY unique_agent_action (agent_id, action_name),
    INDEX idx_agent_actions (agent_id),
    INDEX idx_enabled_actions (is_enabled)
);

-- Action executions table - logs all action executions
CREATE TABLE action_executions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    agent_id INT NOT NULL,
    action_id INT NOT NULL,
    execution_id VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'running', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    input_data JSON,
    output_data JSON,
    error_message TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    duration_ms INT NULL,
    cycle_number INT NULL,
    orchestrator_session_id VARCHAR(50) NULL,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    FOREIGN KEY (action_id) REFERENCES actions(id) ON DELETE CASCADE,
    INDEX idx_execution_status (status),
    INDEX idx_execution_timing (started_at, completed_at),
    INDEX idx_agent_executions (agent_id),
    INDEX idx_cycle_executions (cycle_number),
    INDEX idx_session_executions (orchestrator_session_id)
);

-- =====================================================
-- PERFORMANCE AND METRICS TABLES
-- =====================================================

-- Performance metrics table - tracks agent performance over time
CREATE TABLE performance_metrics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    agent_id INT NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,4) NOT NULL,
    metric_unit VARCHAR(20),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cycle_number INT NULL,
    context JSON,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    INDEX idx_agent_metrics (agent_id, metric_name),
    INDEX idx_metric_timing (recorded_at),
    INDEX idx_cycle_metrics (cycle_number)
);

-- Agent performance summary table - aggregated performance data
CREATE TABLE agent_performance_summary (
    id INT PRIMARY KEY AUTO_INCREMENT,
    agent_id INT NOT NULL,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    total_actions INT DEFAULT 0,
    successful_actions INT DEFAULT 0,
    failed_actions INT DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    avg_execution_time_ms DECIMAL(10,2) DEFAULT 0.00,
    total_rewards DECIMAL(10,4) DEFAULT 0.00,
    avg_reward DECIMAL(10,4) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    UNIQUE KEY unique_agent_period (agent_id, period_start, period_end),
    INDEX idx_performance_period (period_start, period_end),
    INDEX idx_agent_performance (agent_id)
);

-- =====================================================
-- REINFORCEMENT LEARNING TABLES
-- =====================================================

-- Q-Table for reinforcement learning
CREATE TABLE q_table (
    id INT PRIMARY KEY AUTO_INCREMENT,
    state_hash VARCHAR(64) NOT NULL,
    action_hash VARCHAR(64) NOT NULL,
    q_value DECIMAL(10,6) DEFAULT 0.000000,
    visit_count INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_state_action (state_hash, action_hash),
    INDEX idx_q_value (q_value),
    INDEX idx_visit_count (visit_count),
    INDEX idx_last_updated (last_updated)
);

-- Learning episodes table - tracks learning sessions
CREATE TABLE learning_episodes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    episode_id VARCHAR(50) UNIQUE NOT NULL,
    agent_id INT NOT NULL,
    start_state JSON,
    end_state JSON,
    actions_taken JSON,
    total_reward DECIMAL(10,4) DEFAULT 0.00,
    episode_length INT DEFAULT 0,
    success BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    duration_ms INT NULL,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    INDEX idx_episode_agent (agent_id),
    INDEX idx_episode_timing (started_at, completed_at),
    INDEX idx_episode_success (success)
);

-- =====================================================
-- ORCHESTRATOR TABLES
-- =====================================================

-- Orchestrator sessions table - tracks orchestrator runs
CREATE TABLE orchestrator_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('running', 'completed', 'failed', 'paused') DEFAULT 'running',
    cycle_count INT DEFAULT 0,
    total_actions INT DEFAULT 0,
    successful_actions INT DEFAULT 0,
    failed_actions INT DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    config JSON,
    INDEX idx_session_status (status),
    INDEX idx_session_timing (started_at, completed_at)
);

-- Orchestrator cycles table - tracks individual cycles
CREATE TABLE orchestrator_cycles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(50) NOT NULL,
    cycle_number INT NOT NULL,
    status ENUM('running', 'completed', 'failed') DEFAULT 'running',
    actions_scheduled INT DEFAULT 0,
    actions_completed INT DEFAULT 0,
    actions_failed INT DEFAULT 0,
    cycle_reward DECIMAL(10,4) DEFAULT 0.00,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    duration_ms INT NULL,
    INDEX idx_cycle_session (session_id, cycle_number),
    INDEX idx_cycle_timing (started_at, completed_at),
    INDEX idx_cycle_status (status)
);

-- =====================================================
-- CONTENT AND OUTPUT TABLES
-- =====================================================

-- Generated content table - stores content created by agents
CREATE TABLE generated_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    agent_id INT NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    content TEXT,
    metadata JSON,
    status ENUM('draft', 'published', 'scheduled', 'failed') DEFAULT 'draft',
    platforms JSON, -- array of platforms where content was posted
    engagement_metrics JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    INDEX idx_content_agent (agent_id),
    INDEX idx_content_type (content_type),
    INDEX idx_content_status (status),
    INDEX idx_content_timing (created_at, published_at)
);

-- Social media posts table - tracks social media content
CREATE TABLE social_media_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content_id INT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    post_id VARCHAR(100),
    post_url VARCHAR(500),
    status ENUM('scheduled', 'posted', 'failed', 'deleted') DEFAULT 'scheduled',
    scheduled_time TIMESTAMP NULL,
    posted_time TIMESTAMP NULL,
    engagement_data JSON,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES generated_content(id) ON DELETE CASCADE,
    INDEX idx_post_platform (platform),
    INDEX idx_post_status (status),
    INDEX idx_post_timing (scheduled_time, posted_time)
);

-- =====================================================
-- FEEDBACK AND ANALYTICS TABLES
-- =====================================================

-- User feedback table - stores user feedback for agents
CREATE TABLE user_feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    agent_id INT NOT NULL,
    user_id VARCHAR(100),
    feedback_type ENUM('positive', 'negative', 'neutral', 'suggestion') NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    context JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    INDEX idx_feedback_agent (agent_id),
    INDEX idx_feedback_type (feedback_type),
    INDEX idx_feedback_rating (rating),
    INDEX idx_feedback_timing (created_at)
);

-- Analytics events table - tracks user interactions and events
CREATE TABLE analytics_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_type VARCHAR(100) NOT NULL,
    agent_id INT NULL,
    user_id VARCHAR(100),
    session_id VARCHAR(100),
    event_data JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL,
    INDEX idx_event_type (event_type),
    INDEX idx_event_agent (agent_id),
    INDEX idx_event_user (user_id),
    INDEX idx_event_timing (timestamp)
);

-- =====================================================
-- SYSTEM CONFIGURATION TABLES
-- =====================================================

-- System configuration table - stores system-wide settings
CREATE TABLE system_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    config_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_config_key (config_key)
);

-- Agent configurations table - stores agent-specific settings
CREATE TABLE agent_configs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    agent_id INT NOT NULL,
    config_key VARCHAR(100) NOT NULL,
    config_value TEXT,
    config_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    UNIQUE KEY unique_agent_config (agent_id, config_key),
    INDEX idx_agent_config (agent_id, config_key)
);

-- =====================================================
-- LOGGING AND MONITORING TABLES
-- =====================================================

-- System logs table - comprehensive logging
CREATE TABLE system_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    log_level ENUM('debug', 'info', 'warning', 'error', 'critical') NOT NULL,
    agent_id INT NULL,
    session_id VARCHAR(50) NULL,
    cycle_number INT NULL,
    message TEXT NOT NULL,
    context JSON,
    stack_trace TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL,
    INDEX idx_log_level (log_level),
    INDEX idx_log_agent (agent_id),
    INDEX idx_log_timing (created_at),
    INDEX idx_log_session (session_id)
);

-- Health checks table - tracks system health
CREATE TABLE health_checks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    agent_id INT NULL,
    check_type VARCHAR(50) NOT NULL,
    status ENUM('healthy', 'warning', 'critical', 'unknown') NOT NULL,
    details JSON,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL,
    INDEX idx_health_agent (agent_id),
    INDEX idx_health_status (status),
    INDEX idx_health_timing (checked_at)
);

-- =====================================================
-- INITIAL DATA INSERTION
-- =====================================================

-- Insert default agents
INSERT INTO agents (name, description, class_name, status, version) VALUES
('BootAgent', 'Handles system initialization and startup tasks', 'BootAgent', 'active', '1.0.0'),
('SalesAgent', 'Optimizes sales conversions and revenue', 'SalesAgent', 'active', '1.0.0'),
('TrafficAgent', 'Generates and optimizes website traffic', 'TrafficAgent', 'active', '1.0.0'),
('UIAgent', 'Analyzes and improves user interface', 'UIAgent', 'active', '1.0.0'),
('TestimonialAgent', 'Manages and optimizes social proof', 'TestimonialAgent', 'active', '1.0.0'),
('FeedbackAgent', 'Analyzes user feedback and sentiment', 'FeedbackAgent', 'active', '1.0.0'),
('CustomerServiceAgent', 'Optimizes customer service operations', 'CustomerServiceAgent', 'active', '1.0.0'),
('SocialMediaAgent', 'Generates and schedules social media content', 'SocialMediaAgent', 'active', '1.0.0');

-- Insert default actions for each agent
INSERT INTO actions (agent_id, action_name, description, parameters, expected_duration) VALUES
(1, 'initialize_system', 'Initialize the system and check dependencies', '{"check_deps": true, "validate_env": true}', 30),
(1, 'check_dependencies', 'Verify all system dependencies are available', '{"deps": ["node", "npm", "database"]}', 15),
(1, 'setup_environment', 'Configure environment variables and settings', '{"env": "production"}', 20),
(1, 'validate_config', 'Validate system configuration', '{"strict": true}', 10),
(2, 'analyze_conversions', 'Analyze conversion rates and optimize', '{"timeframe": "24h"}', 45),
(2, 'optimize_pricing', 'Optimize pricing strategy based on data', '{"segment": "all"}', 60),
(3, 'generate_traffic', 'Generate organic and paid traffic', '{"sources": ["seo", "social", "ads"]}', 90),
(3, 'optimize_seo', 'Optimize search engine rankings', '{"keywords": "wellness,ai,self-care"}', 120),
(4, 'analyze_usability', 'Analyze user interface and experience', '{"metrics": ["bounce_rate", "time_on_page"]}', 30),
(4, 'optimize_ui', 'Optimize user interface elements', '{"focus": "conversion"}', 45),
(5, 'optimize_social_proof', 'Optimize testimonials and reviews', '{"platform": "all"}', 30),
(5, 'generate_testimonials', 'Generate new testimonials', '{"count": 5}', 60),
(6, 'analyze_feedback', 'Analyze user feedback and sentiment', '{"sentiment": true}', 45),
(6, 'generate_insights', 'Generate insights from feedback data', '{"format": "report"}', 30),
(7, 'optimize_service', 'Optimize customer service processes', '{"metrics": ["response_time", "satisfaction"]}', 60),
(7, 'analyze_tickets', 'Analyze support ticket patterns', '{"timeframe": "7d"}', 45),
(8, 'generate_content', 'Generate social media content', '{"platforms": ["twitter", "linkedin", "instagram"]}', 90),
(8, 'schedule_posts', 'Schedule content across platforms', '{"auto_schedule": true}', 30),
(8, 'track_performance', 'Track social media performance', '{"metrics": ["reach", "engagement"]}', 20);

-- Insert default system configuration
INSERT INTO system_config (config_key, config_value, config_type, description) VALUES
('orchestrator_cycle_interval', '300', 'number', 'Interval between orchestrator cycles in seconds'),
('max_concurrent_agents', '5', 'number', 'Maximum number of agents that can run concurrently'),
('learning_rate', '0.1', 'number', 'Reinforcement learning rate (alpha)'),
('discount_factor', '0.9', 'number', 'Reinforcement learning discount factor (gamma)'),
('exploration_rate', '0.1', 'number', 'Reinforcement learning exploration rate (epsilon)'),
('performance_tracking_enabled', 'true', 'boolean', 'Enable performance tracking for all agents'),
('log_level', 'info', 'string', 'System-wide logging level'),
('database_connection_pool', '10', 'number', 'Database connection pool size'),
('session_timeout', '3600', 'number', 'Session timeout in seconds'),
('backup_enabled', 'true', 'boolean', 'Enable automatic database backups');

-- Insert default agent configurations
INSERT INTO agent_configs (agent_id, config_key, config_value, config_type) VALUES
(1, 'auto_restart', 'true', 'boolean'),
(1, 'health_check_interval', '60', 'number'),
(2, 'conversion_threshold', '0.05', 'number'),
(2, 'optimization_frequency', '3600', 'number'),
(3, 'traffic_sources', '["seo", "social", "ads", "email"]', 'json'),
(3, 'daily_traffic_goal', '1000', 'number'),
(4, 'usability_metrics', '["bounce_rate", "time_on_page", "conversion_rate"]', 'json'),
(4, 'optimization_threshold', '0.1', 'number'),
(5, 'testimonial_platforms', '["website", "google", "trustpilot"]', 'json'),
(5, 'min_testimonial_rating', '4', 'number'),
(6, 'feedback_sources', '["app", "email", "social"]', 'json'),
(6, 'sentiment_analysis_enabled', 'true', 'boolean'),
(7, 'response_time_target', '300', 'number'),
(7, 'satisfaction_threshold', '4.5', 'number'),
(8, 'content_schedule', '{"twitter": "3x_day", "linkedin": "1x_day", "instagram": "2x_day"}', 'json'),
(8, 'brand_voice_file', 'chudi_humanized.md', 'string');

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for agent performance overview
CREATE VIEW agent_performance_overview AS
SELECT 
    a.name,
    a.status,
    a.last_execution,
    COALESCE(aps.total_actions, 0) as total_actions,
    COALESCE(aps.successful_actions, 0) as successful_actions,
    COALESCE(aps.failed_actions, 0) as failed_actions,
    COALESCE(aps.success_rate, 0) as success_rate,
    COALESCE(aps.avg_execution_time_ms, 0) as avg_execution_time_ms,
    COALESCE(aps.avg_reward, 0) as avg_reward
FROM agents a
LEFT JOIN (
    SELECT 
        agent_id,
        SUM(total_actions) as total_actions,
        SUM(successful_actions) as successful_actions,
        SUM(failed_actions) as failed_actions,
        AVG(success_rate) as success_rate,
        AVG(avg_execution_time_ms) as avg_execution_time_ms,
        AVG(avg_reward) as avg_reward
    FROM agent_performance_summary
    WHERE period_start >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    GROUP BY agent_id
) aps ON a.id = aps.agent_id;

-- View for recent system activity
CREATE VIEW recent_system_activity AS
SELECT 
    'execution' as activity_type,
    ae.started_at as timestamp,
    a.name as agent_name,
    ac.action_name as action_name,
    ae.status as status,
    ae.duration_ms as duration
FROM action_executions ae
JOIN agents a ON ae.agent_id = a.id
JOIN actions ac ON ae.action_id = ac.id
WHERE ae.started_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
UNION ALL
SELECT 
    'log' as activity_type,
    sl.created_at as timestamp,
    a.name as agent_name,
    sl.log_level as action_name,
    sl.log_level as status,
    NULL as duration
FROM system_logs sl
LEFT JOIN agents a ON sl.agent_id = a.id
WHERE sl.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY timestamp DESC;

-- View for orchestrator status
CREATE VIEW orchestrator_status AS
SELECT 
    os.session_id,
    os.status,
    os.cycle_count,
    os.total_actions,
    os.successful_actions,
    os.failed_actions,
    os.started_at,
    os.completed_at,
    TIMESTAMPDIFF(SECOND, os.started_at, COALESCE(os.completed_at, NOW())) as duration_seconds
FROM orchestrator_sessions os
WHERE os.started_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY os.started_at DESC;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure to record agent action execution
CREATE PROCEDURE RecordActionExecution(
    IN p_agent_name VARCHAR(100),
    IN p_action_name VARCHAR(100),
    IN p_execution_id VARCHAR(50),
    IN p_input_data JSON,
    IN p_output_data JSON,
    IN p_status ENUM('pending', 'running', 'completed', 'failed', 'cancelled'),
    IN p_error_message TEXT,
    IN p_cycle_number INT,
    IN p_session_id VARCHAR(50)
)
BEGIN
    DECLARE v_agent_id INT;
    DECLARE v_action_id INT;
    DECLARE v_duration_ms INT;
    
    -- Get agent and action IDs
    SELECT id INTO v_agent_id FROM agents WHERE name = p_agent_name;
    SELECT id INTO v_action_id FROM actions WHERE agent_id = v_agent_id AND action_name = p_action_name;
    
    -- Calculate duration if completed
    IF p_status = 'completed' THEN
        SET v_duration_ms = TIMESTAMPDIFF(MICROSECOND, 
            (SELECT started_at FROM action_executions WHERE execution_id = p_execution_id), 
            NOW()) / 1000;
    END IF;
    
    -- Insert or update execution record
    INSERT INTO action_executions (
        agent_id, action_id, execution_id, status, input_data, output_data, 
        error_message, completed_at, duration_ms, cycle_number, orchestrator_session_id
    ) VALUES (
        v_agent_id, v_action_id, p_execution_id, p_status, p_input_data, p_output_data,
        p_error_message, 
        CASE WHEN p_status IN ('completed', 'failed', 'cancelled') THEN NOW() ELSE NULL END,
        v_duration_ms, p_cycle_number, p_session_id
    )
    ON DUPLICATE KEY UPDATE
        status = p_status,
        output_data = p_output_data,
        error_message = p_error_message,
        completed_at = CASE WHEN p_status IN ('completed', 'failed', 'cancelled') THEN NOW() ELSE completed_at END,
        duration_ms = v_duration_ms;
        
    -- Update agent last execution
    UPDATE agents SET last_execution = NOW() WHERE id = v_agent_id;
END //

-- Procedure to update performance metrics
CREATE PROCEDURE UpdatePerformanceMetrics(
    IN p_agent_name VARCHAR(100),
    IN p_metric_name VARCHAR(100),
    IN p_metric_value DECIMAL(10,4),
    IN p_metric_unit VARCHAR(20),
    IN p_cycle_number INT,
    IN p_context JSON
)
BEGIN
    DECLARE v_agent_id INT;
    
    SELECT id INTO v_agent_id FROM agents WHERE name = p_agent_name;
    
    INSERT INTO performance_metrics (
        agent_id, metric_name, metric_value, metric_unit, cycle_number, context
    ) VALUES (
        v_agent_id, p_metric_name, p_metric_value, p_metric_unit, p_cycle_number, p_context
    );
END //

-- Procedure to get agent performance summary
CREATE PROCEDURE GetAgentPerformanceSummary(
    IN p_agent_name VARCHAR(100),
    IN p_days_back INT
)
BEGIN
    SELECT 
        a.name,
        COUNT(ae.id) as total_executions,
        SUM(CASE WHEN ae.status = 'completed' THEN 1 ELSE 0 END) as successful_executions,
        SUM(CASE WHEN ae.status = 'failed' THEN 1 ELSE 0 END) as failed_executions,
        AVG(ae.duration_ms) as avg_duration_ms,
        MAX(ae.started_at) as last_execution
    FROM agents a
    LEFT JOIN action_executions ae ON a.id = ae.agent_id 
        AND ae.started_at >= DATE_SUB(NOW(), INTERVAL p_days_back DAY)
    WHERE a.name = p_agent_name
    GROUP BY a.id, a.name;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to automatically update agent status based on recent executions
DELIMITER //
CREATE TRIGGER update_agent_status_after_execution
AFTER UPDATE ON action_executions
FOR EACH ROW
BEGIN
    DECLARE v_failed_count INT;
    
    IF NEW.status IN ('completed', 'failed', 'cancelled') THEN
        -- Count recent failures
        SELECT COUNT(*) INTO v_failed_count
        FROM action_executions
        WHERE agent_id = NEW.agent_id 
        AND status = 'failed'
        AND started_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR);
        
        -- Update agent status based on failure count
        IF v_failed_count >= 3 THEN
            UPDATE agents SET status = 'error' WHERE id = NEW.agent_id;
        ELSEIF v_failed_count = 0 THEN
            UPDATE agents SET status = 'active' WHERE id = NEW.agent_id;
        END IF;
    END IF;
END //
DELIMITER ;

-- Trigger to log system events
DELIMITER //
CREATE TRIGGER log_agent_status_changes
AFTER UPDATE ON agents
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO system_logs (log_level, agent_id, message, context)
        VALUES (
            CASE 
                WHEN NEW.status = 'error' THEN 'error'
                WHEN NEW.status = 'maintenance' THEN 'warning'
                ELSE 'info'
            END,
            NEW.id,
            CONCAT('Agent status changed from ', OLD.status, ' to ', NEW.status),
            JSON_OBJECT('old_status', OLD.status, 'new_status', NEW.status)
        );
    END IF;
END //
DELIMITER ;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional indexes for better query performance
CREATE INDEX idx_action_executions_agent_status ON action_executions(agent_id, status);
CREATE INDEX idx_action_executions_timing ON action_executions(started_at, completed_at);
CREATE INDEX idx_performance_metrics_agent_timing ON performance_metrics(agent_id, recorded_at);
CREATE INDEX idx_system_logs_level_timing ON system_logs(log_level, created_at);
CREATE INDEX idx_q_table_value_visits ON q_table(q_value, visit_count);

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

-- Add comments to tables for documentation
ALTER TABLE agents COMMENT = 'Stores information about AI agents in the system';
ALTER TABLE action_executions COMMENT = 'Logs all action executions with timing and results';
ALTER TABLE performance_metrics COMMENT = 'Tracks performance metrics for agents over time';
ALTER TABLE q_table COMMENT = 'Q-Table for reinforcement learning state-action values';
ALTER TABLE orchestrator_sessions COMMENT = 'Tracks orchestrator session runs and cycles';

-- =====================================================
-- FINAL SETUP
-- =====================================================

-- Create a user for the application (replace with your actual credentials)
-- CREATE USER 'ai_agents_user'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT ALL PRIVILEGES ON ai_agents_db.* TO 'ai_agents_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Show final status
SELECT 'AI Agents MySQL Database Schema Created Successfully!' as status;
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'ai_agents_db';
SELECT name, status FROM agents ORDER BY name; 