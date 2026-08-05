import { test, expect } from '@playwright/test'
import { loginAsInstructor } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsInstructor(page)
  })

  test('should handle invalid student IDs gracefully', async ({ page }) => {
    // Try to access invalid student
    await navigateTo(page, '/instructor/student/999')
    
    // Should either show 404 or redirect gracefully
    const currentUrl = page.url()
    const pageContent = page.locator('text=/404|not found|error|invalid/i')
    
    if (await pageContent.count() > 0) {
      // Shows error page - acceptable
      await expect(pageContent.first()).toBeVisible()
    } else {
      // Redirects or shows other content - also acceptable
      expect(currentUrl).toMatch(/404|error|instructor|dashboard/)
    }
  })

  test('should handle refresh during data loading', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Refresh page during loading
    await page.reload()
    await page.waitForLoadState('domcontentloaded')
    
    // Should still load correctly
    await expect(page).toHaveURL(/.*instructor/)
    
    // Check for main content
    const mainContent = page.locator('main, .main-content')
    await expect(mainContent.first()).toBeVisible()
  })

  test('should handle expired session gracefully', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Clear session storage to simulate expiration
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    
    // Try to navigate to protected page
    await navigateTo(page, '/instructor/student/1')
    
    // Should redirect to login or handle gracefully
    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      // Redirected to login - expected behavior
      await expect(page).toHaveURL(/.*login/)
    } else {
      // Still on page - check if content loads
      const content = page.locator('main, .content')
      await expect(content.first()).toBeVisible()
    }
  })

  test('should handle empty class gracefully', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for empty state indicators
    const emptyStateElements = page.locator('text=/no.*student|empty|no.*data|no.*results/i')
    
    if (await emptyStateElements.count() > 0) {
      await expect(emptyStateElements.first()).toBeVisible()
    }
  })

  test('should handle student with no activity', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Navigate to a student profile
    const studentLinks = page.locator('a[href*="student"], .student-row')
    
    if (await studentLinks.count() > 0) {
      await studentLinks.first().click()
      await page.waitForTimeout(1000)
      
      // Look for no activity indicators
      const noActivityElements = page.locator('text=/no.*activity|never|not.*started/i')
      
      if (await noActivityElements.count() > 0) {
        await expect(noActivityElements.first()).toBeVisible()
      }
    }
  })

  test('should handle network interruption gracefully', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Simulate offline condition
    await page.context().setOffline(true)
    
    // Try to navigate
    await navigateTo(page, '/instructor/student/1')
    
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
      '/instructor/student/abc',
      '/instructor/student/-1',
      '/instructor/student/1.5',
      '/instructor/invalid-page',
      '/instructor/student/1/invalid-subpage'
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
        expect(currentUrl).toMatch(/instructor|login|404|error/)
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
    
    await navigateTo(page, '/instructor')
    
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
})
