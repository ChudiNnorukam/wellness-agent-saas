const mysqlConnection = require('../../database/mysql-connection');
const { randomUUID } = require('crypto');
const open = require('open');

class CredentialNavigationAgent {
  constructor() {
    this.name = 'CredentialNavigationAgent';
    this.description = 'Navigates users to exact API credential locations and guides setup process';
    this.state = 'idle';
    this.performance = { actions: 0, success: 0, failures: 0 };
    this.sessionId = null;
    this.cycleNumber = null;
    
    // Service configurations with exact URLs and navigation paths
    this.serviceConfigs = {
      stripe: {
        name: 'Stripe',
        baseUrl: 'https://dashboard.stripe.com',
        credentials: {
          publishable_key: {
            path: '/apikeys',
            description: 'Publishable Key (starts with pk_test_ or pk_live_)',
            selector: '[data-testid="publishable-key"]',
            instructions: [
              '1. Go to Developers → API keys',
              '2. Copy the "Publishable key" (starts with pk_test_ or pk_live_)',
              '3. This key is safe to expose in frontend code'
            ]
          },
          secret_key: {
            path: '/apikeys',
            description: 'Secret Key (starts with sk_test_ or sk_live_)',
            selector: '[data-testid="secret-key"]',
            instructions: [
              '1. Go to Developers → API keys',
              '2. Click "Reveal test key" or "Reveal live key"',
              '3. Copy the "Secret key" (starts with sk_test_ or sk_live_)',
              '4. ⚠️ Keep this key secret - never expose in frontend code'
            ]
          },
          webhook_secret: {
            path: '/webhooks',
            description: 'Webhook Endpoint Secret',
            selector: '[data-testid="webhook-secret"]',
            instructions: [
              '1. Go to Developers → Webhooks',
              '2. Click on your webhook endpoint',
              '3. Scroll to "Signing secret"',
              '4. Click "Reveal" and copy the secret',
              '5. This starts with whsec_'
            ]
          }
        }
      },
      supabase: {
        name: 'Supabase',
        baseUrl: 'https://supabase.com',
        credentials: {
          project_url: {
            path: '/dashboard/project/[project-id]/settings/api',
            description: 'Project URL',
            selector: '[data-testid="project-url"]',
            instructions: [
              '1. Go to your project dashboard',
              '2. Navigate to Settings → API',
              '3. Copy the "Project URL" (ends with .supabase.co)'
            ]
          },
          anon_key: {
            path: '/dashboard/project/[project-id]/settings/api',
            description: 'Anon/Public Key',
            selector: '[data-testid="anon-key"]',
            instructions: [
              '1. Go to Settings → API',
              '2. Copy the "anon public" key',
              '3. This key is safe to expose in frontend code'
            ]
          },
          service_role_key: {
            path: '/dashboard/project/[project-id]/settings/api',
            description: 'Service Role Key',
            selector: '[data-testid="service-role-key"]',
            instructions: [
              '1. Go to Settings → API',
              '2. Copy the "service_role" key',
              '3. ⚠️ Keep this key secret - has admin privileges'
            ]
          }
        }
      },
      mysql: {
        name: 'MySQL Database',
        baseUrl: 'https://cloud.mysql.com',
        credentials: {
          host: {
            path: '/databases/[db-id]/overview',
            description: 'Database Host',
            selector: '[data-testid="host"]',
            instructions: [
              '1. Go to your database overview',
              '2. Copy the "Host" value',
              '3. Usually something like: your-db.mysql.database.azure.com'
            ]
          },
          port: {
            path: '/databases/[db-id]/overview',
            description: 'Database Port',
            selector: '[data-testid="port"]',
            instructions: [
              '1. Go to your database overview',
              '2. Copy the "Port" value',
              '3. Usually 3306 for MySQL'
            ]
          },
          username: {
            path: '/databases/[db-id]/users',
            description: 'Database Username',
            selector: '[data-testid="username"]',
            instructions: [
              '1. Go to Users section',
              '2. Copy your database username',
              '3. Usually your database name or a custom username'
            ]
          },
          password: {
            path: '/databases/[db-id]/users',
            description: 'Database Password',
            selector: '[data-testid="password"]',
            instructions: [
              '1. Go to Users section',
              '2. Click "Reset password" or copy existing password',
              '3. ⚠️ Keep this password secure'
            ]
          }
        }
      },
      vercel: {
        name: 'Vercel',
        baseUrl: 'https://vercel.com',
        credentials: {
          project_id: {
            path: '/dashboard/[team]/[project]/settings',
            description: 'Project ID',
            selector: '[data-testid="project-id"]',
            instructions: [
              '1. Go to your project dashboard',
              '2. Navigate to Settings → General',
              '3. Copy the "Project ID"'
            ]
          },
          deployment_url: {
            path: '/dashboard/[team]/[project]/deployments',
            description: 'Deployment URL',
            selector: '[data-testid="deployment-url"]',
            instructions: [
              '1. Go to Deployments tab',
              '2. Copy the production deployment URL',
              '3. Usually: https://your-project.vercel.app'
            ]
          }
        }
      },
      openai: {
        name: 'OpenAI',
        baseUrl: 'https://platform.openai.com',
        credentials: {
          api_key: {
            path: '/api-keys',
            description: 'API Key',
            selector: '[data-testid="api-key"]',
            instructions: [
              '1. Go to API Keys section',
              '2. Click "Create new secret key"',
              '3. Copy the generated key (starts with sk-)',
              '4. ⚠️ Keep this key secret'
            ]
          }
        }
      },
      google: {
        name: 'Google Cloud',
        baseUrl: 'https://console.cloud.google.com',
        credentials: {
          project_id: {
            path: '/apis/credentials',
            description: 'Project ID',
            selector: '[data-testid="project-id"]',
            instructions: [
              '1. Go to APIs & Services → Credentials',
              '2. Copy your Project ID from the top',
              '3. Usually in format: your-project-name-123456'
            ]
          },
          service_account_key: {
            path: '/apis/credentials',
            description: 'Service Account Key',
            selector: '[data-testid="service-account"]',
            instructions: [
              '1. Go to APIs & Services → Credentials',
              '2. Click on your service account',
              '3. Go to Keys tab',
              '4. Click "Add Key" → "Create new key"',
              '5. Choose JSON format and download',
              '6. Copy the entire JSON content'
            ]
          }
        }
      }
    };
  }

