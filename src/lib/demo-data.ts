// Demo data for soft launch without Supabase
// This provides safe mock data when NEXT_PUBLIC_DEMO_MODE=true

import { Chapter, Flashcard, Quiz, QuizQuestion, QuizAttempt, StudentProgress, Profile } from '@/types'
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
  role: 'student',
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
  { id: 'ch-15', chapter_number: 15, title: 'Men\'s Chemical Services', description: 'Understand chemical processes including perms, relaxers, and hair coloring for men.', content: null, order_index: 15, is_active: true },
  { id: 'ch-16', chapter_number: 16, title: 'State Board Preparation', description: 'Prepare for your state board examination with comprehensive review materials.', content: null, order_index: 16, is_active: true },
  { id: 'ch-17', chapter_number: 17, title: 'Barbershop Management', description: 'Learn the business side of barbering including shop management and operations.', content: null, order_index: 17, is_active: true },
  { id: 'ch-18', chapter_number: 18, title: 'Advanced Cutting Techniques', description: 'Master advanced cutting techniques including fades, tapers, and texturizing.', content: null, order_index: 18, is_active: true },
  { id: 'ch-19', chapter_number: 19, title: 'Hair Replacement Systems', description: 'Explore hair replacement options, toupees, and non-surgical hair restoration.', content: null, order_index: 19, is_active: true },
  { id: 'ch-20', chapter_number: 20, title: 'Color Theory and Application', description: 'Deep dive into hair color theory, formulation, and application techniques.', content: null, order_index: 20, is_active: true },
  { id: 'ch-21', chapter_number: 21, title: 'Final Exam Preparation', description: 'Comprehensive final exam preparation with practice tests and review materials.', content: null, order_index: 21, is_active: true },
]

// Use real flashcards for chapters 1, 3, 4, demo for rest
export const demoFlashcards: Record<string, Flashcard[]> = {}

// Load real flashcards for chapters 1, 2, 3, 4, 7, 8, 9 and 16
const realChapters = [1, 2, 3, 4, 7, 8, 9, 16]
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

// BATCH 4: Wire orphaned flashcards for Ch 14, 15, 17, 18, 19, 20, 21
const batch4Chapters = ['ch-14', 'ch-15', 'ch-17', 'ch-18', 'ch-19', 'ch-20', 'ch-21']
for (const chId of batch4Chapters) {
  if (batch4Flashcards[chId] && batch4Flashcards[chId].length > 0) {
    demoFlashcards[chId] = batch4Flashcards[chId]
  }
}

// Generate placeholder flashcards for remaining chapters (16)
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
  'ch-1': { id: 'quiz-1', chapter_id: 'ch-1', title: 'History of Barbering — Premium Quiz', description: '30 board-exam style questions. Passing score: 75%.', is_active: true },
  // Chapter 2: Premium flashcard-driven quiz (30 questions)
  'ch-2': { id: 'quiz-2', chapter_id: 'ch-2', title: 'Life Skills — Premium Quiz', description: '30 board-exam style questions. Passing score: 75%.', is_active: true },
  // Chapter 3: Premium flashcard-driven quiz (30 questions)
  'ch-3': { id: 'quiz-3', chapter_id: 'ch-3', title: 'Professional Image — Premium Quiz', description: '30 board-exam style questions. Passing score: 75%.', is_active: true },
  // Chapter 4: Premium flashcard-driven quiz (30 questions)
  'ch-4': { id: 'quiz-4', chapter_id: 'ch-4', title: 'Infection Control — Premium Quiz', description: '30 board-exam style questions. Passing score: 75%.', is_active: true },
  // Chapter 5: Premium flashcard-driven quiz (50 questions)
  'ch-5': { id: 'quiz-5', chapter_id: 'ch-5', title: 'Implements, Tools, and Equipment — Premium Quiz', description: '50 board-exam style questions. Passing score: 75%.', is_active: true },
  // Chapter 6: Premium flashcard-driven quiz (50 questions)
  'ch-6': { id: 'quiz-6', chapter_id: 'ch-6', title: 'General Anatomy and Physiology — Premium Quiz', description: '50 board-exam style questions. Passing score: 75%.', is_active: true },
  // Chapter 7: Premium flashcard-driven quiz (50 questions)
  'ch-7': { id: 'quiz-7', chapter_id: 'ch-7', title: 'Basics of Chemistry — Premium Quiz', description: '50 board-exam style questions. Passing score: 75%.', is_active: true },
  // Chapter 8: Premium flashcard-driven quiz (30 questions)
  'ch-8': { id: 'quiz-8', chapter_id: 'ch-8', title: 'Basics of Electricity — Premium Quiz', description: '30 board-exam style questions. Passing score: 75%.', is_active: true },
  // Chapter 9: Premium flashcard-driven quiz (30 questions)
  'ch-9': { id: 'quiz-9', chapter_id: 'ch-9', title: 'The Skin — Premium Quiz', description: '30 board-exam style questions. Passing score: 75%.', is_active: true },
  // Chapter 10: Premium flashcard-driven quiz (65 questions)
  'ch-10': { id: 'quiz-10', chapter_id: 'ch-10', title: 'Properties and Disorders of the Hair and Scalp — Premium Quiz', description: '65 board-exam style questions. Passing score: 75%.', is_active: true },
  // Chapter 11: Premium flashcard-driven quiz (50 questions)
  'ch-11': { id: 'quiz-11', chapter_id: 'ch-11', title: 'Treatment of the Hair and Scalp — Premium Quiz', description: '50 board-exam style questions. Passing score: 75%.', is_active: true },
  // Chapter 12: Premium flashcard-driven quiz (45 questions)
  'ch-12': { id: 'quiz-12', chapter_id: 'ch-12', title: "Men's Facial Massage and Treatments — Premium Quiz", description: '45 board-exam style questions. Passing score: 75%.', is_active: true },
  // Chapter 13: Premium flashcard-driven quiz (45 questions)
  'ch-13': { id: 'quiz-13', chapter_id: 'ch-13', title: 'Shaving and Facial-Hair Design — Premium Quiz', description: '45 board-exam style questions. Passing score: 75%.', is_active: true },
  // Chapter 14: Premium flashcard-driven quiz (70 questions)
  'ch-14': { id: 'quiz-14', chapter_id: 'ch-14', title: "Men's Haircutting and Styling — Premium Quiz", description: '70 board-exam style questions. Passing score: 75%.', is_active: true },
}

for (let i = 3; i <= 21; i++) {
  const chId = `ch-${i}`
  // Skip Chapters 3–13 — already registered above with premium titles
  if (i >= 3 && i <= 13) continue
  if (!demoQuizzes[chId]) {
    demoQuizzes[chId] = { id: `quiz-${i}`, chapter_id: chId, title: `Chapter ${i} Quiz`, description: `Test your knowledge of Chapter ${i}.`, is_active: true }
  }
}

export const demoQuizQuestions: Record<string, QuizQuestion[]> = {
  // Real quiz questions from quiz-data.ts
  ...allQuizQuestions,
  // Chapter 1: Premium quiz questions now active (30 questions)
}

for (let i = 3; i <= 21; i++) {
  const quizId = `quiz-${i}`
  // Skip Chapters 3–13 — already in allQuizQuestions
  if (i >= 3 && i <= 13) continue
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
