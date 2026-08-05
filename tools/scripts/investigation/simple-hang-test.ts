/**
 * Simple Hanging Request Test
 * 
 * Makes requests to admin pages and captures which ones hang.
 * Run with: npx tsx --env-file=.env.local scripts/simple-hang-test.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const baseUrl = 'http://localhost:3000'

// Test credentials - update these with valid test credentials
const TEST_EMAIL = process.env.TEST_ADMIN_EMAIL || 'test-admin@ascynpro.test'
const TEST_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'TestAdmin123!'

async function login(): Promise<string | null> {
  console.log('🔐 Logging in...')
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  })

  if (error || !data.session) {
    console.error('❌ Login failed:', error?.message)
    return null
  }

  console.log('✅ Login successful')
  
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\./)?.[1]
  const cookieValue = JSON.stringify({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
    expires_in: data.session.expires_in,
    token_type: data.session.token_type,
    user: data.user,
  })
  
  return `sb-${projectRef}-auth-token=${encodeURIComponent(cookieValue)}`
}

async function testPage(path: string, cookies: string, timeoutMs: number = 10000): Promise<void> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  
  const startTime = Date.now()
  console.log(`\n📄 Testing: ${path}`)
  console.log(`   Started at: ${new Date().toISOString()}`)
  
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { Cookie: cookies },
      signal: controller.signal,
      redirect: 'manual',
    })
    
    clearTimeout(timeoutId)
    const duration = Date.now() - startTime
    
    console.log(`   ✅ Status: ${response.status} in ${duration}ms`)
    
    if (response.status === 307 || response.status === 302) {
      const location = response.headers.get('location')
      console.log(`   ↪ Redirected to: ${location}`)
    }
  } catch (err: any) {
    clearTimeout(timeoutId)
    const duration = Date.now() - startTime
    
    if (err.name === 'AbortError') {
      console.log(`   🔴 HUNG after ${duration}ms`)
      console.log(`   This is the hanging request: ${path}`)
    } else {
      console.log(`   ❌ Error: ${err.message}`)
    }
  }
}

async function main() {
  console.log('🔍 Simple Hanging Request Test')
  console.log('='.repeat(60))
  
  const cookies = await login()
  if (!cookies) {
    console.error('Cannot proceed without valid credentials')
    process.exit(1)
  }
  
  const pages = [
    '/admin',
    '/admin/users',
    '/admin/health',
    '/admin/maintenance',
    '/admin/audit',
  ]
  
  for (const path of pages) {
    await testPage(path, cookies)
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('Test complete')
}

main().catch(console.error)
