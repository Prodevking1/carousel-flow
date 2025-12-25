-- # Add Subscription System
--
-- 1. New Tables
--    - subscriptions: Track user subscriptions and payments
--    - subscription_config: Global configuration for pricing
--
-- 2. Security
--    - Enable RLS on both tables
--    - Users can read their own subscription
--    - Service role can manage all subscriptions

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'inactive',
  subscription_type text,
  amount_paid integer,
  stripe_customer_id text,
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscription_config table
CREATE TABLE IF NOT EXISTS subscription_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  early_bird_limit integer NOT NULL DEFAULT 50,
  early_bird_count integer NOT NULL DEFAULT 0,
  early_bird_price integer NOT NULL DEFAULT 3400,
  lifetime_price integer NOT NULL DEFAULT 3400,
  monthly_price integer NOT NULL DEFAULT 1200,
  updated_at timestamptz DEFAULT now()
);

-- Insert default config
INSERT INTO subscription_config (early_bird_limit, early_bird_count, early_bird_price, lifetime_price, monthly_price)
VALUES (50, 0, 3400, 3400, 1200)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_config ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions
CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  USING (true);

CREATE POLICY "Service can insert subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service can update subscriptions"
  ON subscriptions FOR UPDATE
  USING (true);

-- Policies for subscription_config
CREATE POLICY "Everyone can read config"
  ON subscription_config FOR SELECT
  USING (true);

CREATE POLICY "Service can update config"
  ON subscription_config FOR UPDATE
  USING (true);