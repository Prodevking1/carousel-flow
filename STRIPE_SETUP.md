# Stripe Integration Setup

This application now includes a payment system for lifetime access. Here's how to configure it:

## Pricing Structure

- **Early Bird Special**: $24 lifetime (first 50 customers)
- **After Early Birds**: $12/month subscription

## Setup Instructions

### 1. Create a Stripe Account

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Complete the registration process
3. Verify your email address

### 2. Get Your API Keys

1. Go to [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Copy your **Secret Key** (starts with `sk_`)
3. You'll need to add this to your Supabase Edge Functions

### 3. Configure Supabase Secrets

You need to add your Stripe keys as secrets in Supabase:

```bash
# Set Stripe Secret Key
supabase secrets set STRIPE_SECRET_KEY=sk_your_secret_key_here

# Set Stripe Webhook Secret (you'll get this after setting up the webhook)
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 4. Set Up Stripe Webhook

1. Go to [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://your-project-ref.supabase.co/functions/v1/stripe-webhook`
4. Select events to listen for:
   - `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to Supabase secrets (see step 3)

## Edge Functions Deployed

Two Edge Functions have been deployed:

1. **create-checkout-session**: Creates a Stripe Checkout session
   - URL: `/functions/v1/create-checkout-session`
   - Method: POST
   - Body: `{ userId: string }`

2. **stripe-webhook**: Handles Stripe webhook events
   - URL: `/functions/v1/stripe-webhook`
   - Method: POST
   - Receives Stripe events

## Database Schema

The following tables were created:

- **subscriptions**: Tracks user subscriptions
  - `user_id`: Anonymous user ID
  - `status`: 'active' or 'inactive'
  - `subscription_type`: 'lifetime_early', 'lifetime', or 'monthly'
  - `amount_paid`: Amount in cents
  - `stripe_customer_id`: Stripe customer ID
  - `stripe_payment_intent_id`: Payment intent ID

- **subscription_config**: Global configuration
  - `early_bird_limit`: Number of early bird spots (50)
  - `early_bird_count`: Current count
  - `early_bird_price`: Price in cents (2400 = $24)
  - `lifetime_price`: Regular lifetime price (2400 = $24)
  - `monthly_price`: Monthly price (1200 = $12)

## How It Works

1. User creates a carousel and tries to export
2. System checks if user has active subscription
3. If not, displays payment modal with current pricing
4. User clicks "Get Lifetime Access"
5. Redirected to Stripe Checkout
6. After successful payment, webhook updates subscription status
7. User can now export unlimited carousels

## Testing

Use Stripe test mode for development:

Test card number: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC
- Any postal code

## Support

For issues with Stripe integration, check:
1. Supabase logs for Edge Functions
2. Stripe Dashboard > Developers > Logs
3. Webhook delivery status in Stripe Dashboard
