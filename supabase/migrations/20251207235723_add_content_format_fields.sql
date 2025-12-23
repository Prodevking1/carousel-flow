/*
  # Add Content Format Fields

  1. Changes to `carousels` table
    - Add `content_format` column (bullets or paragraph)

  2. Changes to `slides` table
    - Add `content` column for paragraph-style content

  3. Notes
    - Re-adding content format feature that was previously removed
    - Supports both bullet-point and paragraph formats
    - Default format is 'paragraph'
*/

-- Add content_format to carousels table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'carousels' AND column_name = 'content_format'
  ) THEN
    ALTER TABLE carousels ADD COLUMN content_format text DEFAULT 'paragraph';
  END IF;
END $$;

-- Add content field to slides table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'slides' AND column_name = 'content'
  ) THEN
    ALTER TABLE slides ADD COLUMN content text;
  END IF;
END $$;
