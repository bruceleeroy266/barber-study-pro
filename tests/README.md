# ASCYN PRO - Browser Automation Framework

## Overview

This document describes the browser automation framework for ASCYN PRO. The framework is built on Playwright and follows industry best practices for maintainability, reliability, and scalability.

---

## Architecture

### Design Principles

1. **Page Object Model (POM)**: Each page is represented by a class that encapsulates its locators and interactions.
2. **Fixtures**: Reusable test fixtures provide pre-configured browser contexts and authenticated sessions.
3. **Utilities**: Shared functions for common operations (navigation, assertions, authentication).
4. **Configuration**: Centralized environment and constant management.
5. **Type Safety**: Full TypeScript support with strict typing.

### Directory Structure

```
tests/
├── config/                 # Configuration files
│   ├── environment.ts      # Environment variables
│   └── constants.ts        # Shared constants
├── fixtures/               # Test fixtures
│   └── test-fixtures.ts    # Reusable test fixtures
├── pages/                  # Page Object Model
│   ├── base-page.ts        # Base page class
│   ├── login-page.ts       # Login page
│   ├── dashboard-page.ts   # Dashboard page
│   ├── navigation-page.ts  # Navigation component
│   ├── chapter-page.ts     # Chapter page
│   ├── flashcards-page.ts  # Flashcards page
│   └── quiz-page.ts        # Quiz page
├── utilities/              # Utility functions
│   ├── assertions.ts       # Common assertions
│   ├── auth.ts             # Authentication helpers
│   └── browser.ts          # Browser utilities
├── e2e/                    # End-to-end tests
│   ├── smoke.spec.ts       # Smoke tests
│   ├── auth/               # Authentication tests (Phase 4)
│   ├── student/            # Student tests (Phase 4)
│   ├── instructor/         # Instructor tests (Phase 4)
│   ├── admin/              # Admin tests (Phase 4)
│   └── regression/         # Regression tests (Phase 4)
├── screenshots/            # Test screenshots
├── videos/                 # Test videos
├── traces/                 # Test traces
├── reports/                # QA reports
└── index.ts                # Central export file
```

---

## Core Components

### 1. Configuration

#### Environment (`tests/config/environment.ts`)

Centralized environment configuration using environment variables:

```typescript
import { ENV } from './tests';

// Access configuration
const baseUrl = ENV.BASE_URL;
const studentEmail = ENV.TEST_STUDENT_EMAIL;
const isCI = ENV.CI;
```

**Environment Variables:**

| Variable | Default | Description |
|----------|---------|-------------|
| `PLAYWRIGHT_BASE_URL` | `http://localhost:3001` | Application base URL |
| `TEST_STUDENT_EMAIL` | `student@ascyn-smoke.test` | Student test email |
| `TEST_STUDENT_PASSWORD` | `SmokeTest123!` | Student test password |
| `TEST_INSTRUCTOR_EMAIL` | `instructor@ascyn-smoke.test` | Instructor test email |
| `TEST_INSTRUCTOR_PASSWORD` | `SmokeTest123!` | Instructor test password |
| `TEST_ADMIN_EMAIL` | `admin@ascyn-smoke.test` | Admin test email |
| `TEST_ADMIN_PASSWORD` | `SmokeTest123!` | Admin test password |
| `CI` | `false` | Running in CI environment |
| `HEADLESS` | `true` | Run browser in headless mode |
| `SLOW_MO` | `0` | Slow down execution (ms) |

#### Constants (`tests/config/constants.ts`)

Shared constants for routes, chapters, roles, and test data:

```typescript
import { ROUTES, CHAPTERS, ROLES } from './tests';

// Use routes
await page.goto(ROUTES.LOGIN);
await page.goto(ROUTES.CHAPTER(16));

// Access chapter info
console.log(CHAPTERS.TOTAL); // 21
console.log(CHAPTERS.RECOVERED); // [16, 17, 18, 19, 20, 21]
```

