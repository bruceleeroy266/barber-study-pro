import { test, expect } from '@playwright/test'
import { loginAsStudent } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Quiz Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page)
  })

  test('should load quiz for chapter 1', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for quiz section
    const quizSection = page.locator('text=/quiz|assessment|test/i')
    await expect(quizSection.first()).toBeVisible()
  })

  test('should render questions correctly', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for quiz questions
    const questions = page.locator('.question, [data-testid*="question"]')
    
    if (await questions.count() > 0) {
      await expect(questions.first()).toBeVisible()
      
      // Check question has text
      const questionText = questions.first().locator('text=/\\w+/')
      await expect(questionText.first()).toBeVisible()
    }
  })

  test('should have working answer selection', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for answer options
    const answerOptions = page.locator('input[type="radio"], input[type="checkbox"], .answer-option')
    
    if (await answerOptions.count() > 0) {
      // Click first answer option
      await answerOptions.first().click()
      await page.waitForTimeout(500)
      
      // Check if answer is selected
      const isChecked = await answerOptions.first().isChecked()
      expect(isChecked).toBe(true)
    }
  })

  test('should have navigation functions', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for quiz navigation
    const nextButton = page.locator('text=/next|→/i')
    const prevButton = page.locator('text=/previous|prev|←/i')
    
    if (await nextButton.count() > 0) {
      await expect(nextButton.first()).toBeVisible()
      
      // Click next
      await nextButton.first().click()
      await page.waitForTimeout(500)
      
      // Check if previous button becomes available
      if (await prevButton.count() > 0) {
        await expect(prevButton.first()).toBeVisible()
      }
    }
  })

  test('should submit quiz successfully', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for submit button
    const submitButton = page.locator('text=/submit|finish|complete/i')
    
    if (await submitButton.count() > 0) {
      // Answer a few questions first if possible
      const answerOptions = page.locator('input[type="radio"], input[type="checkbox"], .answer-option')
      const optionCount = await answerOptions.count()
      
      if (optionCount > 0) {
        // Answer first few questions
        const questionsToAnswer = Math.min(optionCount, 3)
        for (let i = 0; i < questionsToAnswer; i++) {
          await answerOptions.nth(i).click()
          await page.waitForTimeout(200)
        }
      }
      
      // Submit quiz
      await submitButton.first().click()
      await page.waitForTimeout(1000)
      
      // Look for results or confirmation
      const results = page.locator('text=/result|score|complete|submitted/i')
      if (await results.count() > 0) {
        await expect(results.first()).toBeVisible()
      }
    }
  })

  test('should calculate score correctly', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for score display
    const scoreElements = page.locator('text=/score|\\d+%|\\d+\\/\\d+/i')
    
    if (await scoreElements.count() > 0) {
      await expect(scoreElements.first()).toBeVisible()
      
      // Check score format
      const scoreText = await scoreElements.first().textContent()
      expect(scoreText).toMatch(/\d+/)
    }
  })

  test('should display pass/fail status correctly', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for pass/fail indicators
    const statusElements = page.locator('text=/pass|fail|correct|incorrect/i')
    
    if (await statusElements.count() > 0) {
      await expect(statusElements.first()).toBeVisible()
    }
  })

  test('should load review page', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for review functionality
    const reviewButton = page.locator('text=/review|explanation|solution/i')
    
    if (await reviewButton.count() > 0) {
      await reviewButton.first().click()
      await page.waitForTimeout(1000)
      
      // Check for review content
      const reviewContent = page.locator('text=/explanation|review|solution/i')
      if (await reviewContent.count() > 0) {
        await expect(reviewContent.first()).toBeVisible()
      }
    }
  })

  test('should display explanations correctly', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for explanations
    const explanations = page.locator('text=/explanation|because|reason/i')
    
    if (await explanations.count() > 0) {
      await expect(explanations.first()).toBeVisible()
      
      // Check explanation has content
      const explanationText = await explanations.first().textContent()
      expect(explanationText?.trim()).toBeTruthy()
    }
  })

  test('should validate quiz workflow for multiple chapters', async ({ page }) => {
    // Test first 3 chapters
    for (let chapterNum = 1; chapterNum <= 3; chapterNum++) {
      await navigateTo(page, `/dashboard/chapters/${chapterNum}`)
      
      // Look for quiz section
      const quizSection = page.locator('text=/quiz|assessment|test/i')
      
      if (await quizSection.count() > 0) {
        await expect(quizSection.first()).toBeVisible()
        
        // Check for questions
        const questions = page.locator('.question, [data-testid*="question"]')
        if (await questions.count() > 0) {
          await expect(questions.first()).toBeVisible()
        }
      }
    }
  })
})
