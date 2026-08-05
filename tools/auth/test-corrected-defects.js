// Corrected test for remaining defects
const { chromium } = require('playwright');

const BASE_URL = 'https://ascynpro.com';

async function testRemainingDefects() {
  console.log('=== CORRECTED REMAINING DEFECTS TEST ===\n');
  
  const browser = await chromium.launch({ headless: true });
  
  // Test 1: Check instructor logout button
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
      // Check for navigation sidebar
      const navExists = await page1.locator('nav, aside, [role="navigation"]').count() > 0;
      console.log(`   Navigation found: ${navExists}`);
      
      // Check for logout button with multiple selectors
      const logoutSelectors = [
        'button:has-text("Logout")',
        'button:has-text("Sign Out")', 
        'button:has-text("Log Out")',
        'a:has-text("Logout")',
        'a:has-text("Sign Out")',
        '[data-testid="logout"]',
        'button[aria-label*="logout" i]',
        'button[aria-label*="sign out" i]'
      ];
      
      let logoutFound = false;
      for (const selector of logoutSelectors) {
        const count = await page1.locator(selector).count();
        if (count > 0) {
          console.log(`   Logout found with selector: ${selector}`);
          logoutFound = true;
          break;
        }
      }
      
      console.log(logoutFound ? '   ✅ PASS - Logout button found' : '   ❌ FAIL - No logout button');
      
      // If no logout, check what's actually on the page
      if (!logoutFound) {
        const bodyText = await page1.textContent('body');
        const hasNav = bodyText.includes('Dashboard') && bodyText.includes('Students');
        console.log(`   Page has nav content: ${hasNav}`);
        console.log(`   Page title: ${await page1.title()}`);
      }
    }
  } catch (err) {
    console.log(`   ❌ ERROR: ${err.message}`);
  } finally {
    await context1.close();
  }
  
  // Test 2: Check student flashcards navigation
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
      // Check for flashcards in navigation
      const flashcardsLink = await page2.locator('a:has-text("Flashcards")').count();
      const flashcardsText = await page2.locator('text=Flashcards').count();
      
      console.log(`   Flashcards links: ${flashcardsLink}`);
      console.log(`   Flashcards text elements: ${flashcardsText}`);
      
      const hasFlashcards = flashcardsLink > 0 || flashcardsText > 0;
      console.log(hasFlashcards ? '   ✅ PASS - Flashcards found' : '   ❌ FAIL - No flashcards');
    }
  } catch (err) {
    console.log(`   ❌ ERROR: ${err.message}`);
  } finally {
    await context2.close();
  }
  
  await browser.close();
  
  console.log('\n=== TEST COMPLETE ===');
}

testRemainingDefects().catch(console.error);
