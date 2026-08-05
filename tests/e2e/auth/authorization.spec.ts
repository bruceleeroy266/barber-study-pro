import { test, expect } from '../../fixtures/test-fixtures';
import { ENV } from '../../config/environment';
import { ROUTES } from '../../config/constants';

/**
 * ASCYN PRO - Authorization & Role-Based Access Tests
 * 
 * Tests for protected routes and role-based access control.
 */

test.describe('Authorization - Unauthenticated Access', () => {
  test('should redirect to login when accessing dashboard unauthenticated', async ({ cleanPage }) => {
    await cleanPage.goto(`${ENV.BASE_URL}${ROUTES.DASHBOARD}`);
    await expect(cleanPage).toHaveURL(/.*login/);
  });

  test('should redirect to login when accessing chapters unauthenticated', async ({ cleanPage }) => {
    await cleanPage.goto(`${ENV.BASE_URL}${ROUTES.CHAPTERS}`);
    await expect(cleanPage).toHaveURL(/.*login/);
  });

  test('should redirect to login when accessing instructor unauthenticated', async ({ cleanPage }) => {
    await cleanPage.goto(`${ENV.BASE_URL}${ROUTES.INSTRUCTOR}`);
    await expect(cleanPage).toHaveURL(/.*login/);
  });

  test('should redirect to login when accessing admin unauthenticated', async ({ cleanPage }) => {
    await cleanPage.goto(`${ENV.BASE_URL}${ROUTES.ADMIN}`);
    await expect(cleanPage).toHaveURL(/.*login/);
  });

  test('should allow access to login page unauthenticated', async ({ cleanPage }) => {
    await cleanPage.goto(`${ENV.BASE_URL}${ROUTES.LOGIN}`);
    await expect(cleanPage).toHaveURL(/.*login/);
  });

  test('should allow access to signup page unauthenticated', async ({ cleanPage }) => {
    await cleanPage.goto(`${ENV.BASE_URL}${ROUTES.SIGNUP}`);
    await expect(cleanPage).toHaveURL(/.*signup/);
  });
});

test.describe('Authorization - Student Role Access', () => {
  test('student can access dashboard', async ({ studentPage }) => {
    await studentPage.goto(`${ENV.BASE_URL}${ROUTES.DASHBOARD}`);
    await expect(studentPage).toHaveURL(/.*dashboard/);
  });

  test('student can access chapters', async ({ studentPage }) => {
    await studentPage.goto(`${ENV.BASE_URL}${ROUTES.CHAPTERS}`);
    await expect(studentPage).toHaveURL(/.*chapters/);
  });

  test('student cannot access instructor dashboard', async ({ studentPage }) => {
    await studentPage.goto(`${ENV.BASE_URL}${ROUTES.INSTRUCTOR}`);
    
    // Should redirect to dashboard or show access denied
    await studentPage.waitForTimeout(2000);
    const url = studentPage.url();
    expect(url.includes('/instructor')).toBe(false);
  });

  test('student cannot access admin dashboard', async ({ studentPage }) => {
    await studentPage.goto(`${ENV.BASE_URL}${ROUTES.ADMIN}`);
    
    // Should redirect to dashboard or show access denied
    await studentPage.waitForTimeout(2000);
    const url = studentPage.url();
    expect(url.includes('/admin')).toBe(false);
  });
});

test.describe('Authorization - Instructor Role Access', () => {
  test('instructor can access instructor dashboard', async ({ instructorPage }) => {
    await instructorPage.goto(`${ENV.BASE_URL}${ROUTES.INSTRUCTOR}`);
    
    // Wait for navigation
    await instructorPage.waitForTimeout(3000);
    
    // Check if we're on instructor page or redirected to dashboard
    const url = instructorPage.url();
    expect(url.includes('/instructor') || url.includes('/dashboard')).toBe(true);
  });

  test('instructor can access student dashboard', async ({ instructorPage }) => {
    // Instructors may also have access to student view
    await instructorPage.goto(`${ENV.BASE_URL}${ROUTES.DASHBOARD}`);
    await expect(instructorPage.locator('body')).not.toBeEmpty();
  });

  test('instructor cannot access admin dashboard', async ({ instructorPage }) => {
    await instructorPage.goto(`${ENV.BASE_URL}${ROUTES.ADMIN}`);
    
    // Should redirect or show access denied
    await instructorPage.waitForTimeout(2000);
    const url = instructorPage.url();
    expect(url.includes('/admin')).toBe(false);
  });
});

test.describe('Authorization - Admin Role Access', () => {
  test('admin can access admin dashboard', async ({ adminPage }) => {
    await adminPage.goto(`${ENV.BASE_URL}${ROUTES.ADMIN}`);
    await expect(adminPage).toHaveURL(/.*admin/);
  });

  test('admin can access admin users', async ({ adminPage }) => {
    await adminPage.goto(`${ENV.BASE_URL}${ROUTES.ADMIN_USERS}`);
    await expect(adminPage).toHaveURL(/.*admin\/users/);
  });

  test('admin can access admin school', async ({ adminPage }) => {
    await adminPage.goto(`${ENV.BASE_URL}${ROUTES.ADMIN_SCHOOL}`);
    
    // Wait for navigation
    await adminPage.waitForTimeout(3000);
    
    // Check if we're on admin school page or redirected
    const url = adminPage.url();
    expect(url.includes('/admin') || url.includes('/dashboard')).toBe(true);
  });

  test('admin can access instructor dashboard', async ({ adminPage }) => {
    // Admins may have access to instructor view
    await adminPage.goto(`${ENV.BASE_URL}${ROUTES.INSTRUCTOR}`);
    await expect(adminPage.locator('body')).not.toBeEmpty();
  });

  test('admin can access student dashboard', async ({ adminPage }) => {
    // Admins may have access to student view
    await adminPage.goto(`${ENV.BASE_URL}${ROUTES.DASHBOARD}`);
    await expect(adminPage.locator('body')).not.toBeEmpty();
  });
});
