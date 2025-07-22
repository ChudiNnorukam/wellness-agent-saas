const { SocialMediaAgent } = require('./agents/SocialMediaAgent');
const fs = require('fs');
const path = require('path');

class SocialMediaAutomation {
  constructor() {
    this.isRunning = false;
    this.performance = {
      totalPosts: 0,
      successfulPosts: 0,
      failedPosts: 0,
      totalReach: 0,
      totalEngagement: 0,
      lastPostTime: null
    };
    this.logPath = path.join(__dirname, '../docs/social-automation-log.json');
    this.metricsPath = path.join(__dirname, '../docs/social-media-metrics.json');
  }

  async start() {
    console.log('🚀 Starting Social Media Automation...');
    this.isRunning = true;
    
    // Load existing performance data
    this.loadPerformance();
    
    // Start the automation loop
    this.automationLoop();
    
    console.log('✅ Social Media Automation started successfully');
    console.log('📝 Will generate and post content automatically');
    console.log('📊 Performance tracking enabled');
  }

  async stop() {
    console.log('🛑 Stopping Social Media Automation...');
    this.isRunning = false;
    this.savePerformance();
    console.log('✅ Social Media Automation stopped');
  }

  async automationLoop() {
    while (this.isRunning) {
      try {
        // Check if it's time to post (every 4-6 hours)
        if (this.shouldPostNow()) {
          await this.generateAndPost();
        }
        
        // Wait for 1 hour before next check
        await this.sleep(60 * 60 * 1000); // 1 hour
        
      } catch (error) {
        console.error('❌ Automation loop error:', error.message);
        await this.sleep(5 * 60 * 1000); // Wait 5 minutes on error
      }
    }
  }

  shouldPostNow() {
    const now = new Date();
    const hour = now.getHours();
    
    // Define optimal posting times
    const postingTimes = [9, 12, 15, 18]; // 9 AM, 12 PM, 3 PM, 6 PM
    
    // Check if current hour is a posting time
    if (!postingTimes.includes(hour)) return false;
    
    // Check if enough time has passed since last post
    if (this.performance.lastPostTime) {
      const timeSinceLastPost = now - new Date(this.performance.lastPostTime);
      const minInterval = 3 * 60 * 60 * 1000; // 3 hours minimum
      if (timeSinceLastPost < minInterval) return false;
    }
    
    return true;
  }

  async generateAndPost() {
    console.log('📝 Generating social media content...');
    
    try {
      // Run the SocialMediaAgent
      const result = await SocialMediaAgent.run({});
      
      if (result.success) {
        this.performance.totalPosts++;
        this.performance.successfulPosts++;
        this.performance.lastPostTime = new Date().toISOString();
        
        // Update performance metrics
        if (result.metrics) {
          this.performance.totalReach += result.metrics.reach || 0;
          this.performance.totalEngagement += result.metrics.engagement || 0;
        }
        
        // Log the successful post
        this.logPost(result);
        
        console.log('✅ Content posted successfully:', {
          type: result.content.type,
          title: result.content.title,
          platforms: result.content.platforms,
          reach: result.metrics?.reach || 0,
          engagement: result.metrics?.engagement || 0
        });
        
        // Calculate and display reward
        const reward = SocialMediaAgent.getReward(result.metrics || {});
        console.log('🎯 Agent Reward:', reward);
        
      } else {
        this.performance.totalPosts++;
        this.performance.failedPosts++;
        
        console.error('❌ Failed to post content:', result.error);
        this.logError(result.error);
      }
      
    } catch (error) {
      this.performance.totalPosts++;
      this.performance.failedPosts++;
      
      console.error('❌ Error generating content:', error.message);
      this.logError(error.message);
    }
  }

  logPost(result) {
    try {
      const logs = fs.existsSync(this.logPath) 
        ? JSON.parse(fs.readFileSync(this.logPath, 'utf8')) 
        : [];
      
      logs.push({
        timestamp: new Date().toISOString(),
        type: 'post',
        content: {
          type: result.content.type,
          title: result.content.title,
          platforms: result.content.platforms,
          content: result.content.content
        },
        metrics: result.metrics,
        scheduling: result.scheduled,
        brandVoice: result.brandVoiceUsed
      });
      
      fs.writeFileSync(this.logPath, JSON.stringify(logs, null, 2));
      
    } catch (error) {
      console.warn('⚠️ Could not log post:', error.message);
    }
  }

