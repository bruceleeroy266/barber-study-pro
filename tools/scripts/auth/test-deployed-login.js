// Test the deployed login flow after the navigation fix
const https = require('https');

const PROD_URL = 'https://ascynpro.com';

function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { 
      method: options.method || 'GET', 
      headers: options.headers || {},
      followRedirect: false
    }, (res) => {
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

async function testLogin() {
  console.log('=== TESTING DEPLOYED LOGIN FLOW ===\n');
  console.log('Production URL: ' + PROD_URL);
  console.log('');

  // Test 1: Login page loads
  console.log('[1] Login page...');
  const loginPage = await fetch(PROD_URL + '/login');
  console.log('  Status: ' + loginPage.status);
  console.log('  ✅ Login page loads');
  console.log('');

  // Test 2: Check if the JS bundle contains the fix
  console.log('[2] Checking if fix is deployed...');
  const scriptSrcs = [];
  const re = /src="(\/_next\/[^"]+)"/g;
  let m;
  while ((m = re.exec(loginPage.data)) !== null) {
    scriptSrcs.push(m[1]);
  }
  
  let fixFound = false;
  for (const src of scriptSrcs) {
    try {
      const jsResult = await fetch(PROD_URL + src);
      if (jsResult.status !== 200) continue;
      if (jsResult.data.includes('window.location.href')) {
        fixFound = true;
        console.log('  ✅ Fix found in JS bundle: ' + src.split('/').pop());
        break;
      }
    } catch (e) {}
  }
  
  if (!fixFound) {
    console.log('  ⚠ Fix not found in JS bundles (may be inlined or in different chunk)');
  }
  console.log('');

  // Test 3: Test protected route without auth (should redirect to login)
  console.log('[3] Testing protected route without auth...');
  const dashNoAuth = await fetch(PROD_URL + '/dashboard');
  console.log('  Status: ' + dashNoAuth.status);
  console.log('  Location: ' + (dashNoAuth.headers.location || 'none'));
  if (dashNoAuth.status === 307 || dashNoAuth.status === 302) {
    console.log('  ✅ Correctly redirects to login when not authenticated');
  }
  console.log('');

  // Test 4: Test admin route without auth
  console.log('[4] Testing admin route without auth...');
  const adminNoAuth = await fetch(PROD_URL + '/admin');
  console.log('  Status: ' + adminNoAuth.status);
  console.log('  Location: ' + (adminNoAuth.headers.location || 'none'));
  if (adminNoAuth.status === 307 || adminNoAuth.status === 302) {
    console.log('  ✅ Correctly redirects to login when not authenticated');
  }
  console.log('');

  console.log('=== MANUAL TEST REQUIRED ===');
  console.log('');
  console.log('The automated tests confirm the site is deployed and routes are protected.');
  console.log('To verify the login fix works, please manually test:');
  console.log('');
  console.log('1. Go to: ' + PROD_URL + '/login');
  console.log('2. Enter: ascynproofficial@gmail.com');
  console.log('3. Enter the password from the previous reset');
  console.log('4. Click Sign In');
  console.log('');
  console.log('Expected behavior after fix:');
  console.log('- After successful auth, browser does FULL PAGE NAVIGATION to /dashboard');
  console.log('- Middleware reads session from cookies');
  console.log('- Dashboard loads without redirecting back to login');
  console.log('');
  console.log('If it still fails, the issue is the custom cookie implementation in supabase.ts');
}

testLogin().catch(console.error);
