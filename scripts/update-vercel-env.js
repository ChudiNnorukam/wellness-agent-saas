#!/usr/bin/env node

console.log('🚀 WellnessAI Vercel Environment Variables Update\n');

console.log('📋 Copy these environment variables to your Vercel project:\n');

const envVars = {
  'NEXT_PUBLIC_SUPABASE_URL': 'https://nfqedbpcfvhsuiqdctab.supabase.co',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcWVkYnBjZnZoc3VpcWRjdGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Nzc3NjksImV4cCI6MjA2ODU1Mzc2OX0.1NvFpCdQl73GFii5bykfgLoTfu3rsONwQxTi3_AIGaU',
  'SUPABASE_SERVICE_ROLE_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcWVkYnBjZnZoc3VpcWRjdGFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk3Nzc2OSwiZXhwIjoyMDY4NTUzNzY5fQ.Wsnt2u14lPQrvGj678YHwVnDczp9Hnx9TPIOZox3UVY',
  'STRIPE_SECRET_KEY': '[YOUR_TEST_SECRET_KEY]',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': 'pk_test_51RmqxZ2ct93Utp7LHw6KDG9BRFFwr7IXeFqSSfcFLEoWV2pXv3tGfLWHSUTOpnkUXGdbHddjHy1tkMZHagMIFBDX00XB7aVWfl',
  'STRIPE_WEBHOOK_SECRET': '[YOUR_WEBHOOK_SECRET]',
  'NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID': 'price_1RmraL2ct93Utp7L6DNmfRWA',
  'NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID': 'price_1RmrZM2ct93Utp7Lq5JfAfM5',
  'NEXT_PUBLIC_APP_URL': 'https://wellness-agent-saas.vercel.app',
  'NODE_ENV': 'production'
};

Object.entries(envVars).forEach(([key, value]) => {
  console.log(`${key}=${value}`);
});

console.log('\n📝 Instructions:');
console.log('1. Go to https://vercel.com/chudi-nnorukams-projects/wellness-agent-saas');
console.log('2. Click Settings → Environment Variables');
console.log('3. Add each variable above (copy and paste)');
console.log('4. Click "Save"');
console.log('5. Redeploy your project');

console.log('\n🔗 Webhook Configuration:');
console.log('URL: https://wellness-agent-saas.vercel.app/api/stripe/webhook');
console.log('Events: customer.subscription.created, customer.subscription.updated, customer.subscription.deleted, invoice.payment_succeeded, invoice.payment_failed');

console.log('\n🧪 Test Cards:');
console.log('Success: 4242 4242 4242 4242');
console.log('Decline: 4000 0000 0000 0002');
console.log('Requires Auth: 4000 0025 0000 3155'); 