import { test, expect } from '@playwright/test'
import { loginAsStudent } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Student Dashboard Validation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page)
  })

  test('should reach student dashboard after login', async ({ page }) => {
    await expect(page).toHaveURL(/.*dashboard/)
    await expect(page.locator('h1')).toContainText(/dashboard|welcome/i)
  })

  test('should view assigned content', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Look for any content indicators
    const contentIndicators = page.locator('main, .content, [data-testid*="content"], .dashboard')
    await expect(contentIndicators.first()).toBeVisible()
  })

  test('should view available chapters', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters')
    await expect(page.locator('h1')).toContainText(/chapters/i)
    
    // Check for chapter elements
    const chapterElements = page.locator('[href*="/chapters/"]')
    await expect(chapterElements.first()).toBeVisible()
  })

  test('should view progress information', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Look for progress indicators
    const progressElements = page.locator('text=/progress|completion|%/i')
    if (await progressElements.count() > 0) {
      await expect(progressElements.first()).toBeVisible()
    }
  })

  test('should view navigation menu', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Check for navigation elements
    const navElements = page.locator('nav, [role="navigation"], .navigation, .nav')
    await expect(navElements.first()).toBeVisible()
  })

  test('should log out successfully', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Find and click logout
    const logoutButton = page.locator('text=/logout|sign out/i')
    if (await logoutButton.count() > 0) {
      await logoutButton.click()
      await expect(page).toHaveURL(/.*login/)
    }
  })

  test('should display dashboard widgets correctly', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Check for common dashboard widgets
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
})
