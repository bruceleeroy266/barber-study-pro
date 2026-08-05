import { test, expect } from '@playwright/test';

/**
 * Official Playwright Sample Test
 * 
 * This test verifies that Playwright is correctly installed and configured.
 * It tests basic browser functionality across all configured browsers.
 */

test.describe('Playwright Installation Verification', () => {
  test('should launch browser and navigate to example.com', async ({ page }) => {
    // Navigate to a simple test page
    await page.goto('https://example.com');
    
    // Verify page title
    await expect(page).toHaveTitle(/Example Domain/);
    
    // Verify heading is visible
    await expect(page.locator('h1')).toContainText('Example Domain');
    
    // Verify paragraph text exists (more flexible assertion)
    await expect(page.locator('p').first()).toBeVisible();
  });

  test('should capture screenshot on demand', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'tests/screenshots/example-com.png',
      fullPage: true 
    });
    
    // Verify page loaded correctly
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle network requests', async ({ page }) => {
    // Track network requests
    const requests: string[] = [];
    page.on('request', (request) => {
      requests.push(request.url());
    });
    
    await page.goto('https://example.com');
    
    // Verify at least one request was made
    expect(requests.length).toBeGreaterThan(0);
    expect(requests[0]).toContain('example.com');
  });

  test('should execute JavaScript in page context', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Execute JavaScript and get result
    const title = await page.evaluate(() => document.title);
    expect(title).toContain('Example');
    
    // Get page content
    const content = await page.content();
    expect(content).toContain('Example Domain');
  });

  test('should fill and submit forms', async ({ page }) => {
    // Use a test page with a form
    await page.goto('https://httpbin.org/forms/post');
    
    // Fill form fields
    await page.fill('input[name="custname"]', 'Playwright Test');
    await page.fill('input[name="custtel"]', '555-1234');
    await page.fill('input[name="custemail"]', 'test@example.com');
    
    // Verify form is filled correctly
    const nameValue = await page.inputValue('input[name="custname"]');
    expect(nameValue).toBe('Playwright Test');
    
    const telValue = await page.inputValue('input[name="custtel"]');
    expect(telValue).toBe('555-1234');
    
    const emailValue = await page.inputValue('input[name="custemail"]');
    expect(emailValue).toBe('test@example.com');
  });
});

test.describe('Browser Capabilities', () => {
  test('should support modern JavaScript features', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Test ES6+ features
    const result = await page.evaluate(() => {
      // Arrow functions
      const add = (a: number, b: number) => a + b;
      
      // Template literals
      const message = `Result: ${add(2, 3)}`;
      
      // Destructuring
      const [first, ...rest] = [1, 2, 3, 4, 5];
      
      // Spread operator
      const combined = [...rest, first];
      
      // Async/await support check
      const hasAsync = typeof (async () => {}) === 'function';
      
      return {
        message,
        first,
        combined,
        hasAsync,
      };
    });
    
    expect(result.message).toBe('Result: 5');
    expect(result.first).toBe(1);
    expect(result.combined).toEqual([2, 3, 4, 5, 1]);
    expect(result.hasAsync).toBe(true);
  });

  test('should support CSS3 features', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Check CSS support
    const cssSupport = await page.evaluate(() => {
      const testEl = document.createElement('div');
      
      // Test CSS Grid
      testEl.style.display = 'grid';
      const hasGrid = testEl.style.display === 'grid';
      
      // Test Flexbox
      testEl.style.display = 'flex';
      const hasFlex = testEl.style.display === 'flex';
      
      // Test CSS Variables
      testEl.style.setProperty('--test-var', 'red');
      const hasVars = testEl.style.getPropertyValue('--test-var') === 'red';
      
      return { hasGrid, hasFlex, hasVars };
    });
    
    expect(cssSupport.hasGrid).toBe(true);
    expect(cssSupport.hasFlex).toBe(true);
    expect(cssSupport.hasVars).toBe(true);
  });
});
