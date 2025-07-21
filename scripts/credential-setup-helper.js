#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

class CredentialSetupHelper {
  constructor() {
    this.envFile = '.env.local';
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  readEnvFile() {
    if (fs.existsSync(this.envFile)) {
      return fs.readFileSync(this.envFile, 'utf8');
    }
    return '';
  }

  addEnvVariable(key, value) {
    let envContent = this.readEnvFile();
    
    // Remove existing entry if it exists
    const lines = envContent.split('\n').filter(line => !line.startsWith(`${key}=`));
    envContent = lines.join('\n');
    
    // Add new variable
    if (envContent && !envContent.endsWith('\n')) {
      envContent += '\n';
    }
    envContent += `${key}=${value}\n`;
    
    fs.writeFileSync(this.envFile, envContent);
    console.log(`✅ Added ${key} to .env.local`);
  }

  async setupGitHubCredentials() {
    console.log('\n🔧 SETTING UP GITHUB CREDENTIALS');
    console.log('==================================');
    console.log('You need a GitHub Personal Access Token with the following scopes:');
    console.log('- repo (Full control of private repositories)');
    console.log('- workflow (Update GitHub Action workflows)');
    console.log('- admin:org (Full control of organizations and teams)');
    console.log('\nTo create a token:');
    console.log('1. Go to https://github.com/settings/tokens');
    console.log('2. Click "Generate new token (classic)"');
    console.log('3. Select the required scopes');
    console.log('4. Copy the generated token\n');

    const token = await this.question('Enter your GitHub Personal Access Token: ');
    if (token.trim()) {
      this.addEnvVariable('GITHUB_TOKEN', token.trim());
    }

    const username = await this.question('Enter your GitHub username: ');
    if (username.trim()) {
      this.addEnvVariable('GITHUB_USERNAME', username.trim());
    }
  }

  async setupVercelCredentials() {
    console.log('\n🔧 SETTING UP VERCEL CREDENTIALS');
    console.log('==================================');
    console.log('You need a Vercel API Token with the following scopes:');
    console.log('- Deployments (Read and write deployments)');
    console.log('- Projects (Read and write projects)');
    console.log('- Teams (Read team information)');
    console.log('\nTo create a token:');
    console.log('1. Go to https://vercel.com/account/tokens');
    console.log('2. Click "Create Token"');
    console.log('3. Select the required scopes');
    console.log('4. Copy the generated token\n');

    const token = await this.question('Enter your Vercel API Token: ');
    if (token.trim()) {
      this.addEnvVariable('VERCEL_TOKEN', token.trim());
    }

    const orgId = await this.question('Enter your Vercel Organization ID (optional, press Enter to skip): ');
    if (orgId.trim()) {
      this.addEnvVariable('VERCEL_ORG_ID', orgId.trim());
    }

    const projectId = await this.question('Enter your Vercel Project ID (optional, press Enter to skip): ');
    if (projectId.trim()) {
      this.addEnvVariable('VERCEL_PROJECT_ID', projectId.trim());
    }
  }

  async setupSupabaseCredentials() {
    console.log('\n🔧 SETTING UP SUPABASE CREDENTIALS');
    console.log('===================================');
    console.log('You need your Supabase project credentials:');
    console.log('\nTo get these:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to Settings > API');
    console.log('4. Copy the Project URL and API keys\n');

    const url = await this.question('Enter your Supabase Project URL: ');
    if (url.trim()) {
      this.addEnvVariable('SUPABASE_URL', url.trim());
      this.addEnvVariable('NEXT_PUBLIC_SUPABASE_URL', url.trim());
    }

    const anonKey = await this.question('Enter your Supabase Anonymous Key: ');
    if (anonKey.trim()) {
      this.addEnvVariable('SUPABASE_ANON_KEY', anonKey.trim());
      this.addEnvVariable('NEXT_PUBLIC_SUPABASE_ANON_KEY', anonKey.trim());
    }

    const serviceKey = await this.question('Enter your Supabase Service Role Key (optional): ');
    if (serviceKey.trim()) {
      this.addEnvVariable('SUPABASE_SERVICE_ROLE_KEY', serviceKey.trim());
    }
  }

  async setupStripeCredentials() {
    console.log('\n🔧 SETTING UP STRIPE CREDENTIALS');
    console.log('==================================');
    console.log('You need your Stripe API keys:');
    console.log('\nTo get these:');
    console.log('1. Go to https://dashboard.stripe.com/apikeys');
    console.log('2. Copy your Publishable Key and Secret Key');
    console.log('3. For webhook secret, go to https://dashboard.stripe.com/webhooks\n');

    const publishableKey = await this.question('Enter your Stripe Publishable Key: ');
    if (publishableKey.trim()) {
      this.addEnvVariable('STRIPE_PUBLISHABLE_KEY', publishableKey.trim());
      this.addEnvVariable('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', publishableKey.trim());
    }

    const secretKey = await this.question('Enter your Stripe Secret Key: ');
    if (secretKey.trim()) {
      this.addEnvVariable('STRIPE_SECRET_KEY', secretKey.trim());
    }

    const webhookSecret = await this.question('Enter your Stripe Webhook Secret (optional): ');
    if (webhookSecret.trim()) {
      this.addEnvVariable('STRIPE_WEBHOOK_SECRET', webhookSecret.trim());
    }
  }

  async runSetup() {
    console.log('🔐 CREDENTIAL SETUP HELPER - WELLNESS AGENT SAAS');
    console.log('================================================');
    console.log('This helper will guide you through setting up all required credentials');
    console.log('for production deployment of your WellnessAI application.\n');

    const envContent = this.readEnvFile();
    const missingCredentials = [];

    // Check what's missing
    if (!envContent.includes('GITHUB_TOKEN=') || envContent.includes('your_github_token_here')) {
      missingCredentials.push('GitHub');
    }
    if (!envContent.includes('VERCEL_TOKEN=') || envContent.includes('your_vercel_token_here')) {
      missingCredentials.push('Vercel');
    }
    if (!envContent.includes('SUPABASE_URL=') || envContent.includes('your_supabase_url_here')) {
      missingCredentials.push('Supabase');
    }
    if (!envContent.includes('STRIPE_SECRET_KEY=') || envContent.includes('your_stripe_secret_key_here')) {
      missingCredentials.push('Stripe');
    }

    if (missingCredentials.length === 0) {
      console.log('✅ All credentials appear to be configured!');
      console.log('You can now run: node scripts/production-deployment-agent.js');
      this.rl.close();
      return;
    }

    console.log('📋 MISSING CREDENTIALS:');
    missingCredentials.forEach(cred => console.log(`   - ${cred}`));
    console.log('');

    const setupAll = await this.question('Would you like to set up all missing credentials now? (y/n): ');
    
    if (setupAll.toLowerCase() === 'y' || setupAll.toLowerCase() === 'yes') {
      if (missingCredentials.includes('GitHub')) {
        await this.setupGitHubCredentials();
      }
      
      if (missingCredentials.includes('Vercel')) {
        await this.setupVercelCredentials();
      }
      
      if (missingCredentials.includes('Supabase')) {
        await this.setupSupabaseCredentials();
      }
      
      if (missingCredentials.includes('Stripe')) {
        await this.setupStripeCredentials();
      }

      console.log('\n🎉 CREDENTIAL SETUP COMPLETED!');
      console.log('==============================');
      console.log('All credentials have been added to .env.local');
      console.log('You can now run: node scripts/production-deployment-agent.js');
      
    } else {
      console.log('\n📝 MANUAL SETUP INSTRUCTIONS:');
      console.log('=============================');
      console.log('1. Open .env.local in your editor');
      console.log('2. Replace placeholder values with real credentials');
      console.log('3. Follow the CREDENTIAL_SETUP_GUIDE.md for detailed instructions');
      console.log('4. Run: node scripts/production-deployment-agent.js');
    }

    this.rl.close();
  }
}

// Run if called directly
if (require.main === module) {
  const helper = new CredentialSetupHelper();
  helper.runSetup().catch(console.error);
}

module.exports = CredentialSetupHelper; 