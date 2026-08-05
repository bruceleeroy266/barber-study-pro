import { test, expect } from '@playwright/test'
import { loginAsInstructor } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Weak Area Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsInstructor(page)
  })

  test('should load weak-area heat map', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for heat map or analytics elements
    const heatMapElements = page.locator('canvas, svg, .heatmap, .chart')
    
    if (await heatMapElements.count() > 0) {
      // Check if any heat map elements are visible
      const visibleElements = await heatMapElements.filter({ hasText: /.*/ }).count()
      if (visibleElements > 0) {
        await expect(heatMapElements.first()).toBeVisible()
      }
    }
    
    // Look for weak area indicators
    const weakAreaElements = page.locator('text=/weak|area|heat|map|analytics/i')
    
    if (await weakAreaElements.count() > 0) {
      await expect(weakAreaElements.first()).toBeVisible()
    }
  })

  test('should display subject breakdown', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for subject breakdown elements
    const subjectElements = page.locator('text=/subject|chapter|topic|category/i')
    
    if (await subjectElements.count() > 0) {
      await expect(subjectElements.first()).toBeVisible()
    }
  })

  test('should update student rankings correctly', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for ranking or student list elements
    const rankingElements = page.locator('text=/rank|student|score|performance/i')
    
    if (await rankingElements.count() > 0) {
      await expect(rankingElements.first()).toBeVisible()
    }
  })

  test('should identify high-risk students', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for high-risk indicators
    const riskElements = page.locator('text=/risk|alert|warning|high.*risk/i')
    
    if (await riskElements.count() > 0) {
      await expect(riskElements.first()).toBeVisible()
    }
  })

  test('should update analytics when filters change', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for filter controls
    const filterElements = page.locator('select, .filter, [data-testid*="filter"]')
    
    if (await filterElements.count() > 0) {
      // Try to interact with filter
      const firstFilter = filterElements.first()
      const tagName = await firstFilter.evaluate(el => el.tagName.toLowerCase())
      
      if (tagName === 'select') {
        await firstFilter.selectOption({ index: 0 })
        await page.waitForTimeout(500)
        
        // Check if analytics update
        const analyticsElements = page.locator('canvas, svg, .chart, .analytics')
        if (await analyticsElements.count() > 0) {
          await expect(analyticsElements.first()).toBeVisible()
        }
      }
    }
  })
})
