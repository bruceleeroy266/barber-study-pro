import { test, expect } from '@playwright/test'
import { loginAsStudent } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Responsive Testing', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page)
  })

  test('should work on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })
    
    await navigateTo(page, '/dashboard')
    
    // Check dashboard loads
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Check for desktop layout elements
    const desktopElements = page.locator('nav, .sidebar, .main-content')
    await expect(desktopElements.first()).toBeVisible()
    
    // Check navigation is visible
    const navigation = page.locator('nav, [role="navigation"]')
    await expect(navigation.first()).toBeVisible()
  })

  test('should work on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    
    await navigateTo(page, '/dashboard')
    
    // Check dashboard loads
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Check content is accessible
    const content = page.locator('main, .content')
    await expect(content.first()).toBeVisible()
    
    // Check navigation is accessible (might be hamburger menu)
    const navigation = page.locator('nav, [role="navigation"], button[aria-label*="menu"]')
    await expect(navigation.first()).toBeVisible()
  })

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await navigateTo(page, '/dashboard')
    
    // Check dashboard loads
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Check content is accessible
    const content = page.locator('main, .content')
    await expect(content.first()).toBeVisible()
    
    // Check mobile navigation (hamburger menu)
    const mobileNav = page.locator('button[aria-label*="menu"], .hamburger')
    if (await mobileNav.count() > 0) {
      await expect(mobileNav.first()).toBeVisible()
    }
  })

  test('should maintain functionality on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await navigateTo(page, '/dashboard/chapters')
    
    // Check chapters page loads
    await expect(page).toHaveURL(/.*chapters/)
    
    // Check chapter elements are accessible
    const chapterElements = page.locator('[href*="/chapters/"]')
    if (await chapterElements.count() > 0) {
      await expect(chapterElements.first()).toBeVisible()
      
      // Try to click on a chapter
      await chapterElements.first().click()
      await page.waitForTimeout(1000)
      
      // Should navigate to chapter
      await expect(page).toHaveURL(/.*chapters\/\d+/)
    }
  })

  test('should have readable text on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1280, height: 720, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ]
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await navigateTo(page, '/dashboard')
      
      // Check text is readable (not too small)
      const textElements = page.locator('p, h1, h2, h3, span, div')
      if (await textElements.count() > 0) {
        const fontSize = await textElements.first().evaluate((el) => {
          return window.getComputedStyle(el).fontSize
        })
        
        // Font size should be at least 12px
        const fontSizeNum = parseInt(fontSize)
        expect(fontSizeNum).toBeGreaterThanOrEqual(12)
      }
    }
  })

  test('should have accessible buttons on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1280, height: 720, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ]
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await navigateTo(page, '/dashboard')
      
      // Check buttons are large enough to click
      const buttons = page.locator('button, a[href], input[type="submit"]')
      if (await buttons.count() > 0) {
        const buttonSize = await buttons.first().evaluate((el) => {
          const rect = el.getBoundingClientRect()
          return { width: rect.width, height: rect.height }
        })
        
        // Buttons should be at least 44px (accessibility standard)
        expect(buttonSize.width).toBeGreaterThanOrEqual(44)
        expect(buttonSize.height).toBeGreaterThanOrEqual(44)
      }
    }
  })

  test('should maintain layout integrity on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1280, height: 720, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ]
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await navigateTo(page, '/dashboard')
      
      // Check for horizontal scrolling (should not exist)
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth
      })
      
      expect(hasHorizontalScroll).toBe(false)
      
      // Check main content is visible
      const mainContent = page.locator('main, .main, [role="main"]')
      await expect(mainContent.first()).toBeVisible()
    }
  })
})
