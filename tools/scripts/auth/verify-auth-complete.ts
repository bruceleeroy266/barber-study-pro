/**
 * Complete Authentication Verification
 * 
 * Verifies the full authentication flow for all three roles.
 * Run with: npx tsx --env-file=.env.local scripts/verify-auth-complete.ts
 */

import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const baseUrl = 'http://localhost:3000'

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

interface VerificationResult {
  role: string
  loginSuccess: boolean
  cookiesCreated: boolean
  serverGetUserSuccess: boolean
  middlewareAllowsAccess: boolean
  refreshWorks: boolean
  logoutWorks: boolean
  errors: string[]
}

async function verifyAccount(account: typeof testAccounts[0]): Promise<VerificationResult> {
  const result: VerificationResult = {
    role: account.role,
    loginSuccess: false,
    cookiesCreated: false,
    serverGetUserSuccess: false,
    middlewareAllowsAccess: false,
    refreshWorks: false,
    logoutWorks: false,
    errors: [],
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(`🔍 Verifying ${account.role.toUpperCase()}`)
  console.log('='.repeat(60))
  console.log(`Email: ${account.email}`)
  console.log(`Expected Route: ${account.expectedRoute}`)

  // Step 1: Login
  console.log('\n📋 Step 1: Login')
  const browserClient = createClient(supabaseUrl, supabaseKey)
  
  try {
    const { data, error } = await browserClient.auth.signInWithPassword({
      email: account.email,
      password: account.password,
    })

    if (error) {
      result.errors.push(`Login failed: ${error.message}`)
      console.log(`❌ Login failed: ${error.message}`)
      return result
    }

    if (!data.user) {
      result.errors.push('Login succeeded but no user returned')
      console.log('❌ No user returned')
      return result
    }

    result.loginSuccess = true
    console.log(`✅ Login successful`)
    console.log(`   User ID: ${data.user.id}`)
    console.log(`   Email: ${data.user.email}`)
  } catch (err) {
    result.errors.push(`Login error: ${err}`)
    console.log(`❌ Login error: ${err}`)
    return result
  }

  // Step 2: Check cookies
  console.log('\n🍪 Step 2: Cookie Verification')
  const { data: sessionData } = await browserClient.auth.getSession()
  
  if (sessionData.session) {
    result.cookiesCreated = true
    console.log('✅ Session exists')
    console.log(`   Access token: ${sessionData.session.access_token.substring(0, 30)}...`)
    console.log(`   Refresh token: ${sessionData.session.refresh_token ? 'Present' : 'Missing'}`)
  } else {
    result.errors.push('No session after login')
    console.log('❌ No session after login')
  }

  // Step 3: Server-side getUser()
  console.log('\n🖥️  Step 3: Server-Side getUser()')
  
  // Get the session to extract the access token
  const { data: { session: currentSession } } = await browserClient.auth.getSession()
  
  if (!currentSession) {
    result.errors.push('No session available for server test')
    console.log('❌ No session available for server test')
  } else {
    // Create server client with proper cookie format
    // Supabase SSR expects the cookie value to be the full session JSON, not just the access token
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\./)?.[1]
    
    const serverClient = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          // Return the session cookie in the format Supabase SSR expects
          return [{
            name: `sb-${projectRef}-auth-token`,
            value: JSON.stringify({
              access_token: currentSession.access_token,
              refresh_token: currentSession.refresh_token,
              expires_at: currentSession.expires_at,
              expires_in: currentSession.expires_in,
              token_type: currentSession.token_type,
              user: currentSession.user,
            }),
          }]
        },
        setAll() {},
      },
    })

    try {
      const { data: { user }, error } = await serverClient.auth.getUser()
      
      if (error) {
        result.errors.push(`Server getUser error: ${error.message}`)
        console.log(`❌ Server getUser error: ${error.message}`)
      } else if (!user) {
        result.errors.push('Server getUser returned null')
        console.log('❌ Server getUser returned null')
      } else {
        result.serverGetUserSuccess = true
        console.log(`✅ Server getUser successful`)
        console.log(`   User ID: ${user.id}`)
        console.log(`   Email: ${user.email}`)
      }
    } catch (err) {
      result.errors.push(`Server getUser exception: ${err}`)
      console.log(`❌ Server getUser exception: ${err}`)
    }
  }

  // Step 4: Test protected route access (via HTTP)
  console.log('\n🔒 Step 4: Protected Route Access')
  
  try {
    // Get the session to create proper cookie
    const { data: { session } } = await browserClient.auth.getSession()
    
    if (!session) {
      result.errors.push('No session for route test')
      console.log('❌ No session for route test')
    } else {
      const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\./)?.[1]
      
      // Create the cookie value in the format Supabase SSR expects
      const cookieValue = JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
        expires_in: session.expires_in,
        token_type: session.token_type,
        user: session.user,
      })
      
      // Make request to protected route with proper cookie
      const response = await fetch(`${baseUrl}${account.expectedRoute}`, {
        headers: {
          Cookie: `sb-${projectRef}-auth-token=${encodeURIComponent(cookieValue)}`,
        },
        redirect: 'manual',
      })

      console.log(`   Response status: ${response.status}`)
      
      if (response.status === 200) {
        result.middlewareAllowsAccess = true
        console.log(`✅ Access granted to ${account.expectedRoute}`)
      } else if (response.status === 307 || response.status === 302) {
        const location = response.headers.get('location')
        
        // Check if this is an expected beta agreement redirect for students
        if (account.role === 'student' && location?.includes('/beta-agreement')) {
          result.middlewareAllowsAccess = true
          console.log(`✅ Student correctly redirected to beta agreement: ${location}`)
        } else {
          result.errors.push(`Redirected to: ${location}`)
          console.log(`❌ Redirected to: ${location}`)
        }
        
        // Check if this is a middleware redirect by looking at response headers
        console.log(`   Set-Cookie headers: ${response.headers.get('set-cookie')}`)
      } else {
        result.errors.push(`Unexpected status: ${response.status}`)
        console.log(`❌ Unexpected status: ${response.status}`)
      }
    }
  } catch (err) {
    result.errors.push(`Route test error: ${err}`)
    console.log(`❌ Route test error: ${err}`)
  }

  // Step 5: Test refresh
  console.log('\n🔄 Step 5: Session Refresh')
  
  try {
    const { data: refreshData, error: refreshError } = await browserClient.auth.refreshSession()
    
    if (refreshError) {
      result.errors.push(`Refresh error: ${refreshError.message}`)
      console.log(`❌ Refresh error: ${refreshError.message}`)
    } else if (!refreshData.session) {
      result.errors.push('Refresh returned no session')
      console.log('❌ Refresh returned no session')
    } else {
      result.refreshWorks = true
      console.log('✅ Session refresh successful')
    }
  } catch (err) {
    result.errors.push(`Refresh exception: ${err}`)
    console.log(`❌ Refresh exception: ${err}`)
  }

  // Step 6: Test logout
  console.log('\n🚪 Step 6: Logout')
  
  try {
    const { error: logoutError } = await browserClient.auth.signOut()
    
    if (logoutError) {
      result.errors.push(`Logout error: ${logoutError.message}`)
      console.log(`❌ Logout error: ${logoutError.message}`)
    } else {
      // Verify session is gone
      const { data: { session } } = await browserClient.auth.getSession()
      
      if (session) {
        result.errors.push('Session still exists after logout')
        console.log('❌ Session still exists after logout')
      } else {
        result.logoutWorks = true
        console.log('✅ Logout successful')
      }
    }
  } catch (err) {
    result.errors.push(`Logout exception: ${err}`)
    console.log(`❌ Logout exception: ${err}`)
  }

  return result
}

