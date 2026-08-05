// P1 Investigation: Reproduce "Invalid path specified in request URL" on production
import { chromium } from 'playwright'

const BASE_URL = 'https://ascynpro.com'

async function testLogin(email, password, label) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Testing: ${label} (${email})`)
  console.log(`${'='.repeat(60)}`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  // Capture console messages
  const consoleLogs = []
  page.on('console', (msg) => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`)
  })

  // Capture network requests
  const networkRequests = []
  const failedRequests = []
  
  page.on('response', async (response) => {
    const entry = {
      url: response.url(),
      status: response.status(),
      method: response.request().method(),
      resourceType: response.request().resourceType(),
    }
    networkRequests.push(entry)
    
    if (response.status() >= 400) {
      let body = ''
      try {
        body = await response.text()
      } catch {}
      failedRequests.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        body: body.substring(0, 500),
      })
    }
  })

  try {
    // Step 1: Navigate to login page
    console.log('\n--- Step 1: Navigate to /login ---')
    const loginResponse = await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 })
    console.log(`Login page status: ${loginResponse?.status()}`)
    console.log(`Login page URL: ${page.url()}`)

    // Step 2: Fill in credentials
    console.log('\n--- Step 2: Fill credentials ---')
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)

    // Step 3: Submit and wait for navigation or error
    console.log('\n--- Step 3: Submit login ---')
    
    // Wait for either navigation or error message
    const [response] = await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => null),
      page.click('button[type="submit"]'),
    ])

    // Wait a moment for any async errors to appear
    await page.waitForTimeout(3000)

    const currentUrl = page.url()
    console.log(`\nCurrent URL after login: ${currentUrl}`)

    // Check for error messages on the page
    const pageContent = await page.content()
    if (pageContent.includes('Invalid path')) {
      console.log('❌ FOUND: "Invalid path specified in request URL" error on page')
    }
    if (pageContent.includes('Invalid email or password')) {
      console.log('❌ FOUND: "Invalid email or password" error on page')
    }

    // Check for visible error divs
    const errorDivs = await page.$$eval('[class*="red"], [class*="error"]', els => els.map(e => e.textContent))
    if (errorDivs.length > 0) {
      console.log('Error elements found:', errorDivs)
    }

    // Report console logs
    console.log('\n--- Console Logs ---')
    consoleLogs.forEach(log => console.log(log))

    // Report failed requests
    if (failedRequests.length > 0) {
      console.log('\n--- Failed Network Requests ---')
      failedRequests.forEach(req => {
        console.log(`  ${req.status} ${req.statusText}: ${req.url}`)
        if (req.body) console.log(`    Body: ${req.body}`)
      })
    }

    // Report all network requests to Supabase
    console.log('\n--- Supabase Requests ---')
    networkRequests
      .filter(r => r.url.includes('supabase'))
      .forEach(r => console.log(`  ${r.method} ${r.status} ${r.url}`))

    // Report redirect chain
    console.log('\n--- All Document Requests (redirects visible) ---')
    networkRequests
      .filter(r => r.resourceType === 'document')
      .forEach(r => console.log(`  ${r.method} ${r.status} ${r.url}`))

    // Summary
    console.log(`\n--- Result ---`)
    if (currentUrl.includes('/login')) {
      console.log(`❌ ${label}: Still on login page — login FAILED`)
    } else if (currentUrl.includes('/update-password')) {
      console.log(`✅ ${label}: Redirected to update-password (password change required)`)
    } else if (currentUrl.includes('/dashboard') || currentUrl.includes('/instructor') || currentUrl.includes('/admin')) {
      console.log(`✅ ${label}: Redirected to ${currentUrl}`)
    } else {
      console.log(`⚠️ ${label}: Unexpected URL: ${currentUrl}`)
    }

  } catch (err) {
    console.error(`\n❌ Error during test: ${err}`)
    
    console.log('\n--- Console Logs (at error) ---')
    consoleLogs.forEach(log => console.log(log))
    console.log('\n--- Failed Requests (at error) ---')
    failedRequests.forEach(req => {
      console.log(`  ${req.status} ${req.statusText}: ${req.url}`)
      if (req.body) console.log(`    Body: ${req.body}`)
    })
  } finally {
    await browser.close()
  }
}

async function main() {
  // Test with QA admin account first
  await testLogin('admin@ascyn-smoke.test', 'AscynSmoke2026!', 'QA Admin')
  
  // Test with QA student account
  await testLogin('student@ascyn-smoke.test', 'AscynSmoke2026!', 'QA Student')
  
  // Test with Tessa Myers (pilot instructor)
  await testLogin('tessamyers2911@gmail.com', 'RisePilot2026!', 'Tessa Myers (Instructor)')
}

main().catch(console.error)
