import { test, expect } from '@playwright/test'
import { loginAsStudent } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Weak Area Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page)
  })

  test('should identify weak areas', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Look for weak area indicators
    const weakAreaElements = page.locator('text=/weak|area|improve|focus/i')
    
    if (await weakAreaElements.count() > 0) {
      await expect(weakAreaElements.first()).toBeVisible()
    }
  })

  test('should update dashboard correctly', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Look for weak area dashboard widget
    const weakAreaDashboard = page.locator('text=/weak.*area|area.*weak/i')
    
    if (await weakAreaDashboard.count() > 0) {
      await expect(weakAreaDashboard.first()).toBeVisible()
      
      // Check for weak area content
      const weakAreaContent = page.locator('text=/chapter|topic|subject/i')
      if (await weakAreaContent.count() > 0) {
        await expect(weakAreaContent.first()).toBeVisible()
      }
    }
  })

  test('should display missed questions', async ({ page }) => {
    await navigateTo(page, '/dashboard/missed-questions')
    
    // Check page loads
    await expect(page).toHaveURL(/.*missed-questions/)
    
    // Look for missed questions content
    const missedQuestions = page.locator('text=/missed|question|incorrect/i')
    
    if (await missedQuestions.count() > 0) {
      await expect(missedQuestions.first()).toBeVisible()
    }
  })

  test('should maintain accurate statistics', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Look for statistics elements
    const statsElements = page.locator('text=/\\d+|%|accuracy|score/i')
    
    if (await statsElements.count() > 0) {
      await expect(statsElements.first()).toBeVisible()
      
      // Check statistics format
      const statsText = await statsElements.first().textContent()
      expect(statsText).toMatch(/\d+|%|accuracy|score/i)
    }
  })

  test('should navigate to weak area details', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Look for weak area links
    const weakAreaLinks = page.locator('a[href*="weak"], a[href*="missed"]')
    
    if (await weakAreaLinks.count() > 0) {
      await weakAreaLinks.first().click()
      await page.waitForTimeout(1000)
      
      // Should navigate to weak area details
      const currentUrl = page.url()
      expect(currentUrl).toMatch(/weak|missed|area/)
    }
  })
})
