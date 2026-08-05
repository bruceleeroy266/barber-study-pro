/**
 * FINAL VERIFICATION SCRIPT
 * 
 * Purpose: Capture the exact navigation sequence after instructor sign-in
 * and verify production data before any code changes.
 * 
 * Usage:
 *   npx playwright test tests/e2e/verification/navigation-trace.spec.ts --project=chromium
 * 
 * Requirements:
 *   - Dev server running on localhost:3001
 *   - Valid instructor credentials in environment or test config
 */

import { test, expect } from '@playwright/test'

// Test configuration - UPDATE THESE WITH ACTUAL TEST CREDENTIALS
const TEST_CONFIG = {
  instructorEmail: process.env.TEST_INSTRUCTOR_EMAIL || 'instructor@test.com',
  instructorPassword: process.env.TEST_INSTRUCTOR_PASSWORD || 'testpassword',
  baseUrl: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001',
}

interface NavigationRecord {
  url: string
  method: string
  status: number | null
  resourceType: string
  timestamp: string
}

test.describe('Final Verification - Navigation Trace', () => {
  test('capture exact navigation sequence after instructor sign-in', async ({ page }) => {
    const navigations: NavigationRecord[] = []
    
    // Capture all network requests
    page.on('request', (request) => {
      navigations.push({
        url: request.url(),
        method: request.method(),
        status: null,
        resourceType: request.resourceType(),
        timestamp: new Date().toISOString(),
      })
    })

    page.on('response', (response) => {
      const nav = navigations.find(n => n.url === response.url() && n.status === null)
      if (nav) {
        nav.status = response.status()
      }
    })

    console.log('\n========================================')
    console.log('NAVIGATION TRACE VERIFICATION')
    console.log('========================================\n')
    console.log(`Base URL: ${TEST_CONFIG.baseUrl}`)
    console.log(`Test Email: ${TEST_CONFIG.instructorEmail}`)
    console.log('')

    // Step 1: Navigate to login page
    console.log('STEP 1: Navigate to /login')
    await page.goto(`${TEST_CONFIG.baseUrl}/login`)
    await page.waitForLoadState('networkidle')
    
    // Clear navigations to start fresh from sign-in click
    navigations.length = 0

    // Step 2: Fill in credentials and click Sign In
    console.log('STEP 2: Fill credentials and click Sign In')
    await page.fill('input[type="email"]', TEST_CONFIG.instructorEmail)
    await page.fill('input[type="password"]', TEST_CONFIG.instructorPassword)
    
    // Click Sign In and wait for navigation to complete
    await Promise.all([
      page.waitForLoadState('networkidle'),
      page.click('button[type="submit"]'),
    ])

    // Wait a bit more for any client-side redirects
    await page.waitForTimeout(2000)

    // Step 3: Report the navigation sequence
    console.log('\n========================================')
    console.log('CAPTURED NAVIGATION SEQUENCE')
    console.log('========================================\n')

    const relevantNavs = navigations.filter(n => 
      n.url.includes('/auth/') || 
      n.url.includes('/login') ||
      n.url.includes('/dashboard') ||
      n.url.includes('/instructor') ||
      n.url.includes('/pending-approval') ||
      n.url.includes('/admin') ||
      n.url.includes('/school') ||
      n.url.includes('supabase')
    )

    relevantNavs.forEach((nav, index) => {
      const status = nav.status !== null ? nav.status : 'pending'
      console.log(`${index + 1}. ${nav.method} ${nav.url}`)
      console.log(`   Status: ${status} | Type: ${nav.resourceType}`)
      console.log('')
    })

    // Step 4: Report final URL
    const finalUrl = page.url()
    console.log('========================================')
    console.log('FINAL DESTINATION')
    console.log('========================================\n')
    console.log(`Final URL: ${finalUrl}`)
    console.log('')

    // Step 5: Determine which flow occurred
    console.log('========================================')
    console.log('FLOW ANALYSIS')
    console.log('========================================\n')

    const urlSequence = relevantNavs.map(n => new URL(n.url).pathname)
    
    if (finalUrl.includes('/pending-approval')) {
      console.log('RESULT: Redirected to /pending-approval')
      console.log('This indicates:')
      console.log('  - User is an instructor')
      console.log('  - school_id is NULL OR schools.is_active = false')
    } else if (finalUrl.includes('/instructor')) {
      console.log('RESULT: Redirected to /instructor')
      console.log('This indicates:')
      console.log('  - User is an instructor')
      console.log('  - school_id is set AND schools.is_active = true')
    } else if (finalUrl.includes('/dashboard')) {
      console.log('RESULT: Redirected to /dashboard')
      console.log('This indicates:')
      console.log('  - User is NOT an instructor (student/apprentice)')
      console.log('  - OR instructor has no school_id')
    } else if (finalUrl.includes('/login')) {
      console.log('RESULT: Stayed on /login')
      console.log('This indicates:')
      console.log('  - Authentication failed')
      console.log('  - OR account is disabled/not approved')
    } else {
      console.log(`RESULT: Unexpected destination: ${finalUrl}`)
    }

    console.log('\nURL Sequence:')
    urlSequence.forEach((url, i) => {
      console.log(`  ${i + 1}. ${url}`)
    })

    // Take a screenshot for evidence
    await page.screenshot({ 
      path: `test-results/navigation-trace-${Date.now()}.png`,
      fullPage: true 
    })

    console.log('\n========================================')
    console.log('VERIFICATION COMPLETE')
    console.log('========================================\n')
  })
})
