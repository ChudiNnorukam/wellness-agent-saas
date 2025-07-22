# MySQL Database for AI Agents

This directory contains the MySQL database setup for the AI Agents system. The database is designed to track agent performance, store learning data, manage configurations, and provide comprehensive logging and analytics.

## 📋 Database Overview

The `ai_agents_db` database includes:

- **Core Agent Tables**: Store agent information, states, and configurations
- **Action & Execution Tables**: Track all agent actions and their results
- **Performance & Metrics Tables**: Monitor agent performance over time
- **Reinforcement Learning Tables**: Store Q-Table data for machine learning
- **Orchestrator Tables**: Track system orchestration and cycles
- **Content & Output Tables**: Store generated content and social media posts
- **Feedback & Analytics Tables**: User feedback and event tracking
- **System Configuration Tables**: Manage system-wide and agent-specific settings
- **Logging & Monitoring Tables**: Comprehensive system logging and health checks

## 🚀 Quick Setup

### Prerequisites

1. **MySQL Server** (8.0 or higher recommended)
2. **Node.js** (18+ with npm)
3. **MySQL client** (for manual database access)

### Installation Steps

1. **Install MySQL Server** (if not already installed):
   ```bash
   # macOS (using Homebrew)
   brew install mysql
   brew services start mysql
   
   # Ubuntu/Debian
   sudo apt update
   sudo apt install mysql-server
   sudo systemctl start mysql
   
   # Windows
   # Download and install from https://dev.mysql.com/downloads/mysql/
   ```

2. **Set up MySQL root password** (if not already set):
   ```bash
   mysql_secure_installation
   ```

3. **Run the database setup script**:
   ```bash
   cd wellness-agent-saas
   node scripts/setup-mysql-database.js
   ```

4. **Test the connection**:
   ```bash
   node scripts/test-database-connection.js
   ```

## ⚙️ Configuration

### Environment Variables

Set these environment variables in your `.env` file:

```env
# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=ai_agents_db
MYSQL_CONNECTION_LIMIT=10

# Optional: Create application user
CREATE_APP_USER=true
MYSQL_APP_USER=ai_agents_user
MYSQL_APP_PASSWORD=ai_agents_password_2024
```

### Configuration File

The database connection can also be configured via `database/mysql-config.json`:

```json
{
  "host": "localhost",
  "port": 3306,
  "user": "root",
  "password": "your_password",
  "database": "ai_agents_db",
  "charset": "utf8mb4",
  "timezone": "+00:00",
  "connectionLimit": 10,
  "acquireTimeout": 60000,
  "timeout": 60000,
  "reconnect": true,
  "multipleStatements": true
}
```

## 📊 Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `agents` | AI agent information and status |
| `agent_states` | Current state of each agent |
| `actions` | Available actions for each agent |
| `action_executions` | Log of all action executions |
| `performance_metrics` | Agent performance tracking |
| `agent_performance_summary` | Aggregated performance data |

### Learning Tables

| Table | Description |
|-------|-------------|
| `q_table` | Q-Table for reinforcement learning |
| `learning_episodes` | Learning session tracking |

### System Tables

| Table | Description |
|-------|-------------|
| `orchestrator_sessions` | Orchestrator session tracking |
| `orchestrator_cycles` | Individual cycle tracking |
| `system_config` | System-wide configuration |
| `agent_configs` | Agent-specific configuration |
| `system_logs` | Comprehensive system logging |
| `health_checks` | System health monitoring |

### Content Tables

| Table | Description |
|-------|-------------|
| `generated_content` | Content created by agents |
| `social_media_posts` | Social media post tracking |
| `user_feedback` | User feedback storage |
| `analytics_events` | User interaction tracking |

## 🔧 Usage Examples

### Basic Database Operations

```javascript
const mysqlConnection = require('./database/mysql-connection');

// Record an action execution
await mysqlConnection.recordActionExecution(
  'BootAgent',
  'initialize_system',
  'exec-123',
  { env: 'production' },
  { status: 'success' },
  'completed'
);

// Update performance metrics
await mysqlConnection.updatePerformanceMetrics(
  'BootAgent',
  'execution_duration_ms',
  1500,
  'ms',
  1,
  { action: 'initialize_system' }
);

// Log system events
await mysqlConnection.logSystemEvent(
  'info',
  'BootAgent',
  'System initialized successfully',
  { timestamp: new Date().toISOString() }
);
```

