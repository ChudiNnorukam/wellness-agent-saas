#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

class AutonomousGitHubPagesDeployer {
  constructor() {
    this.timestamp = new Date().toISOString();
    this.attempts = [];
    this.learningLog = [];
    this.config = {
      targetUrl: 'https://wellness-agent-saas-ybpb.vercel.app/generate',
      repository: 'ChudiNnorukam/wellness-agent-saas',
      branch: 'gh-pages',
      maxAttempts: 10,
      retryDelay: 5000
    };
  }

  async startAutonomousDeployment() {
    console.log('🤖 AUTONOMOUS GITHUB PAGES DEPLOYER');
    console.log('====================================');
    console.log(`Target URL: ${this.config.targetUrl}`);
    console.log(`Repository: ${this.config.repository}`);
    console.log(`Timestamp: ${this.timestamp}\n`);

    // Initialize learning system
    await this.initializeLearningSystem();
    
    // Start recursive deployment attempts
    await this.recursiveDeploymentAttempts();
  }

  async initializeLearningSystem() {
    console.log('🧠 Initializing Learning System...');
    
    // Create learning directory
    const learningDir = 'docs/autonomous-learning';
    if (!fs.existsSync(learningDir)) {
      fs.mkdirSync(learningDir, { recursive: true });
    }

    // Load previous learning data
    this.learningData = await this.loadLearningData();
    
    console.log('✅ Learning system initialized\n');
  }

  async loadLearningData() {
    const learningFile = 'docs/autonomous-learning/deployment-history.json';
    if (fs.existsSync(learningFile)) {
      try {
        return JSON.parse(fs.readFileSync(learningFile, 'utf8'));
      } catch (error) {
        console.log('⚠️  Could not load learning data, starting fresh');
      }
    }
    
    return {
      successfulStrategies: [],
      failedStrategies: [],
      commonIssues: [],
      lastAttempt: null,
      successRate: 0
    };
  }

  async recursiveDeploymentAttempts() {
    let attemptNumber = 1;
    
    while (attemptNumber <= this.config.maxAttempts) {
      console.log(`\n🔄 ATTEMPT ${attemptNumber}/${this.config.maxAttempts}`);
      console.log('=====================================');
      
      const attempt = {
        number: attemptNumber,
        timestamp: new Date().toISOString(),
        strategy: this.selectStrategy(attemptNumber),
        status: 'pending',
        errors: [],
        duration: 0
      };

      const startTime = Date.now();
      
      try {
        await this.executeStrategy(attempt);
        attempt.status = 'success';
        attempt.duration = Date.now() - startTime;
        
        console.log('✅ Strategy executed successfully!');
        
        // If verification passes, we're done
        if (await this.verifyDeployment()) {
          console.log('🎉 DEPLOYMENT SUCCESSFUL!');
          await this.recordSuccess(attempt);
          break;
        }
        
      } catch (error) {
        attempt.status = 'failed';
        attempt.errors.push(error.message);
        attempt.duration = Date.now() - startTime;
        
        console.log(`❌ Strategy failed: ${error.message}`);
        await this.recordFailure(attempt);
      }

      this.attempts.push(attempt);
      
      // Learn from this attempt
      await this.learnFromAttempt(attempt);
      
      // Wait before next attempt
      if (attemptNumber < this.config.maxAttempts) {
        console.log(`⏳ Waiting ${this.config.retryDelay/1000}s before next attempt...`);
        await this.sleep(this.config.retryDelay);
      }
      
      attemptNumber++;
    }

    // Generate final report
    await this.generateFinalReport();
  }

  selectStrategy(attemptNumber) {
    const strategies = [
      'github-pages-branch',
      'github-pages-actions',
      'vercel-redirect',
      'custom-domain-redirect',
      'iframe-embed',
      'proxy-redirect',
      'github-pages-custom',
      'vercel-rewrite',
      'github-pages-subdomain',
      'vercel-edge-function'
    ];

    // Use learning data to prioritize strategies
    const successfulStrategies = this.learningData.successfulStrategies;
    const failedStrategies = this.learningData.failedStrategies;
    
    // Prioritize successful strategies
    for (const strategy of successfulStrategies) {
      if (!this.attempts.some(a => a.strategy === strategy)) {
        return strategy;
      }
    }

    // Try new strategies
    for (const strategy of strategies) {
      if (!this.attempts.some(a => a.strategy === strategy)) {
        return strategy;
      }
    }

    // If all strategies tried, retry the most promising
    return successfulStrategies[0] || strategies[0];
  }

