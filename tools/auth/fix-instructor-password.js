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

async function fixInstructorPassword() {
  console.log('Fixing instructor account password...\n');
  
  // Get the instructor user
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.log('Error listing users:', listError.message);
    return;
  }
  
  const instructorUser = users.users.find(u => u.email === 'instructor@ascyn-smoke.test');
  
  if (!instructorUser) {
    console.log('Instructor user not found');
    return;
  }
  
  console.log('Found instructor user:', instructorUser.id);
  
  // Reset password using admin API
  const { error: updateError } = await supabase.auth.admin.updateUserById(
    instructorUser.id,
    { password: 'SmokeTest123!' }
  );
  
  if (updateError) {
    console.log('Error resetting password:', updateError.message);
    return;
  }
  
  console.log('Password reset successfully');
  
  // Verify email is confirmed
  const { error: confirmError } = await supabase.auth.admin.updateUserById(
    instructorUser.id,
    { email_confirm: true }
  );
  
  if (confirmError) {
    console.log('Error confirming email:', confirmError.message);
  } else {
    console.log('Email confirmed');
  }
  
  // Test login
  console.log('\nTesting instructor login...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'instructor@ascyn-smoke.test',
    password: 'SmokeTest123!',
  });
  
  if (error) {
    console.log('Login error:', error.message);
  } else {
    console.log('Login successful:', data.user?.email);
  }
  
  // Also verify student account still works
  console.log('\nTesting student login...');
  const { data: studentData, error: studentError } = await supabase.auth.signInWithPassword({
    email: 'student@ascyn-smoke.test',
    password: 'SmokeTest123!',
  });
  
  if (studentError) {
    console.log('Student login error:', studentError.message);
  } else {
    console.log('Student login successful:', studentData.user?.email);
  }
  
  // Also verify admin account
  console.log('\nTesting admin login...');
  const { data: adminData, error: adminError } = await supabase.auth.signInWithPassword({
    email: 'admin@ascyn-smoke.test',
    password: 'SmokeTest123!',
  });
  
  if (adminError) {
    console.log('Admin login error:', adminError.message);
  } else {
    console.log('Admin login successful:', adminData.user?.email);
  }
}

fixInstructorPassword().catch(console.error);
