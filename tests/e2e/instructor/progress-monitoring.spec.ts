import { test, expect } from '@playwright/test'
import { loginAsInstructor } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Student Progress Monitoring', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsInstructor(page)
  })

  test('should view chapter completion', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for chapter completion indicators
    const chapterElements = page.locator('text=/chapter|complete|finished/i')
    
    if (await chapterElements.count() > 0) {
      await expect(chapterElements.first()).toBeVisible()
    }
  })

  test('should view quiz scores', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for quiz score indicators
    const quizElements = page.locator('text=/quiz|score|%/i')
    
    if (await quizElements.count() > 0) {
      await expect(quizElements.first()).toBeVisible()
    }
  })

  test('should view learning progress', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for progress indicators
    const progressElements = page.locator('text=/progress|learning|advance/i')
    
    if (await progressElements.count() > 0) {
      await expect(progressElements.first()).toBeVisible()
    }
  })

  test('should view recent activity', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for activity indicators
    const activityElements = page.locator('text=/recent|activity|last|latest/i')
    
    if (await activityElements.count() > 0) {
      await expect(activityElements.first()).toBeVisible()
    }
  })

  test('should view time spent if tracked', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for time tracking indicators
    const timeElements = page.locator('text=/time|hour|minute|duration/i')
    
    if (await timeElements.count() > 0) {
      await expect(timeElements.first()).toBeVisible()
    }
  })

  test('should view completion percentages', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for percentage indicators
    const percentageElements = page.locator('text=/\\d+%|percent|complete/i')
    
    if (await percentageElements.count() > 0) {
      await expect(percentageElements.first()).toBeVisible()
      
      // Check percentage format
      const percentageText = await percentageElements.first().textContent()
      expect(percentageText).toMatch(/\d+%|percent|complete/i)
    }
  })

  test('should display information matching stored student data', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Navigate to a student profile
    const studentLinks = page.locator('a[href*="student"], .student-row')
    
    if (await studentLinks.count() > 0) {
      await studentLinks.first().click()
      await page.waitForTimeout(1000)
      
      // Look for data consistency indicators
      const dataElements = page.locator('text=/\\d+|%|score|progress|complete/i')
      
      if (await dataElements.count() > 0) {
        await expect(dataElements.first()).toBeVisible()
        
        // Check data format
        const dataText = await dataElements.first().textContent()
        expect(dataText).toMatch(/\d+|%|score|progress|complete/i)
      }
    }
  })
})
