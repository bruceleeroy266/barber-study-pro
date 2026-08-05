/**
 * TEMPORARY EVIDENCE COLLECTION SCRIPT - DO NOT COMMIT
 * 
 * Captures complete HTTP request headers for GET /instructor after login
 * to verify whether authentication cookies are being sent.
 */

import { test } from '@playwright/test'

const TEST_CONFIG = {
  instructorEmail: process.env.TEST_INSTRUCTOR_EMAIL || 'instructor@ascyn-smoke.test',
  instructorPassword: process.env.TEST_INSTRUCTOR_PASSWORD || 'SmokeTest123!',
  baseUrl: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001',
}

test('capture request headers for /instructor', async ({ page, context }) => {
  const requestLog: Array<{
    url: string
    method: string
    headers: Record<string, string>
    timestamp: string
  }> = []

  // Intercept all requests and capture headers
  await page.route('**/*', async (route) => {
    const request = route.request()
    const headers = request.headers()
    
    // Log the request details
    requestLog.push({
      url: request.url(),
      method: request.method(),
      headers: headers,
      timestamp: new Date().toISOString(),
    })
    
    // Continue the request
    await route.continue()
  })

  console.log('\n========================================')
  console.log('REQUEST HEADER CAPTURE')
  console.log('========================================\n')

  // Step 1: Navigate to login page
  console.log('Step 1: Navigate to /login')
  await page.goto(`${TEST_CONFIG.baseUrl}/login`)
  await page.waitForLoadState('networkidle')
  
  // Clear the log to focus on post-login requests
  requestLog.length = 0

  // Step 2: Fill credentials and submit
  console.log('Step 2: Submit login form')
  await page.fill('input[type="email"]', TEST_CONFIG.instructorEmail)
  await page.fill('input[type="password"]', TEST_CONFIG.instructorPassword)
  
  // Click Sign In and wait for navigation
  await Promise.all([
    page.waitForLoadState('networkidle'),
    page.click('button[type="submit"]'),
  ])

  // Wait for any client-side redirects
  await page.waitForTimeout(3000)

  // Step 3: Report all captured requests
  console.log('\n========================================')
  console.log('CAPTURED REQUESTS AFTER LOGIN')
  console.log('========================================\n')

  const relevantRequests = requestLog.filter(r => 
    r.url.includes('/instructor') || 
    r.url.includes('/login') ||
    r.url.includes('/dashboard') ||
    r.url.includes('/pending-approval') ||
    r.url.includes('supabase')
  )

  relevantRequests.forEach((req, index) => {
    console.log(`${index + 1}. ${req.method} ${req.url}`)
    console.log(`   Timestamp: ${req.timestamp}`)
    console.log('   Headers:')
    Object.entries(req.headers).forEach(([key, value]) => {
      // Redact sensitive values but show presence
      if (key.toLowerCase() === 'cookie') {
        const cookieNames = value.split(';').map(c => c.trim().split('=')[0])
        console.log(`     ${key}: [${cookieNames.length} cookies] ${cookieNames.join(', ')}`)
        // Show full cookie header for analysis
        console.log(`     FULL_COOKIE: ${value}`)
      } else if (key.toLowerCase() === 'authorization') {
        console.log(`     ${key}: [PRESENT]`)
      } else {
        console.log(`     ${key}: ${value}`)
      }
    })
    console.log('')
  })

  // Step 4: Check cookies in the browser context
  console.log('========================================')
  console.log('BROWSER CONTEXT COOKIES')
  console.log('========================================\n')
  
  const cookies = await context.cookies()
  console.log(`Total cookies in context: ${cookies.length}`)
  cookies.forEach(cookie => {
    console.log(`  ${cookie.name}: ${cookie.value.substring(0, 20)}... (domain: ${cookie.domain}, path: ${cookie.path})`)
  })

  // Step 5: Check sessionStorage
  console.log('\n========================================')
  console.log('SESSION STORAGE')
  console.log('========================================\n')
  
  const sessionStorage = await page.evaluate(() => {
    const items: Record<string, string> = {}
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i)
      if (key) {
        items[key] = window.sessionStorage.getItem(key) || ''
      }
    }
    return items
  })
  
  console.log(`Total sessionStorage items: ${Object.keys(sessionStorage).length}`)
  Object.entries(sessionStorage).forEach(([key, value]) => {
    console.log(`  ${key}: ${value.substring(0, 50)}...`)
  })

  // Step 6: Final URL
  console.log('\n========================================')
  console.log('FINAL STATE')
  console.log('========================================\n')
  console.log(`Final URL: ${page.url()}`)

  console.log('\n========================================')
  console.log('EVIDENCE COLLECTION COMPLETE')
  console.log('========================================\n')
})
