#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

class WorkflowAutomationAPI {
  constructor() {
    this.config = {
      services: {
        github: {
          name: 'GitHub',
          requiredKeys: ['GITHUB_TOKEN', 'GITHUB_USERNAME'],
          oauthScopes: ['repo', 'workflow', 'admin:org'],
          configFiles: ['.github/workflows/*.yml', '.github/config.yml']
        },
        vercel: {
          name: 'Vercel',
          requiredKeys: ['VERCEL_TOKEN', 'VERCEL_ORG_ID', 'VERCEL_PROJECT_ID'],
          oauthScopes: ['read:user', 'read:org', 'write:project'],
          configFiles: ['vercel.json', '.vercel/project.json']
        },
        supabase: {
          name: 'Supabase',
          requiredKeys: ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
          oauthScopes: ['read', 'write'],
          configFiles: ['supabase/config.toml', '.env.local']
        },
        stripe: {
          name: 'Stripe',
          requiredKeys: ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY', 'STRIPE_WEBHOOK_SECRET'],
          oauthScopes: ['read', 'write'],
          configFiles: ['stripe-config.json', '.env.local']
        }
      },
      automationWorkflows: {
        deployment: {
          name: 'Automated Deployment',
          steps: ['validate-config', 'test-connections', 'deploy', 'verify', 'monitor'],
          triggers: ['push', 'pull-request', 'manual']
        },
        monitoring: {
          name: 'Health Monitoring',
          steps: ['check-status', 'analyze-logs', 'alert-if-needed'],
          triggers: ['scheduled', 'webhook']
        },
        optimization: {
          name: 'Performance Optimization',
          steps: ['analyze-metrics', 'optimize-config', 'deploy-changes'],
          triggers: ['scheduled', 'threshold-exceeded']
        }
      }
    };
    
    this.detectedConfigs = {};
    this.missingConfigs = {};
    this.automationStatus = {};
  }

  async startAutomationDiscovery() {
    console.log('🔍 WORKFLOW AUTOMATION API - CONFIGURATION DISCOVERY');
    console.log('==================================================');
    
    // Step 1: Discover current configurations
    await this.discoverCurrentConfigurations();
    
    // Step 2: Detect missing configurations
    await this.detectMissingConfigurations();
    
    // Step 3: Generate automation recommendations
    await this.generateAutomationRecommendations();
    
    // Step 4: Create automation workflows
    await this.createAutomationWorkflows();
    
    // Step 5: Test automation setup
    await this.testAutomationSetup();
    
    console.log('\n✅ Automation discovery completed!');
  }

  async discoverCurrentConfigurations() {
    console.log('\n📋 STEP 1: Discovering Current Configurations');
    console.log('=============================================');
    
    for (const [serviceKey, service] of Object.entries(this.config.services)) {
      console.log(`\n🔍 Checking ${service.name} configuration...`);
      
      this.detectedConfigs[serviceKey] = {
        name: service.name,
        configFiles: [],
        environmentVariables: [],
        oauthStatus: 'unknown',
        apiKeys: [],
        status: 'checking'
      };
      
      // Check for config files
      for (const configFile of service.configFiles) {
        if (this.fileExists(configFile)) {
          this.detectedConfigs[serviceKey].configFiles.push(configFile);
          console.log(`  ✅ Found config file: ${configFile}`);
        }
      }
      
      // Check for environment variables
      const envVars = this.checkEnvironmentVariables(service.requiredKeys);
      this.detectedConfigs[serviceKey].environmentVariables = envVars;
      
      if (envVars.length > 0) {
        console.log(`  ✅ Found environment variables: ${envVars.join(', ')}`);
      }
      
      // Check OAuth status
      const oauthStatus = await this.checkOAuthStatus(serviceKey);
      this.detectedConfigs[serviceKey].oauthStatus = oauthStatus;
      
      if (oauthStatus === 'configured') {
        console.log(`  ✅ OAuth configured for ${service.name}`);
      } else {
        console.log(`  ⚠️  OAuth not configured for ${service.name}`);
      }
      
      // Check API keys
      const apiKeys = await this.checkAPIKeys(serviceKey);
      this.detectedConfigs[serviceKey].apiKeys = apiKeys;
      
      if (apiKeys.length > 0) {
        console.log(`  ✅ Found API keys: ${apiKeys.length} configured`);
      }
      
      // Determine overall status
      this.detectedConfigs[serviceKey].status = this.determineServiceStatus(serviceKey);
      console.log(`  📊 Status: ${this.detectedConfigs[serviceKey].status}`);
    }
  }

