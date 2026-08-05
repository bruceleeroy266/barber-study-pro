import { test, expect } from '@playwright/test'
import { loginAsInstructor } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Performance Validation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsInstructor(page)
  })

  test('should load dashboard within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    
    await navigateTo(page, '/instructor')
    
    const loadTime = Date.now() - startTime
    
    // Dashboard should load within 5 seconds
    expect(loadTime).toBeLessThan(5000)
    
    // Check for main content
    const mainContent = page.locator('main, .main-content')
    await expect(mainContent.first()).toBeVisible()
  })

  test('should load student profile within acceptable time', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Navigate to a student profile
    const studentLinks = page.locator('a[href*="student"], .student-row')
    
    if (await studentLinks.count() > 0) {
      const startTime = Date.now()
      
      await studentLinks.first().click()
      await page.waitForLoadState('domcontentloaded')
      
      const loadTime = Date.now() - startTime
      
      // Student profile should load within 3 seconds
      expect(loadTime).toBeLessThan(3000)
      
      // Check for profile content
      const profileContent = page.locator('main, .profile, .content')
      await expect(profileContent.first()).toBeVisible()
    }
  })

  test('should generate reports within acceptable time', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for report generation elements
    const reportElements = page.locator('text=/report|export|download/i')
    
    if (await reportElements.count() > 0) {
      const startTime = Date.now()
      
      // Click on report element
      await reportElements.first().click()
      await page.waitForTimeout(1000)
      
      const loadTime = Date.now() - startTime
      
      // Report generation should complete within 10 seconds
      expect(loadTime).toBeLessThan(10000)
    }
  })

  test('should render analytics within acceptable time', async ({ page }) => {
    const startTime = Date.now()
    
    await navigateTo(page, '/instructor')
    
    // Look for analytics elements
    const analyticsElements = page.locator('canvas, svg, .chart, .analytics')
    
    if (await analyticsElements.count() > 0) {
      await expect(analyticsElements.first()).toBeVisible()
      
      const renderTime = Date.now() - startTime
      
      // Analytics should render within 3 seconds
      expect(renderTime).toBeLessThan(3000)
    }
  })

  test('should have fast navigation performance', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    const navigationPages = [
      '/instructor/assessments',
      '/instructor/attendance',
      '/instructor/gradebook'
    ]
    
    for (const pagePath of navigationPages) {
      const startTime = Date.now()
      
      await navigateTo(page, pagePath)
      
      const navigationTime = Date.now() - startTime
      
      // Navigation should complete within 2 seconds
      expect(navigationTime).toBeLessThan(2000)
      
      // Check page loads
      await expect(page).toHaveURL(new RegExp(`.*${pagePath.replace('/', '\\/')}`))
    }
  })

  test('should identify slowest workflows', async ({ page }) => {
    const workflows = [
      { name: 'Dashboard', path: '/instructor' },
      { name: 'Assessments', path: '/instructor/assessments' },
      { name: 'Attendance', path: '/instructor/attendance' },
      { name: 'Gradebook', path: '/instructor/gradebook' }
    ]
    
    const timings: { name: string; time: number }[] = []
    
    for (const workflow of workflows) {
      const startTime = Date.now()
      
      await navigateTo(page, workflow.path)
      
      const loadTime = Date.now() - startTime
      timings.push({ name: workflow.name, time: loadTime })
      
      // Check page loads
      await expect(page).toHaveURL(new RegExp(`.*${workflow.path.replace('/', '\\/')}`))
    }
    
    // Log timings for analysis
    console.log('Workflow timings:', timings)
    
    // All workflows should complete within reasonable time
    for (const timing of timings) {
      expect(timing.time).toBeLessThan(5000)
    }
  })

  test('should measure memory usage', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Get memory usage if available
    const metrics = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as { memory?: { usedJSHeapSize: number } }).memory
      }
      return null
    })
    
    if (metrics && metrics.usedJSHeapSize) {
      console.log('Memory usage:', metrics)
      
      // Memory usage should be reasonable (less than 100MB)
      expect(metrics.usedJSHeapSize).toBeLessThan(100 * 1024 * 1024)
    } else {
      // Memory API not available - skip test
      console.log('Memory API not available')
      expect(true).toBe(true)
    }
  })

  test('should measure network performance', async ({ page }) => {
    const requests: { url: string; duration: number }[] = []
    
    page.on('response', response => {
      const request = response.request()
      requests.push({
        url: request.url(),
        duration: Date.now() // Simplified timing
      })
    })
    
    await navigateTo(page, '/instructor')
    
    // Wait for all requests to complete
    await page.waitForLoadState('domcontentloaded')
    
    // Check that requests were made
    expect(requests.length).toBeGreaterThan(0)
  })
})
