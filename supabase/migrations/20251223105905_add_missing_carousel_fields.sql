/*
  # Add Missing Fields to Carousels

  1. Changes to `carousels` table
    - Add `content_length` column (short, medium, long, auto)
    - Add `sources` column for user-provided data and sources
    - Add `end_page_image` column to user_settings
  
  2. Notes
    - content_length determines how verbose the generated content should be
    - sources allows users to provide stats, data, and references for more credible carousels
    - end_page_image stores base64 or URL for profile image on end page
*/

-- Add content_length to carousels table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'carousels' AND column_name = 'content_length'
  ) THEN
    ALTER TABLE carousels ADD COLUMN content_length text DEFAULT 'auto' CHECK (content_length IN ('short', 'medium', 'long', 'auto'));
  END IF;
END $$;

-- Add sources to carousels table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'carousels' AND column_name = 'sources'
  ) THEN
    ALTER TABLE carousels ADD COLUMN sources text;
  END IF;
END $$;

-- Add end_page_image to user_settings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'end_page_image'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN end_page_image text;
  END IF;
END $$;