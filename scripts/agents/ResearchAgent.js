const axios = require('axios');
const fs = require('fs');
const path = require('path');

class ResearchAgent {
  constructor() {
    this.name = 'ResearchAgent';
    this.researchHistory = [];
    this.solutions = [];
    this.errorPatterns = [];
    this.adaptationStrategies = [];
  }

  async researchError(errorMessage) {
    console.log(`🔬 ResearchAgent: Researching error: ${errorMessage}`);
    
    const searchTerms = this.extractSearchTerms(errorMessage);
    const solutions = [];

    for (const term of searchTerms) {
      try {
        const solution = await this.searchWebSolution(term);
        if (solution) {
          solutions.push(solution);
        }
      } catch (error) {
        console.log(`❌ Research failed for term: ${term}`);
      }
    }

    const researchResult = {
      error: errorMessage,
      searchTerms,
      solutions,
      timestamp: new Date().toISOString()
    };

    this.researchHistory.push(researchResult);
    this.saveResearchHistory();

    return researchResult;
  }

  extractSearchTerms(errorMessage) {
    // Extract key terms from error messages
    const terms = [];
    
    // Common error patterns
    if (errorMessage.includes('build failed')) {
      terms.push('next.js build failed');
      terms.push('vercel deployment build error');
    }
    
    if (errorMessage.includes('module not found')) {
      terms.push('node.js module not found error');
      terms.push('npm dependency missing');
    }
    
    if (errorMessage.includes('deployment failed')) {
      terms.push('vercel deployment failed');
      terms.push('next.js deployment error');
    }
    
    if (errorMessage.includes('static export')) {
      terms.push('next.js static export dynamic routes');
      terms.push('vercel static export configuration');
    }

    // Add the original error as a search term
    terms.push(errorMessage.substring(0, 100));

    return terms.slice(0, 5); // Limit to 5 search terms
  }

  async searchWebSolution(searchTerm) {
    // Simulate web research - in a real implementation, this would use
    // actual web search APIs or documentation scraping
    const mockSolutions = {
      'next.js build failed': {
        title: 'Next.js Build Failures - Common Solutions',
        solution: 'Check for missing dependencies, TypeScript errors, or configuration issues',
        source: 'Next.js Documentation',
        confidence: 0.8
      },
      'vercel deployment failed': {
        title: 'Vercel Deployment Troubleshooting',
        solution: 'Verify build command, check environment variables, ensure proper framework detection',
        source: 'Vercel Documentation',
        confidence: 0.9
      },
      'static export dynamic routes': {
        title: 'Next.js Static Export with Dynamic Routes',
        solution: 'Use generateStaticParams for dynamic routes or remove static export for server-side rendering',
        source: 'Next.js Static Export Guide',
        confidence: 0.95
      }
    };

    // Find the best matching solution
    for (const [pattern, solution] of Object.entries(mockSolutions)) {
      if (searchTerm.toLowerCase().includes(pattern.toLowerCase())) {
        return solution;
      }
    }

    return null;
  }

  async adaptStrategy(errorPattern) {
    console.log(`🔄 ResearchAgent: Adapting strategy for error pattern`);
    
    const adaptation = {
      pattern: errorPattern,
      strategy: this.generateAdaptationStrategy(errorPattern),
      timestamp: new Date().toISOString()
    };

    this.adaptationStrategies.push(adaptation);
    this.saveAdaptationStrategies();

    return adaptation;
  }

  generateAdaptationStrategy(errorPattern) {
    const strategies = {
      'build': {
        action: 'pre_validation',
        steps: [
          'Run npm install before build',
          'Check for TypeScript errors',
          'Validate configuration files',
          'Test build locally before deployment'
        ]
      },
      'deployment': {
        action: 'post_validation',
        steps: [
          'Test deployment URL after push',
          'Check Vercel dashboard for errors',
          'Validate environment variables',
          'Monitor deployment logs'
        ]
      },
      'dependency': {
        action: 'dependency_check',
        steps: [
          'Verify package.json dependencies',
          'Check for version conflicts',
          'Run npm audit',
          'Update outdated packages'
        ]
      }
    };

    // Determine strategy based on error pattern
    if (errorPattern.includes('build')) return strategies.build;
    if (errorPattern.includes('deployment')) return strategies.deployment;
    if (errorPattern.includes('module') || errorPattern.includes('dependency')) return strategies.dependency;

    return {
      action: 'general_validation',
      steps: [
        'Run comprehensive validation',
        'Check all system components',
        'Test in isolated environment',
        'Document error for future reference'
      ]
    };
  }

