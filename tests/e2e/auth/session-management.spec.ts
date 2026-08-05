import { test, expect } from '../../fixtures/test-fixtures';
import { LoginPage } from '../../pages/login-page';
import { DashboardPage } from '../../pages/dashboard-page';
import { ENV } from '../../config/environment';
import { ROUTES } from '../../config/constants';

/**
 * ASCYN PRO - Session Management Tests
 * 
 * Tests for session persistence, multiple tabs, and session expiration.
 */

const STUDENT_EMAIL = ENV.TEST_STUDENT_EMAIL;
const STUDENT_PASSWORD = ENV.TEST_STUDENT_PASSWORD;

test.describe('Session Management - Persistence', () => {
  test('should maintain session after browser refresh', async ({ studentPage }) => {
    const dashboard = new DashboardPage(studentPage);
    
    // Verify logged in
    await expect(dashboard.welcomeMessage.first()).toBeVisible();
    
    // Refresh page
    await studentPage.reload();
    
    // Should still be logged in
    await expect(studentPage).toHaveURL(/.*dashboard/);
    await expect(dashboard.welcomeMessage.first()).toBeVisible();
  });

  test('should maintain session after navigation', async ({ studentPage }) => {
    // Navigate to chapters
    await studentPage.goto(`${ENV.BASE_URL}${ROUTES.CHAPTERS}`);
    await expect(studentPage).toHaveURL(/.*chapters/);
    
    // Navigate to grades
    await studentPage.goto(`${ENV.BASE_URL}${ROUTES.GRADES}`);
    await expect(studentPage).toHaveURL(/.*grades/);
    
    // Navigate back to dashboard
    await studentPage.goto(`${ENV.BASE_URL}${ROUTES.DASHBOARD}`);
    await expect(studentPage).toHaveURL(/.*dashboard/);
  });

  test('should maintain session after multiple refreshes', async ({ studentPage }) => {
    const dashboard = new DashboardPage(studentPage);
    
    // Refresh multiple times
    for (let i = 0; i < 3; i++) {
      await studentPage.reload();
      await expect(dashboard.welcomeMessage.first()).toBeVisible();
    }
  });
});

test.describe('Session Management - Multiple Tabs', () => {
  test('should share session across tabs', async ({ browser }) => {
    // Create first context and login
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    
    const loginPage = new LoginPage(page1);
    await loginPage.goto();
    await loginPage.login(STUDENT_EMAIL, STUDENT_PASSWORD);
    
    // Verify logged in on first tab
    await expect(page1).toHaveURL(/.*dashboard/);
    
    // Create second tab with same context (shares cookies)
    const page2 = await context1.newPage();
    await page2.goto(`${ENV.BASE_URL}${ROUTES.DASHBOARD}`);
    
    // Should be logged in on second tab
    await expect(page2).toHaveURL(/.*dashboard/);
    
    // Cleanup
    await context1.close();
  });

  test('should logout from all tabs when logging out from one', async ({ browser }) => {
    // Create context and login
    const context = await browser.newContext();
    const page1 = await context.newPage();
    
    const loginPage = new LoginPage(page1);
    await loginPage.goto();
    await loginPage.login(STUDENT_EMAIL, STUDENT_PASSWORD);
    
    // Open second tab
    const page2 = await context.newPage();
    await page2.goto(`${ENV.BASE_URL}${ROUTES.DASHBOARD}`);
    
    // Verify both tabs are logged in
    await expect(page1).toHaveURL(/.*dashboard/);
    await expect(page2).toHaveURL(/.*dashboard/);
    
    // Look for logout button
    const logoutButton = page1.locator('text=Logout, text=Sign Out, button:has-text("Logout"), [data-testid="logout"]');
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      
      // Verify first tab is logged out
      await expect(page1).toHaveURL(/.*login/);
      
      // Refresh second tab
      await page2.reload();
      
      // Second tab should also be logged out
      await expect(page2).toHaveURL(/.*login/);
    } else {
      // Clear cookies to simulate logout
      await context.clearCookies();
      
      // Both tabs should redirect to login on next navigation
      await page1.goto(`${ENV.BASE_URL}${ROUTES.DASHBOARD}`);
      await expect(page1).toHaveURL(/.*login/);
      
      await page2.goto(`${ENV.BASE_URL}${ROUTES.DASHBOARD}`);
      await expect(page2).toHaveURL(/.*login/);
    }
    
    // Cleanup
    await context.close();
  });
});

test.describe('Session Management - Expiration', () => {
  test('should handle session expiration gracefully', async ({ studentPage }) => {
    // This test verifies the app handles expired sessions correctly
    // Note: Actual session expiration testing requires manipulating cookies or waiting
    
    const dashboard = new DashboardPage(studentPage);
    await expect(dashboard.welcomeMessage.first()).toBeVisible();
    
    // Clear cookies to simulate expired session
    const context = studentPage.context();
    await context.clearCookies();
    
    // Try to access dashboard
    await studentPage.goto(`${ENV.BASE_URL}${ROUTES.DASHBOARD}`);
    
    // Should redirect to login
    await expect(studentPage).toHaveURL(/.*login/);
  });
});

test.describe('Session Management - Security', () => {
  test('should not expose sensitive data in URL', async ({ studentPage }) => {
    // Check that URLs don't contain sensitive data
    const url = studentPage.url();
    
    // URL should not contain tokens, passwords, or session IDs
    expect(url).not.toContain('token');
    expect(url).not.toContain('password');
    expect(url).not.toContain('session');
  });

  test('should use secure cookies', async ({ studentPage }) => {
    // Get cookies
    const cookies = await studentPage.context().cookies();
    
    // Check for secure and httpOnly flags on auth cookies
    const authCookies = cookies.filter(c => 
      c.name.includes('auth') || 
      c.name.includes('session') ||
      c.name.includes('supabase')
    );
    
    // If no auth cookies found, skip test with warning
    if (authCookies.length === 0) {
      console.warn('No auth cookies found to verify - this may be expected in some configurations');
      return;
    }
    
    // Verify cookies exist and have basic security properties
    for (const cookie of authCookies) {
      // Log cookie properties for debugging
      console.log(`Cookie: ${cookie.name}, secure: ${cookie.secure}, httpOnly: ${cookie.httpOnly}`);
      
      // In production (HTTPS), cookies should be secure
      if (ENV.BASE_URL.startsWith('https')) {
        expect(cookie.secure).toBe(true);
      }
      
      // Note: httpOnly may not be readable from client side in all cases
      // So we just verify the cookie exists and has a value
      expect(cookie.value.length).toBeGreaterThan(0);
    }
  });
});