  async execute(action, data = {}) {
    const executionId = randomUUID();
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

      console.log(`🤖 ${this.name}: Executing ${action}...`);
      
      let result;
      switch (action) {
        case 'navigate_to_credentials':
          result = await this.navigateToCredentials(data);
          break;
        case 'check_login_status':
          result = await this.checkLoginStatus(data);
          break;
        case 'guide_setup_process':
          result = await this.guideSetupProcess(data);
          break;
        case 'validate_credentials':
          result = await this.validateCredentials(data);
          break;
        case 'open_service_dashboard':
          result = await this.openServiceDashboard(data);
          break;
        case 'get_credential_instructions':
          result = await this.getCredentialInstructions(data);
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

      console.error(`❌ ${this.name}: Error executing ${action}:`, error.message);
      throw error;
    }
  }

  async navigateToCredentials(data) {
    const { service, credentialType } = data;
    
    if (!this.serviceConfigs[service]) {
      throw new Error(`Unknown service: ${service}`);
    }

    const serviceConfig = this.serviceConfigs[service];
    const credentialConfig = serviceConfig.credentials[credentialType];
    
    if (!credentialConfig) {
      throw new Error(`Unknown credential type: ${credentialType} for service: ${service}`);
    }

    const fullUrl = `${serviceConfig.baseUrl}${credentialConfig.path}`;
    
    console.log(`🌐 Opening ${serviceConfig.name} dashboard...`);
    console.log(`📍 Navigating to: ${fullUrl}`);
    console.log(`🎯 Looking for: ${credentialConfig.description}`);
    
    try {
      // Open the browser to the exact page
      await open(fullUrl);
    } catch (error) {
      console.log(`\n🌐 Manual Navigation Required:`);
      console.log(`Please manually open: ${fullUrl}`);
    }
    
    // Display step-by-step instructions
    console.log('\n📋 Step-by-step instructions:');
    credentialConfig.instructions.forEach((instruction, index) => {
      console.log(`   ${instruction}`);
    });
    
    // Store navigation history
    await mysqlConnection.logSystemEvent(
      'info',
      this.name,
      `Navigated to ${serviceConfig.name} credentials`,
      { service, credentialType, url: fullUrl },
      this.sessionId,
      this.cycleNumber
    );

    return {
      status: 'success',
      message: `Opened ${serviceConfig.name} dashboard for ${credentialType}`,
      data: {
        service: serviceConfig.name,
        credentialType,
        url: fullUrl,
        description: credentialConfig.description,
        instructions: credentialConfig.instructions,
        selector: credentialConfig.selector
      }
    };
  }

