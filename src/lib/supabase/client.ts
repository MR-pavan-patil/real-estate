/**
 * Supabase Browser Client
 * 
 * Creates a Supabase client for use in Client Components.
 * This client runs in the browser and uses the anon key
 * with Row Level Security policies for data access.
 */
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
