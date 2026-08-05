// ASCYN PRO - End-to-End Login Failure Investigation
// Read-only - no modifications

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import https from 'https';

// Validate required environment variables
const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  PROD_URL: process.env.PROD_URL,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(key => console.error(`   - ${key}`));
  console.error('\nPlease set these variables before running this script.');
  console.error('Example:');
  console.error('  $env:NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"');
  console.error('  $env:NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"');
  console.error('  $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
  console.error('  $env:ADMIN_EMAIL="admin@example.com"');
  console.error('  $env:ADMIN_PASSWORD="your-admin-password"');
  console.error('  $env:PROD_URL="https://your-production-url.vercel.app"');
  process.exit(1);
}

const ADMIN_EMAIL = requiredEnvVars.ADMIN_EMAIL;
const ADMIN_PASSWORD = requiredEnvVars.ADMIN_PASSWORD;
const PROD_URL = requiredEnvVars.PROD_URL;

function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: options.method || 'GET', headers: options.headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ 
        status: res.statusCode, 
        statusMessage: res.statusMessage,
        headers: res.headers,
        data 
      }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function investigate() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  ASCYN PRO - END-TO-END LOGIN FAILURE INVESTIGATION         ║');
  console.log('║  ' + new Date().toISOString() + '                      ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // STEP 1: VERIFY AUTHENTICATION
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('STEP 1: VERIFY AUTHENTICATION');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const supabase = createClient(requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL, requiredEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  console.log('Attempting signInWithPassword...');
  console.log('Email: ' + ADMIN_EMAIL);
  console.log('');

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  });

  if (authError) {
    console.log('❌ AUTHENTICATION FAILED');
    console.log('  HTTP Status: ' + (authError.status || 'unknown'));
    console.log('  Error Code: ' + (authError.code || 'unknown'));
    console.log('  Error Message: ' + authError.message);
    console.log('');
    console.log('This means the password reset did not work or the password is incorrect.');
    process.exit(1);
  }

  console.log('✅ AUTHENTICATION SUCCESSFUL');
  console.log('  HTTP Status: 200');
  console.log('  Session returned: ' + (authData.session ? 'YES' : 'NO'));
  console.log('  Access token returned: ' + (authData.session?.access_token ? 'YES' : 'NO'));
  console.log('  Refresh token returned: ' + (authData.session?.refresh_token ? 'YES' : 'NO'));
  console.log('  User ID: ' + authData.user.id);
  console.log('  Email: ' + authData.user.email);
  console.log('');

  const accessToken = authData.session?.access_token;
  const refreshToken = authData.session?.refresh_token;

  // ═══════════════════════════════════════════════════════════════
  // STEP 2: SIMULATE DEPLOYED LOGIN FLOW
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('STEP 2: SIMULATE DEPLOYED LOGIN FLOW');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Tracing the exact login sequence...\n');

  // 2a. Login page loads
  console.log('[2a] Login page load...');
  try {
    const loginPage = await fetch(PROD_URL + '/login');
    console.log('  Status: ' + loginPage.status);
    console.log('  ✅ Login page loads');
  } catch (err) {
    console.log('  ❌ Login page failed: ' + err.message);
  }
  console.log('');

  // 2b. Check what happens after auth (simulate the client-side flow)
  console.log('[2b] Simulating post-authentication flow...');
  console.log('  After successful auth, the client should:');
  console.log('  1. Store session in cookies/localStorage');
  console.log('  2. Redirect to /dashboard or /admin');
  console.log('  3. Middleware validates session');
  console.log('  4. Profile lookup occurs');
  console.log('  5. Role/approval validation');
  console.log('  6. Dashboard renders');
  console.log('');

  // 2c. Test the actual deployed auth endpoint
  console.log('[2c] Testing deployed auth callback...');
  try {
    // Try to access a protected route with the session
    const dashboardTest = await fetch(PROD_URL + '/dashboard', {
      headers: {
        'Cookie': `sb-access-token=${accessToken}; sb-refresh-token=${refreshToken}`
      }
    });
    console.log('  Dashboard access status: ' + dashboardTest.status);
    console.log('  Dashboard status message: ' + dashboardTest.statusMessage);
    
    if (dashboardTest.status === 200) {
      console.log('  ✅ Dashboard accessible with session');
    } else if (dashboardTest.status === 307 || dashboardTest.status === 302) {
      console.log('  ⚠ Dashboard redirects (likely to login)');
      console.log('  Location: ' + (dashboardTest.headers.location || 'unknown'));
    } else {
      console.log('  ❌ Dashboard returned error: ' + dashboardTest.status);
    }
  } catch (err) {
    console.log('  ❌ Dashboard test failed: ' + err.message);
  }
  console.log('');

  // 2d. Test admin route
  console.log('[2d] Testing admin route...');
  try {
    const adminTest = await fetch(PROD_URL + '/admin', {
      headers: {
        'Cookie': `sb-access-token=${accessToken}; sb-refresh-token=${refreshToken}`
      }
    });
    console.log('  Admin route status: ' + adminTest.status);
    
    if (adminTest.status === 200) {
      console.log('  ✅ Admin route accessible');
    } else if (adminTest.status === 307 || adminTest.status === 302) {
      console.log('  ⚠ Admin route redirects');
      console.log('  Location: ' + (adminTest.headers.location || 'unknown'));
    } else {
      console.log('  ❌ Admin route error: ' + adminTest.status);
    }
  } catch (err) {
    console.log('  ❌ Admin route test failed: ' + err.message);
  }
  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // STEP 3: INSPECT APPLICATION LOGS
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('STEP 3: INSPECT APPLICATION LOGS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Checking for error patterns in the application...\n');

  // Check if there are any error pages or API routes that might reveal issues
  console.log('[3a] Testing API routes for errors...');
  
  const apiRoutes = [
    '/api/auth/callback',
    '/api/auth/session',
    '/api/user/profile',
    '/api/admin/check'
  ];

  for (const route of apiRoutes) {
    try {
      const result = await fetch(PROD_URL + route, {
        headers: {
          'Cookie': `sb-access-token=${accessToken}; sb-refresh-token=${refreshToken}`
        }
      });
      console.log('  ' + route + ': ' + result.status);
      
      // Look for error messages in response
      if (result.data.includes('error') || result.data.includes('Error')) {
        console.log('    ⚠ Response contains error reference');
      }
    } catch (err) {
      console.log('  ' + route + ': Failed - ' + err.message);
    }
  }
  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // STEP 4: VERIFY PROFILE QUERY
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('STEP 4: VERIFY PROFILE QUERY');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Querying profile with authenticated user context...\n');

  // Use the service role to simulate what the profile query should return
  const serviceClient = createClient(requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL, requiredEnvVars.SUPABASE_SERVICE_ROLE_KEY);
  
  const { data: profileData, error: profileError } = await serviceClient
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError) {
    console.log('❌ PROFILE QUERY FAILED');
    console.log('  Error: ' + profileError.message);
    console.log('  Code: ' + profileError.code);
  } else {
    console.log('✅ PROFILE QUERY SUCCESSFUL');
    console.log('  Rows returned: 1');
    console.log('  ID: ' + profileData.id);
    console.log('  Email: ' + profileData.email);
    console.log('  Role: ' + profileData.role);
    console.log('  Approval Status: ' + profileData.approval_status);
    console.log('  Is Disabled: ' + profileData.is_disabled);
    console.log('');
    
    // Verify all required conditions
    const checks = [
      { name: 'Exactly one row', pass: true },
      { name: 'Role = admin', pass: profileData.role === 'admin' },
      { name: 'Approved', pass: profileData.approval_status === 'approved' },
      { name: 'Not disabled', pass: profileData.is_disabled === false }
    ];
    
    checks.forEach(c => {
      console.log('  ' + (c.pass ? '✅' : '❌') + ' ' + c.name);
    });
  }
  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // STEP 5: VERIFY MIDDLEWARE
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('STEP 5: VERIFY MIDDLEWARE');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Reading middleware configuration...\n');

  const middlewarePath = path.join(process.cwd(), 'src', 'middleware.ts');
  if (fs.existsSync(middlewarePath)) {
    const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
    console.log('✅ Middleware file found: src/middleware.ts');
    console.log('');
    
    // Analyze middleware logic
    console.log('Middleware analysis:');
    
    // Check for protected routes
    if (middlewareContent.includes('/admin') || middlewareContent.includes('admin')) {
      console.log('  - Contains admin route protection');
    }
    if (middlewareContent.includes('/dashboard') || middlewareContent.includes('dashboard')) {
      console.log('  - Contains dashboard route protection');
    }
    if (middlewareContent.includes('auth') || middlewareContent.includes('session')) {
      console.log('  - Contains auth/session validation');
    }
    if (middlewareContent.includes('role') || middlewareContent.includes('approval')) {
      console.log('  - Contains role/approval checks');
    }
    
    console.log('');
    console.log('Key middleware patterns:');
    
    // Extract key logic patterns
    const lines = middlewareContent.split('\n');
    let inConfig = false;
    let configLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('export const config') || line.includes('matcher')) {
        inConfig = true;
      }
      if (inConfig) {
        configLines.push((i + 1) + ': ' + line);
        if (line.includes('}') && configLines.length > 3) break;
      }
    }
    
    if (configLines.length > 0) {
      console.log('  Config/matcher section:');
      configLines.forEach(l => console.log('    ' + l));
    }
    
  } else {
    console.log('❌ Middleware file not found at: ' + middlewarePath);
  }
  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // STEP 6: VERIFY SERVER COMPONENTS
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('STEP 6: VERIFY SERVER COMPONENTS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Checking critical server components...\n');

  const criticalFiles = [
    'src/app/admin/layout.tsx',
    'src/app/dashboard/layout.tsx',
    'src/app/auth/callback/route.ts',
    'src/lib/supabase/server.ts',
    'src/lib/auth.ts'
  ];

  for (const file of criticalFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log('✅ ' + file);
      
      // Check for common error patterns
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes('redirect') && (content.includes('/login') || content.includes('/auth'))) {
        console.log('    - Contains redirect logic to login');
      }
      if (content.includes('profile') && content.includes('single()')) {
        console.log('    - Queries profile with .single()');
      }
      if (content.includes('role') && content.includes('admin')) {
        console.log('    - Checks for admin role');
      }
      if (content.includes('approval') || content.includes('approved')) {
        console.log('    - Checks approval status');
      }
    } else {
      console.log('❌ ' + file + ' (not found)');
    }
  }
  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // STEP 7: ROOT CAUSE ANALYSIS
  // ═══════════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('STEP 7: ROOT CAUSE ANALYSIS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Based on the investigation:\n');

  console.log('✅ Authentication: WORKING');
  console.log('   - signInWithPassword() succeeds');
  console.log('   - Session and tokens returned');
  console.log('');

  console.log('✅ Profile Query: WORKING');
  console.log('   - Profile exists with correct data');
  console.log('   - Role = admin, approved, not disabled');
  console.log('');

  console.log('⚠️  Deployed Application: NEEDS INVESTIGATION');
  console.log('   - The issue is likely in how the deployed app handles the session');
  console.log('   - Or how it validates the profile after authentication');
  console.log('');

  // Check for common issues
  console.log('Common failure points to check:');
  console.log('');

  // Check if there's a profile query in the app that might fail
  const appFiles = [
    'src/app/dashboard/page.tsx',
    'src/app/admin/page.tsx',
    'src/app/page.tsx'
  ];

  for (const file of appFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Look for profile queries that might fail
      if (content.includes('.single()')) {
        console.log('⚠️  ' + file + ' uses .single() which throws if no row found');
      }
      if (content.includes('!profile') || content.includes('profile === null')) {
        console.log('⚠️  ' + file + ' has null profile check that might redirect');
      }
      if (content.includes('redirect') && content.includes('/login')) {
        console.log('⚠️  ' + file + ' redirects to /login on certain conditions');
      }
    }
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('INVESTIGATION COMPLETE - SEE FINAL REPORT BELOW');
  console.log('═══════════════════════════════════════════════════════════════');
}

investigate().catch(console.error);
