// Check instructor profile in production
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('=');
  if (eq === -1) continue;
  let v = t.slice(eq + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  env[t.slice(0, eq).trim()] = v;
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkInstructor() {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, email, role, approval_status, is_disabled, school_id, full_name')
    .eq('email', 'instructor@ascyn-smoke.test')
    .single();
  
  if (error) {
    console.log('Error:', error.message);
    return;
  }
  
  console.log('Instructor Profile:');
  console.log('  Email:', profile.email);
  console.log('  Role:', profile.role);
  console.log('  Approval Status:', profile.approval_status);
  console.log('  Disabled:', profile.is_disabled);
  console.log('  School ID:', profile.school_id || 'NULL');
  console.log('  Name:', profile.full_name);
  
  if (profile.school_id) {
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .select('id, name, is_active')
      .eq('id', profile.school_id)
      .single();
    
    if (schoolError) {
      console.log('  School Error:', schoolError.message);
    } else {
      console.log('  School:', school.name, '(active:', school.is_active + ')');
    }
  } else {
    console.log('\n  ROOT CAUSE: Instructor has NO school_id assigned');
    console.log('  This triggers the redirect to /pending-approval in dashboard/page.tsx');
  }
}

checkInstructor().catch(console.error);
