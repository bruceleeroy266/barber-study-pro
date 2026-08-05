// Production smoke test for ASCYN PRO
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

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('=== PRODUCTION SMOKE TEST ===');
console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key Length:', supabaseAnonKey ? supabaseAnonKey.length : 'MISSING');
console.log('');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin(email, password, expectedRole) {
  console.log('Testing:', email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });
  
  if (error) {
    console.log('  FAIL: Login error -', error.message);
    return { success: false, error: error.message };
  }
  
  console.log('  PASS: Login successful');
  
  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, approval_status, is_disabled, full_name')
    .eq('id', data.user.id)
    .single();
  
  if (profileError) {
    console.log('  FAIL: Profile error -', profileError.message);
    await supabase.auth.signOut();
    return { success: false, error: profileError.message };
  }
  
  console.log('  Role:', profile.role, '(expected:', expectedRole + ')');
  console.log('  Status:', profile.approval_status);
  console.log('  Disabled:', profile.is_disabled);
  
  // Determine expected redirect
  let expectedRedirect = '/dashboard';
  if (profile.role === 'admin') expectedRedirect = '/admin';
  if (profile.role === 'instructor') expectedRedirect = '/instructor';
  if (profile.role === 'school_admin') expectedRedirect = '/admin';
  
  console.log('  Expected redirect:', expectedRedirect);
  
  // Sign out
  await supabase.auth.signOut();
  console.log('  Signed out');
  console.log('');
  
  return { 
    success: true, 
    role: profile.role, 
    expectedRole: expectedRole,
    roleMatch: profile.role === expectedRole,
    expectedRedirect: expectedRedirect
  };
}

async function runTests() {
  const results = [];
  
  // Test Admin
  results.push(await testLogin('admin@ascyn-smoke.test', 'SmokeTest123!', 'admin'));
  
  // Test Instructor  
  results.push(await testLogin('instructor@ascyn-smoke.test', 'SmokeTest123!', 'instructor'));
  
  // Test Student
  results.push(await testLogin('student@ascyn-smoke.test', 'SmokeTest123!', 'student'));
  
  // Summary
  console.log('=== SUMMARY ===');
  const passed = results.filter(r => r.success && r.roleMatch).length;
  const failed = results.filter(r => !r.success || !r.roleMatch).length;
  console.log('Passed:', passed);
  console.log('Failed:', failed);
  
  if (failed > 0) {
    console.log('\nFailed tests:');
    results.forEach((r, i) => {
      if (!r.success || !r.roleMatch) {
        console.log('  Test', i + 1, ':', r.error || 'Role mismatch');
      }
    });
  }
}

runTests().catch(console.error);
