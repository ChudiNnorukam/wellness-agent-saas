#!/usr/bin/env node

const mysqlConnection = require('../database/mysql-connection');

async function testDatabaseConnection() {
  console.log('🧪 Testing MySQL Database Connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...');
    const health = await mysqlConnection.healthCheck();
    console.log('✅ Connection health:', health);

    // Test 2: Query agents
    console.log('\n2️⃣ Testing agent queries...');
    const agents = await mysqlConnection.query('SELECT name, status FROM agents ORDER BY name');
    console.log('✅ Found agents:', agents.length);
    agents.forEach(agent => {
      console.log(`   • ${agent.name} (${agent.status})`);
    });

    // Test 3: Query actions
    console.log('\n3️⃣ Testing action queries...');
    const actions = await mysqlConnection.query(`
      SELECT a.name as agent_name, ac.action_name, ac.description 
      FROM actions ac 
      JOIN agents a ON ac.agent_id = a.id 
      ORDER BY a.name, ac.action_name
    `);
    console.log('✅ Found actions:', actions.length);
    actions.slice(0, 5).forEach(action => {
      console.log(`   • ${action.agent_name}: ${action.action_name}`);
    });

    // Test 4: Test system configuration
    console.log('\n4️⃣ Testing system configuration...');
    const cycleInterval = await mysqlConnection.getSystemConfig('orchestrator_cycle_interval');
    const maxAgents = await mysqlConnection.getSystemConfig('max_concurrent_agents');
    console.log('✅ System configs:');
    console.log(`   • Cycle interval: ${cycleInterval} seconds`);
    console.log(`   • Max agents: ${maxAgents}`);

    // Test 5: Test agent configuration
    console.log('\n5️⃣ Testing agent configuration...');
    const autoRestart = await mysqlConnection.getAgentConfig('BootAgent', 'auto_restart');
    const healthInterval = await mysqlConnection.getAgentConfig('BootAgent', 'health_check_interval');
    console.log('✅ BootAgent configs:');
    console.log(`   • Auto restart: ${autoRestart}`);
    console.log(`   • Health check interval: ${healthInterval} seconds`);

    // Test 6: Test performance metrics recording
    console.log('\n6️⃣ Testing performance metrics...');
    await mysqlConnection.updatePerformanceMetrics(
      'BootAgent',
      'test_metric',
      42.5,
      'units',
      null,
      { test: true, timestamp: new Date().toISOString() }
    );
    console.log('✅ Performance metric recorded');

    // Test 7: Test system logging
    console.log('\n7️⃣ Testing system logging...');
    await mysqlConnection.logSystemEvent(
      'info',
      'BootAgent',
      'Database connection test completed successfully',
      { test: true, timestamp: new Date().toISOString() }
    );
    console.log('✅ System log recorded');

    // Test 8: Test Q-Table operations
    console.log('\n8️⃣ Testing Q-Table operations...');
    const testStateHash = 'test_state_123';
    const testActionHash = 'test_action_456';
    
    await mysqlConnection.updateQValue(testStateHash, testActionHash, 0.75, 1);
    const qValue = await mysqlConnection.getQValue(testStateHash, testActionHash);
    console.log('✅ Q-Value recorded and retrieved:', qValue);

    // Test 9: Test stored procedures
    console.log('\n9️⃣ Testing stored procedures...');
    const performance = await mysqlConnection.getAgentPerformanceSummary('BootAgent', 1);
    console.log('✅ Agent performance summary:', performance);

    // Test 10: Test views
    console.log('\n🔟 Testing database views...');
    const overview = await mysqlConnection.query('SELECT * FROM agent_performance_overview LIMIT 3');
    console.log('✅ Agent performance overview:', overview.length, 'records');

    console.log('\n🎉 All database tests completed successfully!');
    console.log('\n📊 Database Statistics:');
    
    // Get some statistics
    const [tableCount] = await mysqlConnection.query(`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = 'ai_agents_db'
    `);
    
    const [agentCount] = await mysqlConnection.query('SELECT COUNT(*) as count FROM agents');
    const [actionCount] = await mysqlConnection.query('SELECT COUNT(*) as count FROM actions');
    const [configCount] = await mysqlConnection.query('SELECT COUNT(*) as count FROM system_config');
    
    console.log(`   • Tables: ${tableCount.count}`);
    console.log(`   • Agents: ${agentCount.count}`);
    console.log(`   • Actions: ${actionCount.count}`);
    console.log(`   • Configurations: ${configCount.count}`);

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    await mysqlConnection.disconnect();
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testDatabaseConnection();
}

module.exports = testDatabaseConnection; 