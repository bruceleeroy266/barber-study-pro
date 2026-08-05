// Focused test for remaining defects
const { chromium } = require('playwright');

const BASE_URL = 'https://ascynpro.com';

async function testRemainingDefects() {
  console.log('=== TESTING REMAINING DEFECTS ===\n');
  
  const browser = await chromium.launch({ headless: true });
  
  // Test 1: Check if instructor logout button exists after deployment
  console.log('1. Testing instructor logout button...');
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();
  
  try {
    await page1.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page1.locator('input[type="email"]').fill('instructor@ascyn-smoke.test');
    await page1.locator('input[type="password"]').fill('SmokeTest123!');
    await page1.locator('button[type="submit"]').click();
    
    await page1.waitForURL(url => !url.pathname.includes('/login'), { timeout: 15000 });
    const path = new URL(page1.url()).pathname;
    console.log(`   Landed on: ${path}`);
    
    if (path.startsWith('/instructor')) {
      const logoutBtn = await page1.locator('button:has-text("Logout"), button:has-text("Sign Out"), button:has-text("Log Out")').count();
      console.log(`   Logout buttons found: ${logoutBtn}`);
      console.log(logoutBtn > 0 ? '   ✅ PASS' : '   ❌ FAIL - No logout button');
    }
  } catch (err) {
    console.log(`   ❌ ERROR: ${err.message}`);
  } finally {
    await context1.close();
  }
  
  // Test 2: Check if student flashcards navigation exists
  console.log('\n2. Testing student flashcards navigation...');
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  
  try {
    await page2.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page2.locator('input[type="email"]').fill('student@ascyn-smoke.test');
    await page2.locator('input[type="password"]').fill('SmokeTest123!');
    await page2.locator('button[type="submit"]').click();
    
    await page2.waitForURL(url => !url.pathname.includes('/login'), { timeout: 15000 });
    const path = new URL(page2.url()).pathname;
    console.log(`   Landed on: ${path}`);
    
    if (path.startsWith('/dashboard')) {
      const flashcardsLink = await page2.locator('a:has-text("Flashcards"), text=/Flashcards/i').count();
      console.log(`   Flashcards links found: ${flashcardsLink}`);
      console.log(flashcardsLink > 0 ? '   ✅ PASS' : '   ❌ FAIL - No flashcards navigation');
    }
  } catch (err) {
    console.log(`   ❌ ERROR: ${err.message}`);
  } finally {
    await context2.close();
  }
  
  // Test 3: Check what placeholder text is being detected
  console.log('\n3. Checking for placeholder text...');
  const context3 = await browser.newContext();
  const page3 = await context3.newPage();
  
  try {
    await page3.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page3.locator('input[type="email"]').fill('admin@ascyn-smoke.test');
    await page3.locator('input[type="password"]').fill('SmokeTest123!');
    await page3.locator('button[type="submit"]').click();
    
    await page3.waitForURL(url => !url.pathname.includes('/login'), { timeout: 15000 });
    
    // Get all text content and check for placeholder patterns
    const bodyText = await page3.textContent('body');
    const hasComingSoon = /coming soon|Coming Soon|COMING SOON/i.test(bodyText);
    const hasPlaceholder = /placeholder|Placeholder/i.test(bodyText);
    
    console.log(`   "Coming Soon" found: ${hasComingSoon}`);
    console.log(`   "Placeholder" found: ${hasPlaceholder}`);
    
    if (hasComingSoon || hasPlaceholder) {
      // Find the specific elements
      const comingSoonElements = await page3.locator('text=/coming soon|Coming Soon|COMING SOON/i').count();
      const placeholderElements = await page3.locator('text=/placeholder|Placeholder/i').count();
      console.log(`   Coming Soon elements: ${comingSoonElements}`);
      console.log(`   Placeholder elements: ${placeholderElements}`);
    }
    
  } catch (err) {
    console.log(`   ❌ ERROR: ${err.message}`);
  } finally {
    await context3.close();
  }
  
  await browser.close();
  
  console.log('\n=== ANALYSIS COMPLETE ===');
  console.log('If issues persist, Vercel deployment may still be in progress.');
  console.log('Wait 2-3 minutes and re-run this test.');
}

testRemainingDefects().catch(console.error);
