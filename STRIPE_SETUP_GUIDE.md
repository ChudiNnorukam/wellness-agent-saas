# Stripe Setup Guide

## Quick Setup Steps

### 1. Get Your Vercel Domain
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your `wellness-agent-saas` project
3. Copy your domain (e.g., `https://wellness-agent-saas.vercel.app`)

### 2. Create Stripe Test Products
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Toggle to "Test mode"** (top right)
3. Go to **Products → Add product**

**Create Basic Plan:**
- Name: `WellnessAI Basic`
- Price: `$9.99/month`
- Billing: `Recurring`

**Create Premium Plan:**
- Name: `WellnessAI Premium`
- Price: `$19.99/month`
- Billing: `Recurring`

### 3. Get Price IDs
1. Click on each product you created
2. Copy the **Price ID** (starts with `price_`)
3. You'll need both Basic and Premium Price IDs

### 4. Run the Setup Script
```bash
node scripts/setup-stripe.js
```

The script will:
- Ask for your Vercel domain
- Ask for your Price IDs
- Create `.env.local` with all configuration
- Show you the webhook URL to configure
- Give you next steps

### 5. Configure Webhook
1. Go to **Developers → Webhooks** in Stripe
2. Click **"Add endpoint"**
3. Enter the webhook URL shown by the script
4. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 6. Update Vercel Environment Variables
1. Go to your Vercel project → **Settings → Environment Variables**
2. Add all variables from `.env.local`

### 7. Test the Integration
Use these test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Auth**: `4000 0025 0000 3155`

## Current Configuration

✅ **Test Keys Ready:**
- Publishable: `pk_test_51RmqxZ2ct93Utp7LHw6KDG9BRFFwr7IXeFqSSfcFLEoWV2pXv3tGfLWHSUTOpnkUXGdbHddjHy1tkMZHagMIFBDX00XB7aVWfl`
- Secret: `[REDACTED - Use your own test secret key]`
- Webhook Secret: `[REDACTED - Use your own webhook secret]`

🔄 **Still Needed:**
- Vercel domain
- Basic plan Price ID
- Premium plan Price ID

## Need Help?

If you get stuck, just run the setup script and it will guide you through each step! 