// ASCYN PRO - Production Environment Authentication Verification
// Read-only investigation - no data modifications

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load local env
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const localEnv = {};
for (const line of envContent.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('=');
  if (eq === -1) continue;
  let v = t.slice(eq + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  localEnv[t.slice(0, eq).trim()] = v;
}

// Decode JWT to get project ref (safe - doesn't reveal signature)
function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], 'base64url').toString('utf8');
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

console.log('=== ASCYN PRO PRODUCTION ENVIRONMENT VERIFICATION ===');
console.log('Timestamp: ' + new Date().toISOString());
console.log('');

// ═══════════════════════════════════════════════════════════════
// 1. LOCAL ENVIRONMENT ANALYSIS
// ═══════════════════════════════════════════════════════════════
console.log('=== 1. LOCAL ENVIRONMENT ===\n');

const localUrl = localEnv.NEXT_PUBLIC_SUPABASE_URL;
const localAnonKey = localEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const localServiceKey = localEnv.SUPABASE_SERVICE_ROLE_KEY;

console.log('NEXT_PUBLIC_SUPABASE_URL: ' + localUrl);

// Extract project ref from URL
const urlMatch = localUrl?.match(/https:\/\/([^.]+)\.supabase\.co/);
const localProjectRef = urlMatch ? urlMatch[1] : 'unknown';
console.log('Project Ref (from URL): ' + localProjectRef);

// Decode anon key
if (localAnonKey) {
  const anonPayload = decodeJwtPayload(localAnonKey);
  if (anonPayload) {
    console.log('Anon Key Project Ref: ' + (anonPayload.ref || 'unknown'));
    console.log('Anon Key Role: ' + (anonPayload.role || 'unknown'));
    console.log('Anon Key Issued: ' + new Date(anonPayload.iat * 1000).toISOString());
  }
}

// Decode service key
if (localServiceKey) {
  const servicePayload = decodeJwtPayload(localServiceKey);
  if (servicePayload) {
    console.log('Service Key Project Ref: ' + (servicePayload.ref || 'unknown'));
    console.log('Service Key Role: ' + (servicePayload.role || 'unknown'));
  }
}

console.log('');

// ═══════════════════════════════════════════════════════════════
// 2. VERCEL PRODUCTION ENVIRONMENT
// ═══════════════════════════════════════════════════════════════
console.log('=== 2. VERCEL PRODUCTION ENVIRONMENT ===\n');

// Check if we have a .env.vercel.production file
const vercelEnvPath = path.join(process.cwd(), '.env.vercel.production');
let vercelEnv = {};
if (fs.existsSync(vercelEnvPath)) {
  const vercelContent = fs.readFileSync(vercelEnvPath, 'utf8');
  for (const line of vercelContent.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    vercelEnv[t.slice(0, eq).trim()] = v;
  }
  
  console.log('Vercel env file found');
  console.log('NEXT_PUBLIC_SUPABASE_URL: ' + (vercelEnv.NEXT_PUBLIC_SUPABASE_URL || 'not set'));
  
  // Check if values are masked
  if (vercelEnv.NEXT_PUBLIC_SUPABASE_URL === '[SENSITIVE]') {
    console.log('⚠ Vercel environment variables are masked by CLI');
    console.log('  Cannot directly compare values');
    console.log('');
    console.log('To get actual values, run:');
    console.log('  npx vercel env pull .env.vercel.production --environment=production --yes');
    console.log('  Then check the file before it gets masked');
  }
} else {
  console.log('No Vercel env file found');
}

console.log('');

// ═══════════════════════════════════════════════════════════════
// 3. PRODUCTION SUPABASE VERIFICATION
// ═══════════════════════════════════════════════════════════════
console.log('=== 3. PRODUCTION SUPABASE VERIFICATION ===\n');

