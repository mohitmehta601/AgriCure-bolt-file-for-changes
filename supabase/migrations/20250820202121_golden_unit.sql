/*
  # Create products table for signup validation

  1. New Tables
    - `products`
      - `id` (text, primary key) - The product ID
      - `name` (text) - Product name/description
      - `is_active` (boolean) - Whether the product is active
      - `created_at` (timestamp) - When the product was created

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access (needed for signup validation)

  3. Data
    - Insert the 10 valid product IDs
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL DEFAULT 'AgriCure Device',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access for signup validation
CREATE POLICY "Allow public read access for signup validation"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Insert the 10 valid product IDs
INSERT INTO products (id, name) VALUES
  ('8972345610', 'AgriCure Device - Model A'),
  ('1029384756', 'AgriCure Device - Model B'),
  ('5647382910', 'AgriCure Device - Model C'),
  ('9081726354', 'AgriCure Device - Model D'),
  ('6758493021', 'AgriCure Device - Model E'),
  ('3141592653', 'AgriCure Device - Model F'),
  ('7263549810', 'AgriCure Device - Model G'),
  ('8391027465', 'AgriCure Device - Model H'),
  ('4516273980', 'AgriCure Device - Model I'),
  ('1234567890', 'AgriCure Device - Model J')
ON CONFLICT (id) DO NOTHING;