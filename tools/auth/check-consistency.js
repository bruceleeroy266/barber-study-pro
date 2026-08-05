const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);

const url = urlMatch[1].trim().replace(/['"]/g, '');
const key = keyMatch[1].trim().replace(/['"]/g, '');

const supabase = createClient(url, key);

async function checkConsistency() {
  console.log('=== DATA CONSISTENCY CHECK ===\n');
  
  // Get all auth users
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.log('Auth error:', authError.message);
    return;
  }
  
  // Get all profiles
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*');
  
  if (profileError) {
    console.log('Profile error:', profileError.message);
    return;
  }
  
  console.log('Auth users:', authData.users.length);
  console.log('Profiles:', profiles.length);
  
  // Check for mismatches
  console.log('\n=== ID MATCHING ===');
  for (const user of authData.users) {
    const profile = profiles.find(p => p.id === user.id);
    if (!profile) {
      console.log('ORPHANED AUTH:', user.email, '(no profile)');
    } else {
      console.log('MATCH:', user.email, '->', profile.role);
    }
  }
  
  for (const profile of profiles) {
    const user = authData.users.find(u => u.id === profile.id);
    if (!user) {
      console.log('ORPHANED PROFILE:', profile.email, '(no auth)');
    }
  }
  
  // List all users with details
  console.log('\n=== ALL USERS ===');
  for (const user of authData.users) {
    const profile = profiles.find(p => p.id === user.id);
    console.log('\nEmail:', user.email);
    console.log('  ID:', user.id);
    console.log('  Created:', user.created_at);
    console.log('  Last sign in:', user.last_sign_in_at || 'NEVER');
    console.log('  Email confirmed:', user.email_confirmed_at ? 'YES' : 'NO');
    if (profile) {
      console.log('  Profile role:', profile.role);
      console.log('  Profile approval:', profile.approval_status);
      console.log('  Profile disabled:', profile.is_disabled);
    } else {
      console.log('  NO PROFILE');
    }
  }
}

checkConsistency().catch(console.error);
