/*
  # Add public templates and admin features

  1. New Tables
    - `public_templates`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `data` (jsonb)
      - `is_active` (boolean) - Controls if template is available to guests
      - `created_by` (uuid) - Admin who created the template

  2. Security
    - Enable RLS
    - Add policies for admins to manage public templates
    - Add policies for guests to view active public templates
*/

-- Create public_templates table
CREATE TABLE IF NOT EXISTS public_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  data jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public_templates ENABLE ROW LEVEL SECURITY;

-- Create admin role
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = user_id
    AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for public_templates
CREATE POLICY "Admins can manage public templates"
  ON public_templates
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Everyone can view active public templates"
  ON public_templates
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Add company_logo to templates and drafts
ALTER TABLE templates
ADD COLUMN IF NOT EXISTS company_logo text;

ALTER TABLE drafts
ADD COLUMN IF NOT EXISTS company_logo text;

ALTER TABLE public_templates
ADD COLUMN IF NOT EXISTS company_logo text;