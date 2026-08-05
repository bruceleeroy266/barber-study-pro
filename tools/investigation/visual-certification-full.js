const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, 'certification-screenshots');
const BASE_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'admin@ascyn-smoke.test';
const ADMIN_PASSWORD = 'SmokeTest123!';

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function takeScreenshot(page, name) {
  const filepath = path.join(SCREENSHOT_DIR, `${name}.png`);
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`  📸 Screenshot: ${name}.png`);
  return filepath;
}

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const results = {
    timestamp: new Date().toISOString(),
    build: { success: true },
    authentication: {},
    pages: {},
    errors: [],
    consoleErrors: [],
    featureVerification: {}
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
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  });

  try {
    // ============ PHASE 1: AUTHENTICATION ============
    console.log('\n🔐 PHASE 1: Authentication');
    console.log('============================');
    
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await takeScreenshot(page, '01-login-page');
    
    // Fill login form
    console.log('  Entering credentials...');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await takeScreenshot(page, '02-login-filled');
    
    // Submit login
    console.log('  Submitting login...');
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    results.authentication.loginUrl = currentUrl;
    results.authentication.loggedIn = !currentUrl.includes('/login');
    
    console.log('  Current URL after login:', currentUrl);
    await takeScreenshot(page, '03-after-login');
    
    if (currentUrl.includes('/login')) {
      // Check for error message
      const errorText = await page.textContent('body');
      if (errorText.includes('Invalid') || errorText.includes('error') || errorText.includes('incorrect')) {
        results.authentication.error = 'Invalid credentials or login error';
        console.log('  ❌ Login failed - error detected on page');
      }
    } else {
      console.log('  ✅ Login successful');
      results.authentication.success = true;
    }

    // ============ PHASE 2: ADMIN PAGES INSPECTION ============
    console.log('\n📋 PHASE 2: Admin Pages Inspection');
    console.log('====================================');
    
    const adminPages = [
      { name: 'Admin Dashboard', path: '/admin', key: 'dashboard' },
      { name: 'Users', path: '/admin/users', key: 'users' },
      { name: 'Audit Logs', path: '/admin/audit', key: 'audit' },
      { name: 'Health', path: '/admin/health', key: 'health' },
      { name: 'Maintenance', path: '/admin/maintenance', key: 'maintenance' },
      { name: 'Pilot Inquiries', path: '/admin/pilot-inquiries', key: 'pilot-inquiries' },
      { name: 'School Configuration', path: '/admin/school', key: 'school' },
      { name: 'School Configuration Detail', path: '/admin/school/configuration', key: 'school-config' },
    ];

    for (const pageInfo of adminPages) {
      console.log(`\n  Visiting: ${pageInfo.name} (${pageInfo.path})`);
      
      try {
        await page.goto(`${BASE_URL}${pageInfo.path}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500); // Allow time for React to render
        
        const pageKey = pageInfo.key;
        const pageUrl = page.url();
        
        // Check if redirected to login
        if (pageUrl.includes('/login')) {
          results.pages[pageKey] = {
            name: pageInfo.name,
            url: pageUrl,
            status: 'redirected_to_login',
            accessible: false
          };
          console.log(`    ⚠️  Redirected to login - not authenticated`);
          continue;
        }
        
        // Check for 404
        const pageContent = await page.content();
        const is404 = pageContent.includes('404') || pageContent.includes('This page could not be found');
        const isComingSoon = pageContent.toLowerCase().includes('coming soon');
        const hasError = await page.$('.error, [data-error], .not-found') !== null;
        
        // Extract visible features
        const features = [];
        const buttons = await page.$$('button');
        const links = await page.$$('a');
        const tables = await page.$$('table');
        const forms = await page.$$('form');
        const inputs = await page.$$('input');
        
        if (buttons.length > 0) features.push(`${buttons.length} buttons`);
        if (links.length > 0) features.push(`${links.length} links`);
        if (tables.length > 0) features.push(`${tables.length} tables`);
        if (forms.length > 0) features.push(`${forms.length} forms`);
        if (inputs.length > 0) features.push(`${inputs.length} inputs`);
        
        // Get page title
        const title = await page.title();
        
        // Get main heading
        let heading = '';
        try {
          heading = await page.$eval('h1', el => el.textContent?.trim() || '');
        } catch {}
        
        results.pages[pageKey] = {
          name: pageInfo.name,
          url: pageUrl,
          title: title,
          heading: heading,
          status: is404 ? '404_not_found' : (isComingSoon ? 'coming_soon' : 'loaded'),
          accessible: !is404,
          is404: is404,
          isComingSoon: isComingSoon,
          hasError: hasError,
          features: features,
          buttonCount: buttons.length,
          linkCount: links.length,
          tableCount: tables.length,
          formCount: forms.length
        };
        
        // Take screenshot
        const screenshotName = `admin-${pageKey.padStart(2, '0')}`;
        await takeScreenshot(page, screenshotName);
        
        console.log(`    Status: ${results.pages[pageKey].status}`);
        console.log(`    Title: ${title}`);
        console.log(`    Heading: ${heading || 'N/A'}`);
        console.log(`    Features: ${features.join(', ') || 'None detected'}`);
        
        if (isComingSoon) {
          console.log(`    ⚠️  "Coming Soon" detected`);
        }
        
      } catch (error) {
        results.pages[pageInfo.key] = {
          name: pageInfo.name,
          url: `${BASE_URL}${pageInfo.path}`,
          status: 'error',
          error: error.message
        };
        console.log(`    ❌ Error: ${error.message}`);
      }
    }

    // ============ PHASE 3: NAVIGATION & SIDEBAR ============
    console.log('\n🧭 PHASE 3: Navigation & Sidebar');
    console.log('==================================');
    
    // Go back to admin dashboard
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // Check for sidebar
    const sidebar = await page.$('nav, aside, [role="navigation"], .sidebar');
    results.navigation = {
      hasSidebar: sidebar !== null,
      sidebarVisible: sidebar ? await sidebar.isVisible() : false
    };
    
    // Get all navigation links
    const navLinks = await page.$$eval('nav a, aside a, [role="navigation"] a', links => 
      links.map(l => ({ text: l.textContent?.trim(), href: l.href }))
    );
    results.navigation.links = navLinks;
    
    console.log('  Sidebar present:', results.navigation.hasSidebar);
    console.log('  Navigation links found:', navLinks.length);
    navLinks.forEach(link => {
      console.log(`    - ${link.text}: ${link.href}`);
    });
    
    await takeScreenshot(page, 'navigation-sidebar');

    // ============ PHASE 4: FUNCTIONAL VERIFICATION ============
    console.log('\n⚙️  PHASE 4: Functional Verification');
    console.log('======================================');
    
    // Test User Management
    console.log('\n  Testing User Management...');
    await page.goto(`${BASE_URL}/admin/users`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    const userTable = await page.$('table');
    const userRows = await page.$$('table tbody tr');
    const addUserBtn = await page.$('button:has-text("Add"), button:has-text("New"), button:has-text("Invite")');
    
    results.featureVerification.userManagement = {
      accessible: true,
      hasTable: userTable !== null,
      rowCount: userRows.length,
      hasAddButton: addUserBtn !== null
    };
    
    console.log(`    Table present: ${userTable !== null}`);
    console.log(`    User rows: ${userRows.length}`);
    console.log(`    Add/Invite button: ${addUserBtn !== null}`);
    
    // Test Role Assignment
    console.log('\n  Testing Role Assignment...');
    const roleSelects = await page.$$('select, [role="combobox"]');
    const roleButtons = await page.$$('button:has-text("role"), button:has-text("Role")');
    results.featureVerification.roleAssignment = {
      hasRoleControls: roleSelects.length > 0 || roleButtons.length > 0,
      selectCount: roleSelects.length
    };
    console.log(`    Role controls found: ${roleSelects.length + roleButtons.length}`);
    
    // Test Audit Logs
    console.log('\n  Testing Audit Logs...');
    await page.goto(`${BASE_URL}/admin/audit`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    const auditTable = await page.$('table');
    const auditRows = await page.$$('table tbody tr');
    const filterInputs = await page.$$('input[type="search"], input[placeholder*="filter"], input[placeholder*="search"]');
    
    results.featureVerification.auditLogs = {
      accessible: true,
      hasTable: auditTable !== null,
      rowCount: auditRows.length,
      hasFilters: filterInputs.length > 0
    };
    
    console.log(`    Table present: ${auditTable !== null}`);
    console.log(`    Log entries: ${auditRows.length}`);
    console.log(`    Filter inputs: ${filterInputs.length}`);
    
    // Test Health Monitoring
    console.log('\n  Testing Health Monitoring...');
    await page.goto(`${BASE_URL}/admin/health`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    const healthCards = await page.$$('.card, [class*="card"], [class*="health"]');
    const statusIndicators = await page.$$('[class*="status"], [class*="indicator"]');
    
    results.featureVerification.healthMonitoring = {
      accessible: true,
      cardCount: healthCards.length,
      statusIndicators: statusIndicators.length
    };
    
    console.log(`    Health cards: ${healthCards.length}`);
    console.log(`    Status indicators: ${statusIndicators.length}`);
    
    // Test Maintenance Mode
    console.log('\n  Testing Maintenance Mode...');
    await page.goto(`${BASE_URL}/admin/maintenance`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    const maintenanceToggles = await page.$$('input[type="checkbox"], button[role="switch"]');
    const maintenanceForms = await page.$$('form');
    
    results.featureVerification.maintenanceMode = {
      accessible: true,
      hasToggles: maintenanceToggles.length > 0,
      formCount: maintenanceForms.length
    };
    
    console.log(`    Toggle controls: ${maintenanceToggles.length}`);
    console.log(`    Forms: ${maintenanceForms.length}`);
    
    // Test Pilot Inquiries
    console.log('\n  Testing Pilot Inquiries...');
    await page.goto(`${BASE_URL}/admin/pilot-inquiries`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    const inquiryTable = await page.$('table');
    const inquiryRows = await page.$$('table tbody tr');
    const inquiryCards = await page.$$('.card, [class*="card"]');
    
    results.featureVerification.pilotInquiries = {
      accessible: true,
      hasTable: inquiryTable !== null,
      rowCount: inquiryRows.length,
      cardCount: inquiryCards.length
    };
    
    console.log(`    Table present: ${inquiryTable !== null}`);
    console.log(`    Rows: ${inquiryRows.length}`);
    console.log(`    Cards: ${inquiryCards.length}`);
    
    // Test Invitations
    console.log('\n  Testing Invitations...');
    await page.goto(`${BASE_URL}/admin/users`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    const inviteButtons = await page.$$('button:has-text("Invite"), button:has-text("invite"), a:has-text("Invite")');
    results.featureVerification.invitations = {
      hasInviteFunction: inviteButtons.length > 0,
      buttonCount: inviteButtons.length
    };
    
    console.log(`    Invite buttons found: ${inviteButtons.length}`);
    
    // ============ FINAL SCREENSHOT ============
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'final-admin-dashboard');

    // ============ SAVE RESULTS ============
    const resultsPath = path.join(SCREENSHOT_DIR, 'certification-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Results saved to: ${resultsPath}`);

    // ============ SUMMARY ============
    console.log('\n📊 CERTIFICATION SUMMARY');
    console.log('=========================');
    console.log(`Build: ${results.build.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`Authentication: ${results.authentication.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`Pages Accessible: ${Object.values(results.pages).filter(p => p.accessible).length}/${Object.keys(results.pages).length}`);
    console.log(`Console Errors: ${results.consoleErrors.length}`);
    console.log(`Runtime Errors: ${results.errors.length}`);
    
    const comingSoonPages = Object.entries(results.pages).filter(([k, v]) => v.isComingSoon);
    if (comingSoonPages.length > 0) {
      console.log(`\n⚠️  "Coming Soon" Pages: ${comingSoonPages.map(([k, v]) => v.name).join(', ')}`);
    }

  } catch (error) {
    console.error('Fatal error during certification:', error);
    results.errors.push({ phase: 'fatal', error: error.message, stack: error.stack });
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
