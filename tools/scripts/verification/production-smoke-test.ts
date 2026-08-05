/**
 * Production Smoke Test
 * 
 * Tests the production deployment at https://ascynpro.com
 * Run with: npx tsx --env-file=.env.local scripts/production-smoke-test.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const baseUrl = 'https://ascynpro.com'

const TEMP_PASSWORD = 'AscynTest2026!'

const testAccounts = [
  {
    role: 'admin',
    email: 'verify-admin@ascynpro.test',
    password: TEMP_PASSWORD,
    expectedRoute: '/admin',
  },
  {
    role: 'instructor',
    email: 'verify-instructor@ascynpro.test',
    password: TEMP_PASSWORD,
    expectedRoute: '/instructor',
  },
  {
    role: 'student',
    email: 'verify-student@ascynpro.test',
    password: TEMP_PASSWORD,
    expectedRoute: '/dashboard',
  },
]

interface TestResult {
  step: string
  passed: boolean
  details: string
}

async function testAccount(account: typeof testAccounts[0]): Promise<TestResult[]> {
  const results: TestResult[] = []
  
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Testing ${account.role.toUpperCase()}: ${account.email}`)
  console.log('='.repeat(60))

  // Test 1: Login
  console.log('\n📋 Test 1: Login')
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: account.email,
      password: account.password,
    })

    if (error) {
      results.push({ step: 'Login', passed: false, details: error.message })
      console.log(`❌ Login failed: ${error.message}`)
      return results
    }

    if (!data.user) {
      results.push({ step: 'Login', passed: false, details: 'No user returned' })
      console.log('❌ No user returned')
      return results
    }

    results.push({ step: 'Login', passed: true, details: `User ID: ${data.user.id}` })
    console.log(`✅ Login successful: ${data.user.id}`)
  } catch (err) {
    results.push({ step: 'Login', passed: false, details: String(err) })
    console.log(`❌ Login error: ${err}`)
    return results
  }

  // Test 2: Session
  console.log('\n🍪 Test 2: Session')
  const { data: sessionData } = await supabase.auth.getSession()
  
  if (sessionData.session) {
    results.push({ step: 'Session', passed: true, details: 'Session exists' })
    console.log('✅ Session exists')
  } else {
    results.push({ step: 'Session', passed: false, details: 'No session' })
    console.log('❌ No session')
  }

  // Test 3: Protected Route Access
  console.log('\n🔒 Test 3: Protected Route')
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      results.push({ step: 'Protected Route', passed: false, details: 'No session for route test' })
      console.log('❌ No session for route test')
    } else {
      const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\./)?.[1]
      
      const cookieValue = JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
        expires_in: session.expires_in,
        token_type: session.token_type,
        user: session.user,
      })
      
      const response = await fetch(`${baseUrl}${account.expectedRoute}`, {
        headers: {
          Cookie: `sb-${projectRef}-auth-token=${encodeURIComponent(cookieValue)}`,
        },
        redirect: 'manual',
      })

      console.log(`   Response status: ${response.status}`)
      
      if (response.status === 200) {
        results.push({ step: 'Protected Route', passed: true, details: `Access granted to ${account.expectedRoute}` })
        console.log(`✅ Access granted to ${account.expectedRoute}`)
      } else if (response.status === 307 || response.status === 302) {
        const location = response.headers.get('location')
        
        // Check if this is an expected beta agreement redirect for students
        if (account.role === 'student' && location?.includes('/beta-agreement')) {
          results.push({ step: 'Protected Route', passed: true, details: `Student correctly redirected to beta agreement` })
          console.log(`✅ Student correctly redirected to beta agreement`)
        } else {
          results.push({ step: 'Protected Route', passed: false, details: `Redirected to: ${location}` })
          console.log(`❌ Redirected to: ${location}`)
        }
      } else {
        results.push({ step: 'Protected Route', passed: false, details: `Unexpected status: ${response.status}` })
        console.log(`❌ Unexpected status: ${response.status}`)
      }
    }
  } catch (err) {
    results.push({ step: 'Protected Route', passed: false, details: String(err) })
    console.log(`❌ Route test error: ${err}`)
  }

  // Test 4: Logout
  console.log('\n🚪 Test 4: Logout')
  
  try {
    const { error: logoutError } = await supabase.auth.signOut()
    
    if (logoutError) {
      results.push({ step: 'Logout', passed: false, details: logoutError.message })
      console.log(`❌ Logout error: ${logoutError.message}`)
    } else {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        results.push({ step: 'Logout', passed: false, details: 'Session still exists' })
        console.log('❌ Session still exists after logout')
      } else {
        results.push({ step: 'Logout', passed: true, details: 'Logout successful' })
        console.log('✅ Logout successful')
      }
    }
  } catch (err) {
    results.push({ step: 'Logout', passed: false, details: String(err) })
    console.log(`❌ Logout exception: ${err}`)
  }

  return results
}

async function main() {
  console.log('🔥 Production Smoke Test\n')
  console.log(`Target: ${baseUrl}`)
  console.log(`Supabase: ${supabaseUrl}`)

  // Test homepage
  console.log('\n🏠 Testing Homepage')
  try {
    const response = await fetch(baseUrl)
    if (response.ok) {
      console.log('✅ Homepage loads')
    } else {
      console.log(`❌ Homepage returned ${response.status}`)
    }
  } catch (err) {
    console.log(`❌ Homepage error: ${err}`)
  }

  const allResults: Array<{ role: string; results: TestResult[] }> = []

  for (const account of testAccounts) {
    const results = await testAccount(account)
    allResults.push({ role: account.role, results })
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 PRODUCTION SMOKE TEST SUMMARY')
  console.log('='.repeat(60))

  let allPassed = true

  for (const { role, results } of allResults) {
    console.log(`\n${role.toUpperCase()}:`)
    
    for (const result of results) {
      const icon = result.passed ? '✅' : '❌'
      console.log(`  ${icon} ${result.step}: ${result.details}`)
      if (!result.passed) allPassed = false
    }
  }

  console.log('\n' + '='.repeat(60))
  
  if (allPassed) {
    console.log('✅ ALL PRODUCTION TESTS PASSED')
    console.log('='.repeat(60))
  } else {
    console.log('❌ SOME PRODUCTION TESTS FAILED')
    console.log('='.repeat(60))
  }
}

main().catch(console.error)
