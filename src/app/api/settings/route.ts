/**
 * Settings API Route
 * 
 * PUT: Update site settings.
 * Requires admin authentication.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: admin } = await supabase.from('admins').select('id').eq('auth_id', user.id).single();
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const {
      id, site_name, phone, whatsapp, email,
      office_address, hero_title, hero_subtitle,
      about_text, logo_url,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Settings ID required.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('settings')
      .update({
        site_name,
        phone,
        whatsapp,
        email,
        office_address,
        hero_title,
        hero_subtitle,
        about_text,
        logo_url,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
