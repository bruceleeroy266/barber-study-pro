import { Page } from '@playwright/test';
import { ENV } from '../config/environment';
import { navigateToRoute, waitForPageLoad } from '../utilities/browser';

/**
 * ASCYN PRO - Base Page Object
 * 
 * Base class for all page objects.
 * Provides common functionality for navigation, waiting, and assertions.
 */
export class BasePage {
  readonly page: Page;
  readonly url: string;
  
  constructor(page: Page, url: string) {
    this.page = page;
    this.url = url;
  }
  
  /**
   * Navigate to the page
   */
  async goto() {
    await navigateToRoute(this.page, this.url);
    await this.waitForLoad();
  }
  
  /**
   * Wait for page to load
   */
  async waitForLoad() {
    await waitForPageLoad(this.page);
  }
  
  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.page.waitForURL(new RegExp(this.url.replace(/\//g, '\\/')), {
        timeout: 5000,
      });
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }
  
  /**
   * Get current URL
   */
  async getUrl(): Promise<string> {
    return this.page.url();
  }
  
  /**
   * Take a screenshot
   */
  async screenshot(name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({
      path: `tests/screenshots/${name}-${timestamp}.png`,
      fullPage: true,
    });
  }
  
  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout?: number) {
    await this.page.waitForSelector(selector, {
      state: 'visible',
      timeout: timeout || ENV.DEFAULT_TIMEOUT,
    });
  }
  
  /**
   * Check if element exists
   */
  async elementExists(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Get element text
   */
  async getElementText(selector: string): Promise<string> {
    return (await this.page.locator(selector).textContent()) ?? '';
  }
  
  /**
   * Click element
   */
  async click(selector: string) {
    await this.page.click(selector);
  }
  
  /**
   * Fill input field
   */
  async fill(selector: string, value: string) {
    await this.page.fill(selector, value);
  }
  
  /**
   * Get input value
   */
  async getInputValue(selector: string): Promise<string> {
    return this.page.locator(selector).inputValue();
  }
  
  /**
   * Check if element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    return this.page.locator(selector).isVisible();
  }
  
  /**
   * Check if element is enabled
   */
  async isEnabled(selector: string): Promise<boolean> {
    return this.page.locator(selector).isEnabled();
  }
  
  /**
   * Get console errors
   */
  getConsoleErrors(): string[] {
    const errors: string[] = [];
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    return errors;
  }
  
  /**
   * Get failed network requests
   */
  getFailedRequests(): string[] {
    const failed: string[] = [];
    this.page.on('requestfailed', (request) => {
      failed.push(`${request.method()} ${request.url()}`);
    });
    return failed;
  }
}
