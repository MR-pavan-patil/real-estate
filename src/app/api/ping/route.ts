/**
 * Supabase Keep-Alive Ping Endpoint
 *
 * Ultra-lightweight GET endpoint optimized for cron-job.org
 * scheduled requests. Prevents Supabase free-tier database
 * from pausing due to inactivity.
 *
 * Usage: Schedule GET /api/ping via cron-job.org (every 5-10 min).
 */
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('properties')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error.message,
          timestamp,
        }),
        { status: 503, headers: JSON_HEADERS }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Supabase active',
        timestamp,
      }),
      { status: 200, headers: JSON_HEADERS }
    );
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
        timestamp,
      }),
      { status: 500, headers: JSON_HEADERS }
    );
  }
}
