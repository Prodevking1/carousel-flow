/*
  # Add Premium Banner Setting
  
  1. Changes
    - Add `show_premium_banner` column to `user_settings` table
      - Boolean field that controls whether the premium offer banner is displayed
      - Defaults to `true` to show the banner by default
  
  2. Notes
    - Users can dismiss the banner (sets to false)
    - Users can re-enable it from settings
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'show_premium_banner'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN show_premium_banner boolean DEFAULT true;
  END IF;
END $$;