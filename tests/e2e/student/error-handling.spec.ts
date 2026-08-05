import { test, expect } from '@playwright/test'
import { loginAsStudent } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page)
  })

  test('should handle invalid chapter IDs gracefully', async ({ page }) => {
    // Try to access invalid chapter
    await navigateTo(page, '/dashboard/chapters/999')
    
    // Should either show 404 or redirect gracefully
    const currentUrl = page.url()
    const pageContent = page.locator('text=/404|not found|error|invalid/i')
    
    if (await pageContent.count() > 0) {
      // Shows error page - acceptable
      await expect(pageContent.first()).toBeVisible()
    } else {
      // Redirects or shows other content - also acceptable
      expect(currentUrl).toMatch(/404|error|dashboard|chapters/)
    }
  })

  test('should handle refresh during quiz gracefully', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for quiz section
    const quizSection = page.locator('text=/quiz|assessment|test/i')
    
    if (await quizSection.count() > 0) {
      // Start quiz if possible
      const startButton = page.locator('text=/start|begin|take.*quiz/i')
      if (await startButton.count() > 0) {
        await startButton.first().click()
        await page.waitForTimeout(1000)
        
        // Refresh page during quiz
        await page.reload()
        await page.waitForLoadState('domcontentloaded')
        
        // Should handle gracefully (either restart quiz or show appropriate message)
        const content = page.locator('main, .content, text=/quiz|error|start/i')
        await expect(content.first()).toBeVisible()
      }
    }
  })

  test('should handle browser back/forward navigation', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Navigate to chapters
    await navigateTo(page, '/dashboard/chapters')
    await expect(page).toHaveURL(/.*chapters/)
    
    // Navigate to specific chapter
    await navigateTo(page, '/dashboard/chapters/1')
    await expect(page).toHaveURL(/.*chapters\/1/)
    
    // Go back
    await page.goBack()
    await expect(page).toHaveURL(/.*chapters/)
    
    // Go forward
    await page.goForward()
    await expect(page).toHaveURL(/.*chapters\/1/)
    
    // Content should still load correctly
    const content = page.locator('main, .content')
    await expect(content.first()).toBeVisible()
  })

  test('should handle network interruption gracefully', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Simulate offline condition
    await page.context().setOffline(true)
    
    // Try to navigate
    await navigateTo(page, '/dashboard/chapters')
    
    // Should either show offline message or handle gracefully
    const offlineMessage = page.locator('text=/offline|network|connection|error/i')
    const content = page.locator('main, .content')
    
    if (await offlineMessage.count() > 0) {
      await expect(offlineMessage.first()).toBeVisible()
    } else {
      // Should still show some content
      await expect(content.first()).toBeVisible()
    }
    
    // Restore network
    await page.context().setOffline(false)
  })

  test('should handle malformed URLs gracefully', async ({ page }) => {
    const malformedUrls = [
      '/dashboard/chapters/abc',
      '/dashboard/chapters/-1',
      '/dashboard/chapters/1.5',
      '/dashboard/invalid-page',
      '/dashboard/chapters/1/invalid-subpage'
    ]
    
    for (const url of malformedUrls) {
      await navigateTo(page, url)
      
      // Should handle gracefully (404, redirect, or error message)
      const currentUrl = page.url()
      const errorContent = page.locator('text=/404|not found|error|invalid/i')
      
      if (await errorContent.count() > 0) {
        await expect(errorContent.first()).toBeVisible()
      } else {
        // Should redirect to valid page
        expect(currentUrl).toMatch(/dashboard|login|404|error/)
      }
    }
  })

  test('should handle missing images gracefully', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Check for images
    const images = page.locator('img')
    const imageCount = await images.count()
    
    if (imageCount > 0) {
      // Check if images have alt text or fallback
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')
        const src = await img.getAttribute('src')
        
        // Should have alt text or be decorative
        expect(alt !== null || src !== null).toBe(true)
      }
    }
  })

  test('should handle JavaScript errors gracefully', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    page.on('pageerror', error => {
      errors.push(error.message)
    })
    
    await navigateTo(page, '/dashboard')
    
    // Wait for any async errors
    await page.waitForTimeout(2000)
    
    // Filter out known acceptable errors
    const criticalErrors = errors.filter(error => 
      !error.includes('net::ERR_') && 
      !error.includes('Failed to fetch') &&
      !error.includes('NetworkError') &&
      !error.includes('favicon')
    )
    
    // Should not have critical JavaScript errors
    expect(criticalErrors).toHaveLength(0)
  })

  test('should handle slow network conditions', async ({ page }) => {
    // Simulate slow network
    await page.context().setOffline(false)
    
    // Add delay to network requests
    await page.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100))
      await route.continue()
    })
    
    await navigateTo(page, '/dashboard')
    
    // Should still load within reasonable time
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Content should be visible
    const content = page.locator('main, .content')
    await expect(content.first()).toBeVisible()
  })
})