---

### 2. Fixtures

#### Test Fixtures (`tests/fixtures/test-fixtures.ts`)

Reusable fixtures for common test scenarios:

```typescript
import { test, expect } from './tests';

// Use authenticated student page
test('student can view dashboard', async ({ studentPage }) => {
  // studentPage is already logged in as a student
  await expect(studentPage.locator('h1')).toBeVisible();
});

// Use authenticated instructor page
test('instructor can view roster', async ({ instructorPage }) => {
  // instructorPage is already logged in as an instructor
  await instructorPage.goto('/instructor');
});

// Use clean page (no auth)
test('login page loads', async ({ cleanPage }) => {
  // cleanPage has no authentication
  await cleanPage.goto('/login');
});
```

**Available Fixtures:**

| Fixture | Description |
|---------|-------------|
| `studentPage` | Page logged in as student |
| `instructorPage` | Page logged in as instructor |
| `adminPage` | Page logged in as admin |
| `cleanContext` | Fresh browser context (no auth) |
| `cleanPage` | Fresh page (no auth) |

---

### 3. Page Object Model

#### Base Page (`tests/pages/base-page.ts`)

Base class for all page objects:

```typescript
import { BasePage } from './tests';

class MyPage extends BasePage {
  constructor(page: Page) {
    super(page, '/my-url');
  }
  
  async myMethod() {
    await this.click('button');
    await this.waitForElement('.result');
  }
}
```

#### Login Page (`tests/pages/login-page.ts`)

```typescript
import { LoginPage } from './tests';

const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login('user@example.com', 'password');
```

#### Dashboard Page (`tests/pages/dashboard-page.ts`)

```typescript
import { DashboardPage } from './tests';

const dashboard = new DashboardPage(page);
await dashboard.goto();
const chapterCount = await dashboard.getChapterCount();
```

#### Chapter Page (`tests/pages/chapter-page.ts`)

```typescript
import { ChapterPage } from './tests';

const chapter = new ChapterPage(page, 16);
await chapter.goto();
const title = await chapter.getChapterTitle();
```

---

### 4. Utilities

#### Assertions (`tests/utilities/assertions.ts`)

```typescript
import { assertNoConsoleErrors, assertNoFailedRequests } from './tests';

// Check for console errors
await assertNoConsoleErrors(page, {
  ignorePatterns: ['favicon', 'analytics'],
});

// Check for failed requests
await assertNoFailedRequests(page, {
  ignorePatterns: ['favicon', 'sockjs'],
});
```

#### Authentication (`tests/utilities/auth.ts`)

```typescript
import { loginAsStudent, loginAsInstructor, logout } from './tests';

// Login as specific role
await loginAsStudent(page);
await loginAsInstructor(page);

// Logout
await logout(page);
```

#### Browser (`tests/utilities/browser.ts`)

```typescript
import { navigateTo, takeScreenshot, getPerformanceMetrics } from './tests';

// Navigate to URL
await navigateTo(page, '/dashboard');

// Take screenshot
await takeScreenshot(page, 'dashboard');

// Get performance metrics
const metrics = await getPerformanceMetrics(page);
```

---

## Writing Tests

### Test Structure

