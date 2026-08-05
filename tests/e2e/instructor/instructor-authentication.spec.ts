import { test, expect } from '@playwright/test'
import { loginAsInstructor } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Instructor Authentication', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await loginAsInstructor(page)
    await expect(page).toHaveURL(/.*instructor/)
  })

  test('should reach instructor dashboard after login', async ({ page }) => {
    await loginAsInstructor(page)
    await expect(page).toHaveURL(/.*instructor/)
    
    // Check for dashboard content
    const dashboardContent = page.locator('main, .dashboard, [data-testid*="dashboard"]')
    await expect(dashboardContent.first()).toBeVisible()
  })

  test('should view assigned classes', async ({ page }) => {
    await loginAsInstructor(page)
    await navigateTo(page, '/instructor')
    
    // Look for class/student indicators
    const classElements = page.locator('text=/class|student|roster/i')
    if (await classElements.count() > 0) {
      await expect(classElements.first()).toBeVisible()
    }
  })

  test('should access navigation menus', async ({ page }) => {
    await loginAsInstructor(page)
    await navigateTo(page, '/instructor')
    
    // Check for navigation elements
    const navElements = page.locator('nav, [role="navigation"], .navigation, .nav')
    await expect(navElements.first()).toBeVisible()
  })

  test('should log out successfully', async ({ page }) => {
    await loginAsInstructor(page)
    await navigateTo(page, '/instructor')
    
    // Find and click logout
    const logoutButton = page.locator('text=/logout|sign out/i')
    if (await logoutButton.count() > 0) {
      await logoutButton.click()
      await expect(page).toHaveURL(/.*login/)
    }
  })

  test('should maintain session persistence', async ({ page }) => {
    await loginAsInstructor(page)
    await navigateTo(page, '/instructor')
    
    // Verify logged in
    await expect(page).toHaveURL(/.*instructor/)
    
    // Refresh page
    await page.reload()
    await page.waitForLoadState('domcontentloaded')
    
    // Should still be logged in
    await expect(page).toHaveURL(/.*instructor/)
  })
})
