const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);

const url = urlMatch[1].trim().replace(/['"]/g, '');
const key = keyMatch[1].trim().replace(/['"]/g, '');

const supabase = createClient(url, key);

async function searchAdmins() {
  console.log('=== SEARCHING FOR ADMINISTRATORS ===\n');
  
  // Get all users
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.log('Auth error:', authError.message);
    return;
  }
  
  console.log('Total auth users:', authData.users.length);
  
  // Search by role in profiles
  const { data: adminProfiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'admin');
  
  if (profileError) {
    console.log('Profile error:', profileError.message);
  } else {
    console.log('\nAdmin profiles found:', adminProfiles.length);
    for (const profile of adminProfiles) {
      console.log('\n--- Admin Profile ---');
      console.log('ID:', profile.id);
      console.log('Email:', profile.email);
      console.log('Role:', profile.role);
      console.log('Approval:', profile.approval_status);
      console.log('Disabled:', profile.is_disabled);
      console.log('Created:', profile.created_at);
      
      // Find matching auth user
      const authUser = authData.users.find(u => u.id === profile.id);
      if (authUser) {
        console.log('Auth email:', authUser.email);
        console.log('Auth confirmed:', authUser.email_confirmed_at ? 'YES' : 'NO');
        console.log('Last sign in:', authUser.last_sign_in_at || 'NEVER');
      } else {
        console.log('NO MATCHING AUTH USER (orphaned profile)');
      }
    }
  }
  
  // Search for any email containing "admin" or "ascyn"
  console.log('\n=== EMAIL SEARCH ===');
  const adminEmails = authData.users.filter(u => 
    u.email?.toLowerCase().includes('admin') || 
    u.email?.toLowerCase().includes('ascyn')
  );
  
  console.log('Admin-like emails found:', adminEmails.length);
  for (const user of adminEmails) {
    console.log('\n--- Auth User ---');
    console.log('ID:', user.id);
    console.log('Email:', user.email);
    console.log('Confirmed:', user.email_confirmed_at ? 'YES' : 'NO');
    console.log('Last sign in:', user.last_sign_in_at || 'NEVER');
    console.log('Created:', user.created_at);
  }
  
  // Check for orphaned profiles (profile without auth)
  console.log('\n=== ORPHANED PROFILES CHECK ===');
  const { data: allProfiles, error: allProfilesError } = await supabase
    .from('profiles')
    .select('id, email, role');
  
  if (!allProfilesError) {
    const orphaned = allProfiles.filter(p => !authData.users.find(u => u.id === p.id));
    console.log('Orphaned profiles (no auth user):', orphaned.length);
    for (const p of orphaned) {
      console.log('  -', p.email, '(', p.role, ')');
    }
  }
  
  // Check for orphaned auth (auth without profile)
  console.log('\n=== ORPHANED AUTH CHECK ===');
  const orphanedAuth = authData.users.filter(u => !allProfiles?.find(p => p.id === u.id));
  console.log('Orphaned auth users (no profile):', orphanedAuth.length);
  for (const u of orphanedAuth) {
    console.log('  -', u.email);
  }
}

searchAdmins().catch(console.error);
