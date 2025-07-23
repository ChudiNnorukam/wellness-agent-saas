#!/usr/bin/env node

console.log('🚀 WellnessAI Vercel Environment Variables Update\n');

console.log('📋 Copy these environment variables to your Vercel project:\n');

const envVars = {
  'NEXT_PUBLIC_SUPABASE_URL': 'your_supabase_url_here',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'your_supabase_anon_key_here',
  'SUPABASE_SERVICE_ROLE_KEY': 'your_supabase_service_role_key_here',
  'STRIPE_SECRET_KEY': 'sk_test_your_stripe_secret_key_here',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': 'pk_test_your_stripe_publishable_key_here',
  'STRIPE_WEBHOOK_SECRET': 'whsec_your_webhook_secret_here',
  'NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID': 'price_your_basic_price_id_here',
  'NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID': 'price_your_premium_price_id_here',
  'NEXT_PUBLIC_APP_URL': 'https://your-app-url.vercel.app',
  'NODE_ENV': 'production'
};

Object.entries(envVars).forEach(([key, value]) => {
  console.log(`${key}=${value}`);
});

console.log('\n📝 Instructions:');
console.log('1. Go to https://vercel.com/dashboard');
console.log('2. Click Settings → Environment Variables');
console.log('3. Add each variable above (copy and paste)');
console.log('4. Click "Save"');
console.log('5. Redeploy your project');

console.log('\n🔗 Webhook Configuration:');
console.log('URL: https://your-app-url.vercel.app/api/stripe/webhook');
console.log('Events: customer.subscription.created, customer.subscription.updated, customer.subscription.deleted, invoice.payment_succeeded, invoice.payment_failed');

console.log('\n🧪 Test Cards:');
console.log('Success: 4242 4242 4242 4242');
console.log('Decline: 4000 0000 0000 0002');
console.log('Requires Auth: 4000 0025 0000 3155'); 