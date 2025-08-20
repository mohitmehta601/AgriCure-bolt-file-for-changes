/*
  # User Authentication and Fertilizer Recommendations System

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `email` (text, unique)
      - `farm_location` (text)
      - `phone_number` (text, optional)
      - `farm_size` (numeric, optional)
      - `farm_size_unit` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `fertilizer_recommendations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `field_name` (text)
      - `field_size` (numeric)
      - `field_size_unit` (text)
      - `crop_type` (text)
      - `soil_type` (text)
      - `soil_ph` (numeric)
      - `nitrogen` (numeric)
      - `phosphorus` (numeric)
      - `potassium` (numeric)
      - `temperature` (numeric)
      - `humidity` (numeric)
      - `soil_moisture` (numeric)
      - `primary_fertilizer` (text)
      - `secondary_fertilizer` (text)
      - `ml_prediction` (text)
      - `confidence_score` (numeric)
      - `cost_estimate` (text)
      - `status` (text) -- 'pending', 'applied', 'scheduled'
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  farm_location text,
  phone_number text,
  farm_size numeric,
  farm_size_unit text DEFAULT 'hectares',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fertilizer_recommendations table
CREATE TABLE IF NOT EXISTS fertilizer_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  field_name text NOT NULL,
  field_size numeric NOT NULL,
  field_size_unit text NOT NULL DEFAULT 'hectares',
  crop_type text NOT NULL,
  soil_type text NOT NULL,
  soil_ph numeric NOT NULL,
  nitrogen numeric NOT NULL,
  phosphorus numeric NOT NULL,
  potassium numeric NOT NULL,
  temperature numeric NOT NULL,
  humidity numeric NOT NULL,
  soil_moisture numeric NOT NULL,
  primary_fertilizer text NOT NULL,
  secondary_fertilizer text,
  ml_prediction text NOT NULL,
  confidence_score numeric NOT NULL,
  cost_estimate text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'scheduled')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fertilizer_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for fertilizer_recommendations
CREATE POLICY "Users can read own recommendations"
  ON fertilizer_recommendations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own recommendations"
  ON fertilizer_recommendations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own recommendations"
  ON fertilizer_recommendations
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own recommendations"
  ON fertilizer_recommendations
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at on user_profiles
CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();