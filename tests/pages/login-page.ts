import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { ROUTES } from '../config/constants';

/**
 * ASCYN PRO - Login Page Object
 * 
 * Represents the login page and its interactions.
 */
export class LoginPage extends BasePage {
  // Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly signupLink: Locator;
  readonly resetPasswordLink: Locator;
  readonly errorMessage: Locator;
  
  constructor(page: Page) {
    super(page, ROUTES.LOGIN);
    
    // Initialize locators
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.signupLink = page.locator('a[href*="signup"], text=Sign Up');
    this.resetPasswordLink = page.locator('a[href*="reset"], text=Forgot Password');
    this.errorMessage = page.locator('[role="alert"], .error, .text-red-500, .text-destructive');
  }
  
  /**
   * Fill login form
   */
  async fillForm(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }
  
  /**
   * Submit login form
   */
  async submit() {
    await this.submitButton.click();
  }
  
  /**
   * Login with credentials
   */
  async login(email: string, password: string) {
    await this.fillForm(email, password);
    await this.submit();
  }
  
  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    if (await this.errorMessage.isVisible()) {
      return (await this.errorMessage.textContent()) ?? '';
    }
    return '';
  }
  
  /**
   * Check if error message is displayed
   */
  async hasError(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }
  
  /**
   * Navigate to signup page
   */
  async goToSignup() {
    await this.signupLink.click();
  }
  
  /**
   * Navigate to reset password page
   */
  async goToResetPassword() {
    await this.resetPasswordLink.click();
  }
  
  /**
   * Check if form is visible
   */
  async isFormVisible(): Promise<boolean> {
    const emailVisible = await this.emailInput.isVisible();
    const passwordVisible = await this.passwordInput.isVisible();
    const submitVisible = await this.submitButton.isVisible();
    return emailVisible && passwordVisible && submitVisible;
  }
}
