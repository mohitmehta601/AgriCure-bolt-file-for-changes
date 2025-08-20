-- Migration to add location coordinates and soil data to farms table
-- Run this in your Supabase SQL editor

-- Add latitude and longitude columns for GPS coordinates
ALTER TABLE farms 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add soil_data column to store detailed soil information as JSON
ALTER TABLE farms 
ADD COLUMN IF NOT EXISTS soil_data JSONB;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_farms_location ON farms(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_farms_soil_data ON farms USING GIN(soil_data);

-- Add comments for documentation
COMMENT ON COLUMN farms.latitude IS 'GPS latitude coordinate for the farm location';
COMMENT ON COLUMN farms.longitude IS 'GPS longitude coordinate for the farm location';
COMMENT ON COLUMN farms.soil_data IS 'Detailed soil properties and analysis data from external APIs';

-- Update the RLS policies if needed (assuming they exist)
-- The existing policies should automatically apply to new columns
