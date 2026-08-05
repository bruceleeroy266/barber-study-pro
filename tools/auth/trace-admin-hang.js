const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const requests = [];
  const pendingRequests = new Map();

  // Track all requests
  page.on('request', (request) => {
    const entry = {
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      timestamp: Date.now(),
      status: 'pending',
    };
    requests.push(entry);
    pendingRequests.set(request.url(), entry);
  });

  page.on('response', (response) => {
    const entry = pendingRequests.get(response.url());
    if (entry) {
      entry.status = response.status();
      entry.completedAt = Date.now();
      entry.duration = entry.completedAt - entry.timestamp;
      pendingRequests.delete(response.url());
    }
  });

  page.on('requestfailed', (request) => {
    const entry = pendingRequests.get(request.url());
    if (entry) {
      entry.status = 'failed';
      entry.failure = request.failure()?.errorText;
      pendingRequests.delete(request.url());
    }
  });

  // Login first
  console.log('=== STEP 1: Navigate to login ===');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 30000 });

  console.log('=== STEP 2: Fill login form ===');
  await page.fill('input[type="email"]', 'admin@ascyn.com');
  await page.fill('input[type="password"]', 'AscynAdmin2026!');

  console.log('=== STEP 3: Submit login ===');
  await page.click('button[type="submit"]');

  // Wait for navigation to /admin
  await page.waitForURL('**/admin**', { timeout: 15000 });
  console.log('Current URL after login:', page.url());

  // Clear previous request tracking to focus on admin dashboard requests
  requests.length = 0;
  pendingRequests.clear();

  console.log('\n=== STEP 4: Wait for admin dashboard to fully load ===');
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
    console.log('WARNING: networkidle not reached within 30s — requests are still pending!');
  });

  // Wait additional time for any hanging requests
  console.log('\n=== STEP 5: Waiting 15 more seconds for hanging requests ===');
  await page.waitForTimeout(15000);

  // Report all requests
  console.log('\n=== ALL REQUESTS ===');
  for (const req of requests) {
    const status = req.status === 'pending' ? '⏳ PENDING' : `✅ ${req.status}`;
    const duration = req.duration ? `${req.duration}ms` : 'N/A';
    console.log(`${status} | ${req.method} ${req.url} | ${req.resourceType} | ${duration}`);
  }

  // Report pending requests
  console.log('\n=== PENDING REQUESTS (never resolved) ===');
  if (pendingRequests.size === 0) {
    console.log('No pending requests on /admin dashboard.');
  } else {
    for (const [url, entry] of pendingRequests) {
      console.log(`⏳ PENDING: ${entry.method} ${url}`);
      console.log(`   Resource Type: ${entry.resourceType}`);
      console.log(`   Started: ${new Date(entry.timestamp).toISOString()}`);
      console.log(`   Waiting for: ${Date.now() - entry.timestamp}ms`);
    }
  }

  // Now try navigating to Users page
  console.log('\n=== STEP 6: Navigate to Users ===');
  requests.length = 0;
  pendingRequests.clear();

  try {
    await page.click('a[href="/admin/users"]', { timeout: 5000 });
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {
      console.log('WARNING: Users page networkidle not reached within 20s!');
    });
    await page.waitForTimeout(10000);
  } catch (e) {
    console.log('Failed to navigate to Users:', e.message);
  }

  console.log('\n=== PENDING REQUESTS on Users page ===');
  if (pendingRequests.size === 0) {
    console.log('No pending requests on Users page.');
  } else {
    for (const [url, entry] of pendingRequests) {
      console.log(`⏳ PENDING: ${entry.method} ${url}`);
      console.log(`   Resource Type: ${entry.resourceType}`);
      console.log(`   Waiting for: ${Date.now() - entry.timestamp}ms`);
    }
  }

  // Try Health page
  console.log('\n=== STEP 7: Navigate to Health ===');
  requests.length = 0;
  pendingRequests.clear();

  try {
    await page.click('a[href="/admin/health"]', { timeout: 5000 });
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {
      console.log('WARNING: Health page networkidle not reached within 20s!');
    });
    await page.waitForTimeout(10000);
  } catch (e) {
    console.log('Failed to navigate to Health:', e.message);
  }

  console.log('\n=== PENDING REQUESTS on Health page ===');
  if (pendingRequests.size === 0) {
    console.log('No pending requests on Health page.');
  } else {
    for (const [url, entry] of pendingRequests) {
      console.log(`⏳ PENDING: ${entry.method} ${url}`);
      console.log(`   Resource Type: ${entry.resourceType}`);
      console.log(`   Waiting for: ${Date.now() - entry.timestamp}ms`);
    }
  }

  // Take screenshot
  await page.screenshot({ path: 'admin-trace-final.png', fullPage: true });

  await browser.close();

  console.log('\n=== INVESTIGATION COMPLETE ===');
})();
