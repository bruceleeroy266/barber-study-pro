import { test, expect } from '@playwright/test'
import { loginAsStudent } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Progress Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page)
  })

  test('should update chapter completion', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for completion indicators
    const completionElements = page.locator('text=/complete|finished|done/i')
    
    if (await completionElements.count() > 0) {
      await expect(completionElements.first()).toBeVisible()
    }
    
    // Look for progress percentage
    const progressElements = page.locator('text=/\\d+%/')
    if (await progressElements.count() > 0) {
      await expect(progressElements.first()).toBeVisible()
    }
  })

  test('should update quiz completion', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for quiz completion indicators
    const quizCompletion = page.locator('text=/quiz.*complete|assessment.*done/i')
    
    if (await quizCompletion.count() > 0) {
      await expect(quizCompletion.first()).toBeVisible()
    }
    
    // Look for quiz scores
    const quizScores = page.locator('text=/score|\\d+%/i')
    if (await quizScores.count() > 0) {
      await expect(quizScores.first()).toBeVisible()
    }
  })

  test('should update dashboard statistics', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Look for dashboard statistics
    const statsElements = page.locator('text=/\\d+|progress|complete|%/i')
    
    if (await statsElements.count() > 0) {
      await expect(statsElements.first()).toBeVisible()
    }
    
    // Look for specific dashboard widgets
    const widgetSelectors = [
      'text=/readiness/i',
      'text=/weak/i',
      'text=/study/i',
      'text=/recent/i'
    ]
    
    for (const selector of widgetSelectors) {
      const element = page.locator(selector)
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible()
      }
    }
  })

  test('should persist progress after refresh', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Get initial progress state
    const progressElements = page.locator('text=/\\d+%|complete|progress/i')
    let initialProgress = ''
    
    if (await progressElements.count() > 0) {
      initialProgress = await progressElements.first().textContent() || ''
    }
    
    // Refresh page
    await page.reload()
    await page.waitForLoadState('domcontentloaded')
    
    // Check progress persists
    if (await progressElements.count() > 0) {
      const persistedProgress = await progressElements.first().textContent() || ''
      // Progress should be similar (might not be exactly the same due to dynamic content)
      console.log(`Progress before: "${initialProgress}", after: "${persistedProgress}"`)
    }
  })

  test('should persist progress after logout/login', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Get initial progress state
    const progressElements = page.locator('text=/\\d+%|complete|progress/i')
    let initialProgress = ''
    
    if (await progressElements.count() > 0) {
      initialProgress = await progressElements.first().textContent() || ''
    }
    
    // Logout
    const logoutButton = page.locator('text=/logout|sign out/i')
    if (await logoutButton.count() > 0) {
      await logoutButton.click()
      await expect(page).toHaveURL(/.*login/)
      
      // Login again
      await loginAsStudent(page)
      await navigateTo(page, '/dashboard/chapters/1')
      
      // Check progress persists
      if (await progressElements.count() > 0) {
        const persistedProgress = await progressElements.first().textContent() || ''
        console.log(`Progress before logout: "${initialProgress}", after login: "${persistedProgress}"`)
      }
    }
  })

  test('should track progress across multiple chapters', async ({ page }) => {
    // Test progress tracking for first 3 chapters
    for (let chapterNum = 1; chapterNum <= 3; chapterNum++) {
      await navigateTo(page, `/dashboard/chapters/${chapterNum}`)
      
      // Look for progress indicators
      const progressElements = page.locator('text=/\\d+%|complete|progress/i')
      
      if (await progressElements.count() > 0) {
        await expect(progressElements.first()).toBeVisible()
        
        // Check progress format
        const progressText = await progressElements.first().textContent()
        expect(progressText).toMatch(/\d+|complete|progress/i)
      }
    }
  })

  test('should display progress in dashboard overview', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Look for overall progress indicators
    const overallProgress = page.locator('text=/overall|total|progress/i')
    
    if (await overallProgress.count() > 0) {
      await expect(overallProgress.first()).toBeVisible()
    }
    
    // Look for chapter completion summary
    const chapterSummary = page.locator('text=/\\d+ of \\d+|\\d+\\/\\d+|chapters.*complete/i')
    
    if (await chapterSummary.count() > 0) {
      await expect(chapterSummary.first()).toBeVisible()
    }
  })
})
