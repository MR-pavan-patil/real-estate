/**
 * Single Inquiry API Route
 * 
 * PATCH: Update inquiry status.
 * DELETE: Remove an inquiry.
 * Requires admin authentication.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: admin } = await supabase.from('admins').select('id').eq('auth_id', user.id).single();
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { status } = body;

    if (!status || !['new', 'contacted', 'closed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Inquiry update error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: admin } = await supabase.from('admins').select('id').eq('auth_id', user.id).single();
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Inquiry delete error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
