#!/usr/bin/env node

const { CredentialNavigationAgent } = require('./agents/CredentialNavigationAgent');

async function quickNavigate() {
  const agent = new CredentialNavigationAgent();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🔑 Quick Credential Navigation Tool');
    console.log('===================================\n');
    
    const services = agent.getAvailableServices();
    
    console.log('📋 Available Services:');
    services.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.displayName} (${service.name})`);
    });
    
    console.log('\n🚀 Usage Examples:');
    console.log('  node quick-navigate.js stripe publishable_key');
    console.log('  node quick-navigate.js supabase anon_key');
    console.log('  node quick-navigate.js mysql host');
    console.log('  node quick-navigate.js openai api_key');
    console.log('  node quick-navigate.js vercel project_id');
    console.log('  node quick-navigate.js google project_id');
    
    console.log('\n📋 Available Credentials by Service:');
    services.forEach(service => {
      console.log(`\n${service.displayName}:`);
      const credentials = agent.getServiceCredentials(service.name);
      credentials.forEach(cred => {
        console.log(`   • ${cred.key}: ${cred.description}`);
      });
    });
    
    return;
  }
  
  const service = args[0];
  const credentialType = args[1];
  
  if (!credentialType) {
    console.log(`❌ Please specify a credential type for ${service}`);
    console.log('Usage: node quick-navigate.js <service> <credential_type>');
    
    const serviceConfig = agent.serviceConfigs[service];
    if (serviceConfig) {
      console.log(`\n📋 Available credentials for ${serviceConfig.name}:`);
      Object.entries(serviceConfig.credentials).forEach(([key, config]) => {
        console.log(`   • ${key}: ${config.description}`);
      });
    }
    
    return;
  }
  
  try {
    console.log(`🌐 Navigating to ${service} ${credentialType}...`);
    
    // Check login status first
    await agent.execute('check_login_status', { service });
    
    console.log('\n⏳ Please log in if needed, then press Enter to continue...');
    await waitForUserInput();
    
    // Navigate to the specific credential
    const result = await agent.execute('navigate_to_credentials', {
      service,
      credentialType
    });
    
    console.log('\n✅ Navigation completed!');
    console.log(`📍 URL: ${result.data.url}`);
    console.log(`🎯 Looking for: ${result.data.description}`);
    
    console.log('\n📋 Instructions:');
    result.data.instructions.forEach(instruction => {
      console.log(`   ${instruction}`);
    });
    
    console.log('\n💡 Tip: Copy the credential value and update your .env file');
    
  } catch (error) {
    console.error('❌ Navigation failed:', error.message);
    
    if (error.message.includes('Unknown service')) {
      console.log('\n📋 Available services:');
      const services = agent.getAvailableServices();
      services.forEach(service => {
        console.log(`   • ${service.name}: ${service.displayName}`);
      });
    } else if (error.message.includes('Unknown credential type')) {
      const serviceConfig = agent.serviceConfigs[service];
      if (serviceConfig) {
        console.log(`\n📋 Available credentials for ${serviceConfig.name}:`);
        Object.entries(serviceConfig.credentials).forEach(([key, config]) => {
          console.log(`   • ${key}: ${config.description}`);
        });
      }
    }
  }
}

function waitForUserInput() {
  return new Promise((resolve) => {
    // In a real implementation, you'd use readline
    // For now, we'll just wait a bit
    setTimeout(resolve, 2000);
  });
}

// Run if this script is executed directly
if (require.main === module) {
  quickNavigate().catch(console.error);
}

module.exports = quickNavigate; 