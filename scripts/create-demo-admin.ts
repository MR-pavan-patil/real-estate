
import { createClient } from '@supabase/supabase-js';

function getRequiredEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'SUPABASE_SERVICE_ROLE_KEY') {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const supabaseUrl = getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createDemoAdmin() {
  const email = 'demo@estatereserve.com';
  const password = 'password123';

  console.log(`Creating user: ${email}...`);

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    if (authError.message.includes('already exists')) {
      console.log('User already exists in auth.');
      // Find the user to link it
      const { data: usersData } = await supabase.auth.admin.listUsers();
      const existingUser = usersData.users.find(u => u.email === email);
      if (existingUser) {
        await linkToAdminsTable(existingUser.id, email);
      }
    } else {
      console.error('Error creating auth user:', authError);
    }
    return;
  }

  if (authData.user) {
    console.log('Auth user created successfully:', authData.user.id);
    await linkToAdminsTable(authData.user.id, email);
  }
}

async function linkToAdminsTable(authId: string, email: string) {
  // Check if admin record exists
  const { data: existingAdmin } = await supabase.from('admins').select('id').eq('auth_id', authId).single();
  
  if (existingAdmin) {
    console.log('Admin record already exists in admins table.');
    return;
  }

  console.log('Inserting into admins table...');
  const { error: dbError } = await supabase.from('admins').insert({
    name: 'Demo Admin',
    email: email,
    auth_id: authId,
    role: 'admin',
  });

  if (dbError) {
    console.error('Error writing to admins table:', dbError);
  } else {
    console.log('Demo admin account fully hydrated and ready!');
  }
}

createDemoAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