  async learnFromError(error, context) {
    console.log(`🧠 ResearchAgent: Learning from error`);
    
    const learning = {
      error: error.message,
      context,
      timestamp: new Date().toISOString(),
      pattern: this.identifyErrorPattern(error.message),
      prevention: this.generatePreventionStrategy(error.message, context)
    };

    this.errorPatterns.push(learning);
    this.saveErrorPatterns();

    return learning;
  }

  identifyErrorPattern(errorMessage) {
    const patterns = {
      'build': /build|compile|webpack/i,
      'deployment': /deploy|vercel|github/i,
      'dependency': /module|dependency|package/i,
      'configuration': /config|setting|option/i,
      'permission': /permission|access|denied/i
    };

    for (const [pattern, regex] of Object.entries(patterns)) {
      if (regex.test(errorMessage)) {
        return pattern;
      }
    }

    return 'unknown';
  }

  generatePreventionStrategy(errorMessage, context) {
    const strategies = {
      'build': 'Always run local build test before committing',
      'deployment': 'Validate deployment configuration and test deployment URL',
      'dependency': 'Check dependencies before making changes',
      'configuration': 'Validate configuration files against documentation',
      'permission': 'Verify file permissions and access rights'
    };

    const pattern = this.identifyErrorPattern(errorMessage);
    return strategies[pattern] || 'Implement comprehensive testing before changes';
  }

  async generateImprovementPlan() {
    console.log(`📋 ResearchAgent: Generating improvement plan`);
    
    const recentErrors = this.errorPatterns.slice(-10); // Last 10 errors
    const errorFrequency = {};
    
    recentErrors.forEach(error => {
      const pattern = error.pattern;
      errorFrequency[pattern] = (errorFrequency[pattern] || 0) + 1;
    });

    const improvements = Object.entries(errorFrequency)
      .sort(([,a], [,b]) => b - a)
      .map(([pattern, count]) => ({
        pattern,
        frequency: count,
        priority: count > 2 ? 'HIGH' : count > 1 ? 'MEDIUM' : 'LOW',
        action: this.getImprovementAction(pattern)
      }));

    return {
      timestamp: new Date().toISOString(),
      improvements,
      totalErrors: recentErrors.length,
      recommendations: this.generateRecommendations(improvements)
    };
  }

  getImprovementAction(pattern) {
    const actions = {
      'build': 'Implement automated build validation in CI/CD',
      'deployment': 'Add deployment health checks and rollback procedures',
      'dependency': 'Set up dependency scanning and automated updates',
      'configuration': 'Create configuration validation scripts',
      'permission': 'Implement permission checking in deployment pipeline'
    };

    return actions[pattern] || 'Add comprehensive error handling and validation';
  }

  generateRecommendations(improvements) {
    const recommendations = [];
    
    if (improvements.some(imp => imp.priority === 'HIGH')) {
      recommendations.push('Implement immediate fixes for high-priority issues');
    }
    
    if (improvements.length > 5) {
      recommendations.push('Consider implementing automated testing pipeline');
    }
    
    recommendations.push('Document common error patterns and solutions');
    recommendations.push('Set up monitoring for deployment health');

    return recommendations;
  }

  saveResearchHistory() {
    const logPath = path.join(process.cwd(), 'logs', 'research-history.json');
    fs.writeFileSync(logPath, JSON.stringify(this.researchHistory, null, 2));
  }

  saveErrorPatterns() {
    const logPath = path.join(process.cwd(), 'logs', 'error-patterns.json');
    fs.writeFileSync(logPath, JSON.stringify(this.errorPatterns, null, 2));
  }

  saveAdaptationStrategies() {
    const logPath = path.join(process.cwd(), 'logs', 'adaptation-strategies.json');
    fs.writeFileSync(logPath, JSON.stringify(this.adaptationStrategies, null, 2));
  }

  getResearchReport() {
    return {
      totalResearches: this.researchHistory.length,
      totalErrors: this.errorPatterns.length,
      totalAdaptations: this.adaptationStrategies.length,
      recentActivity: this.researchHistory.slice(-5),
      topErrorPatterns: this.getTopErrorPatterns()
    };
  }

  getTopErrorPatterns() {
    const patternCount = {};
    this.errorPatterns.forEach(error => {
      patternCount[error.pattern] = (patternCount[error.pattern] || 0) + 1;
    });

    return Object.entries(patternCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([pattern, count]) => ({ pattern, count }));
  }
}

module.exports = { ResearchAgent }; 