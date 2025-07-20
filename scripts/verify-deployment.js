#!/usr/bin/env node

const https = require('https');
const { execSync } = require('child_process');

class DeploymentVerifier {
  constructor() {
    this.baseUrl = 'https://wellness-agent-saas.vercel.app';
    this.endpoints = [
      '/',
      '/generate',
      '/dashboard',
      '/api/wellness/generate',
      '/test',
      '/simple'
    ];
    this.results = [];
  }

  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      const req = https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data.substring(0, 200) + '...',
            url: url
          });
        });
      });
      
      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
    });
  }

  async testEndpoint(endpoint) {
    try {
      const result = await this.makeRequest(this.baseUrl + endpoint);
      this.results.push({
        endpoint,
        ...result,
        success: result.status === 200,
        cached: result.headers['x-vercel-cache'] === 'HIT'
      });
      
      console.log(`✅ ${endpoint}: ${result.status} ${result.cached ? '(cached)' : '(fresh)'}`);
      return result;
    } catch (error) {
      console.log(`❌ ${endpoint}: Error - ${error.message}`);
      this.results.push({
        endpoint,
        error: error.message,
        success: false
      });
      return null;
    }
  }

  async runVerification() {
    console.log('🔍 Autonomous Deployment Verification');
    console.log('=====================================');
    
    // Test all endpoints
    for (const endpoint of this.endpoints) {
      await this.testEndpoint(endpoint);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
    }

    // Analyze results
    this.analyzeResults();
  }

  analyzeResults() {
    console.log('\n📊 Analysis Results:');
    console.log('====================');
    
    const successful = this.results.filter(r => r.success);
    const failed = this.results.filter(r => !r.success);
    const cached = this.results.filter(r => r.cached);
    const fresh = this.results.filter(r => !r.cached && r.success);

    console.log(`✅ Successful: ${successful.length}/${this.results.length}`);
    console.log(`❌ Failed: ${failed.length}/${this.results.length}`);
    console.log(`🔄 Cached responses: ${cached.length}`);
    console.log(`🆕 Fresh responses: ${fresh.length}`);

    // Recursive learning: Identify patterns
    if (failed.length > 0) {
      console.log('\n🔍 Error Analysis:');
      failed.forEach(f => {
        console.log(`  - ${f.endpoint}: ${f.error || f.status}`);
      });
    }

    if (cached.length === this.results.length) {
      console.log('\n⚠️  WARNING: All responses are cached. Deployment may not have updated.');
      console.log('💡 Recommendation: Force redeploy or wait for cache to expire.');
    }

    // Autonomous decision making
    if (successful.length === this.endpoints.length) {
      console.log('\n🎉 SUCCESS: All endpoints working correctly!');
    } else if (successful.length > 0) {
      console.log('\n⚠️  PARTIAL SUCCESS: Some endpoints working, others need attention.');
    } else {
      console.log('\n🚨 CRITICAL: No endpoints working. Deployment failed.');
    }
  }
}

// Run verification
const verifier = new DeploymentVerifier();
verifier.runVerification().catch(console.error); 