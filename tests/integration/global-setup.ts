/**
 * Global Setup for Integration Tests
 * 
 * Runs before all integration tests to ensure the environment is ready.
 */

import { assertTestEnvironment } from './setup/production-guard'
import { setupTestEnvironment, cleanupTestEnvironment } from './setup/db-helpers'

export async function setup() {
  console.log('[GlobalSetup] Starting integration test setup...')
  
  // Verify production safety
  assertTestEnvironment()
  
  // Setup test environment
  await setupTestEnvironment()
  
  console.log('[GlobalSetup] Integration test setup complete')
}

export async function teardown() {
  console.log('[GlobalTeardown] Starting integration test cleanup...')
  
  // Cleanup test environment
  await cleanupTestEnvironment()
  
  console.log('[GlobalTeardown] Integration test cleanup complete')
}
