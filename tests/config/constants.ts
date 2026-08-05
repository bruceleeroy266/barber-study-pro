/**
 * ASCYN PRO - Test Constants
 * 
 * Shared constants used across all tests.
 */

// Application Routes
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  RESET_PASSWORD: '/reset-password',
  UPDATE_PASSWORD: '/update-password',
  
  // Student routes
  DASHBOARD: '/dashboard',
  CHAPTERS: '/dashboard/chapters',
  CHAPTER: (id: number) => `/dashboard/chapters/${id}`,
  CHAPTER_FLASHCARDS: (id: number) => `/dashboard/chapters/${id}/flashcards`,
  CHAPTER_QUIZ: (id: number) => `/dashboard/chapters/${id}/quiz`,
  CHAPTER_REMEDIATION: (id: number) => `/dashboard/chapters/${id}/remediation`,
  GRADES: '/dashboard/grades',
  PROGRESS: '/dashboard/progress',
  PROFILE: '/dashboard/profile',
  MESSAGES: '/dashboard/messages',
  COMPLIANCE: '/dashboard/compliance',
  MISSED_QUESTIONS: '/dashboard/missed-questions',
  
  // Instructor routes
  INSTRUCTOR: '/instructor',
  INSTRUCTOR_ASSESSMENTS: '/instructor/assessments',
  INSTRUCTOR_ATTENDANCE: '/instructor/attendance',
  INSTRUCTOR_COMPLIANCE: '/instructor/compliance',
  INSTRUCTOR_GRADEBOOK: '/instructor/gradebook',
  INSTRUCTOR_MESSAGES: '/instructor/messages',
  INSTRUCTOR_RUBRICS: '/instructor/rubrics',
  INSTRUCTOR_STUDENT: (id: string) => `/instructor/student/${id}`,
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_SCHOOL: '/admin/school',
  ADMIN_AUDIT: '/admin/audit',
  ADMIN_HEALTH: '/admin/health',
  ADMIN_MAINTENANCE: '/admin/maintenance',
} as const;

// Chapter Information
export const CHAPTERS = {
  TOTAL: 21,
  RECOVERED: [16, 17, 18, 19, 20, 21],
  WITH_REMEDIATION: [19, 20, 21],
  TITLES: {
    1: 'History of Barbering',
    2: 'Life Skills',
    3: 'Professional Image',
    4: 'Infection Control',
    5: 'Anatomy and Physiology',
    6: 'Chemistry',
    7: 'Electricity and Light Therapy',
    8: 'Properties of the Hair and Scalp',
    9: 'Treatment of the Hair and Scalp',
    10: 'Shaving and Facial Hair Design',
    11: 'Men\'s Haircutting and Styling',
    12: 'Men\'s Hair Replacement',
    13: 'Women\'s Haircutting and Styling',
    14: 'Chemical Texture Services',
    15: 'Haircoloring and Lightening',
    16: 'Women\'s Haircutting & Styling',
    17: 'Chemical Texture Services',
    18: 'Haircoloring and Lightening',
    19: 'Preparing for Licensure and Employment',
    20: 'Working Behind the Chair',
    21: 'The Business of Barbering',
  },
} as const;

// User Roles
export const ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
} as const;

// Test Data
export const TEST_DATA = {
  INVALID_EMAIL: 'invalid@test.com',
  INVALID_PASSWORD: 'wrongpassword',
  LONG_TEXT: 'A'.repeat(1000),
  SPECIAL_CHARS: '!@#$%^&*()_+-=[]{}|;:,.<>?',
} as const;

// Timeouts (in milliseconds)
export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
  EXTRA_LONG: 60000,
} as const;

// Viewport Sizes
export const VIEWPORTS = {
  MOBILE: { width: 375, height: 667 },
  TABLET: { width: 768, height: 1024 },
  DESKTOP: { width: 1280, height: 720 },
  LARGE_DESKTOP: { width: 1920, height: 1080 },
} as const;
