import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Requires service role key to bypass RLS and create auth users directly
export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Missing admin credentials' }, { status: 500 });
    }

    const adminAuthClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1. Check if user already exists
    const email = 'demo@estatereserve.com';
    const password = 'password123';

    let userId: string;

    const { data: existingUsers, error: searchError } = await adminAuthClient.auth.admin.listUsers();
    
    if (searchError) {
      return NextResponse.json({ error: 'Failed fetching users: ' + searchError.message }, { status: 500 });
    }

    const existingUser = existingUsers.users.find(u => u.email === email);

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // 2. Create user via admin API
      const { data: newUser, error: createError } = await adminAuthClient.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
      });

      if (createError) {
        return NextResponse.json({ error: 'Failed creating demo user: ' + createError.message }, { status: 500 });
      }
      
      userId = newUser.user.id;
    }

    // 3. Ensure they are in the admins table
    const { data: existingAdmin, error: adminCheckError } = await adminAuthClient
      .from('admins')
      .select('id')
      .eq('auth_id', userId)
      .single();

    if (!existingAdmin) {
      const { error: insertError } = await adminAuthClient
        .from('admins')
        .insert({
          auth_id: userId,
          email: email,
          name: 'Demo Admin'
        });

      if (insertError) {
        // If it failed because table doesn't exist, we notify them nicely
        if (insertError.code === '42P01') {
          return NextResponse.json({ error: 'Database tables do not exist yet! Please run schema.sql first.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed adding to admins table: ' + insertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Demo Admin setup complete.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
