import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { ROUTES } from '../config/constants';

/**
 * ASCYN PRO - Flashcards Page Object
 * 
 * Represents the flashcards interface and its interactions.
 */
export class FlashcardsPage extends BasePage {
  readonly chapterNumber: number;
  
  // Locators
  readonly flashcard: Locator;
  readonly cardFront: Locator;
  readonly cardBack: Locator;
  readonly flipButton: Locator;
  readonly nextButton: Locator;
  readonly prevButton: Locator;
  readonly progressText: Locator;
  readonly cardCounter: Locator;
  readonly backToChapterLink: Locator;
  
  constructor(page: Page, chapterNumber: number) {
    super(page, ROUTES.CHAPTER_FLASHCARDS(chapterNumber));
    this.chapterNumber = chapterNumber;
    
    // Initialize locators
    this.flashcard = page.locator('[data-testid="flashcard"], .flashcard, .card');
    this.cardFront = page.locator('[data-testid="card-front"], .card-front, .front');
    this.cardBack = page.locator('[data-testid="card-back"], .card-back, .back');
    this.flipButton = page.locator('button:has-text("Flip"), [data-testid="flip-card"]');
    this.nextButton = page.locator('button:has-text("Next"), [data-testid="next-card"]');
    this.prevButton = page.locator('button:has-text("Previous"), [data-testid="prev-card"]');
    this.progressText = page.locator('[data-testid="progress"], .progress, text=/\\d+ \\/ \\d+/');
    this.cardCounter = page.locator('[data-testid="card-counter"], .card-counter');
    this.backToChapterLink = page.locator('a[href*="chapters"], text=Back to Chapter');
  }
  
  /**
   * Get current card front text
   */
  async getCardFrontText(): Promise<string> {
    return (await this.cardFront.textContent()) ?? '';
  }
  
  /**
   * Get current card back text
   */
  async getCardBackText(): Promise<string> {
    return (await this.cardBack.textContent()) ?? '';
  }
  
  /**
   * Flip the current card
   */
  async flipCard() {
    await this.flipButton.click();
  }
  
  /**
   * Go to next card
   */
  async nextCard() {
    await this.nextButton.click();
  }
  
  /**
   * Go to previous card
   */
  async prevCard() {
    await this.prevButton.click();
  }
  
  /**
   * Get current card number
   */
  async getCurrentCardNumber(): Promise<number> {
    const text = await this.cardCounter.textContent() || '1';
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }
  
  /**
   * Get total card count
   */
  async getTotalCardCount(): Promise<number> {
    const text = await this.progressText.textContent() || '1/1';
    const match = text.match(/\/ (\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }
  
  /**
   * Check if card is flipped (showing back)
   */
  async isCardFlipped(): Promise<boolean> {
    return this.cardBack.isVisible();
  }
  
  /**
   * Navigate back to chapter
   */
  async goBackToChapter() {
    await this.backToChapterLink.click();
  }
  
  /**
   * Check if flashcards are loaded
   */
  async isLoaded(): Promise<boolean> {
    return this.flashcard.isVisible();
  }
}