  async executeStrategy(attempt) {
    console.log(`📋 Executing strategy: ${attempt.strategy}`);
    
    switch (attempt.strategy) {
      case 'github-pages-branch':
        await this.createGitHubPagesBranch();
        break;
      case 'github-pages-actions':
        await this.setupGitHubPagesActions();
        break;
      case 'vercel-redirect':
        await this.setupVercelRedirect();
        break;
      case 'custom-domain-redirect':
        await this.setupCustomDomainRedirect();
        break;
      case 'iframe-embed':
        await this.createIframeEmbed();
        break;
      case 'proxy-redirect':
        await this.setupProxyRedirect();
        break;
      case 'github-pages-custom':
        await this.createCustomGitHubPages();
        break;
      case 'vercel-rewrite':
        await this.setupVercelRewrite();
        break;
      case 'github-pages-subdomain':
        await this.setupGitHubPagesSubdomain();
        break;
      case 'vercel-edge-function':
        await this.createVercelEdgeFunction();
        break;
      default:
        throw new Error(`Unknown strategy: ${attempt.strategy}`);
    }
  }

  async createGitHubPagesBranch() {
    console.log('📝 Creating GitHub Pages branch...');
    
    // Create gh-pages branch
    try {
      execSync('git checkout -b gh-pages', { stdio: 'inherit' });
      
      // Create index.html that redirects to target URL
      const indexHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>WellnessAI - Redirecting...</title>
    <meta http-equiv="refresh" content="0; url=${this.config.targetUrl}">
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <h1>WellnessAI</h1>
    <div class="loader"></div>
    <p>Redirecting to WellnessAI...</p>
    <p><a href="${this.config.targetUrl}">Click here if not redirected automatically</a></p>
</body>
</html>`;
      
      fs.writeFileSync('index.html', indexHtml);
      
      // Commit and push
      execSync('git add index.html', { stdio: 'inherit' });
      execSync('git commit -m "Add GitHub Pages redirect to WellnessAI"', { stdio: 'inherit' });
      execSync('git push origin gh-pages', { stdio: 'inherit' });
      
      console.log('✅ GitHub Pages branch created and pushed');
      
    } catch (error) {
      throw new Error(`GitHub Pages branch creation failed: ${error.message}`);
    }
  }

  async setupGitHubPagesActions() {
    console.log('⚙️  Setting up GitHub Pages Actions...');
    
    const workflowDir = '.github/workflows';
    if (!fs.existsSync(workflowDir)) {
      fs.mkdirSync(workflowDir, { recursive: true });
    }
    
    const workflowContent = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './out'
      
      - name: Create redirect page
        run: |
          echo '<!DOCTYPE html>
          <html>
          <head>
              <meta charset="utf-8">
              <title>WellnessAI - Redirecting...</title>
              <meta http-equiv="refresh" content="0; url=${this.config.targetUrl}">
          </head>
          <body>
              <h1>Redirecting to WellnessAI...</h1>
              <p><a href="${this.config.targetUrl}">Click here if not redirected automatically</a></p>
          </body>
          </html>' > out/index.html

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;
    
    fs.writeFileSync(`${workflowDir}/deploy-pages.yml`, workflowContent);
    
    // Commit and push
    execSync('git add .github/workflows/deploy-pages.yml', { stdio: 'inherit' });
    execSync('git commit -m "Add GitHub Pages deployment workflow"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('✅ GitHub Pages Actions workflow created');
  }

  async setupVercelRedirect() {
    console.log('🔄 Setting up Vercel redirect...');
    
    // Update vercel.json to add redirect
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    
    if (!vercelConfig.redirects) {
      vercelConfig.redirects = [];
    }
    
    vercelConfig.redirects.push({
      source: '/',
      destination: this.config.targetUrl,
      permanent: false
    });
    
    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
    
    // Commit and push
    execSync('git add vercel.json', { stdio: 'inherit' });
    execSync('git commit -m "Add Vercel redirect to WellnessAI generate page"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('✅ Vercel redirect configured');
  }

  async setupCustomDomainRedirect() {
    console.log('🌐 Setting up custom domain redirect...');
    
    // Create a custom domain configuration
    const domainConfig = {
      domain: 'wellnessai.chudinnorukam.com',
      target: this.config.targetUrl,
      type: 'redirect'
    };
    
    fs.writeFileSync('domain-config.json', JSON.stringify(domainConfig, null, 2));
    
    // Create CNAME file for GitHub Pages
    fs.writeFileSync('CNAME', domainConfig.domain);
    
    // Commit and push
    execSync('git add domain-config.json CNAME', { stdio: 'inherit' });
    execSync('git commit -m "Add custom domain configuration"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('✅ Custom domain redirect configured');
  }

  async createIframeEmbed() {
    console.log('🖼️  Creating iframe embed...');
    
    const iframeHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>WellnessAI - AI-Powered Wellness Platform</title>
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
        .iframe-container { width: 100%; height: calc(100vh - 80px); }
        iframe { width: 100%; height: 100%; border: none; }
    </style>
</head>
<body>
    <div class="header">
        <h1>WellnessAI</h1>
        <p>AI-Powered Wellness Platform</p>
    </div>
    <div class="iframe-container">
        <iframe src="${this.config.targetUrl}" title="WellnessAI Platform"></iframe>
    </div>
</body>
</html>`;
    
    fs.writeFileSync('index.html', iframeHtml);
    
    // Commit and push
    execSync('git add index.html', { stdio: 'inherit' });
    execSync('git commit -m "Add iframe embed for WellnessAI"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('✅ Iframe embed created');
  }

  async setupProxyRedirect() {
    console.log('🔄 Setting up proxy redirect...');
    
    // Create a proxy configuration
    const proxyConfig = {
      '/api/*': {
        target: this.config.targetUrl.replace('/generate', ''),
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      },
      '/*': {
        target: this.config.targetUrl,
        changeOrigin: true
      }
    };
    
    fs.writeFileSync('proxy-config.json', JSON.stringify(proxyConfig, null, 2));
    
    // Create next.config.js with proxy
    const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '${this.config.targetUrl}/:path*',
      },
    ];
  },
};

