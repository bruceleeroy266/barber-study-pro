import { defineConfig, devices } from '@playwright/test';

/**
 * ASCYN PRO - Playwright Configuration
 * 
 * Production-ready browser automation configuration.
 * Supports: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari, iPad
 * 
 * Features:
 * - TypeScript support
 * - Headless/headed execution
 * - Screenshots on failure
 * - Video recording
 * - Trace recording
 * - HTML reporting
 * - Optimized for stability and performance
 */

export default defineConfig({
  // Test directory
  testDir: './tests/e2e',
  
  // Output directories
  outputDir: './test-results',
  
  // Global timeout for each test (45 seconds - increased for stability)
  timeout: 45 * 1000,
  
  // Expect timeout for assertions (10 seconds - increased for stability)
  expect: {
    timeout: 10000,
  },
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 1,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : 4,
  
  // Reporter configuration
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report',
      open: 'never',
    }],
    ['json', { 
      outputFile: 'test-results/results.json' 
    }],
    ['list'],
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Capture screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
    
    // Ignore HTTPS errors (for local development)
    ignoreHTTPSErrors: true,
    
    // Action timeout (15 seconds - increased for stability)
    actionTimeout: 15 * 1000,
    
    // Navigation timeout (45 seconds - increased for stability)
    navigationTimeout: 45 * 1000,
  },

  // Configure projects for major browsers and devices
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Chromium-specific launch options
        launchOptions: {
          args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process'],
        },
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        // Firefox-specific launch options
        launchOptions: {
          firefoxUserPrefs: {
            'dom.disable_beforeunload': true,
          },
        },
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
      },
    },
    
    // Mobile devices
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'],
      },
    },
    
    // Tablet
    {
      name: 'tablet',
      use: { 
        ...devices['iPad Pro'],
      },
    },
  ],

  // Run local dev server before starting tests
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