  async detectMissingConfigurations() {
    console.log('\n❌ STEP 2: Detecting Missing Configurations');
    console.log('===========================================');
    
    for (const [serviceKey, service] of Object.entries(this.config.services)) {
      const detected = this.detectedConfigs[serviceKey];
      
      this.missingConfigs[serviceKey] = {
        name: service.name,
        missingKeys: [],
        missingFiles: [],
        missingOAuth: false,
        recommendations: []
      };
      
      // Check missing environment variables
      const missingKeys = service.requiredKeys.filter(key => 
        !detected.environmentVariables.includes(key)
      );
      
      if (missingKeys.length > 0) {
        this.missingConfigs[serviceKey].missingKeys = missingKeys;
        console.log(`\n🔑 ${service.name} - Missing Environment Variables:`);
        missingKeys.forEach(key => console.log(`  ❌ ${key}`));
      }
      
      // Check missing config files
      const missingFiles = service.configFiles.filter(file => 
        !detected.configFiles.includes(file)
      );
      
      if (missingFiles.length > 0) {
        this.missingConfigs[serviceKey].missingFiles = missingFiles;
        console.log(`\n📄 ${service.name} - Missing Config Files:`);
        missingFiles.forEach(file => console.log(`  ❌ ${file}`));
      }
      
      // Check OAuth status
      if (detected.oauthStatus !== 'configured') {
        this.missingConfigs[serviceKey].missingOAuth = true;
        console.log(`\n🔐 ${service.name} - OAuth Not Configured`);
        console.log(`  Required scopes: ${service.oauthScopes.join(', ')}`);
      }
      
      // Generate recommendations
      this.missingConfigs[serviceKey].recommendations = this.generateServiceRecommendations(serviceKey);
    }
  }

  async generateAutomationRecommendations() {
    console.log('\n🤖 STEP 3: Generating Automation Recommendations');
    console.log('===============================================');
    
    const recommendations = {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      automationWorkflows: []
    };
    
    // Immediate actions needed
    for (const [serviceKey, missing] of Object.entries(this.missingConfigs)) {
      if (missing.missingKeys.length > 0 || missing.missingOAuth) {
        recommendations.immediate.push({
          service: missing.name,
          action: 'Configure missing credentials',
          priority: 'high',
          steps: this.generateConfigurationSteps(serviceKey)
        });
      }
    }
    
    // Short-term automation opportunities
    const configuredServices = Object.keys(this.detectedConfigs).filter(
      key => this.detectedConfigs[key].status === 'configured'
    );
    
    if (configuredServices.length >= 2) {
      recommendations.shortTerm.push({
        action: 'Set up automated deployment pipeline',
        services: configuredServices,
        priority: 'medium',
        steps: this.generateDeploymentPipelineSteps(configuredServices)
      });
    }
    
    // Long-term automation strategies
    recommendations.longTerm.push({
      action: 'Implement comprehensive monitoring and optimization',
      description: 'Set up automated health checks, performance monitoring, and optimization workflows',
      priority: 'low',
      steps: this.generateMonitoringSteps()
    });
    
    // Generate automation workflows
    for (const [workflowKey, workflow] of Object.entries(this.config.automationWorkflows)) {
      if (this.canImplementWorkflow(workflowKey)) {
        recommendations.automationWorkflows.push({
          name: workflow.name,
          key: workflowKey,
          steps: workflow.steps,
          triggers: workflow.triggers,
          implementation: this.generateWorkflowImplementation(workflowKey)
        });
      }
    }
    
    // Save recommendations
    fs.writeFileSync(
      'docs/autonomous-learning/automation-recommendations.json',
      JSON.stringify(recommendations, null, 2)
    );
    
    // Display recommendations
    this.displayRecommendations(recommendations);
  }

  async createAutomationWorkflows() {
    console.log('\n⚙️  STEP 4: Creating Automation Workflows');
    console.log('=========================================');
    
    for (const [workflowKey, workflow] of Object.entries(this.config.automationWorkflows)) {
      if (this.canImplementWorkflow(workflowKey)) {
        console.log(`\n🔧 Creating ${workflow.name} workflow...`);
        
        try {
          await this.createWorkflowFiles(workflowKey, workflow);
          console.log(`  ✅ ${workflow.name} workflow created successfully`);
        } catch (error) {
          console.log(`  ❌ Failed to create ${workflow.name} workflow: ${error.message}`);
        }
      }
    }
  }

