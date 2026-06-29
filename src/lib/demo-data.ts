// Demo data for soft launch without Supabase
// This provides safe mock data when NEXT_PUBLIC_DEMO_MODE=true

import { Chapter, Flashcard, Quiz, QuizQuestion, QuizAttempt, StudentProgress, Profile, InstructorNote, HourLog, AttendanceRecord, InstructorAttendanceNote, MessageThread, Message, Notification, Announcement, NotificationPriority, GradeCategory, Grade, AssessmentRubric, Assessment, GradeHistory, SchoolConfiguration, AcademicProgram, AttendancePolicy, HoursPolicy, GradebookConfig, AssessmentDefaults, MessagingPreferences, SchoolNotificationSetting, RolePermission } from '@/types'
import { chapterFlashcards as realFlashcards } from './flashcards-data'
import { batch1Flashcards, batch4Flashcards } from './orphaned-flashcards'
import { allQuizQuestions } from './quiz-data'

export const demoUser = {
  id: 'demo-user',
  email: 'demo@barberstudypro.test',
  role: 'admin' as const,
}

export const demoSchool = {
  id: 'demo-school',
  name: 'Demo Barber Academy',
  created_by: 'demo-instructor',
  created_at: '2026-01-01T00:00:00Z',
}

export const demoInstructorProfile: Profile = {
  id: 'demo-instructor',
  email: 'instructor@barberstudypro.test',
  full_name: 'Demo Instructor',
  role: 'instructor',
  school_id: 'demo-school',
  barber_shop_name: null,
  mentor_name: null,
  avatar_url: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

export const demoProfile: Profile = {
  id: 'demo-user',
  email: 'demo@barberstudypro.test',
  full_name: 'Demo Student',
  role: 'admin', // aligned with demoUser.role so demo mode can test instructor/admin portals
  school_id: 'demo-school',
  barber_shop_name: null,
  mentor_name: null,
  avatar_url: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

export const demoApprenticeProfile: Profile = {
  id: 'demo-apprentice',
  email: 'apprentice@barberstudypro.test',
  full_name: 'Demo Apprentice',
  role: 'apprentice',
  school_id: null,
  barber_shop_name: "Razor Kings",
  mentor_name: "Malenny",
  avatar_url: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

// Demo students for the instructor roster fallback
export const demoStudents: Profile[] = [
  {
    id: 'demo-student-1',
    email: 'alex@barberstudypro.test',
    full_name: 'Alex Johnson',
    role: 'student',
    school_id: 'demo-school',
    barber_shop_name: null,
    mentor_name: null,
    avatar_url: null,
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'demo-student-2',
    email: 'maria@barberstudypro.test',
    full_name: 'Maria Garcia',
    role: 'student',
    school_id: 'demo-school',
    barber_shop_name: null,
    mentor_name: null,
    avatar_url: null,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z',
  },
  {
    id: 'demo-student-3',
    email: 'jordan@barberstudypro.test',
    full_name: 'Jordan Smith',
    role: 'apprentice',
    school_id: 'demo-school',
    barber_shop_name: "Razor Kings",
    mentor_name: "Malenny",
    avatar_url: null,
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'demo-student-4',
    email: 'taylor@barberstudypro.test',
    full_name: 'Taylor Brown',
    role: 'student',
    school_id: 'demo-school',
    barber_shop_name: null,
    mentor_name: null,
    avatar_url: null,
    created_at: '2026-02-10T00:00:00Z',
    updated_at: '2026-02-10T00:00:00Z',
  },
]

export const demoChapters: Chapter[] = [
  { id: 'ch-1', chapter_number: 1, title: 'History of Barbering', description: 'Explore the rich history and evolution of the barbering profession from ancient times to modern day.', content: null, order_index: 1, is_active: true },
  { id: 'ch-2', chapter_number: 2, title: 'Life Skills', description: 'Develop essential life skills including time management, communication, and professional ethics.', content: null, order_index: 2, is_active: true },
  { id: 'ch-3', chapter_number: 3, title: 'Professional Image', description: 'Learn how to maintain a professional appearance and build a strong personal brand.', content: null, order_index: 3, is_active: true },
  { id: 'ch-4', chapter_number: 4, title: 'Infection Control', description: 'Master sanitation, sterilization, and infection control practices to ensure client safety.', content: null, order_index: 4, is_active: true },
  { id: 'ch-5', chapter_number: 5, title: 'Implements, Tools, and Equipment', description: 'Identify and properly use barbering tools including clippers, shears, razors, and more.', content: null, order_index: 5, is_active: true },
  { id: 'ch-6', chapter_number: 6, title: 'General Anatomy and Physiology', description: 'Understand the structure and function of the human body systems relevant to barbering.', content: null, order_index: 6, is_active: true },
  { id: 'ch-7', chapter_number: 7, title: 'Basics of Chemistry', description: 'Learn the chemical principles behind hair products, coloring, and chemical services.', content: null, order_index: 7, is_active: true },
  { id: 'ch-8', chapter_number: 8, title: 'Basics of Electricity', description: 'Understand electrical safety and the use of electrical equipment in the barbershop.', content: null, order_index: 8, is_active: true },
  { id: 'ch-9', chapter_number: 9, title: 'The Skin – Structure, Disorders, and Diseases', description: 'Study skin anatomy, common disorders, and diseases relevant to barbering services.', content: null, order_index: 9, is_active: true },
  { id: 'ch-10', chapter_number: 10, title: 'Properties and Disorders of the Hair and Scalp', description: 'Learn about hair structure, growth cycles, and common scalp conditions.', content: null, order_index: 10, is_active: true },
  { id: 'ch-11', chapter_number: 11, title: 'Treatment of the Hair and Scalp', description: 'Master hair and scalp treatments including conditioning, medicated treatments, and scalp massages.', content: null, order_index: 11, is_active: true },
  { id: 'ch-12', chapter_number: 12, title: "Men's Facial Massage and Treatments", description: 'Learn facial massage techniques and treatments specifically designed for male clients.', content: null, order_index: 12, is_active: true },
  { id: 'ch-13', chapter_number: 13, title: 'Shaving and Facial-Hair Design', description: 'Master the art of shaving, beard shaping, and facial hair design techniques.', content: null, order_index: 13, is_active: true },
  { id: 'ch-14', chapter_number: 14, title: 'Men\'s Haircutting and Styling', description: 'Learn fundamental and advanced men\'s haircutting and styling techniques.', content: null, order_index: 14, is_active: true },
  { id: 'ch-15', chapter_number: 15, title: 'Men\'s Hair Replacement', description: 'Master hair replacement systems, consultation, attachment, maintenance, and blending techniques.', content: null, order_index: 15, is_active: true },
  { id: 'ch-16', chapter_number: 16, title: "Women's Haircutting & Styling", description: 'Master the design philosophy, foundational structures, texture analysis, and professional mindset for women\'s haircutting and styling.', content: null, order_index: 16, is_active: true },
  { id: 'ch-17', chapter_number: 17, title: 'Barbershop Management', description: 'Learn the business side of barbering including shop management and operations.', content: null, order_index: 17, is_active: true },
  { id: 'ch-18', chapter_number: 18, title: 'Advanced Cutting Techniques', description: 'Master advanced cutting techniques including fades, tapers, and texturizing.', content: null, order_index: 18, is_active: true },
  { id: 'ch-19', chapter_number: 19, title: 'Hair Replacement Systems', description: 'Explore hair replacement options, toupees, and non-surgical hair restoration.', content: null, order_index: 19, is_active: true },
  { id: 'ch-20', chapter_number: 20, title: 'Color Theory and Application', description: 'Deep dive into hair color theory, formulation, and application techniques.', content: null, order_index: 20, is_active: true },
  { id: 'ch-21', chapter_number: 21, title: 'Final Exam Preparation', description: 'Comprehensive final exam preparation with practice tests and review materials.', content: null, order_index: 21, is_active: true },
]

// Use real flashcards for chapters 1, 3, 4, demo for rest
export const demoFlashcards: Record<string, Flashcard[]> = {}

// Load real flashcards for chapters 1, 2, 3, 4, 7, 8, 9
const realChapters = [1, 2, 3, 4, 7, 8, 9]
for (const i of realChapters) {
  const chId = `ch-${i}`
  if (realFlashcards[chId]) {
    demoFlashcards[chId] = realFlashcards[chId].map((fc, idx) => ({
      ...fc,
      order_index: idx + 1,
      is_active: true,
    }))
  }
}

// BATCH 1: Merge orphaned flashcards for Ch 5, 6
// Chapter 2: Reset — skip orphaned flashcards

// Chapter 5: Replace placeholder with orphaned
if (batch1Flashcards['ch-5'] && batch1Flashcards['ch-5'].length > 0) {
  demoFlashcards['ch-5'] = batch1Flashcards['ch-5']
}

// Chapter 6: Replace placeholder with orphaned
if (batch1Flashcards['ch-6'] && batch1Flashcards['ch-6'].length > 0) {
  demoFlashcards['ch-6'] = batch1Flashcards['ch-6']
}

// Chapter 7: Already loaded from real flashcards above (ch-7 premium)

// Chapter 10: Use premium flashcards (real content)
if (realFlashcards['ch-10'] && realFlashcards['ch-10'].length > 0) {
  demoFlashcards['ch-10'] = realFlashcards['ch-10'].map((fc, idx) => ({
    ...fc,
    order_index: idx + 1,
    is_active: true,
  }))
}

// Chapter 11: Use premium flashcards (real content)
if (realFlashcards['ch-11'] && realFlashcards['ch-11'].length > 0) {
  demoFlashcards['ch-11'] = realFlashcards['ch-11'].map((fc, idx) => ({
    ...fc,
    order_index: idx + 1,
    is_active: true,
  }))
}

// Chapter 12: Use premium flashcards (real content)
if (realFlashcards['ch-12'] && realFlashcards['ch-12'].length > 0) {
  demoFlashcards['ch-12'] = realFlashcards['ch-12'].map((fc, idx) => ({
    ...fc,
    order_index: idx + 1,
    is_active: true,
  }))
}

// Chapter 13: Use premium flashcards (real content)
if (realFlashcards['ch-13'] && realFlashcards['ch-13'].length > 0) {
  demoFlashcards['ch-13'] = realFlashcards['ch-13'].map((fc, idx) => ({
    ...fc,
    order_index: idx + 1,
    is_active: true,
  }))
}

// Chapter 14: Use premium flashcards (real content)
if (realFlashcards['ch-14'] && realFlashcards['ch-14'].length > 0) {
  demoFlashcards['ch-14'] = realFlashcards['ch-14'].map((fc, idx) => ({
    ...fc,
    order_index: idx + 1,
    is_active: true,
  }))
}

// Chapter 15: Use premium flashcards (real content)
if (realFlashcards['ch-15'] && realFlashcards['ch-15'].length > 0) {
  demoFlashcards['ch-15'] = realFlashcards['ch-15'].map((fc, idx) => ({
    ...fc,
    order_index: idx + 1,
    is_active: true,
  }))
}

// Chapter 16: Use premium flashcards (real content)
if (realFlashcards['ch-16'] && realFlashcards['ch-16'].length > 0) {
  demoFlashcards['ch-16'] = realFlashcards['ch-16'].map((fc, idx) => ({
    ...fc,
    order_index: idx + 1,
    is_active: true,
  }))
}

// BATCH 4: Wire orphaned flashcards for Ch 17, 18, 19, 20, 21
const batch4Chapters = ['ch-17', 'ch-18', 'ch-19', 'ch-20', 'ch-21']
for (const chId of batch4Chapters) {
  if (batch4Flashcards[chId] && batch4Flashcards[chId].length > 0) {
    demoFlashcards[chId] = batch4Flashcards[chId]
  }
}

// Generate placeholder flashcards for remaining chapters
for (let i = 5; i <= 21; i++) {
  const chId = `ch-${i}`
  // Skip chapters that now have real data
  if (demoFlashcards[chId] && demoFlashcards[chId].length > 3) continue
  if (!demoFlashcards[chId]) {
    demoFlashcards[chId] = [
      { id: `fc-${i}-1`, chapter_id: chId, front: `Key concept from Chapter ${i}`, back: `This is a demo flashcard for Chapter ${i}. Real content will be loaded when Supabase is connected.`, category: 'General', difficulty: 'easy', order_index: 1, is_active: true },
      { id: `fc-${i}-2`, chapter_id: chId, front: `Important term from Chapter ${i}`, back: `This is another demo flashcard for Chapter ${i}.`, category: 'General', difficulty: 'easy', order_index: 2, is_active: true },
      { id: `fc-${i}-3`, chapter_id: chId, front: `Study point for Chapter ${i}`, back: `Demo content - will be replaced with real data.`, category: 'General', difficulty: 'medium', order_index: 3, is_active: true },
    ]
  }
}

export const demoQuizzes: Record<string, Quiz> = {
  // Chapter 1: Premium flashcard-driven quiz (30 questions)
  'ch-1': { id: 'quiz-1', chapter_id: 'ch-1', title: 'History of Barbering — Premium Quiz', description: '30 board-exam style questions. Passing score: 75%.', is_active: true, passing_score: 75 },
  // Chapter 2: Premium flashcard-driven quiz (30 questions)
  'ch-2': { id: 'quiz-2', chapter_id: 'ch-2', title: 'Life Skills — Premium Quiz', description: '30 board-exam style questions. Passing score: 75%.', is_active: true, passing_score: 75 },
  // Chapter 3: Premium flashcard-driven quiz (30 questions)
  'ch-3': { id: 'quiz-3', chapter_id: 'ch-3', title: 'Professional Image — Premium Quiz', description: '30 board-exam style questions. Passing score: 75%.', is_active: true, passing_score: 75 },
  // Chapter 4: Premium flashcard-driven quiz (30 questions)
  'ch-4': { id: 'quiz-4', chapter_id: 'ch-4', title: 'Infection Control — Premium Quiz', description: '30 board-exam style questions. Passing score: 75%.', is_active: true, passing_score: 75 },
  // Chapter 5: Premium flashcard-driven quiz (50 questions)
  'ch-5': { id: 'quiz-5', chapter_id: 'ch-5', title: 'Implements, Tools, and Equipment — Premium Quiz', description: '50 board-exam style questions. Passing score: 75%.', is_active: true, passing_score: 75 },
  // Chapter 6: Premium flashcard-driven quiz (50 questions)
  'ch-6': { id: 'quiz-6', chapter_id: 'ch-6', title: 'General Anatomy and Physiology — Premium Quiz', description: '50 board-exam style questions. Passing score: 75%.', is_active: true, passing_score: 75 },
  // Chapter 7: Premium flashcard-driven quiz (50 questions)
  'ch-7': { id: 'quiz-7', chapter_id: 'ch-7', title: 'Basics of Chemistry — Premium Quiz', description: '50 board-exam style questions. Passing score: 75%.', is_active: true, passing_score: 75 },
  // Chapter 8: Premium flashcard-driven quiz (30 questions)
  'ch-8': { id: 'quiz-8', chapter_id: 'ch-8', title: 'Basics of Electricity — Premium Quiz', description: '30 board-exam style questions. Passing score: 75%.', is_active: true, passing_score: 75 },
  // Chapter 9: Premium flashcard-driven quiz (30 questions)
  'ch-9': { id: 'quiz-9', chapter_id: 'ch-9', title: 'The Skin — Premium Quiz', description: '30 board-exam style questions. Passing score: 75%.', is_active: true, passing_score: 75 },
  // Chapter 10: Premium flashcard-driven quiz (65 questions)
  'ch-10': { id: 'quiz-10', chapter_id: 'ch-10', title: 'Properties and Disorders of the Hair and Scalp — Premium Quiz', description: '65 board-exam style questions. Passing score: 75%.', is_active: true, passing_score: 75 },
  // Chapter 11: Premium flashcard-driven quiz (50 questions)
  'ch-11': { id: 'quiz-11', chapter_id: 'ch-11', title: 'Treatment of the Hair and Scalp — Premium Quiz', description: '50 board-exam style questions. Passing score: 75%.', is_active: true, passing_score: 75 },
  // Chapter 12: Premium flashcard-driven quiz (45 questions)
  'ch-12': { id: 'quiz-12', chapter_id: 'ch-12', title: "Men's Facial Massage and Treatments — Premium Quiz", description: '45 board-exam style questions. Passing score: 75%.', is_active: true, passing_score: 75 },
  // Chapter 13: Premium flashcard-driven quiz (45 questions)
  'ch-13': { id: 'quiz-13', chapter_id: 'ch-13', title: 'Shaving and Facial-Hair Design — Premium Quiz', description: '45 board-exam style questions. Passing score: 75%.', is_active: true, passing_score: 75 },
  // Chapter 14: Premium flashcard-driven quiz (70 questions)
  'ch-14': { id: 'quiz-14', chapter_id: 'ch-14', title: "Men's Haircutting and Styling — Premium Quiz", description: '70 board-exam style questions. Passing score: 75%.', is_active: true, passing_score: 75 },
  // Chapter 15: Premium flashcard-driven quiz (72 questions)
  'ch-15': { id: 'quiz-15', chapter_id: 'ch-15', title: "Men's Hair Replacement — Premium Quiz", description: '72 board-exam style questions. Passing score: 75%.', is_active: true, passing_score: 75 },
  // Chapter 16: Premium flashcard-driven quiz (30 questions)
  'ch-16': { id: 'quiz-16', chapter_id: 'ch-16', title: "Women's Haircutting & Styling — Premium Quiz", description: '30 board-exam style questions. Passing score: 80%.', is_active: true, passing_score: 80 },
}

for (let i = 3; i <= 21; i++) {
  const chId = `ch-${i}`
  // Skip Chapters 3–13 — already registered above with premium titles
  if (i >= 3 && i <= 13) continue
  if (!demoQuizzes[chId]) {
    demoQuizzes[chId] = { id: `quiz-${i}`, chapter_id: chId, title: `Chapter ${i} Quiz`, description: `Test your knowledge of Chapter ${i}.`, is_active: true, passing_score: 75 }
  }
}

export const demoQuizQuestions: Record<string, QuizQuestion[]> = {
  // Real quiz questions from quiz-data.ts
  ...allQuizQuestions,
  // Chapter 1: Premium quiz questions now active (30 questions)
}

for (let i = 3; i <= 21; i++) {
  const quizId = `quiz-${i}`
  // Skip Chapters 3–15 — already in allQuizQuestions
  if (i >= 3 && i <= 15) continue
  if (!demoQuizQuestions[quizId]) {
    demoQuizQuestions[quizId] = [
      { id: `qq-${i}-1`, quiz_id: quizId, question: `Demo question 1 for Chapter ${i}`, answer_a: 'Option A', answer_b: 'Option B', answer_c: 'Option C', answer_d: 'Option D', correct_answer: 'a', explanation: `This is a demo question for Chapter ${i}.`, difficulty: 'easy', order_index: 1 },
      { id: `qq-${i}-2`, quiz_id: quizId, question: `Demo question 2 for Chapter ${i}`, answer_a: 'Option A', answer_b: 'Option B', answer_c: 'Option C', answer_d: 'Option D', correct_answer: 'b', explanation: `This is another demo question for Chapter ${i}.`, difficulty: 'easy', order_index: 2 },
      { id: `qq-${i}-3`, quiz_id: quizId, question: `Demo question 3 for Chapter ${i}`, answer_a: 'Option A', answer_b: 'Option B', answer_c: 'Option C', answer_d: 'Option D', correct_answer: 'c', explanation: `Demo explanation for Chapter ${i}.`, difficulty: 'medium', order_index: 3 },
    ]
  }
}

export const demoProgress: StudentProgress[] = [
  { id: 'prog-1', user_id: 'demo-user', chapter_id: 'ch-1', flashcards_completed: true, quiz_completed: true, best_quiz_score: 100, last_studied_at: '2026-05-17T10:00:00Z', progress_percentage: 100 },
  // Chapter 2 progress removed during reset
]

export const demoQuizAttempts: QuizAttempt[] = [
  { id: 'attempt-1', user_id: 'demo-user', quiz_id: 'quiz-1', score: 5, total_questions: 5, percentage: 100, answers_json: { 'qq-1-1': 'b', 'qq-1-2': 'b', 'qq-1-3': 'b', 'qq-1-4': 'b', 'qq-1-5': 'c' }, completed_at: '2026-05-17T10:30:00Z' },
]

// Instructor roster demo data — safe fallback when real Supabase tables are empty
export const demoStudentProgress: StudentProgress[] = [
  // Alex Johnson — strong progress
  { id: 'prog-alex-1', user_id: 'demo-student-1', chapter_id: 'ch-1', flashcards_completed: true, quiz_completed: true, best_quiz_score: 92, last_studied_at: '2026-06-21T09:00:00Z', progress_percentage: 100 },
  { id: 'prog-alex-2', user_id: 'demo-student-1', chapter_id: 'ch-2', flashcards_completed: true, quiz_completed: true, best_quiz_score: 88, last_studied_at: '2026-06-20T10:00:00Z', progress_percentage: 100 },
  { id: 'prog-alex-3', user_id: 'demo-student-1', chapter_id: 'ch-3', flashcards_completed: true, quiz_completed: true, best_quiz_score: 95, last_studied_at: '2026-06-19T11:00:00Z', progress_percentage: 100 },
  { id: 'prog-alex-4', user_id: 'demo-student-1', chapter_id: 'ch-4', flashcards_completed: true, quiz_completed: true, best_quiz_score: 90, last_studied_at: '2026-06-18T14:00:00Z', progress_percentage: 100 },
  { id: 'prog-alex-5', user_id: 'demo-student-1', chapter_id: 'ch-5', flashcards_completed: true, quiz_completed: true, best_quiz_score: 85, last_studied_at: '2026-06-17T16:00:00Z', progress_percentage: 100 },
  { id: 'prog-alex-6', user_id: 'demo-student-1', chapter_id: 'ch-6', flashcards_completed: false, quiz_completed: false, best_quiz_score: null, last_studied_at: '2026-06-16T09:00:00Z', progress_percentage: 40 },

  // Maria Garcia — moderate progress
  { id: 'prog-maria-1', user_id: 'demo-student-2', chapter_id: 'ch-1', flashcards_completed: true, quiz_completed: true, best_quiz_score: 80, last_studied_at: '2026-06-21T08:30:00Z', progress_percentage: 100 },
  { id: 'prog-maria-2', user_id: 'demo-student-2', chapter_id: 'ch-2', flashcards_completed: true, quiz_completed: true, best_quiz_score: 78, last_studied_at: '2026-06-20T15:00:00Z', progress_percentage: 100 },
  { id: 'prog-maria-3', user_id: 'demo-student-2', chapter_id: 'ch-3', flashcards_completed: true, quiz_completed: true, best_quiz_score: 82, last_studied_at: '2026-06-19T10:00:00Z', progress_percentage: 100 },
  { id: 'prog-maria-4', user_id: 'demo-student-2', chapter_id: 'ch-4', flashcards_completed: false, quiz_completed: false, best_quiz_score: null, last_studied_at: '2026-06-15T11:00:00Z', progress_percentage: 55 },

  // Jordan Smith — beginner apprentice
  { id: 'prog-jordan-1', user_id: 'demo-student-3', chapter_id: 'ch-1', flashcards_completed: true, quiz_completed: true, best_quiz_score: 72, last_studied_at: '2026-06-21T13:00:00Z', progress_percentage: 100 },
  { id: 'prog-jordan-2', user_id: 'demo-student-3', chapter_id: 'ch-2', flashcards_completed: true, quiz_completed: true, best_quiz_score: 68, last_studied_at: '2026-06-20T09:00:00Z', progress_percentage: 100 },
  { id: 'prog-jordan-3', user_id: 'demo-student-3', chapter_id: 'ch-3', flashcards_completed: false, quiz_completed: false, best_quiz_score: null, last_studied_at: '2026-06-19T09:00:00Z', progress_percentage: 50 },

  // Taylor Brown — struggling, needs review
  { id: 'prog-taylor-1', user_id: 'demo-student-4', chapter_id: 'ch-1', flashcards_completed: true, quiz_completed: true, best_quiz_score: 65, last_studied_at: '2026-06-21T10:00:00Z', progress_percentage: 100 },
  { id: 'prog-taylor-2', user_id: 'demo-student-4', chapter_id: 'ch-2', flashcards_completed: true, quiz_completed: false, best_quiz_score: 58, last_studied_at: '2026-06-20T10:00:00Z', progress_percentage: 60 },
  { id: 'prog-taylor-3', user_id: 'demo-student-4', chapter_id: 'ch-4', flashcards_completed: false, quiz_completed: false, best_quiz_score: 55, last_studied_at: '2026-06-18T10:00:00Z', progress_percentage: 40 },
]

export const demoStudentQuizAttempts: QuizAttempt[] = [
  // Alex Johnson
  { id: 'attempt-alex-1', user_id: 'demo-student-1', quiz_id: 'quiz-1', score: 23, total_questions: 25, percentage: 92, answers_json: {}, completed_at: '2026-06-21T09:30:00Z' },
  { id: 'attempt-alex-2', user_id: 'demo-student-1', quiz_id: 'quiz-2', score: 22, total_questions: 25, percentage: 88, answers_json: {}, completed_at: '2026-06-20T10:30:00Z' },
  { id: 'attempt-alex-3', user_id: 'demo-student-1', quiz_id: 'quiz-3', score: 24, total_questions: 25, percentage: 95, answers_json: {}, completed_at: '2026-06-19T11:30:00Z' },
  { id: 'attempt-alex-4', user_id: 'demo-student-1', quiz_id: 'quiz-4', score: 23, total_questions: 25, percentage: 90, answers_json: {}, completed_at: '2026-06-18T14:30:00Z' },
  { id: 'attempt-alex-5', user_id: 'demo-student-1', quiz_id: 'quiz-5', score: 43, total_questions: 50, percentage: 85, answers_json: {}, completed_at: '2026-06-17T16:30:00Z' },

  // Maria Garcia
  { id: 'attempt-maria-1', user_id: 'demo-student-2', quiz_id: 'quiz-1', score: 20, total_questions: 25, percentage: 80, answers_json: {}, completed_at: '2026-06-21T09:00:00Z' },
  { id: 'attempt-maria-2', user_id: 'demo-student-2', quiz_id: 'quiz-2', score: 20, total_questions: 25, percentage: 78, answers_json: {}, completed_at: '2026-06-20T15:30:00Z' },
  { id: 'attempt-maria-3', user_id: 'demo-student-2', quiz_id: 'quiz-3', score: 21, total_questions: 25, percentage: 82, answers_json: {}, completed_at: '2026-06-19T10:30:00Z' },

  // Jordan Smith
  { id: 'attempt-jordan-1', user_id: 'demo-student-3', quiz_id: 'quiz-1', score: 18, total_questions: 25, percentage: 72, answers_json: {}, completed_at: '2026-06-21T13:30:00Z' },
  { id: 'attempt-jordan-2', user_id: 'demo-student-3', quiz_id: 'quiz-2', score: 17, total_questions: 25, percentage: 68, answers_json: {}, completed_at: '2026-06-20T09:30:00Z' },

  // Taylor Brown — struggling
  { id: 'attempt-taylor-1', user_id: 'demo-student-4', quiz_id: 'quiz-1', score: 16, total_questions: 25, percentage: 65, answers_json: {}, completed_at: '2026-06-21T10:30:00Z' },
  { id: 'attempt-taylor-2', user_id: 'demo-student-4', quiz_id: 'quiz-2', score: 14, total_questions: 25, percentage: 58, answers_json: {}, completed_at: '2026-06-20T10:30:00Z' },
  { id: 'attempt-taylor-3', user_id: 'demo-student-4', quiz_id: 'quiz-4', score: 14, total_questions: 25, percentage: 55, answers_json: {}, completed_at: '2026-06-18T10:30:00Z' },
]

// Demo instructor notes for the student detail fallback
export const demoInstructorNotes: InstructorNote[] = [
  {
    id: 'note-alex-1',
    student_id: 'demo-student-1',
    instructor_id: 'demo-instructor',
    instructor_name: 'Demo Instructor',
    note_type: 'readiness',
    note_text: 'Alex is tracking well for the board exam. Consistently scoring above 85% on quizzes. Encourage him to finish the General Anatomy chapter next.',
    created_at: '2026-06-21T10:00:00Z',
  },
  {
    id: 'note-alex-2',
    student_id: 'demo-student-1',
    instructor_id: 'demo-instructor',
    instructor_name: 'Demo Instructor',
    note_type: 'coaching',
    note_text: 'Reviewed flashcard strategy. Alex benefits from daily 15-minute review sessions rather than cramming.',
    created_at: '2026-06-18T14:00:00Z',
  },
  {
    id: 'note-maria-1',
    student_id: 'demo-student-2',
    instructor_id: 'demo-instructor',
    instructor_name: 'Demo Instructor',
    note_type: 'general',
    note_text: 'Maria asks great questions during review sessions. Suggested she retake Chapter 2 quiz to push above 80%.',
    created_at: '2026-06-19T11:30:00Z',
  },
  {
    id: 'note-jordan-1',
    student_id: 'demo-student-3',
    instructor_id: 'demo-instructor',
    instructor_name: 'Demo Instructor',
    note_type: 'remediation',
    note_text: 'Jordan scored 72% on Chapter 1. Schedule one-on-one remediation on infection control fundamentals before advancing.',
    created_at: '2026-06-21T14:00:00Z',
  },
]

// Demo hour logs for the hour tracker fallback
export const demoHourLogs: HourLog[] = [
  // Alex Johnson — approved logs
  { id: 'hour-alex-1', user_id: 'demo-student-1', date: '2026-06-16', category: 'Theory', minutes: 240, status: 'approved', notes: 'Chapter 1-2 theory review', created_at: '2026-06-16T17:00:00Z', updated_at: '2026-06-16T17:00:00Z' },
  { id: 'hour-alex-2', user_id: 'demo-student-1', date: '2026-06-17', category: 'Practical', minutes: 480, status: 'approved', notes: 'Clipper practice on mannequin', created_at: '2026-06-17T17:00:00Z', updated_at: '2026-06-17T17:00:00Z' },
  { id: 'hour-alex-3', user_id: 'demo-student-1', date: '2026-06-18', category: 'Clinic', minutes: 495, status: 'approved', notes: 'Clinic floor — 3 haircuts', created_at: '2026-06-18T17:00:00Z', updated_at: '2026-06-18T17:00:00Z' },
  { id: 'hour-alex-4', user_id: 'demo-student-1', date: '2026-06-19', category: 'Sanitation', minutes: 60, status: 'approved', notes: 'Shop sanitization', created_at: '2026-06-19T17:00:00Z', updated_at: '2026-06-19T17:00:00Z' },
  { id: 'hour-alex-5', user_id: 'demo-student-1', date: '2026-06-20', category: 'Theory', minutes: 185, status: 'approved', notes: 'Anatomy review', created_at: '2026-06-20T17:00:00Z', updated_at: '2026-06-20T17:00:00Z' },
  // Alex Johnson — pending log
  { id: 'hour-alex-6', user_id: 'demo-student-1', date: '2026-06-21', category: 'Clinic', minutes: 480, status: 'pending', notes: 'Clinic floor — 4 haircuts', created_at: '2026-06-21T17:00:00Z', updated_at: '2026-06-21T17:00:00Z' },
  // Alex Johnson — rejected log
  { id: 'hour-alex-7', user_id: 'demo-student-1', date: '2026-06-15', category: 'Other', minutes: 120, status: 'rejected', notes: 'Incomplete log — no supervisor signature', created_at: '2026-06-15T17:00:00Z', updated_at: '2026-06-15T17:00:00Z' },
  // Maria Garcia — approved logs
  { id: 'hour-maria-1', user_id: 'demo-student-2', date: '2026-06-17', category: 'Theory', minutes: 180, status: 'approved', notes: 'Chapter 1 theory', created_at: '2026-06-17T17:00:00Z', updated_at: '2026-06-17T17:00:00Z' },
  { id: 'hour-maria-2', user_id: 'demo-student-2', date: '2026-06-18', category: 'Practical', minutes: 360, status: 'approved', notes: 'Scissor work practice', created_at: '2026-06-18T17:00:00Z', updated_at: '2026-06-18T17:00:00Z' },
  // Maria Garcia — pending log
  { id: 'hour-maria-3', user_id: 'demo-student-2', date: '2026-06-21', category: 'Clinic', minutes: 240, status: 'pending', notes: 'Clinic floor', created_at: '2026-06-21T17:00:00Z', updated_at: '2026-06-21T17:00:00Z' },
  // Jordan Smith — approved and pending
  { id: 'hour-jordan-1', user_id: 'demo-student-3', date: '2026-06-19', category: 'Theory', minutes: 120, status: 'approved', notes: 'Chapter 1 theory', created_at: '2026-06-19T17:00:00Z', updated_at: '2026-06-19T17:00:00Z' },
  { id: 'hour-jordan-2', user_id: 'demo-student-3', date: '2026-06-20', category: 'Practical', minutes: 240, status: 'approved', notes: 'Basic cuts', created_at: '2026-06-20T17:00:00Z', updated_at: '2026-06-20T17:00:00Z' },
  { id: 'hour-jordan-3', user_id: 'demo-student-3', date: '2026-06-21', category: 'Clinic', minutes: 480, status: 'pending', notes: 'Clinic floor', created_at: '2026-06-21T17:00:00Z', updated_at: '2026-06-21T17:00:00Z' },
]

// ============================================================================
// PHASE 6 — DEMO ATTENDANCE & CLOCK-IN DATA
// ============================================================================

function createAttendanceRecord(
  id: string,
  userId: string,
  date: string,
  status: AttendanceRecord['status'],
  clockIn: string | null = null,
  clockOut: string | null = null,
  note: string | null = null
): AttendanceRecord {
  const minutesPresent = clockIn && clockOut
    ? Math.round((new Date(clockOut).getTime() - new Date(clockIn).getTime()) / 60000)
    : null

  return {
    id,
    userId,
    schoolId: 'demo-school',
    date,
    status,
    clockedInAt: clockIn,
    clockedOutAt: clockOut,
    minutesPresent,
    note,
    verifiedBy: status === 'Absent' || status === 'Excused' ? null : 'demo-instructor',
    createdAt: `${date}T08:00:00Z`,
    updatedAt: `${date}T17:00:00Z`,
  }
}

// Demo attendance records for the last 11 school days (Mon-Fri weeks)
export const demoAttendanceRecords: AttendanceRecord[] = [
  // Alex Johnson — strong attendance
  createAttendanceRecord('att-alex-2026-06-09', 'demo-student-1', '2026-06-09', 'Present', '2026-06-09T08:55:00Z', '2026-06-09T17:05:00Z'),
  createAttendanceRecord('att-alex-2026-06-10', 'demo-student-1', '2026-06-10', 'Present', '2026-06-10T08:50:00Z', '2026-06-10T17:00:00Z'),
  createAttendanceRecord('att-alex-2026-06-11', 'demo-student-1', '2026-06-11', 'Present', '2026-06-11T09:05:00Z', '2026-06-11T17:10:00Z'),
  createAttendanceRecord('att-alex-2026-06-12', 'demo-student-1', '2026-06-12', 'Tardy', '2026-06-12T09:25:00Z', '2026-06-12T17:00:00Z', 'Late due to traffic'),
  createAttendanceRecord('att-alex-2026-06-13', 'demo-student-1', '2026-06-13', 'Present', '2026-06-13T08:45:00Z', '2026-06-13T16:55:00Z'),
  createAttendanceRecord('att-alex-2026-06-16', 'demo-student-1', '2026-06-16', 'Present', '2026-06-16T08:50:00Z', '2026-06-16T17:05:00Z'),
  createAttendanceRecord('att-alex-2026-06-17', 'demo-student-1', '2026-06-17', 'Excused', null, null, 'Medical appointment'),
  createAttendanceRecord('att-alex-2026-06-18', 'demo-student-1', '2026-06-18', 'Present', '2026-06-18T08:55:00Z', '2026-06-18T17:00:00Z'),
  createAttendanceRecord('att-alex-2026-06-19', 'demo-student-1', '2026-06-19', 'Present', '2026-06-19T08:50:00Z', '2026-06-19T17:05:00Z'),
  createAttendanceRecord('att-alex-2026-06-20', 'demo-student-1', '2026-06-20', 'Present', '2026-06-20T08:45:00Z', '2026-06-20T16:50:00Z'),
  createAttendanceRecord('att-alex-2026-06-23', 'demo-student-1', '2026-06-23', 'Present', '2026-06-23T08:50:00Z', null),

  // Maria Garcia — good attendance with one absence
  createAttendanceRecord('att-maria-2026-06-09', 'demo-student-2', '2026-06-09', 'Present', '2026-06-09T08:58:00Z', '2026-06-09T17:00:00Z'),
  createAttendanceRecord('att-maria-2026-06-10', 'demo-student-2', '2026-06-10', 'Present', '2026-06-10T08:52:00Z', '2026-06-10T17:05:00Z'),
  createAttendanceRecord('att-maria-2026-06-11', 'demo-student-2', '2026-06-11', 'Tardy', '2026-06-11T09:20:00Z', '2026-06-11T17:00:00Z', 'Bus delayed'),
  createAttendanceRecord('att-maria-2026-06-12', 'demo-student-2', '2026-06-12', 'Present', '2026-06-12T08:55:00Z', '2026-06-12T17:00:00Z'),
  createAttendanceRecord('att-maria-2026-06-13', 'demo-student-2', '2026-06-13', 'Present', '2026-06-13T08:50:00Z', '2026-06-13T17:00:00Z'),
  createAttendanceRecord('att-maria-2026-06-16', 'demo-student-2', '2026-06-16', 'Absent', null, null, 'Family emergency'),
  createAttendanceRecord('att-maria-2026-06-17', 'demo-student-2', '2026-06-17', 'Present', '2026-06-17T08:55:00Z', '2026-06-17T17:00:00Z'),
  createAttendanceRecord('att-maria-2026-06-18', 'demo-student-2', '2026-06-18', 'Excused', null, null, 'Court date'),
  createAttendanceRecord('att-maria-2026-06-19', 'demo-student-2', '2026-06-19', 'Present', '2026-06-19T08:50:00Z', '2026-06-19T17:00:00Z'),
  createAttendanceRecord('att-maria-2026-06-20', 'demo-student-2', '2026-06-20', 'Present', '2026-06-20T08:45:00Z', '2026-06-20T17:05:00Z'),
  createAttendanceRecord('att-maria-2026-06-23', 'demo-student-2', '2026-06-23', 'Present', '2026-06-23T08:55:00Z', null),

  // Jordan Smith — at-risk attendance
  createAttendanceRecord('att-jordan-2026-06-09', 'demo-student-3', '2026-06-09', 'Present', '2026-06-09T08:50:00Z', '2026-06-09T17:00:00Z'),
  createAttendanceRecord('att-jordan-2026-06-10', 'demo-student-3', '2026-06-10', 'Tardy', '2026-06-10T09:30:00Z', '2026-06-10T17:00:00Z', 'Overslept'),
  createAttendanceRecord('att-jordan-2026-06-11', 'demo-student-3', '2026-06-11', 'Absent', null, null, 'No call/no show'),
  createAttendanceRecord('att-jordan-2026-06-12', 'demo-student-3', '2026-06-12', 'Present', '2026-06-12T08:55:00Z', '2026-06-12T17:00:00Z'),
  createAttendanceRecord('att-jordan-2026-06-13', 'demo-student-3', '2026-06-13', 'Present', '2026-06-13T08:50:00Z', '2026-06-13T17:00:00Z'),
  createAttendanceRecord('att-jordan-2026-06-16', 'demo-student-3', '2026-06-16', 'Absent', null, null, 'No call/no show'),
  createAttendanceRecord('att-jordan-2026-06-17', 'demo-student-3', '2026-06-17', 'Tardy', '2026-06-17T09:15:00Z', '2026-06-17T17:00:00Z', 'Late arrival'),
  createAttendanceRecord('att-jordan-2026-06-18', 'demo-student-3', '2026-06-18', 'Excused', null, null, 'Sick leave with note'),
  createAttendanceRecord('att-jordan-2026-06-19', 'demo-student-3', '2026-06-19', 'Present', '2026-06-19T08:50:00Z', '2026-06-19T17:00:00Z'),
  createAttendanceRecord('att-jordan-2026-06-20', 'demo-student-3', '2026-06-20', 'Present', '2026-06-20T08:45:00Z', '2026-06-20T17:00:00Z'),
  createAttendanceRecord('att-jordan-2026-06-23', 'demo-student-3', '2026-06-23', 'Present', '2026-06-23T09:05:00Z', null),

  // Taylor Brown — struggling attendance
  createAttendanceRecord('att-taylor-2026-06-09', 'demo-student-4', '2026-06-09', 'Present', '2026-06-09T08:55:00Z', '2026-06-09T17:00:00Z'),
  createAttendanceRecord('att-taylor-2026-06-10', 'demo-student-4', '2026-06-10', 'Absent', null, null, 'No call/no show'),
  createAttendanceRecord('att-taylor-2026-06-11', 'demo-student-4', '2026-06-11', 'Absent', null, null, 'No call/no show'),
  createAttendanceRecord('att-taylor-2026-06-12', 'demo-student-4', '2026-06-12', 'Tardy', '2026-06-12T09:40:00Z', '2026-06-12T17:00:00Z', 'Transportation issues'),
  createAttendanceRecord('att-taylor-2026-06-13', 'demo-student-4', '2026-06-13', 'Present', '2026-06-13T08:50:00Z', '2026-06-13T17:00:00Z'),
  createAttendanceRecord('att-taylor-2026-06-16', 'demo-student-4', '2026-06-16', 'Absent', null, null, 'No call/no show'),
  createAttendanceRecord('att-taylor-2026-06-17', 'demo-student-4', '2026-06-17', 'Excused', null, null, 'Family matter'),
  createAttendanceRecord('att-taylor-2026-06-18', 'demo-student-4', '2026-06-18', 'Present', '2026-06-18T08:55:00Z', '2026-06-18T17:00:00Z'),
  createAttendanceRecord('att-taylor-2026-06-19', 'demo-student-4', '2026-06-19', 'Absent', null, null, 'No call/no show'),
  createAttendanceRecord('att-taylor-2026-06-20', 'demo-student-4', '2026-06-20', 'Present', '2026-06-20T08:50:00Z', '2026-06-20T17:00:00Z'),
  createAttendanceRecord('att-taylor-2026-06-23', 'demo-student-4', '2026-06-23', 'Present', '2026-06-23T09:00:00Z', null),
]

// Demo instructor attendance notes
export const demoInstructorAttendanceNotes: InstructorAttendanceNote[] = [
  {
    id: 'att-note-alex-1',
    studentId: 'demo-student-1',
    instructorId: 'demo-instructor',
    instructorName: 'Demo Instructor',
    date: '2026-06-12',
    note: 'Alex arrived 25 minutes late due to traffic. Otherwise strong attendance.',
    createdAt: '2026-06-12T09:30:00Z',
  },
  {
    id: 'att-note-maria-1',
    studentId: 'demo-student-2',
    instructorId: 'demo-instructor',
    instructorName: 'Demo Instructor',
    date: '2026-06-16',
    note: 'Maria absent for family emergency. Follow up tomorrow.',
    createdAt: '2026-06-16T10:00:00Z',
  },
  {
    id: 'att-note-jordan-1',
    studentId: 'demo-student-3',
    instructorId: 'demo-instructor',
    instructorName: 'Demo Instructor',
    date: '2026-06-11',
    note: 'Jordan no-call/no-show. Pattern emerging — schedule check-in.',
    createdAt: '2026-06-11T10:00:00Z',
  },
  {
    id: 'att-note-jordan-2',
    studentId: 'demo-student-3',
    instructorId: 'demo-instructor',
    instructorName: 'Demo Instructor',
    date: '2026-06-17',
    note: 'Jordan late again. Discussed transportation plan.',
    createdAt: '2026-06-17T09:30:00Z',
  },
  {
    id: 'att-note-taylor-1',
    studentId: 'demo-student-4',
    instructorId: 'demo-instructor',
    instructorName: 'Demo Instructor',
    date: '2026-06-16',
    note: 'Taylor has missed 3 days this pay period. Attendance contract recommended.',
    createdAt: '2026-06-16T10:30:00Z',
  },
]

// Helper to get all flashcards for a chapter
export function getDemoFlashcards(chapterId: string): Flashcard[] {
  return demoFlashcards[chapterId] || []
}

// Helper to get quiz for a chapter
export function getDemoQuiz(chapterId: string): Quiz | null {
  return demoQuizzes[chapterId] || null
}

// Helper to get quiz questions
export function getDemoQuizQuestions(quizId: string): QuizQuestion[] {
  return demoQuizQuestions[quizId] || []
}

// Helper to get progress for user
export function getDemoProgress(userId: string): StudentProgress[] {
  if (userId !== 'demo-user') return []
  return demoProgress
}

// Helper to get quiz attempts for user
export function getDemoQuizAttempts(userId: string): QuizAttempt[] {
  if (userId !== 'demo-user') return []
  return demoQuizAttempts
}

// ============================================================================
// PHASE 8A — DEMO MESSAGING DATA
// ============================================================================

const messagePriority = (p: NotificationPriority): NotificationPriority => p

export const demoMessageThreads: MessageThread[] = [
  {
    id: 'thread-alex-instructor',
    subject: 'Chapter 6 Study Plan',
    participants: [
      { id: 'part-alex', userId: 'demo-student-1', name: 'Alex Johnson', role: 'student' },
      { id: 'part-inst', userId: 'demo-instructor', name: 'Demo Instructor', role: 'instructor' },
    ],
    lastMessageAt: '2026-06-23T14:30:00Z',
    lastMessagePreview: 'Thanks for the guidance, I will review the flashcards tonight.',
    unreadCount: 1,
    isGroup: false,
  },
  {
    id: 'thread-maria-instructor',
    subject: 'Missed Chapter 4 Quiz',
    participants: [
      { id: 'part-maria', userId: 'demo-student-2', name: 'Maria Garcia', role: 'student' },
      { id: 'part-inst', userId: 'demo-instructor', name: 'Demo Instructor', role: 'instructor' },
    ],
    lastMessageAt: '2026-06-22T16:15:00Z',
    lastMessagePreview: 'Can we schedule a retake for Friday afternoon?',
    unreadCount: 1,
    isGroup: false,
  },
  {
    id: 'thread-jordan-instructor',
    subject: 'Attendance Check-In',
    participants: [
      { id: 'part-jordan', userId: 'demo-student-3', name: 'Jordan Smith', role: 'apprentice' },
      { id: 'part-inst', userId: 'demo-instructor', name: 'Demo Instructor', role: 'instructor' },
    ],
    lastMessageAt: '2026-06-21T09:45:00Z',
    lastMessagePreview: 'I have set up a new alarm and arranged a ride.',
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: 'thread-taylor-instructor',
    subject: 'Hour Log Rejection',
    participants: [
      { id: 'part-taylor', userId: 'demo-student-4', name: 'Taylor Brown', role: 'student' },
      { id: 'part-inst', userId: 'demo-instructor', name: 'Demo Instructor', role: 'instructor' },
    ],
    lastMessageAt: '2026-06-20T11:00:00Z',
    lastMessagePreview: 'Please resubmit with the supervisor signature.',
    unreadCount: 1,
    isGroup: false,
  },
  {
    id: 'thread-class-group',
    subject: 'State Board Study Group',
    participants: [
      { id: 'part-alex', userId: 'demo-student-1', name: 'Alex Johnson', role: 'student' },
      { id: 'part-maria', userId: 'demo-student-2', name: 'Maria Garcia', role: 'student' },
      { id: 'part-jordan', userId: 'demo-student-3', name: 'Jordan Smith', role: 'apprentice' },
      { id: 'part-taylor', userId: 'demo-student-4', name: 'Taylor Brown', role: 'student' },
      { id: 'part-inst', userId: 'demo-instructor', name: 'Demo Instructor', role: 'instructor' },
    ],
    lastMessageAt: '2026-06-23T18:00:00Z',
    lastMessagePreview: 'Reminder: mock board exam review is tomorrow at 9 AM.',
    unreadCount: 2,
    isGroup: true,
    groupName: 'State Board Study Group',
  },
]

export const demoMessages: Message[] = [
  // Alex Johnson thread
  {
    id: 'msg-alex-1',
    threadId: 'thread-alex-instructor',
    senderId: 'demo-instructor',
    senderName: 'Demo Instructor',
    senderRole: 'instructor',
    recipientIds: ['demo-student-1'],
    subject: 'Chapter 6 Study Plan',
    body: 'Hi Alex, your Chapter 5 quiz score was strong. To keep momentum, I recommend completing the Chapter 6 flashcards this week and attempting the quiz by Friday. Let me know if you need help.',
    status: 'read',
    priority: messagePriority('medium'),
    sentAt: '2026-06-22T10:00:00Z',
    readAt: '2026-06-22T11:00:00Z',
  },
  {
    id: 'msg-alex-2',
    threadId: 'thread-alex-instructor',
    senderId: 'demo-student-1',
    senderName: 'Alex Johnson',
    senderRole: 'student',
    recipientIds: ['demo-instructor'],
    subject: 'Chapter 6 Study Plan',
    body: 'Thanks for the guidance, I will review the flashcards tonight.',
    status: 'delivered',
    priority: messagePriority('low'),
    sentAt: '2026-06-23T14:30:00Z',
  },
  // Maria Garcia thread
  {
    id: 'msg-maria-1',
    threadId: 'thread-maria-instructor',
    senderId: 'demo-instructor',
    senderName: 'Demo Instructor',
    senderRole: 'instructor',
    recipientIds: ['demo-student-2'],
    subject: 'Missed Chapter 4 Quiz',
    body: 'Maria, I noticed you have not completed the Chapter 4 quiz yet. Infection Control is a critical topic for the state board. Please set aside time this week to finish it.',
    status: 'read',
    priority: messagePriority('high'),
    sentAt: '2026-06-21T13:00:00Z',
    readAt: '2026-06-21T14:00:00Z',
  },
  {
    id: 'msg-maria-2',
    threadId: 'thread-maria-instructor',
    senderId: 'demo-student-2',
    senderName: 'Maria Garcia',
    senderRole: 'student',
    recipientIds: ['demo-instructor'],
    subject: 'Missed Chapter 4 Quiz',
    body: 'Can we schedule a retake for Friday afternoon?',
    status: 'sent',
    priority: messagePriority('medium'),
    sentAt: '2026-06-22T16:15:00Z',
  },
  // Jordan Smith thread
  {
    id: 'msg-jordan-1',
    threadId: 'thread-jordan-instructor',
    senderId: 'demo-instructor',
    senderName: 'Demo Instructor',
    senderRole: 'instructor',
    recipientIds: ['demo-student-3'],
    subject: 'Attendance Check-In',
    body: 'Jordan, you have been late twice and absent twice in the past two weeks. Attendance is important for clinic floor eligibility. Let us know if there is anything we can do to help.',
    status: 'read',
    priority: messagePriority('urgent'),
    sentAt: '2026-06-20T09:00:00Z',
    readAt: '2026-06-20T10:00:00Z',
  },
  {
    id: 'msg-jordan-2',
    threadId: 'thread-jordan-instructor',
    senderId: 'demo-student-3',
    senderName: 'Jordan Smith',
    senderRole: 'apprentice',
    recipientIds: ['demo-instructor'],
    subject: 'Attendance Check-In',
    body: 'I have set up a new alarm and arranged a ride.',
    status: 'read',
    priority: messagePriority('medium'),
    sentAt: '2026-06-21T09:45:00Z',
    readAt: '2026-06-21T10:00:00Z',
  },
  // Taylor Brown thread
  {
    id: 'msg-taylor-1',
    threadId: 'thread-taylor-instructor',
    senderId: 'demo-instructor',
    senderName: 'Demo Instructor',
    senderRole: 'instructor',
    recipientIds: ['demo-student-4'],
    subject: 'Hour Log Rejection',
    body: 'Taylor, your hour log from June 15 was rejected because it is missing a supervisor signature. Please resubmit with the signature so we can count those hours.',
    status: 'delivered',
    priority: messagePriority('high'),
    sentAt: '2026-06-19T15:30:00Z',
  },
  {
    id: 'msg-taylor-2',
    threadId: 'thread-taylor-instructor',
    senderId: 'demo-instructor',
    senderName: 'Demo Instructor',
    senderRole: 'instructor',
    recipientIds: ['demo-student-4'],
    subject: 'Hour Log Rejection',
    body: 'Please resubmit with the supervisor signature.',
    status: 'sent',
    priority: messagePriority('high'),
    sentAt: '2026-06-20T11:00:00Z',
  },
  // Group thread
  {
    id: 'msg-group-1',
    threadId: 'thread-class-group',
    senderId: 'demo-instructor',
    senderName: 'Demo Instructor',
    senderRole: 'instructor',
    recipientIds: ['demo-student-1', 'demo-student-2', 'demo-student-3', 'demo-student-4'],
    subject: 'State Board Study Group',
    body: 'Welcome to the State Board Study Group. We will use this thread for exam reminders and study resources.',
    status: 'read',
    priority: messagePriority('medium'),
    sentAt: '2026-06-18T08:00:00Z',
    readAt: '2026-06-18T09:00:00Z',
  },
  {
    id: 'msg-group-2',
    threadId: 'thread-class-group',
    senderId: 'demo-student-1',
    senderName: 'Alex Johnson',
    senderRole: 'student',
    recipientIds: ['demo-instructor', 'demo-student-2', 'demo-student-3', 'demo-student-4'],
    subject: 'State Board Study Group',
    body: 'Does anyone want to meet after class on Thursday to review Chapter 4?',
    status: 'read',
    priority: messagePriority('low'),
    sentAt: '2026-06-22T17:00:00Z',
    readAt: '2026-06-22T18:00:00Z',
  },
  {
    id: 'msg-group-3',
    threadId: 'thread-class-group',
    senderId: 'demo-instructor',
    senderName: 'Demo Instructor',
    senderRole: 'instructor',
    recipientIds: ['demo-student-1', 'demo-student-2', 'demo-student-3', 'demo-student-4'],
    subject: 'State Board Study Group',
    body: 'Reminder: mock board exam review is tomorrow at 9 AM.',
    status: 'delivered',
    priority: messagePriority('high'),
    sentAt: '2026-06-23T18:00:00Z',
  },
]

export const demoNotifications: Notification[] = [
  // Alex Johnson
  {
    id: 'notif-alex-1',
    userId: 'demo-student-1',
    type: 'board_readiness',
    title: 'Board Readiness Update',
    body: 'Your board readiness score is strong. Keep up the consistent study habit.',
    priority: 'low',
    read: true,
    createdAt: '2026-06-21T09:00:00Z',
    actionUrl: '/dashboard/progress',
  },
  {
    id: 'notif-alex-2',
    userId: 'demo-student-1',
    type: 'upcoming_exam',
    title: 'Chapter 6 Quiz Due Friday',
    body: 'Do not forget to complete the Chapter 6 quiz by the end of the week.',
    priority: 'medium',
    read: false,
    createdAt: '2026-06-23T08:00:00Z',
    actionUrl: '/dashboard/chapters/6',
  },
  // Maria Garcia
  {
    id: 'notif-maria-1',
    userId: 'demo-student-2',
    type: 'attendance_risk',
    title: 'Attendance Risk',
    body: 'Your attendance is trending down. One more unexcused absence may trigger an academic warning.',
    priority: 'high',
    read: false,
    createdAt: '2026-06-22T10:00:00Z',
    actionUrl: '/dashboard',
  },
  {
    id: 'notif-maria-2',
    userId: 'demo-student-2',
    type: 'missed_assessment',
    title: 'Missed Chapter 4 Quiz',
    body: 'You missed the Chapter 4 quiz deadline. Schedule a retake with your instructor.',
    priority: 'high',
    read: false,
    createdAt: '2026-06-21T14:00:00Z',
    actionUrl: '/dashboard/chapters/4',
  },
  // Jordan Smith
  {
    id: 'notif-jordan-1',
    userId: 'demo-student-3',
    type: 'attendance_alert',
    title: 'Attendance Alert',
    body: 'You were marked absent on June 11 and June 16. Please contact your instructor.',
    priority: 'urgent',
    read: false,
    createdAt: '2026-06-21T08:00:00Z',
    actionUrl: '/dashboard',
  },
  {
    id: 'notif-jordan-2',
    userId: 'demo-student-3',
    type: 'missing_hours',
    title: 'Missing Hours',
    body: 'You are behind on clinic hours this month. Log your floor time to stay on track.',
    priority: 'high',
    read: true,
    createdAt: '2026-06-20T16:00:00Z',
    actionUrl: '/dashboard',
  },
  {
    id: 'notif-jordan-3',
    userId: 'demo-student-3',
    type: 'board_readiness',
    title: 'Board Readiness Warning',
    body: 'Your readiness score dropped after missed quizzes. Focus on infection control fundamentals.',
    priority: 'high',
    read: false,
    createdAt: '2026-06-22T11:00:00Z',
    actionUrl: '/dashboard/progress',
  },
  // Taylor Brown
  {
    id: 'notif-taylor-1',
    userId: 'demo-student-4',
    type: 'attendance_alert',
    title: 'Attendance Alert',
    body: 'Multiple absences detected. An attendance contract may be required.',
    priority: 'urgent',
    read: false,
    createdAt: '2026-06-20T09:00:00Z',
    actionUrl: '/dashboard',
  },
  {
    id: 'notif-taylor-2',
    userId: 'demo-student-4',
    type: 'missing_hours',
    title: 'Missing Hours',
    body: 'Several hour logs are still pending approval. Check with your supervisor.',
    priority: 'medium',
    read: false,
    createdAt: '2026-06-22T13:00:00Z',
    actionUrl: '/dashboard',
  },
  {
    id: 'notif-taylor-3',
    userId: 'demo-student-4',
    type: 'board_readiness',
    title: 'Board Readiness At Risk',
    body: 'Your readiness score is below 60. Schedule remediation before the mock exam.',
    priority: 'urgent',
    read: false,
    createdAt: '2026-06-23T07:00:00Z',
    actionUrl: '/dashboard/progress',
  },
  {
    id: 'notif-taylor-4',
    userId: 'demo-student-4',
    type: 'missed_assessment',
    title: 'Low Quiz Score',
    body: 'Your Chapter 2 quiz score was below passing. Retake available.',
    priority: 'high',
    read: false,
    createdAt: '2026-06-20T15:00:00Z',
    actionUrl: '/dashboard/chapters/2',
  },
  // Instructor notifications
  {
    id: 'notif-inst-1',
    userId: 'demo-instructor',
    type: 'attendance_alert',
    title: 'Attendance Concern: Taylor Brown',
    body: 'Taylor has missed 4 days this pay period and may need an attendance contract.',
    priority: 'urgent',
    read: false,
    createdAt: '2026-06-23T09:00:00Z',
    actionUrl: '/instructor/attendance',
  },
  {
    id: 'notif-inst-2',
    userId: 'demo-instructor',
    type: 'attendance_risk',
    title: 'Attendance Risk: Jordan Smith',
    body: 'Jordan is approaching the attendance threshold with two unexcused absences.',
    priority: 'high',
    read: false,
    createdAt: '2026-06-22T10:00:00Z',
    actionUrl: '/instructor/attendance',
  },
  {
    id: 'notif-inst-3',
    userId: 'demo-instructor',
    type: 'board_readiness',
    title: 'Board Readiness At Risk: Taylor Brown',
    body: "Taylor's board readiness score dropped below 60. Remediation recommended.",
    priority: 'high',
    read: false,
    createdAt: '2026-06-23T08:00:00Z',
    actionUrl: '/instructor/student/demo-student-4',
  },
  {
    id: 'notif-inst-4',
    userId: 'demo-instructor',
    type: 'missing_hours',
    title: 'Pending Hour Logs',
    body: 'You have 3 pending hour logs to review across the roster.',
    priority: 'medium',
    read: true,
    createdAt: '2026-06-21T17:00:00Z',
    actionUrl: '/instructor',
  },
  {
    id: 'notif-inst-5',
    userId: 'demo-instructor',
    type: 'message',
    title: 'New Message from Maria Garcia',
    body: 'Maria asked about scheduling a Chapter 4 quiz retake.',
    priority: 'medium',
    read: false,
    createdAt: '2026-06-22T16:20:00Z',
    actionUrl: '/instructor/messages?thread=thread-maria-instructor',
  },
]

export const demoAnnouncements: Announcement[] = [
  {
    id: 'announce-1',
    schoolId: 'demo-school',
    title: 'Mock Board Exam Review',
    body: 'Join us tomorrow at 9:00 AM in Classroom B for a comprehensive mock board exam review. Bring your notes and questions.',
    authorId: 'demo-instructor',
    authorName: 'Demo Instructor',
    priority: 'high',
    expiresAt: '2026-06-25T23:59:59Z',
    createdAt: '2026-06-23T08:00:00Z',
  },
  {
    id: 'announce-2',
    schoolId: 'demo-school',
    title: 'Clinic Hour Submission Deadline',
    body: 'All clinic hours for June must be submitted by June 30 at 5:00 PM. Late submissions may delay graduation paperwork.',
    authorId: 'demo-instructor',
    authorName: 'Demo Instructor',
    priority: 'medium',
    expiresAt: '2026-06-30T23:59:59Z',
    createdAt: '2026-06-22T10:00:00Z',
  },
  {
    id: 'announce-3',
    schoolId: 'demo-school',
    title: 'Shop Sanitation Refresh',
    body: 'A quick sanitation refresher will be held Friday after lunch. Attendance is required for all students on the clinic floor this month.',
    authorId: 'demo-instructor',
    authorName: 'Demo Instructor',
    priority: 'urgent',
    expiresAt: '2026-06-27T23:59:59Z',
    createdAt: '2026-06-23T12:00:00Z',
  },
]

// Helper to get demo message threads for a user
export function getDemoThreadsForUser(userId: string): MessageThread[] {
  return demoMessageThreads.filter((thread) =>
    thread.participants.some((p) => p.userId === userId)
  )
}

// Helper to get demo messages for a thread
export function getDemoMessagesForThread(threadId: string): Message[] {
  return demoMessages
    .filter((m) => m.threadId === threadId)
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
}

// Helper to get demo notifications for a user
export function getDemoNotificationsForUser(userId: string): Notification[] {
  return demoNotifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Helper to get active demo announcements for a school
export function getDemoAnnouncementsForSchool(schoolId: string): Announcement[] {
  const now = new Date().toISOString()
  return demoAnnouncements
    .filter((a) => a.schoolId === schoolId && (!a.expiresAt || a.expiresAt > now))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// ============================================================================
// PHASE 9 — DEMO GRADEBOOK & ASSESSMENTS DATA
// ============================================================================

export const demoGradeCategories: GradeCategory[] = [
  { id: 'gc-quizzes', name: 'Chapter Quizzes', type: 'QUIZ', weight: 0.25, schoolId: 'demo-school', isActive: true },
  { id: 'gc-practical', name: 'Practical Exams', type: 'PRACTICAL_EXAM', weight: 0.30, schoolId: 'demo-school', isActive: true },
  { id: 'gc-written', name: 'Written Exams', type: 'WRITTEN_EXAM', weight: 0.20, schoolId: 'demo-school', isActive: true },
  { id: 'gc-homework', name: 'Homework', type: 'HOMEWORK', weight: 0.10, schoolId: 'demo-school', isActive: true },
  { id: 'gc-participation', name: 'Participation', type: 'PARTICIPATION', weight: 0.10, schoolId: 'demo-school', isActive: true },
  { id: 'gc-attendance', name: 'Attendance', type: 'ATTENDANCE', weight: 0.05, schoolId: 'demo-school', isActive: true },
]

function createGrade(
  id: string,
  studentId: string,
  category: GradeCategory,
  score: number,
  maxScore: number,
  date: string,
  notes?: string,
  isExcused = false
): Grade {
  const percentage = Math.round((score / maxScore) * 1000) / 10
  return {
    id,
    studentId,
    categoryId: category.id,
    categoryType: category.type,
    score,
    maxScore,
    percentage,
    weight: category.weight,
    dateEntered: date,
    instructorId: 'demo-instructor',
    instructorName: 'Demo Instructor',
    notes: notes || null,
    isExcused,
  }
}

export const demoGrades: Grade[] = [
  // Alex Johnson — strong student
  createGrade('grade-alex-q1', 'demo-student-1', demoGradeCategories[0], 88, 100, '2026-06-02T09:00:00Z', 'Chapter 1-2 quiz'),
  createGrade('grade-alex-q2', 'demo-student-1', demoGradeCategories[0], 92, 100, '2026-06-09T09:00:00Z', 'Chapter 3-4 quiz'),
  createGrade('grade-alex-pe1', 'demo-student-1', demoGradeCategories[1], 90, 100, '2026-06-10T13:00:00Z', 'Taper fade practical'),
  createGrade('grade-alex-pe2', 'demo-student-1', demoGradeCategories[1], 87, 100, '2026-06-17T13:00:00Z', 'Beard trim practical'),
  createGrade('grade-alex-we1', 'demo-student-1', demoGradeCategories[2], 85, 100, '2026-06-05T10:00:00Z', 'Midterm written'),
  createGrade('grade-alex-hw1', 'demo-student-1', demoGradeCategories[3], 18, 20, '2026-06-03T23:59:00Z', 'Infection control worksheet'),
  createGrade('grade-alex-hw2', 'demo-student-1', demoGradeCategories[3], 19, 20, '2026-06-12T23:59:00Z', 'Anatomy crossword'),
  createGrade('grade-alex-part', 'demo-student-1', demoGradeCategories[4], 95, 100, '2026-06-19T16:00:00Z', 'Peer tutoring session'),
  createGrade('grade-alex-att', 'demo-student-1', demoGradeCategories[5], 95, 100, '2026-06-23T16:00:00Z', 'Attendance score'),

  // Maria Garcia — moderate student
  createGrade('grade-maria-q1', 'demo-student-2', demoGradeCategories[0], 78, 100, '2026-06-02T09:00:00Z', 'Chapter 1-2 quiz'),
  createGrade('grade-maria-q2', 'demo-student-2', demoGradeCategories[0], 82, 100, '2026-06-09T09:00:00Z', 'Chapter 3-4 quiz'),
  createGrade('grade-maria-pe1', 'demo-student-2', demoGradeCategories[1], 80, 100, '2026-06-10T13:00:00Z', 'Taper fade practical'),
  createGrade('grade-maria-pe2', 'demo-student-2', demoGradeCategories[1], 76, 100, '2026-06-17T13:00:00Z', 'Beard trim practical'),
  createGrade('grade-maria-we1', 'demo-student-2', demoGradeCategories[2], 74, 100, '2026-06-05T10:00:00Z', 'Midterm written'),
  createGrade('grade-maria-hw1', 'demo-student-2', demoGradeCategories[3], 16, 20, '2026-06-03T23:59:00Z', 'Infection control worksheet'),
  createGrade('grade-maria-hw2', 'demo-student-2', demoGradeCategories[3], 17, 20, '2026-06-12T23:59:00Z', 'Anatomy crossword'),
  createGrade('grade-maria-part', 'demo-student-2', demoGradeCategories[4], 88, 100, '2026-06-19T16:00:00Z', 'Class participation'),
  createGrade('grade-maria-att', 'demo-student-2', demoGradeCategories[5], 85, 100, '2026-06-23T16:00:00Z', 'Attendance score'),

  // Jordan Smith — apprentice, needs improvement
  createGrade('grade-jordan-q1', 'demo-student-3', demoGradeCategories[0], 70, 100, '2026-06-02T09:00:00Z', 'Chapter 1-2 quiz'),
  createGrade('grade-jordan-q2', 'demo-student-3', demoGradeCategories[0], 68, 100, '2026-06-09T09:00:00Z', 'Chapter 3-4 quiz'),
  createGrade('grade-jordan-pe1', 'demo-student-3', demoGradeCategories[1], 72, 100, '2026-06-10T13:00:00Z', 'Taper fade practical'),
  createGrade('grade-jordan-pe2', 'demo-student-3', demoGradeCategories[1], 70, 100, '2026-06-17T13:00:00Z', 'Beard trim practical'),
  createGrade('grade-jordan-we1', 'demo-student-3', demoGradeCategories[2], 66, 100, '2026-06-05T10:00:00Z', 'Midterm written'),
  createGrade('grade-jordan-hw1', 'demo-student-3', demoGradeCategories[3], 14, 20, '2026-06-03T23:59:00Z', 'Infection control worksheet'),
  createGrade('grade-jordan-hw2', 'demo-student-3', demoGradeCategories[3], 15, 20, '2026-06-12T23:59:00Z', 'Anatomy crossword'),
  createGrade('grade-jordan-part', 'demo-student-3', demoGradeCategories[4], 80, 100, '2026-06-19T16:00:00Z', 'Class participation'),
  createGrade('grade-jordan-att', 'demo-student-3', demoGradeCategories[5], 78, 100, '2026-06-23T16:00:00Z', 'Attendance score'),

  // Taylor Brown — struggling
  createGrade('grade-taylor-q1', 'demo-student-4', demoGradeCategories[0], 62, 100, '2026-06-02T09:00:00Z', 'Chapter 1-2 quiz'),
  createGrade('grade-taylor-q2', 'demo-student-4', demoGradeCategories[0], 58, 100, '2026-06-09T09:00:00Z', 'Chapter 3-4 quiz'),
  createGrade('grade-taylor-pe1', 'demo-student-4', demoGradeCategories[1], 60, 100, '2026-06-10T13:00:00Z', 'Taper fade practical'),
  createGrade('grade-taylor-pe2', 'demo-student-4', demoGradeCategories[1], 55, 100, '2026-06-17T13:00:00Z', 'Beard trim practical'),
  createGrade('grade-taylor-we1', 'demo-student-4', demoGradeCategories[2], 52, 100, '2026-06-05T10:00:00Z', 'Midterm written'),
  createGrade('grade-taylor-hw1', 'demo-student-4', demoGradeCategories[3], 10, 20, '2026-06-03T23:59:00Z', 'Infection control worksheet'),
  createGrade('grade-taylor-hw2', 'demo-student-4', demoGradeCategories[3], 12, 20, '2026-06-12T23:59:00Z', 'Anatomy crossword'),
  createGrade('grade-taylor-part', 'demo-student-4', demoGradeCategories[4], 70, 100, '2026-06-19T16:00:00Z', 'Class participation'),
  createGrade('grade-taylor-att', 'demo-student-4', demoGradeCategories[5], 68, 100, '2026-06-23T16:00:00Z', 'Attendance score'),
]

export const demoAssessmentRubrics: AssessmentRubric[] = [
  {
    id: 'rubric-haircut',
    assessmentType: 'HAIRCUT',
    criteria: [
      { id: 'crit-hc-1', name: 'Consultation', description: 'Conducts thorough client consultation and documents preferences', maxScore: 10, weight: 1 },
      { id: 'crit-hc-2', name: 'Sectioning', description: 'Proper sectioning and control of hair throughout service', maxScore: 10, weight: 1 },
      { id: 'crit-hc-3', name: 'Cutting Technique', description: 'Demonstrates safe, precise cutting technique', maxScore: 30, weight: 1 },
      { id: 'crit-hc-4', name: 'Blending & Fade', description: 'Smooth blending and fade execution', maxScore: 25, weight: 1 },
      { id: 'crit-hc-5', name: 'Finish & Cleanup', description: 'Clean lines, neckline, and sanitation', maxScore: 25, weight: 1 },
    ],
    schoolId: 'demo-school',
    isActive: true,
    createdBy: 'demo-instructor',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'rubric-color',
    assessmentType: 'COLOR',
    criteria: [
      { id: 'crit-col-1', name: 'Color Theory', description: 'Identifies natural level, tone, and desired result', maxScore: 20, weight: 1 },
      { id: 'crit-col-2', name: 'Formulation', description: 'Selects appropriate color formula and developer', maxScore: 25, weight: 1 },
      { id: 'crit-col-3', name: 'Application', description: 'Even, clean application avoiding skin staining', maxScore: 30, weight: 1 },
      { id: 'crit-col-4', name: 'Processing', description: 'Monitors processing time and strand test', maxScore: 15, weight: 1 },
      { id: 'crit-col-5', name: 'Results', description: 'Achieves intended color with healthy hair condition', maxScore: 10, weight: 1 },
    ],
    schoolId: 'demo-school',
    isActive: true,
    createdBy: 'demo-instructor',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'rubric-chemical',
    assessmentType: 'CHEMICAL',
    criteria: [
      { id: 'crit-chm-1', name: 'Hair Analysis', description: 'Evaluates hair integrity and elasticity', maxScore: 20, weight: 1 },
      { id: 'crit-chm-2', name: 'Product Selection', description: 'Chooses correct chemical service and strength', maxScore: 20, weight: 1 },
      { id: 'crit-chm-3', name: 'Application', description: 'Applies chemical safely and accurately', maxScore: 30, weight: 1 },
      { id: 'crit-chm-4', name: 'Timing', description: 'Monitors processing time and tests curl pattern', maxScore: 20, weight: 1 },
      { id: 'crit-chm-5', name: 'Neutralizing', description: 'Rinses and neutralizes thoroughly', maxScore: 10, weight: 1 },
    ],
    schoolId: 'demo-school',
    isActive: true,
    createdBy: 'demo-instructor',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'rubric-sanitation',
    assessmentType: 'SANITATION',
    criteria: [
      { id: 'crit-san-1', name: 'Workstation Setup', description: 'Sets up sanitized workstation with proper supplies', maxScore: 25, weight: 1 },
      { id: 'crit-san-2', name: 'Tool Sanitization', description: 'Sanitizes and stores tools per state board standards', maxScore: 25, weight: 1 },
      { id: 'crit-san-3', name: 'Blood Exposure', description: 'Demonstrates proper blood exposure protocol', maxScore: 25, weight: 1 },
      { id: 'crit-san-4', name: 'Client Safety', description: 'Maintains client safety and comfort throughout service', maxScore: 25, weight: 1 },
    ],
    schoolId: 'demo-school',
    isActive: true,
    createdBy: 'demo-instructor',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'rubric-consultation',
    assessmentType: 'CONSULTATION',
    criteria: [
      { id: 'crit-con-1', name: 'Greeting & Rapport', description: 'Professional greeting and builds client rapport', maxScore: 20, weight: 1 },
      { id: 'crit-con-2', name: 'Needs Analysis', description: 'Asks clarifying questions to understand desired service', maxScore: 25, weight: 1 },
      { id: 'crit-con-3', name: 'Recommendation', description: 'Recommends appropriate service with realistic expectations', maxScore: 25, weight: 1 },
      { id: 'crit-con-4', name: 'Communication', description: 'Explains process, maintenance, and home care clearly', maxScore: 20, weight: 1 },
      { id: 'crit-con-5', name: 'Documentation', description: 'Records consultation notes accurately', maxScore: 10, weight: 1 },
    ],
    schoolId: 'demo-school',
    isActive: true,
    createdBy: 'demo-instructor',
    createdAt: '2026-01-01T00:00:00Z',
  },
]

function createAssessment(
  id: string,
  studentId: string,
  assessmentType: Assessment['assessmentType'],
  score: number,
  maxScore: number,
  date: string,
  feedback: string,
  isPassed: boolean
): Assessment {
  return {
    id,
    studentId,
    assessmentType,
    score,
    scoringType: 'NUMERIC',
    qualitativeResult: null,
    feedback,
    assessmentDate: date,
    evaluatorId: 'demo-instructor',
    evaluatorName: 'Demo Instructor',
    rubricId: `rubric-${assessmentType.toLowerCase()}`,
    isPassed,
  }
}

export const demoAssessments: Assessment[] = [
  // Alex Johnson
  createAssessment('assess-alex-hc', 'demo-student-1', 'HAIRCUT', 92, 100, '2026-06-18T14:00:00Z', 'Excellent fade and blend. Work on neckline detail.', true),
  createAssessment('assess-alex-san', 'demo-student-1', 'SANITATION', 95, 100, '2026-06-19T10:00:00Z', 'Spotless station and thorough sanitization.', true),
  createAssessment('assess-alex-con', 'demo-student-1', 'CONSULTATION', 90, 100, '2026-06-20T11:00:00Z', 'Strong client communication and documentation.', true),

  // Maria Garcia
  createAssessment('assess-maria-hc', 'demo-student-2', 'HAIRCUT', 84, 100, '2026-06-18T14:00:00Z', 'Good shape, minor weight line left in fade.', true),
  createAssessment('assess-maria-col', 'demo-student-2', 'COLOR', 78, 100, '2026-06-19T13:00:00Z', 'Formulation was close; adjust developer strength next time.', true),
  createAssessment('assess-maria-san', 'demo-student-2', 'SANITATION', 88, 100, '2026-06-20T10:00:00Z', 'Good sanitation habits; label products clearly.', true),

  // Jordan Smith
  createAssessment('assess-jordan-hc', 'demo-student-3', 'HAIRCUT', 74, 100, '2026-06-18T14:00:00Z', 'Uneven weight line; needs more practice with guards.', true),
  createAssessment('assess-jordan-chm', 'demo-student-3', 'CHEMICAL', 68, 100, '2026-06-19T13:00:00Z', 'Timing was off; strand test missed. Review processing.', false),
  createAssessment('assess-jordan-con', 'demo-student-3', 'CONSULTATION', 76, 100, '2026-06-20T11:00:00Z', 'Asked basic questions; needs deeper needs analysis.', true),

  // Taylor Brown
  createAssessment('assess-taylor-hc', 'demo-student-4', 'HAIRCUT', 58, 100, '2026-06-18T14:00:00Z', 'Multiple guard lines; client safety was maintained.', false),
  createAssessment('assess-taylor-san', 'demo-student-4', 'SANITATION', 64, 100, '2026-06-19T10:00:00Z', 'Missed disinfecting comb between uses.', false),
  createAssessment('assess-taylor-chm', 'demo-student-4', 'CHEMICAL', 52, 100, '2026-06-19T13:00:00Z', 'Application uneven; requires supervised redo.', false),
]

export const demoGradeHistories: GradeHistory[] = [
  {
    id: 'history-alex-q1',
    gradeId: 'grade-alex-q1',
    previousScore: 82,
    newScore: 88,
    previousPercentage: 82,
    newPercentage: 88,
    changedBy: 'demo-instructor',
    changedAt: '2026-06-03T11:00:00Z',
    reason: 'Regraded open-response question',
  },
  {
    id: 'history-maria-pe1',
    gradeId: 'grade-maria-pe1',
    previousScore: 76,
    newScore: 80,
    previousPercentage: 76,
    newPercentage: 80,
    changedBy: 'demo-instructor',
    changedAt: '2026-06-11T15:00:00Z',
    reason: 'Corrected point deduction for timing',
  },
  {
    id: 'history-taylor-we1',
    gradeId: 'grade-taylor-we1',
    previousScore: 48,
    newScore: 52,
    previousPercentage: 48,
    newPercentage: 52,
    changedBy: 'demo-instructor',
    changedAt: '2026-06-06T09:30:00Z',
    reason: 'Accepted late submission with penalty removed',
  },
]

export function getDemoGradesForStudent(studentId: string): Grade[] {
  return demoGrades.filter((g) => g.studentId === studentId)
}

export function getDemoGradesForCategory(categoryId: string): Grade[] {
  return demoGrades.filter((g) => g.categoryId === categoryId)
}

export function getDemoAssessmentsForStudent(studentId: string): Assessment[] {
  return demoAssessments.filter((a) => a.studentId === studentId)
}

export function getDemoGradeHistoryForGrade(gradeId: string): GradeHistory[] {
  return demoGradeHistories.filter((h) => h.gradeId === gradeId)
}


// ============================================================================
// PHASE 12 — ADMINISTRATIVE & SCHOOL CONFIGURATION
// ============================================================================

export const demoAcademicPrograms: AcademicProgram[] = [
  { id: 'program-barber', name: 'Barbering', requiredHours: 1500, requiredAssessments: 10, requiredPracticals: 20, active: true },
  { id: 'program-cosmo', name: 'Cosmetology', requiredHours: 1500, requiredAssessments: 12, requiredPracticals: 24, active: true },
  { id: 'program-esthetics', name: 'Esthetics', requiredHours: 600, requiredAssessments: 8, requiredPracticals: 16, active: false },
]

export const demoAttendancePolicy: AttendancePolicy = {
  targetAttendancePercentage: 80,
  autoExcuseLimit: 3,
  tardyThresholdMinutes: 10,
  trackClockEvents: true,
}

export const demoHoursPolicy: HoursPolicy = {
  requiredHours: 1500,
  categories: ['Theory', 'Practical', 'Clinic', 'Sanitation', 'Other'],
  requireInstructorApproval: true,
}

export const demoGradebookConfig: GradebookConfig = {
  passingPercentage: 70,
  gradingScale: 'percentage',
  categories: demoGradeCategories,
}

export const demoAssessmentDefaults: AssessmentDefaults = {
  passingPercentage: 70,
  defaultRubricId: demoAssessmentRubrics[0]?.id || null,
  allowedTypes: ['HAIRCUT', 'COLOR', 'CHEMICAL', 'SANITATION', 'CONSULTATION'],
}

export const demoMessagingPreferences: MessagingPreferences = {
  allowStudentToStudent: false,
  requireModeration: false,
  autoReplyEnabled: false,
}

export const demoNotificationSettings: SchoolNotificationSetting[] = [
  { type: 'attendance_alert', enabled: true, priority: 'high' },
  { type: 'attendance_risk', enabled: true, priority: 'high' },
  { type: 'board_readiness', enabled: true, priority: 'medium' },
  { type: 'missing_hours', enabled: true, priority: 'medium' },
  { type: 'upcoming_exam', enabled: true, priority: 'low' },
]

export const demoRolePermissions: RolePermission[] = [
  {
    role: 'student',
    permissions: ['view_dashboard'],
  },
  {
    role: 'apprentice',
    permissions: ['view_dashboard'],
  },
  {
    role: 'instructor',
    permissions: [
      'view_dashboard',
      'manage_students',
      'manage_attendance',
      'manage_gradebook',
      'manage_assessments',
      'manage_compliance',
      'manage_messaging',
      'view_reports',
      'export_data',
    ],
  },
  {
    role: 'admin',
    permissions: [
      'view_dashboard',
      'manage_students',
      'manage_instructors',
      'manage_attendance',
      'manage_gradebook',
      'manage_assessments',
      'manage_compliance',
      'manage_messaging',
      'manage_settings',
      'view_reports',
      'export_data',
    ],
  },
]

export const demoSchoolConfiguration: SchoolConfiguration = {
  school: {
    ...demoSchool,
    address: '123 Demo Lane, Oklahoma City, OK 73102',
    contact_email: 'admin@demobarberacademy.test',
    subscription_status: 'trial',
  },
  branding: {
    primaryColor: '#D4AF37',
    logoUrl: null,
    faviconUrl: null,
  },
  programs: demoAcademicPrograms,
  instructors: [demoInstructorProfile],
  enrollment: {
    openEnrollment: true,
    allowSelfRegistration: false,
    defaultProgramId: 'program-barber',
  },
  attendancePolicy: demoAttendancePolicy,
  hoursPolicy: demoHoursPolicy,
  gradebookConfig: demoGradebookConfig,
  assessmentDefaults: demoAssessmentDefaults,
  messagingPreferences: demoMessagingPreferences,
  notificationSettings: demoNotificationSettings,
  rolePermissions: demoRolePermissions,
  updatedAt: '2026-06-24T00:00:00Z',
}
