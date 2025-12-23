/*
  # Create User Settings Table

  1. New Tables
    - `user_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `primary_color` (text) - Hex color code for branding
      - `show_signature` (boolean) - Whether to show signature on cover
      - `signature_name` (text) - Name to display in signature
      - `end_page_title` (text) - Title for end page
      - `end_page_subtitle` (text) - Subtitle for end page
      - `end_page_cta` (text) - Call to action text
      - `end_page_contact` (text) - Contact information
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `user_settings` table
    - Add policy for users to read their own settings
    - Add policy for users to insert their own settings
    - Add policy for users to update their own settings

  3. Notes
    - Each user can have only one settings record
    - Default color is #FF6B35 (orange)
    - Settings are used across all carousels for that user
*/

CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  primary_color text DEFAULT '#FF6B35' NOT NULL,
  show_signature boolean DEFAULT false NOT NULL,
  signature_name text DEFAULT '',
  end_page_title text DEFAULT 'Thank You!' NOT NULL,
  end_page_subtitle text DEFAULT 'Stay connected for more insights' NOT NULL,
  end_page_cta text DEFAULT 'Follow for more content' NOT NULL,
  end_page_contact text DEFAULT '',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);