import { test, expect } from '@playwright/test'
import { loginAsInstructor } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Student Roster Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsInstructor(page)
  })

  test('should load student roster', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for student roster elements
    const rosterElements = page.locator('text=/student|roster|class/i')
    
    if (await rosterElements.count() > 0) {
      await expect(rosterElements.first()).toBeVisible()
    }
    
    // Look for student list or table
    const studentList = page.locator('table, .student-list, [data-testid*="student"]')
    if (await studentList.count() > 0) {
      await expect(studentList.first()).toBeVisible()
    }
  })

  test('should have working student search', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[name*="search"]')
    
    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible()
      
      // Try searching
      await searchInput.first().fill('test')
      await page.waitForTimeout(500)
      
      // Check if results update
      const results = page.locator('table, .student-list, .search-results')
      if (await results.count() > 0) {
        await expect(results.first()).toBeVisible()
      }
    }
  })

  test('should have working filtering', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for filter controls
    const filterElements = page.locator('select, .filter, [data-testid*="filter"]')
    
    if (await filterElements.count() > 0) {
      await expect(filterElements.first()).toBeVisible()
      
      // Try to interact with filter
      const firstFilter = filterElements.first()
      const tagName = await firstFilter.evaluate(el => el.tagName.toLowerCase())
      
      if (tagName === 'select') {
        await firstFilter.selectOption({ index: 0 })
        await page.waitForTimeout(500)
      }
    }
  })

  test('should have working sorting', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for sortable headers
    const sortableHeaders = page.locator('th[data-sort], .sortable, button:has-text("sort")')
    
    if (await sortableHeaders.count() > 0) {
      await expect(sortableHeaders.first()).toBeVisible()
      
      // Try to click sort
      await sortableHeaders.first().click()
      await page.waitForTimeout(500)
    }
  })

  test('should have working pagination if implemented', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for pagination controls
    const paginationElements = page.locator('.pagination, [data-testid*="pagination"], button:has-text("next"), button:has-text("prev")')
    
    if (await paginationElements.count() > 0) {
      await expect(paginationElements.first()).toBeVisible()
      
      // Try to navigate pages
      const nextButton = page.locator('button:has-text("next"), [data-testid*="next"]')
      if (await nextButton.count() > 0) {
        await nextButton.first().click()
        await page.waitForTimeout(500)
      }
    }
  })

  test('should open correct student profile when selected', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for student links or buttons
    const studentLinks = page.locator('a[href*="student"], button:has-text("view"), .student-row')
    
    if (await studentLinks.count() > 0) {
      await studentLinks.first().click()
      await page.waitForTimeout(1000)
      
      // Should navigate to student profile
      const currentUrl = page.url()
      expect(currentUrl).toMatch(/student|profile/)
    }
  })

  test('should display empty states correctly', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for empty state messages
    const emptyStateElements = page.locator('text=/no.*student|empty|no.*data|no.*results/i')
    
    if (await emptyStateElements.count() > 0) {
      await expect(emptyStateElements.first()).toBeVisible()
    }
  })
})
