#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ImprovementTracker {
  constructor() {
    this.trackingFile = path.join(__dirname, '..', 'logs', 'improvement-tracker.json');
    this.improvements = this.loadImprovements();
    this.categories = {
      'wellness': { count: 0, impact: 0, emoji: '🧘‍♀️' },
      'database': { count: 0, impact: 0, emoji: '🗄️' },
      'payment': { count: 0, impact: 0, emoji: '💳' },
      'ai': { count: 0, impact: 0, emoji: '🤖' },
      'ui': { count: 0, impact: 0, emoji: '🎨' },
      'performance': { count: 0, impact: 0, emoji: '⚡' },
      'security': { count: 0, impact: 0, emoji: '🔒' },
      'user_engagement': { count: 0, impact: 0, emoji: '🎯' },
      'health_analysis': { count: 0, impact: 0, emoji: '📊' },
      'recommendations': { count: 0, impact: 0, emoji: '💡' }
    };
  }

  loadImprovements() {
    try {
      if (fs.existsSync(this.trackingFile)) {
        return JSON.parse(fs.readFileSync(this.trackingFile, 'utf8'));
      }
    } catch (error) {
      console.error('Error loading improvements:', error.message);
    }
    return { improvements: [], summary: {}, lastUpdate: null };
  }

  saveImprovements() {
    try {
      const logDir = path.dirname(this.trackingFile);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      fs.writeFileSync(this.trackingFile, JSON.stringify(this.improvements, null, 2));
    } catch (error) {
      console.error('Error saving improvements:', error.message);
    }
  }

  trackImprovement(data) {
    const {
      agentName,
      action,
      result,
      impact = 5,
      category = 'general',
      timestamp = new Date().toISOString(),
      details = {}
    } = data;

    const improvement = {
      id: this.generateId(),
      timestamp,
      agentName,
      action,
      result,
      impact,
      category,
      details,
      gitCommit: this.getCurrentCommit(),
      status: 'tracked'
    };

    this.improvements.improvements.push(improvement);
    this.updateCategoryStats(category, impact);
    this.updateSummary();
    this.saveImprovements();

    return improvement;
  }

  generateId() {
    return `imp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getCurrentCommit() {
    try {
      return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    } catch (error) {
      return 'unknown';
    }
  }

  updateCategoryStats(category, impact) {
    if (this.categories[category]) {
      this.categories[category].count++;
      this.categories[category].impact += impact;
    }
  }

  updateSummary() {
    const totalImprovements = this.improvements.improvements.length;
    const totalImpact = this.improvements.improvements.reduce((sum, imp) => sum + imp.impact, 0);
    const averageImpact = totalImprovements > 0 ? Math.round(totalImpact / totalImprovements) : 0;

    this.improvements.summary = {
      totalImprovements,
      totalImpact,
      averageImpact,
      categories: this.categories,
      lastUpdate: new Date().toISOString(),
      topAgents: this.getTopAgents(),
      recentImprovements: this.getRecentImprovements(10)
    };
  }

  getTopAgents() {
    const agentStats = {};
    this.improvements.improvements.forEach(imp => {
      if (!agentStats[imp.agentName]) {
        agentStats[imp.agentName] = { count: 0, totalImpact: 0 };
      }
      agentStats[imp.agentName].count++;
      agentStats[imp.agentName].totalImpact += imp.impact;
    });

    return Object.entries(agentStats)
      .map(([agent, stats]) => ({
        agent,
        count: stats.count,
        totalImpact: stats.totalImpact,
        averageImpact: Math.round(stats.totalImpact / stats.count)
      }))
      .sort((a, b) => b.totalImpact - a.totalImpact)
      .slice(0, 5);
  }

  getRecentImprovements(count = 10) {
    return this.improvements.improvements
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, count)
      .map(imp => ({
        id: imp.id,
        timestamp: imp.timestamp,
        agent: imp.agentName,
        action: imp.action,
        impact: imp.impact,
        category: imp.category
      }));
  }

  generateReport(timeframe = '24h') {
    const cutoffTime = new Date(Date.now() - this.parseTimeframe(timeframe));
    const recentImprovements = this.improvements.improvements.filter(
      imp => new Date(imp.timestamp) > cutoffTime
    );

    const report = {
      timeframe,
      generatedAt: new Date().toISOString(),
      summary: {
        totalImprovements: recentImprovements.length,
        totalImpact: recentImprovements.reduce((sum, imp) => sum + imp.impact, 0),
        averageImpact: recentImprovements.length > 0 
          ? Math.round(recentImprovements.reduce((sum, imp) => sum + imp.impact, 0) / recentImprovements.length)
          : 0
      },
      topCategories: this.getTopCategories(recentImprovements),
      topAgents: this.getTopAgentsInTimeframe(recentImprovements),
      recentActivity: recentImprovements.slice(0, 20),
      recommendations: this.generateRecommendations(recentImprovements)
    };

    return report;
  }

  getTopCategories(improvements) {
    const categoryStats = {};
    improvements.forEach(imp => {
      if (!categoryStats[imp.category]) {
        categoryStats[imp.category] = { count: 0, impact: 0 };
      }
      categoryStats[imp.category].count++;
      categoryStats[imp.category].impact += imp.impact;
    });

    return Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        count: stats.count,
        totalImpact: stats.impact,
        averageImpact: Math.round(stats.impact / stats.count),
        emoji: this.categories[category]?.emoji || '🚀'
      }))
      .sort((a, b) => b.totalImpact - a.totalImpact);
  }

  getTopAgentsInTimeframe(improvements) {
    const agentStats = {};
    improvements.forEach(imp => {
      if (!agentStats[imp.agentName]) {
        agentStats[imp.agentName] = { count: 0, impact: 0 };
      }
      agentStats[imp.agentName].count++;
      agentStats[imp.agentName].impact += imp.impact;
    });

    return Object.entries(agentStats)
      .map(([agent, stats]) => ({
        agent,
        count: stats.count,
        totalImpact: stats.impact,
        averageImpact: Math.round(stats.impact / stats.count)
      }))
      .sort((a, b) => b.totalImpact - a.totalImpact)
      .slice(0, 5);
  }

  generateRecommendations(improvements) {
    const recommendations = [];

    // Analyze patterns and generate recommendations
    const lowImpactCount = improvements.filter(imp => imp.impact < 5).length;
    const highImpactCount = improvements.filter(imp => imp.impact >= 8).length;

    if (lowImpactCount > highImpactCount) {
      recommendations.push({
        type: 'performance',
        message: 'Focus on high-impact improvements to maximize agent effectiveness',
        priority: 'high'
      });
    }

    const categoryDistribution = {};
    improvements.forEach(imp => {
      categoryDistribution[imp.category] = (categoryDistribution[imp.category] || 0) + 1;
    });

    const underrepresentedCategories = Object.entries(this.categories)
      .filter(([category, stats]) => !categoryDistribution[category] || categoryDistribution[category] < 2)
      .map(([category]) => category);

    if (underrepresentedCategories.length > 0) {
      recommendations.push({
        type: 'balance',
        message: `Consider focusing on underrepresented categories: ${underrepresentedCategories.join(', ')}`,
        priority: 'medium'
      });
    }

    return recommendations;
  }

  parseTimeframe(timeframe) {
    const hours = timeframe.includes('h') ? parseInt(timeframe) : 24;
    return hours * 60 * 60 * 1000;
  }

  displayReport(report) {
    console.log('\n📊 WELLNESSAI IMPROVEMENT REPORT');
    console.log('=====================================');
    console.log(`📅 Timeframe: ${report.timeframe}`);
    console.log(`📈 Total Improvements: ${report.summary.totalImprovements}`);
    console.log(`🎯 Total Impact: ${report.summary.totalImpact}`);
    console.log(`📊 Average Impact: ${report.summary.averageImpact}`);
    
    console.log('\n🏆 TOP CATEGORIES:');
    report.topCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.emoji} ${cat.category}: ${cat.count} improvements (${cat.totalImpact} impact)`);
    });

    console.log('\n🤖 TOP AGENTS:');
    report.topAgents.forEach((agent, index) => {
      console.log(`${index + 1}. ${agent.agent}: ${agent.count} actions (${agent.totalImpact} impact)`);
    });

    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      report.recommendations.forEach(rec => {
        console.log(`• ${rec.message} (${rec.priority} priority)`);
      });
    }
  }
}

// Export for use in other modules
module.exports = { ImprovementTracker };

// If run directly, generate a report
if (require.main === module) {
  const tracker = new ImprovementTracker();
  const report = tracker.generateReport('24h');
  tracker.displayReport(report);
} 