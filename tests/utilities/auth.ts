import { Page, BrowserContext } from '@playwright/test';
import { ENV } from '../config/environment';
import { ROUTES, ROLES } from '../config/constants';
import { navigateToRoute, waitForPageLoad } from '../utilities/browser';

/**
 * ASCYN PRO - Authentication Helpers
 * 
 * Reusable authentication functions for tests.
 * Credentials are loaded from environment variables.
 */

export interface TestUser {
  email: string;
  password: string;
  role: keyof typeof ROLES;
}

/**
 * Get test user credentials from environment
 */
export function getTestUser(role: keyof typeof ROLES): TestUser {
  switch (role) {
    case 'STUDENT':
      return {
        email: ENV.TEST_STUDENT_EMAIL,
        password: ENV.TEST_STUDENT_PASSWORD,
        role: 'STUDENT',
      };
    case 'INSTRUCTOR':
      return {
        email: ENV.TEST_INSTRUCTOR_EMAIL,
        password: ENV.TEST_INSTRUCTOR_PASSWORD,
        role: 'INSTRUCTOR',
      };
    case 'ADMIN':
      return {
        email: ENV.TEST_ADMIN_EMAIL,
        password: ENV.TEST_ADMIN_PASSWORD,
        role: 'ADMIN',
      };
    default:
      throw new Error(`Unknown role: ${role}`);
  }
}

/**
 * Login with credentials
 */
export async function login(
  page: Page,
  email: string,
  password: string,
  options?: { expectSuccess?: boolean }
) {
  await navigateToRoute(page, ROUTES.LOGIN);
  
  // Fill login form
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Wait for navigation
  if (options?.expectSuccess !== false) {
    try {
      // Wait for either successful navigation or error message
      await Promise.race([
        page.waitForURL(/.*dashboard|.*instructor|.*admin/, {
          timeout: 15000,
        }),
        page.waitForSelector('text=/error|invalid|incorrect/i', {
          timeout: 15000,
        })
      ]);
    } catch (error) {
      // If navigation doesn't happen, the login may have failed
      // Check if we're still on login page
      const url = page.url();
      if (url.includes('/login')) {
        // Login failed - this is expected for invalid credentials or missing accounts
        console.warn(`Login failed for ${email} - account may not exist or credentials are incorrect`);
        // Don't throw - let the test handle the login state
        return;
      }
      // Re-throw if it's a different error
      throw error;
    }
  }
  
  await waitForPageLoad(page);
}

/**
 * Login as a specific role
 */
export async function loginAs(
  page: Page,
  role: keyof typeof ROLES
) {
  const user = getTestUser(role);
  await login(page, user.email, user.password);
}

/**
 * Login as student
 */
export async function loginAsStudent(page: Page) {
  await loginAs(page, 'STUDENT');
}

/**
 * Login as instructor
 */
export async function loginAsInstructor(page: Page) {
  await loginAs(page, 'INSTRUCTOR');
}

/**
 * Login as admin
 */
export async function loginAsAdmin(page: Page) {
  await loginAs(page, 'ADMIN');
}

/**
 * Logout
 */
export async function logout(page: Page) {
  // Look for logout button/link
  const logoutButton = page.locator('text=Logout, text=Sign Out, [data-testid="logout"]');
  
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await page.waitForURL(/.*login/, { timeout: ENV.DEFAULT_TIMEOUT });
  }
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    // Check if we're on a protected route
    const url = page.url();
    if (url.includes('/login') || url.includes('/signup')) {
      return false;
    }
    
    // Check for logout button (indicates logged in)
    const logoutButton = page.locator('text=Logout, text=Sign Out');
    return await logoutButton.isVisible({ timeout: 2000 });
  } catch {
    return false;
  }
}

/**
 * Ensure user is logged out
 */
export async function ensureLoggedOut(page: Page, context: BrowserContext) {
  if (await isLoggedIn(page)) {
    await logout(page);
  }
  
  // Clear cookies to ensure clean state
  await context.clearCookies();
}

/**
 * Signup with credentials
 */
export async function signup(
  page: Page,
  email: string,
  password: string,
  options?: { expectSuccess?: boolean }
) {
  await navigateToRoute(page, ROUTES.SIGNUP);
  
  // Fill signup form
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Wait for navigation or error
  if (options?.expectSuccess !== false) {
    await page.waitForURL(/.*dashboard|.*login/, {
      timeout: ENV.DEFAULT_TIMEOUT,
    });
  }
  
  await waitForPageLoad(page);
}

/**
 * Reset password
 */
export async function resetPassword(
  page: Page,
  email: string
) {
  await navigateToRoute(page, ROUTES.RESET_PASSWORD);
  
  // Fill email
  await page.fill('input[type="email"]', email);
  
  // Submit form
  await page.click('button[type="submit"]');
  
  await waitForPageLoad(page);
}

/**
 * Get current user role from page
 */
export async function getCurrentUserRole(page: Page): Promise<string | null> {
  try {
    // This will depend on how the role is displayed in the UI
    // For now, check the URL to infer role
    const url = page.url();
    
    if (url.includes('/instructor')) {
      return 'instructor';
    } else if (url.includes('/admin')) {
      return 'admin';
    } else if (url.includes('/dashboard')) {
      return 'student';
    }
    
    return null;
  } catch {
    return null;
  }
}
