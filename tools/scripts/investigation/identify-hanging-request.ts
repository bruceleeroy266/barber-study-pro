/**
 * Identify Hanging Request in Admin Dashboard
 * 
 * This script tests each admin page to identify which request hangs.
 * Run with: npx tsx --env-file=.env.local scripts/identify-hanging-request.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const baseUrl = 'http://localhost:3000'

const TEMP_PASSWORD = '***'

async function testHangingRequests() {
  console.log('🔍 Identifying Hanging Request in Admin Dashboard\n')

  // Login as admin
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'verify-admin@ascynpro.test',
    password: TEMP_PASSWORD,
  })

  if (authError || !authData.session) {
    console.error('❌ Login failed:', authError?.message)
    process.exit(1)
  }

  console.log('✅ Logged in as admin')
  console.log(`   User ID: ${authData.user.id}`)

  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\./)?.[1]
  const cookieValue = JSON.stringify({
    access_token: authData.session.access_token,
    refresh_token: authData.session.refresh_token,
    expires_at: authData.session.expires_at,
    expires_in: authData.session.expires_in,
    token_type: authData.session.token_type,
    user: authData.user,
  })

  const headers = {
    Cookie: `sb-${projectRef}-auth-token=${encodeURIComponent(cookieValue)}`,
  }

  // Test each admin page with a timeout
  const pages = [
    { path: '/admin', name: 'Admin Dashboard' },
    { path: '/admin/users', name: 'User Management' },
    { path: '/admin/health', name: 'System Health' },
    { path: '/admin/maintenance', name: 'Maintenance Mode' },
    { path: '/admin/pilot-inquiries', name: 'Pilot Inquiries' },
  ]

  for (const page of pages) {
    console.log(`\n📄 Testing: ${page.name} (${page.path})`)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const startTime = Date.now()
      const response = await fetch(`${baseUrl}${page.path}`, {
        headers,
        signal: controller.signal,
        redirect: 'manual',
      })
      clearTimeout(timeoutId)
      
      const duration = Date.now() - startTime
      console.log(`   Status: ${response.status}`)
      console.log(`   Duration: ${duration}ms`)
      
      if (response.status === 200) {
        console.log(`   ✅ Page loaded successfully`)
      } else if (response.status === 307 || response.status === 302) {
        const location = response.headers.get('location')
        console.log(`   ⚠️  Redirected to: ${location}`)
      } else {
        console.log(`   ⚠️  Unexpected status: ${response.status}`)
      }
    } catch (err: any) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        console.log(`   ❌ REQUEST HUNG - Timed out after 10 seconds`)
        console.log(`   🔴 THIS IS THE HANGING REQUEST: ${page.path}`)
      } else {
        console.log(`   ❌ Error: ${err.message}`)
      }
    }
  }

  // Test server actions directly
  console.log('\n\n🔧 Testing Server Actions Directly\n')

  // Test getUsers
  console.log('Testing getUsers action...')
  try {
    const { getUsers } = await import('../../../src/app/admin/users/actions')
    const startTime = Date.now()
    const result = await Promise.race([
      getUsers({ limit: 50 }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
    ]) as Awaited<ReturnType<typeof getUsers>>
    const duration = Date.now() - startTime
    console.log(`   ✅ getUsers completed in ${duration}ms`)
    console.log(`   Success: ${result.success}`)
  } catch (err: any) {
    console.log(`   ❌ getUsers failed: ${err.message}`)
  }

  // Test getSchools
  console.log('\nTesting getSchools action...')
  try {
    const { getSchools } = await import('../../../src/app/admin/users/actions')
    const startTime = Date.now()
    const result = await Promise.race([
      getSchools(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
    ]) as Awaited<ReturnType<typeof getSchools>>
    const duration = Date.now() - startTime
    console.log(`   ✅ getSchools completed in ${duration}ms`)
    console.log(`   Success: ${result.success}`)
  } catch (err: any) {
    console.log(`   ❌ getSchools failed: ${err.message}`)
  }

  // Test runDiagnostics
  console.log('\nTesting runDiagnostics...')
  try {
    const { runDiagnostics } = await import('../../../src/lib/diagnostics/diagnostics')
    const startTime = Date.now()
    const result = await Promise.race([
      runDiagnostics(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
    ]) as Awaited<ReturnType<typeof runDiagnostics>>
    const duration = Date.now() - startTime
    console.log(`   ✅ runDiagnostics completed in ${duration}ms`)
    console.log(`   Overall status: ${result.overallStatus}`)
  } catch (err: any) {
    console.log(`   ❌ runDiagnostics failed: ${err.message}`)
  }

  // Test getMaintenanceMode
  console.log('\nTesting getMaintenanceMode...')
  try {
    const { getMaintenanceMode } = await import('../../../src/lib/maintenance/maintenance-mode')
    const startTime = Date.now()
    const result = await Promise.race([
      getMaintenanceMode(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
    ]) as Awaited<ReturnType<typeof getMaintenanceMode>>
    const duration = Date.now() - startTime
    console.log(`   ✅ getMaintenanceMode completed in ${duration}ms`)
    console.log(`   Enabled: ${result.state.enabled}`)
  } catch (err: any) {
    console.log(`   ❌ getMaintenanceMode failed: ${err.message}`)
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 SUMMARY')
  console.log('='.repeat(60))
}

testHangingRequests().catch(console.error)
