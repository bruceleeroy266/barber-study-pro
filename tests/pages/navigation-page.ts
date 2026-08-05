import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

/**
 * ASCYN PRO - Navigation Page Object
 * 
 * Represents the main navigation and layout components.
 */
export class NavigationPage extends BasePage {
  // Locators
  readonly mainNav: Locator;
  readonly logo: Locator;
  readonly dashboardLink: Locator;
  readonly chaptersLink: Locator;
  readonly progressLink: Locator;
  readonly gradesLink: Locator;
  readonly messagesLink: Locator;
  readonly profileLink: Locator;
  readonly settingsLink: Locator;
  readonly logoutButton: Locator;
  readonly mobileMenuButton: Locator;
  readonly mobileMenu: Locator;
  
  constructor(page: Page) {
    super(page, '');
    
    // Initialize locators
    this.mainNav = page.locator('nav, [role="navigation"], header');
    this.logo = page.locator('[data-testid="logo"], .logo, img[alt*="logo"]');
    this.dashboardLink = page.locator('a[href*="dashboard"], text=Dashboard');
    this.chaptersLink = page.locator('a[href*="chapters"], text=Chapters');
    this.progressLink = page.locator('a[href*="progress"], text=Progress');
    this.gradesLink = page.locator('a[href*="grades"], text=Grades');
    this.messagesLink = page.locator('a[href*="messages"], text=Messages');
    this.profileLink = page.locator('a[href*="profile"], text=Profile');
    this.settingsLink = page.locator('a[href*="settings"], text=Settings');
    this.logoutButton = page.locator('text=Logout, text=Sign Out, button:has-text("Logout")');
    this.mobileMenuButton = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu"], .hamburger');
    this.mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, [role="menu"]');
  }
  
  /**
   * Navigate to dashboard
   */
  async goToDashboard() {
    await this.dashboardLink.click();
  }
  
  /**
   * Navigate to chapters
   */
  async goToChapters() {
    await this.chaptersLink.click();
  }
  
  /**
   * Navigate to progress
   */
  async goToProgress() {
    await this.progressLink.click();
  }
  
  /**
   * Navigate to grades
   */
  async goToGrades() {
    await this.gradesLink.click();
  }
  
  /**
   * Navigate to messages
   */
  async goToMessages() {
    await this.messagesLink.click();
  }
  
  /**
   * Navigate to profile
   */
  async goToProfile() {
    await this.profileLink.click();
  }
  
  /**
   * Navigate to settings
   */
  async goToSettings() {
    await this.settingsLink.click();
  }
  
  /**
   * Logout
   */
  async logout() {
    await this.logoutButton.click();
  }
  
  /**
   * Open mobile menu
   */
  async openMobileMenu() {
    await this.mobileMenuButton.click();
  }
  
  /**
   * Check if mobile menu is visible
   */
  async isMobileMenuVisible(): Promise<boolean> {
    return this.mobileMenu.isVisible();
  }
  
  /**
   * Check if navigation is visible
   */
  async isNavigationVisible(): Promise<boolean> {
    return this.mainNav.isVisible();
  }
  
  /**
   * Get all navigation links
   */
  async getNavigationLinks(): Promise<string[]> {
    const links = this.mainNav.locator('a');
    const count = await links.count();
    const urls: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      if (href) {
        urls.push(href);
      }
    }
    
    return urls;
  }
}
