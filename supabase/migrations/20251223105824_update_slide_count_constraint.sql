/*
  # Update Slide Count Constraint for Auto Mode

  1. Changes to `carousels` table
    - Remove the specific value check constraint (5, 8, 10, 12)
    - Add a range constraint to allow any value between 5 and 12
    
  2. Notes
    - This allows the "auto" mode to generate any optimal number of slides
    - Maintains reasonable limits (5-12 slides)
    - Previous constraint was too restrictive for AI-determined slide counts
*/

-- Drop the existing specific values constraint
ALTER TABLE carousels DROP CONSTRAINT IF EXISTS carousels_slide_count_check;

-- Add new range constraint allowing any number from 5 to 12
ALTER TABLE carousels ADD CONSTRAINT carousels_slide_count_check 
  CHECK (slide_count >= 5 AND slide_count <= 12);