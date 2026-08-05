import { Page, BrowserContext, Browser } from '@playwright/test';
import { ENV } from '../config/environment';

/**
 * ASCYN PRO - Browser Utilities
 * 
 * Utilities for browser setup, navigation, and management.
 */

/**
 * Navigate to a URL and wait for network idle
 */
export async function navigateTo(
  page: Page,
  url: string,
  options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }
) {
  await page.goto(url, {
    waitUntil: options?.waitUntil || 'domcontentloaded',
    timeout: 45000,
  });
}

/**
 * Navigate to a route relative to the base URL
 */
export async function navigateToRoute(
  page: Page,
  route: string,
  options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }
) {
  const url = route.startsWith('http') ? route : `${ENV.BASE_URL}${route}`;
  await navigateTo(page, url, options);
}

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  // Wait for any pending network requests to complete
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
    // Ignore networkidle timeout - page may still be functional
  });
}

/**
 * Clear all browser data (cookies, storage, cache)
 */
export async function clearBrowserData(context: BrowserContext) {
  await context.clearCookies();
  await context.clearPermissions();
  
  // Clear localStorage and sessionStorage
  const pages = context.pages();
  for (const page of pages) {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }
}

/**
 * Set viewport size
 */
export async function setViewport(
  page: Page,
  width: number,
  height: number
) {
  await page.setViewportSize({ width, height });
}

/**
 * Take a screenshot with timestamp
 */
export async function takeScreenshot(
  page: Page,
  name: string,
  options?: { fullPage?: boolean; path?: string }
) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const path = options?.path || `tests/screenshots/${name}-${timestamp}.png`;
  
  await page.screenshot({
    path,
    fullPage: options?.fullPage ?? true,
  });
  
  return path;
}

/**
 * Get page performance metrics
 */
export async function getPerformanceMetrics(page: Page) {
  return page.evaluate(() => {
    const timing = performance.timing;
    const paintEntries = performance.getEntriesByType('paint');
    
    return {
      // Navigation timing
      navigationStart: timing.navigationStart,
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart,
      
      // Paint timing
      firstPaint: paintEntries.find(e => e.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paintEntries.find(e => e.name === 'first-contentful-paint')?.startTime || 0,
      
      // Resource timing
      resourceCount: performance.getEntriesByType('resource').length,
    };
  });
}

/**
 * Check if element exists without throwing
 */
export async function elementExists(
  page: Page,
  selector: string
): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { timeout: 1000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Wait for element to be visible with custom timeout
 */
export async function waitForElement(
  page: Page,
  selector: string,
  timeout: number = ENV.DEFAULT_TIMEOUT
) {
  await page.waitForSelector(selector, {
    state: 'visible',
    timeout,
  });
}

/**
 * Scroll element into view
 */
export async function scrollIntoView(
  page: Page,
  selector: string
) {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * Get browser console logs
 */
export function getConsoleLogs(page: Page): string[] {
  const logs: string[] = [];
  
  page.on('console', (msg) => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });
  
  return logs;
}

/**
 * Get browser console errors
 */
export function getConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  return errors;
}

/**
 * Get failed network requests
 */
export function getFailedRequests(page: Page): string[] {
  const failed: string[] = [];
  
  page.on('requestfailed', (request) => {
    failed.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
  });
  
  return failed;
}

/**
 * Create a new browser context with specific options
 */
export async function createContext(
  browser: Browser,
  options?: {
    viewport?: { width: number; height: number };
    userAgent?: string;
    locale?: string;
    timezoneId?: string;
    permissions?: string[];
  }
): Promise<BrowserContext> {
  return browser.newContext({
    viewport: options?.viewport || { width: 1280, height: 720 },
    userAgent: options?.userAgent,
    locale: options?.locale || 'en-US',
    timezoneId: options?.timezoneId || 'America/Chicago',
    permissions: options?.permissions,
    ignoreHTTPSErrors: true,
  });
}
