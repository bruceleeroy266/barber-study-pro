import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { ROUTES } from '../config/constants';

/**
 * ASCYN PRO - Chapter Page Object
 * 
 * Represents a chapter content page and its interactions.
 */
export class ChapterPage extends BasePage {
  readonly chapterNumber: number;
  
  // Locators
  readonly chapterTitle: Locator;
  readonly lessonContent: Locator;
  readonly flashcardsLink: Locator;
  readonly quizLink: Locator;
  readonly remediationLink: Locator;
  readonly nextChapterButton: Locator;
  readonly prevChapterButton: Locator;
  readonly backToChaptersLink: Locator;
  readonly progressIndicator: Locator;
  
  constructor(page: Page, chapterNumber: number) {
    super(page, ROUTES.CHAPTER(chapterNumber));
    this.chapterNumber = chapterNumber;
    
    // Initialize locators
    this.chapterTitle = page.locator('h1, h2, [data-testid="chapter-title"]');
    this.lessonContent = page.locator('[data-testid="lesson-content"], .lesson-content, main');
    this.flashcardsLink = page.locator('a[href*="flashcards"], text=Flashcards');
    this.quizLink = page.locator('a[href*="quiz"], text=Quiz');
    this.remediationLink = page.locator('a[href*="remediation"], text=Remediation');
    this.nextChapterButton = page.locator('text=Next Chapter, [data-testid="next-chapter"]');
    this.prevChapterButton = page.locator('text=Previous Chapter, [data-testid="prev-chapter"]');
    this.backToChaptersLink = page.locator('a[href*="chapters"], text=Back to Chapters');
    this.progressIndicator = page.locator('[data-testid="progress"], .progress-bar, [role="progressbar"]');
  }
  
  /**
   * Get chapter title
   */
  async getChapterTitle(): Promise<string> {
    return (await this.chapterTitle.textContent()) ?? '';
  }
  
  /**
   * Check if lesson content is visible
   */
  async isLessonVisible(): Promise<boolean> {
    return this.lessonContent.isVisible();
  }
  
  /**
   * Get lesson content text
   */
  async getLessonText(): Promise<string> {
    return (await this.lessonContent.textContent()) ?? '';
  }
  
  /**
   * Navigate to flashcards
   */
  async goToFlashcards() {
    await this.flashcardsLink.click();
  }
  
  /**
   * Navigate to quiz
   */
  async goToQuiz() {
    await this.quizLink.click();
  }
  
  /**
   * Navigate to remediation
   */
  async goToRemediation() {
    await this.remediationLink.click();
  }
  
  /**
   * Navigate to next chapter
   */
  async goToNextChapter() {
    await this.nextChapterButton.click();
  }
  
  /**
   * Navigate to previous chapter
   */
  async goToPrevChapter() {
    await this.prevChapterButton.click();
  }
  
  /**
   * Navigate back to chapters list
   */
  async goBackToChapters() {
    await this.backToChaptersLink.click();
  }
  
  /**
   * Check if flashcards link is visible
   */
  async hasFlashcards(): Promise<boolean> {
    return this.flashcardsLink.isVisible();
  }
  
  /**
   * Check if quiz link is visible
   */
  async hasQuiz(): Promise<boolean> {
    return this.quizLink.isVisible();
  }
  
  /**
   * Check if remediation link is visible
   */
  async hasRemediation(): Promise<boolean> {
    return this.remediationLink.isVisible();
  }
  
  /**
   * Get progress percentage
   */
  async getProgressPercentage(): Promise<number> {
    const progressText = await this.progressIndicator.textContent() || '0';
    const match = progressText.match(/(\d+)%/);
    return match ? parseInt(match[1], 10) : 0;
  }
  
  /**
   * Check if content is empty or placeholder
   */
  async isContentEmpty(): Promise<boolean> {
    const text = await this.getLessonText();
    const emptyIndicators = [
      'Coming soon',
      'Placeholder',
      'Under construction',
      'Content not available',
      'Loading...',
    ];
    
    return emptyIndicators.some(indicator => 
      text.toLowerCase().includes(indicator.toLowerCase())
    ) || text.trim().length < 100;
  }
}
