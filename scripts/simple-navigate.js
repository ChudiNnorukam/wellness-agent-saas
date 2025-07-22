#!/usr/bin/env node

const open = require('open');

// Service configurations with exact URLs and navigation paths
const serviceConfigs = {
  stripe: {
    name: 'Stripe',
    baseUrl: 'https://dashboard.stripe.com',
    credentials: {
      publishable_key: {
        path: '/apikeys',
        description: 'Publishable Key (starts with pk_test_ or pk_live_)',
        instructions: [
          '1. Go to Developers → API keys',
          '2. Copy the "Publishable key" (starts with pk_test_ or pk_live_)',
          '3. This key is safe to expose in frontend code'
        ]
      },
      secret_key: {
        path: '/apikeys',
        description: 'Secret Key (starts with sk_test_ or sk_live_)',
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
        instructions: [
          '1. Go to your project dashboard',
          '2. Navigate to Settings → API',
          '3. Copy the "Project URL" (ends with .supabase.co)'
        ]
      },
      anon_key: {
        path: '/dashboard/project/[project-id]/settings/api',
        description: 'Anon/Public Key',
        instructions: [
          '1. Go to Settings → API',
          '2. Copy the "anon public" key',
          '3. This key is safe to expose in frontend code'
        ]
      },
      service_role_key: {
        path: '/dashboard/project/[project-id]/settings/api',
        description: 'Service Role Key',
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
        instructions: [
          '1. Go to your database overview',
          '2. Copy the "Host" value',
          '3. Usually something like: your-db.mysql.database.azure.com'
        ]
      },
      port: {
        path: '/databases/[db-id]/overview',
        description: 'Database Port',
        instructions: [
          '1. Go to your database overview',
          '2. Copy the "Port" value',
          '3. Usually 3306 for MySQL'
        ]
      },
      username: {
        path: '/databases/[db-id]/users',
        description: 'Database Username',
        instructions: [
          '1. Go to Users section',
          '2. Copy your database username',
          '3. Usually your database name or a custom username'
        ]
      },
      password: {
        path: '/databases/[db-id]/users',
        description: 'Database Password',
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
        instructions: [
          '1. Go to your project dashboard',
          '2. Navigate to Settings → General',
          '3. Copy the "Project ID"'
        ]
      },
      deployment_url: {
        path: '/dashboard/[team]/[project]/deployments',
        description: 'Deployment URL',
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
        instructions: [
          '1. Go to APIs & Services → Credentials',
          '2. Copy your Project ID from the top',
          '3. Usually in format: your-project-name-123456'
        ]
      },
      service_account_key: {
        path: '/apis/credentials',
        description: 'Service Account Key',
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

async function simpleNavigate() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🔑 Simple Credential Navigation Tool');
    console.log('====================================\n');
    
    const services = Object.keys(serviceConfigs);
    
    console.log('📋 Available Services:');
    services.forEach((service, index) => {
      console.log(`   ${index + 1}. ${serviceConfigs[service].name} (${service})`);
    });
    
    console.log('\n🚀 Usage Examples:');
    console.log('  node simple-navigate.js stripe publishable_key');
    console.log('  node simple-navigate.js supabase anon_key');
    console.log('  node simple-navigate.js mysql host');
    console.log('  node simple-navigate.js openai api_key');
    console.log('  node simple-navigate.js vercel project_id');
    console.log('  node simple-navigate.js google project_id');
    
    console.log('\n📋 Available Credentials by Service:');
    services.forEach(service => {
      console.log(`\n${serviceConfigs[service].name}:`);
      Object.entries(serviceConfigs[service].credentials).forEach(([key, config]) => {
        console.log(`   • ${key}: ${config.description}`);
      });
    });
    
    return;
  }
  
  const service = args[0];
  const credentialType = args[1];
  
  if (!serviceConfigs[service]) {
    console.log(`❌ Unknown service: ${service}`);
    console.log('\n📋 Available services:');
    Object.keys(serviceConfigs).forEach(serviceName => {
      console.log(`   • ${serviceName}: ${serviceConfigs[serviceName].name}`);
    });
    return;
  }
  
  if (!credentialType) {
    console.log(`❌ Please specify a credential type for ${service}`);
    console.log('Usage: node simple-navigate.js <service> <credential_type>');
    
    const serviceConfig = serviceConfigs[service];
    console.log(`\n📋 Available credentials for ${serviceConfig.name}:`);
    Object.entries(serviceConfig.credentials).forEach(([key, config]) => {
      console.log(`   • ${key}: ${config.description}`);
    });
    
    return;
  }
  
  const serviceConfig = serviceConfigs[service];
  const credentialConfig = serviceConfig.credentials[credentialType];
  
  if (!credentialConfig) {
    console.log(`❌ Unknown credential type: ${credentialType} for service: ${service}`);
    console.log(`\n📋 Available credentials for ${serviceConfig.name}:`);
    Object.entries(serviceConfig.credentials).forEach(([key, config]) => {
      console.log(`   • ${key}: ${config.description}`);
    });
    return;
  }
  
  const fullUrl = `${serviceConfig.baseUrl}${credentialConfig.path}`;
  
  console.log(`🌐 Navigating to ${serviceConfig.name}...`);
  console.log(`📍 URL: ${fullUrl}`);
  console.log(`🎯 Looking for: ${credentialConfig.description}`);
  
  try {
    // Open the browser to the exact page
    await open(fullUrl);
    console.log('✅ Browser opened successfully!');
  } catch (error) {
    console.log('⚠️ Could not open browser automatically');
    console.log(`Please manually open: ${fullUrl}`);
  }
  
  // Display step-by-step instructions
  console.log('\n📋 Step-by-step instructions:');
  credentialConfig.instructions.forEach((instruction, index) => {
    console.log(`   ${instruction}`);
  });
  
  console.log('\n💡 Tip: Copy the credential value and update your .env file');
}

// Run if this script is executed directly
if (require.main === module) {
  simpleNavigate().catch(console.error);
}

module.exports = simpleNavigate; 