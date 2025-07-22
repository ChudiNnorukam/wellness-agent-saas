const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

class MySQLConnection {
  constructor() {
    this.pool = null;
    this.config = this.loadConfig();
  }

  loadConfig() {
    // Try to load from environment variables first
    const config = {
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'ai_agents_db',
      charset: 'utf8mb4',
      timezone: '+00:00',
      connectionLimit: parseInt(process.env.MYSQL_CONNECTION_LIMIT) || 10,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true,
      multipleStatements: true
    };

    // Try to load from config file if it exists
    const configPath = path.join(__dirname, 'mysql-config.json');
    if (fs.existsSync(configPath)) {
      try {
        const fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        Object.assign(config, fileConfig);
      } catch (error) {
        console.warn('⚠️ Could not load MySQL config file:', error.message);
      }
    }

    return config;
  }

  async connect() {
    try {
      if (!this.pool) {
        console.log('🔌 Creating MySQL connection pool...');
        this.pool = mysql.createPool(this.config);
        
        // Test the connection
        const connection = await this.pool.getConnection();
        console.log('✅ MySQL connection established successfully');
        connection.release();
      }
      return this.pool;
    } catch (error) {
      console.error('❌ MySQL connection failed:', error.message);
      throw error;
    }
  }

  async disconnect() {
    if (this.pool) {
      console.log('🔌 Closing MySQL connection pool...');
      await this.pool.end();
      this.pool = null;
      console.log('✅ MySQL connection pool closed');
    }
  }

  async query(sql, params = []) {
    try {
      const pool = await this.connect();
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('❌ MySQL query error:', error.message);
      console.error('SQL:', sql);
      console.error('Params:', params);
      throw error;
    }
  }

