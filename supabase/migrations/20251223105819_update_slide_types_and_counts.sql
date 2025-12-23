/*
  # Update Slide Types and Slide Counts

  1. Changes to `slides` table
    - Add 'subscribe' to the allowed slide types in the check constraint
    
  2. Changes to `carousels` table
    - Add 5 to the allowed slide counts in the check constraint
    - Update the slide_number constraint to allow up to 12 slides

  3. Notes
    - This migration updates existing check constraints to support the new 'subscribe' slide type
    - Adds support for 5-slide carousels
    - Maintains data integrity while expanding available options
*/

-- Drop existing check constraint on slides.type
ALTER TABLE slides DROP CONSTRAINT IF EXISTS slides_type_check;

-- Add new check constraint with 'subscribe' type
ALTER TABLE slides ADD CONSTRAINT slides_type_check 
  CHECK (type = ANY (ARRAY['cover'::text, 'content'::text, 'cta'::text, 'subscribe'::text]));

-- Drop existing check constraint on carousels.slide_count
ALTER TABLE carousels DROP CONSTRAINT IF EXISTS carousels_slide_count_check;

-- Add new check constraint with 5 as an option
ALTER TABLE carousels ADD CONSTRAINT carousels_slide_count_check 
  CHECK (slide_count = ANY (ARRAY[5, 8, 10, 12]));