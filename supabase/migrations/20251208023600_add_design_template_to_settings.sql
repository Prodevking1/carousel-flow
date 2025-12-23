/*
  # Add Design Template to User Settings

  1. Changes
    - Add `design_template` column to `user_settings` table
    - Default value is 'gradient' (modern gradient style)
    - Three available templates: gradient, minimal, bold
  
  2. Notes
    - Existing settings will get 'gradient' as default
    - Users can choose between 3 professional carousel designs
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'design_template'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN design_template text DEFAULT 'gradient' NOT NULL;
  END IF;
END $$;