  async checkLoginStatus(data) {
    const { service } = data;
    
    if (!this.serviceConfigs[service]) {
      throw new Error(`Unknown service: ${service}`);
    }

    const serviceConfig = this.serviceConfigs[service];
    const loginUrl = serviceConfig.baseUrl;
    
    console.log(`🔍 Checking login status for ${serviceConfig.name}...`);
    
    try {
      // Open the service dashboard to check login status
      await open(loginUrl);
      
      console.log(`\n🔐 Login Status Check for ${serviceConfig.name}:`);
      console.log(`1. Browser opened to: ${loginUrl}`);
      console.log(`2. Check if you're logged in`);
      console.log(`3. If not logged in, please log in first`);
      console.log(`4. Once logged in, run the credential navigation again`);
    } catch (error) {
      console.log(`\n🔐 Login Status Check for ${serviceConfig.name}:`);
      console.log(`1. Please manually open: ${loginUrl}`);
      console.log(`2. Check if you're logged in`);
      console.log(`3. If not logged in, please log in first`);
      console.log(`4. Once logged in, run the credential navigation again`);
    }

    return {
      status: 'success',
      message: `Opened ${serviceConfig.name} for login check`,
      data: {
        service: serviceConfig.name,
        loginUrl,
        needsLogin: true
      }
    };
  }

  async guideSetupProcess(data) {
    const { service, step } = data;
    
    if (!this.serviceConfigs[service]) {
      throw new Error(`Unknown service: ${service}`);
    }

    const serviceConfig = this.serviceConfigs[service];
    const allCredentials = Object.keys(serviceConfig.credentials);
    
    console.log(`📚 Setup Guide for ${serviceConfig.name}:`);
    console.log(`\n🔑 Required Credentials:`);
    allCredentials.forEach((credType, index) => {
      const config = serviceConfig.credentials[credType];
      console.log(`   ${index + 1}. ${config.description}`);
    });
    
    console.log(`\n🚀 Quick Setup Steps:`);
    console.log(`1. Run: agent.navigate('${service}', '${allCredentials[0]}')`);
    console.log(`2. Follow the instructions in your browser`);
    console.log(`3. Copy the credential value`);
    console.log(`4. Repeat for each credential type`);
    console.log(`5. Update your .env file with the values`);

    return {
      status: 'success',
      message: `Setup guide generated for ${serviceConfig.name}`,
      data: {
        service: serviceConfig.name,
        credentials: allCredentials,
        setupSteps: [
          'Navigate to each credential page',
          'Copy the credential values',
          'Update environment variables',
          'Test the connection'
        ]
      }
    };
  }

  async validateCredentials(data) {
    const { service, credentials } = data;
    
    if (!this.serviceConfigs[service]) {
      throw new Error(`Unknown service: ${service}`);
    }

    const serviceConfig = this.serviceConfigs[service];
    const validationResults = {};
    
    console.log(`🔍 Validating ${serviceConfig.name} credentials...`);
    
    for (const [credType, value] of Object.entries(credentials)) {
      const config = serviceConfig.credentials[credType];
      if (!config) continue;
      
      const isValid = this.validateCredentialFormat(service, credType, value);
      validationResults[credType] = {
        valid: isValid,
        description: config.description,
        format: this.getExpectedFormat(service, credType)
      };
      
      console.log(`   ${credType}: ${isValid ? '✅' : '❌'} ${config.description}`);
    }

    return {
      status: 'success',
      message: `Credential validation completed for ${serviceConfig.name}`,
      data: {
        service: serviceConfig.name,
        validationResults,
        allValid: Object.values(validationResults).every(r => r.valid)
      }
    };
  }

