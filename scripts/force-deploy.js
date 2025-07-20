#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 Force Deploying WellnessAI...');

// Add a deployment timestamp to force cache invalidation
const timestamp = new Date().toISOString();
const deployComment = `// Force deploy: ${timestamp}`;

// Update the main page with a deployment marker
const mainPagePath = 'src/app/page.tsx';
let mainPageContent = fs.readFileSync(mainPagePath, 'utf8');

// Add deployment comment at the top
if (!mainPageContent.includes('Force deploy:')) {
  mainPageContent = `${deployComment}\n${mainPageContent}`;
  fs.writeFileSync(mainPagePath, mainPageContent);
  console.log('✅ Updated main page with deployment marker');
}

// Update package.json version to force rebuild
const packagePath = 'package.json';
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const currentVersion = packageJson.version;
const [major, minor, patch] = currentVersion.split('.');
const newVersion = `${major}.${minor}.${parseInt(patch) + 1}`;
packageJson.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
console.log(`✅ Updated version from ${currentVersion} to ${newVersion}`);

// Create a deployment marker file
const deployMarker = `Deployment triggered at: ${timestamp}
Version: ${newVersion}
Cache bust: true
`;
fs.writeFileSync('DEPLOY_MARKER.txt', deployMarker);
console.log('✅ Created deployment marker');

// Commit and push
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "Force deploy: ${timestamp} - Version ${newVersion}"`, { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log('✅ Changes committed and pushed');
} catch (error) {
  console.error('❌ Git operations failed:', error.message);
  process.exit(1);
}

console.log('\n🎯 Deployment Summary:');
console.log(`   Timestamp: ${timestamp}`);
console.log(`   Version: ${newVersion}`);
console.log(`   Cache bust: Enabled`);
console.log('\n⏳ Waiting for deployment to complete...');
console.log('   Check: https://wellness-agent-saas.vercel.app');
console.log('   Monitor: https://vercel.com/chudi-nnorukams-projects/wellness-agent-saas'); 