-- Create function to increment early bird count atomically
CREATE OR REPLACE FUNCTION increment_early_bird_count()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE subscription_config
  SET early_bird_count = early_bird_count + 1,
      updated_at = now()
  WHERE early_bird_count < early_bird_limit;
END;
$$;