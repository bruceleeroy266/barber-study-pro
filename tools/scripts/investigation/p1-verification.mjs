// P1 Verification: Test all accounts after redirect loop fix
import { chromium } from 'playwright'

const BASE_URL = 'https://ascynpro.com'

async function testLogin(email, password, label, expectedDestination) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Testing: ${label} (${email})`)
  console.log(`Expected: ${expectedDestination}`)
  console.log(`${'='.repeat(60)}`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  const consoleLogs = []
  page.on('console', (msg) => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`)
  })

  const documentRequests = []
  page.on('response', (response) => {
    if (response.request().resourceType() === 'document') {
      documentRequests.push({
        url: response.url(),
        status: response.status(),
      })
    }
  })

  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 })
    
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 20000 }).catch(() => null),
      page.click('button[type="submit"]'),
    ])

    await page.waitForTimeout(3000)
    const currentUrl = page.url()
    
    // Check for errors
    const pageContent = await page.content()
    const hasInvalidPath = pageContent.includes('Invalid path')
    const hasInvalidCreds = pageContent.includes('Invalid email or password')
    const hasError = hasInvalidPath || hasInvalidCreds

    // Check for redirect loop
    const redirectCount = documentRequests.filter(r => r.status === 307).length
    const isRedirectLoop = redirectCount > 5

    console.log(`Final URL: ${currentUrl}`)
    console.log(`Redirect count (307s): ${redirectCount}`)
    
    if (hasInvalidPath) console.log('❌ "Invalid path specified in request URL" found')
    if (hasInvalidCreds) console.log('❌ "Invalid email or password" found')
    if (isRedirectLoop) console.log(`❌ REDIRECT LOOP detected (${redirectCount} redirects)`)

    // Show redirect chain
    if (documentRequests.length > 1) {
      console.log('\nRedirect chain:')
      documentRequests.forEach(r => console.log(`  ${r.status} ${r.url}`))
    }

    // Determine result
    let result
    if (isRedirectLoop) {
      result = '❌ FAIL — Redirect loop'
    } else if (hasInvalidPath) {
      result = '❌ FAIL — Invalid path error'
    } else if (hasInvalidCreds) {
      result = '❌ FAIL — Invalid credentials'
    } else if (currentUrl.includes('/update-password')) {
      result = '✅ PASS — Reached update-password (password change flow working)'
    } else if (currentUrl.includes(expectedDestination)) {
      result = `✅ PASS — Reached ${expectedDestination}`
    } else if (currentUrl.includes('/login')) {
      result = '❌ FAIL — Still on login page'
    } else {
      result = `⚠️ UNEXPECTED — ${currentUrl}`
    }

    console.log(`\nResult: ${result}`)
    return { label, email, result, url: currentUrl, redirectCount }

  } catch (err) {
    console.error(`Error: ${err.message || err}`)
    return { label, email, result: `❌ ERROR: ${err.message || err}`, url: page.url(), redirectCount: 0 }
  } finally {
    await browser.close()
  }
}

async function testLogout(email, password, label) {
  console.log(`\n--- Testing logout for ${label} ---`)
  const browser = await chromium.launch({ headless: true })
  const page = await (await browser.newContext()).newPage()

  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 })
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 20000 }).catch(() => null),
      page.click('button[type="submit"]'),
    ])
    await page.waitForTimeout(2000)

    // If on update-password, that's fine — the user needs to change password first
    if (page.url().includes('/update-password')) {
      console.log('  (On update-password page — logout test skipped, password change needed first)')
      return true
    }

    // Look for logout button/link
    const logoutButton = await page.$('text=Logout, text=Sign Out, text=Log Out, [data-testid="logout"]')
    if (logoutButton) {
      await logoutButton.click()
      await page.waitForTimeout(2000)
      const url = page.url()
      if (url.includes('/login') || url === BASE_URL + '/') {
        console.log('  ✅ Logout successful')
        return true
      }
    }
    console.log('  ⚠️ Could not find logout button')
    return false
  } catch (err) {
    console.log(`  ⚠️ Logout test error: ${err.message}`)
    return false
  } finally {
    await browser.close()
  }
}

async function main() {
  console.log('P1 VERIFICATION — Post-Fix Authentication Tests')
  console.log(`Time: ${new Date().toISOString()}`)
  console.log(`Target: ${BASE_URL}`)

  const results = []

  // Test pilot users (these have requires_password_change=true)
  results.push(await testLogin(
    'tessamyers2911@gmail.com',
    'RisePilot2026!',
    'Tessa Myers (Instructor)',
    '/update-password'
  ))

  results.push(await testLogin(
    'patty.pineda.drl@gmail.com',
    'RisePilot2026!',
    'Patty Pineda (Student)',
    '/update-password'
  ))

  results.push(await testLogin(
    'MalennySaenz@gmail.com',
    'RisePilot2026!',
    'Malenny Saenz (Student)',
    '/update-password'
  ))

  // Summary
  console.log(`\n${'='.repeat(60)}`)
  console.log('SUMMARY')
  console.log(`${'='.repeat(60)}`)
  results.forEach(r => {
    console.log(`${r.result.split('—')[0].trim()} ${r.label}: ${r.url} (${r.redirectCount} redirects)`)
  })

  const passCount = results.filter(r => r.result.includes('✅')).length
  const failCount = results.filter(r => r.result.includes('❌')).length
  console.log(`\nTotal: ${results.length} | Pass: ${passCount} | Fail: ${failCount}`)
}

main().catch(console.error)
