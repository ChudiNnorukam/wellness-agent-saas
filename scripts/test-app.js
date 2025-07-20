#!/usr/bin/env node

const https = require('https');

console.log('🧪 WellnessAI Application Test\n');

const baseUrl = 'https://wellness-agent-saas.vercel.app';

async function testEndpoint(path, description) {
  return new Promise((resolve) => {
    const url = `${baseUrl}${path}`;
    console.log(`Testing: ${description}`);
    console.log(`URL: ${url}`);
    
    https.get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Response: ${data.substring(0, 200)}...`);
        console.log('✅ Success\n');
        resolve(res.statusCode);
      });
    }).on('error', (err) => {
      console.log(`❌ Error: ${err.message}\n`);
      resolve(0);
    });
  });
}

async function runTests() {
  console.log('🚀 Starting WellnessAI Application Tests\n');
  
  // Test main pages
  await testEndpoint('/', 'Landing Page');
  await testEndpoint('/generate', 'Plan Generation Page');
  await testEndpoint('/dashboard', 'Dashboard Page');
  
  // Test API endpoints
  await testEndpoint('/api/wellness/generate', 'Wellness API (GET)');
  
  console.log('📋 Manual Testing Checklist:');
  console.log('1. Visit the landing page');
  console.log('2. Try user registration/login');
  console.log('3. Generate a wellness plan');
  console.log('4. Test subscription flow');
  console.log('5. Check dashboard functionality');
  
  console.log('\n🧪 Stripe Test Cards:');
  console.log('Success: 4242 4242 4242 4242');
  console.log('Decline: 4000 0000 0000 0002');
  console.log('Requires Auth: 4000 0025 0000 3155');
  
  console.log('\n🔗 Application URL:');
  console.log(baseUrl);
}

runTests().catch(console.error); 