```typescript
import { test, expect } from './tests';
import { LoginPage } from './tests';

test.describe('Feature Name', () => {
  test('should do something', async ({ cleanPage }) => {
    // Arrange
    const loginPage = new LoginPage(cleanPage);
    
    // Act
    await loginPage.goto();
    await loginPage.login('user@example.com', 'password');
    
    // Assert
    await expect(cleanPage).toHaveURL(/.*dashboard/);
  });
});
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Test files | `*.spec.ts` | `login.spec.ts` |
| Test suites | `describe('Feature Name')` | `describe('Authentication')` |
| Test cases | `test('should ...')` | `test('should login successfully')` |
| Page objects | `*-page.ts` | `login-page.ts` |
| Utilities | `*.ts` | `auth.ts` |

### Best Practices

1. **Use Fixtures**: Always use fixtures for authentication
2. **Page Objects**: Use page objects for all page interactions
3. **Assertions**: Use custom assertions for common checks
4. **Waits**: Use Playwright's auto-wait; avoid `waitForTimeout`
5. **Isolation**: Each test should be independent
6. **Cleanup**: Fixtures handle cleanup automatically

---

## Running Tests

### Run All Tests

```bash
npm run test:e2e
```

### Run Specific Test File

```bash
npx playwright test tests/e2e/smoke.spec.ts
```

### Run Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Mobile Tests

```bash
npx playwright test --project=mobile-chrome
npx playwright test --project=mobile-safari
```

### Run with UI Mode

```bash
npm run test:e2e:ui
```

### Debug Tests

```bash
npm run test:e2e:debug
```

### View Report

```bash
npm run test:e2e:report
```

---

## Debugging

### Debug Mode

```bash
npx playwright test --debug
```

### Headed Mode

```bash
npx playwright test --headed
```

### Slow Motion

```bash
SLOW_MO=1000 npx playwright test
```

### Trace Viewer

```bash
npx playwright show-trace test-results/*/trace.zip
```

---

## Reporting

### HTML Report

After running tests, open the HTML report:

```bash
npx playwright show-report
```

### JSON Report

Test results are saved to `test-results/results.json`.

### Screenshots

Screenshots are saved to `test-results/` on failure.

### Videos

Videos are saved to `test-results/` on failure.

---

## CI/CD Integration

### GitHub Actions

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run tests
        run: npm run test:e2e
        env:
          PLAYWRIGHT_BASE_URL: ${{ secrets.STAGING_URL }}
          TEST_STUDENT_EMAIL: ${{ secrets.TEST_STUDENT_EMAIL }}
          TEST_STUDENT_PASSWORD: ${{ secrets.TEST_STUDENT_PASSWORD }}
      
      - name: Upload report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Phase 4 Roadmap

### Authentication Tests (Phase 4a)

- Login with valid credentials
- Login with invalid credentials
- Logout
- Session persistence
- Password reset
- Signup
- Approval workflow

### Student Tests (Phase 4b)

- Dashboard loads
- All 21 chapters load
- Flashcards work
- Quizzes work
- Progress tracking
- Remediation

### Instructor Tests (Phase 4c)

- Dashboard loads
- Student roster
- Student detail
- Analytics
- Reports

### Admin Tests (Phase 4d)

- User management
- School management
- Approval workflow
- Disable/enable users

### Regression Tests (Phase 4e)

- Full regression suite
- Cross-browser testing
- Mobile testing
- Performance testing

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Tests timeout | Increase timeout in config |
| Element not found | Check selector, use `data-testid` |
| Flaky tests | Use auto-wait, avoid manual waits |
| Browser not found | Run `npx playwright install` |
| Port already in use | Kill process on port 3001 |

### Getting Help

1. Check the [Playwright documentation](https://playwright.dev)
2. Review test logs in `test-results/`
3. Run with `--debug` flag
4. Contact the development team

---

## Maintenance

### Adding New Tests

1. Create test file in appropriate directory
2. Import from `tests/index.ts`
3. Use fixtures and page objects
4. Follow naming conventions
5. Add to appropriate test suite

### Updating Page Objects

1. Update locators in page object
2. Add new methods as needed
3. Keep page objects focused on single page
4. Inherit from `BasePage`

### Updating Fixtures

1. Add new fixture to `test-fixtures.ts`
2. Document fixture purpose
3. Ensure proper cleanup
4. Use environment variables for credentials

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-07-27 | Initial framework (Phase 3) |

---

**Last Updated:** 2026-07-27  
**Maintained By:** ASCYN PRO Development Team
