import { createClient } from '@supabase/supabase-js';

// Validate required environment variables
const requiredEnvVars = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(key => console.error(`   - ${key}`));
  console.error('\nPlease set these variables before running this script.');
  console.error('Example:');
  console.error('  $env:SUPABASE_URL="https://your-project.supabase.co"');
  console.error('  $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
  process.exit(1);
}

const supabase = createClient(
  requiredEnvVars.SUPABASE_URL,
  requiredEnvVars.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function createTestAccounts() {
  console.log('Creating test accounts...\n');
  
  // Create instructor account
  console.log('1. Creating instructor account...');
  const { data: instructorAuth, error: instructorAuthError } = await supabase.auth.signUp({
    email: 'instructor@ascyn-smoke.test',
    password: 'SmokeTest123!',
  });
  
  if (instructorAuthError) {
    console.log('   Error:', instructorAuthError.message);
  } else {
    console.log('   Auth user created:', instructorAuth.user?.id);
    
    // Create instructor profile
    const { error: instructorProfileError } = await supabase
      .from('profiles')
      .upsert({
        id: instructorAuth.user.id,
        email: 'instructor@ascyn-smoke.test',
        role: 'instructor',
        approval_status: 'approved',
        is_disabled: false,
        full_name: 'Test Instructor',
      });
    
    if (instructorProfileError) {
      console.log('   Profile error:', instructorProfileError.message);
    } else {
      console.log('   Profile created successfully');
    }
  }
  
  console.log('\n2. Creating admin account...');
  const { data: adminAuth, error: adminAuthError } = await supabase.auth.signUp({
    email: 'admin@ascyn-smoke.test',
    password: 'SmokeTest123!',
  });
  
  if (adminAuthError) {
    console.log('   Error:', adminAuthError.message);
  } else {
    console.log('   Auth user created:', adminAuth.user?.id);
    
    // Create admin profile
    const { error: adminProfileError } = await supabase
      .from('profiles')
      .upsert({
        id: adminAuth.user.id,
        email: 'admin@ascyn-smoke.test',
        role: 'admin',
        approval_status: 'approved',
        is_disabled: false,
        full_name: 'Test Admin',
      });
    
    if (adminProfileError) {
      console.log('   Profile error:', adminProfileError.message);
    } else {
      console.log('   Profile created successfully');
    }
  }
  
  console.log('\n3. Verifying all test accounts...');
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email, role, approval_status, is_disabled')
    .in('email', [
      'student@ascyn-smoke.test',
      'instructor@ascyn-smoke.test',
      'admin@ascyn-smoke.test'
    ]);
  
  if (profilesError) {
    console.log('   Error:', profilesError.message);
  } else {
    console.log('   Found', profiles?.length || 0, 'test accounts:');
    profiles?.forEach(p => {
      console.log('   -', p.email + ': role=' + p.role + ', status=' + p.approval_status + ', disabled=' + p.is_disabled);
    });
  }
}

createTestAccounts().catch(console.error);
