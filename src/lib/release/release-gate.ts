export const RELEASE_PIPELINE_CONTRACT = [
  'CODE TESTS',
  'SECURITY TESTS',
  'BUILD',
  'DEPLOY',
  'PRODUCTION BROWSER MATRIX',
  'PRODUCTION ACCOUNT-INTEGRITY GATE',
  'PRODUCTION AUTHENTICATION SMOKE GATE',
  'PRODUCTION AUTHENTICATION LIFECYCLE GATE',
  'PRODUCTION AUTH REDIRECT GATE',
  'FINAL RELEASE GO',
] as const

export const RELEASE_GATE_FAILURE_POLICY = 'FAIL_CLOSED'

/**
 * Complete Authentication Lifecycle Requirements
 * 
 * Every production release MUST verify the complete user lifecycle
 * for all applicable roles before receiving GO.
 */
export const AUTHENTICATION_LIFECYCLE_REQUIREMENTS = [
  'ACCOUNT INTEGRITY',
  'AUTHENTICATION SMOKE',
  'LOGIN',
  'PROTECTED ACCESS',
  'LOGOUT',
  'POST-LOGOUT DENIAL',
  'RELOGIN',
  'INVITATION/SETUP',
  'PASSWORD RECOVERY',
] as const

/**
 * Required production smoke roles for lifecycle testing
 */
export const PRODUCTION_SMOKE_ROLES = [
  'student',
  'instructor',
  'school_admin',
  'admin',
] as const

export type AuthenticationLifecycleRequirement = typeof AUTHENTICATION_LIFECYCLE_REQUIREMENTS[number]
export type ProductionSmokeRole = typeof PRODUCTION_SMOKE_ROLES[number]

/**
 * Production Auth Redirect Requirements
 * 
 * Every production release MUST verify that authentication redirects
 * NEVER resolve to localhost, 127.0.0.1, ::1, or development-only URLs.
 */
export const PRODUCTION_AUTH_REDIRECT_REQUIREMENTS = [
  'SITE URL IS ASCYNPRO.COM',
  'NO LOCALHOST REDIRECTS',
  'NO 127.0.0.1 REDIRECTS',
  'NO ::1 REDIRECTS',
  'HTTPS ONLY',
  'ALL AUTH EMAIL TYPES COVERED',
] as const

export type ProductionAuthRedirectRequirement = typeof PRODUCTION_AUTH_REDIRECT_REQUIREMENTS[number]
