/**
 * Test Environment Configuration
 * 
 * Loads and validates environment variables for integration tests.
 * Ensures all required variables are present and valid.
 */

import { assertTestEnvironment } from './production-guard'

export interface TestEnvironment {
  supabaseUrl: string
  supabaseAnonKey: string
  supabaseServiceRoleKey: string
  databaseUrl: string
  siteUrl: string
  mailpitUrl: string
  testActors: {
    platformAdmin: { email: string; password: string }
    schoolAdminA: { email: string; password: string }
    instructorA: { email: string; password: string }
    studentA: { email: string; password: string }
    schoolAdminB: { email: string; password: string }
    instructorB: { email: string; password: string }
    studentB: { email: string; password: string }
  }
  testSchools: {
    schoolA: { id: string; name: string; slug: string }
    schoolB: { id: string; name: string; slug: string }
  }
}

let cachedEnv: TestEnvironment | null = null

/**
 * Loads and validates the test environment.
 * Throws if any required variable is missing or invalid.
 */
export function getTestEnvironment(): TestEnvironment {
  if (cachedEnv) {
    return cachedEnv
  }

  // Verify production safety first
  assertTestEnvironment()

  const required = (name: string): string => {
    const value = process.env[name]
    if (!value) {
      throw new Error(`Required environment variable ${name} is not set`)
    }
    return value
  }

  cachedEnv = {
    supabaseUrl: required('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseAnonKey: required('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    supabaseServiceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),
    databaseUrl: required('TEST_DATABASE_URL'),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    mailpitUrl: process.env.TEST_MAILPIT_URL || 'http://127.0.0.1:54324',
    testActors: {
      platformAdmin: {
        email: required('TEST_PLATFORM_ADMIN_EMAIL'),
        password: required('TEST_PLATFORM_ADMIN_PASSWORD'),
      },
      schoolAdminA: {
        email: required('TEST_SCHOOL_ADMIN_A_EMAIL'),
        password: required('TEST_SCHOOL_ADMIN_A_PASSWORD'),
      },
      instructorA: {
        email: required('TEST_INSTRUCTOR_A_EMAIL'),
        password: required('TEST_INSTRUCTOR_A_PASSWORD'),
      },
      studentA: {
        email: required('TEST_STUDENT_A_EMAIL'),
        password: required('TEST_STUDENT_A_PASSWORD'),
      },
      schoolAdminB: {
        email: required('TEST_SCHOOL_ADMIN_B_EMAIL'),
        password: required('TEST_SCHOOL_ADMIN_B_PASSWORD'),
      },
      instructorB: {
        email: required('TEST_INSTRUCTOR_B_EMAIL'),
        password: required('TEST_INSTRUCTOR_B_PASSWORD'),
      },
      studentB: {
        email: required('TEST_STUDENT_B_EMAIL'),
        password: required('TEST_STUDENT_B_PASSWORD'),
      },
    },
    testSchools: {
      schoolA: {
        id: required('TEST_SCHOOL_A_ID'),
        name: required('TEST_SCHOOL_A_NAME'),
        slug: required('TEST_SCHOOL_A_SLUG'),
      },
      schoolB: {
        id: required('TEST_SCHOOL_B_ID'),
        name: required('TEST_SCHOOL_B_NAME'),
        slug: required('TEST_SCHOOL_B_SLUG'),
      },
    },
  }

  return cachedEnv
}

/**
 * Clears the cached environment (useful for testing).
 */
export function clearTestEnvironmentCache(): void {
  cachedEnv = null
}