  logError(error) {
    try {
      const logs = fs.existsSync(this.logPath) 
        ? JSON.parse(fs.readFileSync(this.logPath, 'utf8')) 
        : [];
      
      logs.push({
        timestamp: new Date().toISOString(),
        type: 'error',
        error: error
      });
      
      fs.writeFileSync(this.logPath, JSON.stringify(logs, null, 2));
      
    } catch (err) {
      console.warn('⚠️ Could not log error:', err.message);
    }
  }

  loadPerformance() {
    try {
      const performancePath = path.join(__dirname, '../docs/social-automation-performance.json');
      if (fs.existsSync(performancePath)) {
        const data = JSON.parse(fs.readFileSync(performancePath, 'utf8'));
        this.performance = { ...this.performance, ...data };
      }
    } catch (error) {
      console.warn('⚠️ Could not load performance data:', error.message);
    }
  }

  savePerformance() {
    try {
      const performancePath = path.join(__dirname, '../docs/social-automation-performance.json');
      fs.writeFileSync(performancePath, JSON.stringify(this.performance, null, 2));
    } catch (error) {
      console.warn('⚠️ Could not save performance data:', error.message);
    }
  }

  getPerformanceReport() {
    const successRate = this.performance.totalPosts > 0 
      ? (this.performance.successfulPosts / this.performance.totalPosts) * 100 
      : 0;
    
    const avgReach = this.performance.successfulPosts > 0 
      ? this.performance.totalReach / this.performance.successfulPosts 
      : 0;
    
    const avgEngagement = this.performance.successfulPosts > 0 
      ? this.performance.totalEngagement / this.performance.successfulPosts 
      : 0;
    
    return {
      timestamp: new Date().toISOString(),
      totalPosts: this.performance.totalPosts,
      successfulPosts: this.performance.successfulPosts,
      failedPosts: this.performance.failedPosts,
      successRate: Math.round(successRate * 100) / 100,
      totalReach: this.performance.totalReach,
      totalEngagement: this.performance.totalEngagement,
      avgReach: Math.round(avgReach * 100) / 100,
      avgEngagement: Math.round(avgEngagement * 100) / 100,
      lastPostTime: this.performance.lastPostTime
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Manual trigger for testing
  async manualPost() {
    console.log('🔧 Manual post triggered...');
    await this.generateAndPost();
  }

  // Get current status
  getStatus() {
    return {
      isRunning: this.isRunning,
      performance: this.performance,
      lastPost: this.performance.lastPostTime
    };
  }
}

// CLI interface
if (require.main === module) {
  const automation = new SocialMediaAutomation();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      automation.start();
      break;
    case 'stop':
      automation.stop();
      break;
    case 'post':
      automation.manualPost();
      break;
    case 'status':
      console.log('📊 Automation Status:', automation.getStatus());
      break;
    case 'report':
      console.log('📈 Performance Report:', automation.getPerformanceReport());
      break;
    default:
      console.log(`
🤖 Social Media Automation CLI

Usage:
  node social-media-automation.js start    - Start the automation
  node social-media-automation.js stop     - Stop the automation
  node social-media-automation.js post     - Manual post trigger
  node social-media-automation.js status   - Show current status
  node social-media-automation.js report   - Show performance report

Features:
- ✅ Brand-voice content generation
- ✅ Multi-platform posting (Twitter, LinkedIn, Instagram)
- ✅ Performance tracking and analytics
- ✅ Autonomous 24/7 operation
- ✅ RL-driven optimization
- ✅ SEO-optimized content

The automation will:
- Generate content using your brand voice (chudi_humanized.md)
- Post automatically at optimal times
- Track engagement and reach metrics
- Learn and optimize over time
      `);
  }
}

module.exports = { SocialMediaAutomation }; 