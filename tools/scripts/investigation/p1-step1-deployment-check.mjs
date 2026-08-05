// P1 Final Verification — Step 1: Check if fix is live
import { chromium } from 'playwright'

const BASE_URL = 'https://ascynpro.com'

async function main() {
  console.log('STEP 1: Verify production is serving fixed middleware')
  console.log(`Time: ${new Date().toISOString()}`)
  console.log(`Target: ${BASE_URL}`)
  console.log(`Expected commit: 59be02a`)

  const browser = await chromium.launch({ headless: true })
  const page = await (await browser.newContext()).newPage()

  const redirects = []
  page.on('response', r => {
    if (r.request().resourceType() === 'document') {
      redirects.push({ url: r.url(), status: r.status() })
    }
  })

  // Test with Tessa Myers — the account that was looping
  console.log('\nTesting Tessa Myers (previously looping)...')
  
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 })
  await page.fill('input[type="email"]', 'tessamyers2911@gmail.com')
  await page.fill('input[type="password"]', 'RisePilot2026!')
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 20000 }).catch(() => null),
    page.click('button[type="submit"]'),
  ])
  
  await page.waitForTimeout(3000)
  
  const finalUrl = page.url()
  const redirectCount = redirects.filter(r => r.status === 307).length
  const isLooping = redirectCount > 5
  
  console.log(`\nFinal URL: ${finalUrl}`)
  console.log(`307 redirects: ${redirectCount}`)
  console.log(`Redirect loop: ${isLooping ? '❌ YES — STILL LOOPING' : '✅ NO'}`)
  
  if (redirects.length > 0) {
    console.log('\nRedirect chain:')
    redirects.forEach(r => console.log(`  ${r.status} ${r.url}`))
  }

  // Check for error messages
  const pageContent = await page.content()
  if (pageContent.includes('Invalid path')) {
    console.log('\n❌ "Invalid path specified in request URL" found on page')
  }
  if (pageContent.includes('ERR_TOO_MANY_REDIRECTS')) {
    console.log('\n❌ ERR_TOO_MANY_REDIRECTS detected')
  }

  // Determine if fix is live
  const fixLive = !isLooping && finalUrl.includes('/update-password')
  
  console.log(`\n${'='.repeat(60)}`)
  if (fixLive) {
    console.log('✅ FIX IS LIVE — /update-password loads without redirect loop')
    console.log('Proceeding to Step 2: Full verification')
  } else if (isLooping) {
    console.log('❌ FIX NOT YET LIVE — redirect loop still occurring')
    console.log('Vercel may still be deploying. Wait and retry.')
  } else {
    console.log(`⚠️ UNEXPECTED STATE — URL: ${finalUrl}`)
  }
  console.log(`${'='.repeat(60)}`)

  await browser.close()
  
  return { fixLive, finalUrl, redirectCount, isLooping }
}

main().catch(console.error)
