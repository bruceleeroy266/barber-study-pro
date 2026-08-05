// P1 Final Verification — Complete Authentication Flow Test
import { chromium } from 'playwright'

const BASE_URL = 'https://ascynpro.com'

async function testFullFlow(email, tempPassword, newPassword, label, expectedDashboard) {
  console.log(`\n${'='.repeat(70)}`)
  console.log(`FULL FLOW TEST: ${label}`)
  console.log(`Email: ${email}`)
  console.log(`Expected dashboard: ${expectedDashboard}`)
  console.log(`${'='.repeat(70)}`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  const results = {
    label,
    email,
    login: false,
    reachUpdatePassword: false,
    passwordChange: false,
    reachDashboard: false,
    logout: false,
    loginWithNewPassword: false,
    errors: []
  }

  try {
    // Step 1: Login with temp password
    console.log('\n--- Step 1: Login with temporary password ---')
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 })
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', tempPassword)
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 20000 }).catch(() => null),
      page.click('button[type="submit"]'),
    ])
    await page.waitForTimeout(2000)

    const afterLoginUrl = page.url()
    console.log(`After login URL: ${afterLoginUrl}`)
    
    if (afterLoginUrl.includes('/update-password')) {
      results.login = true
      results.reachUpdatePassword = true
      console.log('✅ Login successful, reached /update-password')
    } else {
      results.errors.push(`Unexpected URL after login: ${afterLoginUrl}`)
      console.log(`❌ Unexpected URL: ${afterLoginUrl}`)
      return results
    }

    // Step 2: Change password
    console.log('\n--- Step 2: Change password ---')
    await page.fill('input[id="password"]', newPassword)
    await page.fill('input[id="confirmPassword"]', newPassword)
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 20000 }).catch(() => null),
      page.click('button[type="submit"]'),
    ])
    await page.waitForTimeout(3000)

    const afterPasswordChangeUrl = page.url()
    console.log(`After password change URL: ${afterPasswordChangeUrl}`)
    
    // Should redirect to login or dashboard
    if (afterPasswordChangeUrl.includes('/login') || afterPasswordChangeUrl.includes(expectedDashboard)) {
      results.passwordChange = true
      console.log('✅ Password change successful')
    } else {
      console.log(`⚠️ Unexpected URL after password change: ${afterPasswordChangeUrl}`)
    }

    // Step 3: If redirected to login, login with new password
    if (afterPasswordChangeUrl.includes('/login')) {
      console.log('\n--- Step 3: Login with NEW password ---')
      await page.fill('input[type="email"]', email)
      await page.fill('input[type="password"]', newPassword)
      
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle', timeout: 20000 }).catch(() => null),
        page.click('button[type="submit"]'),
      ])
      await page.waitForTimeout(3000)

      const finalUrl = page.url()
      console.log(`Final URL: ${finalUrl}`)
      
      if (finalUrl.includes(expectedDashboard)) {
        results.loginWithNewPassword = true
        results.reachDashboard = true
        console.log(`✅ Reached dashboard: ${expectedDashboard}`)
      } else {
        results.errors.push(`Did not reach expected dashboard. Got: ${finalUrl}`)
        console.log(`❌ Expected ${expectedDashboard}, got: ${finalUrl}`)
      }
    } else if (afterPasswordChangeUrl.includes(expectedDashboard)) {
      results.reachDashboard = true
      results.loginWithNewPassword = true
      console.log(`✅ Directly reached dashboard: ${expectedDashboard}`)
    }

    // Step 4: Test logout
    console.log('\n--- Step 4: Test logout ---')
    const logoutButton = await page.$('text=Logout, text=Sign Out, text=Log Out, button:has-text("Logout"), a:has-text("Logout")')
    if (logoutButton) {
      await logoutButton.click()
      await page.waitForTimeout(2000)
      const afterLogoutUrl = page.url()
      if (afterLogoutUrl.includes('/login') || afterLogoutUrl === BASE_URL + '/') {
        results.logout = true
        console.log('✅ Logout successful')
      } else {
        console.log(`⚠️ Unexpected URL after logout: ${afterLogoutUrl}`)
      }
    } else {
      console.log('⚠️ Logout button not found')
    }

  } catch (err) {
    results.errors.push(`Exception: ${err.message}`)
    console.error(`❌ Error: ${err.message}`)
  } finally {
    await browser.close()
  }

  return results
}

