const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

class ValidationAgent {
  constructor() {
    this.name = 'ValidationAgent';
    this.validationResults = [];
    this.failedTests = [];
    this.deploymentChecks = [];
  }

  async validateCodeChanges() {
    console.log('🔍 ValidationAgent: Testing code changes...');
    
    const tests = [
      { name: 'Build Test', test: () => this.testBuild() },
      { name: 'Lint Test', test: () => this.testLint() },
      { name: 'Type Check', test: () => this.testTypeCheck() },
      { name: 'File Structure', test: () => this.validateFileStructure() },
      { name: 'Dependencies', test: () => this.validateDependencies() }
    ];

    for (const test of tests) {
      try {
        const result = await test.test();
        this.validationResults.push({
          test: test.name,
          status: 'PASS',
          timestamp: new Date().toISOString(),
          details: result
        });
        console.log(`✅ ${test.name}: PASSED`);
      } catch (error) {
        this.failedTests.push({
          test: test.name,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        console.log(`❌ ${test.name}: FAILED - ${error.message}`);
      }
    }

    return {
      passed: this.validationResults.length,
      failed: this.failedTests.length,
      total: tests.length
    };
  }

  async testBuild() {
    try {
      const result = execSync('npm run build', { 
        encoding: 'utf8', 
        cwd: process.cwd(),
        timeout: 60000 
      });
      return { output: result, buildTime: Date.now() };
    } catch (error) {
      throw new Error(`Build failed: ${error.message}`);
    }
  }

  async testLint() {
    try {
      const result = execSync('npm run lint', { 
        encoding: 'utf8', 
        cwd: process.cwd(),
        timeout: 30000 
      });
      return { output: result };
    } catch (error) {
      throw new Error(`Lint failed: ${error.message}`);
    }
  }

  async testTypeCheck() {
    try {
      const result = execSync('npx tsc --noEmit', { 
        encoding: 'utf8', 
        cwd: process.cwd(),
        timeout: 30000 
      });
      return { output: result };
    } catch (error) {
      throw new Error(`Type check failed: ${error.message}`);
    }
  }

  validateFileStructure() {
    const requiredFiles = [
      'package.json',
      'next.config.js',
      'src/app/layout.tsx',
      'src/app/page.tsx',
      '.vercel/project.json'
    ];

    const missingFiles = [];
    for (const file of requiredFiles) {
      if (!fs.existsSync(path.join(process.cwd(), file))) {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length > 0) {
      throw new Error(`Missing required files: ${missingFiles.join(', ')}`);
    }

    return { filesChecked: requiredFiles.length, missingFiles: [] };
  }

  validateDependencies() {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = ['next', 'react', 'react-dom'];
    const missingDeps = [];

    for (const dep of requiredDeps) {
      if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
        missingDeps.push(dep);
      }
    }

    if (missingDeps.length > 0) {
      throw new Error(`Missing dependencies: ${missingDeps.join(', ')}`);
    }

    return { depsChecked: requiredDeps.length, missingDeps: [] };
  }

  async validateDeployment(deploymentUrl) {
    console.log(`🌐 ValidationAgent: Testing deployment at ${deploymentUrl}`);
    
    try {
      const response = await axios.get(deploymentUrl, {
        timeout: 10000,
        validateStatus: (status) => status < 500 // Accept 4xx but not 5xx
      });

      const isHealthy = response.status === 200;
      const loadTime = response.headers['x-response-time'] || 'unknown';
      
      this.deploymentChecks.push({
        url: deploymentUrl,
        status: response.status,
        healthy: isHealthy,
        loadTime,
        timestamp: new Date().toISOString()
      });

      return {
        healthy: isHealthy,
        status: response.status,
        loadTime,
        contentLength: response.headers['content-length']
      };
    } catch (error) {
      this.deploymentChecks.push({
        url: deploymentUrl,
        status: 'ERROR',
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      throw new Error(`Deployment check failed: ${error.message}`);
    }
  }

  async validateGitStatus() {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      const lastCommit = execSync('git log -1 --oneline', { encoding: 'utf8' }).trim();

      return {
        hasChanges: status.trim().length > 0,
        branch,
        lastCommit,
        changeCount: status.split('\n').filter(line => line.trim()).length
      };
    } catch (error) {
      throw new Error(`Git status check failed: ${error.message}`);
    }
  }

  async runFullValidation(deploymentUrl = null) {
    console.log('🚀 ValidationAgent: Starting comprehensive validation...');
    
    const results = {
      codeValidation: await this.validateCodeChanges(),
      gitStatus: await this.validateGitStatus(),
      deploymentValidation: null
    };

    if (deploymentUrl) {
      try {
        results.deploymentValidation = await this.validateDeployment(deploymentUrl);
      } catch (error) {
        results.deploymentValidation = { error: error.message };
      }
    }

    // Save validation results
    this.saveValidationResults(results);

    // Determine overall success
    const hasFailures = this.failedTests.length > 0;
    const deploymentFailed = results.deploymentValidation?.error;

    if (hasFailures || deploymentFailed) {
      throw new Error(`Validation failed: ${this.failedTests.length} code tests failed, deployment: ${deploymentFailed ? 'FAILED' : 'OK'}`);
    }

    return results;
  }

  saveValidationResults(results) {
    const validationLog = {
      timestamp: new Date().toISOString(),
      results,
      failedTests: this.failedTests,
      deploymentChecks: this.deploymentChecks
    };

    const logPath = path.join(process.cwd(), 'logs', 'validation-results.json');
    const existingLogs = fs.existsSync(logPath) 
      ? JSON.parse(fs.readFileSync(logPath, 'utf8')) 
      : [];
    
    existingLogs.push(validationLog);
    fs.writeFileSync(logPath, JSON.stringify(existingLogs, null, 2));
  }

  getValidationReport() {
    return {
      totalTests: this.validationResults.length + this.failedTests.length,
      passedTests: this.validationResults.length,
      failedTests: this.failedTests.length,
      deploymentChecks: this.deploymentChecks,
      successRate: this.validationResults.length / (this.validationResults.length + this.failedTests.length) * 100
    };
  }
}

module.exports = { ValidationAgent }; 