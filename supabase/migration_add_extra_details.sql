-- Migration: Add extra_details JSONB field to properties table
-- Description: Supports flexible, dynamic property-specific details without bloated schemas

-- Add extra_details column
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS extra_details JSONB DEFAULT '{}'::jsonb;

-- Optional: Create a GIN index if you plan to search within the JSONB field deeply
-- CREATE INDEX IF NOT EXISTS properties_extra_details_idx ON properties USING gin (extra_details);

-- Update schema definitions in the codebase to expect extra_details as a JSON object.
