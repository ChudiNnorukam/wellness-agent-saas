#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting GitHub Pages deployment...');

try {
  // Step 1: Clean previous build
  console.log('📦 Cleaning previous build...');
  execSync('rm -rf .next out', { stdio: 'inherit' });

  // Step 2: Install dependencies
  console.log('📥 Installing dependencies...');
  execSync('npm ci', { stdio: 'inherit' });

  // Step 3: Build the application
  console.log('🔨 Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Step 4: Create .nojekyll file for GitHub Pages
  console.log('📝 Creating .nojekyll file...');
  fs.writeFileSync(path.join(process.cwd(), 'out', '.nojekyll'), '');

  // Step 5: Create CNAME file if custom domain is configured
  const customDomain = process.env.CUSTOM_DOMAIN;
  if (customDomain) {
    console.log(`🌐 Setting custom domain: ${customDomain}`);
    fs.writeFileSync(path.join(process.cwd(), 'out', 'CNAME'), customDomain);
  }

  // Step 6: Check if out directory exists and has content
  const outPath = path.join(process.cwd(), 'out');
  if (!fs.existsSync(outPath)) {
    throw new Error('Build output directory not found!');
  }

  const files = fs.readdirSync(outPath);
  if (files.length === 0) {
    throw new Error('Build output directory is empty!');
  }

  console.log('✅ Build completed successfully!');
  console.log(`📁 Build output: ${outPath}`);
  console.log(`📄 Files generated: ${files.length}`);

  // Step 7: Git operations for deployment
  console.log('🔧 Preparing for deployment...');
  
  // Add all files to git
  execSync('git add .', { stdio: 'inherit' });
  
  // Check if there are changes to commit
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  
  if (status.trim()) {
    // Commit changes
    const commitMessage = `Deploy: ${new Date().toISOString()}`;
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    
    // Push to main branch
    console.log('🚀 Pushing to main branch...');
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('✅ Deployment initiated!');
    console.log('📋 Next steps:');
    console.log('   1. Check GitHub Actions for deployment status');
    console.log('   2. Visit your GitHub Pages URL once deployment completes');
    console.log('   3. Verify all pages are working correctly');
  } else {
    console.log('ℹ️  No changes to deploy');
  }

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
} 