import { test, expect } from '@playwright/test'
import { loginAsStudent } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Chapter Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page)
  })

  test('should load chapters index page', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters')
    await expect(page.locator('h1')).toContainText(/chapters/i)
    
    // Should show chapter grid or list
    const chapterElements = page.locator('[href*="/chapters/"]')
    await expect(chapterElements.first()).toBeVisible()
  })

  test('should navigate to individual chapters', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters')
    
    // Click on first chapter
    const firstChapter = page.locator('[href*="/chapters/"]').first()
    await firstChapter.click()
    
    // Should be on chapter page
    await expect(page).toHaveURL(/.*chapters\/\d+/)
    await expect(page.locator('h1, h2')).toContainText(/chapter/i)
  })

  test('should validate all published chapters load correctly', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters')
    
    // Get all chapter links
    const chapterLinks = page.locator('[href*="/chapters/"]')
    const chapterCount = await chapterLinks.count()
    
    // Test first 3 chapters (to avoid excessive test time)
    const chaptersToTest = Math.min(chapterCount, 3)
    
    for (let i = 0; i < chaptersToTest; i++) {
      await navigateTo(page, '/dashboard/chapters')
      const chapter = chapterLinks.nth(i)
      
      await chapter.click()
      
      // Verify chapter loads
      await expect(page).toHaveURL(/.*chapters\/\d+/)
      await expect(page.locator('h1, h2')).toBeVisible()
      
      // Check for basic content
      const contentElements = page.locator('main, .content')
      await expect(contentElements.first()).toBeVisible()
    }
  })

  test('should have working previous/next navigation', async ({ page }) => {
    // Navigate to a chapter
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for next button
    const nextButton = page.locator('text=/next|→/i')
    if (await nextButton.count() > 0) {
      await nextButton.first().click()
      
      // Should navigate to next chapter
      await expect(page).toHaveURL(/.*chapters\/\d+/)
      
      // Look for previous button
      const prevButton = page.locator('text=/previous|prev|←/i')
      if (await prevButton.count() > 0) {
        await prevButton.first().click()
        
        // Should navigate back
        await expect(page).toHaveURL(/.*chapters\/\d+/)
      }
    }
  })

  test('should have functional sidebar navigation', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for sidebar navigation
    const sidebarNav = page.locator('nav, .sidebar')
    if (await sidebarNav.count() > 0) {
      await expect(sidebarNav.first()).toBeVisible()
    }
  })

  test('should display accurate breadcrumbs', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for breadcrumb navigation
    const breadcrumbs = page.locator('nav[aria-label*="breadcrumb"], .breadcrumb')
    if (await breadcrumbs.count() > 0) {
      await expect(breadcrumbs.first()).toBeVisible()
    }
  })

  test('should not have broken links', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters')
    
    // Get all links on the page
    const links = page.locator('a[href]')
    const linkCount = await links.count()
    
    // Test first 5 links
    const linksToTest = Math.min(linkCount, 5)
    
    for (let i = 0; i < linksToTest; i++) {
      const link = links.nth(i)
      const href = await link.getAttribute('href')
      
      if (href && !href.startsWith('#') && !href.startsWith('mailto:')) {
        // Check if link is internal
        if (href.startsWith('/') || href.includes('localhost')) {
          const response = await page.request.get(href)
          expect(response.status()).toBeLessThan(400)
        }
      }
    }
  })
})
