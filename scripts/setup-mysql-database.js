#!/usr/bin/env node

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

class MySQLDatabaseSetup {
  constructor() {
    this.config = this.loadConfig();
    this.connection = null;
  }

  loadConfig() {
    // Try to load from environment variables first
    const config = {
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      charset: 'utf8mb4',
      timezone: '+00:00',
      multipleStatements: true
    };

    // Try to load from config file if it exists
    const configPath = path.join(__dirname, '../database/mysql-config.json');
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
      console.log('🔌 Connecting to MySQL server...');
      this.connection = await mysql.createConnection({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        charset: this.config.charset,
        timezone: this.config.timezone,
        multipleStatements: this.config.multipleStatements
      });
      
      console.log('✅ Connected to MySQL server successfully');
      return this.connection;
    } catch (error) {
      console.error('❌ Failed to connect to MySQL server:', error.message);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log('🔌 Disconnected from MySQL server');
    }
  }

  async createDatabase() {
    try {
      console.log('🗄️ Creating database...');
      
      // Create database without specifying it in connection
      const createDbConfig = { ...this.config };
      delete createDbConfig.database;
      
      const tempConnection = await mysql.createConnection(createDbConfig);
      
      await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${this.config.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log(`✅ Database '${this.config.database}' created successfully`);
      
      await tempConnection.end();
    } catch (error) {
      console.error('❌ Failed to create database:', error.message);
      throw error;
    }
  }

  async runSchema() {
    try {
      console.log('📋 Running database schema...');
      
      const schemaPath = path.join(__dirname, '../database/ai_agents_mysql_schema.sql');
      
      if (!fs.existsSync(schemaPath)) {
        throw new Error(`Schema file not found: ${schemaPath}`);
      }
      
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Split schema into individual statements
      const statements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      console.log(`📝 Executing ${statements.length} SQL statements...`);
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement.trim()) {
          try {
            await this.connection.execute(statement);
            if (i % 10 === 0) {
              console.log(`   Progress: ${i + 1}/${statements.length} statements executed`);
            }
          } catch (error) {
            console.warn(`⚠️ Warning executing statement ${i + 1}:`, error.message);
            // Continue with other statements
          }
        }
      }
      
      console.log('✅ Database schema executed successfully');
    } catch (error) {
      console.error('❌ Failed to run schema:', error.message);
      throw error;
    }
  }

  async verifySetup() {
    try {
      console.log('🔍 Verifying database setup...');
      
      // Check if tables exist
      const [tables] = await this.connection.execute(`
        SELECT COUNT(*) as table_count 
        FROM information_schema.tables 
        WHERE table_schema = ?
      `, [this.config.database]);
      
      console.log(`📊 Found ${tables[0].table_count} tables in database`);
      
      // Check if agents were inserted
      const [agents] = await this.connection.execute('SELECT COUNT(*) as agent_count FROM agents');
      console.log(`🤖 Found ${agents[0].agent_count} agents in database`);
      
      // Check if actions were inserted
      const [actions] = await this.connection.execute('SELECT COUNT(*) as action_count FROM actions');
      console.log(`⚡ Found ${actions[0].action_count} actions in database`);
      
      // Check if configurations were inserted
      const [configs] = await this.connection.execute('SELECT COUNT(*) as config_count FROM system_config');
      console.log(`⚙️ Found ${configs[0].config_count} system configurations`);
      
      // List all agents
      const [agentList] = await this.connection.execute('SELECT name, status FROM agents ORDER BY name');
      console.log('\n📋 Registered Agents:');
      agentList.forEach(agent => {
        console.log(`   • ${agent.name} (${agent.status})`);
      });
      
      console.log('\n✅ Database setup verification completed successfully');
      return true;
    } catch (error) {
      console.error('❌ Database setup verification failed:', error.message);
      return false;
    }
  }

  async createUser() {
    try {
      const username = process.env.MYSQL_APP_USER || 'ai_agents_user';
      const password = process.env.MYSQL_APP_PASSWORD || 'ai_agents_password_2024';
      
      console.log(`👤 Creating application user '${username}'...`);
      
      // Create user
      await this.connection.execute(`CREATE USER IF NOT EXISTS '${username}'@'localhost' IDENTIFIED BY '${password}'`);
      
      // Grant privileges
      await this.connection.execute(`GRANT ALL PRIVILEGES ON ${this.config.database}.* TO '${username}'@'localhost'`);
      await this.connection.execute('FLUSH PRIVILEGES');
      
      console.log(`✅ User '${username}' created with full privileges on '${this.config.database}'`);
      
      // Update config file with new credentials
      const configPath = path.join(__dirname, '../database/mysql-config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        config.user = username;
        config.password = password;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log('✅ Updated mysql-config.json with new user credentials');
      }
      
      return { username, password };
    } catch (error) {
      console.error('❌ Failed to create user:', error.message);
      throw error;
    }
  }

  async run() {
    try {
      console.log('🚀 Starting MySQL Database Setup for AI Agents...\n');
      
      // Step 1: Connect to MySQL server
      await this.connect();
      
      // Step 2: Create database
      await this.createDatabase();
      
      // Step 3: Connect to the specific database
      await this.connection.execute(`USE ${this.config.database}`);
      console.log(`✅ Connected to database '${this.config.database}'`);
      
      // Step 4: Run schema
      await this.runSchema();
      
      // Step 5: Verify setup
      const verificationSuccess = await this.verifySetup();
      
      // Step 6: Create application user (optional)
      if (process.env.CREATE_APP_USER === 'true') {
        await this.createUser();
      }
      
      if (verificationSuccess) {
        console.log('\n🎉 MySQL Database Setup Completed Successfully!');
        console.log('\n📝 Next Steps:');
        console.log('1. Update your environment variables with database credentials');
        console.log('2. Test the connection with: node scripts/test-database-connection.js');
        console.log('3. Start your AI agents: npm start');
      } else {
        console.log('\n⚠️ Setup completed with warnings. Please check the output above.');
      }
      
    } catch (error) {
      console.error('\n❌ Database setup failed:', error.message);
      process.exit(1);
    } finally {
      await this.disconnect();
    }
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  const setup = new MySQLDatabaseSetup();
  setup.run();
}

module.exports = MySQLDatabaseSetup; 