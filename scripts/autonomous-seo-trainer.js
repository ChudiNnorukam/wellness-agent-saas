#!/usr/bin/env node

/**
 * Autonomous SEO Trainer for WellnessAI
 * Based on industry best practices and Chudi Nnorukam's brand guidelines
 */

const fs = require('fs');
const path = require('path');

class AutonomousSEOTrainer {
  constructor() {
    this.seoFramework = this.loadSEOFramework();
    this.brandGuidelines = this.loadBrandGuidelines();
    this.optimizationHistory = [];
  }

  loadSEOFramework() {
    try {
      const frameworkPath = path.join(__dirname, '../docs/seo-training-framework.md');
      return fs.readFileSync(frameworkPath, 'utf8');
    } catch (error) {
      console.error('Error loading SEO framework:', error);
      return '';
    }
  }

  loadBrandGuidelines() {
    try {
      const guidelinesPath = path.join(__dirname, '../docs/chudi-brand-guidelines.md');
      return fs.readFileSync(guidelinesPath, 'utf8');
    } catch (error) {
      console.error('Error loading brand guidelines:', error);
      return '';
    }
  }

  async analyzePageSEO(pagePath) {
    console.log(`🔍 Analyzing SEO for: ${pagePath}`);
    
    try {
      const content = fs.readFileSync(pagePath, 'utf8');
      
      const analysis = {
        page: pagePath,
        timestamp: new Date().toISOString(),
        seoScore: 0,
        issues: [],
        recommendations: [],
        brandAlignment: this.checkBrandAlignment(content)
      };

      // Check for SEO elements
      analysis.seoScore += this.checkTitleTag(content);
      analysis.seoScore += this.checkMetaDescription(content);
      analysis.seoScore += this.checkHeadings(content);
      analysis.seoScore += this.checkKeywords(content);
      analysis.seoScore += this.checkInternalLinks(content);
      analysis.seoScore += this.checkImageOptimization(content);

      // Generate recommendations
      analysis.recommendations = this.generateRecommendations(analysis);

      this.optimizationHistory.push(analysis);
      this.saveOptimizationHistory();

      return analysis;
    } catch (error) {
      console.error(`Error analyzing ${pagePath}:`, error);
      return null;
    }
  }