### Reinforcement Learning Operations

```javascript
// Update Q-Value
await mysqlConnection.updateQValue('state_hash', 'action_hash', 0.75, 1);

// Get Q-Value
const qValue = await mysqlConnection.getQValue('state_hash', 'action_hash');

// Get all Q-Values for a state
const qValues = await mysqlConnection.getQValuesForState('state_hash');
```

### Configuration Management

```javascript
// Get system configuration
const cycleInterval = await mysqlConnection.getSystemConfig('orchestrator_cycle_interval');

// Get agent configuration
const autoRestart = await mysqlConnection.getAgentConfig('BootAgent', 'auto_restart');
```

## 📈 Monitoring and Analytics

### Database Views

The database includes several views for easy monitoring:

- `agent_performance_overview`: Agent performance summary
- `recent_system_activity`: Recent system activity
- `orchestrator_status`: Orchestrator session status

### Stored Procedures

- `RecordActionExecution`: Record agent action executions
- `UpdatePerformanceMetrics`: Update performance metrics
- `GetAgentPerformanceSummary`: Get agent performance summary

### Health Monitoring

```javascript
// Check database health
const health = await mysqlConnection.healthCheck();
console.log('Database health:', health);
```

## 🔍 Query Examples

### Get Agent Performance

```sql
SELECT 
  a.name,
  COUNT(ae.id) as total_executions,
  SUM(CASE WHEN ae.status = 'completed' THEN 1 ELSE 0 END) as successful_executions,
  AVG(ae.duration_ms) as avg_duration_ms
FROM agents a
LEFT JOIN action_executions ae ON a.id = ae.agent_id 
  AND ae.started_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY a.id, a.name;
```

### Get Recent Errors

```sql
SELECT 
  a.name as agent_name,
  sl.message,
  sl.created_at
FROM system_logs sl
JOIN agents a ON sl.agent_id = a.id
WHERE sl.log_level = 'error'
  AND sl.created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
ORDER BY sl.created_at DESC;
```

### Get Q-Table Statistics

```sql
SELECT 
  COUNT(*) as total_entries,
  AVG(q_value) as avg_q_value,
  MAX(q_value) as max_q_value,
  SUM(visit_count) as total_visits
FROM q_table;
```

## 🛠️ Maintenance

### Backup

```bash
# Create backup
mysqldump -u root -p ai_agents_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
mysql -u root -p ai_agents_db < backup_file.sql
```

### Cleanup Old Data

```sql
-- Clean up old logs (older than 30 days)
DELETE FROM system_logs 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Clean up old performance metrics (older than 90 days)
DELETE FROM performance_metrics 
WHERE recorded_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- Clean up old action executions (older than 60 days)
DELETE FROM action_executions 
WHERE started_at < DATE_SUB(NOW(), INTERVAL 60 DAY);
```

### Performance Optimization

```sql
-- Analyze table statistics
ANALYZE TABLE agents, action_executions, performance_metrics;

-- Optimize tables
OPTIMIZE TABLE agents, action_executions, performance_metrics;
```

## 🚨 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if MySQL server is running
   - Verify host and port settings
   - Check firewall settings

2. **Access Denied**
   - Verify username and password
   - Check user privileges
   - Ensure database exists

3. **Performance Issues**
   - Check connection pool settings
   - Monitor query performance
   - Consider adding indexes

### Debug Mode

Enable debug logging by setting the log level:

```javascript
// In your application
await mysqlConnection.logSystemEvent('debug', 'System', 'Debug message');
```

### Health Check

Run the health check to diagnose issues:

```bash
node scripts/test-database-connection.js
```

## 📚 Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [mysql2 Node.js Driver](https://github.com/sidorares/node-mysql2)
- [Database Design Best Practices](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)

## 🤝 Contributing

When making changes to the database schema:

1. Create a new migration file
2. Test the migration thoroughly
3. Update the documentation
4. Run the test suite

## 📄 License

This database setup is part of the AI Agents system and follows the same MIT license. 