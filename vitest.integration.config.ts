/**
 * Vitest Configuration for Integration Tests
 * 
 * Integration tests run against a real local Supabase database.
 * They share test actors and database state, so they MUST run sequentially
 * (single file at a time) to avoid race conditions in setup/teardown.
 * 
 * Why sequential execution is required:
 * - All integration test suites share the same test actors (auth users)
 * - Each suite calls setupTestEnvironment() in beforeAll and
 *   cleanupTestEnvironment() in afterAll
 * - Parallel execution causes one suite's cleanup to delete actors
 *   while another suite is still trying to create/use them
 * - Real database constraints (unique emails, FK relationships) make
 *   parallel actor creation/deletion inherently racy
 * 
 * Reliability is more important than test concurrency for these suites.
 */

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import dotenv from 'dotenv'

// Load test environment variables for integration tests
dotenv.config({ path: '.env.test.local' })

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // Sequential execution: integration tests share a real database
    // and must not run concurrently
    fileParallelism: false,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      'tests/e2e/**',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
