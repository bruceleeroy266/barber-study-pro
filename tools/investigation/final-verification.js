// Final production verification after all fixes
const { chromium } = require('playwright');

const BASE_URL = 'https://ascynpro.com';
const results = [];
let defectCount = 0;

function log(role, test, pass, detail) {
  const status = pass ? 'PASS' : 'FAIL';
  const icon = pass ? '✅' : '❌';
  console.log(`  ${icon} [${role}] ${test}: ${status}${detail ? ' — ' + detail : ''}`);
  results.push({ role, test, pass, detail });
  if (!pass) defectCount++;
}

async function testRole(browser, email, password, role, expectedPath, portalChecks) {
  console.log(`\n=== Testing ${role.toUpperCase()} ===`);
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Navigate to login
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    log(role, 'Login page loads', page.url().includes('/login'));

    // 2. Fill login form
    const emailInput = page.locator('input[type="email"], input[name="email"], input[id="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"], input[id="password"]').first();
    
    await emailInput.fill(email);
    await passwordInput.fill(password);
    log(role, 'Form fields fillable', true);

    // 3. Submit login
    const submitBtn = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Log In"), button:has-text("Login")').first();
    await submitBtn.click();
    
    // Wait for navigation
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 15000 });
    const landedUrl = page.url();
    const landedPath = new URL(landedUrl).pathname;
    
    log(role, `Redirects to ${expectedPath}`, landedPath.startsWith(expectedPath), `landed on ${landedPath}`);

    // 4. Check for error states
    const hasError = await page.locator('text=/error|Error|ERROR|failed|Failed/').count() > 0;
    log(role, 'No error messages on portal', !hasError);

    // 5. Check for placeholder/Coming Soon
    const hasPlaceholder = await page.locator('text=/coming soon|Coming Soon|COMING SOON|placeholder|Placeholder/').count() > 0;
    log(role, 'No placeholder/Coming Soon content', !hasPlaceholder);

    // 6. Portal-specific checks
    if (portalChecks && portalChecks.length > 0) {
      for (const check of portalChecks) {
        const found = await page.locator(`text=/${check}/i`).count() > 0;
        log(role, `Portal contains "${check}"`, found);
      }
    }

    // 7. Test role isolation - try to access other portals
    const otherPaths = ['/admin', '/instructor', '/dashboard'].filter(p => p !== expectedPath);
    for (const otherPath of otherPaths) {
      await page.goto(`${BASE_URL}${otherPath}`, { waitUntil: 'networkidle', timeout: 15000 });
      const currentPath = new URL(page.url()).pathname;
      const wasRedirected = !currentPath.startsWith(otherPath) || currentPath.startsWith(expectedPath);
      log(role, `Blocked from ${otherPath}`, wasRedirected, `ended on ${currentPath}`);
    }

    // 8. Navigate back to own portal for logout test
    await page.goto(`${BASE_URL}${expectedPath}`, { waitUntil: 'networkidle', timeout: 15000 });

    // 9. Test logout
    const logoutBtn = page.locator('button:has-text("Sign Out"), button:has-text("Log Out"), button:has-text("Logout"), button:has-text("Sign out"), a:has-text("Sign Out"), a:has-text("Log Out"), a:has-text("Logout")').first();
    const logoutExists = await logoutBtn.count() > 0;
    log(role, 'Logout button exists', logoutExists);

    if (logoutExists) {
      await logoutBtn.click();
      await page.waitForURL(url => {
        const p = new URL(url.toString()).pathname;
        return p === '/' || p === '/login';
      }, { timeout: 15000 });
      const afterLogoutPath = new URL(page.url()).pathname;
      log(role, 'Logout redirects to / or /login', afterLogoutPath === '/' || afterLogoutPath === '/login', `on ${afterLogoutPath}`);

      // 10. Test back-button protection
      await page.goBack();
      await page.waitForTimeout(2000);
      const backPath = new URL(page.url()).pathname;
      const backBlocked = !backPath.startsWith(expectedPath);
      log(role, 'Back button blocked after logout', backBlocked, `back went to ${backPath}`);

      // 11. Test direct URL access after logout
      await page.goto(`${BASE_URL}${expectedPath}`, { waitUntil: 'networkidle', timeout: 15000 });
      const directPath = new URL(page.url()).pathname;
      const directBlocked = !directPath.startsWith(expectedPath);
      log(role, 'Direct URL blocked after logout', directBlocked, `direct access went to ${directPath}`);
    }

  } catch (err) {
    log(role, 'Test execution', false, err.message);
  } finally {
    await context.close();
  }
}

async function testHomepage(browser) {
  console.log('\n=== Testing HOMEPAGE ===');
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    const title = await page.title();
    log('homepage', 'Page loads with title', title.length > 0, title);
    
    // Check for login link
    const hasLoginLink = await page.locator('a:has-text("Pilot Login"), a:has-text("Login"), a:has-text("Sign In"), button:has-text("Pilot Login")').count() > 0;
    log('homepage', 'Has login link/button', hasLoginLink);

    // Check no error states
    const hasError = await page.locator('text=/error|Error|ERROR|500|404|not found/').count() > 0;
    log('homepage', 'No error messages', !hasError);

  } catch (err) {
    log('homepage', 'Page load', false, err.message);
  } finally {
    await context.close();
  }
}

async function main() {
  console.log('=== ASCYN PRO FINAL PRODUCTION VERIFICATION ===');
  console.log(`URL: ${BASE_URL}`);
  console.log(`Time: ${new Date().toISOString()}\n`);

  const browser = await chromium.launch({ headless: true });

  // Test homepage
  await testHomepage(browser);

  // Test Admin
  await testRole(browser, 'admin@ascyn-smoke.test', 'SmokeTest123!', 'admin', '/admin', [
    'Dashboard', 'Users', 'School', 'Audit', 'Health', 'Maintenance', 'Pilot'
  ]);

  // Test Instructor
  await testRole(browser, 'instructor@ascyn-smoke.test', 'SmokeTest123!', 'instructor', '/instructor', [
    'Dashboard', 'Students', 'Attendance', 'Gradebook', 'Compliance', 'Messages', 'Reports'
  ]);

  // Test Student
  await testRole(browser, 'student@ascyn-smoke.test', 'SmokeTest123!', 'student', '/dashboard', [
    'Dashboard', 'Chapters', 'Flashcards', 'Progress', 'Grades', 'Messages', 'Compliance'
  ]);

  await browser.close();

  // Summary
  console.log('\n=== SUMMARY ===');
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  console.log(`Total tests: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter(r => !r.pass).forEach(r => {
      console.log(`  ❌ [${r.role}] ${r.test}: ${r.detail || 'FAILED'}`);
    });
  }

  console.log(`\nDefects found: ${defectCount}`);
  
  if (defectCount === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Production is ready for pilot launch.');
  } else {
    console.log('\n⚠️  Some tests failed. Review defects above.');
  }
  
  process.exit(defectCount > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
