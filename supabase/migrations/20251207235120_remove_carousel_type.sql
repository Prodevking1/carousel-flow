/*
  # Remove Carousel Type Column

  1. Changes
    - Remove `type` column from `carousels` table
  
  2. Notes
    - Simplifying the carousel generation to use a single unified approach
    - No longer distinguishing between breakdown, case_study, tips, or strategy types
*/

-- Remove type column from carousels table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'carousels' AND column_name = 'type'
  ) THEN
    ALTER TABLE carousels DROP COLUMN type;
  END IF;
END $$;
