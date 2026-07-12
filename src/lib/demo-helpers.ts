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

/**
 * Safe diagnostic that explains why Supabase appears unconfigured.
 * Never logs the actual URL or key values.
 */
export function diagnoseSupabaseConfig(context = 'unknown'): {
  configured: boolean
  urlPresent: boolean
  keyPresent: boolean
  urlLength: number
  keyLength: number
  urlValidScheme: boolean
  urlNonPlaceholder: boolean
  keyLongEnough: boolean
} {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const url = (rawUrl ?? '').trim()
  const key = (rawKey ?? '').trim()

  const urlPresent = url.length > 0
  const keyPresent = key.length > 0

  const urlValidScheme =
    url.startsWith('https://') ||
    url.startsWith('http://127.0.0.1:54321') ||
    url.startsWith('http://localhost:54321')

  const urlNonPlaceholder =
    !url.includes('your-project') && !url.includes('example.supabase.co')

  const keyLongEnough = key.length > 20

  const result = {
    configured: urlPresent && keyPresent && urlValidScheme && urlNonPlaceholder && keyLongEnough,
    urlPresent,
    keyPresent,
    urlLength: url.length,
    keyLength: key.length,
    urlValidScheme,
    urlNonPlaceholder,
    keyLongEnough,
  }

  // Diagnostic logging (no secrets exposed)
  console.log(`[ASCYN PRO] Supabase diagnostic [${context}]`, {
    nodeEnv: process.env.NODE_ENV,
    urlPresent: result.urlPresent,
    keyPresent: result.keyPresent,
    urlLength: result.urlLength,
    keyLength: result.keyLength,
    urlFirstChars: url.slice(0, 12),
    keyFirstChars: key.slice(0, 8),
    urlValidScheme: result.urlValidScheme,
    urlNonPlaceholder: result.urlNonPlaceholder,
    keyLongEnough: result.keyLongEnough,
    configured: result.configured,
  })

  return result
}

export function isSupabaseConfigured(): boolean {
  return diagnoseSupabaseConfig().configured
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
