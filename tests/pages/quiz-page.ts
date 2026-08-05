import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { ROUTES } from '../config/constants';

/**
 * ASCYN PRO - Quiz Page Object
 * 
 * Represents the quiz interface and its interactions.
 */
export class QuizPage extends BasePage {
  readonly chapterNumber: number;
  
  // Locators
  readonly quizContainer: Locator;
  readonly questionText: Locator;
  readonly answerOptions: Locator;
  readonly submitButton: Locator;
  readonly nextButton: Locator;
  readonly prevButton: Locator;
  readonly progressIndicator: Locator;
  readonly resultsContainer: Locator;
  readonly scoreDisplay: Locator;
  readonly backToChapterLink: Locator;
  
  constructor(page: Page, chapterNumber: number) {
    super(page, ROUTES.CHAPTER_QUIZ(chapterNumber));
    this.chapterNumber = chapterNumber;
    
    // Initialize locators
    this.quizContainer = page.locator('[data-testid="quiz"], .quiz-container, .quiz');
    this.questionText = page.locator('[data-testid="question"], .question, h2, h3');
    this.answerOptions = page.locator('[data-testid="answer-option"], .answer-option, input[type="radio"]');
    this.submitButton = page.locator('button:has-text("Submit"), [data-testid="submit-quiz"]');
    this.nextButton = page.locator('button:has-text("Next"), [data-testid="next-question"]');
    this.prevButton = page.locator('button:has-text("Previous"), [data-testid="prev-question"]');
    this.progressIndicator = page.locator('[data-testid="quiz-progress"], .quiz-progress, text=/Question \\d+ of \\d+/');
    this.resultsContainer = page.locator('[data-testid="quiz-results"], .quiz-results, .results');
    this.scoreDisplay = page.locator('[data-testid="score"], .score, text=/\\d+%/');
    this.backToChapterLink = page.locator('a[href*="chapters"], text=Back to Chapter');
  }
  
  /**
   * Get current question text
   */
  async getQuestionText(): Promise<string> {
    return (await this.questionText.textContent()) ?? '';
  }
  
  /**
   * Get answer option count
   */
  async getAnswerOptionCount(): Promise<number> {
    return this.answerOptions.count();
  }
  
  /**
   * Select answer by index (0-based)
   */
  async selectAnswer(index: number) {
    await this.answerOptions.nth(index).click();
  }
  
  /**
   * Select answer by text
   */
  async selectAnswerByText(text: string) {
    await this.page.click(`text=${text}`);
  }
  
  /**
   * Submit quiz
   */
  async submitQuiz() {
    await this.submitButton.click();
  }
  
  /**
   * Go to next question
   */
  async nextQuestion() {
    await this.nextButton.click();
  }
  
  /**
   * Go to previous question
   */
  async prevQuestion() {
    await this.prevButton.click();
  }
  
  /**
   * Get current question number
   */
  async getCurrentQuestionNumber(): Promise<number> {
    const text = await this.progressIndicator.textContent() || 'Question 1 of 1';
    const match = text.match(/Question (\d+) of/);
    return match ? parseInt(match[1], 10) : 1;
  }
  
  /**
   * Get total question count
   */
  async getTotalQuestionCount(): Promise<number> {
    const text = await this.progressIndicator.textContent() || 'Question 1 of 1';
    const match = text.match(/of (\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }
  
  /**
   * Check if results are displayed
   */
  async isResultsDisplayed(): Promise<boolean> {
    return this.resultsContainer.isVisible();
  }
  
  /**
   * Get score percentage
   */
  async getScorePercentage(): Promise<number> {
    const text = await this.scoreDisplay.textContent() || '0%';
    const match = text.match(/(\d+)%/);
    return match ? parseInt(match[1], 10) : 0;
  }
  
  /**
   * Navigate back to chapter
   */
  async goBackToChapter() {
    await this.backToChapterLink.click();
  }
  
  /**
   * Check if quiz is loaded
   */
  async isLoaded(): Promise<boolean> {
    return this.quizContainer.isVisible();
  }
  
  /**
   * Answer all questions with first option
   */
  async answerAllWithFirstOption() {
    const totalQuestions = await this.getTotalQuestionCount();
    
    for (let i = 0; i < totalQuestions; i++) {
      await this.selectAnswer(0);
      
      if (i < totalQuestions - 1) {
        await this.nextQuestion();
      }
    }
    
    await this.submitQuiz();
  }
}
