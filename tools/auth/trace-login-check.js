const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login first
  console.log('=== STEP 1: Navigate to login ===');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 30000 });

  console.log('=== STEP 2: Fill login form ===');
  await page.fill('input[type="email"]', 'admin@ascyn.com');
  await page.fill('input[type="password"]', 'AscynAdmin2026!');

  console.log('=== STEP 3: Submit login ===');
  await page.click('button[type="submit"]');

  // Wait for any navigation
  await page.waitForTimeout(5000);
  console.log('Current URL after login:', page.url());

  // Take screenshot to see what page we're on
  await page.screenshot({ path: 'after-login.png', fullPage: true });

  // If not on admin, try navigating directly
  if (!page.url().includes('/admin')) {
    console.log('Not on /admin, navigating directly...');
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('URL after direct nav:', page.url());
    await page.screenshot({ path: 'admin-direct.png', fullPage: true });
  }

  await browser.close();
})();
