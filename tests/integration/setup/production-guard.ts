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
function requireLoopbackUrl(name: string, value: string | undefined, protocols: string[]): URL {
  if (!value) {
    throw new ProductionSafetyError(`${name} is required for disposable local integration tests.`)
  }

  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    throw new ProductionSafetyError(`${name} must be a valid local URL.`)
  }

  if (
    !protocols.includes(parsed.protocol) ||
    !['127.0.0.1', 'localhost', '[::1]'].includes(parsed.hostname) ||
    !parsed.port ||
    parsed.search ||
    parsed.hash
  ) {
    throw new ProductionSafetyError(
      `${name} must use an explicit loopback host and port, with an approved protocol and no query or fragment.`
    )
  }
  return parsed
}

/**
 * Validate every connection destination and key format before any test
 * service client is created or fixture mutation is attempted.
 *
 * This is a static safety gate, not proof that local services are healthy or
 * that the database has been seeded. Those require separate certification.
 */
export function assertTestEnvironment(): void {
  if (process.env.ASCYN_TEST_ENVIRONMENT !== 'true') {
    throw new ProductionSafetyError('ASCYN_TEST_ENVIRONMENT=true is required for integration tests.')
  }

  const api = requireLoopbackUrl(
    'NEXT_PUBLIC_SUPABASE_URL',
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    ['http:']
  )
  const db = requireLoopbackUrl(
    'TEST_DATABASE_URL',
    process.env.TEST_DATABASE_URL,
    ['postgres:', 'postgresql:']
  )

  // A remote database is never permissible, even if the API points to localhost.
  if (api.hostname !== db.hostname && !(
    ['localhost', '127.0.0.1', '[::1]'].includes(api.hostname) &&
    ['localhost', '127.0.0.1', '[::1]'].includes(db.hostname)
  )) {
    throw new ProductionSafetyError('Supabase API and database hosts must both be loopback.')
  }
  if (api.username || api.password) {
    throw new ProductionSafetyError('Local Supabase API URL must not contain credentials.')
  }
  if (!db.username || !db.pathname || db.pathname === '/') {
    throw new ProductionSafetyError('TEST_DATABASE_URL must specify a local database user and name.')
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!serviceKey || !/^sb_secret_[A-Za-z0-9_-]+$/.test(serviceKey)) {
    throw new ProductionSafetyError('Expected local sb_secret_* key. Unrecognized service credentials are prohibited.')
  }
  if (!publishableKey || !/^sb_publishable_[A-Za-z0-9_-]+$/.test(publishableKey)) {
    throw new ProductionSafetyError('Expected local sb_publishable_* key. Unrecognized client credentials are prohibited.')
  }

  console.log('[ProductionGuard] Local-only configuration validated; runner identity still requires independent verification.')
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
