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
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      'tests/e2e/**',
      // Integration tests run via vitest.integration.config.ts (sequential,
      // real local Supabase). They must not run under the default config.
      'tests/integration/**',
      // PingOS subsystem tests use node:test runner, not Vitest
      'src/lib/bootstrap/**/*.test.ts',
      'src/lib/execution/**/*.test.ts',
      'src/lib/memory-manager/**/*.test.ts',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
