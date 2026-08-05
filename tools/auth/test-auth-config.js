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

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

async function checkAuthConfig() {
  console.log('=== SUPABASE AUTH CONFIGURATION ===\n');
  
  // Check auth settings via REST API
  const settingsResponse = await fetch(supabaseUrl + '/auth/v1/settings', {
    headers: {
      'apikey': serviceKey,
      'Authorization': 'Bearer ' + serviceKey,
    }
  });
  
  if (settingsResponse.ok) {
    const settings = await settingsResponse.json();
    console.log('Auth Settings:');
    console.log(JSON.stringify(settings, null, 2));
  } else {
    console.log('Settings endpoint status:', settingsResponse.status);
    const text = await settingsResponse.text();
    console.log('Response:', text.substring(0, 1000));
  }

  // Now test the actual resetPasswordForEmail with anon key
  // Wait for rate limit to clear
  console.log('\n\n=== WAITING 60 SECONDS FOR RATE LIMIT TO CLEAR ===\n');
  await new Promise(resolve => setTimeout(resolve, 60000));
  
  console.log('=== TESTING resetPasswordForEmail WITH ANON KEY ===\n');
  
  const anonClient = createClient(supabaseUrl, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  // Test with the exact URL the production code sends
  const redirectTo = 'https://ascynpro.com/auth/callback?type=recovery';
  console.log('redirectTo:', redirectTo);
  
  const { data, error } = await anonClient.auth.resetPasswordForEmail(
    'patty.pineda.drl@gmail.com',
    { redirectTo: redirectTo }
  );
  
  if (error) {
    console.log('\nERROR:', error.message);
    console.log('Status:', error.status);
    console.log('Code:', error.code);
    console.log('Full error:', JSON.stringify(error, null, 2));
  } else {
    console.log('\nSUCCESS - reset email sent');
    console.log('Data:', JSON.stringify(data, null, 2));
  }
}

checkAuthConfig().catch(console.error);
