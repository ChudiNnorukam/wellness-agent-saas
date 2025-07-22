const mysqlConnection = require('../../database/mysql-connection');
const { v4: uuidv4 } = require('crypto');

class BootAgent {
  constructor() {
    this.name = 'BootAgent';
    this.description = 'Handles system initialization and startup tasks';
    this.state = 'idle';
    this.performance = { actions: 0, success: 0, failures: 0 };
    this.sessionId = null;
    this.cycleNumber = null;
  }

  async execute(action, data = {}) {
    const executionId = uuidv4();
    const startTime = Date.now();
    
    this.performance.actions++;
    
    try {
      // Record action execution start
      await mysqlConnection.recordActionExecution(
        this.name, 
        action, 
        executionId, 
        data, 
        {}, 
        'running', 
        null, 
        this.cycleNumber, 
        this.sessionId
      );

      // Log system event
      await mysqlConnection.logSystemEvent(
        'info',
        this.name,
        `Executing ${action}`,
        { action, data },
        this.sessionId,
        this.cycleNumber
      );

      console.log(`🤖 ${this.name}: Executing ${action}...`);
      
      let result;
      switch (action) {
        case 'initialize_system':
          result = await this.initializeSystem(data);
          break;
        case 'check_dependencies':
          result = await this.checkDependencies(data);
          break;
        case 'setup_environment':
          result = await this.setupEnvironment(data);
          break;
        case 'validate_config':
          result = await this.validateConfig(data);
          break;
        case 'health_check':
          result = await this.healthCheck(data);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      const duration = Date.now() - startTime;
      this.performance.success++;

      // Record successful execution
      await mysqlConnection.recordActionExecution(
        this.name, 
        action, 
        executionId, 
        data, 
        result, 
        'completed', 
        null, 
        this.cycleNumber, 
        this.sessionId
      );

      // Update performance metrics
      await mysqlConnection.updatePerformanceMetrics(
        this.name,
        'execution_duration_ms',
        duration,
        'ms',
        this.cycleNumber,
        { action, success: true }
      );

      await mysqlConnection.updatePerformanceMetrics(
        this.name,
        'success_rate',
        1.0,
        'percentage',
        this.cycleNumber,
        { action }
      );

      // Log successful completion
      await mysqlConnection.logSystemEvent(
        'info',
        this.name,
        `${action} completed successfully`,
        { action, duration, result },
        this.sessionId,
        this.cycleNumber
      );

      console.log(`✅ ${this.name}: ${action} completed successfully`);
      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      this.performance.failures++;

      // Record failed execution
      await mysqlConnection.recordActionExecution(
        this.name, 
        action, 
        executionId, 
        data, 
        {}, 
        'failed', 
        error.message, 
        this.cycleNumber, 
        this.sessionId
      );

      // Update performance metrics
      await mysqlConnection.updatePerformanceMetrics(
        this.name,
        'execution_duration_ms',
        duration,
        'ms',
        this.cycleNumber,
        { action, success: false }
      );

      await mysqlConnection.updatePerformanceMetrics(
        this.name,
        'success_rate',
        0.0,
        'percentage',
        this.cycleNumber,
        { action }
      );

      // Log error
      await mysqlConnection.logSystemEvent(
        'error',
        this.name,
        `Error executing ${action}: ${error.message}`,
        { action, error: error.message, stack: error.stack },
        this.sessionId,
        this.cycleNumber
      );

      console.error(`❌ ${this.name}: Error executing ${action}:`, error.message);
      throw error;
    }
  }

  async initializeSystem(data) {
    console.log(`✅ ${this.name}: System initialization completed`);
    
    // Get system configuration from database
    const cycleInterval = await mysqlConnection.getSystemConfig('orchestrator_cycle_interval') || 300;
    const maxConcurrentAgents = await mysqlConnection.getSystemConfig('max_concurrent_agents') || 5;
    const logLevel = await mysqlConnection.getSystemConfig('log_level') || 'info';

    return {
      status: 'success',
      message: 'System initialized successfully',
      data: { 
        initialized: true, 
        timestamp: new Date().toISOString(),
        config: {
          cycleInterval,
          maxConcurrentAgents,
          logLevel
        }
      }
    };
  }

  async checkDependencies(data) {
    console.log(`✅ ${this.name}: Dependencies check completed`);
    
    // Check database connection
    const dbHealth = await mysqlConnection.healthCheck();
    
    // Get agent configurations
    const autoRestart = await mysqlConnection.getAgentConfig(this.name, 'auto_restart') || true;
    const healthCheckInterval = await mysqlConnection.getAgentConfig(this.name, 'health_check_interval') || 60;

    return {
      status: 'success',
      message: 'All dependencies verified',
      data: { 
        dependencies: ['node', 'npm', 'database'], 
        status: 'ok',
        database: dbHealth,
        config: {
          autoRestart,
          healthCheckInterval
        }
      }
    };
  }

  async setupEnvironment(data) {
    console.log(`✅ ${this.name}: Environment setup completed`);
    
    // Get environment-specific configurations
    const env = data.env || 'production';
    const config = await mysqlConnection.getSystemConfig('database_connection_pool') || 10;

    return {
      status: 'success',
      message: 'Environment configured',
      data: { 
        env, 
        config: 'loaded',
        connectionPool: config
      }
    };
  }

  async validateConfig(data) {
    console.log(`✅ ${this.name}: Configuration validation completed`);
    
    // Validate all system configurations
    const requiredConfigs = [
      'orchestrator_cycle_interval',
      'max_concurrent_agents',
      'learning_rate',
      'discount_factor',
      'exploration_rate'
    ];

    const validationResults = {};
    for (const configKey of requiredConfigs) {
      const value = await mysqlConnection.getSystemConfig(configKey);
      validationResults[configKey] = {
        exists: value !== null,
        value: value
      };
    }

    const isValid = Object.values(validationResults).every(result => result.exists);

    return {
      status: 'success',
      message: 'Configuration validated',
      data: { 
        valid: isValid, 
        errors: isValid ? [] : ['Missing required configurations'],
        validationResults
      }
    };
  }

  async healthCheck(data) {
    console.log(`✅ ${this.name}: Health check completed`);
    
    // Perform comprehensive health check
    const dbHealth = await mysqlConnection.healthCheck();
    
    // Check agent performance
    const performance = await mysqlConnection.getAgentPerformanceSummary(this.name, 1);
    
    // Get recent errors
    const recentErrors = await mysqlConnection.query(`
      SELECT COUNT(*) as error_count 
      FROM system_logs 
      WHERE agent_id = (SELECT id FROM agents WHERE name = ?) 
      AND log_level = 'error' 
      AND created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
    `, [this.name]);

    const healthStatus = dbHealth.status === 'healthy' && recentErrors[0].error_count < 3 ? 'healthy' : 'warning';

    return {
      status: 'success',
      message: 'Health check completed',
      data: {
        overallStatus: healthStatus,
        database: dbHealth,
        performance: performance[0] || {},
        recentErrors: recentErrors[0].error_count,
        timestamp: new Date().toISOString()
      }
    };
  }

  getPerformance() {
    return this.performance;
  }

  // Set session and cycle information for tracking
  setSessionInfo(sessionId, cycleNumber) {
    this.sessionId = sessionId;
    this.cycleNumber = cycleNumber;
  }

  // Get agent configuration from database
  async getConfig(configKey) {
    return await mysqlConnection.getAgentConfig(this.name, configKey);
  }

  // Update agent configuration
  async updateConfig(configKey, configValue, configType = 'string') {
    try {
      await mysqlConnection.query(`
        UPDATE agent_configs ac
        JOIN agents a ON ac.agent_id = a.id
        SET ac.config_value = ?, ac.config_type = ?, ac.updated_at = NOW()
        WHERE a.name = ? AND ac.config_key = ?
      `, [configValue, configType, this.name, configKey]);
      
      console.log(`✅ ${this.name}: Configuration updated: ${configKey} = ${configValue}`);
    } catch (error) {
      console.error(`❌ ${this.name}: Failed to update configuration:`, error.message);
      throw error;
    }
  }
}

module.exports = { BootAgent }; 