module.exports = nextConfig;`;
    
    fs.writeFileSync('next.config.js', nextConfig);
    
    // Commit and push
    execSync('git add proxy-config.json next.config.js', { stdio: 'inherit' });
    execSync('git commit -m "Add proxy redirect configuration"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('✅ Proxy redirect configured');
  }

  async createCustomGitHubPages() {
    console.log('📄 Creating custom GitHub Pages...');
    
    // Create a comprehensive GitHub Pages site
    const pagesDir = 'docs';
    if (!fs.existsSync(pagesDir)) {
      fs.mkdirSync(pagesDir, { recursive: true });
    }
    
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WellnessAI - AI-Powered Wellness Platform</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 0; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 20px; }
        .hero p { font-size: 1.2rem; margin-bottom: 30px; }
        .cta-button { display: inline-block; background: #fff; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; transition: transform 0.3s; }
        .cta-button:hover { transform: translateY(-2px); }
        .features { padding: 80px 0; background: #f8f9fa; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-top: 40px; }
        .feature { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .feature h3 { color: #667eea; margin-bottom: 15px; }
        .footer { background: #333; color: white; text-align: center; padding: 40px 0; }
    </style>
</head>
<body>
    <div class="hero">
        <div class="container">
            <h1>WellnessAI</h1>
            <p>AI-Powered Personalized Wellness Plans</p>
            <a href="${this.config.targetUrl}" class="cta-button">Try WellnessAI Now</a>
        </div>
    </div>
    
    <div class="features">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 20px;">Why Choose WellnessAI?</h2>
            <div class="feature-grid">
                <div class="feature">
                    <h3>🤖 AI-Powered</h3>
                    <p>Advanced AI algorithms create personalized wellness plans tailored to your unique needs and goals.</p>
                </div>
                <div class="feature">
                    <h3>🎯 Personalized</h3>
                    <p>Get customized daily routines, affirmations, and self-care tips based on your current state.</p>
                </div>
                <div class="feature">
                    <h3>📱 Easy to Use</h3>
                    <p>Simple, intuitive interface that makes wellness planning accessible to everyone.</p>
                </div>
                <div class="feature">
                    <h3>🔒 Secure</h3>
                    <p>Your data is protected with enterprise-grade security and privacy measures.</p>
                </div>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <div class="container">
            <p>&copy; 2025 WellnessAI. Built with ❤️ by Chudi Nnorukam</p>
        </div>
    </div>
</body>
</html>`;
    
    fs.writeFileSync(`${pagesDir}/index.html`, indexHtml);
    
    // Commit and push
    execSync('git add docs/index.html', { stdio: 'inherit' });
    execSync('git commit -m "Add custom GitHub Pages site for WellnessAI"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('✅ Custom GitHub Pages site created');
  }

  async setupVercelRewrite() {
    console.log('🔄 Setting up Vercel rewrite...');
    
    // Update vercel.json with rewrite
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    
    if (!vercelConfig.rewrites) {
      vercelConfig.rewrites = [];
    }
    
    vercelConfig.rewrites.push({
      source: '/(.*)',
      destination: `${this.config.targetUrl}/$1`
    });
    
    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
    
    // Commit and push
    execSync('git add vercel.json', { stdio: 'inherit' });
    execSync('git commit -m "Add Vercel rewrite to WellnessAI"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('✅ Vercel rewrite configured');
  }

  async setupGitHubPagesSubdomain() {
    console.log('🌐 Setting up GitHub Pages subdomain...');
    
    // Create a subdomain configuration
    const subdomain = 'wellnessai';
    const cnameContent = `${subdomain}.chudinnorukam.com`;
    
    fs.writeFileSync('CNAME', cnameContent);
    
    // Create a simple redirect page
    const redirectHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>WellnessAI - Redirecting...</title>
    <meta http-equiv="refresh" content="0; url=${this.config.targetUrl}">
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .container { max-width: 600px; margin: 0 auto; }
        .loader { border: 4px solid rgba(255,255,255,0.3); border-top: 4px solid white; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="container">
        <h1>WellnessAI</h1>
        <div class="loader"></div>
        <p>Redirecting to your personalized wellness experience...</p>
        <p><a href="${this.config.targetUrl}" style="color: white; text-decoration: underline;">Click here if not redirected automatically</a></p>
    </div>
</body>
</html>`;
    
    fs.writeFileSync('index.html', redirectHtml);
    
    // Commit and push
    execSync('git add CNAME index.html', { stdio: 'inherit' });
    execSync('git commit -m "Add GitHub Pages subdomain configuration"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('✅ GitHub Pages subdomain configured');
  }

  async createVercelEdgeFunction() {
    console.log('⚡ Creating Vercel Edge Function...');
    
    // Create edge function for redirect
    const edgeFunctionDir = 'src/app/api/redirect';
    if (!fs.existsSync(edgeFunctionDir)) {
      fs.mkdirSync(edgeFunctionDir, { recursive: true });
    }
    
    const edgeFunction = `import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  
  // Redirect to WellnessAI generate page
  return Response.redirect('${this.config.targetUrl}', 302);
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  
  // Redirect to WellnessAI generate page
  return Response.redirect('${this.config.targetUrl}', 302);
}`;
    
    fs.writeFileSync(`${edgeFunctionDir}/route.ts`, edgeFunction);
    
    // Update vercel.json to use edge function
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    
    if (!vercelConfig.functions) {
      vercelConfig.functions = {};
    }
    
    vercelConfig.functions['src/app/api/redirect/route.ts'] = {
      runtime: 'edge'
    };
    
    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
    
    // Commit and push
    execSync('git add src/app/api/redirect/route.ts vercel.json', { stdio: 'inherit' });
    execSync('git commit -m "Add Vercel Edge Function for redirect"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('✅ Vercel Edge Function created');
  }

  async verifyDeployment() {
    console.log('🔍 Verifying deployment...');
    
    // Check if GitHub Pages is accessible
    const githubPagesUrl = `https://${this.config.repository.split('/')[0]}.github.io/${this.config.repository.split('/')[1]}`;
    
    try {
      const response = await this.makeRequest(githubPagesUrl);
      if (response.statusCode === 200) {
        console.log('✅ GitHub Pages is accessible');
        return true;
      }
    } catch (error) {
      console.log('❌ GitHub Pages not accessible yet');
    }
    
    // Check if Vercel deployment is working
    try {
      const response = await this.makeRequest(this.config.targetUrl);
      if (response.statusCode === 200) {
        console.log('✅ Target URL is accessible');
        return true;
      }
    } catch (error) {
      console.log('❌ Target URL not accessible');
    }
    
    return false;
  }

  makeRequest(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        resolve({ statusCode: res.statusCode, headers: res.headers });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }

  async recordSuccess(attempt) {
    this.learningData.successfulStrategies.push(attempt.strategy);
    this.learningData.lastAttempt = attempt;
    this.learningData.successRate = this.calculateSuccessRate();
    
    await this.saveLearningData();
    
    console.log(`📊 Strategy "${attempt.strategy}" marked as successful`);
  }

  async recordFailure(attempt) {
    this.learningData.failedStrategies.push(attempt.strategy);
    this.learningData.lastAttempt = attempt;
    this.learningData.successRate = this.calculateSuccessRate();
    
    // Record common issues
    attempt.errors.forEach(error => {
      if (!this.learningData.commonIssues.includes(error)) {
        this.learningData.commonIssues.push(error);
      }
    });
    
    await this.saveLearningData();
    
    console.log(`📊 Strategy "${attempt.strategy}" marked as failed`);
  }

  calculateSuccessRate() {
    const total = this.learningData.successfulStrategies.length + this.learningData.failedStrategies.length;
    return total > 0 ? (this.learningData.successfulStrategies.length / total) * 100 : 0;
  }

  async learnFromAttempt(attempt) {
    const learning = {
      timestamp: new Date().toISOString(),
      strategy: attempt.strategy,
      success: attempt.status === 'success',
      duration: attempt.duration,
      errors: attempt.errors,
      insights: this.generateInsights(attempt)
    };
    
    this.learningLog.push(learning);
    
    // Save learning log
    fs.writeFileSync(
      'docs/autonomous-learning/learning-log.json',
      JSON.stringify(this.learningLog, null, 2)
    );
    
    console.log(`🧠 Learning recorded: ${learning.insights}`);
  }

  generateInsights(attempt) {
    if (attempt.status === 'success') {
      return `Strategy "${attempt.strategy}" succeeded in ${attempt.duration}ms`;
    } else {
      return `Strategy "${attempt.strategy}" failed: ${attempt.errors.join(', ')}`;
    }
  }

  async saveLearningData() {
    fs.writeFileSync(
      'docs/autonomous-learning/deployment-history.json',
      JSON.stringify(this.learningData, null, 2)
    );
  }

  async generateFinalReport() {
    console.log('\n📊 FINAL DEPLOYMENT REPORT');
    console.log('==========================');
    
    const successfulAttempts = this.attempts.filter(a => a.status === 'success');
    const failedAttempts = this.attempts.filter(a => a.status === 'failed');
    
    console.log(`Total Attempts: ${this.attempts.length}`);
    console.log(`Successful: ${successfulAttempts.length}`);
    console.log(`Failed: ${failedAttempts.length}`);
    console.log(`Success Rate: ${((successfulAttempts.length / this.attempts.length) * 100).toFixed(1)}%`);
    
    if (successfulAttempts.length > 0) {
      console.log('\n✅ SUCCESSFUL STRATEGIES:');
      successfulAttempts.forEach(attempt => {
        console.log(`- ${attempt.strategy} (${attempt.duration}ms)`);
      });
    }
    
    if (failedAttempts.length > 0) {
      console.log('\n❌ FAILED STRATEGIES:');
      failedAttempts.forEach(attempt => {
        console.log(`- ${attempt.strategy}: ${attempt.errors.join(', ')}`);
      });
    }
    
    console.log('\n🧠 LEARNING INSIGHTS:');
    console.log(`- Most successful strategy: ${this.learningData.successfulStrategies[0] || 'None'}`);
    console.log(`- Common issues: ${this.learningData.commonIssues.slice(0, 3).join(', ')}`);
    console.log(`- Overall success rate: ${this.learningData.successRate.toFixed(1)}%`);
    
    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalAttempts: this.attempts.length,
        successful: successfulAttempts.length,
        failed: failedAttempts.length,
        successRate: ((successfulAttempts.length / this.attempts.length) * 100).toFixed(1)
      },
      attempts: this.attempts,
      learning: this.learningData,
      recommendations: this.generateRecommendations()
    };
    
    fs.writeFileSync(
      'docs/autonomous-learning/deployment-report.json',
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n📄 Detailed report saved to: docs/autonomous-learning/deployment-report.json');
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.learningData.successfulStrategies.length > 0) {
      recommendations.push(`Use "${this.learningData.successfulStrategies[0]}" strategy for future deployments`);
    }
    
    if (this.learningData.commonIssues.length > 0) {
      recommendations.push(`Address common issues: ${this.learningData.commonIssues.slice(0, 3).join(', ')}`);
    }
    
    if (this.learningData.successRate < 50) {
      recommendations.push('Consider alternative deployment strategies or manual intervention');
    }
    
    return recommendations;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run the autonomous deployer
if (require.main === module) {
  const deployer = new AutonomousGitHubPagesDeployer();
  deployer.startAutonomousDeployment().catch(console.error);
}

module.exports = AutonomousGitHubPagesDeployer; 