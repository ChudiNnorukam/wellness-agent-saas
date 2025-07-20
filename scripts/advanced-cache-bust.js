#!/usr/bin/env node

/**
 * Advanced Cache-Busting Script for Vercel
 * Forces fresh deployment and cache invalidation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AdvancedCacheBuster {
  constructor() {
    this.timestamp = new Date().toISOString();
    this.version = this.getCurrentVersion();
  }

  getCurrentVersion() {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return packageJson.version;
    } catch (error) {
      return '0.1.0';
    }
  }

  async forceCacheBust() {
    console.log('🚀 Advanced Cache-Busting Deployment');
    console.log('====================================\n');

    // Step 1: Update version with timestamp
    await this.updateVersion();
    
    // Step 2: Create cache-busting files
    await this.createCacheBustFiles();
    
    // Step 3: Update deployment marker
    await this.updateDeploymentMarker();
    
    // Step 4: Force commit and push
    await this.forceDeploy();
    
    // Step 5: Wait and verify
    await this.waitAndVerify();
  }

  async updateVersion() {
    console.log('1️⃣ Updating version with timestamp...');
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const [major, minor, patch] = packageJson.version.split('.');
      const newVersion = `${major}.${minor}.${parseInt(patch) + 1}`;
      
      packageJson.version = newVersion;
      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
      
      this.version = newVersion;
      console.log(`✅ Updated version to ${newVersion}`);
    } catch (error) {
      console.log('❌ Version update failed:', error.message);
    }
    console.log('');
  }

  async createCacheBustFiles() {
    console.log('2️⃣ Creating cache-busting files...');
    try {
      // Create timestamp-based cache bust file
      const cacheBustContent = `// Cache bust: ${this.timestamp}
// Version: ${this.version}
// Force fresh deployment
export const CACHE_BUST = '${this.timestamp}';
export const VERSION = '${this.version}';
`;

      fs.writeFileSync('src/lib/cache-bust.ts', cacheBustContent);
      
      // Create dynamic route with timestamp
      const dynamicRouteContent = `export default function CacheBustPage() {
  return (
    <div>
      <h1>Cache Bust: ${this.timestamp}</h1>
      <p>Version: ${this.version}</p>
      <p>This page forces cache invalidation</p>
    </div>
  );
}`;

      const dynamicDir = 'src/app/cache-bust';
      if (!fs.existsSync(dynamicDir)) {
        fs.mkdirSync(dynamicDir, { recursive: true });
      }
      fs.writeFileSync(`${dynamicDir}/page.tsx`, dynamicRouteContent);
      
      console.log('✅ Cache-busting files created');
    } catch (error) {
      console.log('❌ Cache-bust file creation failed:', error.message);
    }
    console.log('');
  }

  async updateDeploymentMarker() {
    console.log('3️⃣ Updating deployment marker...');
    try {
      const markerContent = `DEPLOYMENT MARKER
==================
Timestamp: ${this.timestamp}
Version: ${this.version}
Cache Bust: Enabled
Force Fresh: Yes
Build ID: ${Date.now()}
`;

      fs.writeFileSync('DEPLOY_MARKER.txt', markerContent);
      console.log('✅ Deployment marker updated');
    } catch (error) {
      console.log('❌ Deployment marker update failed:', error.message);
    }
    console.log('');
  }

  async forceDeploy() {
    console.log('4️⃣ Force deploying to Vercel...');
    try {
      // Add all files
      execSync('git add .', { stdio: 'inherit' });
      
      // Commit with timestamp
      const commitMessage = `Force cache-bust deploy: ${this.timestamp} - Version ${this.version}`;
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
      
      // Push to trigger deployment
      execSync('git push origin main', { stdio: 'inherit' });
      
      console.log('✅ Force deployment completed');
    } catch (error) {
      console.log('❌ Force deployment failed:', error.message);
    }
    console.log('');
  }

  async waitAndVerify() {
    console.log('5️⃣ Waiting for deployment and verifying...');
    console.log('⏳ Waiting 90 seconds for deployment to complete...');
    
    // Wait for deployment
    await new Promise(resolve => setTimeout(resolve, 90000));
    
    // Verify deployment
    await this.verifyDeployment();
  }

  async verifyDeployment() {
    console.log('🔍 Verifying deployment...');
    try {
      const endpoints = [
        '/',
        '/generate',
        '/dashboard',
        '/api/wellness/generate',
        '/cache-bust'
      ];

      for (const endpoint of endpoints) {
        const url = `https://wellness-agent-saas.vercel.app${endpoint}`;
        const response = await fetch(url);
        const headers = response.headers;
        
        console.log(`${endpoint}: ${response.status} (${headers.get('x-vercel-cache') || 'unknown'})`);
        
        if (endpoint === '/cache-bust') {
          const text = await response.text();
          if (text.includes(this.timestamp)) {
            console.log(`✅ Cache-bust page shows fresh content`);
          } else {
            console.log(`❌ Cache-bust page shows stale content`);
          }
        }
      }
    } catch (error) {
      console.log('❌ Verification failed:', error.message);
    }
    
    console.log('\n🎯 Deployment Summary:');
    console.log(`   Timestamp: ${this.timestamp}`);
    console.log(`   Version: ${this.version}`);
    console.log(`   Cache Bust: Enabled`);
    console.log(`   Check: https://wellness-agent-saas.vercel.app/cache-bust`);
  }
}

// Run advanced cache busting
if (require.main === module) {
  const cacheBuster = new AdvancedCacheBuster();
  cacheBuster.forceCacheBust().catch(console.error);
}

module.exports = AdvancedCacheBuster;