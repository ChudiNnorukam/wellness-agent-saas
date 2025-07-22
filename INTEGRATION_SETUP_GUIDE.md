# 🚀 Complete Integration Setup Guide

## Overview

This guide will help you set up all integrations for your **WellnessAI - Healing Studio Portfolio & Micro SaaS App**. The system combines your wellness portfolio with a fully functional SaaS business.

## 🎯 What We're Setting Up

### Core Integrations
- **Supabase** - Authentication & Database
- **Stripe** - Payment Processing
- **Google Analytics** - Business Intelligence
- **Vercel** - Hosting & Deployment
- **AI Agents** - Autonomous Business Optimization

### Health Integrations (Planned)
- **Apple HealthKit** - Health data integration
- **Google Fit** - Fitness tracking
- **Fitbit** - Wearable device data

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
cd wellness-agent-saas
node scripts/setup-integrations.js
```

### Option 2: Manual Setup
Follow the sections below for step-by-step configuration.

## 🔐 Phase 1: Core Integrations

### 1. Supabase Setup

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `wellness-ai-saas`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users

#### Get API Keys
1. Go to **Settings → API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **Anon Public Key** (starts with `eyJ`)
   - **Service Role Key** (starts with `eyJ`)

#### Run Database Migrations
1. Go to **SQL Editor**
2. Copy and paste the content from `supabase/migrations/001_initial_schema.sql`
3. Click "Run" to execute

#### Enable Row Level Security
1. Go to **Authentication → Policies**
2. Enable RLS on all tables
3. Create policies for user data access

### 2. Stripe Setup

#### Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Sign up for a new account
3. Complete business verification

#### Create Products
1. Go to **Products → Add Product**
2. Create Basic Plan:
   - **Name**: `WellnessAI Basic`
   - **Price**: `$9.99/month`
   - **Billing**: `Recurring`
3. Create Premium Plan:
   - **Name**: `WellnessAI Premium`
   - **Price**: `$19.99/month`
   - **Billing**: `Recurring`

#### Get API Keys
1. Go to **Developers → API Keys**
2. Copy:
   - **Publishable Key** (starts with `pk_test_`)
   - **Secret Key** (starts with `sk_test_`)

#### Configure Webhooks
1. Go to **Developers → Webhooks**
2. Click "Add endpoint"
3. Enter URL: `https://your-domain.vercel.app/api/stripe/webhook`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook Secret** (starts with `whsec_`)

### 3. Google Analytics Setup

#### Create Google Analytics Account
1. Go to [analytics.google.com](https://analytics.google.com)
2. Click "Start measuring"
3. Create account and property

#### Get View ID
1. Go to **Admin → View Settings**
2. Copy the **View ID** (numbers only)

#### Create Service Account (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Analytics API
4. Create Service Account
5. Download JSON key file

### 4. Environment Configuration

Create `.env.local` file:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Google Analytics
GOOGLE_ANALYTICS_VIEW_ID=123456789
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
CURRENT_PRICING_TIER=basic
CURRENT_MONTHLY_PRICE=9.99

# Database Configuration (Optional for AI Agents)
DATABASE_URL=mysql://username:password@localhost:3306/wellness_saas
```

## 🚀 Phase 2: Deployment

### Vercel Deployment

#### Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### Set Environment Variables
1. Go to **Settings → Environment Variables**
2. Add all variables from your `.env.local` file
3. Set environment to **Production**

#### Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Test your application

## 🤖 Phase 3: AI Agents Setup

### Sales Optimization Agent
```bash
# Test the sales optimizer
node scripts/demo-sales-optimizer.js

# Run with real data (after setting up database)
node scripts/sales-optimizer.js
```

### Autonomous Agent System
```bash
# Start all agents
npm start

# Run specific agent
node scripts/orchestrator.js
```

## 📊 Phase 4: Analytics & Monitoring

### Business Metrics Tracking
The system automatically tracks:
- **Monthly Recurring Revenue (MRR)**
- **Customer Acquisition Cost (CAC)**
- **Customer Lifetime Value (CLV)**
- **Churn Rate**
- **Conversion Rate**
- **User Engagement**

### Performance Monitoring
- **Vercel Analytics** - Website performance
- **Winston Logging** - Application logs
- **Error Tracking** - Sentry integration (planned)

## 🧪 Testing Your Integrations

### 1. Test Authentication
```bash
npm run dev
# Visit http://localhost:3000
# Try signing up and logging in
```

### 2. Test Payments
Use Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Auth**: `4000 0025 0000 3155`

### 3. Test AI Agents
```bash
# Test sales optimization
node scripts/demo-sales-optimizer.js

# Test autonomous system
npm start
```

## 🔧 Troubleshooting

### Common Issues

#### Supabase Connection Error
- Check your API keys are correct
- Ensure RLS policies are configured
- Verify database migrations ran successfully

#### Stripe Webhook Errors
- Check webhook URL is correct
- Verify webhook secret matches
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

#### Vercel Deployment Issues
- Check environment variables are set
- Verify build logs for errors
- Ensure all dependencies are installed

### Getting Help
1. Check the logs in `logs/` directory
2. Review error messages in browser console
3. Check Vercel deployment logs
4. Verify all environment variables are set

## 📈 Next Steps

### Immediate Actions
1. ✅ Set up all integrations
2. ✅ Deploy to production
3. ✅ Test all functionality
4. ✅ Monitor performance

### Future Enhancements
1. **Health Data Integration**
   - Apple HealthKit
   - Google Fit
   - Fitbit API

2. **Advanced Analytics**
   - Sentry error tracking
   - Advanced Google Analytics
   - Custom dashboards

3. **AI Agent Enhancements**
   - More sophisticated optimization algorithms
   - Machine learning models
   - Predictive analytics

## 🎉 Success Checklist

- [ ] Supabase project created and configured
- [ ] Database migrations executed
- [ ] Stripe products and webhooks set up
- [ ] Google Analytics configured
- [ ] Environment variables set
- [ ] Application deployed to Vercel
- [ ] Authentication working
- [ ] Payments processing
- [ ] AI agents running
- [ ] Analytics tracking

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review the logs and error messages
3. Verify all configuration steps
4. Test each integration individually

Your WellnessAI system is now ready to optimize your healing studio business! 🚀✨ 