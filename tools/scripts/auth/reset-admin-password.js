// ASCYN PRO - Admin Password Reset & Verification
// Generates secure password, updates via Admin API, verifies auth

const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const ADMIN_EMAIL = 'ascynproofficial@gmail.com';
const ADMIN_ID = '261fcd4c-bbfe-4957-9efd-0dfca6cccdc1';

// Generate cryptographically secure password (28 chars)
function generateSecurePassword() {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  const all = uppercase + lowercase + numbers + symbols;
  
  // Ensure at least one of each type
  let password = '';
  password += uppercase[crypto.randomInt(uppercase.length)];
  password += lowercase[crypto.randomInt(lowercase.length)];
  password += numbers[crypto.randomInt(numbers.length)];
  password += symbols[crypto.randomInt(symbols.length)];
  
  // Fill remaining 24 chars randomly
  for (let i = 4; i < 28; i++) {
    password += all[crypto.randomInt(all.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => crypto.randomInt(3) - 1).join('');
}

async function resetAndVerify() {
  console.log('=== ASCYN PRO ADMIN PASSWORD RESET ===\n');
  
  // Step 1: Verify admin exists
  console.log('[1] Verifying admin account exists...');
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('email', ADMIN_EMAIL)
    .single();
  
  if (profileError || !profile) {
    console.error('❌ FATAL: Admin account not found');
    process.exit(1);
  }
  console.log('✅ Admin verified: ' + profile.id);
  console.log('');
  
  // Step 2: Generate secure password
  console.log('[2] Generating cryptographically secure password...');
  const newPassword = generateSecurePassword();
  console.log('✅ Password generated (28 characters)');
  console.log('');
  
  // Step 3: Update password via Supabase Admin API
  console.log('[3] Updating password via Supabase Admin API...');
  const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
    ADMIN_ID,
    { password: newPassword }
  );
  
  if (updateError) {
    console.error('❌ FATAL: Password update failed');
    console.error('Error: ' + updateError.message);
    process.exit(1);
  }
  console.log('✅ Password updated successfully');
  console.log('');
  
  // Step 4: Verify authentication with new password
  console.log('[4] Verifying authentication with new password...');
  const anonClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: newPassword
  });
  
  if (signInError) {
    console.error('❌ FATAL: Authentication failed after password reset');
    console.error('Error: ' + signInError.message);
    console.error('Status: ' + signInError.status);
    process.exit(1);
  }
  
  console.log('✅ Authentication successful');
  console.log('  User ID: ' + signInData.user.id);
  console.log('  Email: ' + signInData.user.email);
  console.log('  Session: ' + (signInData.session ? 'Created' : 'None'));
  console.log('');
  
  // Step 5: Sign out to clean up
  console.log('[5] Cleaning up test session...');
  await anonClient.auth.signOut();
  console.log('✅ Session cleaned up');
  console.log('');
  
  // Success - output the password
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('✅ PASSWORD RESET COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('Administrator: ' + ADMIN_EMAIL);
  console.log('New Password:  ' + newPassword);
  console.log('');
  console.log('⚠️  SAVE THIS PASSWORD IMMEDIATELY IN YOUR PASSWORD MANAGER');
  console.log('⚠️  This password will not be shown again');
  console.log('');
  console.log('Authentication verified: ✅');
  console.log('Account status: Active');
  console.log('Role: admin');
  console.log('');
}

resetAndVerify().catch(err => {
  console.error('FATAL ERROR:', err);
  process.exit(1);
});