// Use local credentials to connect to production Supabase
// (since local env points to the hosted project)
const supabaseUrl = localEnv.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = localEnv.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyProduction() {
  const ADMIN_EMAIL = 'ascynproofficial@gmail.com';
  
  // Check if admin exists in profiles
  console.log('Checking admin account in profiles...');
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', ADMIN_EMAIL)
    .single();
  
  if (profileError) {
    console.log('⚠ Profile query error: ' + profileError.message);
    if (profileError.code === 'PGRST116') {
      console.log('  Admin profile NOT FOUND in database');
    }
  } else {
    console.log('✓ Admin profile found:');
    console.log('  ID: ' + profile.id);
    console.log('  Email: ' + profile.email);
    console.log('  Role: ' + profile.role);
    console.log('  Approval Status: ' + profile.approval_status);
    console.log('  Disabled: ' + profile.is_disabled);
    console.log('  Created: ' + profile.created_at);
    console.log('  Updated: ' + profile.updated_at);
  }
  
  console.log('');
  
  // Check auth.users
  console.log('Checking admin account in auth.users...');
  try {
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    
    if (authError) {
      console.log('⚠ Auth query error: ' + authError.message);
    } else {
      const adminAuth = authUsers.users.find(u => u.email === ADMIN_EMAIL);
      if (adminAuth) {
        console.log('✓ Admin auth user found:');
        console.log('  ID: ' + adminAuth.id);
        console.log('  Email: ' + adminAuth.email);
        console.log('  Email Confirmed: ' + (adminAuth.email_confirmed_at ? 'Yes' : 'No'));
        console.log('  Last Sign In: ' + (adminAuth.last_sign_in_at || 'Never'));
        console.log('  Created: ' + adminAuth.created_at);
        console.log('  Updated: ' + adminAuth.updated_at);
      } else {
        console.log('⚠ Admin auth user NOT FOUND');
      }
    }
  } catch (err) {
    console.log('⚠ Auth check failed: ' + err.message);
  }
  
  console.log('');
  
  // ═══════════════════════════════════════════════════════════════
  // 4. AUTHENTICATION TEST
  // ═══════════════════════════════════════════════════════════════
  console.log('=== 4. AUTHENTICATION TEST ===\n');
  
  console.log('Testing signInWithPassword for: ' + ADMIN_EMAIL);
  console.log('⚠ This is a READ-ONLY test - no password will be changed');
  console.log('');
  
  // We need to test with a known password to see if auth works
  // Since we don't know the current password, we'll check what error we get
  console.log('Note: To fully test authentication, we need the current password.');
  console.log('Attempting to sign in with a test to see the error response...');
  console.log('');
  
  // Try to sign in with an obviously wrong password to see the error
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: 'test_wrong_password_to_check_error'
  });
  
  if (signInError) {
    console.log('Sign-in error details:');
    console.log('  Message: ' + signInError.message);
    console.log('  Status: ' + (signInError.status || 'unknown'));
    console.log('  Code: ' + (signInError.code || 'unknown'));
    console.log('  Name: ' + signInError.name);
    
    // Check if it's a "invalid credentials" vs "user not found" error
    if (signInError.message.includes('Invalid login credentials')) {
      console.log('');
      console.log('✓ User EXISTS in auth system (error is about password, not missing user)');
      console.log('  This means the account exists but the password is incorrect');
    } else if (signInError.message.includes('User not found')) {
      console.log('');
      console.log('⚠ User NOT FOUND in auth system');
    }
  } else {
    console.log('⚠ Unexpected: Sign-in succeeded with test password');
  }
  
  console.log('');
  
  // ═══════════════════════════════════════════════════════════════
  // 5. ENVIRONMENT COMPARISON
  // ═══════════════════════════════════════════════════════════════
  console.log('=== 5. ENVIRONMENT COMPARISON ===\n');
  
  console.log('Local Environment:');
  console.log('  Supabase URL: ' + localUrl);
  console.log('  Project Ref: ' + localProjectRef);
  console.log('');
  
  console.log('Vercel Production:');
  if (vercelEnv.NEXT_PUBLIC_SUPABASE_URL === '[SENSITIVE]') {
    console.log('  Supabase URL: [MASKED - cannot compare]');
    console.log('  ⚠ Need to check Vercel dashboard or use CLI with proper permissions');
  } else {
    console.log('  Supabase URL: ' + (vercelEnv.NEXT_PUBLIC_SUPABASE_URL || 'not set'));
  }
  console.log('');
  
  // Check if they match
  if (vercelEnv.NEXT_PUBLIC_SUPABASE_URL && vercelEnv.NEXT_PUBLIC_SUPABASE_URL !== '[SENSITIVE]') {
    if (vercelEnv.NEXT_PUBLIC_SUPABASE_URL === localUrl) {
      console.log('✓ MATCH: Local and Vercel production use the same Supabase URL');
    } else {
      console.log('⚠ MISMATCH: Local and Vercel production use different Supabase URLs');
      console.log('  Local:  ' + localUrl);
      console.log('  Vercel: ' + vercelEnv.NEXT_PUBLIC_SUPABASE_URL);
    }
  } else {
    console.log('⚠ Cannot determine if environments match - Vercel values are masked');
    console.log('');
    console.log('To verify manually:');
    console.log('1. Go to Vercel Dashboard → Project → Settings → Environment Variables');
    console.log('2. Check NEXT_PUBLIC_SUPABASE_URL value');
    console.log('3. Compare with local: ' + localUrl);
  }
  
  console.log('');
  
  // ═══════════════════════════════════════════════════════════════
  // 6. SUMMARY
  // ═══════════════════════════════════════════════════════════════
  console.log('=== 6. SUMMARY ===\n');
  
  console.log('Local Environment:');
  console.log('  - Using Supabase project: ' + localProjectRef);
  console.log('  - URL: ' + localUrl);
  console.log('');
  
  console.log('Production Database State:');
  if (profile) {
    console.log('  - Admin profile exists: YES');
    console.log('  - Role: ' + profile.role);
    console.log('  - Status: ' + profile.approval_status);
  } else {
    console.log('  - Admin profile exists: NO');
  }
  console.log('');
  
  console.log('Authentication:');
  console.log('  - Admin user exists in auth: ' + (signInError?.message.includes('Invalid login credentials') ? 'YES' : 'UNKNOWN'));
  console.log('  - Password test: ' + (signInError ? 'Failed (expected with wrong password)' : 'Unexpected success'));
  console.log('');
  
  console.log('=== INVESTIGATION COMPLETE ===');
}

verifyProduction().catch(console.error);
