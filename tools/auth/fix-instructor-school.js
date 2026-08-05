// Fix instructor school assignment
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

async function fixInstructor() {
  const PILOT_SCHOOL_ID = '11ab99a1-0f9d-4f9b-813e-d88a59e3f5d7';
  
  console.log('Assigning instructor to ASCYN PRO Pilot School...');
  
  const { data, error } = await supabase
    .from('profiles')
    .update({ school_id: PILOT_SCHOOL_ID })
    .eq('email', 'instructor@ascyn-smoke.test')
    .select();
  
  if (error) {
    console.log('Error:', error.message);
    return;
  }
  
  console.log('Success! Instructor updated:');
  console.log(data);
  
  // Verify
  const { data: profile, error: verifyError } = await supabase
    .from('profiles')
    .select('email, role, school_id')
    .eq('email', 'instructor@ascyn-smoke.test')
    .single();
  
  if (verifyError) {
    console.log('Verify error:', verifyError.message);
  } else {
    console.log('\nVerified:');
    console.log('  Email:', profile.email);
    console.log('  Role:', profile.role);
    console.log('  School ID:', profile.school_id);
  }
}

fixInstructor().catch(console.error);
