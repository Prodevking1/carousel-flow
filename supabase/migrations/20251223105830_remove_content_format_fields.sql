/*
  # Remove Content Format Fields

  1. Changes to `carousels` table
    - Remove `content_format` column

  2. Changes to `slides` table
    - Remove `content` column

  3. Notes
    - Reverting previous content format feature
    - Only bullets format will be supported
*/

-- Remove content_format from carousels table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'carousels' AND column_name = 'content_format'
  ) THEN
    ALTER TABLE carousels DROP COLUMN content_format;
  END IF;
END $$;

-- Remove content field from slides table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'slides' AND column_name = 'content'
  ) THEN
    ALTER TABLE slides DROP COLUMN content;
  END IF;
END $$;