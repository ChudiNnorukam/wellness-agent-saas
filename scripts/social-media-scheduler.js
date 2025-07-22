const { SocialMediaAgent } = require('./agents/SocialMediaAgent');
const fs = require('fs');
const path = require('path');

class SocialMediaScheduler {
  constructor() {
    this.isRunning = false;
    this.schedule = {
      twitter: { frequency: 3, lastPost: null }, // 3 posts per day
      linkedin: { frequency: 2, lastPost: null }, // 2 posts per day
      instagram: { frequency: 2, lastPost: null } // 2 posts per day
    };
    this.performance = {
      totalPosts: 0,
      successfulPosts: 0,
      failedPosts: 0,
      totalReach: 0,
      totalEngagement: 0
    };
    this.logPath = path.join(__dirname, '../docs/social-scheduler-log.json');
  }

  async start() {
    console.log('🚀 Starting Social Media Scheduler...');
    this.isRunning = true;
    
    // Load existing performance data
    this.loadPerformance();
    
    // Start the scheduling loop
    this.scheduleLoop();
    
    // Start performance monitoring
    this.monitorPerformance();
  }

  async stop() {
    console.log('🛑 Stopping Social Media Scheduler...');
    this.isRunning = false;
    this.savePerformance();
  }

  async scheduleLoop() {
    while (this.isRunning) {
      try {
        // Check if it's time to post
        const shouldPost = this.shouldPostNow();
        
        if (shouldPost) {
          await this.generateAndPost();
        }
        
        // Wait for 1 hour before next check
        await this.sleep(60 * 60 * 1000); // 1 hour
        
      } catch (error) {
        console.error('❌ Scheduler loop error:', error.message);
        await this.sleep(5 * 60 * 1000); // Wait 5 minutes on error
      }
    }
  }

  shouldPostNow() {
    const now = new Date();
    const hour = now.getHours();
    
    // Define posting windows
    const postingWindows = [
      { start: 8, end: 10 },   // Morning
      { start: 12, end: 14 },  // Afternoon
      { start: 18, end: 20 }   // Evening
    ];
    
    // Check if current time is in a posting window
    const inWindow = postingWindows.some(window => 
      hour >= window.start && hour <= window.end
    );
    
    if (!inWindow) return false;
    
    // Check if enough time has passed since last post
    const lastPost = this.getLastPostTime();
    if (lastPost) {
      const timeSinceLastPost = now - lastPost;
      const minInterval = 4 * 60 * 60 * 1000; // 4 hours minimum
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
        
        // Update performance metrics
        if (result.metrics) {
          this.performance.totalReach += result.metrics.reach || 0;
          this.performance.totalEngagement += result.metrics.engagement || 0;
        }
        
        // Log the successful post
        this.logPost(result);
        
        console.log('✅ Content posted successfully:', {
          type: result.content.type,
          platforms: result.content.platforms,
          reach: result.metrics?.reach || 0,
          engagement: result.metrics?.engagement || 0
        });
        
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

  async monitorPerformance() {
    while (this.isRunning) {
      try {
        // Generate performance report every 24 hours
        await this.sleep(24 * 60 * 60 * 1000); // 24 hours
        
        const report = this.generatePerformanceReport();
        this.savePerformanceReport(report);
        
        console.log('📊 Performance Report Generated:', {
          totalPosts: report.totalPosts,
          successRate: report.successRate,
          avgReach: report.avgReach,
          avgEngagement: report.avgEngagement
        });
        
      } catch (error) {
        console.error('❌ Performance monitoring error:', error.message);
      }
    }
  }

  generatePerformanceReport() {
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
      avgEngagement: Math.round(avgEngagement * 100) / 100
    };
  }

  getLastPostTime() {
    try {
      if (fs.existsSync(this.logPath)) {
        const logs = JSON.parse(fs.readFileSync(this.logPath, 'utf8'));
        if (logs.length > 0) {
          return new Date(logs[logs.length - 1].timestamp);
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not read last post time:', error.message);
    }
    return null;
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
          platforms: result.content.platforms
        },
        metrics: result.metrics,
        scheduling: result.scheduled
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

  savePerformanceReport(report) {
    try {
      const reportsPath = path.join(__dirname, '../docs/social-performance-reports.json');
      const reports = fs.existsSync(reportsPath) 
        ? JSON.parse(fs.readFileSync(reportsPath, 'utf8')) 
        : [];
      
      reports.push(report);
      fs.writeFileSync(reportsPath, JSON.stringify(reports, null, 2));
      
    } catch (error) {
      console.warn('⚠️ Could not save performance report:', error.message);
    }
  }

  loadPerformance() {
    try {
      const performancePath = path.join(__dirname, '../docs/social-scheduler-performance.json');
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
      const performancePath = path.join(__dirname, '../docs/social-scheduler-performance.json');
      fs.writeFileSync(performancePath, JSON.stringify(this.performance, null, 2));
    } catch (error) {
      console.warn('⚠️ Could not save performance data:', error.message);
    }
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
      schedule: this.schedule,
      lastPost: this.getLastPostTime()
    };
  }
}

// CLI interface
if (require.main === module) {
  const scheduler = new SocialMediaScheduler();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      scheduler.start();
      break;
    case 'stop':
      scheduler.stop();
      break;
    case 'post':
      scheduler.manualPost();
      break;
    case 'status':
      console.log('📊 Scheduler Status:', scheduler.getStatus());
      break;
    default:
      console.log(`
🤖 Social Media Scheduler CLI

Usage:
  node social-media-scheduler.js start    - Start the scheduler
  node social-media-scheduler.js stop     - Stop the scheduler
  node social-media-scheduler.js post     - Manual post trigger
  node social-media-scheduler.js status   - Show current status

The scheduler will automatically:
- Generate brand-voice content using SocialMediaAgent
- Post to Twitter, LinkedIn, and Instagram
- Track performance metrics
- Generate daily reports
      `);
  }
}

module.exports = { SocialMediaScheduler }; 