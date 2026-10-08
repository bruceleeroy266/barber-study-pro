import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL || ''
if (process.env.ASCYN_PRODUCTION_CERTIFICATION !== 'true' || baseURL !== 'https://ascynpro.com') {
  throw new Error('Production navigation certification requires ASCYN_PRODUCTION_CERTIFICATION=true and exact https://ascynpro.com')
}

export default defineConfig({
  testDir: './tests/e2e/production',
  timeout: 60_000,
  expect: { timeout: 12_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'test-results/production-navigation.json' }]],
  outputDir: 'test-results/production',
  use: {
    ...devices['Desktop Chrome'],
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
