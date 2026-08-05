/**
 * Test Harness for Identifying Hanging Requests
 * 
 * This script starts the Next.js dev server and makes requests to admin pages
 * while monitoring for hanging requests.
 * 
 * Run with: npx tsx --env-file=.env.local scripts/test-hanging-requests.ts
 */

import { spawn, ChildProcess } from 'child_process'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const baseUrl = 'http://localhost:3000'

// Test credentials - update these with valid test credentials
const TEST_EMAIL = process.env.TEST_ADMIN_EMAIL || 'admin@test.com'
const TEST_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'testpassword123'

let serverProcess: ChildProcess | null = null
let serverLogs: string[] = []

async function startServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting Next.js dev server...')
    
    serverProcess = spawn('npm', ['run', 'dev'], {
      cwd: process.cwd(),
      shell: true,
      env: { ...process.env, FORCE_COLOR: '0' }
    })

    let started = false
    
    serverProcess.stdout?.on('data', (data) => {
      const output = data.toString()
      serverLogs.push(output)
      
      // Look for server ready message
      if (output.includes('Ready in') || output.includes('started server on')) {
        if (!started) {
          started = true
          console.log('✅ Server started')
          resolve()
        }
      }
    })

    serverProcess.stderr?.on('data', (data) => {
      const output = data.toString()
      serverLogs.push(`[STDERR] ${output}`)
    })

    serverProcess.on('error', (err) => {
      reject(err)
    })

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!started) {
        reject(new Error('Server failed to start within 30 seconds'))
      }
    }, 30000)
  })
}

async function stopServer(): Promise<void> {
  if (serverProcess) {
    console.log('\n🛑 Stopping server...')
    serverProcess.kill('SIGTERM')
    
    // Wait for process to exit
    await new Promise<void>((resolve) => {
      serverProcess?.on('exit', () => resolve())
      setTimeout(() => {
        serverProcess?.kill('SIGKILL')
        resolve()
      }, 5000)
    })
    
    serverProcess = null
  }
}

async function login(): Promise<{ accessToken: string; cookies: string } | null> {
  console.log('\n🔐 Logging in as admin...')
  
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
  
  // Extract project ref for cookie name
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\./)?.[1]
  const cookieValue = JSON.stringify({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
    expires_in: data.session.expires_in,
    token_type: data.session.token_type,
    user: data.user,
  })
  
  const cookies = `sb-${projectRef}-auth-token=${encodeURIComponent(cookieValue)}`
  
  return {
    accessToken: data.session.access_token,
    cookies,
  }
}

async function testPage(path: string, cookies: string, timeoutMs: number = 15000): Promise<{
  path: string
  status: number | null
  duration: number
  hung: boolean
  error?: string
}> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  
  const startTime = Date.now()
  
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: {
        Cookie: cookies,
      },
      signal: controller.signal,
      redirect: 'manual',
    })
    
    clearTimeout(timeoutId)
    const duration = Date.now() - startTime
    
    return {
      path,
      status: response.status,
      duration,
      hung: false,
    }
  } catch (err: any) {
    clearTimeout(timeoutId)
    const duration = Date.now() - startTime
    
    if (err.name === 'AbortError') {
      return {
        path,
        status: null,
        duration,
        hung: true,
        error: `Request hung for ${duration}ms`,
      }
    }
    
    return {
      path,
      status: null,
      duration,
      hung: false,
      error: err.message,
    }
  }
}