  checkBrandAlignment(content) {
    const issues = [];
    
    // Check for inauthentic content
    const problematicPatterns = [
      /team of experts/gi,
      /our team/gi,
      /we are a company/gi,
      /our organization/gi,
      /founded by/gi,
      /established in \d{4}/gi
    ];

    problematicPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        issues.push(`Found potentially inauthentic content: ${pattern.source}`);
      }
    });

    // Check for Chudi-specific branding
    const chudiPatterns = [
      /Chudi Nnorukam/gi,
      /personalized wellness/gi,
      /AI-powered/gi,
      /micro SaaS/gi
    ];

    const brandScore = chudiPatterns.filter(pattern => pattern.test(content)).length;
    
    return {
      score: brandScore,
      issues: issues,
      authentic: issues.length === 0
    };
  }

  checkTitleTag(content) {
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    if (!titleMatch) {
      return 0;
    }
    
    const title = titleMatch[1];
    let score = 0;
    
    // Check length (50-60 characters optimal)
    if (title.length >= 50 && title.length <= 60) score += 20;
    else if (title.length >= 30 && title.length <= 70) score += 10;
    
    // Check for primary keywords
    const keywords = ['wellness', 'AI', 'personalized', 'plan'];
    const keywordCount = keywords.filter(keyword => 
      title.toLowerCase().includes(keyword)
    ).length;
    score += keywordCount * 10;
    
    return score;
  }

  checkMetaDescription(content) {
    const metaMatch = content.match(/<meta name="description" content="(.*?)"/i);
    if (!metaMatch) {
      return 0;
    }
    
    const description = metaMatch[1];
    let score = 0;
    
    // Check length (150-160 characters optimal)
    if (description.length >= 150 && description.length <= 160) score += 20;
    else if (description.length >= 120 && description.length <= 180) score += 10;
    
    // Check for call-to-action
    if (description.includes('Get') || description.includes('Try') || description.includes('Start')) {
      score += 10;
    }
    
    return score;
  }

  checkHeadings(content) {
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/gi);
    const h2Matches = content.match(/<h2[^>]*>(.*?)<\/h2>/gi);
    
    let score = 0;
    
    // Check for single H1
    if (h1Match && h1Match.length === 1) score += 15;
    
    // Check for H2 structure
    if (h2Matches && h2Matches.length >= 2) score += 10;
    
    return score;
  }

  checkKeywords(content) {
    const primaryKeywords = ['wellness', 'AI', 'personalized', 'plan'];
    const keywordCount = primaryKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    ).length;
    
    return keywordCount * 5;
  }

  checkInternalLinks(content) {
    const internalLinks = content.match(/href="\/(?!http)[^"]*"/gi);
    return internalLinks ? Math.min(internalLinks.length * 5, 20) : 0;
  }

  checkImageOptimization(content) {
    const images = content.match(/<img[^>]*>/gi);
    if (!images) return 0;
    
    let optimizedCount = 0;
    images.forEach(img => {
      if (img.includes('alt=') && img.includes('loading=')) {
        optimizedCount++;
      }
    });
    
    return (optimizedCount / images.length) * 15;
  }

  generateRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.seoScore < 50) {
      recommendations.push('🔴 Critical: Implement basic SEO elements (title, meta description, headings)');
    } else if (analysis.seoScore < 70) {
      recommendations.push('🟡 Moderate: Optimize existing SEO elements and add more keywords');
    } else {
      recommendations.push('🟢 Good: Focus on advanced optimizations and content quality');
    }
    
    if (!analysis.brandAlignment.authentic) {
      recommendations.push('⚠️ Brand: Remove inauthentic content and align with Chudi\'s solo founder story');
    }
    
    return recommendations;
  }

  saveOptimizationHistory() {
    const historyPath = path.join(__dirname, '../data/seo-optimization-history.json');
    const historyDir = path.dirname(historyPath);
    
    if (!fs.existsSync(historyDir)) {
      fs.mkdirSync(historyDir, { recursive: true });
    }
    
    fs.writeFileSync(historyPath, JSON.stringify(this.optimizationHistory, null, 2));
  }

  async trainOnAllPages() {
    console.log('🚀 Starting Autonomous SEO Training...\n');
    
    const pages = [
      'src/app/page.tsx',
      'src/app/features/page.tsx',
      'src/app/pricing/page.tsx',
      'src/app/about/page.tsx',
      'src/app/contact/page.tsx',
      'src/app/login/page.tsx',
      'src/app/generate/page.tsx',
      'src/app/dashboard/page.tsx'
    ];
    
    const results = [];
    
    for (const page of pages) {
      const pagePath = path.join(__dirname, '..', page);
      if (fs.existsSync(pagePath)) {
        const analysis = await this.analyzePageSEO(pagePath);
        if (analysis) {
          results.push(analysis);
        }
      }
    }
    
    this.generateTrainingReport(results);
  }

  generateTrainingReport(results) {
    console.log('\n📊 SEO Training Report');
    console.log('=====================\n');
    
    const totalScore = results.reduce((sum, result) => sum + result.seoScore, 0);
    const averageScore = totalScore / results.length;
    
    console.log(`Overall SEO Score: ${averageScore.toFixed(1)}/100`);
    console.log(`Pages Analyzed: ${results.length}\n`);
    
    results.forEach(result => {
      console.log(`${result.page}:`);
      console.log(`  Score: ${result.seoScore}/100`);
      console.log(`  Brand Alignment: ${result.brandAlignment.authentic ? '✅' : '❌'}`);
      
      if (result.recommendations.length > 0) {
        console.log('  Recommendations:');
        result.recommendations.forEach(rec => console.log(`    ${rec}`));
      }
      console.log('');
    });
    
    console.log('🎯 Next Steps:');
    console.log('1. Implement SEO recommendations');
    console.log('2. Align content with Chudi\'s authentic brand');
    console.log('3. Monitor performance and iterate');
    console.log('4. Run training again after improvements');
  }
}

// Run autonomous training
if (require.main === module) {
  const trainer = new AutonomousSEOTrainer();
  trainer.trainOnAllPages().catch(console.error);
}

module.exports = AutonomousSEOTrainer;