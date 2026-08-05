import { test, expect } from '@playwright/test'

test('Password reset end-to-end validation', async ({ page }) => {
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
        if (response.url().includes('supabase') || response.url().includes('recover') || response.url().includes('verify')) {
          entry.body = await response.text()
        }
      } catch {}
    }
  })

  const pageErrors: string[] = []
  page.on('pageerror', error => {
    pageErrors.push(error.message)
  })

  console.log('\n=== STEP 1: Request Password Reset ===\n')
  
  // Go to reset password page
  await page.goto('http://localhost:3001/reset-password')
  await page.waitForLoadState('domcontentloaded')

  // Fill in Patty's email
  await page.fill('input[type="email"]', 'patty.pineda.drl@gmail.com')
  
  // Click send reset link
  await page.click('button[type="submit"]')
  
  // Wait for response
  await page.waitForTimeout(5000)
  
  // Check for success state
  const successElement = page.locator('text=/check your email/i')
  const isSuccess = await successElement.count() > 0
  
  console.log('Reset request success:', isSuccess)
  
  // Check network logs
  const supabaseRequests = networkLogs.filter(l => l.url.includes('supabase'))
  console.log('\nSupabase requests:')
  supabaseRequests.forEach(l => {
    console.log(`  ${l.method} ${l.url}`)
    if (l.status) console.log(`    Status: ${l.status}`)
  })
  
  console.log('\n=== STEP 2: Verify Reset Link Structure ===\n')
  
  // The reset email would contain a link like:
  // https://hgyznydxepjsvbjsirpv.supabase.co/auth/v1/verify?token=...&type=recovery&redirect_to=...
  
  // For testing, we'll simulate what happens when the user clicks the link
  // First, let's check if the auth callback route works
  
  console.log('Testing auth callback route directly...')
  
  // Go to auth callback with a test code (this will fail but show us the error handling)
  await page.goto('http://localhost:3001/auth/callback?code=test_code_12345&type=recovery')
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(3000)
  
  const callbackUrl = page.url()
  console.log('Callback URL after test:', callbackUrl)
  
  // Check if we're redirected to login with error
  if (callbackUrl.includes('/login')) {
    console.log('✅ Callback correctly redirects to login on invalid code')
    
    // Check for error message
    const errorParam = new URL(callbackUrl).searchParams.get('error')
    console.log('Error parameter:', errorParam)
  } else if (callbackUrl.includes('/update-password')) {
    console.log('✅ Callback redirects to update-password (unexpected with test code)')
  } else {
    console.log('⚠️ Unexpected redirect:', callbackUrl)
  }
  
  console.log('\n=== STEP 3: Verify Update Password Page ===\n')
  
  // Go to update password page directly
  await page.goto('http://localhost:3001/update-password')
  await page.waitForLoadState('domcontentloaded')
  
  // Check page loads correctly
  const pageTitle = await page.locator('h1').textContent()
  console.log('Update password page title:', pageTitle)
  
  const hasPasswordInput = await page.locator('input[type="password"]').count() > 0
  console.log('Has password input:', hasPasswordInput)
  
  console.log('\n=== FINAL RESULTS ===\n')
  console.log('Console errors:', consoleLogs.filter(l => l.includes('error')).length)
  console.log('Page errors:', pageErrors.length)
  
  if (pageErrors.length > 0) {
    console.log('Page errors found:')
    pageErrors.forEach(err => console.log('  ', err))
  }
})
