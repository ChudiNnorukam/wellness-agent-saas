#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 WellnessAI Stripe Setup Helper\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setupStripe() {
  console.log('📋 Let\'s get your Stripe configuration set up!\n');

  // Get Vercel domain
  const vercelDomain = await askQuestion('What is your Vercel domain? (e.g., https://wellness-agent-saas.vercel.app): ');
  
  // Get Stripe keys
  console.log('\n🔑 Enter your Stripe test keys:');
  const stripeSecretKey = await askQuestion('Enter your Stripe test secret key (starts with sk_test_): ');
  const stripePublishableKey = await askQuestion('Enter your Stripe test publishable key (starts with pk_test_): ');
  const webhookSecret = await askQuestion('Enter your webhook secret (starts with whsec_): ');
  
  // Get Price IDs
  console.log('\n💰 Now let\'s get your Stripe Price IDs:');
  console.log('1. Go to your Stripe Dashboard (Test mode)');
  console.log('2. Go to Products → Add product');
  console.log('3. Create "WellnessAI Basic" - $9.99/month');
  console.log('4. Create "WellnessAI Premium" - $19.99/month');
  console.log('5. Click on each product and copy the Price ID (starts with price_)\n');
  
  const basicPriceId = await askQuestion('Enter your Basic plan Price ID: ');
  const premiumPriceId = await askQuestion('Enter your Premium plan Price ID: ');

  // Create environment variables
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://nfqedbpcfvhsuiqdctab.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcWVkYnBjZnZoc3VpcWRjdGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Nzc3NjksImV4cCI6MjA2ODU1Mzc2OX0.1NvFpCdQl73GFii5bykfgLoTfu3rsONwQxTi3_AIGaU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcWVkYnBjZnZoc3VpcWRjdGFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk3Nzc2OSwiZXhwIjoyMDY4NTUzNzY5fQ.Wsnt2u14lPQrvGj678YHwVnDczp9Hnx9TPIOZox3UVY

# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=${stripeSecretKey}
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${stripePublishableKey}
STRIPE_WEBHOOK_SECRET=${webhookSecret}
NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID=${basicPriceId}
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=${premiumPriceId}

# Application Configuration
NEXT_PUBLIC_APP_URL=${vercelDomain}
NODE_ENV=production
`;

  // Write to .env.local
  fs.writeFileSync('.env.local', envContent);

  // Create webhook configuration
  const webhookUrl = `${vercelDomain}/api/stripe/webhook`;
  
  console.log('\n✅ Configuration saved to .env.local');
  console.log('\n🔗 Webhook Configuration:');
  console.log(`Webhook URL: ${webhookUrl}`);
  console.log('\n📝 Next Steps:');
  console.log('1. Go to Stripe Dashboard → Developers → Webhooks');
  console.log('2. Click "Add endpoint"');
  console.log(`3. Enter URL: ${webhookUrl}`);
  console.log('4. Select these events:');
  console.log('   - customer.subscription.created');
  console.log('   - customer.subscription.updated');
  console.log('   - customer.subscription.deleted');
  console.log('   - invoice.payment_succeeded');
  console.log('   - invoice.payment_failed');
  console.log('5. Copy the webhook signing secret');
  console.log('\n🌐 Vercel Environment Variables:');
  console.log('Go to your Vercel project → Settings → Environment Variables');
  console.log('Add all the variables from .env.local');
  console.log('\n🧪 Test Cards:');
  console.log('Success: 4242 4242 4242 4242');
  console.log('Decline: 4000 0000 0000 0002');
  console.log('Requires Auth: 4000 0025 0000 3155');

  rl.close();
}

setupStripe().catch(console.error); 