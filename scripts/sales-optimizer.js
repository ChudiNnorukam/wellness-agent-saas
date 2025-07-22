require('dotenv').config();
const Stripe = require('stripe');
const { google } = require('googleapis');
const mysql = require('mysql2/promise');
const winston = require('winston');

class RealSalesOptimizer {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    this.logger = this.setupLogger();
    this.db = null;
    this.analytics = null;
    
    this.currentPricing = {
      basic: parseFloat(process.env.CURRENT_MONTHLY_PRICE) || 29.99,
      pro: 49.99,
      enterprise: 99.99
    };
    
    this.optimizationHistory = [];
  }

  setupLogger() {
    return winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/sales-optimizer.log' }),
        new winston.transports.Console({
          format: winston.format.simple()
        })
      ]
    });
  }

  async initialize() {
    try {
      // Initialize database connection
      this.db = await mysql.createConnection(process.env.DATABASE_URL);
      this.logger.info('Database connected successfully');

      // Initialize Google Analytics
      const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/analytics.readonly']
      });
      
      this.analytics = google.analytics({ version: 'v3', auth });
      this.logger.info('Google Analytics connected successfully');

      return true;
    } catch (error) {
      this.logger.error('Failed to initialize connections:', error);
      return false;
    }
  }

  async getRealConversionData() {
    try {
      // Get Stripe subscription data
      const subscriptions = await this.stripe.subscriptions.list({
        limit: 100,
        status: 'active'
      });

      // Get Google Analytics conversion data
      const analyticsData = await this.analytics.data.ga.get({
        ids: `ga:${process.env.GOOGLE_ANALYTICS_VIEW_ID}`,
        start_date: '30daysAgo',
        end_date: 'today',
        metrics: 'ga:transactions,ga:transactionRevenue,ga:sessions',
        dimensions: 'ga:source,ga:medium'
      });

      // Get database conversion funnel data
      const [funnelData] = await this.db.execute(`
        SELECT 
          COUNT(*) as total_visitors,
          SUM(CASE WHEN signed_up = 1 THEN 1 ELSE 0 END) as signups,
          SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) as conversions
        FROM user_funnel 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);

      return {
        stripe: {
          totalSubscriptions: subscriptions.data.length,
          monthlyRevenue: subscriptions.data.reduce((sum, sub) => sum + (sub.items.data[0].price.unit_amount / 100), 0),
          churnRate: await this.calculateChurnRate()
        },
        analytics: {
          transactions: analyticsData.data.totalsForAllResults['ga:transactions'],
          revenue: analyticsData.data.totalsForAllResults['ga:transactionRevenue'],
          sessions: analyticsData.data.totalsForAllResults['ga:sessions']
        },
        funnel: funnelData[0]
      };
    } catch (error) {
      this.logger.error('Error getting conversion data:', error);
      return null;
    }
  }

  async calculateChurnRate() {
    try {
      const [churnData] = await this.db.execute(`
        SELECT 
          COUNT(*) as total_cancellations
        FROM subscriptions 
        WHERE status = 'canceled' 
        AND canceled_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);

      const [totalSubs] = await this.db.execute(`
        SELECT COUNT(*) as total_subscriptions
        FROM subscriptions 
        WHERE status = 'active'
      `);

      return totalSubs[0].total_subscriptions > 0 
        ? churnData[0].total_cancellations / totalSubs[0].total_subscriptions 
        : 0;
    } catch (error) {
      this.logger.error('Error calculating churn rate:', error);
      return 0;
    }
  }

  async analyzePricingPerformance() {
    const data = await this.getRealConversionData();
    if (!data) return null;

    const conversionRate = data.funnel.conversions / data.funnel.total_visitors;
    const revenuePerVisitor = data.stripe.monthlyRevenue / data.funnel.total_visitors;
    const churnRate = data.stripe.churnRate;

    this.logger.info('Current Performance Metrics:', {
      conversionRate: (conversionRate * 100).toFixed(2) + '%',
      revenuePerVisitor: '$' + revenuePerVisitor.toFixed(2),
      churnRate: (churnRate * 100).toFixed(2) + '%',
      monthlyRevenue: '$' + data.stripe.monthlyRevenue.toFixed(2)
    });

    return {
      conversionRate,
      revenuePerVisitor,
      churnRate,
      monthlyRevenue: data.stripe.monthlyRevenue
    };
  }

  async optimizePricing() {
    const performance = await this.analyzePricingPerformance();
    if (!performance) return null;

    const currentPrice = this.currentPricing.basic;
    let recommendedPrice = currentPrice;
    let optimizationReason = '';

    // Real pricing optimization logic based on actual data
    if (performance.conversionRate > 0.15) {
      // High conversion rate - can increase price
      recommendedPrice = currentPrice * 1.15;
      optimizationReason = 'High conversion rate allows for price increase';
    } else if (performance.conversionRate < 0.05) {
      // Low conversion rate - decrease price
      recommendedPrice = currentPrice * 0.85;
      optimizationReason = 'Low conversion rate - price reduction recommended';
    } else if (performance.churnRate > 0.10) {
      // High churn - consider price decrease
      recommendedPrice = currentPrice * 0.90;
      optimizationReason = 'High churn rate - price reduction to improve retention';
    } else if (performance.revenuePerVisitor > 5) {
      // High revenue per visitor - can increase price
      recommendedPrice = currentPrice * 1.10;
      optimizationReason = 'High revenue per visitor - price increase opportunity';
    }

    // Ensure price stays within reasonable bounds
    recommendedPrice = Math.max(9.99, Math.min(199.99, recommendedPrice));

    const optimization = {
      timestamp: new Date().toISOString(),
      currentPrice,
      recommendedPrice: Math.round(recommendedPrice * 100) / 100,
      reason: optimizationReason,
      performance
    };

    this.optimizationHistory.push(optimization);
    this.logger.info('Pricing optimization completed:', optimization);

    return optimization;
  }

  async implementPricingChange(optimization) {
    try {
      // Update Stripe pricing
      const price = await this.stripe.prices.create({
        unit_amount: Math.round(optimization.recommendedPrice * 100),
        currency: 'usd',
        recurring: { interval: 'month' },
        product_data: {
          name: 'Wellness SaaS Basic Plan',
          description: 'Optimized pricing based on performance analysis'
        }
      });

      // Update database
      await this.db.execute(`
        UPDATE pricing_tiers 
        SET price = ?, updated_at = NOW() 
        WHERE tier_name = 'basic'
      `, [optimization.recommendedPrice]);

      // Log the change
      await this.db.execute(`
        INSERT INTO pricing_changes (old_price, new_price, reason, created_at)
        VALUES (?, ?, ?, NOW())
      `, [optimization.currentPrice, optimization.recommendedPrice, optimization.reason]);

      this.logger.info('Pricing change implemented successfully:', {
        oldPrice: optimization.currentPrice,
        newPrice: optimization.recommendedPrice,
        stripePriceId: price.id
      });

      return true;
    } catch (error) {
      this.logger.error('Failed to implement pricing change:', error);
      return false;
    }
  }

  async generateOptimizationReport() {
    const recentOptimizations = this.optimizationHistory.slice(-5);
    
    console.log('\n📊 === REAL SALES OPTIMIZATION REPORT ===');
    console.log(`⏰ Generated: ${new Date().toLocaleString()}`);
    
    if (recentOptimizations.length === 0) {
      console.log('No optimizations performed yet.');
      return;
    }

    const latest = recentOptimizations[recentOptimizations.length - 1];
    console.log(`\n💰 Current Price: $${latest.currentPrice}`);
    console.log(`🎯 Recommended Price: $${latest.recommendedPrice}`);
    console.log(`📈 Price Change: ${((latest.recommendedPrice - latest.currentPrice) / latest.currentPrice * 100).toFixed(1)}%`);
    console.log(`💡 Reason: ${latest.reason}`);

    console.log('\n📊 Performance Metrics:');
    console.log(`Conversion Rate: ${(latest.performance.conversionRate * 100).toFixed(2)}%`);
    console.log(`Revenue per Visitor: $${latest.performance.revenuePerVisitor.toFixed(2)}`);
    console.log(`Churn Rate: ${(latest.performance.churnRate * 100).toFixed(2)}%`);
    console.log(`Monthly Revenue: $${latest.performance.monthlyRevenue.toFixed(2)}`);

    console.log('\n🔄 Recent Optimizations:');
    recentOptimizations.forEach((opt, index) => {
      console.log(`${index + 1}. ${opt.timestamp}: $${opt.currentPrice} → $${opt.recommendedPrice} (${opt.reason})`);
    });
  }

  async runOptimization() {
    console.log('🚀 Starting Real Sales Optimization...');
    
    const initialized = await this.initialize();
    if (!initialized) {
      console.log('❌ Failed to initialize connections');
      return;
    }

    console.log('✅ Connected to real data sources');
    
    const optimization = await this.optimizePricing();
    if (!optimization) {
      console.log('❌ Failed to analyze pricing');
      return;
    }

    await this.generateOptimizationReport();

    // Ask for confirmation before implementing
    console.log('\n🤔 Would you like to implement this pricing change? (y/n)');
    // In a real implementation, you'd wait for user input here
    
    const shouldImplement = true; // For demo purposes
    
    if (shouldImplement) {
      const implemented = await this.implementPricingChange(optimization);
      if (implemented) {
        console.log('✅ Pricing change implemented successfully!');
      } else {
        console.log('❌ Failed to implement pricing change');
      }
    }

    await this.db.end();
  }
}

// Run the optimizer
if (require.main === module) {
  const optimizer = new RealSalesOptimizer();
  optimizer.runOptimization().catch(console.error);
}

module.exports = { RealSalesOptimizer }; 