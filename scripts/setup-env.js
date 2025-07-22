#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up your .env file with Supabase credentials...\n');

const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://nfqedbpcfvhsuiqdctab.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcWVkYnBjZnZoc3VpcWRjdGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Nzc3NjksImV4cCI6MjA2ODU1Mzc2OX0.1NvFpCdQl73GFii5bykfgLoTfu3rsONwQxTi3_AIGaU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcWVkYnBjZnZoc3VpcWRjdGFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk3Nzc2OSwiZXhwIjoyMDY4NTUzNzY5fQ.Wsnt2u14lPQrvGj678YHwVnDczp9Hnx9TPIOZox3UVY

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...  # Copy from https://dashboard.stripe.com/apikeys
STRIPE_PUBLISHABLE_KEY=pk_test_51RmqxZ2ct93Utp7LHw6KDG9BRFFwr7IXeFqSSfcFLEoWV2pXv3tGfLWHSUTOpnkUXGdbHddjHy1tkMZHagMIFBDX00XB7aVWfl
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI Configuration
OPENAI_API_KEY=sk-...  # Copy from https://platform.openai.com/api-keys

# Google Analytics
GOOGLE_ANALYTICS_VIEW_ID=123456789
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