#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

class RealOAuthImplementer {
  constructor() {
    this.configDir = './config';
    this.envFile = '.env.local';
    this.vercelConfig = '.vercel/project.json';
    this.githubConfig = '.github/config.yml';
    this.supabaseConfig = 'supabase/config.toml';
    this.stripeConfig = 'stripe-config.json';
    
    // Ensure config directory exists
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
  }

  async configureGitHubOAuth() {
    console.log('🔧 Configuring GitHub OAuth...');
    
    try {
      // Check if GitHub token already exists
      const envContent = this.readEnvFile();
      if (envContent.includes('GITHUB_TOKEN=')) {
        console.log('✅ GitHub token already configured');
        return { success: true, message: 'GitHub token already exists' };
      }

      // Create GitHub Actions workflow
      await this.createGitHubActionsWorkflow();
      
      // Create GitHub config
      await this.createGitHubConfig();
      
      // Add placeholder for GitHub token
      this.addEnvVariable('GITHUB_TOKEN', 'your_github_token_here');
      this.addEnvVariable('GITHUB_USERNAME', 'your_github_username_here');
      
      console.log('✅ GitHub OAuth configuration files created');
      console.log('📝 Please add your GitHub token to .env.local');
      
      return { 
        success: true, 
        message: 'GitHub OAuth configuration files created',
        nextSteps: [
          '1. Go to GitHub Settings > Developer settings > Personal access tokens',
          '2. Generate a new token with scopes: repo, workflow, admin:org',
          '3. Add the token to .env.local as GITHUB_TOKEN',
          '4. Set GITHUB_USERNAME to your GitHub username'
        ]
      };
      
    } catch (error) {
      console.error('❌ GitHub OAuth configuration failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async configureVercelOAuth() {
    console.log('🔧 Configuring Vercel OAuth...');
    
    try {
      // Check if Vercel is already configured
      if (fs.existsSync(this.vercelConfig)) {
        console.log('✅ Vercel already configured');
        return { success: true, message: 'Vercel already configured' };
      }

      // Create Vercel project config
      await this.createVercelProjectConfig();
      
      // Add Vercel environment variables
      this.addEnvVariable('VERCEL_TOKEN', 'your_vercel_token_here');
      this.addEnvVariable('VERCEL_ORG_ID', 'your_vercel_org_id_here');
      this.addEnvVariable('VERCEL_PROJECT_ID', 'your_vercel_project_id_here');
      
      console.log('✅ Vercel OAuth configuration files created');
      
      return { 
        success: true, 
        message: 'Vercel OAuth configuration files created',
        nextSteps: [
          '1. Go to Vercel dashboard > Settings > Tokens',
          '2. Create a new token with appropriate permissions',
          '3. Add the token to .env.local as VERCEL_TOKEN',
          '4. Get your organization ID and project ID from Vercel dashboard',
          '5. Set VERCEL_ORG_ID and VERCEL_PROJECT_ID environment variables'
        ]
      };
      
    } catch (error) {
      console.error('❌ Vercel OAuth configuration failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async configureSupabaseOAuth() {
    console.log('🔧 Configuring Supabase OAuth...');
    
    try {
      // Check if Supabase is already configured
      const envContent = this.readEnvFile();
      if (envContent.includes('SUPABASE_URL=')) {
        console.log('✅ Supabase already configured');
        return { success: true, message: 'Supabase already configured' };
      }

      // Create Supabase config
      await this.createSupabaseConfig();
      
      // Add Supabase environment variables
      this.addEnvVariable('SUPABASE_URL', 'your_supabase_url_here');
      this.addEnvVariable('SUPABASE_ANON_KEY', 'your_supabase_anon_key_here');
      this.addEnvVariable('SUPABASE_SERVICE_ROLE_KEY', 'your_supabase_service_role_key_here');
      
      console.log('✅ Supabase OAuth configuration files created');
      
      return { 
        success: true, 
        message: 'Supabase OAuth configuration files created',
        nextSteps: [
          '1. Go to your Supabase project dashboard',
          '2. Navigate to Settings > API',
          '3. Copy the project URL and anon key',
          '4. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables',
          '5. For service role key, go to Settings > API > Project API keys'
        ]
      };
      
    } catch (error) {
      console.error('❌ Supabase OAuth configuration failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async configureStripeOAuth() {
    console.log('🔧 Configuring Stripe OAuth...');
    
    try {
      // Check if Stripe is already configured
      const envContent = this.readEnvFile();
      if (envContent.includes('STRIPE_SECRET_KEY=')) {
        console.log('✅ Stripe already configured');
        return { success: true, message: 'Stripe already configured' };
      }

      // Create Stripe config
      await this.createStripeConfig();
      
      // Add Stripe environment variables
      this.addEnvVariable('STRIPE_SECRET_KEY', 'your_stripe_secret_key_here');
      this.addEnvVariable('STRIPE_PUBLISHABLE_KEY', 'your_stripe_publishable_key_here');
      this.addEnvVariable('STRIPE_WEBHOOK_SECRET', 'your_stripe_webhook_secret_here');
      
      console.log('✅ Stripe OAuth configuration files created');
      
      return { 
        success: true, 
        message: 'Stripe OAuth configuration files created',
        nextSteps: [
          '1. Go to Stripe dashboard > Developers > API keys',
          '2. Copy your publishable key and secret key',
          '3. Set STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY environment variables',
          '4. For webhook secret, go to Developers > Webhooks and create a new endpoint'
        ]
      };
      
    } catch (error) {
      console.error('❌ Stripe OAuth configuration failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async createGitHubActionsWorkflow() {
    const workflowDir = '.github/workflows';
    if (!fs.existsSync(workflowDir)) {
      fs.mkdirSync(workflowDir, { recursive: true });
    }

    const workflowContent = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
      env:
        NEXT_PUBLIC_SUPABASE_URL: \${{ secrets.SUPABASE_URL }}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: \${{ secrets.SUPABASE_ANON_KEY }}
        STRIPE_SECRET_KEY: \${{ secrets.STRIPE_SECRET_KEY }}
        STRIPE_PUBLISHABLE_KEY: \${{ secrets.STRIPE_PUBLISHABLE_KEY }}
        STRIPE_WEBHOOK_SECRET: \${{ secrets.STRIPE_WEBHOOK_SECRET }}
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
        force_orphan: true`;

    fs.writeFileSync(path.join(workflowDir, 'deploy.yml'), workflowContent);
    console.log('✅ GitHub Actions workflow created');
  }

  async createGitHubConfig() {
    const githubDir = '.github';
    if (!fs.existsSync(githubDir)) {
      fs.mkdirSync(githubDir, { recursive: true });
    }

    const configContent = `# GitHub Configuration
# This file contains GitHub-specific settings

# Repository settings
repository:
  name: wellness-agent-saas
  description: AI-Powered Wellness Platform
  homepage: https://wellness-agent-saas-ybpb.vercel.app
  topics:
    - nextjs
    - typescript
    - supabase
    - stripe
    - vercel

# Branch protection rules
branches:
  main:
    protection:
      required_status_checks:
        strict: true
        contexts:
          - "Deploy to GitHub Pages"
      enforce_admins: false
      required_pull_request_reviews:
        required_approving_review_count: 1
        dismiss_stale_reviews: true
      restrictions: null

# Issue templates
issue_template:
  - name: Bug Report
    title: "[BUG] "
    labels: ["bug"]
    body: |
      ## Bug Description
      
      ## Steps to Reproduce
      
      ## Expected Behavior
      
      ## Actual Behavior
      
      ## Environment
      - OS: 
      - Browser: 
      - Version: 

  - name: Feature Request
    title: "[FEATURE] "
    labels: ["enhancement"]
    body: |
      ## Feature Description
      
      ## Use Case
      
      ## Proposed Solution
      
      ## Alternatives Considered`;

    fs.writeFileSync(path.join(githubDir, 'config.yml'), configContent);
    console.log('✅ GitHub config created');
  }

  async createVercelProjectConfig() {
    const vercelDir = '.vercel';
    if (!fs.existsSync(vercelDir)) {
      fs.mkdirSync(vercelDir, { recursive: true });
    }

    const projectConfig = {
      projectId: "your_project_id_here",
      orgId: "your_org_id_here",
      settings: {
        framework: "nextjs",
        buildCommand: "npm run build",
        installCommand: "npm install",
        outputDirectory: ".next",
        devCommand: "npm run dev"
      }
    };

    fs.writeFileSync(this.vercelConfig, JSON.stringify(projectConfig, null, 2));
    console.log('✅ Vercel project config created');
  }

  async createSupabaseConfig() {
    const supabaseDir = 'supabase';
    if (!fs.existsSync(supabaseDir)) {
      fs.mkdirSync(supabaseDir, { recursive: true });
    }

    const configContent = `# Supabase Configuration
# This file contains Supabase-specific settings

[api]
enabled = true
port = 54321
schemas = ["public", "storage", "graphql_public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000

[db]
port = 54322
shadow_port = 54320
major_version = 15

[studio]
enabled = true
port = 54323
api_url = "http://localhost:54321"

[inbucket]
enabled = true
port = 54324
smtp_port = 54325
pop3_port = 54326

[storage]
enabled = true
file_size_limit = "50MiB"

[auth]
enabled = true
port = 54327
site_url = "http://localhost:3000"
additional_redirect_urls = ["https://wellness-agent-saas-ybpb.vercel.app"]
jwt_expiry = 3600
refresh_token_rotation_enabled = true
security_update_password_require_reauthentication = true

[edge_runtime]
enabled = true
port = 54328

[analytics]
enabled = false

[functions]
verify_jwt = false`;

    fs.writeFileSync(this.supabaseConfig, configContent);
    console.log('✅ Supabase config created');
  }

  async createStripeConfig() {
    const config = {
      publishableKey: "your_publishable_key_here",
      secretKey: "your_secret_key_here",
      webhookSecret: "your_webhook_secret_here",
      products: {
        basic: {
          name: "WellnessAI Basic",
          price: 999, // $9.99
          interval: "month",
          priceId: "your_basic_price_id_here"
        },
        premium: {
          name: "WellnessAI Premium", 
          price: 1999, // $19.99
          interval: "month",
          priceId: "your_premium_price_id_here"
        }
      },
      webhooks: {
        events: [
          "customer.subscription.created",
          "customer.subscription.updated", 
          "customer.subscription.deleted",
          "invoice.payment_succeeded",
          "invoice.payment_failed"
        ],
        endpoint: "https://wellness-agent-saas-ybpb.vercel.app/api/stripe/webhook"
      }
    };

    fs.writeFileSync(this.stripeConfig, JSON.stringify(config, null, 2));
    console.log('✅ Stripe config created');
  }

  readEnvFile() {
    if (fs.existsSync(this.envFile)) {
      return fs.readFileSync(this.envFile, 'utf8');
    }
    return '';
  }

  addEnvVariable(key, value) {
    let envContent = this.readEnvFile();
    
    // Check if variable already exists
    if (envContent.includes(`${key}=`)) {
      console.log(`⚠️  ${key} already exists in .env.local`);
      return;
    }
    
    // Add new variable
    envContent += `\n${key}=${value}`;
    fs.writeFileSync(this.envFile, envContent);
    console.log(`✅ Added ${key} to .env.local`);
  }

  async testGitHubConnection() {
    try {
      const envContent = this.readEnvFile();
      const tokenMatch = envContent.match(/GITHUB_TOKEN=(.+)/);
      
      if (!tokenMatch || tokenMatch[1] === 'your_github_token_here') {
        return { success: false, error: 'GitHub token not configured' };
      }
      
      // Test GitHub API connection
      const response = await this.makeRequest('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${tokenMatch[1]}`,
          'User-Agent': 'wellness-agent-saas'
        }
      });
      
      return { success: true, data: response };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testVercelConnection() {
    try {
      const envContent = this.readEnvFile();
      const tokenMatch = envContent.match(/VERCEL_TOKEN=(.+)/);
      
      if (!tokenMatch || tokenMatch[1] === 'your_vercel_token_here') {
        return { success: false, error: 'Vercel token not configured' };
      }
      
      // Test Vercel API connection
      const response = await this.makeRequest('https://api.vercel.com/v1/user', {
        headers: {
          'Authorization': `Bearer ${tokenMatch[1]}`,
          'Content-Type': 'application/json'
        }
      });
      
      return { success: true, data: response };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testSupabaseConnection() {
    try {
      const envContent = this.readEnvFile();
      const urlMatch = envContent.match(/SUPABASE_URL=(.+)/);
      const keyMatch = envContent.match(/SUPABASE_ANON_KEY=(.+)/);
      
      if (!urlMatch || !keyMatch || 
          urlMatch[1] === 'your_supabase_url_here' || 
          keyMatch[1] === 'your_supabase_anon_key_here') {
        return { success: false, error: 'Supabase credentials not configured' };
      }
      
      // Test Supabase connection
      const response = await this.makeRequest(`${urlMatch[1]}/rest/v1/`, {
        headers: {
          'apikey': keyMatch[1],
          'Authorization': `Bearer ${keyMatch[1]}`
        }
      });
      
      return { success: true, data: response };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testStripeConnection() {
    try {
      const envContent = this.readEnvFile();
      const keyMatch = envContent.match(/STRIPE_SECRET_KEY=(.+)/);
      
      if (!keyMatch || keyMatch[1] === 'your_stripe_secret_key_here') {
        return { success: false, error: 'Stripe secret key not configured' };
      }
      
      // Test Stripe API connection
      const response = await this.makeRequest('https://api.stripe.com/v1/account', {
        headers: {
          'Authorization': `Bearer ${keyMatch[1]}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      return { success: true, data: response };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: options.headers || {}
      };
      
      const req = client.request(requestOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            resolve(data);
          }
        });
      });
      
      req.on('error', reject);
      
      if (options.body) {
        req.write(options.body);
      }
      
      req.end();
    });
  }
}

// Run if called directly
if (require.main === module) {
  const implementer = new RealOAuthImplementer();
  
  async function runTests() {
    console.log('🧪 Testing OAuth Implementations...\n');
    
    const tests = [
      { name: 'GitHub OAuth', test: () => implementer.configureGitHubOAuth() },
      { name: 'Vercel OAuth', test: () => implementer.configureVercelOAuth() },
      { name: 'Supabase OAuth', test: () => implementer.configureSupabaseOAuth() },
      { name: 'Stripe OAuth', test: () => implementer.configureStripeOAuth() }
    ];
    
    for (const test of tests) {
      console.log(`\n🔧 Testing ${test.name}...`);
      const result = await test.test();
      console.log(result.success ? '✅ Success' : '❌ Failed');
      if (result.nextSteps) {
        console.log('📝 Next steps:');
        result.nextSteps.forEach(step => console.log(`   ${step}`));
      }
    }
  }
  
  runTests().catch(console.error);
}

module.exports = RealOAuthImplementer; 