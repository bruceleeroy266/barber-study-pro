/**
 * ASCYN PRO - Test Fixtures
 * 
 * Test data and fixtures for browser automation tests.
 * These will be populated in Phase 3 with actual test credentials.
 */

export const TEST_USERS = {
  student: {
    email: 'student@ascyn-smoke.test',
    password: 'SmokeTest123!',
    role: 'student',
  },
  instructor: {
    email: 'instructor@ascyn-smoke.test',
    password: 'SmokeTest123!',
    role: 'instructor',
  },
  admin: {
    email: 'admin@ascyn-smoke.test',
    password: 'SmokeTest123!',
    role: 'admin',
  },
  invalid: {
    email: 'invalid@test.com',
    password: 'wrongpassword',
  },
} as const;

export const TEST_URLS = {
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  chapters: '/dashboard/chapters',
  instructor: '/instructor',
  admin: '/admin',
} as const;

export const CHAPTERS = Array.from({ length: 21 }, (_, i) => ({
  number: i + 1,
  url: `/dashboard/chapters/${i + 1}`,
  flashcardsUrl: `/dashboard/chapters/${i + 1}/flashcards`,
  quizUrl: `/dashboard/chapters/${i + 1}/quiz`,
}));

export const RECOVERED_CHAPTERS = [16, 17, 18, 19, 20, 21] as const;

export const CHAPTERS_WITH_REMEDIATION = [19, 20, 21];
