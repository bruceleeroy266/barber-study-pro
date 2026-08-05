const { chromium } = require('playwright');

async function reproducePasswordReset() {
  console.log('=== REPRODUCING PASSWORD RESET ON PRODUCTION ===\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });
  
  // Capture network requests
  const networkRequests = [];
  page.on('request', request => {
    networkRequests.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
    });
  });
  
  // Capture network responses
  const networkResponses = [];
  page.on('response', response => {
    networkResponses.push({
      url: response.url(),
      status: response.status(),
      statusText: response.statusText(),
    });
  });
  
  // Capture page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });
  
  try {
    // Step 1: Navigate to reset password page
    console.log('1. Navigating to https://ascynpro.com/reset-password...');
    await page.goto('https://ascynpro.com/reset-password', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('   Page loaded:', page.url());
    
    // Step 2: Fill in email
    console.log('\n2. Filling in email: patty.pineda.drl@gmail.com');
    await page.fill('input[type="email"]', 'patty.pineda.drl@gmail.com');
    
    // Step 3: Click Send Reset Link and capture the response
    console.log('\n3. Clicking "Send Reset Link"...');
    
    // Wait for the Supabase API call
    const [response] = await Promise.all([
      page.waitForResponse(
        resp => resp.url().includes('supabase') && resp.url().includes('recover'),
        { timeout: 15000 }
      ).catch(() => null),
      page.click('button[type="submit"]'),
    ]);
    
    // Wait a moment for any error to appear
    await page.waitForTimeout(3000);
    
    // Check for error message on page
    const errorElement = await page.$('.text-red-400, [class*="error"], [class*="red"]');
    const errorText = errorElement ? await errorElement.textContent() : null;
    
    // Check for success message
    const successElement = await page.$('text=Check Your Email');
    const isSuccess = !!successElement;
    
    console.log('\n=== RESULTS ===\n');
    console.log('Current URL:', page.url());
    console.log('Success:', isSuccess);
    console.log('Error text on page:', errorText);
    
    if (response) {
      console.log('\nSupabase API Response:');
      console.log('  URL:', response.url());
      console.log('  Status:', response.status());
      console.log('  Status Text:', response.statusText());
      
      try {
        const body = await response.json();
        console.log('  Body:', JSON.stringify(body, null, 2));
      } catch {
        const text = await response.text();
        console.log('  Body (text):', text.substring(0, 500));
      }
      
      // Check request details
      const request = response.request();
      console.log('\nSupabase API Request:');
      console.log('  Method:', request.method());
      console.log('  URL:', request.url());
      const postData = request.postData();
      if (postData) {
        console.log('  Post Data:', postData);
      }
    } else {
      console.log('\nNo Supabase recover API call detected');
    }
    
    console.log('\nConsole Messages:');
    consoleMessages.forEach(msg => {
      console.log(`  [${msg.type}] ${msg.text}`);
    });
    
    if (pageErrors.length > 0) {
      console.log('\nPage Errors:');
      pageErrors.forEach(err => console.log('  ', err));
    }
    
    console.log('\nAll Network Requests to Supabase:');
    networkRequests
      .filter(r => r.url.includes('supabase'))
      .forEach(r => console.log(`  ${r.method} ${r.url}`));
    
    console.log('\nAll Network Responses from Supabase:');
    networkResponses
      .filter(r => r.url.includes('supabase'))
      .forEach(r => console.log(`  ${r.status} ${r.url}`));
    
    // Take screenshot
    await page.screenshot({ path: 'password-reset-reproduction.png', fullPage: true });
    console.log('\nScreenshot saved: password-reset-reproduction.png');
    
  } catch (error) {
    console.error('Test error:', error.message);
    await page.screenshot({ path: 'password-reset-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

reproducePasswordReset().catch(console.error);