  async openServiceDashboard(data) {
    const { service } = data;
    
    if (!this.serviceConfigs[service]) {
      throw new Error(`Unknown service: ${service}`);
    }

    const serviceConfig = this.serviceConfigs[service];
    
    console.log(`🌐 Opening ${serviceConfig.name} main dashboard...`);
    try {
      await open(serviceConfig.baseUrl);
    } catch (error) {
      console.log(`\n🌐 Manual Navigation Required:`);
      console.log(`Please manually open: ${serviceConfig.baseUrl}`);
    }
    
    console.log(`\n📋 Available credential types for ${serviceConfig.name}:`);
    Object.entries(serviceConfig.credentials).forEach(([credType, config]) => {
      console.log(`   • ${credType}: ${config.description}`);
    });

    return {
      status: 'success',
      message: `Opened ${serviceConfig.name} dashboard`,
      data: {
        service: serviceConfig.name,
        url: serviceConfig.baseUrl,
        availableCredentials: Object.keys(serviceConfig.credentials)
      }
    };
  }

  async getCredentialInstructions(data) {
    const { service, credentialType } = data;
    
    if (!this.serviceConfigs[service]) {
      throw new Error(`Unknown service: ${service}`);
    }

    const serviceConfig = this.serviceConfigs[service];
    const credentialConfig = serviceConfig.credentials[credentialType];
    
    if (!credentialConfig) {
      throw new Error(`Unknown credential type: ${credentialType} for service: ${service}`);
    }

    return {
      status: 'success',
      message: `Instructions retrieved for ${credentialType}`,
      data: {
        service: serviceConfig.name,
        credentialType,
        description: credentialConfig.description,
        instructions: credentialConfig.instructions,
        expectedFormat: this.getExpectedFormat(service, credentialType),
        url: `${serviceConfig.baseUrl}${credentialConfig.path}`
      }
    };
  }

  validateCredentialFormat(service, credentialType, value) {
    const patterns = {
      stripe: {
        publishable_key: /^pk_(test|live)_[a-zA-Z0-9]{24}$/,
        secret_key: /^sk_(test|live)_[a-zA-Z0-9]{24}$/,
        webhook_secret: /^whsec_[a-zA-Z0-9]{32,}$/
      },
      supabase: {
        project_url: /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/,
        anon_key: /^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/,
        service_role_key: /^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/
      },
      mysql: {
        host: /^[a-zA-Z0-9.-]+$/,
        port: /^\d{1,5}$/,
        username: /^[a-zA-Z0-9_-]+$/,
        password: /^.+$/
      },
      openai: {
        api_key: /^sk-[a-zA-Z0-9]{32,}$/
      }
    };

    const servicePatterns = patterns[service];
    if (!servicePatterns || !servicePatterns[credentialType]) {
      return true; // No validation pattern available
    }

    return servicePatterns[credentialType].test(value);
  }

  getExpectedFormat(service, credentialType) {
    const formats = {
      stripe: {
        publishable_key: 'pk_test_... or pk_live_...',
        secret_key: 'sk_test_... or sk_live_...',
        webhook_secret: 'whsec_...'
      },
      supabase: {
        project_url: 'https://your-project.supabase.co',
        anon_key: 'eyJ... (JWT token)',
        service_role_key: 'eyJ... (JWT token)'
      },
      mysql: {
        host: 'your-db.mysql.database.azure.com',
        port: '3306',
        username: 'your_username',
        password: 'your_password'
      },
      openai: {
        api_key: 'sk-...'
      }
    };

    return formats[service]?.[credentialType] || 'varies';
  }

  // Helper method to get all available services
  getAvailableServices() {
    return Object.keys(this.serviceConfigs).map(service => ({
      name: service,
      displayName: this.serviceConfigs[service].name,
      credentials: Object.keys(this.serviceConfigs[service].credentials)
    }));
  }

  // Helper method to get all credentials for a service
  getServiceCredentials(service) {
    if (!this.serviceConfigs[service]) {
      return [];
    }
    
    return Object.entries(this.serviceConfigs[service].credentials).map(([key, config]) => ({
      key,
      description: config.description,
      path: config.path
    }));
  }

  getPerformance() {
    return this.performance;
  }

  setSessionInfo(sessionId, cycleNumber) {
    this.sessionId = sessionId;
    this.cycleNumber = cycleNumber;
  }
}

module.exports = { CredentialNavigationAgent }; 