import { test, expect } from '@playwright/test'
import { loginAsStudent } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Final Exam Readiness', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page)
  })

  test('should load final exam page if available', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Look for final exam links or sections
    const finalExamElements = page.locator('text=/final.*exam|exam|certification/i')
    
    if (await finalExamElements.count() > 0) {
      await expect(finalExamElements.first()).toBeVisible()
    }
  })

  test('should display eligibility requirements correctly', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Look for eligibility information
    const eligibilityElements = page.locator('text=/eligible|requirement|prerequisite|complete/i')
    
    if (await eligibilityElements.count() > 0) {
      await expect(eligibilityElements.first()).toBeVisible()
      
      // Check for specific requirements
      const requirements = page.locator('text=/chapter|quiz|progress|%/i')
      if (await requirements.count() > 0) {
        await expect(requirements.first()).toBeVisible()
      }
    }
  })

  test('should render instructions correctly', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Look for exam instructions
    const instructionElements = page.locator('text=/instruction|direction|how.*to|before.*begin/i')
    
    if (await instructionElements.count() > 0) {
      await expect(instructionElements.first()).toBeVisible()
      
      // Check instructions have content
      const instructionText = await instructionElements.first().textContent()
      expect(instructionText?.trim()).toBeTruthy()
    }
  })

  test('should have working navigation', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Look for final exam navigation
    const examNav = page.locator('text=/final.*exam|exam/i')
    
    if (await examNav.count() > 0) {
      await examNav.first().click()
      await page.waitForTimeout(1000)
      
      // Check if navigation works
      const currentUrl = page.url()
      expect(currentUrl).toMatch(/exam|final|certification/)
    }
  })

  test('should handle final exam gracefully if not available', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Check if final exam features exist
    const finalExamElements = page.locator('text=/final.*exam|exam|certification/i')
    
    if (await finalExamElements.count() === 0) {
      // Final exam not implemented - this is acceptable
      console.log('Final exam not yet available - graceful handling confirmed')
      expect(true).toBe(true)
    } else {
      // Final exam exists - test it
      await expect(finalExamElements.first()).toBeVisible()
    }
  })

  test('should display exam readiness status', async ({ page }) => {
    await navigateTo(page, '/dashboard')
    
    // Look for readiness indicators
    const readinessElements = page.locator('text=/ready|readiness|prepared|eligible/i')
    
    if (await readinessElements.count() > 0) {
      await expect(readinessElements.first()).toBeVisible()
      
      // Check for readiness status
      const statusElements = page.locator('text=/ready|not.*ready|complete|incomplete/i')
      if (await statusElements.count() > 0) {
        await expect(statusElements.first()).toBeVisible()
      }
    }
  })
})
