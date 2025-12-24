/*
  # Add Design Preferences to User Settings

  1. Changes
    - Add `cover_alignment` column (text, default 'centered')
      Controls whether cover page content is centered or aligned to start
    - Add `signature_position` column (text, default 'bottom-right')
      Controls signature position on cover page (bottom-right or bottom-left)
    - Add `content_style` column (text, default 'split')
      Controls content slide style: 'split' (title on one slide, content on another) or 'combined' (title + content together)
    - Add `show_slide_numbers` column (boolean, default true)
      Controls whether to show slide numbers on title-only slides in split mode
    - Add `content_alignment` column (text, default 'centered')
      Controls content alignment when using combined style

  2. Notes
    - All columns have sensible defaults for existing users
    - Cover alignment: 'centered' (default) or 'start'
    - Signature position: 'bottom-right' (default) or 'bottom-left'
    - Content style: 'split' (default) or 'combined'
    - Content alignment: 'centered' (default) or 'start'
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'cover_alignment'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN cover_alignment text DEFAULT 'centered' CHECK (cover_alignment IN ('centered', 'start'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'signature_position'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN signature_position text DEFAULT 'bottom-right' CHECK (signature_position IN ('bottom-right', 'bottom-left'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'content_style'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN content_style text DEFAULT 'split' CHECK (content_style IN ('split', 'combined'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'show_slide_numbers'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN show_slide_numbers boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'content_alignment'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN content_alignment text DEFAULT 'centered' CHECK (content_alignment IN ('centered', 'start'));
  END IF;
END $$;