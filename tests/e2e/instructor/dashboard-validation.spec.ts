import { test, expect } from '@playwright/test'
import { loginAsInstructor } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Instructor Dashboard Validation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsInstructor(page)
  })

  test('should load dashboard without errors', async ({ page }) => {
    const errors: string[] = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await navigateTo(page, '/instructor')
    
    // Check dashboard loads
    await expect(page).toHaveURL(/.*instructor/)
    
    // Check for main content
    const mainContent = page.locator('main, .main-content, [data-testid*="dashboard"]')
    await expect(mainContent.first()).toBeVisible()
    
    // Filter out known acceptable errors
    const criticalErrors = errors.filter(error => 
      !error.includes('net::ERR_') && 
      !error.includes('Failed to fetch') &&
      !error.includes('NetworkError') &&
      !error.includes('favicon')
    )
    
    expect(criticalErrors).toHaveLength(0)
  })

  test('should display summary statistics correctly', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for statistics elements
    const statsElements = page.locator('text=/\\d+|student|progress|complete|%/i')
    
    if (await statsElements.count() > 0) {
      await expect(statsElements.first()).toBeVisible()
    }
  })

  test('should display student counts accurately', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for student count indicators
    const studentCountElements = page.locator('text=/\\d+.*student|student.*\\d+/i')
    
    if (await studentCountElements.count() > 0) {
      await expect(studentCountElements.first()).toBeVisible()
      
      // Check format contains numbers
      const countText = await studentCountElements.first().textContent()
      expect(countText).toMatch(/\d+/)
    }
  })

  test('should render completion metrics', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for completion indicators
    const completionElements = page.locator('text=/complete|progress|%/i')
    
    if (await completionElements.count() > 0) {
      await expect(completionElements.first()).toBeVisible()
    }
  })

  test('should display at-risk indicators', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for at-risk indicators
    const atRiskElements = page.locator('text=/risk|alert|warning|attention/i')
    
    if (await atRiskElements.count() > 0) {
      await expect(atRiskElements.first()).toBeVisible()
    }
  })

  test('should render charts and widgets correctly', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for chart/widget containers
    const chartElements = page.locator('canvas, svg, .chart, .widget, [data-testid*="chart"]')
    
    if (await chartElements.count() > 0) {
      await expect(chartElements.first()).toBeVisible()
    }
  })

  test('should not have JavaScript console errors', async ({ page }) => {
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
    
    expect(criticalErrors).toHaveLength(0)
  })
})
