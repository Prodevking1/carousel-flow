/*
  # Remove design_template field

  1. Changes
    - Remove `design_template` column from `user_settings` table as template selection feature has been removed
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'design_template'
  ) THEN
    ALTER TABLE user_settings DROP COLUMN design_template;
  END IF;
END $$;
