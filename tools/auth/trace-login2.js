const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login first
  console.log('=== STEP 1: Navigate to login ===');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 30000 });

  console.log('=== STEP 2: Fill login form ===');
  await page.fill('input[type="email"]', 'instructor@ascyn-smoke.test');
  await page.fill('input[type="password"]', 'SmokeTest2026!');

  console.log('=== STEP 3: Submit login ===');
  await page.click('button[type="submit"]');

  // Wait for any navigation
  await page.waitForTimeout(8000);
  console.log('Current URL after login:', page.url());
  await page.screenshot({ path: 'after-login-smoke.png', fullPage: true });

  await browser.close();
})();
