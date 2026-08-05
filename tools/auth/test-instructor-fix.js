// Test instructor login after school assignment fix
const { chromium } = require('playwright');

const BASE_URL = 'https://ascynpro.com';

async function testInstructor() {
  console.log('=== Testing INSTRUCTOR after fix ===\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Navigate to login
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Login page loaded');

    // 2. Fill login form
    const emailInput = page.locator('input[type="email"], input[name="email"], input[id="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"], input[id="password"]').first();
    
    await emailInput.fill('instructor@ascyn-smoke.test');
    await passwordInput.fill('SmokeTest123!');
    console.log('✅ Form filled');

    // 3. Submit login
    const submitBtn = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Log In"), button:has-text("Login")').first();
    await submitBtn.click();
    
    // Wait for navigation
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 15000 });
    const landedUrl = page.url();
    const landedPath = new URL(landedUrl).pathname;
    
    console.log(`✅ Redirected to: ${landedPath}`);
    
    if (landedPath.startsWith('/instructor')) {
      console.log('✅ SUCCESS: Instructor landed on /instructor');
      
      // Check for portal content
      const hasContent = await page.locator('text=/Dashboard|Students|Attendance|Gradebook/i').count() > 0;
      console.log(hasContent ? '✅ Portal content found' : '❌ Portal content missing');
      
      // Check for logout button
      const hasLogout = await page.locator('button:has-text("Sign Out"), button:has-text("Log Out"), button:has-text("Logout")').count() > 0;
      console.log(hasLogout ? '✅ Logout button found' : '❌ Logout button missing');
      
    } else if (landedPath.startsWith('/pending-approval')) {
      console.log('❌ FAIL: Still redirected to /pending-approval');
    } else if (landedPath.startsWith('/dashboard')) {
      console.log('❌ FAIL: Redirected to /dashboard instead of /instructor');
    } else {
      console.log(`❌ FAIL: Unexpected redirect to ${landedPath}`);
    }

  } catch (err) {
    console.log('❌ Test error:', err.message);
  } finally {
    await context.close();
    await browser.close();
  }
}

testInstructor().catch(console.error);
