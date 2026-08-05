/**
 * Live Authentication Verification Test
 * 
 * This script performs HTTP-based verification of the authentication flow
 * against the local dev server.
 * 
 * Run with: npx tsx --env-file=.env.local scripts/verify-auth-live.ts
 */

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const baseUrl = 'http://localhost:3000'

// Test accounts from backup
const testAccounts = {
  admin: {
    email: 'gabebot24+admin-test@ascynpro.test',
    password: 'test123', // We need to find the actual password
    expectedRoute: '/admin',
  },
  instructor: {
    email: 'ascyn-qa-instructor-test@ascynpro.test',
    password: 'test123', // We need to find the actual password
    expectedRoute: '/instructor',
  },
  student: {
    email: 'student@ascyn-smoke.test',
    password: 'test123', // We need to find the actual password
    expectedRoute: '/dashboard',
  },
}

console.log('🔍 Live Authentication Verification\n')
console.log(`Base URL: ${baseUrl}`)
console.log(`Supabase URL: ${supabaseUrl}`)
console.log('')

// Check if dev server is running
async function checkServer(): Promise<boolean> {
  try {
    const response = await fetch(baseUrl)
    return response.ok
  } catch {
    return false
  }
}

// Test login flow
async function testLogin(role: string, email: string, password: string) {
  console.log(`\n📋 Testing ${role.toUpperCase()} Login`)
  console.log(`Email: ${email}`)
  
  const supabase = createBrowserClient(supabaseUrl, supabaseKey)
  
  try {
    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.log(`❌ Login failed: ${error.message}`)
      return false
    }
    
    if (!data.user) {
      console.log('❌ Login succeeded but no user returned')
      return false
    }
    
    console.log(`✅ Login successful: ${data.user.id}`)
    console.log(`   Email: ${data.user.email}`)
    
    // Check session
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData.session) {
      console.log(`✅ Session exists`)
      console.log(`   Access token: ${sessionData.session.access_token.substring(0, 20)}...`)
    } else {
      console.log('❌ No session after login')
      return false
    }
    
    // Check cookies (in browser environment)
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split('; ').filter(c => c.includes('sb-'))
      console.log(`✅ Auth cookies found: ${cookies.length}`)
      cookies.forEach(c => {
        const [name] = c.split('=')
        console.log(`   - ${name}`)
      })
    }
    
    return true
  } catch (err) {
    console.log(`❌ Login error: ${err}`)
    return false
  }
}

// Test protected route access
async function testProtectedRoute(route: string, cookies: string[]) {
  console.log(`\n🔒 Testing Protected Route: ${route}`)
  
  try {
    const response = await fetch(`${baseUrl}${route}`, {
      headers: {
        Cookie: cookies.join('; '),
      },
      redirect: 'manual',
    })
    
    console.log(`   Status: ${response.status}`)
    
    if (response.status === 200) {
      console.log(`✅ Access granted to ${route}`)
      return true
    } else if (response.status === 307 || response.status === 302) {
      const location = response.headers.get('location')
      console.log(`❌ Redirected to: ${location}`)
      return false
    } else {
      console.log(`❌ Unexpected status: ${response.status}`)
      return false
    }
  } catch (err) {
    console.log(`❌ Route test error: ${err}`)
    return false
  }
}

// Main verification
async function main() {
  // Check server
  console.log('Checking dev server...')
  const serverRunning = await checkServer()
  if (!serverRunning) {
    console.log('❌ Dev server is not running')
    console.log('   Start it with: npm run dev')
    process.exit(1)
  }
  console.log('✅ Dev server is running\n')
  
  // Note: We cannot fully test the authentication flow without actual passwords
  // The passwords in the backup are bcrypt hashes, not plaintext
  
  console.log('⚠️  IMPORTANT: Cannot perform automated login without plaintext passwords')
  console.log('')
  console.log('To complete verification, you must manually test in the browser:')
  console.log('')
  console.log('1. Open http://localhost:3000/login')
  console.log('2. Log in with each test account:')
  console.log('')
  console.log('   ADMIN:')
  console.log(`   Email: ${testAccounts.admin.email}`)
  console.log('   Password: [you need to know the plaintext password]')
  console.log(`   Expected: Redirect to ${testAccounts.admin.expectedRoute}`)
  console.log('')
  console.log('   INSTRUCTOR:')
  console.log(`   Email: ${testAccounts.instructor.email}`)
  console.log('   Password: [you need to know the plaintext password]')
  console.log(`   Expected: Redirect to ${testAccounts.instructor.expectedRoute}`)
  console.log('')
  console.log('   STUDENT:')
  console.log(`   Email: ${testAccounts.student.email}`)
  console.log('   Password: [you need to know the plaintext password]')
  console.log(`   Expected: Redirect to ${testAccounts.student.expectedRoute}`)
  console.log('')
  console.log('3. For each login, verify:')
  console.log('   - Login succeeds without errors')
  console.log('   - Browser DevTools > Application > Cookies shows sb-*-auth-token cookies')
  console.log('   - You are redirected to the correct dashboard')
  console.log('   - Refreshing the page keeps you logged in')
  console.log('   - Logout works correctly')
  console.log('')
  console.log('4. Check middleware logs in the terminal for:')
  console.log('   - No "Unauthorized" warnings for authenticated users')
  console.log('   - No redirects to /login for authenticated users')
}

main().catch(console.error)
