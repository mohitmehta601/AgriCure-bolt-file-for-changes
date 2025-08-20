/*
  # Create farms table

  1. New Tables
    - `farms`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `name` (text, farm/field name)
      - `size` (numeric, farm size)
      - `unit` (text, size unit - hectares/acres/bigha)
      - `crop_type` (text, type of crop)
      - `soil_type` (text, type of soil)
      - `location` (text, optional location info)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `farms` table
    - Add policies for authenticated users to manage their own farms
*/

CREATE TABLE IF NOT EXISTS farms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  size numeric NOT NULL CHECK (size > 0),
  unit text NOT NULL DEFAULT 'hectares' CHECK (unit IN ('hectares', 'acres', 'bigha')),
  crop_type text NOT NULL,
  soil_type text NOT NULL,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE farms ENABLE ROW LEVEL SECURITY;

-- Policies for farms table
CREATE POLICY "Users can read own farms"
  ON farms
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert own farms"
  ON farms
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update own farms"
  ON farms
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete own farms"
  ON farms
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT id FROM user_profiles WHERE id = auth.uid()));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER farms_updated_at
  BEFORE UPDATE ON farms
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();