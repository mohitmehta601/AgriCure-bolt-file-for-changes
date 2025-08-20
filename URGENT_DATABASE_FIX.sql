-- URGENT: Run this SQL in your Supabase Dashboard SQL Editor
-- This will fix the "latitude column not found" error

ALTER TABLE farms 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS soil_data JSONB;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_farms_location ON farms(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_farms_soil_data ON farms USING GIN(soil_data);

-- Add comments for documentation
COMMENT ON COLUMN farms.latitude IS 'GPS latitude coordinate for the farm location';
COMMENT ON COLUMN farms.longitude IS 'GPS longitude coordinate for the farm location';
COMMENT ON COLUMN farms.soil_data IS 'Detailed soil properties and analysis data from external APIs';

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'farms' 
AND column_name IN ('latitude', 'longitude', 'soil_data');
