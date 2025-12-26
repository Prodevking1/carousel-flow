/*
  # Add User Authentication to Carousels

  1. Changes
    - Add `user_id` column to `carousels` table
    - Update RLS policies to restrict access to user's own data

  2. Security
    - Users can only view/edit/delete their own carousels
    - Users can only view/edit slides from their own carousels
    - All policies check authentication status
*/

-- Add user_id to carousels table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'carousels' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE carousels ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Drop existing RLS policies for carousels
DROP POLICY IF EXISTS "Anyone can view carousels" ON carousels;
DROP POLICY IF EXISTS "Anyone can create carousels" ON carousels;
DROP POLICY IF EXISTS "Anyone can update carousels" ON carousels;
DROP POLICY IF EXISTS "Anyone can delete carousels" ON carousels;

-- Create new RLS policies for authenticated users on carousels
CREATE POLICY "Users can view own carousels"
  ON carousels FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own carousels"
  ON carousels FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own carousels"
  ON carousels FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own carousels"
  ON carousels FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop existing RLS policies for slides
DROP POLICY IF EXISTS "Anyone can view slides" ON slides;
DROP POLICY IF EXISTS "Anyone can create slides" ON slides;
DROP POLICY IF EXISTS "Anyone can update slides" ON slides;
DROP POLICY IF EXISTS "Anyone can delete slides" ON slides;

-- Create new RLS policies for slides
CREATE POLICY "Users can view slides from own carousels"
  ON slides FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM carousels
      WHERE carousels.id = slides.carousel_id
      AND carousels.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create slides for own carousels"
  ON slides FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carousels
      WHERE carousels.id = slides.carousel_id
      AND carousels.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update slides from own carousels"
  ON slides FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM carousels
      WHERE carousels.id = slides.carousel_id
      AND carousels.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carousels
      WHERE carousels.id = slides.carousel_id
      AND carousels.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete slides from own carousels"
  ON slides FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM carousels
      WHERE carousels.id = slides.carousel_id
      AND carousels.user_id = auth.uid()
    )
  );