  async transaction(callback) {
    const pool = await this.connect();
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Helper method to record agent action execution
  async recordActionExecution(agentName, actionName, executionId, inputData = {}, outputData = {}, status = 'pending', errorMessage = null, cycleNumber = null, sessionId = null) {
    const sql = `
      CALL RecordActionExecution(?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    try {
      await this.query(sql, [
        agentName,
        actionName,
        executionId,
        JSON.stringify(inputData),
        JSON.stringify(outputData),
        status,
        errorMessage,
        cycleNumber,
        sessionId
      ]);
    } catch (error) {
      console.error('❌ Failed to record action execution:', error.message);
      // Fallback to direct insert if stored procedure fails
      await this.fallbackRecordActionExecution(agentName, actionName, executionId, inputData, outputData, status, errorMessage, cycleNumber, sessionId);
    }
  }

  // Fallback method for recording action execution
  async fallbackRecordActionExecution(agentName, actionName, executionId, inputData, outputData, status, errorMessage, cycleNumber, sessionId) {
    try {
      // Get agent and action IDs
      const [agents] = await this.query('SELECT id FROM agents WHERE name = ?', [agentName]);
      const [actions] = await this.query('SELECT id FROM actions WHERE agent_id = ? AND action_name = ?', [agents[0]?.id, actionName]);
      
      if (!agents[0] || !actions[0]) {
        console.warn('⚠️ Agent or action not found:', { agentName, actionName });
        return;
      }

      const sql = `
        INSERT INTO action_executions (
          agent_id, action_id, execution_id, status, input_data, output_data, 
          error_message, completed_at, cycle_number, orchestrator_session_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          status = VALUES(status),
          output_data = VALUES(output_data),
          error_message = VALUES(error_message),
          completed_at = VALUES(completed_at)
      `;

      const completedAt = status === 'completed' || status === 'failed' || status === 'cancelled' ? new Date() : null;
      
      await this.query(sql, [
        agents[0].id,
        actions[0].id,
        executionId,
        status,
        JSON.stringify(inputData),
        JSON.stringify(outputData),
        errorMessage,
        completedAt,
        cycleNumber,
        sessionId
      ]);

      // Update agent last execution
      await this.query('UPDATE agents SET last_execution = NOW() WHERE id = ?', [agents[0].id]);
    } catch (error) {
      console.error('❌ Fallback action execution recording failed:', error.message);
    }
  }

  // Helper method to update performance metrics
  async updatePerformanceMetrics(agentName, metricName, metricValue, metricUnit = null, cycleNumber = null, context = {}) {
    const sql = `
      CALL UpdatePerformanceMetrics(?, ?, ?, ?, ?, ?)
    `;
    
    try {
      await this.query(sql, [
        agentName,
        metricName,
        metricValue,
        metricUnit,
        cycleNumber,
        JSON.stringify(context)
      ]);
    } catch (error) {
      console.error('❌ Failed to update performance metrics:', error.message);
      // Fallback to direct insert
      await this.fallbackUpdatePerformanceMetrics(agentName, metricName, metricValue, metricUnit, cycleNumber, context);
    }
  }

  // Fallback method for updating performance metrics
  async fallbackUpdatePerformanceMetrics(agentName, metricName, metricValue, metricUnit, cycleNumber, context) {
    try {
      const [agents] = await this.query('SELECT id FROM agents WHERE name = ?', [agentName]);
      
      if (!agents[0]) {
        console.warn('⚠️ Agent not found:', agentName);
        return;
      }

      const sql = `
        INSERT INTO performance_metrics (
          agent_id, metric_name, metric_value, metric_unit, cycle_number, context
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;

      await this.query(sql, [
        agents[0].id,
        metricName,
        metricValue,
        metricUnit,
        cycleNumber,
        JSON.stringify(context)
      ]);
    } catch (error) {
      console.error('❌ Fallback performance metrics update failed:', error.message);
    }
  }

  // Helper method to get agent performance summary
  async getAgentPerformanceSummary(agentName, daysBack = 7) {
    const sql = `
      CALL GetAgentPerformanceSummary(?, ?)
    `;
    
    try {
      return await this.query(sql, [agentName, daysBack]);
    } catch (error) {
      console.error('❌ Failed to get agent performance summary:', error.message);
      // Fallback to direct query
      return await this.fallbackGetAgentPerformanceSummary(agentName, daysBack);
    }
  }

  // Fallback method for getting agent performance summary
  async fallbackGetAgentPerformanceSummary(agentName, daysBack) {
    try {
      const sql = `
        SELECT 
          a.name,
          COUNT(ae.id) as total_executions,
          SUM(CASE WHEN ae.status = 'completed' THEN 1 ELSE 0 END) as successful_executions,
          SUM(CASE WHEN ae.status = 'failed' THEN 1 ELSE 0 END) as failed_executions,
          AVG(ae.duration_ms) as avg_duration_ms,
          MAX(ae.started_at) as last_execution
        FROM agents a
        LEFT JOIN action_executions ae ON a.id = ae.agent_id 
          AND ae.started_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        WHERE a.name = ?
        GROUP BY a.id, a.name
      `;
      
      return await this.query(sql, [daysBack, agentName]);
    } catch (error) {
      console.error('❌ Fallback performance summary failed:', error.message);
      return [];
    }
  }

  // Helper method to log system events
  async logSystemEvent(logLevel, agentName, message, context = {}, sessionId = null, cycleNumber = null) {
    try {
      const [agents] = await this.query('SELECT id FROM agents WHERE name = ?', [agentName]);
      const agentId = agents[0]?.id || null;

      const sql = `
        INSERT INTO system_logs (
          log_level, agent_id, session_id, cycle_number, message, context
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;

      await this.query(sql, [
        logLevel,
        agentId,
        sessionId,
        cycleNumber,
        message,
        JSON.stringify(context)
      ]);
    } catch (error) {
      console.error('❌ Failed to log system event:', error.message);
    }
  }

  // Helper method to get system configuration
  async getSystemConfig(configKey) {
    try {
      const [rows] = await this.query('SELECT config_value, config_type FROM system_config WHERE config_key = ?', [configKey]);
      if (rows.length > 0) {
        const row = rows[0];
        switch (row.config_type) {
          case 'number':
            return parseFloat(row.config_value);
          case 'boolean':
            return row.config_value === 'true';
          case 'json':
            return JSON.parse(row.config_value);
          default:
            return row.config_value;
        }
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to get system config:', error.message);
      return null;
    }
  }

  // Helper method to get agent configuration
  async getAgentConfig(agentName, configKey) {
    try {
      const sql = `
        SELECT ac.config_value, ac.config_type 
        FROM agent_configs ac
        JOIN agents a ON ac.agent_id = a.id
        WHERE a.name = ? AND ac.config_key = ?
      `;
      
      const [rows] = await this.query(sql, [agentName, configKey]);
      if (rows.length > 0) {
        const row = rows[0];
        switch (row.config_type) {
          case 'number':
            return parseFloat(row.config_value);
          case 'boolean':
            return row.config_value === 'true';
          case 'json':
            return JSON.parse(row.config_value);
          default:
            return row.config_value;
        }
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to get agent config:', error.message);
      return null;
    }
  }

  // Helper method to update Q-Table for reinforcement learning
  async updateQValue(stateHash, actionHash, qValue, visitCount = 1) {
    try {
      const sql = `
        INSERT INTO q_table (state_hash, action_hash, q_value, visit_count)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          q_value = VALUES(q_value),
          visit_count = visit_count + VALUES(visit_count),
          last_updated = NOW()
      `;
      
      await this.query(sql, [stateHash, actionHash, qValue, visitCount]);
    } catch (error) {
      console.error('❌ Failed to update Q-Value:', error.message);
    }
  }

  // Helper method to get Q-Value
  async getQValue(stateHash, actionHash) {
    try {
      const [rows] = await this.query(
        'SELECT q_value, visit_count FROM q_table WHERE state_hash = ? AND action_hash = ?',
        [stateHash, actionHash]
      );
      
      if (rows.length > 0) {
        return {
          qValue: parseFloat(rows[0].q_value),
          visitCount: rows[0].visit_count
        };
      }
      return { qValue: 0, visitCount: 0 };
    } catch (error) {
      console.error('❌ Failed to get Q-Value:', error.message);
      return { qValue: 0, visitCount: 0 };
    }
  }

  // Helper method to get all Q-Values for a state
  async getQValuesForState(stateHash) {
    try {
      const [rows] = await this.query(
        'SELECT action_hash, q_value, visit_count FROM q_table WHERE state_hash = ? ORDER BY q_value DESC',
        [stateHash]
      );
      
      return rows.map(row => ({
        actionHash: row.action_hash,
        qValue: parseFloat(row.q_value),
        visitCount: row.visit_count
      }));
    } catch (error) {
      console.error('❌ Failed to get Q-Values for state:', error.message);
      return [];
    }
  }

  // Health check method
  async healthCheck() {
    try {
      const pool = await this.connect();
      const connection = await pool.getConnection();
      
      // Test basic query
      await connection.query('SELECT 1 as test');
      
      // Check if tables exist
      const [tables] = await connection.query(`
        SELECT COUNT(*) as table_count 
        FROM information_schema.tables 
        WHERE table_schema = ?
      `, [this.config.database]);
      
      connection.release();
      
      return {
        status: 'healthy',
        database: this.config.database,
        tableCount: tables[0].table_count,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Create singleton instance
const mysqlConnection = new MySQLConnection();

module.exports = mysqlConnection; 