  async testAutomationSetup() {
    console.log('\n🧪 STEP 5: Testing Automation Setup');
    console.log('==================================');
    
    const testResults = {
      timestamp: new Date().toISOString(),
      tests: []
    };
    
    // Test each configured service
    for (const [serviceKey, detected] of Object.entries(this.detectedConfigs)) {
      if (detected.status === 'configured') {
        console.log(`\n🔍 Testing ${detected.name} automation...`);
        
        const testResult = await this.testServiceAutomation(serviceKey);
        testResults.tests.push(testResult);
        
        if (testResult.success) {
          console.log(`  ✅ ${detected.name} automation test passed`);
        } else {
          console.log(`  ❌ ${detected.name} automation test failed: ${testResult.error}`);
        }
      }
    }
    
    // Test workflow automation
    console.log('\n🔍 Testing workflow automation...');
    const workflowTest = await this.testWorkflowAutomation();
    testResults.tests.push(workflowTest);
    
    if (workflowTest.success) {
      console.log('  ✅ Workflow automation test passed');
    } else {
      console.log(`  ❌ Workflow automation test failed: ${workflowTest.error}`);
    }
    
    // Save test results
    fs.writeFileSync(
      'docs/autonomous-learning/automation-test-results.json',
      JSON.stringify(testResults, null, 2)
    );
    
    // Generate automation status report
    await this.generateAutomationStatusReport(testResults);
  }

  // Helper methods
  fileExists(filePath) {
    try {
      return fs.existsSync(filePath);
    } catch (error) {
      return false;
    }
  }

  checkEnvironmentVariables(requiredKeys) {
    const found = [];
    for (const key of requiredKeys) {
      if (process.env[key]) {
        found.push(key);
      }
    }
    return found;
  }

  async checkOAuthStatus(serviceKey) {
    // This would typically check OAuth tokens and their validity
    // For now, we'll simulate based on environment variables
    const service = this.config.services[serviceKey];
    
    if (serviceKey === 'github' && process.env.GITHUB_TOKEN) {
      return 'configured';
    } else if (serviceKey === 'vercel' && process.env.VERCEL_TOKEN) {
      return 'configured';
    }
    
    return 'not-configured';
  }

  async checkAPIKeys(serviceKey) {
    const service = this.config.services[serviceKey];
    const found = [];
    
    for (const key of service.requiredKeys) {
      if (process.env[key]) {
        found.push(key);
      }
    }
    
    return found;
  }

  determineServiceStatus(serviceKey) {
    const detected = this.detectedConfigs[serviceKey];
    const service = this.config.services[serviceKey];
    
    const hasRequiredKeys = detected.environmentVariables.length >= service.requiredKeys.length * 0.8;
    const hasOAuth = detected.oauthStatus === 'configured';
    const hasConfigFiles = detected.configFiles.length > 0;
    
    if (hasRequiredKeys && hasOAuth && hasConfigFiles) {
      return 'configured';
    } else if (hasRequiredKeys || hasOAuth || hasConfigFiles) {
      return 'partially-configured';
    } else {
      return 'not-configured';
    }
  }

  generateServiceRecommendations(serviceKey) {
    const missing = this.missingConfigs[serviceKey];
    const recommendations = [];
    
    if (missing.missingKeys.length > 0) {
      recommendations.push({
        type: 'environment-variables',
        description: `Configure missing environment variables: ${missing.missingKeys.join(', ')}`,
        steps: this.generateConfigurationSteps(serviceKey)
      });
    }
    
    if (missing.missingOAuth) {
      recommendations.push({
        type: 'oauth-setup',
        description: 'Set up OAuth authentication',
        steps: this.generateOAuthSetupSteps(serviceKey)
      });
    }
    
    if (missing.missingFiles.length > 0) {
      recommendations.push({
        type: 'config-files',
        description: `Create missing configuration files: ${missing.missingFiles.join(', ')}`,
        steps: this.generateConfigFileSteps(serviceKey, missing.missingFiles)
      });
    }
    
    return recommendations;
  }

  generateEnvironmentVariableSteps(serviceKey, missingKeys) {
    return this.generateConfigurationSteps(serviceKey);
  }

