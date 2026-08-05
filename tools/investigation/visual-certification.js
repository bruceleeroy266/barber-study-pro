const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, 'certification-screenshots');
const BASE_URL = 'http://localhost:3000';

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function takeScreenshot(page, name) {
  const filepath = path.join(SCREENSHOT_DIR, `${name}.png`);
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`Screenshot saved: ${filepath}`);
  return filepath;
}

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const results = {
    build: { success: true, timestamp: new Date().toISOString() },
    pages: {},
    errors: [],
    consoleErrors: []
  };

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      results.consoleErrors.push({
        page: page.url(),
        text: msg.text(),
        timestamp: new Date().toISOString()
      });
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    results.errors.push({
      page: page.url(),
      error: error.message,
      timestamp: new Date().toISOString()
    });
  });

  try {
    // Phase 1: Launch - Login Page
    console.log('Navigating to login page...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await takeScreenshot(page, '01-login-page');
    results.pages.login = { url: page.url(), status: 'loaded' };

    // Check for demo mode or login form
    const pageContent = await page.content();
    const hasLoginForm = pageContent.includes('email') || pageContent.includes('password');
    const isDemoMode = pageContent.includes('demo') || pageContent.includes('Demo');
    
    results.pages.login.hasLoginForm = hasLoginForm;
    results.pages.login.isDemoMode = isDemoMode;

    console.log('Login page loaded. Has login form:', hasLoginForm);
    console.log('Page title:', await page.title());

    // Save initial results
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, 'initial-results.json'),
      JSON.stringify(results, null, 2)
    );

    console.log('\n=== INITIAL CERTIFICATION RESULTS ===');
    console.log(JSON.stringify(results, null, 2));

  } catch (error) {
    console.error('Error during certification:', error);
    results.errors.push({ phase: 'launch', error: error.message });
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
