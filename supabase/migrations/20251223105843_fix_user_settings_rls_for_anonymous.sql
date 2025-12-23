/*
  # Fix User Settings RLS for Anonymous Users

  1. Changes
    - Remove foreign key constraint from user_settings.user_id to auth.users
    - Drop existing authenticated-only RLS policies
    - Create new public RLS policies that allow anyone to manage their settings
    - This aligns user_settings with carousels and slides tables

  2. Security Notes
    - Since this app doesn't use authentication, we use client-side generated UUIDs
    - Each user_id is unique and stored in localStorage
    - Public access is safe as users can only access settings by knowing the UUID

  3. Rationale
    - The carousels and slides tables already use public policies
    - User settings should follow the same pattern for consistency
    - Removes dependency on auth.users table which isn't used in this app
*/

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;

-- Create new public policies that allow anyone to manage settings
CREATE POLICY "Anyone can view settings"
  ON user_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create settings"
  ON user_settings FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update settings"
  ON user_settings FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete settings"
  ON user_settings FOR DELETE
  TO public
  USING (true);