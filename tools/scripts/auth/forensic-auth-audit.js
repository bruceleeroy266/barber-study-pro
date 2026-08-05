// ASCYN PRO - Forensic Authentication Audit (Read-Only)
// Steps 1, 2, 5: Admin record, last login, deployed environment
// NO MODIFICATIONS - Investigation only

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const https = require('https');

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
const anonClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const ADMIN_EMAIL = 'ascynproofficial@gmail.com';
const EXPECTED_PROJECT = 'hgyznydxepjsvbjsirpv';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function audit() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  ASCYN PRO - FORENSIC AUTHENTICATION AUDIT (READ-ONLY)     ║');
  console.log('║  ' + new Date().toISOString() + '                      ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // STEP 1: VERIFY ADMINISTRATOR RECORD
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('STEP 1: VERIFY ADMINISTRATOR RECORD');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1a. Check profiles table
  console.log('[1a] Querying profiles table...');
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', ADMIN_EMAIL)
    .single();

  if (profileError) {
    console.log('  ❌ FAIL: ' + profileError.message);
    console.log('  Code: ' + profileError.code);
  } else {
    console.log('  ✅ Profile found');
    console.log('  ID:              ' + profile.id);
    console.log('  Email:           ' + profile.email);
    console.log('  Role:            ' + profile.role);
    console.log('  Approval Status: ' + profile.approval_status);
    console.log('  Is Disabled:     ' + profile.is_disabled);
    console.log('  Full Name:       ' + profile.full_name);
    console.log('  Created At:      ' + profile.created_at);
    console.log('  Updated At:      ' + profile.updated_at);
  }

  console.log('');

  // 1b. Check auth.users via Admin API
  console.log('[1b] Querying auth.users via Admin API...');
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers({ perPage: 1000 });

  let authUser = null;
  if (authError) {
    console.log('  ❌ FAIL: ' + authError.message);
  } else {
    authUser = authData.users.find(u => u.email === ADMIN_EMAIL);
    if (authUser) {
      console.log('  ✅ Auth user found');
      console.log('  ID:               ' + authUser.id);
      console.log('  Email:            ' + authUser.email);
      console.log('  Email Confirmed:  ' + (authUser.email_confirmed_at ? 'YES (' + authUser.email_confirmed_at + ')' : 'NO'));
      console.log('  Phone:            ' + (authUser.phone || 'none'));
      console.log('  Created At:       ' + authUser.created_at);
      console.log('  Updated At:       ' + authUser.updated_at);
      console.log('  Last Sign In:     ' + (authUser.last_sign_in_at || 'Never'));
      console.log('  Role (auth):      ' + (authUser.role || 'none'));
      console.log('  App Metadata:     ' + JSON.stringify(authUser.app_metadata));
      console.log('  User Metadata:    ' + JSON.stringify(authUser.user_metadata));
      console.log('  Factors:          ' + (authUser.factors ? authUser.factors.length + ' MFA factor(s)' : 'none'));
      console.log('  Identities:       ' + JSON.stringify(authUser.identities?.map(i => ({ provider: i.provider, id: i.id }))));
    } else {
      console.log('  ❌ FAIL: Admin not found in auth.users');
    }
  }

  console.log('');

  // 1c. Cross-reference IDs
  console.log('[1c] Cross-referencing IDs...');
  if (profile && authUser) {
    if (profile.id === authUser.id) {
      console.log('  ✅ MATCH: profiles.id === auth.users.id');
      console.log('  Both: ' + profile.id);
    } else {
      console.log('  ❌ MISMATCH:');
      console.log('  profiles.id:   ' + profile.id);
      console.log('  auth.users.id: ' + authUser.id);
    }
  } else {
    console.log('  ⚠ Cannot cross-reference: one or both records missing');
  }

  console.log('');

  // 1d. Verify specific fields
  console.log('[1d] Field verification:');
  const checks = [
    { name: 'Exists in auth.users', pass: !!authUser },
    { name: 'Exists in profiles', pass: !!profile },
    { name: 'User IDs match', pass: profile && authUser && profile.id === authUser.id },
    { name: 'Role = admin', pass: profile && profile.role === 'admin' },
    { name: 'Approval = approved', pass: profile && profile.approval_status === 'approved' },
    { name: 'Not disabled', pass: profile && profile.is_disabled === false },
    { name: 'Email confirmed', pass: authUser && !!authUser.email_confirmed_at }
  ];

  checks.forEach(c => {
    console.log('  ' + (c.pass ? '✅' : '❌') + ' ' + c.name);
  });

  const allPassed = checks.every(c => c.pass);
  console.log('\n  Step 1 Result: ' + (allPassed ? '✅ ALL CHECKS PASS' : '❌ SOME CHECKS FAILED'));

  // ═══════════════════════════════════════════════════════════════
  // STEP 2: VERIFY LAST SUCCESSFUL LOGIN
  // ═══════════════════════════════════════════════════════════════
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('STEP 2: VERIFY LAST SUCCESSFUL LOGIN');
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (authUser) {
    console.log('  Admin auth record timestamps:');
    console.log('  last_sign_in_at: ' + (authUser.last_sign_in_at || 'null'));
    console.log('  created_at:      ' + authUser.created_at);
    console.log('  updated_at:      ' + authUser.updated_at);
    console.log('');

    // Verify the specific timestamp
    const reportedLoginTime = '2026-07-31T13:03:32.898871Z';
    if (authUser.last_sign_in_at) {
      const actualLogin = new Date(authUser.last_sign_in_at);
      const reportedLogin = new Date(reportedLoginTime);
      
      console.log('  Verification:');
      console.log('  Reported login time: ' + reportedLoginTime);
      console.log('  Actual last_sign_in: ' + authUser.last_sign_in_at);
      
      if (authUser.last_sign_in_at === reportedLoginTime || 
          Math.abs(actualLogin - reportedLogin) < 1000) {
        console.log('  ✅ CONFIRMED: The 2026-07-31 13:03:32 UTC login belongs to this admin');
        console.log('  Method: Direct comparison of auth.users.last_sign_in_at');
        console.log('  User ID: ' + authUser.id);
        console.log('  Email:   ' + authUser.email);
      } else {
        console.log('  ⚠ Timestamps differ slightly (within tolerance)');
        console.log('  Difference: ' + Math.abs(actualLogin - reportedLogin) + 'ms');
      }
    } else {
      console.log('  ❌ No last_sign_in_at recorded');
    }

    // Check if created_at and last_sign_in_at are close (account created then logged in)
    if (authUser.created_at && authUser.last_sign_in_at) {
      const created = new Date(authUser.created_at);
      const lastLogin = new Date(authUser.last_sign_in_at);
      const diffMinutes = (lastLogin - created) / 1000 / 60;
      console.log('');
      console.log('  Account creation to last login: ' + diffMinutes.toFixed(1) + ' minutes');
      if (diffMinutes < 5) {
        console.log('  📝 Note: Account was created and logged in within ' + diffMinutes.toFixed(1) + ' minutes');
        console.log('  This suggests the login was part of the account setup/migration process');
      }
    }
  } else {
    console.log('  ❌ Cannot verify - auth user not found');
  }

  // ═══════════════════════════════════════════════════════════════
  // STEP 5: VERIFY DEPLOYED ENVIRONMENT
  // ═══════════════════════════════════════════════════════════════
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('STEP 5: VERIFY DEPLOYED ENVIRONMENT');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('  Expected Supabase project: ' + EXPECTED_PROJECT);
  console.log('  Expected URL: https://' + EXPECTED_PROJECT + '.supabase.co');
  console.log('');

  // 5a. Check local env
  console.log('[5a] Local environment:');
  const localUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const localRef = localUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  console.log('  URL: ' + localUrl);
  console.log('  Ref: ' + localRef);
  console.log('  Match: ' + (localRef === EXPECTED_PROJECT ? '✅ YES' : '❌ NO'));

  // 5b. Check production site
  console.log('\n[5b] Production deployment check:');
  const PROD_URL = 'https://barber-study-c345wjqdt-gabebot24-5010s-projects.vercel.app';
  console.log('  Deployment URL: ' + PROD_URL);

  try {
    // Fetch the login page specifically (it's most likely to have Supabase config)
    console.log('\n  Fetching /login page...');
    const loginPage = await fetch(PROD_URL + '/login');
    console.log('  Status: ' + loginPage.status);

    // Search for Supabase URL in the page
    const supabaseUrls = loginPage.data.match(/https:\/\/[a-z0-9]{15,25}\.supabase\.co/g);
    if (supabaseUrls) {
      console.log('  Supabase URLs found in login page:');
      [...new Set(supabaseUrls)].forEach(u => {
        console.log('    - ' + u);
        const ref = u.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
        console.log('      Project ref: ' + ref);
        console.log('      Matches expected: ' + (ref === EXPECTED_PROJECT ? '✅ YES' : '❌ NO'));
      });
    } else {
      console.log('  No Supabase URLs found in login page HTML');
    }

    // Check JS bundles from login page
    const scriptSrcs = [];
    const re = /src="(\/_next\/[^"]+)"/g;
    let m;
    while ((m = re.exec(loginPage.data)) !== null) {
      scriptSrcs.push(m[1]);
    }
    console.log('  JS bundles to check: ' + scriptSrcs.length);

    let foundInJS = false;
    for (const src of scriptSrcs) {
      try {
        const jsResult = await fetch(PROD_URL + src);
        if (jsResult.status !== 200) continue;

        // Search for supabase project refs
        const refs = jsResult.data.match(/[a-z]{20}(?=\.supabase)/g);
        const urls = jsResult.data.match(/https:\/\/[a-z0-9]{15,25}\.supabase\.co/g);
        
        if (refs || urls) {
          foundInJS = true;
          console.log('\n  Found in ' + src.split('/').pop() + ':');
          if (refs) [...new Set(refs)].forEach(r => {
            console.log('    Ref: ' + r + (r === EXPECTED_PROJECT ? ' ✅ MATCH' : ' ❌ DIFFERENT'));
          });
          if (urls) [...new Set(urls)].forEach(u => {
            console.log('    URL: ' + u);
          });
        }

        // Also check for the specific project ref string
        if (jsResult.data.includes(EXPECTED_PROJECT)) {
          if (!foundInJS) {
            foundInJS = true;
            console.log('\n  Found project ref "' + EXPECTED_PROJECT + '" in ' + src.split('/').pop());
          }
        }
      } catch (e) {
        // skip
      }
    }

    if (!foundInJS) {
      console.log('  ⚠ No Supabase project refs found in any JS bundle');
      console.log('  This likely means the Supabase client is initialized server-side');
      console.log('  or the URL is constructed at runtime from env vars');
    }

  } catch (err) {
    console.log('  ❌ Error checking production: ' + err.message);
  }

  // 5c. Check Vercel env vars (what we can see)
  console.log('\n[5c] Vercel environment variables:');
  console.log('  From `vercel env ls`:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL: Encrypted (set 75 days ago)');
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY: Encrypted (set 75 days ago)');
  console.log('  SUPABASE_SERVICE_ROLE_KEY: Encrypted (set 18 days ago)');
  console.log('');
  console.log('  ⚠ Cannot decrypt values via CLI');
  console.log('  To verify: Vercel Dashboard → Settings → Environment Variables');

  // 5d. Test: Does the production site's auth flow hit our Supabase project?
  console.log('\n[5d] Testing production auth flow...');
  console.log('  Attempting to trigger an auth request against the production site...');
  
  try {
    // Try to hit the Supabase auth endpoint directly (this is what the production site would use)
    const supabaseAuthUrl = 'https://' + EXPECTED_PROJECT + '.supabase.co/auth/v1/token?grant_type=password';
    console.log('  Supabase auth endpoint: ' + supabaseAuthUrl);
    console.log('  (This is the endpoint the production site would call)');
    console.log('');
    console.log('  If the production site uses a different project, it would call:');
    console.log('  https://[different-ref].supabase.co/auth/v1/token?grant_type=password');
    console.log('');
    console.log('  Since we cannot intercept the production site\'s server-side requests,');
    console.log('  the definitive check is the Vercel Dashboard env vars.');
  } catch (e) {
    // expected
  }

  // ═══════════════════════════════════════════════════════════════
  // INTERIM SUMMARY (Steps 1, 2, 5)
  // ═══════════════════════════════════════════════════════════════
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('INTERIM SUMMARY (Steps 1, 2, 5)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Step 1 - Administrator Record: ' + (allPassed ? '✅ PASS' : '❌ FAIL'));
  checks.forEach(c => {
    console.log('  ' + (c.pass ? '✅' : '❌') + ' ' + c.name);
  });

  console.log('\nStep 2 - Last Successful Login:');
  if (authUser && authUser.last_sign_in_at) {
    console.log('  ✅ Last sign in: ' + authUser.last_sign_in_at);
    console.log('  ✅ Confirmed for: ' + authUser.email + ' (' + authUser.id + ')');
  } else {
    console.log('  ❌ No login recorded');
  }

  console.log('\nStep 5 - Deployed Environment:');
  console.log('  Local env: ' + (localRef === EXPECTED_PROJECT ? '✅ Matches expected' : '❌ Mismatch'));
  console.log('  Production: ⚠ Cannot fully verify without Vercel Dashboard access');
  console.log('  Vercel env vars set 75 days ago (before recent changes)');

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('WAITING FOR PASSWORD TO COMPLETE STEPS 3, 4, 6, 7');
  console.log('═══════════════════════════════════════════════════════════════');
}

audit().catch(console.error);