async function analyzeServerLogs(): Promise<void> {
  console.log('\n' + '='.repeat(80))
  console.log('📊 SERVER LOG ANALYSIS')
  console.log('='.repeat(80))
  
  // Find all TRACE logs
  const traceLogs = serverLogs.filter(log => log.includes('[TRACE'))
  
  if (traceLogs.length === 0) {
    console.log('No TRACE logs found in server output')
    return
  }
  
  console.log(`\nFound ${traceLogs.length} trace log entries:\n`)
  
  // Group by request ID
  const requests = new Map<string, string[]>()
  
  for (const log of traceLogs) {
    const match = log.match(/\[TRACE [^\]]+\] \[([^\]]+)\]/)
    if (match) {
      const requestId = match[1]
      if (!requests.has(requestId)) {
        requests.set(requestId, [])
      }
      requests.get(requestId)!.push(log)
    }
  }
  
  // Analyze each request
  for (const [requestId, logs] of requests) {
    console.log(`\n📋 Request: ${requestId}`)
    console.log('-'.repeat(60))
    
    let hasStart = false
    let hasEnd = false
    let lastLog = ''
    
    for (const log of logs) {
      console.log(`  ${log.trim()}`)
      
      if (log.includes('▶ START')) {
        hasStart = true
      }
      if (log.includes('✓ END') || log.includes('✗ END') || log.includes('↪ END')) {
        hasEnd = true
      }
      lastLog = log
    }
    
    if (hasStart && !hasEnd) {
      console.log(`\n  🔴 HANGING: Request started but never completed`)
      console.log(`  Last log: ${lastLog.trim()}`)
    } else if (hasStart && hasEnd) {
      console.log(`\n  ✅ COMPLETED: Request finished normally`)
    }
  }
  
  // Find pending requests (started but not ended)
  console.log('\n' + '='.repeat(80))
  console.log('🔍 PENDING REQUESTS SUMMARY')
  console.log('='.repeat(80))
  
  const pendingRequests: string[] = []
  
  for (const [requestId, logs] of requests) {
    const hasStart = logs.some(log => log.includes('▶ START'))
    const hasEnd = logs.some(log => log.includes('✓ END') || log.includes('✗ END') || log.includes('↪ END'))
    
    if (hasStart && !hasEnd) {
      pendingRequests.push(requestId)
    }
  }
  
  if (pendingRequests.length === 0) {
    console.log('No pending requests found')
  } else {
    console.log(`Found ${pendingRequests.length} pending request(s):`)
    for (const reqId of pendingRequests) {
      console.log(`  - ${reqId}`)
    }
  }
}

async function main() {
  console.log('🔍 Hanging Request Identification Test')
  console.log('='.repeat(80))
  
  try {
    // Start server
    await startServer()
    
    // Wait a bit for server to fully initialize
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Login
    const auth = await login()
    if (!auth) {
      console.error('Cannot proceed without valid credentials')
      await stopServer()
      process.exit(1)
    }
    
    // Test each admin page
    const pages = [
      { path: '/admin', name: 'Admin Dashboard' },
      { path: '/admin/users', name: 'User Management' },
      { path: '/admin/health', name: 'System Health' },
      { path: '/admin/maintenance', name: 'Maintenance Mode' },
      { path: '/admin/audit', name: 'Audit History' },
    ]
    
    console.log('\n📄 Testing Admin Pages')
    console.log('='.repeat(80))
    
    const results: Array<{
      path: string
      status: number | null
      duration: number
      hung: boolean
      error?: string
    }> = []
    
    for (const page of pages) {
      console.log(`\nTesting: ${page.name} (${page.path})`)
      
      const result = await testPage(page.path, auth.cookies)
      results.push(result)
      
      if (result.hung) {
        console.log(`  🔴 HUNG after ${result.duration}ms`)
      } else if (result.error) {
        console.log(`  ❌ Error: ${result.error}`)
      } else {
        console.log(`  ✅ Status: ${result.status} in ${result.duration}ms`)
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    // Summary
    console.log('\n' + '='.repeat(80))
    console.log('📊 TEST RESULTS SUMMARY')
    console.log('='.repeat(80))
    
    const hungPages = results.filter(r => r.hung)
    
    if (hungPages.length === 0) {
      console.log('✅ No hanging requests detected')
    } else {
      console.log(`🔴 Found ${hungPages.length} hanging request(s):`)
      for (const page of hungPages) {
        console.log(`  - ${page.path}: hung for ${page.duration}ms`)
      }
    }
    
    // Analyze server logs
    await analyzeServerLogs()
    
  } finally {
    await stopServer()
  }
}

main().catch(console.error)
