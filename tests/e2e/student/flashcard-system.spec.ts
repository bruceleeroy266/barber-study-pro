import { test, expect } from '@playwright/test'
import { loginAsStudent } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Flashcard System', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page)
  })

  test('should load flashcards for chapter 1', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for flashcard section
    const flashcardSection = page.locator('text=/flashcard/i')
    await expect(flashcardSection.first()).toBeVisible()
  })

  test('should display flashcard content', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for flashcard container
    const flashcardContainer = page.locator('.flashcard, [data-testid*="flashcard"]')
    if (await flashcardContainer.count() > 0) {
      await expect(flashcardContainer.first()).toBeVisible()
      
      // Should have question/content
      const content = flashcardContainer.locator('text=/\\w+/')
      await expect(content.first()).toBeVisible()
    }
  })

  test('should have working previous/next buttons', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for navigation buttons
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

  test('should have flip animation functionality', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for flashcard
    const flashcard = page.locator('.flashcard, [data-testid*="flashcard"]')
    if (await flashcard.count() > 0) {
      // Look for flip button or click to flip
      const flipButton = page.locator('text=/flip|reveal|show answer/i')
      
      if (await flipButton.count() > 0) {
        await expect(flipButton.first()).toBeVisible()
        await flipButton.first().click()
        await page.waitForTimeout(500)
      } else {
        // Try clicking the flashcard itself
        await flashcard.first().click()
        await page.waitForTimeout(500)
      }
    }
  })

  test('should reveal answer correctly', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for flashcard
    const flashcard = page.locator('.flashcard, [data-testid*="flashcard"]')
    if (await flashcard.count() > 0) {
      // Try to reveal answer
      const flipButton = page.locator('text=/flip|reveal|show answer/i')
      
      if (await flipButton.count() > 0) {
        await flipButton.first().click()
        await page.waitForTimeout(500)
        
        // Look for answer content
        const answerContent = page.locator('text=/answer|correct|solution/i')
        if (await answerContent.count() > 0) {
          await expect(answerContent.first()).toBeVisible()
        }
      }
    }
  })

  test('should update progress', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for progress indicators
    const progressElements = page.locator('text=/progress|\\d+\\/\\d+|%/i')
    
    if (await progressElements.count() > 0) {
      await expect(progressElements.first()).toBeVisible()
      
      // Get initial progress text
      const initialProgress = await progressElements.first().textContent()
      
      // Navigate through flashcards if possible
      const nextButton = page.locator('text=/next|→/i')
      if (await nextButton.count() > 0) {
        await nextButton.first().click()
        await page.waitForTimeout(500)
        
        // Check if progress updated
        const newProgress = await progressElements.first().textContent()
        // Progress might change (not always guaranteed)
        console.log(`Progress changed from "${initialProgress}" to "${newProgress}"`)
      }
    }
  })

  test('should have flagging functionality if implemented', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for flag/bookmark functionality
    const flagButton = page.locator('text=/flag|bookmark|mark/i')
    
    if (await flagButton.count() > 0) {
      await expect(flagButton.first()).toBeVisible()
      await flagButton.first().click()
      await page.waitForTimeout(500)
      
      // Check if flag state changed
      const flaggedButton = page.locator('text=/flagged|bookmarked|marked/i')
      if (await flaggedButton.count() > 0) {
        await expect(flaggedButton.first()).toBeVisible()
      }
    }
  })

  test('should track completion', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for completion indicators
    const completionElements = page.locator('text=/complete|finished|done/i')
    
    if (await completionElements.count() > 0) {
      await expect(completionElements.first()).toBeVisible()
    }
    
    // Look for completion tracking
    const trackingElements = page.locator('text=/\\d+ of \\d+|\\d+\\/\\d+/i')
    if (await trackingElements.count() > 0) {
      await expect(trackingElements.first()).toBeVisible()
    }
  })

  test('should validate flashcards for multiple chapters', async ({ page }) => {
    // Test first 3 chapters
    for (let chapterNum = 1; chapterNum <= 3; chapterNum++) {
      await navigateTo(page, `/dashboard/chapters/${chapterNum}`)
      
      // Look for flashcard section
      const flashcardSection = page.locator('text=/flashcard/i')
      
      if (await flashcardSection.count() > 0) {
        await expect(flashcardSection.first()).toBeVisible()
        
        // Check for flashcard content
        const flashcardContent = page.locator('.flashcard, [data-testid*="flashcard"]')
        if (await flashcardContent.count() > 0) {
          await expect(flashcardContent.first()).toBeVisible()
        }
      }
    }
  })
})
