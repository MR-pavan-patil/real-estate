-- ============================================
-- Estate Reserve — Database Schema
-- Supabase SQL Migration
-- ============================================
-- Run this SQL in the Supabase SQL Editor to
-- create all tables, policies, and initial data.
-- ============================================

-- ============================================
-- 1. Enable Required Extensions
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. ADMINS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  auth_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Admins can read their own record
CREATE POLICY "admins_select_own" ON admins
  FOR SELECT USING (auth.uid() = auth_id);

-- Function to securely check if current user is super_admin without triggering RLS recursion
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE auth_id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Super admins can read all admin records
CREATE POLICY "admins_select_all" ON admins
  FOR SELECT USING (is_super_admin());

-- Super admins can manage admin records
CREATE POLICY "admins_manage" ON admins
  FOR ALL USING (is_super_admin());

-- ============================================
-- 3. PROPERTIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price BIGINT NOT NULL DEFAULT 0,
  location TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  area_sqft INTEGER NOT NULL DEFAULT 0,
  property_type TEXT NOT NULL DEFAULT 'plot' CHECK (property_type IN ('plot', 'house', 'apartment', 'villa', 'commercial', 'farmland')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'upcoming', 'reserved')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  map_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for common queries
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_featured ON properties(featured);
CREATE INDEX idx_properties_created ON properties(created_at DESC);

-- RLS Policies for properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Anyone can view properties (public listing)
CREATE POLICY "properties_public_select" ON properties
  FOR SELECT USING (true);

-- Only admins can insert/update/delete properties
CREATE POLICY "properties_admin_insert" ON properties
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "properties_admin_update" ON properties
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admins WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "properties_admin_delete" ON properties
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admins WHERE auth_id = auth.uid()
    )
  );

-- ============================================
-- 4. PROPERTY_IMAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS property_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_property_images_property ON property_images(property_id);

-- RLS Policies for property_images
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view property images
CREATE POLICY "property_images_public_select" ON property_images
  FOR SELECT USING (true);

-- Only admins can manage images
CREATE POLICY "property_images_admin_insert" ON property_images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "property_images_admin_update" ON property_images
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admins WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "property_images_admin_delete" ON property_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admins WHERE auth_id = auth.uid()
    )
  );

-- ============================================
-- 5. INQUIRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_property ON inquiries(property_id);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);

-- RLS Policies for inquiries
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can insert inquiries (public contact form)
CREATE POLICY "inquiries_public_insert" ON inquiries
  FOR INSERT WITH CHECK (true);

-- Only admins can view/update/delete inquiries
CREATE POLICY "inquiries_admin_select" ON inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admins WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "inquiries_admin_update" ON inquiries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admins WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "inquiries_admin_delete" ON inquiries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admins WHERE auth_id = auth.uid()
    )
  );

-- ============================================
-- 6. SETTINGS TABLE (Singleton)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_name TEXT NOT NULL DEFAULT 'Estate Reserve',
  phone TEXT NOT NULL DEFAULT '',
  whatsapp TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  office_address TEXT NOT NULL DEFAULT '',
  hero_title TEXT NOT NULL DEFAULT 'Find Your Dream Property',
  hero_subtitle TEXT NOT NULL DEFAULT 'Premium plots and properties with complete transparency and trust.',
  about_text TEXT NOT NULL DEFAULT '',
  logo_url TEXT
);

-- RLS Policies for settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view settings (needed for public pages)
CREATE POLICY "settings_public_select" ON settings
  FOR SELECT USING (true);

-- Only admins can update settings
CREATE POLICY "settings_admin_update" ON settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admins WHERE auth_id = auth.uid()
    )
  );

-- ============================================
-- 7. INSERT DEFAULT SETTINGS
-- ============================================
INSERT INTO settings (
  site_name,
  phone,
  whatsapp,
  email,
  office_address,
  hero_title,
  hero_subtitle,
  about_text
) VALUES (
  'Estate Reserve',
  '+91 98765 43210',
  '+91 98765 43210',
  'info@estatereserve.com',
  'Office No. 1, Main Road, Your City',
  'Find Your Dream Property',
  'Premium plots and properties with complete transparency and trust.',
  'We are a trusted real estate firm with over 10 years of experience helping families find their dream properties. Our commitment to transparency, legal verification, and customer satisfaction sets us apart.'
);

-- ============================================
-- 8. AUTO-UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
