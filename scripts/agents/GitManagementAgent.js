const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class GitManagementAgent {
  constructor() {
    this.name = 'GitManagementAgent';
    this.description = 'Automatically manages git operations for AI agent improvements';
    this.state = 'idle';
    this.performance = { commits: 0, pushes: 0, errors: 0 };
    this.changesLog = [];
    this.lastCommitTime = null;
  }

  async execute(action, data = {}) {
    console.log(`🤖 ${this.name}: Executing ${action}...`);
    
    try {
      let result;
      switch (action) {
        case 'commit_improvements':
          result = await this.commitImprovements(data);
          break;
        case 'auto_commit_changes':
          result = await this.autoCommitChanges(data);
          break;
        case 'log_agent_activity':
          result = await this.logAgentActivity(data);
          break;
        case 'push_to_repository':
          result = await this.pushToRepository(data);
          break;
        case 'create_improvement_summary':
          result = await this.createImprovementSummary(data);
          break;
        case 'backup_current_state':
          result = await this.backupCurrentState(data);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      this.performance.commits++;
      return result;
    } catch (error) {
      this.performance.errors++;
      console.error(`❌ ${this.name} failed: ${error.message}`);
      throw error;
    }
  }

  async commitImprovements(data) {
    const { improvements, agentName, category } = data;
    
    if (!improvements || improvements.length === 0) {
      return { message: 'No improvements to commit', status: 'skipped' };
    }

    try {
      // Check if there are changes to commit
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      
      if (!status.trim()) {
        return { message: 'No changes detected in working directory', status: 'skipped' };
      }

      // Stage all changes
      execSync('git add .', { stdio: 'inherit' });

      // Create commit message
      const commitMessage = this.generateCommitMessage(improvements, agentName, category);
      
      // Commit changes
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

      // Log the improvement
      await this.logImprovement(improvements, agentName, category);

      this.performance.commits++;
      this.lastCommitTime = new Date();

      return {
        message: `Committed ${improvements.length} improvements from ${agentName}`,
        commitMessage,
        improvements: improvements.length,
        status: 'success'
      };
    } catch (error) {
      throw new Error(`Failed to commit improvements: ${error.message}`);
    }
  }

  async autoCommitChanges(data) {
    const { agentName, action, result, impact } = data;
    
    try {
      // Check for changes
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      
      if (!status.trim()) {
        return { message: 'No changes to auto-commit', status: 'skipped' };
      }

      // Stage changes
      execSync('git add .', { stdio: 'inherit' });

      // Generate auto-commit message
      const commitMessage = this.generateAutoCommitMessage(agentName, action, result, impact);
      
      // Commit
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

      // Push to repository
      await this.pushToRepository({ force: false });

      this.performance.commits++;
      this.performance.pushes++;

      return {
        message: `Auto-committed and pushed changes from ${agentName}`,
        commitMessage,
        status: 'success'
      };
    } catch (error) {
      throw new Error(`Auto-commit failed: ${error.message}`);
    }
  }

  async pushToRepository(data = {}) {
    try {
      const { force = false } = data;
      const pushCommand = force ? 'git push origin gh-pages --force' : 'git push origin gh-pages';
      
      execSync(pushCommand, { stdio: 'inherit' });
      
      this.performance.pushes++;
      
      return {
        message: 'Successfully pushed to repository',
        status: 'success'
      };
    } catch (error) {
      throw new Error(`Failed to push to repository: ${error.message}`);
    }
  }

  async logAgentActivity(data) {
    const { agentName, action, result, timestamp = new Date() } = data;
    
    const logEntry = {
      timestamp: timestamp.toISOString(),
      agent: agentName,
      action,
      result,
      impact: this.assessImpact(result),
      category: this.categorizeAction(action)
    };

    this.changesLog.push(logEntry);
    
    // Save to file
    await this.saveActivityLog();
    
    return {
      message: `Logged activity from ${agentName}`,
      logEntry,
      status: 'success'
    };
  }

  async createImprovementSummary(data) {
    const { timeframe = '24h' } = data;
    
    const recentChanges = this.changesLog.filter(entry => {
      const entryTime = new Date(entry.timestamp);
      const cutoffTime = new Date(Date.now() - this.parseTimeframe(timeframe));
      return entryTime > cutoffTime;
    });

    const summary = {
      timeframe,
      totalChanges: recentChanges.length,
      agents: [...new Set(recentChanges.map(entry => entry.agent))],
      categories: this.groupByCategory(recentChanges),
      impact: this.calculateOverallImpact(recentChanges),
      topImprovements: this.getTopImprovements(recentChanges)
    };

    // Save summary
    await this.saveImprovementSummary(summary);
    
    return {
      message: `Created improvement summary for ${timeframe}`,
      summary,
      status: 'success'
    };
  }

  async backupCurrentState(data) {
    const { description = 'AI Agent Backup' } = data;
    
    try {
      // Create backup branch
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupBranch = `backup/ai-agents-${timestamp}`;
      
      execSync(`git checkout -b ${backupBranch}`, { stdio: 'inherit' });
      execSync(`git push origin ${backupBranch}`, { stdio: 'inherit' });
      execSync('git checkout gh-pages', { stdio: 'inherit' });
      
      return {
        message: `Created backup branch: ${backupBranch}`,
        backupBranch,
        status: 'success'
      };
    } catch (error) {
      throw new Error(`Backup failed: ${error.message}`);
    }
  }

  generateCommitMessage(improvements, agentName, category) {
    const emoji = this.getCategoryEmoji(category);
    const improvementCount = improvements.length;
    const mainImprovement = improvements[0] || 'AI agent improvements';
    
    return `${emoji} ${agentName}: ${mainImprovement} (${improvementCount} improvements)`;
  }

  generateAutoCommitMessage(agentName, action, result, impact) {
    const emoji = this.getActionEmoji(action);
    const impactLevel = this.getImpactLevel(impact);
    
    return `${emoji} ${agentName} - ${action}: ${result} (${impactLevel} impact)`;
  }

  getCategoryEmoji(category) {
    const emojis = {
      'wellness': '🧘‍♀️',
      'database': '🗄️',
      'payment': '💳',
      'ai': '🤖',
      'ui': '🎨',
      'performance': '⚡',
      'security': '🔒',
      'user_engagement': '🎯',
      'health_analysis': '📊',
      'recommendations': '💡'
    };
    return emojis[category] || '🚀';
  }

  getActionEmoji(action) {
    const emojis = {
      'analyze_user_wellness_data': '📊',
      'generate_health_recommendations': '💡',
      'process_wellness_subscriptions': '💳',
      'optimize_wellness_database': '🗄️',
      'improve_user_wellness_engagement': '🎯',
      'check_dependencies': '🔍',
      'analyze_conversions': '📈',
      'generate_traffic': '🚀',
      'analyze_usability': '🎨',
      'optimize_social_proof': '🌟',
      'analyze_feedback': '📝',
      'optimize_service': '🛠️'
    };
    return emojis[action] || '🤖';
  }

  getImpactLevel(impact) {
    if (impact >= 8) return 'HIGH';
    if (impact >= 5) return 'MEDIUM';
    return 'LOW';
  }

  assessImpact(result) {
    // Simple impact assessment based on result content
    if (typeof result === 'string') {
      if (result.includes('successfully') || result.includes('optimized')) return 7;
      if (result.includes('improved') || result.includes('enhanced')) return 6;
      if (result.includes('created') || result.includes('generated')) return 5;
      return 4;
    }
    return 5; // Default medium impact
  }

  categorizeAction(action) {
    if (action.includes('wellness') || action.includes('health')) return 'wellness';
    if (action.includes('database') || action.includes('data')) return 'database';
    if (action.includes('payment') || action.includes('subscription')) return 'payment';
    if (action.includes('ai') || action.includes('recommendation')) return 'ai';
    if (action.includes('ui') || action.includes('usability')) return 'ui';
    if (action.includes('performance') || action.includes('optimize')) return 'performance';
    if (action.includes('security') || action.includes('auth')) return 'security';
    if (action.includes('engagement') || action.includes('user')) return 'user_engagement';
    return 'general';
  }

  async saveActivityLog() {
    const logPath = path.join(__dirname, '..', '..', 'logs', 'agent-activity.json');
    const logDir = path.dirname(logPath);
    
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    fs.writeFileSync(logPath, JSON.stringify(this.changesLog, null, 2));
  }

  async saveImprovementSummary(summary) {
    const summaryPath = path.join(__dirname, '..', '..', 'logs', 'improvement-summary.json');
    const summaryDir = path.dirname(summaryPath);
    
    if (!fs.existsSync(summaryDir)) {
      fs.mkdirSync(summaryDir, { recursive: true });
    }
    
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  }

  groupByCategory(changes) {
    return changes.reduce((acc, change) => {
      const category = change.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  }

  calculateOverallImpact(changes) {
    if (changes.length === 0) return 0;
    const totalImpact = changes.reduce((sum, change) => sum + change.impact, 0);
    return Math.round(totalImpact / changes.length);
  }

  getTopImprovements(changes) {
    return changes
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 5)
      .map(change => ({
        agent: change.agent,
        action: change.action,
        impact: change.impact,
        timestamp: change.timestamp
      }));
  }

  parseTimeframe(timeframe) {
    const hours = timeframe.includes('h') ? parseInt(timeframe) : 24;
    return hours * 60 * 60 * 1000; // Convert to milliseconds
  }

  getPerformance() {
    return {
      ...this.performance,
      totalLogs: this.changesLog.length,
      lastCommit: this.lastCommitTime
    };
  }
}

module.exports = { GitManagementAgent }; 