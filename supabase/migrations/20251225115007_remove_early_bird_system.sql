/*
  # Remove Early Bird System

  1. Changes to `subscription_config` table
    - Remove `early_bird_count` column
    - Remove `early_bird_limit` column
    - Remove `early_bird_price` column
    - Remove `monthly_price` column
    - Keep only `lifetime_price` column

  2. Functions
    - Drop `increment_early_bird_count` function

  3. Security
    - No RLS changes needed
*/

-- Drop the increment function
DROP FUNCTION IF EXISTS increment_early_bird_count();

-- Remove Early Bird columns from subscription_config
ALTER TABLE subscription_config
DROP COLUMN IF EXISTS early_bird_count,
DROP COLUMN IF EXISTS early_bird_limit,
DROP COLUMN IF EXISTS early_bird_price,
DROP COLUMN IF EXISTS monthly_price;