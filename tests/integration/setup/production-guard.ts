/**
 * Production Safety Guard for Integration Tests
 * 
 * This module prevents accidental execution of integration tests against
 * production Supabase instances. It MUST be imported and called at the
 * top of every integration test file.
 * 
 * Usage:
 *   import { assertTestEnvironment } from '../setup/production-guard'
 *   
 *   beforeAll(() => {
 *     assertTestEnvironment()
 *   })
 */

const PRODUCTION_URL_PATTERNS = [
  /supabase\.co/i,
  /ascynpro\.com/i,
  /hgyznydxepjsvbjsirpv/i, // Production project ref
]

const LOCAL_URL_PATTERNS = [
  /^https?:\/\/127\.0\.0\.1:/,
  /^https?:\/\/localhost:/,
]

export class ProductionSafetyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProductionSafetyError'
  }
}

/**
 * Asserts that the current environment is a safe test environment.
 * Throws ProductionSafetyError if production indicators are detected.
 */
export function assertTestEnvironment(): void {
  // Check 1: ASCYN_TEST_ENVIRONMENT must be explicitly set
  const testEnv = process.env.ASCYN_TEST_ENVIRONMENT
  if (testEnv !== 'true') {
    throw new ProductionSafetyError(
      `ASCYN_TEST_ENVIRONMENT must be set to "true" for integration tests. ` +
      `Current value: "${testEnv}". ` +
      `This guard prevents accidental execution against production.`
    )
  }

  // Check 2: Supabase URL must be local
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    throw new ProductionSafetyError(
      'NEXT_PUBLIC_SUPABASE_URL is not set. Integration tests require a local Supabase URL.'
    )
  }

  // Check for production URL patterns
  for (const pattern of PRODUCTION_URL_PATTERNS) {
    if (pattern.test(supabaseUrl)) {
      throw new ProductionSafetyError(
        `Production URL pattern detected in NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}. ` +
        `Integration tests MUST use local Supabase (127.0.0.1 or localhost).`
      )
    }
  }

  // Verify local URL pattern
  const isLocal = LOCAL_URL_PATTERNS.some(pattern => pattern.test(supabaseUrl))
  if (!isLocal) {
    throw new ProductionSafetyError(
      `NEXT_PUBLIC_SUPABASE_URL does not appear to be a local URL: ${supabaseUrl}. ` +
      `Expected 127.0.0.1 or localhost.`
    )
  }

  // Check 3: Service role key must be local (starts with sb_secret_ for local)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new ProductionSafetyError(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Integration tests require a local service role key.'
    )
  }

  // Local service role keys start with sb_secret_
  // Production keys are JWTs (eyJ...)
  if (serviceRoleKey.startsWith('eyJ')) {
    throw new ProductionSafetyError(
      'Production service role key detected (JWT format). ' +
      'Integration tests MUST use local Supabase keys (sb_secret_*).'
    )
  }

  if (!serviceRoleKey.startsWith('sb_secret_')) {
    console.warn(
      'Warning: Service role key does not match expected local format (sb_secret_*). ' +
      'Ensure you are using local Supabase credentials.'
    )
  }

  // Check 4: Anon key must be local
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!anonKey) {
    throw new ProductionSafetyError(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Integration tests require a local anon key.'
    )
  }

  if (anonKey.startsWith('eyJ')) {
    throw new ProductionSafetyError(
      'Production anon key detected (JWT format). ' +
      'Integration tests MUST use local Supabase keys (sb_publishable_*).'
    )
  }

  // Check 5: Database URL must be local
  const dbUrl = process.env.TEST_DATABASE_URL
  if (dbUrl) {
    if (dbUrl.includes('supabase.co') || dbUrl.includes('pooler.supabase.com')) {
      throw new ProductionSafetyError(
        `Production database URL detected: ${dbUrl}. ` +
        `Integration tests MUST use local database (127.0.0.1 or localhost).`
      )
    }
  }

  console.log('[ProductionGuard] ✓ Test environment verified as safe (local Supabase)')
}

/**
 * Asserts that the current environment is NOT production.
 * This is a lighter check for non-database operations.
 */
export function assertNotProduction(): void {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  
  for (const pattern of PRODUCTION_URL_PATTERNS) {
    if (pattern.test(supabaseUrl)) {
      throw new ProductionSafetyError(
        `Production environment detected. This operation is not allowed.`
      )
    }
  }
}

/**
 * Returns true if the current environment appears to be production.
 * Use for conditional logic, not for guards.
 */
export function isProductionEnvironment(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  return PRODUCTION_URL_PATTERNS.some(pattern => pattern.test(supabaseUrl))
}

/**
 * Returns true if the current environment is a valid test environment.
 */
export function isTestEnvironment(): boolean {
  try {
    assertTestEnvironment()
    return true
  } catch {
    return false
  }
}
