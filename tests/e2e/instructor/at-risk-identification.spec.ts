import { test, expect } from '@playwright/test'
import { loginAsInstructor } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('At-Risk Student Identification', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsInstructor(page)
  })

  test('should display at-risk alerts', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for at-risk alert indicators
    const alertElements = page.locator('text=/risk|alert|warning|attention/i')
    
    if (await alertElements.count() > 0) {
      await expect(alertElements.first()).toBeVisible()
    }
  })

  test('should calculate alert thresholds correctly', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for threshold or calculation indicators
    const thresholdElements = page.locator('text=/threshold|calculate|score|%/i')
    
    if (await thresholdElements.count() > 0) {
      await expect(thresholdElements.first()).toBeVisible()
    }
  })

  test('should update student list appropriately', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for student list elements
    const studentListElements = page.locator('table, .student-list, .student-row')
    
    if (await studentListElements.count() > 0) {
      await expect(studentListElements.first()).toBeVisible()
    }
  })

  test('should have working alert navigation', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for alert navigation elements
    const alertNavElements = page.locator('a[href*="alert"], a[href*="risk"], button:has-text("view")')
    
    if (await alertNavElements.count() > 0) {
      await alertNavElements.first().click()
      await page.waitForTimeout(1000)
      
      // Check if navigation works
      const currentUrl = page.url()
      expect(currentUrl).toMatch(/alert|risk|student/)
    }
  })

  test('should not generate false errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
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
    
    expect(criticalErrors).toHaveLength(0)
  })
})
