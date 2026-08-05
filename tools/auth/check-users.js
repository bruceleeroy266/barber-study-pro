const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);

if (!urlMatch || !keyMatch) {
  console.log('Missing env vars');
  process.exit(1);
}

const url = urlMatch[1].trim().replace(/['"]/g, '');
const key = keyMatch[1].trim().replace(/['"]/g, '');

console.log('URL:', url);
console.log('Key length:', key.length);

const supabase = createClient(url, key);

async function checkUsers() {
  const emails = [
    'tessamyers2911@gmail.com',
    'patty.pineda.drl@gmail.com',
    'MalennySaenz@gmail.com',
    'ascynproofficial@gmail.com'
  ];
  
  for (const email of emails) {
    console.log('\n=== ' + email + ' ===');
    
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.log('Auth error:', authError.message);
      continue;
    }
    
    const user = authData.users.find(u => u.email === email);
    if (!user) {
      console.log('NOT FOUND in auth.users');
      continue;
    }
    
    console.log('Auth ID:', user.id);
    console.log('Email confirmed:', user.email_confirmed_at ? 'YES' : 'NO');
    console.log('Last sign in:', user.last_sign_in_at || 'NEVER');
    console.log('Created:', user.created_at);
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.log('Profile error:', profileError.message);
    } else if (profile) {
      console.log('Profile:');
      console.log('  Role:', profile.role);
      console.log('  Approval:', profile.approval_status);
      console.log('  Disabled:', profile.is_disabled);
      console.log('  Password change:', profile.requires_password_change);
    } else {
      console.log('NO PROFILE');
    }
  }
}

checkUsers().catch(console.error);
