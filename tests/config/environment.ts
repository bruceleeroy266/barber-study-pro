/**
 * ASCYN PRO - Test Environment Configuration
 * 
 * Centralized environment configuration for all tests.
 * Uses environment variables with sensible defaults for local development.
 */

export const ENV = {
  // Base URL for the application
  BASE_URL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001',
  
  // Test user credentials (from environment variables)
  TEST_STUDENT_EMAIL: process.env.TEST_STUDENT_EMAIL || 'student@ascyn-smoke.test',
  TEST_STUDENT_PASSWORD: process.env.TEST_STUDENT_PASSWORD || 'SmokeTest123!',
  TEST_INSTRUCTOR_EMAIL: process.env.TEST_INSTRUCTOR_EMAIL || 'instructor@ascyn-smoke.test',
  TEST_INSTRUCTOR_PASSWORD: process.env.TEST_INSTRUCTOR_PASSWORD || 'SmokeTest123!',
  TEST_ADMIN_EMAIL: process.env.TEST_ADMIN_EMAIL || 'admin@ascyn-smoke.test',
  TEST_ADMIN_PASSWORD: process.env.TEST_ADMIN_PASSWORD || 'SmokeTest123!',
  
  // Test configuration
  CI: process.env.CI === 'true',
  HEADLESS: process.env.HEADLESS !== 'false',
  SLOW_MO: parseInt(process.env.SLOW_MO || '0', 10),
  
  // Timeouts
  DEFAULT_TIMEOUT: parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10),
  NAVIGATION_TIMEOUT: parseInt(process.env.NAVIGATION_TIMEOUT || '30000', 10),
  ACTION_TIMEOUT: parseInt(process.env.ACTION_TIMEOUT || '10000', 10),
} as const;

export type Environment = typeof ENV;
