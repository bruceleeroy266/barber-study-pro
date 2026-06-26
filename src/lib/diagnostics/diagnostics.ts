import { createClient } from '@/lib/supabase-server'
import { isExplicitDemoMode, isSupabaseConfigured } from '@/lib/demo-helpers'

export type DiagnosticStatus = 'pass' | 'fail' | 'warning' | 'info'

export interface DiagnosticCheck {
  name: string
  category: string
  status: DiagnosticStatus
  message: string
  detail?: string
}

export interface DiagnosticReport {
  generatedAt: string
  overallStatus: DiagnosticStatus
  checks: DiagnosticCheck[]
}

const REQUIRED_TABLES = [
  'profiles',
  'schools',
  'school_settings',
  'security_logs',
  'notifications',
  'feature_flags',
  'background_jobs',
  'maintenance_mode',
  'backup_status',
]

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
]

/**
 * Phase 13D — Enterprise diagnostics module.
 *
 * Verifies critical runtime dependencies: database connectivity, required
 * tables, environment variables, security logger, notification service,
 * feature flags, and demo configuration.
 */
export async function runDiagnostics(): Promise<DiagnosticReport> {
  const checks: DiagnosticCheck[] = []
  const generatedAt = new Date().toISOString()

  // Environment variables
  for (const envVar of REQUIRED_ENV_VARS) {
    const value = process.env[envVar]
    checks.push({
      name: envVar,
      category: 'Environment',
      status: value && value.length > 0 ? 'pass' : 'fail',
      message: value ? 'Environment variable is set.' : 'Environment variable is missing.',
      detail: value ? undefined : `Set ${envVar} in your environment or .env.local file.`,
    })
  }

  // Demo configuration
  const demoMode = isExplicitDemoMode()
  const supabaseConfigured = isSupabaseConfigured()
  checks.push({
    name: 'Demo Mode',
    category: 'Configuration',
    status: demoMode ? 'warning' : 'info',
    message: demoMode
      ? 'Demo mode is explicitly enabled.'
      : 'Demo mode is not enabled.',
    detail: demoMode && supabaseConfigured
      ? 'Warning: demo mode is enabled while Supabase is configured. Real authentication is enforced.'
      : undefined,
  })

  checks.push({
    name: 'Supabase Configuration',
    category: 'Configuration',
    status: supabaseConfigured ? 'pass' : demoMode ? 'warning' : 'fail',
    message: supabaseConfigured
      ? 'Supabase URL and key appear configured.'
      : demoMode
      ? 'Supabase is not configured, but demo mode is active.'
      : 'Supabase is not configured.',
    detail: supabaseConfigured
      ? undefined
      : 'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
  })

  // Database connectivity and tables
  const supabase = await createClient()

  try {
    const { error } = await supabase.from('profiles').select('id', { count: 'exact', head: true })
    checks.push({
      name: 'Database Connectivity',
      category: 'Database',
      status: error ? 'fail' : 'pass',
      message: error ? `Failed to connect: ${error.message}` : 'Database connection successful.',
    })
  } catch (err) {
    checks.push({
      name: 'Database Connectivity',
      category: 'Database',
      status: 'fail',
      message: 'Database connectivity check threw an exception.',
      detail: err instanceof Error ? err.message : String(err),
    })
  }

  for (const table of REQUIRED_TABLES) {
    const check = await checkTableExists(supabase, table)
    checks.push(check)
  }

  // Security logger
  const securityLoggerCheck = await checkSecurityLogger(supabase)
  checks.push(securityLoggerCheck)

  // Overall status
  const hasFailure = checks.some((c) => c.status === 'fail')
  const hasWarning = checks.some((c) => c.status === 'warning')
  const overallStatus: DiagnosticStatus = hasFailure ? 'fail' : hasWarning ? 'warning' : 'pass'

  return {
    generatedAt,
    overallStatus,
    checks,
  }
}

async function checkTableExists(
  supabase: Awaited<ReturnType<typeof createClient>>,
  tableName: string
): Promise<DiagnosticCheck> {
  try {
    const { error } = await supabase.from(tableName).select('*', { count: 'exact', head: true })
    return {
      name: `Table: ${tableName}`,
      category: 'Database',
      status: error ? 'fail' : 'pass',
      message: error ? `Table check failed: ${error.message}` : 'Table exists and is queryable.',
    }
  } catch (err) {
    return {
      name: `Table: ${tableName}`,
      category: 'Database',
      status: 'fail',
      message: `Exception checking table ${tableName}.`,
      detail: err instanceof Error ? err.message : String(err),
    }
  }
}

async function checkSecurityLogger(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<DiagnosticCheck> {
  try {
    const { error } = await supabase.from('security_logs').select('id', { count: 'exact', head: true })
    return {
      name: 'Security Logger',
      category: 'Security',
      status: error ? 'warning' : 'pass',
      message: error
        ? 'Security logger table is not available; events will be console-only.'
        : 'Security logger table is available.',
      detail: error?.message,
    }
  } catch (err) {
    return {
      name: 'Security Logger',
      category: 'Security',
      status: 'warning',
      message: 'Security logger check threw an exception.',
      detail: err instanceof Error ? err.message : String(err),
    }
  }
}
