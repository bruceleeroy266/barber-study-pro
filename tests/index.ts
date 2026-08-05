/**
 * ASCYN PRO - Test Framework Index
 * 
 * Central export file for all test framework components.
 * Import from this file to access the entire framework.
 */

// Configuration
export { ENV } from './config/environment';
export { ROUTES, CHAPTERS, ROLES, TEST_DATA, TIMEOUTS, VIEWPORTS } from './config/constants';

// Fixtures
export { test, expect, TestDataManager, TestEnvironment } from './fixtures/test-fixtures';

// Page Objects
export { BasePage } from './pages/base-page';
export { LoginPage } from './pages/login-page';
export { DashboardPage } from './pages/dashboard-page';
export { NavigationPage } from './pages/navigation-page';
export { ChapterPage } from './pages/chapter-page';
export { FlashcardsPage } from './pages/flashcards-page';
export { QuizPage } from './pages/quiz-page';

// Utilities
export {
  navigateTo,
  navigateToRoute,
  waitForPageLoad,
  clearBrowserData,
  setViewport,
  takeScreenshot,
  getPerformanceMetrics,
  elementExists,
  waitForElement,
  scrollIntoView,
  getConsoleLogs,
  getConsoleErrors,
  getFailedRequests,
  createContext,
} from './utilities/browser';

export {
  assertElementWithText,
  assertNoConsoleErrors,
  assertNoFailedRequests,
  assertNoHorizontalOverflow,
  assertPageLoadsWithin,
  assertElementAttribute,
  assertFieldValue,
  assertButtonEnabled,
  assertButtonDisabled,
  assertLinkNavigatesTo,
} from './utilities/assertions';

export {
  getTestUser,
  login,
  loginAs,
  loginAsStudent,
  loginAsInstructor,
  loginAsAdmin,
  logout,
  isLoggedIn,
  ensureLoggedOut,
  signup,
  resetPassword,
  getCurrentUserRole,
} from './utilities/auth';

// Types
export type { TestUser } from './utilities/auth';
