/*
  # Add Content Format Support

  1. Changes to `carousels` table
    - Add `content_format` column to specify bullets or paragraph format
    - Default to 'paragraph' format

  2. Changes to `slides` table
    - Add `content` column for paragraph-style text content
    - This complements the existing `bullets` array

  3. Notes
    - FORMAT A (bullets): Uses existing `bullets` array field
    - FORMAT B (paragraph): Uses new `content` text field
    - Both formats can coexist, slides will use one or the other based on format
*/

-- Add content_format to carousels table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'carousels' AND column_name = 'content_format'
  ) THEN
    ALTER TABLE carousels ADD COLUMN content_format text DEFAULT 'paragraph' CHECK (content_format IN ('bullets', 'paragraph'));
  END IF;
END $$;

-- Add content field to slides table for paragraph format
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'slides' AND column_name = 'content'
  ) THEN
    ALTER TABLE slides ADD COLUMN content text;
  END IF;
END $$;