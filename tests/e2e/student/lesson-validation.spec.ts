import { test, expect } from '@playwright/test'
import { loginAsStudent } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Lesson Validation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page)
  })

  test('should load lesson content for chapter 1', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Check for lesson content
    const lessonContent = page.locator('main, .lesson-content')
    await expect(lessonContent.first()).toBeVisible()
    
    // Should have headings
    const headings = page.locator('h1, h2, h3')
    await expect(headings.first()).toBeVisible()
  })

  test('should display headings correctly', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Check for proper heading structure
    const h1 = page.locator('h1')
    const h2 = page.locator('h2')
    const h3 = page.locator('h3')
    
    // At least one heading should be visible
    const headingCount = await h1.count() + await h2.count() + await h3.count()
    expect(headingCount).toBeGreaterThan(0)
    
    // Check heading text is not empty
    if (await h1.count() > 0) {
      const h1Text = await h1.first().textContent()
      expect(h1Text?.trim()).toBeTruthy()
    }
  })

  test('should load images correctly', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Check for images
    const images = page.locator('img')
    const imageCount = await images.count()
    
    if (imageCount > 0) {
      // Check first few images load
      const imagesToCheck = Math.min(imageCount, 3)
      
      for (let i = 0; i < imagesToCheck; i++) {
        const img = images.nth(i)
        await expect(img).toBeVisible()
        
        // Check image has src
        const src = await img.getAttribute('src')
        expect(src).toBeTruthy()
        
        // Check image loads without error
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth)
        expect(naturalWidth).toBeGreaterThan(0)
      }
    }
  })

  test('should load embedded media correctly', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Check for embedded media (videos, iframes, etc.)
    const mediaElements = page.locator('video, iframe, audio, embed')
    const mediaCount = await mediaElements.count()
    
    if (mediaCount > 0) {
      // Check first media element
      const media = mediaElements.first()
      await expect(media).toBeVisible()
      
      // Check media has source
      const src = await media.getAttribute('src')
      expect(src).toBeTruthy()
    }
  })

  test('should render formatting correctly', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Check for formatted content
    const formattedElements = page.locator('p, div, span, strong, em, ul, ol, li')
    const elementCount = await formattedElements.count()
    expect(elementCount).toBeGreaterThan(0)
    
    // Check for text content
    const textContent = page.locator('text=/\\w+/')
    await expect(textContent.first()).toBeVisible()
  })

  test('should not have JavaScript errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    page.on('pageerror', error => {
      errors.push(error.message)
    })
    
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Wait a bit for any async errors
    await page.waitForTimeout(2000)
    
    // Filter out known acceptable errors (like network errors in test environment)
    const criticalErrors = errors.filter(error => 
      !error.includes('net::ERR_') && 
      !error.includes('Failed to fetch') &&
      !error.includes('NetworkError')
    )
    
    expect(criticalErrors).toHaveLength(0)
  })

  test('should scroll properly', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Get initial scroll position
    const initialScrollY = await page.evaluate(() => window.scrollY)
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(500)
    
    // Check scroll position changed
    const newScrollY = await page.evaluate(() => window.scrollY)
    expect(newScrollY).toBeGreaterThan(initialScrollY)
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(500)
    
    // Check back at top
    const finalScrollY = await page.evaluate(() => window.scrollY)
    expect(finalScrollY).toBe(0)
  })

  test('should validate lesson content for multiple chapters', async ({ page }) => {
    // Test first 3 chapters
    for (let chapterNum = 1; chapterNum <= 3; chapterNum++) {
      await navigateTo(page, `/dashboard/chapters/${chapterNum}`)
      
      // Check page loads
      await expect(page).toHaveURL(new RegExp(`.*chapters/${chapterNum}`))
      
      // Check for content
      const content = page.locator('main, .content')
      await expect(content.first()).toBeVisible()
      
      // Check for headings
      const headings = page.locator('h1, h2, h3')
      const headingCount = await headings.count()
      expect(headingCount).toBeGreaterThan(0)
    }
  })
})
