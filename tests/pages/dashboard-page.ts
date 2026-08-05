import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { ROUTES } from '../config/constants';

/**
 * ASCYN PRO - Dashboard Page Object
 * 
 * Represents the student dashboard and its interactions.
 */
export class DashboardPage extends BasePage {
  // Locators
  readonly welcomeMessage: Locator;
  readonly progressSection: Locator;
  readonly chaptersGrid: Locator;
  readonly navigationMenu: Locator;
  readonly logoutButton: Locator;
  readonly profileLink: Locator;
  readonly messagesLink: Locator;
  readonly gradesLink: Locator;
  
  constructor(page: Page) {
    super(page, ROUTES.DASHBOARD);
    
    // Initialize locators
    this.welcomeMessage = page.locator('h1, h2, [data-testid="welcome"]');
    this.progressSection = page.locator('[data-testid="progress"], .progress, text=Progress');
    this.chaptersGrid = page.locator('[data-testid="chapters"], .chapters-grid, .grid');
    this.navigationMenu = page.locator('nav, [role="navigation"]');
    this.logoutButton = page.locator('text=Logout, text=Sign Out, [data-testid="logout"]');
    this.profileLink = page.locator('a[href*="profile"], text=Profile');
    this.messagesLink = page.locator('a[href*="messages"], text=Messages');
    this.gradesLink = page.locator('a[href*="grades"], text=Grades');
  }
  
  /**
   * Get welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    return (await this.welcomeMessage.textContent()) ?? '';
  }
  
  /**
   * Check if progress section is visible
   */
  async isProgressVisible(): Promise<boolean> {
    return this.progressSection.isVisible();
  }
  
  /**
   * Get chapter count
   */
  async getChapterCount(): Promise<number> {
    const chapters = this.page.locator('[data-testid="chapter-card"], .chapter-card, [href*="chapters/"]');
    return chapters.count();
  }
  
  /**
   * Navigate to chapter
   */
  async goToChapter(chapterNumber: number) {
    await this.page.click(`[href*="chapters/${chapterNumber}"], text=Chapter ${chapterNumber}`);
  }
  
  /**
   * Navigate to profile
   */
  async goToProfile() {
    await this.profileLink.click();
  }
  
  /**
   * Navigate to messages
   */
  async goToMessages() {
    await this.messagesLink.click();
  }
  
  /**
   * Navigate to grades
   */
  async goToGrades() {
    await this.gradesLink.click();
  }
  
  /**
   * Logout
   */
  async logout() {
    await this.logoutButton.click();
  }
  
  /**
   * Check if navigation menu is visible
   */
  async isNavigationVisible(): Promise<boolean> {
    return this.navigationMenu.isVisible();
  }
  
  /**
   * Get all chapter links
   */
  async getChapterLinks(): Promise<string[]> {
    const links = this.page.locator('[href*="chapters/"]');
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
