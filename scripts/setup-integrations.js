#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

class IntegrationSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.configPath = path.join(this.projectRoot, 'config', 'unified-integrations.json');
    this.envPath = path.join(this.projectRoot, '.env.local');
    this.config = this.loadConfig();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  loadConfig() {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      console.error('❌ Error loading integration config:', error.message);
      process.exit(1);
    }
  }

  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'     // Reset
    };
    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  async setupSupabase() {
    this.log('\n🔐 Setting up Supabase Integration...', 'info');
    
    const supabaseUrl = await this.question('Enter your Supabase project URL: ');
    const supabaseAnonKey = await this.question('Enter your Supabase anon key: ');
    const supabaseServiceKey = await this.question('Enter your Supabase service role key: ');

    this.log('✅ Supabase configuration captured', 'success');
    
    return {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey
    };
  }

  async setupStripe() {
    this.log('\n💳 Setting up Stripe Integration...', 'info');
    
    const stripeSecretKey = await this.question('Enter your Stripe secret key: ');
    const stripePublishableKey = await this.question('Enter your Stripe publishable key: ');
    const stripeWebhookSecret = await this.question('Enter your Stripe webhook secret: ');

    this.log('✅ Stripe configuration captured', 'success');
    
    return {
      STRIPE_SECRET_KEY: stripeSecretKey,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: stripePublishableKey,
      STRIPE_WEBHOOK_SECRET: stripeWebhookSecret
    };
  }

  async setupGoogleAnalytics() {
    this.log('\n📊 Setting up Google Analytics...', 'info');
    
    const useAnalytics = await this.question('Do you want to set up Google Analytics? (y/n): ');
    
    if (useAnalytics.toLowerCase() === 'y') {
      const viewId = await this.question('Enter your Google Analytics View ID: ');
      const serviceAccountPath = await this.question('Enter path to Google service account JSON file (or press enter to skip): ');
      
      this.log('✅ Google Analytics configuration captured', 'success');
      
      return {
        GOOGLE_ANALYTICS_VIEW_ID: viewId,
        GOOGLE_APPLICATION_CREDENTIALS: serviceAccountPath || ''
      };
    }
    
    return {};
  }

  async setupDatabase() {
    this.log('\n🗄️ Setting up Database Configuration...', 'info');
    
    const useMySQL = await this.question('Do you want to set up MySQL for AI agents? (y/n): ');
    
    if (useMySQL.toLowerCase() === 'y') {
      const dbUrl = await this.question('Enter your MySQL database URL (mysql://user:pass@host:port/db): ');
      
      this.log('✅ Database configuration captured', 'success');
      
      return {
        DATABASE_URL: dbUrl
      };
    }
    
    return {};
  }

  async setupBusinessConfig() {
    this.log('\n🏢 Setting up Business Configuration...', 'info');
    
    const appUrl = await this.question('Enter your app URL (e.g., https://your-app.vercel.app): ');
    const pricingTier = await this.question('Enter current pricing tier (basic/premium): ');
    const monthlyPrice = await this.question('Enter current monthly price (e.g., 29.99): ');

    this.log('✅ Business configuration captured', 'success');
    
    return {
      NEXT_PUBLIC_APP_URL: appUrl,
      CURRENT_PRICING_TIER: pricingTier,
      CURRENT_MONTHLY_PRICE: monthlyPrice,
      NODE_ENV: 'production'
    };
  }

  async createEnvFile(envVars) {
    this.log('\n📝 Creating .env.local file...', 'info');
    
    const envContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync(this.envPath, envContent);
    this.log('✅ .env.local file created successfully', 'success');
  }

  async runDatabaseMigrations() {
    this.log('\n🗄️ Running database migrations...', 'info');
    
    try {
      const migrationPath = path.join(this.projectRoot, 'supabase', 'migrations', '001_initial_schema.sql');
      if (fs.existsSync(migrationPath)) {
        this.log('📋 Migration file found. Please run this SQL in your Supabase dashboard:', 'warning');
        this.log(`File: ${migrationPath}`, 'info');
      } else {
        this.log('⚠️ No migration file found', 'warning');
      }
    } catch (error) {
      this.log('❌ Error checking migrations:', error.message, 'error');
    }
  }

  async setupStripeProducts() {
    this.log('\n🛍️ Setting up Stripe Products...', 'info');
    
    this.log('📋 Please create these products in your Stripe dashboard:', 'info');
    this.log('1. WellnessAI Basic - $9.99/month', 'info');
    this.log('2. WellnessAI Premium - $19.99/month', 'info');
    this.log('3. Configure webhooks for subscription events', 'info');
    
    const setupStripe = await this.question('Would you like to run the Stripe setup script? (y/n): ');
    
    if (setupStripe.toLowerCase() === 'y') {
      try {
        const stripeSetupPath = path.join(this.projectRoot, 'scripts', 'setup-stripe.js');
        if (fs.existsSync(stripeSetupPath)) {
          execSync(`node ${stripeSetupPath}`, { stdio: 'inherit' });
        } else {
          this.log('⚠️ Stripe setup script not found', 'warning');
        }
      } catch (error) {
        this.log('❌ Error running Stripe setup:', error.message, 'error');
      }
    }
  }

  async setupVercelDeployment() {
    this.log('\n🚀 Setting up Vercel Deployment...', 'info');
    
    this.log('📋 Next steps for Vercel deployment:', 'info');
    this.log('1. Push your code to GitHub', 'info');
    this.log('2. Connect your repository to Vercel', 'info');
    this.log('3. Add all environment variables to Vercel dashboard', 'info');
    this.log('4. Deploy your application', 'info');
    
    const deployNow = await this.question('Would you like to deploy to Vercel now? (y/n): ');
    
    if (deployNow.toLowerCase() === 'y') {
      try {
        this.log('🚀 Deploying to Vercel...', 'info');
        execSync('vercel --prod', { stdio: 'inherit' });
      } catch (error) {
        this.log('❌ Error deploying to Vercel:', error.message, 'error');
        this.log('💡 Make sure you have Vercel CLI installed: npm i -g vercel', 'info');
      }
    }
  }

  async testIntegrations() {
    this.log('\n🧪 Testing Integrations...', 'info');
    
    const testSales = await this.question('Would you like to test the sales optimizer? (y/n): ');
    
    if (testSales.toLowerCase() === 'y') {
      try {
        const demoPath = path.join(this.projectRoot, 'scripts', 'demo-sales-optimizer.js');
        if (fs.existsSync(demoPath)) {
          this.log('🧪 Running sales optimizer demo...', 'info');
          execSync(`node ${demoPath}`, { stdio: 'inherit' });
        } else {
          this.log('⚠️ Demo script not found', 'warning');
        }
      } catch (error) {
        this.log('❌ Error running demo:', error.message, 'error');
      }
    }
  }

  async generateSetupReport() {
    this.log('\n📊 Generating Setup Report...', 'info');
    
    const report = {
      timestamp: new Date().toISOString(),
      project: this.config.project,
      integrations: this.config.integrations,
      setup_completed: true,
      next_steps: this.config.setup_instructions
    };

    const reportPath = path.join(this.projectRoot, 'config', 'setup-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log('✅ Setup report generated: config/setup-report.json', 'success');
  }

  async run() {
    this.log('🚀 Welcome to WellnessAI Integration Setup!', 'info');
    this.log('This will configure all integrations for your Healing Studio Portfolio & Micro SaaS App', 'info');
    
    try {
      // Collect all configuration
      const supabaseConfig = await this.setupSupabase();
      const stripeConfig = await this.setupStripe();
      const analyticsConfig = await this.setupGoogleAnalytics();
      const databaseConfig = await this.setupDatabase();
      const businessConfig = await this.setupBusinessConfig();

      // Combine all configurations
      const allConfig = {
        ...supabaseConfig,
        ...stripeConfig,
        ...analyticsConfig,
        ...databaseConfig,
        ...businessConfig
      };

      // Create environment file
      await this.createEnvFile(allConfig);

      // Setup additional components
      await this.runDatabaseMigrations();
      await this.setupStripeProducts();
      await this.setupVercelDeployment();
      await this.testIntegrations();
      await this.generateSetupReport();

      this.log('\n🎉 Integration setup completed successfully!', 'success');
      this.log('\n📋 Summary of what was configured:', 'info');
      this.log('✅ Supabase authentication and database', 'success');
      this.log('✅ Stripe payment processing', 'success');
      this.log('✅ Google Analytics tracking', 'success');
      this.log('✅ Database configuration', 'success');
      this.log('✅ Business settings', 'success');
      this.log('✅ Environment variables', 'success');
      
      this.log('\n🚀 Next Steps:', 'info');
      this.log('1. Review your .env.local file', 'info');
      this.log('2. Set up your Supabase database with migrations', 'info');
      this.log('3. Configure Stripe products and webhooks', 'info');
      this.log('4. Deploy to Vercel', 'info');
      this.log('5. Test all integrations', 'info');
      
      this.log('\n📚 Documentation:', 'info');
      this.log('- README.md for project overview', 'info');
      this.log('- config/unified-integrations.json for integration details', 'info');
      this.log('- config/setup-report.json for setup summary', 'info');

    } catch (error) {
      this.log(`❌ Setup failed: ${error.message}`, 'error');
    } finally {
      this.rl.close();
    }
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  const setup = new IntegrationSetup();
  setup.run().catch(console.error);
}

module.exports = { IntegrationSetup }; 