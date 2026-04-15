/**
 * Auth Service
 * 
 * Handles admin authentication with Supabase Auth.
 * Includes role-based access verification.
 */
import { createClient } from '@/lib/supabase/server';
import type { Admin } from '@/types';

/**
 * Get the currently authenticated user's session.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

/**
 * Get the admin profile for the authenticated user.
 * Verifies the user exists in the admins table.
 */
export async function getAdminProfile(): Promise<Admin | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('auth_id', user.id)
    .single();

  if (error || !data) return null;
  return data as Admin;
}

/**
 * Check if the current user has admin access.
 */
export async function isAdmin(): Promise<boolean> {
  const admin = await getAdminProfile();
  return admin !== null;
}

/**
 * Check if the current user has a specific role.
 */
export async function hasRole(
  requiredRole: 'super_admin' | 'admin' | 'editor'
): Promise<boolean> {
  const admin = await getAdminProfile();
  if (!admin) return false;

  const roleHierarchy = { super_admin: 3, admin: 2, editor: 1 };
  return roleHierarchy[admin.role] >= roleHierarchy[requiredRole];
}

/**
 * Sign in with email and password.
 */
export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
