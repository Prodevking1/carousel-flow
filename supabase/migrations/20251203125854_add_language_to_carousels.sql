/*
  # Add Language Column to Carousels

  1. Changes to `carousels` table
    - Add `language` column with default value 'fr' (French)
    - Add check constraint to ensure only supported languages are used
    
  2. Notes
    - Default language is French (fr)
    - Supported languages: French (fr), English (en), Spanish (es), German (de)
    - This allows users to generate carousels in different languages
*/

-- Add language column to carousels table
ALTER TABLE carousels 
  ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'fr';

-- Add check constraint for supported languages
ALTER TABLE carousels 
  ADD CONSTRAINT carousels_language_check 
  CHECK (language = ANY (ARRAY['fr'::text, 'en'::text, 'es'::text, 'de'::text]));
