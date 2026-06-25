/**
 * Phase 13C.1 — Demo mode helpers.
 *
 * Explicit demo mode and unconfigured-Supabase fallback are now SEPARATE
 * concepts:
 *
 * - Explicit demo mode: NEXT_PUBLIC_DEMO_MODE === 'true'. This intentionally
 *   enables demo data, auth bypass, and fake persistence for sales/development.
 *
 * - Unconfigured Supabase: missing/placeholder env vars. This is an error
 *   state. It must NOT silently serve demo data to real users.
 */

export function isExplicitDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  return (
    url.startsWith('https://') &&
    !url.includes('your-project') &&
    !url.includes('example.supabase.co') &&
    key.length > 20
  )
}

/**
 * Legacy helper kept for compatibility. After Phase 13C.1 it returns true ONLY
 * when explicit demo mode is enabled. Unconfigured Supabase is no longer
 * treated as a demo fallback.
 */
export function isDemoFallbackEnabled(): boolean {
  return isExplicitDemoMode()
}

/**
 * True when the app should run in a safe local demo environment: explicit demo
 * mode AND no real Supabase project configured. In this state auth bypass and
 * in-memory demo data are acceptable.
 */
export function isSafeDemoEnvironment(): boolean {
  return isExplicitDemoMode() && !isSupabaseConfigured()
}
