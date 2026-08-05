import { test, expect } from '../fixtures/test-fixtures';
import { ENV } from '../config/environment';
import { ROUTES } from '../config/constants';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { NavigationPage } from '../pages/navigation-page';
import { assertNoConsoleErrors, assertNoFailedRequests } from '../utilities/assertions';

/**
 * ASCYN PRO - Smoke Test Suite
 * 
 * Lightweight tests to verify basic application health.
 * These tests run quickly and check critical functionality.
 */

test.describe('Smoke Tests - Application Health', () => {
  test('application loads successfully', async ({ cleanPage }) => {
    // Navigate to home page
    await cleanPage.goto(ENV.BASE_URL);
    
    // Verify page loads
    await expect(cleanPage).toHaveTitle(/.+/);
    
    // Check for console errors
    await assertNoConsoleErrors(cleanPage, {
      ignorePatterns: ['favicon', 'analytics', 'sockjs'],
    });
  });

  test('login page loads correctly', async ({ cleanPage }) => {
    const loginPage = new LoginPage(cleanPage);
    await loginPage.goto();
    
    // Verify form is visible
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    
    // Check for console errors
    await assertNoConsoleErrors(cleanPage, {
      ignorePatterns: ['favicon', 'analytics'],
    });
  });

  test('navigation functions correctly', async ({ cleanPage }) => {
    // Navigate to login
    await cleanPage.goto(`${ENV.BASE_URL}${ROUTES.LOGIN}`);
    
    // Verify page loads and has content
    await expect(cleanPage.locator('body')).not.toBeEmpty();
    
    // Verify login form is visible (indicates navigation worked)
    await expect(cleanPage.locator('input[type="email"]')).toBeVisible();
  });

  test('no failed network requests on login page', async ({ cleanPage }) => {
    await cleanPage.goto(`${ENV.BASE_URL}${ROUTES.LOGIN}`);
    
    // Check for failed requests
    await assertNoFailedRequests(cleanPage, {
      ignorePatterns: ['favicon', 'analytics', 'sockjs'],
    });
  });
});

test.describe('Smoke Tests - Authentication Flow', () => {
  test('login form accepts input', async ({ cleanPage }) => {
    const loginPage = new LoginPage(cleanPage);
    await loginPage.goto();
    
    // Fill form
    await loginPage.fillForm('test@example.com', 'password123');
    
    // Verify input values
    await expect(loginPage.emailInput).toHaveValue('test@example.com');
    await expect(loginPage.passwordInput).toHaveValue('password123');
  });

  test('login with invalid credentials shows error', async ({ cleanPage }) => {
    const loginPage = new LoginPage(cleanPage);
    await loginPage.goto();
    
    // Login with invalid credentials
    await loginPage.login('invalid@test.com', 'wrongpassword');
    
    // Wait for error or redirect
    await cleanPage.waitForTimeout(2000);
    
    // Should either show error or stay on login page
    const url = cleanPage.url();
    const hasError = await loginPage.hasError();
    
    expect(url.includes('/login') || hasError).toBe(true);
  });
});

test.describe('Smoke Tests - Dashboard Access', () => {
  test('dashboard requires authentication', async ({ cleanPage }) => {
    // Try to access dashboard without login
    await cleanPage.goto(`${ENV.BASE_URL}${ROUTES.DASHBOARD}`);
    
    // Should redirect to login
    await expect(cleanPage).toHaveURL(/.*login/);
  });

  test('dashboard loads after login', async ({ studentPage }) => {
    const dashboard = new DashboardPage(studentPage);
    
    // Verify dashboard is loaded
    await expect(dashboard.welcomeMessage.first()).toBeVisible();
    
    // Check for console errors
    await assertNoConsoleErrors(studentPage, {
      ignorePatterns: ['favicon', 'analytics'],
    });
  });
});

test.describe('Smoke Tests - Chapter Access', () => {
  test('chapters list is accessible', async ({ studentPage }) => {
    await studentPage.goto(`${ENV.BASE_URL}${ROUTES.CHAPTERS}`);
    
    // Verify page loads
    await expect(studentPage.locator('body')).not.toBeEmpty();
    
    // Check for console errors
    await assertNoConsoleErrors(studentPage, {
      ignorePatterns: ['favicon', 'analytics'],
    });
  });

  test('chapter 1 loads successfully', async ({ studentPage }) => {
    await studentPage.goto(`${ENV.BASE_URL}${ROUTES.CHAPTER(1)}`);
    
    // Verify page loads
    await expect(studentPage.locator('body')).not.toBeEmpty();
    
    // Check for console errors
    await assertNoConsoleErrors(studentPage, {
      ignorePatterns: ['favicon', 'analytics'],
    });
  });
});

test.describe('Smoke Tests - Performance', () => {
  test('login page loads within acceptable time', async ({ cleanPage }) => {
    const startTime = Date.now();
    
    await cleanPage.goto(`${ENV.BASE_URL}${ROUTES.LOGIN}`);
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('dashboard loads within acceptable time', async ({ studentPage }) => {
    const startTime = Date.now();
    
    await studentPage.goto(`${ENV.BASE_URL}${ROUTES.DASHBOARD}`);
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});
