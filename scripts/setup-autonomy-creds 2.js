#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🤖 AI Agent Autonomy Credential Setup');
console.log('=====================================\n');

console.log('🔑 Setting up essential credentials for autonomous AI agents...\n');

// Essential credentials for autonomy
const essentialCredentials = [
  {
    service: 'stripe',
    credential: 'secret_key',
    description: 'Stripe Secret Key (for payment processing)',
    envVar: 'STRIPE_SECRET_KEY',
    critical: true
  },
  {
    service: 'supabase',
    credential: 'anon_key',
    description: 'Supabase Anon Key (for database & auth)',
    envVar: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    critical: true
  },
  {
    service: 'openai',
    credential: 'api_key',
    description: 'OpenAI API Key (for AI intelligence)',
    envVar: 'OPENAI_API_KEY',
    critical: true
  }
];

async function setupAutonomyCredentials() {
  console.log('📋 Essential Credentials for AI Agent Autonomy:\n');
  
  essentialCredentials.forEach((cred, index) => {
    console.log(`${index + 1}. ${cred.description}`);
    console.log(`   Service: ${cred.service.toUpperCase()}`);
    console.log(`   Env Var: ${cred.envVar}`);
    console.log(`   Critical: ${cred.critical ? '✅ YES' : '❌ NO'}\n`);
  });

  console.log('🚀 Starting autonomous credential setup...\n');

  for (const cred of essentialCredentials) {
    console.log(`🔧 Setting up ${cred.service.toUpperCase()} ${cred.credential}...`);
    console.log(`📝 ${cred.description}\n`);
    
    try {
      // Run the navigation command
      const command = `npm run nav ${cred.service} ${cred.credential}`;
      console.log(`Running: ${command}`);
      execSync(command, { stdio: 'inherit' });
      
      console.log(`\n✅ ${cred.service.toUpperCase()} ${cred.credential} navigation completed`);
      console.log('📋 Please follow the instructions above to get your credential\n');
      
      // Wait a moment for user to process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.log(`⚠️ Could not run navigation for ${cred.service} ${cred.credential}`);
      console.log(`Please run manually: npm run nav ${cred.service} ${cred.credential}\n`);
    }
  }

  console.log('🎯 Autonomy Credential Setup Complete!');
  console.log('=====================================\n');
  
  console.log('📝 Next Steps:');
  console.log('1. Copy each credential value from the browser');
  console.log('2. Update your .env file with the values:');
  console.log('   STRIPE_SECRET_KEY=sk_test_...');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...');
  console.log('   OPENAI_API_KEY=sk-...');
  console.log('\n3. Test your agents: npm start');
  
  console.log('\n🔍 To validate your setup, run:');
  console.log('   npm run setup-creds validate');
  
  console.log('\n🎉 Your AI agents will now be autonomous!');
}

// Run if this script is executed directly
if (require.main === module) {
  setupAutonomyCredentials().catch(console.error);
}

module.exports = setupAutonomyCredentials; 