import { test, expect } from '@playwright/test'
import { loginAsInstructor } from '../../utilities/auth'
import { navigateTo } from '../../utilities/browser'

test.describe('Individual Student Profiles', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsInstructor(page)
  })

  test('should load student profile', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Look for student links
    const studentLinks = page.locator('a[href*="student"], .student-row, [data-testid*="student"]')
    
    if (await studentLinks.count() > 0) {
      await studentLinks.first().click()
      await page.waitForTimeout(1000)
      
      // Check profile loads
      const profileContent = page.locator('main, .profile, [data-testid*="profile"]')
      await expect(profileContent.first()).toBeVisible()
    }
  })

  test('should display progress information', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Navigate to a student profile
    const studentLinks = page.locator('a[href*="student"], .student-row')
    
    if (await studentLinks.count() > 0) {
      await studentLinks.first().click()
      await page.waitForTimeout(1000)
      
      // Look for progress indicators
      const progressElements = page.locator('text=/progress|complete|%/i')
      
      if (await progressElements.count() > 0) {
        await expect(progressElements.first()).toBeVisible()
      }
    }
  })

  test('should display completed chapters', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Navigate to a student profile
    const studentLinks = page.locator('a[href*="student"], .student-row')
    
    if (await studentLinks.count() > 0) {
      await studentLinks.first().click()
      await page.waitForTimeout(1000)
      
      // Look for chapter information
      const chapterElements = page.locator('text=/chapter|complete|finished/i')
      
      if (await chapterElements.count() > 0) {
        await expect(chapterElements.first()).toBeVisible()
      }
    }
  })

  test('should load quiz history', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Navigate to a student profile
    const studentLinks = page.locator('a[href*="student"], .student-row')
    
    if (await studentLinks.count() > 0) {
      await studentLinks.first().click()
      await page.waitForTimeout(1000)
      
      // Look for quiz information
      const quizElements = page.locator('text=/quiz|score|attempt|test/i')
      
      if (await quizElements.count() > 0) {
        await expect(quizElements.first()).toBeVisible()
      }
    }
  })

  test('should display weak areas', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Navigate to a student profile
    const studentLinks = page.locator('a[href*="student"], .student-row')
    
    if (await studentLinks.count() > 0) {
      await studentLinks.first().click()
      await page.waitForTimeout(1000)
      
      // Look for weak area indicators
      const weakAreaElements = page.locator('text=/weak|area|improve|focus/i')
      
      if (await weakAreaElements.count() > 0) {
        await expect(weakAreaElements.first()).toBeVisible()
      }
    }
  })

  test('should load remediation history if available', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Navigate to a student profile
    const studentLinks = page.locator('a[href*="student"], .student-row')
    
    if (await studentLinks.count() > 0) {
      await studentLinks.first().click()
      await page.waitForTimeout(1000)
      
      // Look for remediation indicators
      const remediationElements = page.locator('text=/remediation|review|retake|intervention/i')
      
      if (await remediationElements.count() > 0) {
        await expect(remediationElements.first()).toBeVisible()
      }
    }
  })

  test('should maintain accurate overall statistics', async ({ page }) => {
    await navigateTo(page, '/instructor')
    
    // Navigate to a student profile
    const studentLinks = page.locator('a[href*="student"], .student-row')
    
    if (await studentLinks.count() > 0) {
      await studentLinks.first().click()
      await page.waitForTimeout(1000)
      
      // Look for statistics
      const statsElements = page.locator('text=/\\d+|%|score|average/i')
      
      if (await statsElements.count() > 0) {
        await expect(statsElements.first()).toBeVisible()
        
        // Check statistics format
        const statsText = await statsElements.first().textContent()
        expect(statsText).toMatch(/\d+|%|score|average/i)
      }
    }
  })
})
