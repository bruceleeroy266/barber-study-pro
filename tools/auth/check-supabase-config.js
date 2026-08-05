const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[match[1].trim()] = val;
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSupabaseConfig() {
  console.log('=== SUPABASE CONFIGURATION AUDIT ===\n');
  
  // Check what the reset password email would contain
  console.log('1. Testing resetPasswordForEmail with service role...\n');
  
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: 'patty.pineda.drl@gmail.com',
    options: {
      redirectTo: 'http://localhost:3001/auth/callback?type=recovery',
    }
  });
  
  if (error) {
    console.log('❌ Error generating recovery link:', error.message);
    console.log('Error code:', error.code);
    console.log('Error status:', error.status);
  } else {
    console.log('✅ Recovery link generated successfully');
    console.log('Action link:', data.properties?.action_link);
    console.log('Email OTP:', data.properties?.email_otp);
    console.log('Hashed token:', data.properties?.hashed_token);
    console.log('Verification type:', data.properties?.verification_type);
  }
  
  // Check the auth callback route exists
  console.log('\n2. Checking auth callback route...\n');
  const callbackPath = path.join(__dirname, 'src', 'app', 'auth', 'callback', 'route.ts');
  if (fs.existsSync(callbackPath)) {
    console.log('✅ Auth callback route exists:', callbackPath);
    const content = fs.readFileSync(callbackPath, 'utf8');
    console.log('Route handles recovery type:', content.includes("type === 'recovery'"));
    console.log('Route redirects to update-password:', content.includes('/update-password'));
  } else {
    console.log('❌ Auth callback route NOT found');
  }
  
  // Check update-password page exists
  console.log('\n3. Checking update-password page...\n');
  const updatePath = path.join(__dirname, 'src', 'app', '(auth)', 'update-password', 'page.tsx');
  if (fs.existsSync(updatePath)) {
    console.log('✅ Update password page exists:', updatePath);
  } else {
    console.log('❌ Update password page NOT found');
  }
  
  // Check auth-code-error page
  console.log('\n4. Checking auth-code-error page...\n');
  const errorPath = path.join(__dirname, 'src', 'app', 'auth', 'auth-code-error', 'page.tsx');
  if (fs.existsSync(errorPath)) {
    console.log('✅ Auth code error page exists:', errorPath);
  } else {
    console.log('❌ Auth code error page NOT found');
    console.log('   This is referenced in the callback route but may not exist!');
  }
  
  // Check environment variables
  console.log('\n5. Environment variables...\n');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
  console.log('NEXT_PUBLIC_SITE_URL:', env.NEXT_PUBLIC_SITE_URL || 'Not set');
  console.log('NEXT_PUBLIC_DEMO_MODE:', env.NEXT_PUBLIC_DEMO_MODE || 'Not set');
}

checkSupabaseConfig().catch(console.error);
