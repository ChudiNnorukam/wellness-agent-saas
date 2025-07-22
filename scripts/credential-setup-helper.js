#!/usr/bin/env node

const { CredentialNavigationAgent } = require('./agents/CredentialNavigationAgent');
const mysqlConnection = require('../database/mysql-connection');
const fs = require('fs');
const path = require('path');

class CredentialSetupHelper {
  constructor() {
    this.agent = new CredentialNavigationAgent();
    this.envTemplate = this.loadEnvTemplate();
  }

  loadEnvTemplate() {
    const templatePath = path.join(__dirname, '../env.example');
    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf8');
    }
    return this.getDefaultEnvTemplate();
  }

  getDefaultEnvTemplate() {
    return `# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=ai_agents_db
MYSQL_CONNECTION_LIMIT=10

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe Configuration
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# OpenAI Configuration
OPENAI_API_KEY=

# Vercel Configuration
VERCEL_PROJECT_ID=
VERCEL_DEPLOYMENT_URL=

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=
GOOGLE_SERVICE_ACCOUNT_KEY=
`;
  }

  async start() {
    console.log('🔑 AI Agents Credential Setup Helper');
    console.log('=====================================\n');
    
    console.log('This helper will guide you through setting up all your API credentials.');
    console.log('It will open the exact pages where you need to find each credential.\n');

    const availableServices = this.agent.getAvailableServices();
    
    console.log('📋 Available Services:');
    availableServices.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.displayName} (${service.name})`);
    });

    console.log('\n🚀 Let\'s get started!');
    console.log('Choose an option:');
    console.log('1. Setup all credentials step-by-step');
    console.log('2. Setup specific service');
    console.log('3. Validate existing credentials');
    console.log('4. Generate .env file template');
    console.log('5. Exit');

    // For now, let's start with a guided setup
    await this.guidedSetup();
  }

  async guidedSetup() {
    console.log('\n🎯 Starting Guided Setup...\n');

    const services = this.agent.getAvailableServices();
    const credentials = {};

    for (const service of services) {
      console.log(`\n🔧 Setting up ${service.displayName}...`);
      
      // Check login status first
      await this.agent.execute('check_login_status', { service: service.name });
      
      console.log('\n⏳ Please log in if needed, then press Enter to continue...');
      await this.waitForUserInput();

      // Get setup guide
      const guide = await this.agent.execute('guide_setup_process', { service: service.name });
      
      // Navigate through each credential
      for (const credType of service.credentials) {
        console.log(`\n🔑 Setting up ${credType}...`);
        
        // Navigate to the credential page
        await this.agent.execute('navigate_to_credentials', {
          service: service.name,
          credentialType: credType
        });

        console.log('\n📋 Instructions displayed above. Please:');
        console.log('1. Follow the instructions in your browser');
        console.log('2. Copy the credential value');
        console.log('3. Enter it below (or press Enter to skip)');
        
        const value = await this.promptForCredential(credType);
        if (value && value.trim()) {
          credentials[`${service.name}_${credType}`] = value.trim();
          console.log('✅ Credential saved!');
        } else {
          console.log('⏭️ Skipped this credential');
        }
      }
    }

    // Validate all collected credentials
    console.log('\n🔍 Validating collected credentials...');
    await this.validateAllCredentials(credentials);

    // Generate .env file
    console.log('\n📝 Generating .env file...');
    await this.generateEnvFile(credentials);

    console.log('\n🎉 Setup completed!');
    console.log('Your .env file has been generated with all your credentials.');
    console.log('You can now start your AI agents with: npm start');
  }

  async promptForCredential(credentialType) {
    // In a real implementation, you'd use readline or a similar library
    // For now, we'll simulate user input
    return new Promise((resolve) => {
      // Simulate user input - in real implementation, use readline
      setTimeout(() => {
        resolve(''); // Return empty for now
      }, 1000);
    });
  }

  async waitForUserInput() {
    // In a real implementation, you'd use readline
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }

  async validateAllCredentials(credentials) {
    const services = this.agent.getAvailableServices();
    
    for (const service of services) {
      const serviceCredentials = {};
      
      // Group credentials by service
      for (const [key, value] of Object.entries(credentials)) {
        if (key.startsWith(`${service.name}_`)) {
          const credType = key.replace(`${service.name}_`, '');
          serviceCredentials[credType] = value;
        }
      }

      if (Object.keys(serviceCredentials).length > 0) {
        console.log(`\n🔍 Validating ${service.displayName} credentials...`);
        const validation = await this.agent.execute('validate_credentials', {
          service: service.name,
          credentials: serviceCredentials
        });

        if (validation.data.allValid) {
          console.log(`✅ All ${service.displayName} credentials are valid!`);
        } else {
          console.log(`⚠️ Some ${service.displayName} credentials may be invalid.`);
          Object.entries(validation.data.validationResults).forEach(([credType, result]) => {
            if (!result.valid) {
              console.log(`   ❌ ${credType}: Expected format: ${result.format}`);
            }
          });
        }
      }
    }
  }

  async generateEnvFile(credentials) {
    let envContent = this.envTemplate;

    // Map credentials to environment variables
    const envMappings = {
      'stripe_publishable_key': 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'stripe_secret_key': 'STRIPE_SECRET_KEY',
      'stripe_webhook_secret': 'STRIPE_WEBHOOK_SECRET',
      'supabase_project_url': 'NEXT_PUBLIC_SUPABASE_URL',
      'supabase_anon_key': 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'supabase_service_role_key': 'SUPABASE_SERVICE_ROLE_KEY',
      'mysql_host': 'MYSQL_HOST',
      'mysql_port': 'MYSQL_PORT',
      'mysql_username': 'MYSQL_USER',
      'mysql_password': 'MYSQL_PASSWORD',
      'openai_api_key': 'OPENAI_API_KEY',
      'vercel_project_id': 'VERCEL_PROJECT_ID',
      'vercel_deployment_url': 'VERCEL_DEPLOYMENT_URL',
      'google_project_id': 'GOOGLE_CLOUD_PROJECT_ID',
      'google_service_account_key': 'GOOGLE_SERVICE_ACCOUNT_KEY'
    };

    // Replace placeholders with actual values
    for (const [credKey, value] of Object.entries(credentials)) {
      const envVar = envMappings[credKey];
      if (envVar && value) {
        const regex = new RegExp(`^${envVar}=.*$`, 'm');
        if (regex.test(envContent)) {
          envContent = envContent.replace(regex, `${envVar}=${value}`);
        } else {
          envContent += `\n${envVar}=${value}`;
        }
      }
    }

    // Write to .env file
    const envPath = path.join(__dirname, '../.env');
    fs.writeFileSync(envPath, envContent);
    
    console.log(`✅ .env file generated at: ${envPath}`);
  }

  async setupSpecificService(serviceName) {
    console.log(`\n🔧 Setting up ${serviceName}...`);
    
    const service = this.agent.getAvailableServices().find(s => s.name === serviceName);
    if (!service) {
      console.log(`❌ Service ${serviceName} not found`);
      return;
    }

    // Check login status
    await this.agent.execute('check_login_status', { service: serviceName });
    
    console.log('\n⏳ Please log in if needed, then press Enter to continue...');
    await this.waitForUserInput();

    // Get setup guide
    await this.agent.execute('guide_setup_process', { service: serviceName });
    
    // Navigate through each credential
    for (const credType of service.credentials) {
      console.log(`\n🔑 Setting up ${credType}...`);
      
      await this.agent.execute('navigate_to_credentials', {
        service: serviceName,
        credentialType: credType
      });

      console.log('\n📋 Follow the instructions in your browser to get the credential.');
      console.log('Press Enter when you have the value...');
      await this.waitForUserInput();
    }

    console.log(`\n✅ ${service.displayName} setup completed!`);
  }

  async validateExistingCredentials() {
    console.log('\n🔍 Validating existing credentials...');
    
    const envPath = path.join(__dirname, '../.env');
    if (!fs.existsSync(envPath)) {
      console.log('❌ No .env file found. Please run the setup first.');
      return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = this.parseEnvFile(envContent);
    
    const services = this.agent.getAvailableServices();
    
    for (const service of services) {
      const serviceCredentials = {};
      
      // Map environment variables to service credentials
      const mappings = this.getServiceEnvMappings(service.name);
      for (const [envVar, credType] of Object.entries(mappings)) {
        if (envVars[envVar]) {
          serviceCredentials[credType] = envVars[envVar];
        }
      }

      if (Object.keys(serviceCredentials).length > 0) {
        console.log(`\n🔍 Validating ${service.displayName} credentials...`);
        const validation = await this.agent.execute('validate_credentials', {
          service: service.name,
          credentials: serviceCredentials
        });

        if (validation.data.allValid) {
          console.log(`✅ All ${service.displayName} credentials are valid!`);
        } else {
          console.log(`⚠️ Some ${service.displayName} credentials may be invalid.`);
          Object.entries(validation.data.validationResults).forEach(([credType, result]) => {
            if (!result.valid) {
              console.log(`   ❌ ${credType}: Expected format: ${result.format}`);
            }
          });
        }
      } else {
        console.log(`\n⏭️ No ${service.displayName} credentials found in .env file`);
      }
    }
  }

  parseEnvFile(content) {
    const vars = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          vars[key] = valueParts.join('=');
        }
      }
    }
    
    return vars;
  }

  getServiceEnvMappings(serviceName) {
    const mappings = {
      stripe: {
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': 'publishable_key',
        'STRIPE_SECRET_KEY': 'secret_key',
        'STRIPE_WEBHOOK_SECRET': 'webhook_secret'
      },
      supabase: {
        'NEXT_PUBLIC_SUPABASE_URL': 'project_url',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'anon_key',
        'SUPABASE_SERVICE_ROLE_KEY': 'service_role_key'
      },
      mysql: {
        'MYSQL_HOST': 'host',
        'MYSQL_PORT': 'port',
        'MYSQL_USER': 'username',
        'MYSQL_PASSWORD': 'password'
      },
      openai: {
        'OPENAI_API_KEY': 'api_key'
      },
      vercel: {
        'VERCEL_PROJECT_ID': 'project_id',
        'VERCEL_DEPLOYMENT_URL': 'deployment_url'
      },
      google: {
        'GOOGLE_CLOUD_PROJECT_ID': 'project_id',
        'GOOGLE_SERVICE_ACCOUNT_KEY': 'service_account_key'
      }
    };

    return mappings[serviceName] || {};
  }

  async generateEnvTemplate() {
    console.log('\n📝 Generating .env template...');
    
    const templatePath = path.join(__dirname, '../env.template');
    fs.writeFileSync(templatePath, this.envTemplate);
    
    console.log(`✅ Template generated at: ${templatePath}`);
    console.log('You can copy this to .env and fill in your values.');
  }
}

// CLI interface
async function main() {
  const helper = new CredentialSetupHelper();
  
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    await helper.start();
  } else {
    const command = args[0];
    
    switch (command) {
      case 'setup':
        await helper.guidedSetup();
        break;
      case 'service':
        if (args[1]) {
          await helper.setupSpecificService(args[1]);
        } else {
          console.log('❌ Please specify a service name');
        }
        break;
      case 'validate':
        await helper.validateExistingCredentials();
        break;
      case 'template':
        await helper.generateEnvTemplate();
        break;
      case 'help':
        console.log('Available commands:');
        console.log('  setup     - Run guided setup for all services');
        console.log('  service   - Setup specific service (e.g., stripe, supabase)');
        console.log('  validate  - Validate existing credentials in .env');
        console.log('  template  - Generate .env template');
        console.log('  help      - Show this help');
        break;
      default:
        console.log(`❌ Unknown command: ${command}`);
        console.log('Run "node credential-setup-helper.js help" for available commands');
    }
  }
}

// Run if this script is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = CredentialSetupHelper; 