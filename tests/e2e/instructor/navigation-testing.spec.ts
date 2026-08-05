import { test, expect } from '@playwright/test'
import { loginAsInstructor } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Navigation Testing', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsInstructor(page)
  })

  test('should load instructor dashboard correctly', async ({ page }) => {
    await navigateTo(page, '/instructor')
    await expect(page).toHaveURL(/.*instructor/)
    
    // Check for main content
    const mainContent = page.locator('main, .main-content')
    await expect(mainContent.first()).toBeVisible()
  })

  test('should return expected HTTP status', async ({ page }) => {
    const response = await page.request.get('/instructor')
    expect(response.status()).toBe(200)
  })

  test('should have working navigation links', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for navigation links
    const navLinks = page.locator('nav a, .navigation a, [role="navigation"] a')
    
    if (await navLinks.count() > 0) {
      // Test first few navigation links
      const linksToTest = Math.min(await navLinks.count(), 3)
      
      for (let i = 0; i < linksToTest; i++) {
        const link = navLinks.nth(i)
        const href = await link.getAttribute('href')
        
        if (href && href.startsWith('/')) {
          // Check if link is accessible
          const response = await page.request.get(href)
          expect(response.status()).toBeLessThan(400)
        }
      }
    }
  })

  test('should display accurate breadcrumbs', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for breadcrumb navigation
    const breadcrumbs = page.locator('nav[aria-label*="breadcrumb"], .breadcrumb')
    
    if (await breadcrumbs.count() > 0) {
      await expect(breadcrumbs.first()).toBeVisible()
      
      // Check breadcrumb content
      const breadcrumbText = await breadcrumbs.first().textContent()
      expect(breadcrumbText).toMatch(/instructor|dashboard|home/i)
    }
  })

  test('should handle browser back/forward navigation', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Navigate to a student profile if available
    const studentLinks = page.locator('a[href*="student"], .student-row')
    
    if (await studentLinks.count() > 0) {
      await studentLinks.first().click()
      await page.waitForTimeout(1000)
      
      // Go back
      await page.goBack()
      await expect(page).toHaveURL(/.*instructor/)
      
      // Go forward
      await page.goForward()
      const currentUrl = page.url()
      expect(currentUrl).toMatch(/student|profile/)
    }
  })

  test('should load all instructor pages correctly', async ({ page }) => {
    const instructorPages = [
      '/instructor',
      '/instructor/assessments',
      '/instructor/attendance',
      '/instructor/compliance',
      '/instructor/gradebook',
      '/instructor/messages',
      '/instructor/rubrics'
    ]
    
    for (const pagePath of instructorPages) {
      await navigateTo(page, pagePath)
      
      // Check page loads
      await expect(page).toHaveURL(new RegExp(`.*${pagePath.replace('/', '\\/')}`))
      
      // Check for main content
      const mainContent = page.locator('main, .main-content')
      await expect(mainContent.first()).toBeVisible()
    }
  })
})
