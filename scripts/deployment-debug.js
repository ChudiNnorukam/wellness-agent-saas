#!/usr/bin/env node

/**
 * Comprehensive Deployment Debug Script
 * Diagnoses Vercel deployment issues systematically
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DeploymentDebugger {
  constructor() {
    this.debugReport = {
      timestamp: new Date().toISOString(),
      issues: [],
      recommendations: [],
      status: 'unknown'
    };
  }

  async runFullDiagnosis() {
    console.log('🔍 Comprehensive Deployment Diagnosis');
    console.log('=====================================\n');

    await this.checkLocalBuild();
    await this.checkGitStatus();
    await this.checkVercelConfig();
    await this.checkDeploymentStatus();
    await this.checkContentMismatch();
    await this.generateReport();
  }

  async checkLocalBuild() {
    console.log('1️⃣ Checking Local Build...');
    try {
      const buildOutput = execSync('npm run build', { encoding: 'utf8' });
      if (buildOutput.includes('✓ Compiled successfully')) {
        console.log('✅ Local build successful');
        this.debugReport.localBuild = 'success';
      } else {
        console.log('❌ Local build failed');
        this.debugReport.localBuild = 'failed';
        this.debugReport.issues.push('Local build failed');
      }
    } catch (error) {
      console.log('❌ Local build error:', error.message);
      this.debugReport.localBuild = 'error';
      this.debugReport.issues.push(`Local build error: ${error.message}`);
    }
    console.log('');
  }

  async checkGitStatus() {
    console.log('2️⃣ Checking Git Status...');
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      const gitLog = execSync('git log --oneline -3', { encoding: 'utf8' });
      
      if (gitStatus.trim() === '') {
        console.log('✅ Git working directory clean');
        this.debugReport.gitStatus = 'clean';
      } else {
        console.log('⚠️ Uncommitted changes detected');
        this.debugReport.gitStatus = 'dirty';
        this.debugReport.issues.push('Uncommitted changes in git');
      }
      
      console.log('📝 Recent commits:');
      console.log(gitLog);
      this.debugReport.recentCommits = gitLog.split('\n').filter(line => line.trim());
    } catch (error) {
      console.log('❌ Git status error:', error.message);
      this.debugReport.gitStatus = 'error';
      this.debugReport.issues.push(`Git error: ${error.message}`);
    }
    console.log('');
  }

  async checkVercelConfig() {
    console.log('3️⃣ Checking Vercel Configuration...');
    try {
      const vercelConfigPath = path.join(__dirname, '..', 'vercel.json');
      const nextConfigPath = path.join(__dirname, '..', 'next.config.ts');
      
      if (fs.existsSync(vercelConfigPath)) {
        const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
        console.log('✅ vercel.json found');
        console.log('📋 Vercel config:', JSON.stringify(vercelConfig, null, 2));
        this.debugReport.vercelConfig = vercelConfig;
      } else {
        console.log('❌ vercel.json not found');
        this.debugReport.issues.push('Missing vercel.json');
      }
      
      if (fs.existsSync(nextConfigPath)) {
        const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
        console.log('✅ next.config.ts found');
        this.debugReport.nextConfig = 'exists';
      } else {
        console.log('❌ next.config.ts not found');
        this.debugReport.issues.push('Missing next.config.ts');
      }
    } catch (error) {
      console.log('❌ Config check error:', error.message);
      this.debugReport.issues.push(`Config error: ${error.message}`);
    }
    console.log('');
  }

  async checkDeploymentStatus() {
    console.log('4️⃣ Checking Deployment Status...');
    try {
      const response = await fetch('https://wellness-agent-saas.vercel.app');
      const headers = response.headers;
      const status = response.status;
      
      console.log(`📊 Status: ${status}`);
      console.log(`📅 Last-Modified: ${headers.get('last-modified')}`);
      console.log(`🔄 Cache: ${headers.get('x-vercel-cache')}`);
      console.log(`🏷️ Vercel ID: ${headers.get('x-vercel-id')}`);
      
      this.debugReport.deploymentStatus = {
        status,
        lastModified: headers.get('last-modified'),
        cache: headers.get('x-vercel-cache'),
        vercelId: headers.get('x-vercel-id')
      };
      
      if (status === 200) {
        console.log('✅ Main page accessible');
      } else {
        console.log('❌ Main page not accessible');
        this.debugReport.issues.push(`Main page status: ${status}`);
      }
    } catch (error) {
      console.log('❌ Deployment check error:', error.message);
      this.debugReport.issues.push(`Deployment error: ${error.message}`);
    }
    console.log('');
  }

  async checkContentMismatch() {
    console.log('5️⃣ Checking Content Mismatch...');
    try {
      const response = await fetch('https://wellness-agent-saas.vercel.app');
      const html = await response.text();
      
      // Check for default Next.js template indicators
      const isDefaultTemplate = html.includes('Create Next App') && 
                               html.includes('Get started by editing') &&
                               html.includes('src/app/page.tsx');
      
      if (isDefaultTemplate) {
        console.log('❌ CRITICAL: Vercel serving default Next.js template');
        console.log('🔍 This indicates deployment is not using our custom code');
        this.debugReport.contentMismatch = 'default_template';
        this.debugReport.issues.push('Vercel serving default Next.js template instead of WellnessAI');
        this.debugReport.recommendations.push('Vercel project may be misconfigured or linked to wrong repository');
      } else {
        console.log('✅ Custom content detected');
        this.debugReport.contentMismatch = 'custom_content';
      }
    } catch (error) {
      console.log('❌ Content check error:', error.message);
      this.debugReport.issues.push(`Content check error: ${error.message}`);
    }
    console.log('');
  }

  async generateReport() {
    console.log('📊 Debug Report Summary');
    console.log('=======================\n');
    
    console.log(`🕐 Timestamp: ${this.debugReport.timestamp}`);
    console.log(`📋 Issues Found: ${this.debugReport.issues.length}`);
    console.log(`💡 Recommendations: ${this.debugReport.recommendations.length}\n`);
    
    if (this.debugReport.issues.length > 0) {
      console.log('❌ Issues:');
      this.debugReport.issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
      console.log('');
    }
    
    if (this.debugReport.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      this.debugReport.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`);
      });
      console.log('');
    }
    
    // Save detailed report
    const reportPath = path.join(__dirname, '..', 'data', 'deployment-debug-report.json');
    const reportDir = path.dirname(reportPath);
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(this.debugReport, null, 2));
    console.log(`📄 Detailed report saved to: ${reportPath}`);
    
    // Determine overall status
    if (this.debugReport.issues.includes('Vercel serving default Next.js template instead of WellnessAI')) {
      console.log('\n🚨 CRITICAL ISSUE DETECTED');
      console.log('==========================');
      console.log('Vercel is serving the default Next.js template instead of your WellnessAI app.');
      console.log('This indicates a fundamental deployment configuration problem.');
      console.log('\n🔧 IMMEDIATE ACTIONS REQUIRED:');
      console.log('1. Check Vercel dashboard project settings');
      console.log('2. Verify GitHub integration is correct');
      console.log('3. Ensure project is linked to correct repository');
      console.log('4. Manually trigger redeployment from Vercel dashboard');
      console.log('5. Check if project was created from wrong template');
    }
  }
}

// Run diagnosis
if (require.main === module) {
  const debugger = new DeploymentDebugger();
  debugger.runFullDiagnosis().catch(console.error);
}

module.exports = DeploymentDebugger;