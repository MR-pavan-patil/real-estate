-- ============================================
-- Fix Infinite Recursion in Admins Table
-- ============================================

-- 1. Drop the offending recursive policies
DROP POLICY IF EXISTS "admins_select_all" ON admins;
DROP POLICY IF EXISTS "admins_manage" ON admins;

-- 2. Create securely bypassing definer function
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE auth_id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 3. Recreate the policies using the new function
CREATE POLICY "admins_select_all" ON admins
  FOR SELECT USING (is_super_admin());

CREATE POLICY "admins_manage" ON admins
  FOR ALL USING (is_super_admin());
