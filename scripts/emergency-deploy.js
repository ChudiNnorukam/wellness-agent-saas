#!/usr/bin/env node

/**
 * Emergency Deployment Script
 * Forces complete rebuild and deployment to fix Vercel issues
 */

const fs = require('fs');
const { execSync } = require('child_process');

class EmergencyDeployer {
  constructor() {
    this.timestamp = new Date().toISOString();
    this.buildId = `emergency-${Date.now()}`;
  }

  async emergencyDeploy() {
    console.log('🚨 EMERGENCY DEPLOYMENT');
    console.log('=======================\n');

    // Step 1: Force clean build
    await this.forceCleanBuild();
    
    // Step 2: Create emergency marker
    await this.createEmergencyMarker();
    
    // Step 3: Force deployment
    await this.forceDeployment();
    
    // Step 4: Verify deployment
    await this.verifyDeployment();
  }

  async forceCleanBuild() {
    console.log('1️⃣ Force clean build...');
    try {
      // Remove build artifacts
      execSync('rm -rf .next', { stdio: 'inherit' });
      execSync('rm -rf node_modules/.cache', { stdio: 'inherit' });
      
      // Clean install
      execSync('npm ci', { stdio: 'inherit' });
      
      // Force build
      execSync('npm run build', { stdio: 'inherit' });
      
      console.log('✅ Clean build completed');
    } catch (error) {
      console.log('❌ Clean build failed:', error.message);
    }
    console.log('');
  }

  async createEmergencyMarker() {
    console.log('2️⃣ Creating emergency marker...');
    try {
      const markerContent = `EMERGENCY DEPLOYMENT
====================
Timestamp: ${this.timestamp}
Build ID: ${this.buildId}
Status: EMERGENCY
Action: Force rebuild and deploy
Cache: Disabled
Force: Yes
`;

      fs.writeFileSync('EMERGENCY_DEPLOY.txt', markerContent);
      
      // Create emergency page
      const emergencyPage = `export default function EmergencyPage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🚨 Emergency Deployment</h1>
      <p>Timestamp: ${this.timestamp}</p>
      <p>Build ID: ${this.buildId}</p>
      <p>This page confirms the emergency deployment worked.</p>
      <p>If you see this, Vercel is serving our custom code!</p>
    </div>
  );
}`;

      const emergencyDir = 'src/app/emergency';
      if (!fs.existsSync(emergencyDir)) {
        fs.mkdirSync(emergencyDir, { recursive: true });
      }
      fs.writeFileSync(`${emergencyDir}/page.tsx`, emergencyPage);
      
      console.log('✅ Emergency marker created');
    } catch (error) {
      console.log('❌ Emergency marker failed:', error.message);
    }
    console.log('');
  }

  async forceDeployment() {
    console.log('3️⃣ Force deployment...');
    try {
      // Add all files
      execSync('git add .', { stdio: 'inherit' });
      
      // Commit emergency deployment
      const commitMessage = `EMERGENCY: Force rebuild and deploy - ${this.timestamp} - Build ${this.buildId}`;
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
      
      // Force push
      execSync('git push origin main --force', { stdio: 'inherit' });
      
      console.log('✅ Emergency deployment completed');
    } catch (error) {
      console.log('❌ Emergency deployment failed:', error.message);
    }
    console.log('');
  }

  async verifyDeployment() {
    console.log('4️⃣ Verifying emergency deployment...');
    console.log('⏳ Waiting 120 seconds for deployment...');
    
    // Wait longer for emergency deployment
    await new Promise(resolve => setTimeout(resolve, 120000));
    
    try {
      const endpoints = [
        '/',
        '/emergency',
        '/generate',
        '/dashboard'
      ];

      console.log('🔍 Checking endpoints...');
      for (const endpoint of endpoints) {
        const url = `https://wellness-agent-saas.vercel.app${endpoint}`;
        const response = await fetch(url);
        const status = response.status;
        const cache = response.headers.get('x-vercel-cache') || 'unknown';
        
        console.log(`${endpoint}: ${status} (${cache})`);
        
        if (endpoint === '/emergency') {
          const text = await response.text();
          if (text.includes(this.buildId)) {
            console.log(`✅ Emergency page shows fresh content!`);
            console.log(`🎉 Vercel is now serving our custom code!`);
          } else {
            console.log(`❌ Emergency page shows stale content`);
          }
        }
      }
    } catch (error) {
      console.log('❌ Verification failed:', error.message);
    }
    
    console.log('\n🚨 Emergency Deployment Summary:');
    console.log(`   Timestamp: ${this.timestamp}`);
    console.log(`   Build ID: ${this.buildId}`);
    console.log(`   Status: Emergency`);
    console.log(`   Check: https://wellness-agent-saas.vercel.app/emergency`);
  }
}

// Run emergency deployment
if (require.main === module) {
  const deployer = new EmergencyDeployer();
  deployer.emergencyDeploy().catch(console.error);
}

module.exports = EmergencyDeployer;