  generateOAuthSetupSteps(serviceKey) {
    const service = this.config.services[serviceKey];
    const steps = [];
    
    switch (serviceKey) {
      case 'github':
        steps.push(
          '1. Go to GitHub Settings > Developer settings > OAuth Apps',
          '2. Create a new OAuth App',
          '3. Set required scopes: repo, workflow, admin:org',
          '4. Configure callback URL',
          '5. Save client ID and client secret'
        );
        break;
      case 'vercel':
        steps.push(
          '1. Go to Vercel dashboard > Settings > Integrations',
          '2. Connect GitHub account',
          '3. Authorize required permissions',
          '4. Configure webhook settings'
        );
        break;
      default:
        steps.push(`Set up OAuth for ${service.name} according to their documentation`);
    }
    
    return steps;
  }

  generateConfigFileSteps(serviceKey, missingFiles) {
    const steps = [];
    
    for (const file of missingFiles) {
      steps.push(`Create ${file} configuration file`);
    }
    
    return steps;
  }

  generateConfigurationSteps(serviceKey) {
    const service = this.config.services[serviceKey];
    const steps = [];
    
    switch (serviceKey) {
      case 'github':
        steps.push(
          '1. Go to GitHub Settings > Developer settings > Personal access tokens',
          '2. Generate a new token with required scopes: repo, workflow, admin:org',
          '3. Add the token to your environment variables as GITHUB_TOKEN',
          '4. Set GITHUB_USERNAME to your GitHub username'
        );
        break;
      case 'vercel':
        steps.push(
          '1. Go to Vercel dashboard > Settings > Tokens',
          '2. Create a new token with appropriate permissions',
          '3. Add the token to your environment variables as VERCEL_TOKEN',
          '4. Get your organization ID and project ID from Vercel dashboard',
          '5. Set VERCEL_ORG_ID and VERCEL_PROJECT_ID environment variables'
        );
        break;
      case 'supabase':
        steps.push(
          '1. Go to your Supabase project dashboard',
          '2. Navigate to Settings > API',
          '3. Copy the project URL and anon key',
          '4. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables',
          '5. For service role key, go to Settings > API > Project API keys'
        );
        break;
      case 'stripe':
        steps.push(
          '1. Go to Stripe dashboard > Developers > API keys',
          '2. Copy your publishable key and secret key',
          '3. Set STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY environment variables',
          '4. For webhook secret, go to Developers > Webhooks and create a new endpoint'
        );
        break;
    }
    
    return steps;
  }

  generateDeploymentPipelineSteps(services) {
    return [
      '1. Create GitHub Actions workflow for automated deployment',
      '2. Configure environment variables in GitHub repository secrets',
      '3. Set up branch protection rules',
      '4. Configure automatic testing and validation',
      '5. Set up deployment notifications'
    ];
  }

  generateMonitoringSteps() {
    return [
      '1. Set up application performance monitoring (APM)',
      '2. Configure error tracking and alerting',
      '3. Set up uptime monitoring',
      '4. Create automated health checks',
      '5. Implement performance optimization workflows'
    ];
  }

  canImplementWorkflow(workflowKey) {
    const configuredServices = Object.keys(this.detectedConfigs).filter(
      key => this.detectedConfigs[key].status === 'configured'
    );
    
    switch (workflowKey) {
      case 'deployment':
        return configuredServices.includes('github') && configuredServices.includes('vercel');
      case 'monitoring':
        return configuredServices.length >= 2;
      case 'optimization':
        return configuredServices.includes('vercel') && configuredServices.includes('supabase');
      default:
        return false;
    }
  }

  generateWorkflowImplementation(workflowKey) {
    const workflow = this.config.automationWorkflows[workflowKey];
    
    return {
      type: 'github-actions',
      file: `.github/workflows/${workflowKey}.yml`,
      triggers: workflow.triggers,
      steps: workflow.steps.map(step => this.generateWorkflowStep(step))
    };
  }