async function testQAAccount(email, password, label, expectedDashboard) {
  console.log(`\n${'='.repeat(70)}`)
  console.log(`QA ACCOUNT TEST: ${label}`)
  console.log(`${'='.repeat(70)}`)

  const browser = await chromium.launch({ headless: true })
  const page = await (await browser.newContext()).newPage()

  const results = {
    label,
    email,
    login: false,
    reachDashboard: false,
    errors: []
  }

  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 })
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 20000 }).catch(() => null),
      page.click('button[type="submit"]'),
    ])
    await page.waitForTimeout(3000)

    const finalUrl = page.url()
    console.log(`Final URL: ${finalUrl}`)
    
    if (finalUrl.includes(expectedDashboard)) {
      results.login = true
      results.reachDashboard = true
      console.log(`✅ Login successful, reached ${expectedDashboard}`)
    } else if (finalUrl.includes('/login')) {
      const pageContent = await page.content()
      if (pageContent.includes('Invalid email or password')) {
        results.errors.push('Invalid credentials')
        console.log('❌ Invalid credentials')
      } else if (pageContent.includes('Invalid path')) {
        results.errors.push('Invalid path error')
        console.log('❌ Invalid path error')
      } else {
        results.errors.push('Still on login page')
        console.log('❌ Still on login page')
      }
    } else {
      results.errors.push(`Unexpected URL: ${finalUrl}`)
      console.log(`⚠️ Unexpected URL: ${finalUrl}`)
    }

  } catch (err) {
    results.errors.push(`Exception: ${err.message}`)
    console.error(`❌ Error: ${err.message}`)
  } finally {
    await browser.close()
  }

  return results
}

async function main() {
  console.log('P1 FINAL VERIFICATION')
  console.log(`Time: ${new Date().toISOString()}`)
  console.log(`Target: ${BASE_URL}`)

  const allResults = []

  // Test pilot accounts with full password change flow
  console.log('\n' + '='.repeat(70))
  console.log('PILOT ACCOUNTS — Full Password Change Flow')
  console.log('='.repeat(70))

  allResults.push(await testFullFlow(
    'tessamyers2911@gmail.com',
    'RisePilot2026!',
    'TessaSecure2026!',
    'Tessa Myers (Instructor)',
    '/instructor'
  ))

  allResults.push(await testFullFlow(
    'patty.pineda.drl@gmail.com',
    'RisePilot2026!',
    'PattySecure2026!',
    'Patty Pineda (Student)',
    '/dashboard'
  ))

  allResults.push(await testFullFlow(
    'MalennySaenz@gmail.com',
    'RisePilot2026!',
    'MalennySecure2026!',
    'Malenny Saenz (Student)',
    '/dashboard'
  ))

  // Test QA accounts (these may have different passwords)
  console.log('\n' + '='.repeat(70))
  console.log('QA ACCOUNTS — Standard Login')
  console.log('='.repeat(70))

  allResults.push(await testQAAccount(
    'admin@ascyn-smoke.test',
    'AscynSmoke2026!',
    'QA Admin',
    '/admin'
  ))

  allResults.push(await testQAAccount(
    'instructor@ascyn-smoke.test',
    'AscynSmoke2026!',
    'QA Instructor',
    '/instructor'
  ))

  allResults.push(await testQAAccount(
    'student@ascyn-smoke.test',
    'AscynSmoke2026!',
    'QA Student',
    '/dashboard'
  ))

  // Summary
  console.log('\n' + '='.repeat(70))
  console.log('VERIFICATION SUMMARY')
  console.log('='.repeat(70))

  const passed = allResults.filter(r => 
    (r.login && r.reachDashboard) || 
    (r.login && r.reachUpdatePassword && r.passwordChange)
  ).length
  const failed = allResults.length - passed

  allResults.forEach(r => {
    const status = r.errors.length === 0 ? '✅ PASS' : '❌ FAIL'
    console.log(`${status} ${r.label}`)
    if (r.errors.length > 0) {
      r.errors.forEach(e => console.log(`   - ${e}`))
    }
  })

  console.log(`\nTotal: ${allResults.length} | Passed: ${passed} | Failed: ${failed}`)

  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED — P1 RESOLVED')
  } else {
    console.log('\n⚠️ SOME TESTS FAILED — P1 STILL OPEN')
  }
}

main().catch(console.error)
