/**
 * Settings Service
 * 
 * Manages site-wide settings from the settings table.
 * Only one row is expected (singleton pattern).
 */
import { createClient } from '@/lib/supabase/server';
import type { SiteSettings, SiteSettingsUpdate } from '@/types';

/**
 * Fetch the site settings (always returns the first/only row).
 */
export async function getSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single();

  if (error) return null;
  return data as SiteSettings;
}

/**
 * Update site settings.
 */
export async function updateSettings(
  id: string,
  updates: SiteSettingsUpdate
): Promise<SiteSettings> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('settings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as SiteSettings;
}