  generateWorkflowStep(step) {
    const stepImplementations = {
      'validate-config': {
        name: 'Validate Configuration',
        run: 'npm run validate-config'
      },
      'test-connections': {
        name: 'Test Service Connections',
        run: 'npm run test-connections'
      },
      'deploy': {
        name: 'Deploy Application',
        run: 'npm run deploy'
      },
      'verify': {
        name: 'Verify Deployment',
        run: 'npm run verify-deployment'
      },
      'monitor': {
        name: 'Monitor Health',
        run: 'npm run monitor-health'
      },
      'check-status': {
        name: 'Check Service Status',
        run: 'npm run check-status'
      },
      'analyze-logs': {
        name: 'Analyze Logs',
        run: 'npm run analyze-logs'
      },
      'alert-if-needed': {
        name: 'Send Alerts',
        run: 'npm run send-alerts'
      },
      'analyze-metrics': {
        name: 'Analyze Performance Metrics',
        run: 'npm run analyze-metrics'
      },
      'optimize-config': {
        name: 'Optimize Configuration',
        run: 'npm run optimize-config'
      }
    };
    
    return stepImplementations[step] || { name: step, run: `echo "Step: ${step}"` };
  }

  async createWorkflowFiles(workflowKey, workflow) {
    const workflowDir = '.github/workflows';
    if (!fs.existsSync(workflowDir)) {
      fs.mkdirSync(workflowDir, { recursive: true });
    }
    
    const workflowContent = this.generateWorkflowYAML(workflowKey, workflow);
    fs.writeFileSync(`${workflowDir}/${workflowKey}.yml`, workflowContent);
  }

  generateWorkflowYAML(workflowKey, workflow) {
    return `name: ${workflow.name}

on:
${workflow.triggers.map(trigger => this.generateTrigger(trigger)).join('\n')}

jobs:
  ${workflowKey}:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
${workflow.steps.map(step => this.generateWorkflowStepYAML(step)).join('\n')}
`;
  }

  generateTrigger(trigger) {
    switch (trigger) {
      case 'push':
        return '  push:\n    branches: [ main ]';
      case 'pull-request':
        return '  pull_request:\n    branches: [ main ]';
      case 'manual':
        return '  workflow_dispatch:';
      case 'scheduled':
        return '  schedule:\n    - cron: "0 */6 * * *"  # Every 6 hours';
      case 'webhook':
        return '  repository_dispatch:\n    types: [webhook]';
      default:
        return `  ${trigger}:`;
    }
  }

  generateWorkflowStepYAML(step) {
    const stepImpl = this.generateWorkflowStep(step);
    return `      - name: ${stepImpl.name}
        run: ${stepImpl.run}`;
  }

  async testServiceAutomation(serviceKey) {
    try {
      const service = this.config.services[serviceKey];
      
      // Test API connectivity
      const testResult = await this.testServiceConnectivity(serviceKey);
      
      return {
        service: service.name,
        success: testResult.success,
        error: testResult.error,
        responseTime: testResult.responseTime
      };
    } catch (error) {
      return {
        service: this.config.services[serviceKey].name,
        success: false,
        error: error.message,
        responseTime: null
      };
    }
  }

  async testServiceConnectivity(serviceKey) {
    const startTime = Date.now();
    
    try {
      switch (serviceKey) {
        case 'github':
          return await this.testGitHubConnectivity();
        case 'vercel':
          return await this.testVercelConnectivity();
        case 'supabase':
          return await this.testSupabaseConnectivity();
        case 'stripe':
          return await this.testStripeConnectivity();
        default:
          return { success: false, error: 'Unknown service' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      const responseTime = Date.now() - startTime;
      return { ...this.testResult, responseTime };
    }
  }

  async testGitHubConnectivity() {
    if (!process.env.GITHUB_TOKEN) {
      return { success: false, error: 'GitHub token not configured' };
    }
    
    // Test GitHub API
    const response = await this.makeAPIRequest('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'User-Agent': 'WorkflowAutomationAPI'
      }
    });
    
    return { success: response.statusCode === 200, error: null };
  }

  async testVercelConnectivity() {
    if (!process.env.VERCEL_TOKEN) {
      return { success: false, error: 'Vercel token not configured' };
    }
    
    // Test Vercel API
    const response = await this.makeAPIRequest('https://api.vercel.com/v1/user', {
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`
      }
    });
    
    return { success: response.statusCode === 200, error: null };
  }

  async testSupabaseConnectivity() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return { success: false, error: 'Supabase configuration missing' };
    }
    
    // Test Supabase connection
    const response = await this.makeAPIRequest(`${process.env.SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      }
    });
    
    return { success: response.statusCode === 200, error: null };
  }

