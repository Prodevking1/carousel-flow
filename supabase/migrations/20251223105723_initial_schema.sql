/*
  # Initial Schema - CarouselAI Database

  1. New Tables
    - `carousels`
      - `id` (uuid, primary key)
      - `title` (text) - Main carousel title
      - `subject` (text) - Topic/subject of the carousel
      - `status` (text) - draft, exported
      - `slide_count` (integer) - Number of slides in carousel
      - `hashtags` (text array) - Suggested hashtags
      - `pdf_url` (text, optional) - URL to exported PDF
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `slides`
      - `id` (uuid, primary key)
      - `carousel_id` (uuid, foreign key)
      - `slide_number` (integer) - Position in carousel
      - `type` (text) - cover, content, cta
      - `title` (text) - Slide title
      - `subtitle` (text, optional) - Subtitle for cover slides
      - `bullets` (text array, optional) - Bullet points
      - `stats` (text, optional) - Stats or highlights
      - `is_edited` (boolean) - Whether user manually edited
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (no auth required)
    
  3. Notes
    - This is a public app without authentication
    - Users identified by client-side UUID stored in localStorage
    - RLS policies allow public access for simplicity
*/

CREATE TABLE IF NOT EXISTS carousels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text NOT NULL,
  status text DEFAULT 'draft' NOT NULL CHECK (status IN ('draft', 'exported')),
  slide_count integer NOT NULL CHECK (slide_count >= 3 AND slide_count <= 20),
  hashtags text[] DEFAULT ARRAY[]::text[],
  pdf_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  carousel_id uuid REFERENCES carousels(id) ON DELETE CASCADE NOT NULL,
  slide_number integer NOT NULL,
  type text NOT NULL CHECK (type IN ('cover', 'content', 'cta')),
  title text NOT NULL,
  subtitle text,
  bullets text[],
  stats text,
  is_edited boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(carousel_id, slide_number)
);

ALTER TABLE carousels ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view carousels"
  ON carousels FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create carousels"
  ON carousels FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update carousels"
  ON carousels FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete carousels"
  ON carousels FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Anyone can view slides"
  ON slides FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create slides"
  ON slides FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update slides"
  ON slides FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete slides"
  ON slides FOR DELETE
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_slides_carousel_id ON slides(carousel_id);
CREATE INDEX IF NOT EXISTS idx_slides_slide_number ON slides(carousel_id, slide_number);
CREATE INDEX IF NOT EXISTS idx_carousels_created_at ON carousels(created_at DESC);