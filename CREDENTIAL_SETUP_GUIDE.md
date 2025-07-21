# 🔐 Production Credential Setup Guide

## 🎯 Overview

This guide will help you set up real credentials for your WellnessAI production deployment. The AI Engineer Agent has successfully configured all the infrastructure - now you just need to add your actual API keys and tokens.

## 📋 Prerequisites

- GitHub account with repository access
- Vercel account (free tier works)
- Supabase account (free tier works)
- Stripe account (for payments)

## 🔑 Required Credentials

### 1. GitHub Personal Access Token

**Purpose**: Deploy to GitHub Pages and manage workflows

**Steps to create**:
1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name like "WellnessAI Deployment"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
   - ✅ `admin:org` (Full control of organizations and teams)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

**Add to `.env.local`**:
```bash
GITHUB_TOKEN=ghp_your_actual_token_here
GITHUB_USERNAME=your_github_username
```

### 2. Vercel API Token

**Purpose**: Deploy to Vercel production

**Steps to create**:
1. Go to [Vercel Dashboard > Settings > Tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name like "WellnessAI Production"
4. Select scopes:
   - ✅ `Deployments` (Read and write deployments)
   - ✅ `Projects` (Read and write projects)
   - ✅ `Teams` (Read team information)
5. Click "Create"
6. **Copy the token immediately**

**Add to `.env.local`**:
```bash
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_org_id_here
VERCEL_PROJECT_ID=your_project_id_here
```

**To find your Org ID and Project ID**:
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > General
4. Copy the "Project ID"
5. For Org ID, check the URL or go to Settings > General

### 3. Supabase Credentials

**Purpose**: Database and authentication

**Steps to get**:
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create one)
3. Go to Settings > API
4. Copy:
   - **Project URL** (looks like: `https://xyz.supabase.co`)
   - **Anon Key** (starts with `eyJ...`)
   - **Service Role Key** (starts with `eyJ...`)

**Add to `.env.local`**:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Stripe API Keys

**Purpose**: Payment processing

**Steps to get**:
1. Go to [Stripe Dashboard > Developers > API keys](https://dashboard.stripe.com/apikeys)
2. Copy:
   - **Publishable key** (starts with `pk_...`)
   - **Secret key** (starts with `sk_...`)

**Add to `.env.local`**:
```bash
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
```

### 5. Stripe Webhook Secret

**Purpose**: Verify webhook authenticity

**Steps to create**:
1. Go to [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set endpoint URL: `https://wellness-agent-saas-ybpb.vercel.app/api/stripe/webhook`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_...`)

**Add to `.env.local`**:
```bash
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 📝 Complete .env.local Example

```bash
# GitHub Configuration
GITHUB_TOKEN=ghp_your_github_token_here
GITHUB_USERNAME=your_github_username

# Vercel Configuration
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_org_id_here
VERCEL_PROJECT_ID=your_project_id_here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Next.js Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## 🔒 Security Best Practices

### ✅ Do's
- ✅ Use environment variables for all secrets
- ✅ Use test keys for development
- ✅ Rotate tokens regularly
- ✅ Use least-privilege access
- ✅ Monitor token usage

### ❌ Don'ts
- ❌ Never commit secrets to git
- ❌ Don't share tokens publicly
- ❌ Don't use production keys in development
- ❌ Don't hardcode secrets in code

## 🚀 Running Production Deployment

Once you've added all credentials:

```bash
# Test credentials
node scripts/real-oauth-implementer.js

# Run production deployment
node scripts/production-deployment-agent.js
```

## 🔍 Verification Steps

After deployment, verify everything works:

1. **GitHub Pages**: Check if your site is live
2. **Vercel**: Verify production deployment
3. **Supabase**: Test database connections
4. **Stripe**: Test payment flow

## 🆘 Troubleshooting

### Common Issues

**GitHub Token Issues**:
- Ensure token has correct scopes
- Check if token is expired
- Verify repository access

**Vercel Issues**:
- Check if project exists
- Verify team permissions
- Ensure correct project ID

**Supabase Issues**:
- Check if project is active
- Verify API keys are correct
- Ensure RLS policies are set

**Stripe Issues**:
- Use test keys for development
- Check webhook endpoint URL
- Verify event types are selected

### Getting Help

If you encounter issues:
1. Check the deployment logs in `docs/autonomous-learning/`
2. Review the error messages carefully
3. Verify all credentials are correct
4. Test individual services first

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ All services show "✅ Valid" in credential check
- ✅ Production deployment completes successfully
- ✅ Your app is accessible at the deployed URL
- ✅ Payments and database operations work

---

**Next Step**: Run `node scripts/production-deployment-agent.js` to deploy to production! 🚀 