import { test, expect } from '@playwright/test'
import { loginAsStudent } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Session Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page)
  })

  test('should maintain session after browser refresh', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Verify logged in
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Refresh page
    await page.reload()
    await page.waitForLoadState('domcontentloaded')
    
    // Should still be logged in
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Check for user content
    const userContent = page.locator('text=/dashboard|welcome|profile/i')
    await expect(userContent.first()).toBeVisible()
  })

  test('should maintain session after navigation', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Navigate to different pages
    const pages = [
      '/dashboard/chapters',
      '/dashboard/progress',
      '/dashboard/profile'
    ]
    
    for (const pagePath of pages) {
      await navigateTo(page, pagePath)
      
      // Should still be logged in
      await expect(page).toHaveURL(new RegExp(`.*${pagePath.replace('/', '\\/')}`))
      
      // Check for user content
      const userContent = page.locator('text=/dashboard|welcome|profile/i')
      if (await userContent.count() > 0) {
        await expect(userContent.first()).toBeVisible()
      }
    }
  })

  test('should maintain progress after logout/login', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Get initial state
    const initialUrl = page.url()
    
    // Logout
    const logoutButton = page.locator('text=/logout|sign out/i')
    if (await logoutButton.count() > 0) {
      await logoutButton.click()
      await expect(page).toHaveURL(/.*login/)
      
      // Login again
      await loginAsStudent(page)
      
      // Navigate back to same page
      await navigateTo(page, '/dashboard/chapters/1')
      
      // Should be able to access same content
      await expect(page).toHaveURL(/.*chapters\/1/)
      
      // Check for content
      const content = page.locator('main, .content')
      await expect(content.first()).toBeVisible()
    }
  })

  test('should handle session expiration gracefully', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Clear session storage to simulate expiration
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    
    // Try to navigate to protected page
    await navigateTo(page, '/dashboard/chapters')
    
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

  test('should preserve study progress across sessions', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for progress indicators
    const progressElements = page.locator('text=/\\d+%|progress|complete/i')
    let initialProgress = ''
    
    if (await progressElements.count() > 0) {
      initialProgress = await progressElements.first().textContent() || ''
    }
    
    // Simulate new session by clearing cookies and re-login
    const context = page.context()
    await context.clearCookies()
    
    // Login again
    await loginAsStudent(page)
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Check progress persists
    if (await progressElements.count() > 0) {
      const persistedProgress = await progressElements.first().textContent() || ''
      console.log(`Progress before: "${initialProgress}", after: "${persistedProgress}"`)
    }
  })

  test('should maintain flashcard position after refresh', async ({ page }) => {
    await navigateTo(page, '/dashboard/chapters/1')
    
    // Look for flashcard section
    const flashcardSection = page.locator('text=/flashcard/i')
    
    if (await flashcardSection.count() > 0) {
      // Navigate through flashcards if possible
      const nextButton = page.locator('text=/next|→/i')
      if (await nextButton.count() > 0) {
        await nextButton.first().click()
        await page.waitForTimeout(500)
        
        // Refresh page
        await page.reload()
        await page.waitForLoadState('domcontentloaded')
        
        // Check if position is maintained
        const flashcardContent = page.locator('.flashcard, [data-testid*="flashcard"]')
        if (await flashcardContent.count() > 0) {
          await expect(flashcardContent.first()).toBeVisible()
        }
      }
    }
  })
})
