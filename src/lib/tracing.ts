/**
 * Request Tracing Utility
 * 
 * Provides timestamped logging for identifying hanging requests.
 * Each log entry includes: timestamp, request ID, function name, and duration.
 */

const requestTimings = new Map<string, number>()

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export function logRequestStart(requestId: string, functionName: string, details?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString()
  requestTimings.set(requestId, Date.now())
  console.log(`[TRACE ${timestamp}] [${requestId}] ▶ START ${functionName}`, details ? JSON.stringify(details) : '')
}

export function logRequestEnd(requestId: string, functionName: string, result?: 'success' | 'error' | 'redirect', details?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString()
  const startTime = requestTimings.get(requestId)
  const duration = startTime ? Date.now() - startTime : -1
  requestTimings.delete(requestId)
  
  const statusIcon = result === 'success' ? '✓' : result === 'error' ? '✗' : '↪'
  console.log(`[TRACE ${timestamp}] [${requestId}] ${statusIcon} END ${functionName} (${duration}ms)`, details ? JSON.stringify(details) : '')
}

export function logRequestPending(requestId: string, functionName: string, pendingSince: number): void {
  const timestamp = new Date().toISOString()
  const pendingDuration = Date.now() - pendingSince
  console.log(`[TRACE ${timestamp}] [${requestId}] ⏳ PENDING ${functionName} (${pendingDuration}ms elapsed)`)
}

export function logDbQueryStart(requestId: string, queryName: string, table: string, details?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString()
  console.log(`[TRACE ${timestamp}] [${requestId}]   🗄️ DB START ${queryName} on ${table}`, details ? JSON.stringify(details) : '')
}

export function logDbQueryEnd(requestId: string, queryName: string, table: string, duration: number, rowCount?: number, error?: string): void {
  const timestamp = new Date().toISOString()
  const status = error ? '✗' : '✓'
  console.log(`[TRACE ${timestamp}] [${requestId}]   🗄️ DB END ${queryName} on ${table} (${duration}ms)${rowCount !== undefined ? ` rows=${rowCount}` : ''}${error ? ` error=${error}` : ''}`)
}

export function logMiddleware(requestId: string, path: string, action: 'allow' | 'redirect' | 'block', details?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString()
  console.log(`[TRACE ${timestamp}] [${requestId}] 🛡️ MIDDLEWARE ${action.toUpperCase()} ${path}`, details ? JSON.stringify(details) : '')
}

export function logAuthCheck(requestId: string, checkName: string, result: 'pass' | 'fail', details?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString()
  const icon = result === 'pass' ? '🔓' : '🔒'
  console.log(`[TRACE ${timestamp}] [${requestId}] ${icon} AUTH ${checkName} ${result.toUpperCase()}`, details ? JSON.stringify(details) : '')
}

// Helper to wrap async functions with timing
export async function withTiming<T>(
  requestId: string,
  functionName: string,
  fn: () => Promise<T>
): Promise<T> {
  logRequestStart(requestId, functionName)
  const startTime = Date.now()
  
  try {
    const result = await fn()
    logRequestEnd(requestId, functionName, 'success')
    return result
  } catch (error) {
    logRequestEnd(requestId, functionName, 'error', { 
      error: error instanceof Error ? error.message : String(error) 
    })
    throw error
  }
}

// Helper to wrap database queries with timing
export async function withDbTiming<T>(
  requestId: string,
  queryName: string,
  table: string,
  queryFn: () => Promise<{ data: T | null; error: { message: string } | null; count?: number | null }>
): Promise<{ data: T | null; error: { message: string } | null; count?: number | null }> {
  logDbQueryStart(requestId, queryName, table)
  const startTime = Date.now()
  
  try {
    const result = await queryFn()
    const duration = Date.now() - startTime
    logDbQueryEnd(requestId, queryName, table, duration, result.count ?? undefined, result.error?.message)
    return result
  } catch (error) {
    const duration = Date.now() - startTime
    logDbQueryEnd(requestId, queryName, table, duration, undefined, error instanceof Error ? error.message : String(error))
    throw error
  }
}
