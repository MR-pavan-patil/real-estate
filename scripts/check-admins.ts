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

async function check() {
  const { data, error } = await supabase.from('admins').select('*');
  console.log('Admins count:', data ? data.length : 0);
  console.log(data);
  if (error) console.error(error);
}

check().catch((error) => {
  console.error(error);
  process.exit(1);
});
