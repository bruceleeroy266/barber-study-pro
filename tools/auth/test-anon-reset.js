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

// Use ANON key (same as client-side)
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testReset() {
  console.log('=== TESTING WITH ANON KEY (CLIENT-SIDE) ===\n');
  
  // Test 1: Production URL with query params (what the app currently sends)
  console.log('1. redirectTo: https://ascynpro.com/auth/callback?type=recovery&next=/update-password');
  const { error: e1 } = await supabase.auth.resetPasswordForEmail(
    'patty.pineda.drl@gmail.com',
    { redirectTo: 'https://ascynpro.com/auth/callback?type=recovery&next=/update-password' }
  );
  if (e1) {
    console.log('   ERROR:', e1.message);
    console.log('   Status:', e1.status);
    console.log('   Code:', e1.code);
  } else {
    console.log('   SUCCESS');
  }
  
  // Test 2: Production URL without query params
  console.log('\n2. redirectTo: https://ascynpro.com/auth/callback');
  const { error: e2 } = await supabase.auth.resetPasswordForEmail(
    'patty.pineda.drl@gmail.com',
    { redirectTo: 'https://ascynpro.com/auth/callback' }
  );
  if (e2) {
    console.log('   ERROR:', e2.message);
    console.log('   Status:', e2.status);
  } else {
    console.log('   SUCCESS');
  }
  
  // Test 3: Just the origin
  console.log('\n3. redirectTo: https://ascynpro.com');
  const { error: e3 } = await supabase.auth.resetPasswordForEmail(
    'patty.pineda.drl@gmail.com',
    { redirectTo: 'https://ascynpro.com' }
  );
  if (e3) {
    console.log('   ERROR:', e3.message);
    console.log('   Status:', e3.status);
  } else {
    console.log('   SUCCESS');
  }
  
  // Test 4: No redirectTo
  console.log('\n4. No redirectTo (default)');
  const { error: e4 } = await supabase.auth.resetPasswordForEmail(
    'patty.pineda.drl@gmail.com'
  );
  if (e4) {
    console.log('   ERROR:', e4.message);
    console.log('   Status:', e4.status);
  } else {
    console.log('   SUCCESS');
  }

  // Test 5: URL-encoded redirectTo
  console.log('\n5. redirectTo with encoded params: https://ascynpro.com/auth/callback%3Ftype%3Drecovery');
  const { error: e5 } = await supabase.auth.resetPasswordForEmail(
    'patty.pineda.drl@gmail.com',
    { redirectTo: 'https://ascynpro.com/auth/callback%3Ftype%3Drecovery' }
  );
  if (e5) {
    console.log('   ERROR:', e5.message);
    console.log('   Status:', e5.status);
  } else {
    console.log('   SUCCESS');
  }
}

testReset().catch(console.error);