  async testStripeConnectivity() {
    if (!process.env.STRIPE_SECRET_KEY) {
      return { success: false, error: 'Stripe secret key not configured' };
    }
    
    // Test Stripe API
    const response = await this.makeAPIRequest('https://api.stripe.com/v1/account', {
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
      }
    });
    
    return { success: response.statusCode === 200, error: null };
  }

  async testWorkflowAutomation() {
    try {
      // Test if GitHub Actions workflow files exist
      const workflowDir = '.github/workflows';
      if (!fs.existsSync(workflowDir)) {
        return { success: false, error: 'Workflow directory not found' };
      }
      
      const workflowFiles = fs.readdirSync(workflowDir);
      if (workflowFiles.length === 0) {
        return { success: false, error: 'No workflow files found' };
      }
      
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  makeAPIRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const req = https.request(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, data }));
      });
      
      req.on('error', reject);
      req.end();
    });
  }

  displayRecommendations(recommendations) {
    console.log('\n📋 AUTOMATION RECOMMENDATIONS');
    console.log('=============================');
    
    if (recommendations.immediate.length > 0) {
      console.log('\n🚨 IMMEDIATE ACTIONS REQUIRED:');
      recommendations.immediate.forEach(rec => {
        console.log(`\n• ${rec.service}: ${rec.action}`);
        rec.steps.forEach(step => console.log(`  ${step}`));
      });
    }
    
    if (recommendations.shortTerm.length > 0) {
      console.log('\n📅 SHORT-TERM OPPORTUNITIES:');
      recommendations.shortTerm.forEach(rec => {
        console.log(`\n• ${rec.action}`);
        rec.steps.forEach(step => console.log(`  ${step}`));
      });
    }
    
    if (recommendations.automationWorkflows.length > 0) {
      console.log('\n🤖 AUTOMATION WORKFLOWS:');
      recommendations.automationWorkflows.forEach(workflow => {
        console.log(`\n• ${workflow.name}`);
        console.log(`  Steps: ${workflow.steps.join(' → ')}`);
        console.log(`  Triggers: ${workflow.triggers.join(', ')}`);
      });
    }
  }

  async generateAutomationStatusReport(testResults) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalServices: Object.keys(this.config.services).length,
        configuredServices: Object.keys(this.detectedConfigs).filter(
          key => this.detectedConfigs[key].status === 'configured'
        ).length,
        automationWorkflows: this.config.automationWorkflows.length,
        implementedWorkflows: testResults.tests.filter(t => t.success).length
      },
      serviceStatus: this.detectedConfigs,
      missingConfigurations: this.missingConfigs,
      testResults: testResults,
      nextSteps: this.generateNextSteps()
    };
    
    fs.writeFileSync(
      'docs/autonomous-learning/automation-status-report.json',
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n📊 AUTOMATION STATUS REPORT');
    console.log('===========================');
    console.log(`Total Services: ${report.summary.totalServices}`);
    console.log(`Configured Services: ${report.summary.configuredServices}`);
    console.log(`Automation Workflows: ${report.summary.automationWorkflows}`);
    console.log(`Implemented Workflows: ${report.summary.implementedWorkflows}`);
    
    console.log('\n📄 Detailed report saved to: docs/autonomous-learning/automation-status-report.json');
  }

  generateNextSteps() {
    const steps = [];
    
    // Check what needs immediate attention
    const missingConfigs = Object.values(this.missingConfigs).filter(
      config => config.missingKeys.length > 0 || config.missingOAuth
    );
    
    if (missingConfigs.length > 0) {
      steps.push('Configure missing service credentials and OAuth tokens');
    }
    
    // Check automation opportunities
    const configuredServices = Object.keys(this.detectedConfigs).filter(
      key => this.detectedConfigs[key].status === 'configured'
    );
    
    if (configuredServices.length >= 2) {
      steps.push('Implement automated deployment pipeline');
      steps.push('Set up monitoring and alerting systems');
    }
    
    if (configuredServices.includes('vercel')) {
      steps.push('Configure Vercel deployment automation');
    }
    
    if (configuredServices.includes('github')) {
      steps.push('Set up GitHub Actions for CI/CD');
    }
    
    return steps;
  }
}

// Run the automation discovery
if (require.main === module) {
  const automationAPI = new WorkflowAutomationAPI();
  automationAPI.startAutomationDiscovery().catch(console.error);
}

module.exports = WorkflowAutomationAPI; 