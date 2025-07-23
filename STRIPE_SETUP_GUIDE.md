# Stripe Setup Guide for WellnessAI

This guide will help you set up Stripe payments for your WellnessAI SaaS platform.

## Prerequisites

- Stripe account (sign up at https://stripe.com)
- Node.js and npm installed
- WellnessAI project set up

## Step 1: Get Your Stripe API Keys

1. **Log into your Stripe Dashboard**
   - Go to https://dashboard.stripe.com
   - Sign in to your account

2. **Navigate to API Keys**
   - Click on "Developers" in the left sidebar
   - Click on "API keys"

3. **Copy Your Keys**
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

   **Example:**
   - Publishable: `pk_test_your_publishable_key_here`
   - Secret: `sk_test_your_secret_key_here`

## Step 2: Set Up Webhooks

1. **Go to Webhooks**
   - In Stripe Dashboard, click "Developers" → "Webhooks"
   - Click "Add endpoint"

2. **Configure Endpoint**
   - **Endpoint URL**: `https://your-domain.com/api/stripe/webhook`
   - **Events to send**: Select these events:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

3. **Copy Webhook Secret**
   - After creating, click on the webhook
   - Click "Reveal" next to "Signing secret"
   - Copy the secret (starts with `whsec_`)

## Step 3: Create Products and Prices

1. **Create Products**
   - Go to "Products" in Stripe Dashboard
   - Click "Add product"
   - Create two products:
     - **Basic Plan** ($29/month)
     - **Premium Plan** ($99/month)

2. **Get Price IDs**
   - For each product, note the Price ID
   - Format: `price_xxxxxxxxxxxxx`

## Step 4: Update Environment Variables

Add these to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID=price_your_basic_price_id_here
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_your_premium_price_id_here
```

## Step 5: Test Your Setup

1. **Use Test Cards**
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Requires Auth: `4000 0025 0000 3155`

2. **Test the Flow**
   - Go to your pricing page
   - Click "Subscribe"
   - Use a test card
   - Verify webhook events in Stripe Dashboard

## Step 6: Go Live

When ready for production:

1. **Switch to Live Mode**
   - In Stripe Dashboard, toggle to "Live mode"
   - Get your live API keys
   - Update environment variables

2. **Update Webhook URL**
   - Change webhook URL to your production domain
   - Update the webhook secret

3. **Test with Real Cards**
   - Use real cards for final testing
   - Monitor webhook events

## Troubleshooting

### Common Issues

1. **Webhook Failures**
   - Check webhook URL is correct
   - Verify webhook secret matches
   - Check server logs for errors

2. **Payment Failures**
   - Verify API keys are correct
   - Check card details
   - Review Stripe Dashboard for errors

3. **Subscription Issues**
   - Verify price IDs are correct
   - Check webhook events
   - Review subscription status

### Support

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Support**: https://support.stripe.com
- **GitHub Issues**: Create an issue in this repository

## Security Notes

- **Never commit API keys to version control**
- **Use environment variables for all secrets**
- **Rotate keys regularly**
- **Monitor for suspicious activity**

## Next Steps

After setting up Stripe:

1. **Test the complete payment flow**
2. **Set up analytics and monitoring**
3. **Configure email notifications**
4. **Set up customer support tools** 