async function main() {
  console.log('🔐 Complete Authentication Verification\n')
  console.log(`Base URL: ${baseUrl}`)
  console.log(`Supabase URL: ${supabaseUrl}`)

  // Check if server is running
  try {
    const response = await fetch(baseUrl)
    if (!response.ok) {
      console.log('❌ Dev server is not responding correctly')
      process.exit(1)
    }
    console.log('✅ Dev server is running\n')
  } catch {
    console.log('❌ Dev server is not running')
    console.log('   Start it with: npm run dev')
    process.exit(1)
  }

  const results: VerificationResult[] = []

  for (const account of testAccounts) {
    const result = await verifyAccount(account)
    results.push(result)
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 VERIFICATION SUMMARY')
  console.log('='.repeat(60))

  let allPassed = true

  for (const result of results) {
    const status = result.loginSuccess && 
                   result.cookiesCreated && 
                   result.serverGetUserSuccess && 
                   result.middlewareAllowsAccess && 
                   result.refreshWorks && 
                   result.logoutWorks

    console.log(`\n${result.role.toUpperCase()}:`)
    console.log(`  Login: ${result.loginSuccess ? '✅' : '❌'}`)
    console.log(`  Cookies: ${result.cookiesCreated ? '✅' : '❌'}`)
    console.log(`  Server getUser: ${result.serverGetUserSuccess ? '✅' : '❌'}`)
    console.log(`  Middleware Access: ${result.middlewareAllowsAccess ? '✅' : '❌'}`)
    console.log(`  Refresh: ${result.refreshWorks ? '✅' : '❌'}`)
    console.log(`  Logout: ${result.logoutWorks ? '✅' : '❌'}`)

    if (result.errors.length > 0) {
      console.log(`  Errors:`)
      result.errors.forEach(e => console.log(`    - ${e}`))
    }

    if (!status) {
      allPassed = false
    }
  }

  console.log('\n' + '='.repeat(60))
  
  if (allPassed) {
    console.log('✅ ALL VERIFICATIONS PASSED')
    console.log('='.repeat(60))
    console.log('\nThe authentication fix is verified and working correctly.')
    console.log('\nRecommendation:')
    console.log('1. Commit the authentication fix')
    console.log('2. Push to origin/main')
    console.log('3. Deploy to Vercel (no build cache)')
    console.log('4. Perform production smoke test')
  } else {
    console.log('❌ SOME VERIFICATIONS FAILED')
    console.log('='.repeat(60))
    console.log('\nPlease review the errors above and fix before proceeding.')
  }
}

main().catch(console.error)
