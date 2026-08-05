const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const pendingRequests = new Map();
  const allRequests = [];

  page.on('request', (request) => {
    const entry = {
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      timestamp: Date.now(),
      status: 'pending',
    };
    allRequests.push(entry);
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
      entry.status = 'failed: ' + (request.failure()?.errorText || 'unknown');
      pendingRequests.delete(request.url());
    }
  });

  // Go to production login
  console.log('=== STEP 1: Navigate to production login ===');
  await page.goto('https://ascynpro.com/login', { waitUntil: 'networkidle', timeout: 30000 });

  console.log('=== STEP 2: Fill login form ===');
  await page.fill('input[type="email"]', 'instructor@ascyn-smoke.test');
  await page.fill('input[type="password"]', 'SmokeTest2026!');

  console.log('=== STEP 3: Submit login ===');
  
  // Clear tracking before submit
  allRequests.length = 0;
  pendingRequests.clear();
  
  await page.click('button[type="submit"]');

  // Wait for navigation
  await page.waitForTimeout(10000);
  console.log('Current URL after login:', page.url());

  // If we're on instructor page, try to get to admin
  if (page.url().includes('/instructor')) {
    console.log('On instructor page. This account is not admin.');
    console.log('Trying to navigate to /admin directly...');
    
    allRequests.length = 0;
    pendingRequests.clear();
    
    await page.goto('https://ascynpro.com/admin', { timeout: 30000 }).catch(e => {
      console.log('Navigation error:', e.message);
    });
    await page.waitForTimeout(10000);
    console.log('URL:', page.url());
  }

  // Report pending requests
  console.log('\n=== ALL REQUESTS ===');
  for (const req of allRequests) {
    const status = req.status === 'pending' ? '⏳ PENDING' : `${req.status}`;
    const duration = req.duration ? `${req.duration}ms` : 'STILL WAITING';
    console.log(`${status} | ${req.method} ${req.url.substring(0, 120)} | ${req.resourceType} | ${duration}`);
  }

  console.log('\n=== PENDING REQUESTS ===');
  if (pendingRequests.size === 0) {
    console.log('No pending requests.');
  } else {
    for (const [url, entry] of pendingRequests) {
      console.log(`⏳ PENDING: ${entry.method} ${url}`);
      console.log(`   Type: ${entry.resourceType} | Waiting: ${Date.now() - entry.timestamp}ms`);
    }
  }

  await page.screenshot({ path: 'prod-admin.png', fullPage: true });
  await browser.close();
})();
