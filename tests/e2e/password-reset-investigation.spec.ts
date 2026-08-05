import { test, expect } from '@playwright/test'

test('Password reset investigation - capture exact error', async ({ page }) => {
  const consoleLogs: string[] = []
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`)
  })

  const networkLogs: { method: string; url: string; status?: number; body?: string }[] = []
  page.on('request', request => {
    networkLogs.push({ method: request.method(), url: request.url() })
  })
  page.on('response', async response => {
    const entry = networkLogs.find(l => l.url === response.url() && !l.status)
    if (entry) {
      entry.status = response.status()
      try {
        if (response.url().includes('supabase') || response.url().includes('recover')) {
          entry.body = await response.text()
        }
      } catch {}
    }
  })

  const pageErrors: string[] = []
  page.on('pageerror', error => {
    pageErrors.push(error.message)
  })

  // Go to reset password page
  await page.goto('http://localhost:3001/reset-password')
  await page.waitForLoadState('domcontentloaded')

  // Fill in Patty's email
  await page.fill('input[type="email"]', 'patty.pineda.drl@gmail.com')
  
  // Click send reset link
  await page.click('button[type="submit"]')
  
  // Wait for response
  await page.waitForTimeout(5000)
  
  // Check current URL
  const currentUrl = page.url()
  console.log('\nCurrent URL:', currentUrl)
  
  // Check for error messages
  const errorSelectors = [
    '.bg-red-500\\/10',
    '[class*="error"]',
    '[role="alert"]',
    '.text-red-400',
  ]
  
  let errorText = 'No error element found'
  for (const selector of errorSelectors) {
    const element = page.locator(selector)
    if (await element.count() > 0) {
      const text = await element.first().textContent()
      if (text && text.trim().length > 0) {
        errorText = text.trim()
        break
      }
    }
  }
  
  // Check for success state
  const successElement = page.locator('text=/check your email/i')
  const isSuccess = await successElement.count() > 0
  
  console.log('\n=== RESULTS ===')
  console.log('Success state:', isSuccess)
  console.log('Error displayed:', errorText)
  console.log('\nConsole logs:')
  consoleLogs.forEach(log => console.log(' ', log))
  console.log('\nPage errors:')
  pageErrors.forEach(err => console.log(' ', err))
  console.log('\nNetwork requests to Supabase:')
  networkLogs
    .filter(l => l.url.includes('supabase'))
    .forEach(l => {
      console.log(`  ${l.method} ${l.url}`)
      if (l.status) console.log(`    Status: ${l.status}`)
      if (l.body) console.log(`    Body: ${l.body.substring(0, 500)}`)
    })
})
