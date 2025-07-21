#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class RLVisualizationTools {
  constructor() {
    this.dataDir = './docs/autonomous-learning';
    this.qTablePath = path.join(this.dataDir, 'q-table.json');
    this.analysisPath = path.join(this.dataDir, 'rl-analysis.json');
    this.trialsPath = path.join(this.dataDir, 'trials');
  }

  async generateVisualizations() {
    console.log('📊 GENERATING RL AGENT VISUALIZATIONS');
    console.log('=====================================');
    
    // Load data
    const qTable = this.loadQTable();
    const analysis = this.loadAnalysis();
    const trialData = this.loadTrialData();
    
    // Generate different types of visualizations
    await this.generateSuccessRateChart(analysis);
    await this.generateActionEffectivenessChart(analysis);
    await this.generateRewardDistributionChart(analysis);
    await this.generateLearningCurveChart(analysis);
    await this.generateQTableHeatmap(qTable);
    await this.generateStateTransitionDiagram(analysis);
    await this.generatePerformanceMetrics(analysis);
    await this.generateDebugReport(analysis, qTable);
    
    console.log('✅ All visualizations generated successfully');
  }

  loadQTable() {
    if (fs.existsSync(this.qTablePath)) {
      try {
        return JSON.parse(fs.readFileSync(this.qTablePath, 'utf8'));
      } catch (error) {
        console.log('⚠️  Could not load Q-table');
        return {};
      }
    }
    return {};
  }

  loadAnalysis() {
    if (fs.existsSync(this.analysisPath)) {
      try {
        return JSON.parse(fs.readFileSync(this.analysisPath, 'utf8'));
      } catch (error) {
        console.log('⚠️  Could not load analysis data');
        return {};
      }
    }
    return {};
  }

  loadTrialData() {
    const trials = [];
    if (fs.existsSync(this.trialsPath)) {
      const files = fs.readdirSync(this.trialsPath);
      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const data = JSON.parse(fs.readFileSync(path.join(this.trialsPath, file), 'utf8'));
            trials.push(data);
          } catch (error) {
            console.log(`⚠️  Could not load trial file: ${file}`);
          }
        }
      }
    }
    return trials;
  }

  async generateSuccessRateChart(analysis) {
    console.log('📈 Generating Success Rate Chart...');
    
    if (!analysis.trialResults || analysis.trialResults.length === 0) {
      console.log('⚠️  No trial data available for success rate chart');
      return;
    }

    const results = analysis.trialResults;
    const windowSize = 5; // Rolling average window
    const rollingSuccessRates = [];
    
    for (let i = windowSize - 1; i < results.length; i++) {
      const window = results.slice(i - windowSize + 1, i + 1);
      const successCount = window.filter(r => r.success).length;
      const successRate = (successCount / windowSize) * 100;
      rollingSuccessRates.push({
        trial: i + 1,
        successRate: successRate.toFixed(1)
      });
    }

    const chartData = {
      type: 'success_rate_chart',
      title: 'RL Agent Success Rate Over Time',
      description: 'Rolling 5-trial success rate showing learning progress',
      data: rollingSuccessRates,
      metadata: {
        totalTrials: results.length,
        overallSuccessRate: analysis.summary?.successRate || 0,
        windowSize: windowSize
      }
    };

    this.saveChartData('success-rate-chart.json', chartData);
    this.generateChartHTML('success-rate-chart', chartData);
  }

  async generateActionEffectivenessChart(analysis) {
    console.log('🎯 Generating Action Effectiveness Chart...');
    
    if (!analysis.actionStats) {
      console.log('⚠️  No action stats available');
      return;
    }

    const actionData = Object.entries(analysis.actionStats).map(([action, stats]) => ({
      action: action,
      successRate: ((stats.success / stats.total) * 100).toFixed(1),
      avgReward: (stats.totalReward / stats.total).toFixed(2),
      totalAttempts: stats.total,
      totalReward: stats.totalReward
    }));

    // Sort by success rate
    actionData.sort((a, b) => parseFloat(b.successRate) - parseFloat(a.successRate));

    const chartData = {
      type: 'action_effectiveness_chart',
      title: 'Action Effectiveness Analysis',
      description: 'Success rates and average rewards for each action',
      data: actionData,
      metadata: {
        totalActions: actionData.length,
        bestAction: actionData[0]?.action || 'none',
        worstAction: actionData[actionData.length - 1]?.action || 'none'
      }
    };

    this.saveChartData('action-effectiveness-chart.json', chartData);
    this.generateChartHTML('action-effectiveness-chart', chartData);
  }

  async generateRewardDistributionChart(analysis) {
    console.log('💰 Generating Reward Distribution Chart...');
    
    if (!analysis.trialResults || analysis.trialResults.length === 0) {
      console.log('⚠️  No trial data available for reward distribution');
      return;
    }

    const rewards = analysis.trialResults.map(r => r.reward);
    const rewardRanges = {
      'Very High (8-15)': 0,
      'High (4-7)': 0,
      'Medium (0-3)': 0,
      'Low (-5-(-1))': 0,
      'Very Low (-15-(-6))': 0
    };

    for (const reward of rewards) {
      if (reward >= 8) rewardRanges['Very High (8-15)']++;
      else if (reward >= 4) rewardRanges['High (4-7)']++;
      else if (reward >= 0) rewardRanges['Medium (0-3)']++;
      else if (reward >= -5) rewardRanges['Low (-5-(-1))']++;
      else rewardRanges['Very Low (-15-(-6))']++;
    }

    const chartData = {
      type: 'reward_distribution_chart',
      title: 'Reward Distribution Analysis',
      description: 'Distribution of rewards across all trials',
      data: Object.entries(rewardRanges).map(([range, count]) => ({
        range: range,
        count: count,
        percentage: ((count / rewards.length) * 100).toFixed(1)
      })),
      metadata: {
        totalTrials: rewards.length,
        averageReward: (rewards.reduce((a, b) => a + b, 0) / rewards.length).toFixed(2),
        maxReward: Math.max(...rewards),
        minReward: Math.min(...rewards)
      }
    };

    this.saveChartData('reward-distribution-chart.json', chartData);
    this.generateChartHTML('reward-distribution-chart', chartData);
  }

  async generateLearningCurveChart(analysis) {
    console.log('📚 Generating Learning Curve Chart...');
    
    if (!analysis.trialResults || analysis.trialResults.length === 0) {
      console.log('⚠️  No trial data available for learning curve');
      return;
    }

    const results = analysis.trialResults;
    const learningData = results.map((result, index) => ({
      trial: index + 1,
      reward: result.reward,
      cumulativeReward: results.slice(0, index + 1).reduce((sum, r) => sum + r.reward, 0),
      epsilon: result.epsilon,
      consecutiveFailures: result.consecutiveFailures
    }));

    const chartData = {
      type: 'learning_curve_chart',
      title: 'RL Agent Learning Curve',
      description: 'Rewards, cumulative rewards, and exploration rate over time',
      data: learningData,
      metadata: {
        totalTrials: results.length,
        finalCumulativeReward: learningData[learningData.length - 1]?.cumulativeReward || 0,
        finalEpsilon: learningData[learningData.length - 1]?.epsilon || 0
      }
    };

    this.saveChartData('learning-curve-chart.json', chartData);
    this.generateChartHTML('learning-curve-chart', chartData);
  }

  async generateQTableHeatmap(qTable) {
    console.log('🔥 Generating Q-Table Heatmap...');
    
    if (Object.keys(qTable).length === 0) {
      console.log('⚠️  Q-table is empty');
      return;
    }

    // Extract unique states and actions
    const states = Object.keys(qTable);
    const allActions = new Set();
    
    for (const state of states) {
      if (qTable[state]) {
        Object.keys(qTable[state]).forEach(action => allActions.add(action));
      }
    }
    
    const actions = Array.from(allActions);
    
    // Create heatmap data
    const heatmapData = states.map(state => {
      const row = { state: state };
      for (const action of actions) {
        row[action] = qTable[state]?.[action] || 0;
      }
      return row;
    });

    const chartData = {
      type: 'qtable_heatmap',
      title: 'Q-Table Heatmap',
      description: 'Q-values for state-action pairs',
      data: heatmapData,
      metadata: {
        totalStates: states.length,
        totalActions: actions.length,
        maxQValue: Math.max(...Object.values(qTable).flatMap(s => Object.values(s || {}))),
        minQValue: Math.min(...Object.values(qTable).flatMap(s => Object.values(s || {})))
      }
    };

    this.saveChartData('qtable-heatmap.json', chartData);
    this.generateChartHTML('qtable-heatmap', chartData);
  }

  async generateStateTransitionDiagram(analysis) {
    console.log('🔄 Generating State Transition Diagram...');
    
    if (!analysis.trialResults || analysis.trialResults.length === 0) {
      console.log('⚠️  No trial data available for state transitions');
      return;
    }

    // Analyze state transitions
    const transitions = {};
    const results = analysis.trialResults;
    
    for (let i = 0; i < results.length - 1; i++) {
      const currentAction = results[i].action;
      const nextAction = results[i + 1].action;
      
      if (!transitions[currentAction]) {
        transitions[currentAction] = {};
      }
      
      if (!transitions[currentAction][nextAction]) {
        transitions[currentAction][nextAction] = 0;
      }
      
      transitions[currentAction][nextAction]++;
    }

    const chartData = {
      type: 'state_transition_diagram',
      title: 'Action Transition Patterns',
      description: 'How the agent transitions between different actions',
      data: transitions,
      metadata: {
        totalTransitions: results.length - 1,
        uniqueActions: new Set(results.map(r => r.action)).size
      }
    };

    this.saveChartData('state-transition-diagram.json', chartData);
    this.generateChartHTML('state-transition-diagram', chartData);
  }

  async generatePerformanceMetrics(analysis) {
    console.log('⚡ Generating Performance Metrics...');
    
    if (!analysis.trialResults || analysis.trialResults.length === 0) {
      console.log('⚠️  No trial data available for performance metrics');
      return;
    }

    const results = analysis.trialResults;
    const successfulTrials = results.filter(r => r.success);
    const failedTrials = results.filter(r => !r.success);
    
    const metrics = {
      overall: {
        totalTrials: results.length,
        successRate: ((successfulTrials.length / results.length) * 100).toFixed(2),
        averageReward: (results.reduce((sum, r) => sum + r.reward, 0) / results.length).toFixed(2),
        averageDuration: (results.reduce((sum, r) => sum + r.duration, 0) / results.length).toFixed(0)
      },
      successful: {
        count: successfulTrials.length,
        averageReward: successfulTrials.length > 0 ? 
          (successfulTrials.reduce((sum, r) => sum + r.reward, 0) / successfulTrials.length).toFixed(2) : '0',
        averageDuration: successfulTrials.length > 0 ? 
          (successfulTrials.reduce((sum, r) => sum + r.duration, 0) / successfulTrials.length).toFixed(0) : '0'
      },
      failed: {
        count: failedTrials.length,
        averageReward: failedTrials.length > 0 ? 
          (failedTrials.reduce((sum, r) => sum + r.reward, 0) / failedTrials.length).toFixed(2) : '0',
        averageDuration: failedTrials.length > 0 ? 
          (failedTrials.reduce((sum, r) => sum + r.duration, 0) / failedTrials.length).toFixed(0) : '0'
      },
      learning: {
        finalEpsilon: analysis.summary?.finalEpsilon || 0,
        improvementRate: this.calculateImprovementRate(results),
        convergencePoint: this.findConvergencePoint(results)
      }
    };

    const chartData = {
      type: 'performance_metrics',
      title: 'RL Agent Performance Metrics',
      description: 'Comprehensive performance analysis',
      data: metrics,
      metadata: {
        timestamp: new Date().toISOString(),
        analysisVersion: '1.0'
      }
    };

    this.saveChartData('performance-metrics.json', chartData);
    this.generateMetricsHTML('performance-metrics', chartData);
  }

  async generateDebugReport(analysis, qTable) {
    console.log('🐛 Generating Debug Report...');
    
    const debugReport = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTrials: analysis.trialResults?.length || 0,
        qTableSize: Object.keys(qTable).length,
        qTableEntries: Object.values(qTable).reduce((sum, state) => sum + Object.keys(state || {}).length, 0)
      },
      issues: this.identifyIssues(analysis, qTable),
      recommendations: this.generateRecommendations(analysis, qTable),
      insights: this.extractInsights(analysis, qTable),
      nextSteps: this.suggestNextSteps(analysis, qTable)
    };

    const reportPath = path.join(this.dataDir, 'debug-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(debugReport, null, 2));
    
    console.log('✅ Debug report saved to debug-report.json');
  }

  identifyIssues(analysis, qTable) {
    const issues = [];
    
    if (analysis.summary?.successRate < 50) {
      issues.push({
        type: 'low_success_rate',
        severity: 'high',
        description: 'Success rate is below 50%, indicating poor learning',
        suggestion: 'Review reward function and action space'
      });
    }
    
    if (Object.keys(qTable).length < 10) {
      issues.push({
        type: 'small_qtable',
        severity: 'medium',
        description: 'Q-table has very few states, may indicate limited exploration',
        suggestion: 'Increase exploration rate or add more diverse actions'
      });
    }
    
    if (analysis.trialResults) {
      const recentTrials = analysis.trialResults.slice(-10);
      const recentSuccessRate = recentTrials.filter(r => r.success).length / recentTrials.length;
      
      if (recentSuccessRate < 0.3) {
        issues.push({
          type: 'recent_poor_performance',
          severity: 'high',
          description: 'Recent trials show poor performance',
          suggestion: 'Agent may be stuck in local optimum, consider resetting'
        });
      }
    }
    
    return issues;
  }

  generateRecommendations(analysis, qTable) {
    const recommendations = [];
    
    if (analysis.summary?.successRate < 60) {
      recommendations.push({
        type: 'reward_function',
        priority: 'high',
        description: 'Optimize reward function to better guide learning',
        action: 'Review and adjust reward weights for different action types'
      });
    }
    
    if (analysis.summary?.finalEpsilon > 0.1) {
      recommendations.push({
        type: 'exploration_rate',
        priority: 'medium',
        description: 'Consider reducing exploration rate for better exploitation',
        action: 'Decrease epsilon decay rate or minimum epsilon'
      });
    }
    
    recommendations.push({
      type: 'action_space',
      priority: 'medium',
      description: 'Review action space for completeness',
      action: 'Ensure all necessary actions for the project are included'
    });
    
    return recommendations;
  }

  extractInsights(analysis, qTable) {
    const insights = [];
    
    if (analysis.actionStats) {
      const bestAction = Object.entries(analysis.actionStats)
        .sort((a, b) => (b[1].success / b[1].total) - (a[1].success / a[1].total))[0];
      
      if (bestAction) {
        insights.push({
          type: 'best_action',
          description: `Best performing action: ${bestAction[0]} (${((bestAction[1].success / bestAction[1].total) * 100).toFixed(1)}% success)`
        });
      }
    }
    
    if (analysis.trialResults) {
      const rewards = analysis.trialResults.map(r => r.reward);
      const avgReward = rewards.reduce((a, b) => a + b, 0) / rewards.length;
      
      insights.push({
        type: 'reward_trend',
        description: `Average reward: ${avgReward.toFixed(2)} (${avgReward > 0 ? 'positive' : 'negative'} learning)`
      });
    }
    
    return insights;
  }

  suggestNextSteps(analysis, qTable) {
    const steps = [];
    
    steps.push({
      step: 1,
      action: 'Review debug report and implement recommendations',
      priority: 'high'
    });
    
    if (analysis.summary?.successRate < 70) {
      steps.push({
        step: 2,
        action: 'Run additional trials with optimized parameters',
        priority: 'high'
      });
    }
    
    steps.push({
      step: 3,
      action: 'Implement successful strategies in production',
      priority: 'medium'
    });
    
    steps.push({
      step: 4,
      action: 'Set up continuous monitoring and retraining',
      priority: 'medium'
    });
    
    return steps;
  }

  calculateImprovementRate(results) {
    if (results.length < 10) return 'insufficient_data';
    
    const firstHalf = results.slice(0, Math.floor(results.length / 2));
    const secondHalf = results.slice(Math.floor(results.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, r) => sum + r.reward, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, r) => sum + r.reward, 0) / secondHalf.length;
    
    return ((secondAvg - firstAvg) / Math.abs(firstAvg) * 100).toFixed(1);
  }

  findConvergencePoint(results) {
    if (results.length < 10) return 'insufficient_data';
    
    const windowSize = 5;
    for (let i = windowSize; i < results.length; i++) {
      const window = results.slice(i - windowSize, i);
      const avgReward = window.reduce((sum, r) => sum + r.reward, 0) / windowSize;
      
      if (avgReward > 5) { // Threshold for "good" performance
        return i;
      }
    }
    
    return 'no_convergence';
  }

  saveChartData(filename, data) {
    const filepath = path.join(this.dataDir, 'visualizations', filename);
    const dir = path.dirname(filepath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log(`💾 Chart data saved: ${filename}`);
  }

  generateChartHTML(chartType, data) {
    const htmlTemplate = this.getChartHTMLTemplate(chartType, data);
    const filepath = path.join(this.dataDir, 'visualizations', `${chartType}.html`);
    
    fs.writeFileSync(filepath, htmlTemplate);
    console.log(`🌐 HTML chart generated: ${chartType}.html`);
  }

  generateMetricsHTML(metricsType, data) {
    const htmlTemplate = this.getMetricsHTMLTemplate(metricsType, data);
    const filepath = path.join(this.dataDir, 'visualizations', `${metricsType}.html`);
    
    fs.writeFileSync(filepath, htmlTemplate);
    console.log(`🌐 HTML metrics generated: ${metricsType}.html`);
  }

  getChartHTMLTemplate(chartType, data) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>${data.title}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .chart-container { margin: 20px 0; }
        .metadata { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${data.title}</h1>
        <p>${data.description}</p>
        
        <div class="chart-container">
            <canvas id="chart"></canvas>
        </div>
        
        <div class="metadata">
            <h3>Metadata</h3>
            <pre>${JSON.stringify(data.metadata, null, 2)}</pre>
        </div>
        
        <div class="data">
            <h3>Raw Data</h3>
            <pre>${JSON.stringify(data.data, null, 2)}</pre>
        </div>
    </div>
    
    <script>
        // Chart.js configuration would go here
        console.log('Chart data:', ${JSON.stringify(data)});
    </script>
</body>
</html>`;
  }

  getMetricsHTMLTemplate(metricsType, data) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>${data.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .metric { background: #f0f8ff; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .metric h3 { margin-top: 0; }
        .value { font-size: 24px; font-weight: bold; color: #0066cc; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${data.title}</h1>
        <p>${data.description}</p>
        
        <div class="metric">
            <h3>Overall Performance</h3>
            <div class="value">Success Rate: ${data.data.overall.successRate}%</div>
            <div class="value">Average Reward: ${data.data.overall.averageReward}</div>
            <div class="value">Total Trials: ${data.data.overall.totalTrials}</div>
        </div>
        
        <div class="metric">
            <h3>Successful Trials</h3>
            <div class="value">Count: ${data.data.successful.count}</div>
            <div class="value">Average Reward: ${data.data.successful.averageReward}</div>
        </div>
        
        <div class="metric">
            <h3>Failed Trials</h3>
            <div class="value">Count: ${data.data.failed.count}</div>
            <div class="value">Average Reward: ${data.data.failed.averageReward}</div>
        </div>
        
        <div class="metric">
            <h3>Learning Progress</h3>
            <div class="value">Final Epsilon: ${data.data.learning.finalEpsilon}</div>
            <div class="value">Improvement Rate: ${data.data.learning.improvementRate}%</div>
            <div class="value">Convergence Point: ${data.data.learning.convergencePoint}</div>
        </div>
    </div>
</body>
</html>`;
  }
}

// Run if called directly
if (require.main === module) {
  const tools = new RLVisualizationTools();
  tools.generateVisualizations().catch(console.error);
}

module.exports = RLVisualizationTools; 