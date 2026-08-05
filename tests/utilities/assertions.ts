import { Page, expect, Locator } from '@playwright/test';

/**
 * ASCYN PRO - Common Assertions
 * 
 * Reusable assertion helpers for common test scenarios.
 */

/**
 * Assert that an element is visible and contains text
 */
export async function assertElementWithText(
  locator: Locator,
  text: string | RegExp,
  options?: { timeout?: number }
) {
  await expect(locator).toBeVisible(options);
  await expect(locator).toContainText(text);
}

/**
 * Assert that a page has no console errors
 */
export async function assertNoConsoleErrors(
  page: Page,
  options?: { ignorePatterns?: (string | RegExp)[] }
) {
  const errors: string[] = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      const shouldIgnore = options?.ignorePatterns?.some(pattern => {
        if (typeof pattern === 'string') {
          return text.includes(pattern);
        }
        return pattern.test(text);
      });
      
      if (!shouldIgnore) {
        errors.push(text);
      }
    }
  });
  
  // Wait a bit for any async errors
  await page.waitForTimeout(1000);
  
  expect(errors).toHaveLength(0);
}

/**
 * Assert that a page has no failed network requests
 */
export async function assertNoFailedRequests(
  page: Page,
  options?: { ignorePatterns?: (string | RegExp)[] }
) {
  const failedRequests: string[] = [];
  
  page.on('requestfailed', (request) => {
    const url = request.url();
    const shouldIgnore = options?.ignorePatterns?.some(pattern => {
      if (typeof pattern === 'string') {
        return url.includes(pattern);
      }
      return pattern.test(url);
    });
    
    if (!shouldIgnore) {
      failedRequests.push(`${request.method()} ${url}`);
    }
  });
  
  page.on('response', (response) => {
    if (response.status() >= 400) {
      const url = response.url();
      const shouldIgnore = options?.ignorePatterns?.some(pattern => {
        if (typeof pattern === 'string') {
          return url.includes(pattern);
        }
        return pattern.test(url);
      });
      
      if (!shouldIgnore) {
        failedRequests.push(`${response.status()} ${url}`);
      }
    }
  });
  
  // Wait a bit for any async requests
  await page.waitForTimeout(1000);
  
  expect(failedRequests).toHaveLength(0);
}

/**
 * Assert that a page has no horizontal overflow
 */
export async function assertNoHorizontalOverflow(page: Page) {
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  
  expect(hasOverflow).toBe(false);
}

/**
 * Assert that a page loads within a time limit
 */
export async function assertPageLoadsWithin(
  page: Page,
  url: string,
  maxLoadTime: number
) {
  const startTime = Date.now();
  await page.goto(url);
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(maxLoadTime);
}

/**
 * Assert that an element has a specific attribute value
 */
export async function assertElementAttribute(
  locator: Locator,
  attribute: string,
  value: string
) {
  await expect(locator).toHaveAttribute(attribute, value);
}

/**
 * Assert that a form field has a specific value
 */
export async function assertFieldValue(
  locator: Locator,
  value: string
) {
  await expect(locator).toHaveValue(value);
}

/**
 * Assert that a button is enabled
 */
export async function assertButtonEnabled(locator: Locator) {
  await expect(locator).toBeEnabled();
}

/**
 * Assert that a button is disabled
 */
export async function assertButtonDisabled(locator: Locator) {
  await expect(locator).toBeDisabled();
}

/**
 * Assert that a link navigates to the correct URL
 */
export async function assertLinkNavigatesTo(
  page: Page,
  locator: Locator,
  expectedUrl: string | RegExp
) {
  await locator.click();
  await expect(page).toHaveURL(expectedUrl);
}
