import { test as base, expect, Page, BrowserContext } from '@playwright/test';

/**
 * ASCYN PRO - Test Utilities
 * 
 * Common utilities and fixtures for browser automation tests.
 * These will be used in Phase 3 for application-specific tests.
 */

// Extend base test with custom fixtures
export const test = base.extend<{
  // Add custom fixtures here as needed
  authenticatedPage: Page;
}>({
  // Custom fixture for authenticated page (to be implemented in Phase 3)
  authenticatedPage: async ({ page }, provideFixture) => {
    // This will be implemented in Phase 3 with actual login logic
    await provideFixture(page);
  },
});

export { expect };

/**
 * Utility function to wait for network idle
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Utility function to capture console logs
 */
export function captureConsoleLogs(page: Page): string[] {
  const logs: string[] = [];
  page.on('console', (msg) => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });
  return logs;
}

/**
 * Utility function to capture console errors
 */
export function captureConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  return errors;
}

/**
 * Utility function to capture failed network requests
 */
export function captureFailedRequests(page: Page): string[] {
  const failed: string[] = [];
  page.on('requestfailed', (request) => {
    failed.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
  });
  return failed;
}

/**
 * Utility function to check for horizontal overflow
 */
export async function hasHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
}

/**
 * Utility function to get page performance metrics
 */
export async function getPerformanceMetrics(page: Page) {
  return page.evaluate(() => {
    const timing = performance.timing;
    return {
      loadTime: timing.loadEventEnd - timing.navigationStart,
      domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
      firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
    };
  });
}

/**
 * Utility function to clear all cookies and storage
 */
export async function clearBrowserData(context: BrowserContext) {
  await context.clearCookies();
  await context.clearPermissions();
}

/**
 * Utility function to take a timestamped screenshot
 */
export async function takeTimestampedScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const path = `tests/screenshots/${name}-${timestamp}.png`;
  await page.screenshot({ path, fullPage: true });
  return path;
}
