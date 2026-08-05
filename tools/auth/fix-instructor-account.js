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

async function fixInstructorAccount() {
  console.log('Checking instructor account...\n');
  
  // Get the existing instructor user
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.log('Error listing users:', listError.message);
    return;
  }
  
  const instructorUser = users.users.find(u => u.email === 'instructor@ascyn-smoke.test');
  
  if (!instructorUser) {
    console.log('Instructor user not found in auth');
    return;
  }
  
  console.log('Found instructor user:', instructorUser.id);
  console.log('Email:', instructorUser.email);
  console.log('Created:', instructorUser.created_at);
  console.log('Last sign in:', instructorUser.last_sign_in_at);
  
  // Check if profile exists
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', instructorUser.id)
    .single();
  
  if (profileError) {
    console.log('\nProfile error:', profileError.message);
    console.log('Creating profile...');
    
    const { error: createError } = await supabase
      .from('profiles')
      .insert({
        id: instructorUser.id,
        email: 'instructor@ascyn-smoke.test',
        role: 'instructor',
        approval_status: 'approved',
        is_disabled: false,
        full_name: 'Test Instructor',
      });
    
    if (createError) {
      console.log('Error creating profile:', createError.message);
    } else {
      console.log('Profile created successfully');
    }
  } else {
    console.log('\nProfile exists:');
    console.log('  Role:', profile.role);
    console.log('  Approval status:', profile.approval_status);
    console.log('  Is disabled:', profile.is_disabled);
    
    // Ensure profile is correct
    if (profile.role !== 'instructor' || profile.approval_status !== 'approved' || profile.is_disabled) {
      console.log('\nFixing profile...');
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          role: 'instructor',
          approval_status: 'approved',
          is_disabled: false,
        })
        .eq('id', instructorUser.id);
      
      if (updateError) {
        console.log('Error updating profile:', updateError.message);
      } else {
        console.log('Profile updated successfully');
      }
    } else {
      console.log('\nProfile is correct');
    }
  }
  
  // Reset password
  console.log('\nResetting password...');
  const { error: passwordError } = await supabase.auth.admin.updateUserById(
    instructorUser.id,
    { password: 'SmokeTest123!' }
  );
  
  if (passwordError) {
    console.log('Error resetting password:', passwordError.message);
  } else {
    console.log('Password reset successfully');
  }
  
  // Confirm email
  console.log('\nConfirming email...');
  const { error: confirmError } = await supabase.auth.admin.updateUserById(
    instructorUser.id,
    { email_confirm: true }
  );
  
  if (confirmError) {
    console.log('Error confirming email:', confirmError.message);
  } else {
    console.log('Email confirmed');
  }
  
  console.log('\n✅ Instructor account fix complete');
}

fixInstructorAccount().catch(console.error);
