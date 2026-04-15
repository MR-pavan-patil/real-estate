/**
 * Uptime Ping Endpoint
 *
 * Lightweight GET endpoint to keep Supabase free-tier
 * database from sleeping due to inactivity.
 *
 * Usage: Hit GET /api/ping periodically via cron
 * (e.g. UptimeRobot, cron-job.org, or Vercel Cron).
 */
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('properties')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[ping] Supabase query failed:', error.message);
      return NextResponse.json(
        {
          success: false,
          timestamp: new Date().toISOString(),
          database: 'unreachable',
          error: error.message,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: 'active',
    });
  } catch (err) {
    console.error('[ping] Unexpected error:', err);
    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        database: 'error',
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
