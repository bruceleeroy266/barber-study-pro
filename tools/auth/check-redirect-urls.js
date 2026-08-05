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

async function checkRedirectUrls() {
  console.log('=== SUPABASE REDIRECT URL CONFIGURATION ===\n');
  
  // Try to get project settings (this may not work with service role)
  console.log('Testing various redirect URL scenarios...\n');
  
  // Test 1: What happens with the production URL
  console.log('1. Testing with production URL (ascynpro.com)...');
  const { data: prodData, error: prodError } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: 'patty.pineda.drl@gmail.com',
    options: {
      redirectTo: 'https://ascynpro.com/auth/callback?type=recovery',
    }
  });
  
  if (prodError) {
    console.log('   ❌ Error:', prodError.message);
  } else {
    console.log('   ✅ Success');
    console.log('   Action link:', prodData.properties?.action_link);
  }
  
  // Test 2: What happens with localhost
  console.log('\n2. Testing with localhost:3001...');
  const { data: localData, error: localError } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: 'patty.pineda.drl@gmail.com',
    options: {
      redirectTo: 'http://localhost:3001/auth/callback?type=recovery',
    }
  });
  
  if (localError) {
    console.log('   ❌ Error:', localError.message);
    console.log('   Error code:', localError.code);
  } else {
    console.log('   ✅ Success');
    console.log('   Action link:', localData.properties?.action_link);
  }
  
  // Test 3: What happens with no redirectTo
  console.log('\n3. Testing with NO redirectTo (uses Site URL)...');
  const { data: defaultData, error: defaultError } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: 'patty.pineda.drl@gmail.com',
  });
  
  if (defaultError) {
    console.log('   ❌ Error:', defaultError.message);
  } else {
    console.log('   ✅ Success');
    console.log('   Action link:', defaultData.properties?.action_link);
  }
  
  console.log('\n=== ANALYSIS ===');
  console.log('The action_link shows where Supabase will redirect after verification.');
  console.log('If the redirect_to parameter is not in the allowed list, Supabase uses the Site URL.');
}

checkRedirectUrls().catch(console.error);
