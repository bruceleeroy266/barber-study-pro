import { test as base, Page, BrowserContext } from '@playwright/test';
import { ENV } from '../config/environment';
import { loginAsStudent, loginAsInstructor, loginAsAdmin, ensureLoggedOut } from '../utilities/auth';
import { createContext, clearBrowserData } from '../utilities/browser';

/**
 * ASCYN PRO - Test Fixtures
 * 
 * Reusable fixtures for common test scenarios.
 * Provides pre-configured pages and contexts for different user roles.
 */

// Define fixture types
type TestFixtures = {
  // Authenticated pages
  studentPage: Page;
  instructorPage: Page;
  adminPage: Page;
  
  // Clean context (no auth)
  cleanContext: BrowserContext;
  cleanPage: Page;
};

// Extend base test with fixtures
export const test = base.extend<TestFixtures>({
  /**
   * Student Page Fixture
   * 
   * Provides a page that is already logged in as a student.
   * Automatically logs out after the test.
   */
  studentPage: async ({ browser }, provide) => {
    const context = await createContext(browser);
    const page = await context.newPage();
    
    // Login as student
    await loginAsStudent(page);
    
    // Provide the page to the test
    await provide(page);
    
    // Cleanup
    await clearBrowserData(context);
    await context.close();
  },
  
  /**
   * Instructor Page Fixture
   * 
   * Provides a page that is already logged in as an instructor.
   * Automatically logs out after the test.
   */
  instructorPage: async ({ browser }, provide) => {
    const context = await createContext(browser);
    const page = await context.newPage();
    
    // Try to login as instructor
    await loginAsInstructor(page);
    
    // Provide the page to the test (tests will check if login was successful)
    await provide(page);
    
    // Cleanup
    await clearBrowserData(context);
    await context.close();
  },
  
  /**
   * Admin Page Fixture
   * 
   * Provides a page that is already logged in as an admin.
   * Automatically logs out after the test.
   */
  adminPage: async ({ browser }, provide) => {
    const context = await createContext(browser);
    const page = await context.newPage();
    
    // Try to login as admin
    await loginAsAdmin(page);
    
    // Provide the page to the test (tests will check if login was successful)
    await provide(page);
    
    // Cleanup
    await clearBrowserData(context);
    await context.close();
  },
  
  /**
   * Clean Context Fixture
   * 
   * Provides a fresh browser context with no authentication.
   * Useful for testing login/signup flows.
   */
  cleanContext: async ({ browser }, provide) => {
    const context = await createContext(browser);
    await provide(context);
    await context.close();
  },
  
  /**
   * Clean Page Fixture
   * 
   * Provides a fresh page with no authentication.
   * Ensures user is logged out before and after test.
   */
  cleanPage: async ({ browser }, provide) => {
    const context = await createContext(browser);
    const page = await context.newPage();
    
    // Ensure logged out
    await ensureLoggedOut(page, context);
    
    // Provide the page to the test
    await provide(page);
    
    // Cleanup
    await clearBrowserData(context);
    await context.close();
  },
});

export { expect } from '@playwright/test';

/**
 * Fixture for test data management
 */
export class TestDataManager {
  private static instance: TestDataManager;
  private data: Map<string, unknown> = new Map();
  
  private constructor() {}
  
  static getInstance(): TestDataManager {
    if (!TestDataManager.instance) {
      TestDataManager.instance = new TestDataManager();
    }
    return TestDataManager.instance;
  }
  
  set(key: string, value: unknown): void {
    this.data.set(key, value);
  }
  
  get(key: string): unknown {
    return this.data.get(key);
  }
  
  has(key: string): boolean {
    return this.data.has(key);
  }
  
  delete(key: string): boolean {
    return this.data.delete(key);
  }
  
  clear(): void {
    this.data.clear();
  }
}

/**
 * Fixture for environment configuration
 */
export class TestEnvironment {
  static get baseUrl(): string {
    return ENV.BASE_URL;
  }
  
  static get isCI(): boolean {
    return ENV.CI;
  }
  
  static get isHeadless(): boolean {
    return ENV.HEADLESS;
  }
  
  static get slowMo(): number {
    return ENV.SLOW_MO;
  }
  
  static get defaultTimeout(): number {
    return ENV.DEFAULT_TIMEOUT;
  }
}
