#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up your .env file with Supabase credentials...\n');

const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# OpenAI Configuration
OPENAI_API_KEY=sk_your_openai_api_key_here

# Google Analytics
GOOGLE_ANALYTICS_VIEW_ID=your_analytics_view_id_here
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Database Configuration
DATABASE_URL=mysql://username:password@localhost:3306/wellness_saas

# Business Configuration
SAAS_PLATFORM_URL=https://your-wellness-saas.com
CURRENT_PRICING_TIER=basic
CURRENT_MONTHLY_PRICE=29.99

# Agent Configuration
AGENT_UPDATE_INTERVAL=300000
SALES_OPTIMIZATION_ENABLED=true
TRAFFIC_OPTIMIZATION_ENABLED=true
`;

const envPath = path.join(__dirname, '..', '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Copy your Stripe Secret Key from: https://dashboard.stripe.com/apikeys');
  console.log('2. Copy your OpenAI API Key from: https://platform.openai.com/api-keys');
  console.log('3. Replace the placeholder values in your .env file');
  console.log('\n🎯 Your Supabase credentials are already configured!');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  console.log('\n📝 Please manually create a .env file with this content:');
  console.log('\n' + envContent);
} 