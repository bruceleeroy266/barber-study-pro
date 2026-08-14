/**
 * OFFICIAL ASCYN PRO DEMO ENVIRONMENT — CENTRALIZED DATA
 *
 * Single source of truth for the official demo environment used at
 * NABBA 2026, in the product demo video, and for future presentations.
 *
 * IMPORTANT SAFETY NOTES:
 * - This file is STATIC DATA ONLY. No database reads or writes.
 * - This file is NOT imported by any production route.
 * - It is consumed exclusively by /demo/* routes.
 * - All people, schools, and performance data are fictional.
 * - This file is intentionally separate from src/lib/demo-data.ts,
 *   which serves as the production fallback when Supabase is unconfigured.
 *   Do NOT merge these files — they serve different purposes.
 *
 * RESET ARCHITECTURE (for Phase 6):
 * All mutable demo state is derived from the immutable constants in this
 * file. A "Reset Demo" feature only needs to re-initialize component
 * state from these constants — no data mutation occurs. The recommended
 * pattern is:
 *   1. Deep-clone the constant into component state on mount.
 *   2. All interactions modify the clone, never the constant.
 *   3. Reset = re-clone from constant.
 * This ensures the original demo dataset is always pristine.
 */

import type {
  ReadinessLevel,
} from '@/types'

// ───────────────────────────────────────────────
// DEMO SCHOOL & CLASS
// ───────────────────────────────────────────────

export const DEMO_CLASS_NAME = 'Barbering — Class 2026'
export const DEMO_SCHOOL_NAME = 'ASCYN PRO Demo Academy'

// ───────────────────────────────────────────────
// TOPIC TAXONOMY
// Maps curriculum areas to display-friendly names.
// Used for weak-area heatmaps, topic mastery, and
// study recommendations across both views.
// ───────────────────────────────────────────────

export interface DemoTopic {
  id: string
  name: string
  chapterNumber: number
  category: string
}

export const DEMO_TOPICS: DemoTopic[] = [
  { id: 'infection-control', name: 'Infection Control', chapterNumber: 4, category: 'Safety & Sanitation' },
  { id: 'tools-equipment', name: 'Implements, Tools & Equipment', chapterNumber: 5, category: 'Fundamentals' },
  { id: 'anatomy', name: 'Anatomy & Physiology', chapterNumber: 6, category: 'Science' },
  { id: 'chemistry', name: 'Basics of Chemistry', chapterNumber: 7, category: 'Science' },
  { id: 'electricity', name: 'Basics of Electricity', chapterNumber: 8, category: 'Science' },
  { id: 'skin', name: 'Skin Structure & Disorders', chapterNumber: 9, category: 'Science' },
  { id: 'hair-scalp', name: 'Hair & Scalp Properties', chapterNumber: 10, category: 'Science' },
  { id: 'scalp-disorders', name: 'Scalp Disorders & Infections', chapterNumber: 10, category: 'Safety & Sanitation' },
  { id: 'hair-treatments', name: 'Hair & Scalp Treatments', chapterNumber: 11, category: 'Services' },
  { id: 'facial-massage', name: 'Facial Massage & Treatments', chapterNumber: 12, category: 'Services' },
  { id: 'shaving', name: 'Shaving & Facial-Hair Design', chapterNumber: 13, category: 'Services' },
  { id: 'haircutting', name: "Men's Haircutting & Styling", chapterNumber: 14, category: 'Services' },
  { id: 'haircoloring', name: 'Haircoloring & Lightening', chapterNumber: 18, category: 'Chemical Services' },
  { id: 'state-rules', name: 'State Rules & Regulations', chapterNumber: 19, category: 'Professional Practice' },
  { id: 'business', name: 'Business of Barbering', chapterNumber: 21, category: 'Professional Practice' },
]

// ───────────────────────────────────────────────
// DEMO STUDENT PROFILE TYPE
// Extends the production Profile with demo-specific
// presentation data that doesn't belong in the DB schema.
// ───────────────────────────────────────────────

export interface DemoStudentProfile {
  /** Matches Profile.id — used as the join key across all data */
  id: string
  /** Display name */
  name: string
  /** Fictional email */
  email: string
  /** Program name */
  program: string
  /** Enrollment date (ISO) */
  enrolledAt: string

  // ── Computed / Derived Metrics ──
  /** Overall course completion 0–100 */
  overallProgress: number
  /** Chapters fully completed */
  chaptersCompleted: number
  /** Total chapters in program */
  totalChapters: number
  /** Current chapter number */
  currentChapter: number
  /** Average quiz score 0–100 */
  avgQuizScore: number
  /** Total quizzes taken */
  quizzesTaken: number
  /** Total flashcards reviewed */
  flashcardsReviewed: number
  /** Days since last activity */
  daysSinceActive: number
  /** Last activity description */
  lastActivityDescription: string
  /** Last activity timestamp (ISO) */
  lastActiveAt: string

  // ── Readiness ──
  /** Board readiness score 0–100 */
  readinessScore: number
  /** Readiness level */
  readinessLevel: ReadinessLevel
  /** Readiness trend */
  readinessTrend: 'improving' | 'stable' | 'declining'

  // ── Performance Profile ──
  /** Topic-level mastery scores */
  topicMastery: { topicId: string; score: number }[]
  /** Strong areas (topicIds) */
  strongAreas: string[]
  /** Areas needing improvement (topicIds) */
  weakAreas: string[]
  /** Primary learning gap topicId (the ONE demonstrable gap) */
  primaryLearningGap: string | null

  // ── Risk / Attention ──
  /** Risk status for instructor dashboard */
  riskStatus: 'low' | 'medium' | 'high'
  /** Human-readable risk factors */
  riskFactors: string[]
  /** Recommended instructor action */
  recommendedAction: string

  // ── Chapter Progress ──
  /** Per-chapter progress records */
  chapterProgress: {
    chapterNumber: number
    status: 'completed' | 'in_progress' | 'not_started'
    quizScore: number | null
    flashcardsCompleted: boolean
    completedAt: string | null
  }[]

  // ── Quiz History ──
  /** Recent quiz attempts (most recent first) */
  quizHistory: {
    chapterNumber: number
    chapterTitle: string
    score: number
    totalQuestions: number
    percentage: number
    completedAt: string
    passed: boolean
  }[]

  // ── Study Recommendations ──
  /** Personalized study recommendations */
  studyRecommendations: {
    id: string
    type: 'study' | 'review' | 'practice'
    title: string
    description: string
    chapterNumber: number | null
    priority: 'critical' | 'high' | 'medium' | 'low'
    estimatedMinutes: number
  }[]

  // ── Recent Activity Feed ──
  /** Recent activity items (most recent first) */
  recentActivity: {
    id: string
    type: 'quiz' | 'flashcard' | 'chapter' | 'study_plan'
    description: string
    timestamp: string
  }[]

  // ── Readiness Score Trend (for sparkline) ──
  /** Last 6 readiness scores for trend visualization */
  readinessTrendData: number[]
}

// ───────────────────────────────────────────────
// ISABELLA MARTINEZ — PRIMARY DEMO STUDENT
//
// Narrative: Isabella is a dedicated student who is
// progressing well through the program. She has completed
// 14 of 21 chapters and maintains a solid 82% quiz average.
// However, ASCYN PRO has identified that her understanding
// of Scalp Disorders & Infections (Chapter 10) needs
// targeted study — she scored 62% on that quiz, well below
// her usual performance. This is her ONE clear learning gap.
//
// This is realistic: many students excel at practical
// skills but struggle with the theoretical/scientific
// identification of scalp conditions, which is heavily
// tested on state board exams.
// ───────────────────────────────────────────────

const ISABELLA_ID = 'demo-student-isabella'

export const isabellaMartinez: DemoStudentProfile = {
  id: ISABELLA_ID,
  name: 'Isabella Martinez',
  email: 'isabella.martinez@ascynpro.test',
  program: 'Barbering',
  enrolledAt: '2026-01-15T00:00:00Z',

  // Progress
  overallProgress: 67,
  chaptersCompleted: 14,
  totalChapters: 21,
  currentChapter: 15,
  avgQuizScore: 82,
  quizzesTaken: 18,
  flashcardsReviewed: 342,
  daysSinceActive: 0,
  lastActivityDescription: 'Completed Chapter 14 quiz — 88%',
  lastActiveAt: '2026-08-14T07:30:00Z',

  // Readiness
  readinessScore: 74,
  readinessLevel: 'Nearly Ready',
  readinessTrend: 'improving',

  // Topic Mastery
  topicMastery: [
    { topicId: 'infection-control', score: 91 },
    { topicId: 'tools-equipment', score: 88 },
    { topicId: 'anatomy', score: 85 },
    { topicId: 'chemistry', score: 79 },
    { topicId: 'electricity', score: 82 },
    { topicId: 'skin', score: 84 },
    { topicId: 'hair-scalp', score: 78 },
    { topicId: 'scalp-disorders', score: 62 },   // ← PRIMARY LEARNING GAP
    { topicId: 'hair-treatments', score: 86 },
    { topicId: 'facial-massage', score: 83 },
    { topicId: 'shaving', score: 90 },
    { topicId: 'haircutting', score: 88 },
    { topicId: 'haircoloring', score: 0 },        // not started
    { topicId: 'state-rules', score: 0 },          // not started
    { topicId: 'business', score: 0 },             // not started
  ],
  strongAreas: ['infection-control', 'shaving', 'haircutting', 'tools-equipment'],
  weakAreas: ['scalp-disorders', 'chemistry'],
  primaryLearningGap: 'scalp-disorders',

  // Risk
  riskStatus: 'low',
  riskFactors: [
    'Scalp Disorders & Infections score (62%) is below passing threshold',
    'Chapter 10 quiz score significantly below personal average',
  ],
  recommendedAction:
    'Review Chapter 10 scalp disorder identification flashcards and retake the Chapter 10 quiz. Focus on distinguishing contagious conditions (tinea capitis, tinea barbae, scabies) from non-contagious conditions.',

  // Chapter Progress (chapters 1–14 completed, 15 in progress)
  chapterProgress: [
    { chapterNumber: 1, status: 'completed', quizScore: 90, flashcardsCompleted: true, completedAt: '2026-02-01T10:00:00Z' },
    { chapterNumber: 2, status: 'completed', quizScore: 85, flashcardsCompleted: true, completedAt: '2026-02-15T10:00:00Z' },
    { chapterNumber: 3, status: 'completed', quizScore: 88, flashcardsCompleted: true, completedAt: '2026-03-01T10:00:00Z' },
    { chapterNumber: 4, status: 'completed', quizScore: 93, flashcardsCompleted: true, completedAt: '2026-03-15T10:00:00Z' },
    { chapterNumber: 5, status: 'completed', quizScore: 86, flashcardsCompleted: true, completedAt: '2026-04-01T10:00:00Z' },
    { chapterNumber: 6, status: 'completed', quizScore: 82, flashcardsCompleted: true, completedAt: '2026-04-15T10:00:00Z' },
    { chapterNumber: 7, status: 'completed', quizScore: 78, flashcardsCompleted: true, completedAt: '2026-05-01T10:00:00Z' },
    { chapterNumber: 8, status: 'completed', quizScore: 84, flashcardsCompleted: true, completedAt: '2026-05-15T10:00:00Z' },
    { chapterNumber: 9, status: 'completed', quizScore: 87, flashcardsCompleted: true, completedAt: '2026-06-01T10:00:00Z' },
    { chapterNumber: 10, status: 'completed', quizScore: 62, flashcardsCompleted: true, completedAt: '2026-06-15T10:00:00Z' },  // ← LEARNING GAP
    { chapterNumber: 11, status: 'completed', quizScore: 89, flashcardsCompleted: true, completedAt: '2026-07-01T10:00:00Z' },
    { chapterNumber: 12, status: 'completed', quizScore: 85, flashcardsCompleted: true, completedAt: '2026-07-10T10:00:00Z' },
    { chapterNumber: 13, status: 'completed', quizScore: 91, flashcardsCompleted: true, completedAt: '2026-07-25T10:00:00Z' },
    { chapterNumber: 14, status: 'completed', quizScore: 88, flashcardsCompleted: true, completedAt: '2026-08-10T10:00:00Z' },
    { chapterNumber: 15, status: 'in_progress', quizScore: null, flashcardsCompleted: false, completedAt: null },
    { chapterNumber: 16, status: 'not_started', quizScore: null, flashcardsCompleted: false, completedAt: null },
    { chapterNumber: 17, status: 'not_started', quizScore: null, flashcardsCompleted: false, completedAt: null },
    { chapterNumber: 18, status: 'not_started', quizScore: null, flashcardsCompleted: false, completedAt: null },
    { chapterNumber: 19, status: 'not_started', quizScore: null, flashcardsCompleted: false, completedAt: null },
    { chapterNumber: 20, status: 'not_started', quizScore: null, flashcardsCompleted: false, completedAt: null },
    { chapterNumber: 21, status: 'not_started', quizScore: null, flashcardsCompleted: false, completedAt: null },
  ],

  // Quiz History (most recent first)
  quizHistory: [
    { chapterNumber: 14, chapterTitle: "Men's Haircutting & Styling", score: 62, totalQuestions: 70, percentage: 88, completedAt: '2026-08-10T14:30:00Z', passed: true },
    { chapterNumber: 13, chapterTitle: 'Shaving & Facial-Hair Design', score: 41, totalQuestions: 45, percentage: 91, completedAt: '2026-07-25T11:00:00Z', passed: true },
    { chapterNumber: 12, chapterTitle: "Men's Facial Massage & Treatments", score: 38, totalQuestions: 45, percentage: 85, completedAt: '2026-07-10T10:00:00Z', passed: true },
    { chapterNumber: 11, chapterTitle: 'Hair & Scalp Treatments', score: 44, totalQuestions: 50, percentage: 89, completedAt: '2026-07-01T09:00:00Z', passed: true },
    { chapterNumber: 10, chapterTitle: 'Hair & Scalp Properties', score: 40, totalQuestions: 65, percentage: 62, completedAt: '2026-06-15T15:00:00Z', passed: false },  // ← LEARNING GAP
    { chapterNumber: 9, chapterTitle: 'Skin Structure & Disorders', score: 26, totalQuestions: 30, percentage: 87, completedAt: '2026-06-01T10:00:00Z', passed: true },
    { chapterNumber: 8, chapterTitle: 'Basics of Electricity', score: 25, totalQuestions: 30, percentage: 84, completedAt: '2026-05-15T11:00:00Z', passed: true },
    { chapterNumber: 7, chapterTitle: 'Basics of Chemistry', score: 39, totalQuestions: 50, percentage: 78, completedAt: '2026-05-01T10:00:00Z', passed: true },
    { chapterNumber: 6, chapterTitle: 'Anatomy & Physiology', score: 41, totalQuestions: 50, percentage: 82, completedAt: '2026-04-15T14:00:00Z', passed: true },
    { chapterNumber: 5, chapterTitle: 'Implements, Tools & Equipment', score: 43, totalQuestions: 50, percentage: 86, completedAt: '2026-04-01T10:00:00Z', passed: true },
    { chapterNumber: 4, chapterTitle: 'Infection Control', score: 28, totalQuestions: 30, percentage: 93, completedAt: '2026-03-15T09:00:00Z', passed: true },
    { chapterNumber: 3, chapterTitle: 'Professional Image', score: 26, totalQuestions: 30, percentage: 88, completedAt: '2026-03-01T10:00:00Z', passed: true },
    { chapterNumber: 2, chapterTitle: 'Life Skills', score: 25, totalQuestions: 30, percentage: 85, completedAt: '2026-02-15T11:00:00Z', passed: true },
    { chapterNumber: 1, chapterTitle: 'History of Barbering', score: 27, totalQuestions: 30, percentage: 90, completedAt: '2026-02-01T10:00:00Z', passed: true },
  ],

  // Study Recommendations
  studyRecommendations: [
    {
      id: 'rec-isabella-1',
      type: 'review',
      title: 'Review Scalp Disorders & Infections',
      description:
        'Your Chapter 10 quiz showed difficulty identifying contagious scalp conditions. Review the flashcards focusing on tinea capitis, tinea barbae, scabies, and pediculosis — knowing which conditions require stopping service is critical for the board exam.',
      chapterNumber: 10,
      priority: 'high',
      estimatedMinutes: 25,
    },
    {
      id: 'rec-isabella-2',
      type: 'practice',
      title: 'Retake Chapter 10 Quiz',
      description:
        'After reviewing the flashcards, retake the Chapter 10 quiz to confirm your understanding of scalp disorders and infections.',
      chapterNumber: 10,
      priority: 'high',
      estimatedMinutes: 20,
    },
    {
      id: 'rec-isabella-3',
      type: 'study',
      title: 'Continue Chapter 15 — Hair Replacement',
      description:
        'You are making great progress. Continue with Chapter 15 to maintain your momentum.',
      chapterNumber: 15,
      priority: 'medium',
      estimatedMinutes: 30,
    },
    {
      id: 'rec-isabella-4',
      type: 'review',
      title: 'Strengthen Chemistry Fundamentals',
      description:
        'Your Chapter 7 score (78%) is slightly below your average. A quick review of chemical bonding and pH concepts could help on the board exam.',
      chapterNumber: 7,
      priority: 'low',
      estimatedMinutes: 15,
    },
  ],

  // Recent Activity
  recentActivity: [
    { id: 'act-1', type: 'quiz', description: 'Completed Chapter 14 quiz — 88%', timestamp: '2026-08-10T14:30:00Z' },
    { id: 'act-2', type: 'flashcard', description: 'Reviewed 24 flashcards — Chapter 14', timestamp: '2026-08-09T10:00:00Z' },
    { id: 'act-3', type: 'chapter', description: 'Started Chapter 15 — Hair Replacement', timestamp: '2026-08-08T09:00:00Z' },
    { id: 'act-4', type: 'flashcard', description: 'Reviewed 18 flashcards — Chapter 13', timestamp: '2026-08-05T11:00:00Z' },
    { id: 'act-5', type: 'quiz', description: 'Completed Chapter 13 quiz — 91%', timestamp: '2026-07-25T11:00:00Z' },
    { id: 'act-6', type: 'study_plan', description: 'Study plan updated — focus on Chapter 10 review', timestamp: '2026-07-20T08:00:00Z' },
  ],

  // Readiness trend (last 6 data points)
  readinessTrendData: [68, 70, 71, 73, 72, 74],
}

// ───────────────────────────────────────────────
// BARBERING — CLASS 2026
// 12 fictional students with intentionally varied
// performance profiles for instructor demonstration.
// ───────────────────────────────────────────────

export const demoClassStudents: DemoStudentProfile[] = [
  // ── ISABELLA MARTINEZ (primary demo student) ──
  isabellaMartinez,

  // ── HIGH PERFORMERS ──

  {
    id: 'demo-student-marcus',
    name: 'Marcus Thompson',
    email: 'marcus.thompson@ascynpro.test',
    program: 'Barbering',
    enrolledAt: '2026-01-10T00:00:00Z',
    overallProgress: 90,
    chaptersCompleted: 19,
    totalChapters: 21,
    currentChapter: 20,
    avgQuizScore: 91,
    quizzesTaken: 24,
    flashcardsReviewed: 487,
    daysSinceActive: 0,
    lastActivityDescription: 'Completed Chapter 19 quiz — 93%',
    lastActiveAt: '2026-08-14T06:00:00Z',
    readinessScore: 91,
    readinessLevel: 'Ready',
    readinessTrend: 'improving',
    topicMastery: [
      { topicId: 'infection-control', score: 95 },
      { topicId: 'tools-equipment', score: 92 },
      { topicId: 'anatomy', score: 90 },
      { topicId: 'chemistry', score: 88 },
      { topicId: 'electricity', score: 91 },
      { topicId: 'skin', score: 93 },
      { topicId: 'hair-scalp', score: 89 },
      { topicId: 'scalp-disorders', score: 87 },
      { topicId: 'hair-treatments', score: 92 },
      { topicId: 'facial-massage', score: 90 },
      { topicId: 'shaving', score: 94 },
      { topicId: 'haircutting', score: 93 },
      { topicId: 'haircoloring', score: 86 },
      { topicId: 'state-rules', score: 89 },
      { topicId: 'business', score: 0 },
    ],
    strongAreas: ['infection-control', 'shaving', 'haircutting', 'skin'],
    weakAreas: ['haircoloring'],
    primaryLearningGap: null,
    riskStatus: 'low',
    riskFactors: [],
    recommendedAction: 'On track for board exam. Encourage completion of remaining chapters.',
    chapterProgress: Array.from({ length: 21 }, (_, i) => ({
      chapterNumber: i + 1,
      status: i < 19 ? 'completed' as const : i === 19 ? 'in_progress' as const : 'not_started' as const,
      quizScore: i < 19 ? 85 + Math.floor(Math.random() * 12) : null,
      flashcardsCompleted: i < 19,
      completedAt: i < 19 ? '2026-07-01T10:00:00Z' : null,
    })),
    quizHistory: [
      { chapterNumber: 19, chapterTitle: 'Preparing for Licensure', score: 14, totalQuestions: 15, percentage: 93, completedAt: '2026-08-12T10:00:00Z', passed: true },
      { chapterNumber: 18, chapterTitle: 'Haircoloring & Lightening', score: 13, totalQuestions: 15, percentage: 86, completedAt: '2026-08-05T10:00:00Z', passed: true },
      { chapterNumber: 14, chapterTitle: "Men's Haircutting & Styling", score: 65, totalQuestions: 70, percentage: 93, completedAt: '2026-07-20T10:00:00Z', passed: true },
      { chapterNumber: 13, chapterTitle: 'Shaving & Facial-Hair Design', score: 42, totalQuestions: 45, percentage: 94, completedAt: '2026-07-10T10:00:00Z', passed: true },
      { chapterNumber: 10, chapterTitle: 'Hair & Scalp Properties', score: 57, totalQuestions: 65, percentage: 87, completedAt: '2026-06-01T10:00:00Z', passed: true },
    ],
    studyRecommendations: [
      { id: 'rec-marcus-1', type: 'study', title: 'Complete Chapter 20', description: 'Finish the remaining chapters to complete the program.', chapterNumber: 20, priority: 'medium', estimatedMinutes: 30 },
    ],
    recentActivity: [
      { id: 'act-m1', type: 'quiz', description: 'Completed Chapter 19 quiz — 93%', timestamp: '2026-08-12T10:00:00Z' },
      { id: 'act-m2', type: 'flashcard', description: 'Reviewed 32 flashcards — Chapter 19', timestamp: '2026-08-11T09:00:00Z' },
    ],
    readinessTrendData: [82, 84, 86, 88, 90, 91],
  },

  {
    id: 'demo-student-aaliyah',
    name: 'Aaliyah Washington',
    email: 'aaliyah.washington@ascynpro.test',
    program: 'Barbering',
    enrolledAt: '2026-01-12T00:00:00Z',
    overallProgress: 86,
    chaptersCompleted: 18,
    totalChapters: 21,
    currentChapter: 19,
    avgQuizScore: 89,
    quizzesTaken: 22,
    flashcardsReviewed: 412,
    daysSinceActive: 1,
    lastActivityDescription: 'Completed Chapter 18 quiz — 87%',
    lastActiveAt: '2026-08-13T15:00:00Z',
    readinessScore: 88,
    readinessLevel: 'Ready',
    readinessTrend: 'stable',
    topicMastery: [
      { topicId: 'infection-control', score: 92 },
      { topicId: 'tools-equipment', score: 90 },
      { topicId: 'anatomy', score: 87 },
      { topicId: 'chemistry', score: 85 },
      { topicId: 'electricity', score: 88 },
      { topicId: 'skin', score: 91 },
      { topicId: 'hair-scalp', score: 86 },
      { topicId: 'scalp-disorders', score: 84 },
      { topicId: 'hair-treatments', score: 90 },
      { topicId: 'facial-massage', score: 88 },
      { topicId: 'shaving', score: 92 },
      { topicId: 'haircutting', score: 91 },
      { topicId: 'haircoloring', score: 87 },
      { topicId: 'state-rules', score: 0 },
      { topicId: 'business', score: 0 },
    ],
    strongAreas: ['shaving', 'infection-control', 'haircutting', 'skin'],
    weakAreas: ['scalp-disorders', 'chemistry'],
    primaryLearningGap: null,
    riskStatus: 'low',
    riskFactors: [],
    recommendedAction: 'Strong performer. Consider peer tutoring opportunities.',
    chapterProgress: Array.from({ length: 21 }, (_, i) => ({
      chapterNumber: i + 1,
      status: i < 18 ? 'completed' as const : i === 18 ? 'in_progress' as const : 'not_started' as const,
      quizScore: i < 18 ? 82 + Math.floor(Math.random() * 12) : null,
      flashcardsCompleted: i < 18,
      completedAt: i < 18 ? '2026-07-01T10:00:00Z' : null,
    })),
    quizHistory: [
      { chapterNumber: 18, chapterTitle: 'Haircoloring & Lightening', score: 13, totalQuestions: 15, percentage: 87, completedAt: '2026-08-05T10:00:00Z', passed: true },
      { chapterNumber: 14, chapterTitle: "Men's Haircutting & Styling", score: 62, totalQuestions: 70, percentage: 89, completedAt: '2026-07-15T10:00:00Z', passed: true },
      { chapterNumber: 10, chapterTitle: 'Hair & Scalp Properties', score: 55, totalQuestions: 65, percentage: 84, completedAt: '2026-06-01T10:00:00Z', passed: true },
    ],
    studyRecommendations: [
      { id: 'rec-aaliyah-1', type: 'study', title: 'Continue Chapter 19', description: 'Keep up the great work.', chapterNumber: 19, priority: 'medium', estimatedMinutes: 25 },
    ],
    recentActivity: [
      { id: 'act-a1', type: 'quiz', description: 'Completed Chapter 18 quiz — 87%', timestamp: '2026-08-05T10:00:00Z' },
    ],
    readinessTrendData: [84, 85, 86, 87, 88, 88],
  },

  // ── NORMAL PROGRESS ──

  {
    id: 'demo-student-david',
    name: 'David Chen',
    email: 'david.chen@ascynpro.test',
    program: 'Barbering',
    enrolledAt: '2026-01-15T00:00:00Z',
    overallProgress: 62,
    chaptersCompleted: 13,
    totalChapters: 21,
    currentChapter: 14,
    avgQuizScore: 79,
    quizzesTaken: 16,
    flashcardsReviewed: 298,
    daysSinceActive: 1,
    lastActivityDescription: 'Completed Chapter 13 quiz — 81%',
    lastActiveAt: '2026-08-13T10:00:00Z',
    readinessScore: 71,
    readinessLevel: 'Nearly Ready',
    readinessTrend: 'improving',
    topicMastery: [
      { topicId: 'infection-control', score: 85 },
      { topicId: 'tools-equipment', score: 82 },
      { topicId: 'anatomy', score: 78 },
      { topicId: 'chemistry', score: 74 },
      { topicId: 'electricity', score: 80 },
      { topicId: 'skin', score: 81 },
      { topicId: 'hair-scalp', score: 76 },
      { topicId: 'scalp-disorders', score: 71 },
      { topicId: 'hair-treatments', score: 82 },
      { topicId: 'facial-massage', score: 79 },
      { topicId: 'shaving', score: 84 },
      { topicId: 'haircutting', score: 0 },
      { topicId: 'haircoloring', score: 0 },
      { topicId: 'state-rules', score: 0 },
      { topicId: 'business', score: 0 },
    ],
    strongAreas: ['infection-control', 'shaving'],
    weakAreas: ['chemistry', 'scalp-disorders'],
    primaryLearningGap: null,
    riskStatus: 'low',
    riskFactors: ['Chemistry score (74%) slightly below average'],
    recommendedAction: 'Review chemistry fundamentals before advancing to chemical services chapters.',
    chapterProgress: Array.from({ length: 21 }, (_, i) => ({
      chapterNumber: i + 1,
      status: i < 13 ? 'completed' as const : i === 13 ? 'in_progress' as const : 'not_started' as const,
      quizScore: i < 13 ? 72 + Math.floor(Math.random() * 15) : null,
      flashcardsCompleted: i < 13,
      completedAt: i < 13 ? '2026-07-01T10:00:00Z' : null,
    })),
    quizHistory: [
      { chapterNumber: 13, chapterTitle: 'Shaving & Facial-Hair Design', score: 36, totalQuestions: 45, percentage: 81, completedAt: '2026-08-10T10:00:00Z', passed: true },
      { chapterNumber: 10, chapterTitle: 'Hair & Scalp Properties', score: 46, totalQuestions: 65, percentage: 71, completedAt: '2026-06-15T10:00:00Z', passed: false },
      { chapterNumber: 7, chapterTitle: 'Basics of Chemistry', score: 37, totalQuestions: 50, percentage: 74, completedAt: '2026-05-01T10:00:00Z', passed: false },
    ],
    studyRecommendations: [
      { id: 'rec-david-1', type: 'review', title: 'Review Chemistry Basics', description: 'Focus on pH scale and chemical bonding.', chapterNumber: 7, priority: 'medium', estimatedMinutes: 20 },
    ],
    recentActivity: [
      { id: 'act-d1', type: 'quiz', description: 'Completed Chapter 13 quiz — 81%', timestamp: '2026-08-10T10:00:00Z' },
    ],
    readinessTrendData: [64, 66, 68, 69, 70, 71],
  },

  {
    id: 'demo-student-sofia',
    name: 'Sofia Rodriguez',
    email: 'sofia.rodriguez@ascynpro.test',
    program: 'Barbering',
    enrolledAt: '2026-01-18T00:00:00Z',
    overallProgress: 57,
    chaptersCompleted: 12,
    totalChapters: 21,
    currentChapter: 13,
    avgQuizScore: 83,
    quizzesTaken: 15,
    flashcardsReviewed: 276,
    daysSinceActive: 0,
    lastActivityDescription: 'Reviewed flashcards — Chapter 12',
    lastActiveAt: '2026-08-14T07:00:00Z',
    readinessScore: 73,
    readinessLevel: 'Nearly Ready',
    readinessTrend: 'improving',
    topicMastery: [
      { topicId: 'infection-control', score: 88 },
      { topicId: 'tools-equipment', score: 85 },
      { topicId: 'anatomy', score: 82 },
      { topicId: 'chemistry', score: 80 },
      { topicId: 'electricity', score: 83 },
      { topicId: 'skin', score: 86 },
      { topicId: 'hair-scalp', score: 79 },
      { topicId: 'scalp-disorders', score: 75 },
      { topicId: 'hair-treatments', score: 84 },
      { topicId: 'facial-massage', score: 82 },
      { topicId: 'shaving', score: 0 },
      { topicId: 'haircutting', score: 0 },
      { topicId: 'haircoloring', score: 0 },
      { topicId: 'state-rules', score: 0 },
      { topicId: 'business', score: 0 },
    ],
    strongAreas: ['infection-control', 'skin'],
    weakAreas: ['scalp-disorders'],
    primaryLearningGap: null,
    riskStatus: 'low',
    riskFactors: [],
    recommendedAction: 'Steady progress. Continue current study pace.',
    chapterProgress: Array.from({ length: 21 }, (_, i) => ({
      chapterNumber: i + 1,
      status: i < 12 ? 'completed' as const : i === 12 ? 'in_progress' as const : 'not_started' as const,
      quizScore: i < 12 ? 76 + Math.floor(Math.random() * 14) : null,
      flashcardsCompleted: i < 12,
      completedAt: i < 12 ? '2026-07-01T10:00:00Z' : null,
    })),
    quizHistory: [
      { chapterNumber: 12, chapterTitle: "Men's Facial Massage & Treatments", score: 37, totalQuestions: 45, percentage: 82, completedAt: '2026-08-01T10:00:00Z', passed: true },
      { chapterNumber: 10, chapterTitle: 'Hair & Scalp Properties', score: 49, totalQuestions: 65, percentage: 75, completedAt: '2026-06-15T10:00:00Z', passed: false },
    ],
    studyRecommendations: [
      { id: 'rec-sofia-1', type: 'study', title: 'Continue Chapter 13', description: 'Keep up the steady progress.', chapterNumber: 13, priority: 'medium', estimatedMinutes: 30 },
    ],
    recentActivity: [
      { id: 'act-s1', type: 'flashcard', description: 'Reviewed 28 flashcards — Chapter 12', timestamp: '2026-08-14T07:00:00Z' },
    ],
    readinessTrendData: [66, 68, 70, 71, 72, 73],
  },

  {
    id: 'demo-student-james',
    name: 'James Wilson',
    email: 'james.wilson@ascynpro.test',
    program: 'Barbering',
    enrolledAt: '2026-02-01T00:00:00Z',
    overallProgress: 48,
    chaptersCompleted: 10,
    totalChapters: 21,
    currentChapter: 11,
    avgQuizScore: 76,
    quizzesTaken: 12,
    flashcardsReviewed: 198,
    daysSinceActive: 2,
    lastActivityDescription: 'Completed Chapter 10 quiz — 72%',
    lastActiveAt: '2026-08-12T14:00:00Z',
    readinessScore: 64,
    readinessLevel: 'Needs Review',
    readinessTrend: 'stable',
    topicMastery: [
      { topicId: 'infection-control', score: 80 },
      { topicId: 'tools-equipment', score: 78 },
      { topicId: 'anatomy', score: 75 },
      { topicId: 'chemistry', score: 72 },
      { topicId: 'electricity', score: 76 },
      { topicId: 'skin', score: 79 },
      { topicId: 'hair-scalp', score: 72 },
      { topicId: 'scalp-disorders', score: 68 },
      { topicId: 'hair-treatments', score: 0 },
      { topicId: 'facial-massage', score: 0 },
      { topicId: 'shaving', score: 0 },
      { topicId: 'haircutting', score: 0 },
      { topicId: 'haircoloring', score: 0 },
      { topicId: 'state-rules', score: 0 },
      { topicId: 'business', score: 0 },
    ],
    strongAreas: ['infection-control'],
    weakAreas: ['scalp-disorders', 'chemistry'],
    primaryLearningGap: null,
    riskStatus: 'medium',
    riskFactors: ['Scalp Disorders score (68%) below passing', 'Chemistry score (72%) below passing'],
    recommendedAction: 'Schedule review session for Chapter 10 scalp disorders. Provide supplementary flashcard set.',
    chapterProgress: Array.from({ length: 21 }, (_, i) => ({
      chapterNumber: i + 1,
      status: i < 10 ? 'completed' as const : i === 10 ? 'in_progress' as const : 'not_started' as const,
      quizScore: i < 10 ? 68 + Math.floor(Math.random() * 14) : null,
      flashcardsCompleted: i < 10,
      completedAt: i < 10 ? '2026-07-01T10:00:00Z' : null,
    })),
    quizHistory: [
      { chapterNumber: 10, chapterTitle: 'Hair & Scalp Properties', score: 47, totalQuestions: 65, percentage: 72, completedAt: '2026-08-10T10:00:00Z', passed: false },
      { chapterNumber: 7, chapterTitle: 'Basics of Chemistry', score: 36, totalQuestions: 50, percentage: 72, completedAt: '2026-06-01T10:00:00Z', passed: false },
    ],
    studyRecommendations: [
      { id: 'rec-james-1', type: 'review', title: 'Review Scalp Disorders', description: 'Focus on contagious condition identification.', chapterNumber: 10, priority: 'high', estimatedMinutes: 25 },
    ],
    recentActivity: [
      { id: 'act-j1', type: 'quiz', description: 'Completed Chapter 10 quiz — 72%', timestamp: '2026-08-10T10:00:00Z' },
    ],
    readinessTrendData: [62, 63, 63, 64, 64, 64],
  },

  {
    id: 'demo-student-maya',
    name: 'Maya Patel',
    email: 'maya.patel@ascynpro.test',
    program: 'Barbering',
    enrolledAt: '2026-02-01T00:00:00Z',
    overallProgress: 52,
    chaptersCompleted: 11,
    totalChapters: 21,
    currentChapter: 12,
    avgQuizScore: 81,
    quizzesTaken: 14,
    flashcardsReviewed: 245,
    daysSinceActive: 0,
    lastActivityDescription: 'Completed Chapter 11 quiz — 85%',
    lastActiveAt: '2026-08-14T06:30:00Z',
    readinessScore: 70,
    readinessLevel: 'Nearly Ready',
    readinessTrend: 'improving',
    topicMastery: [
      { topicId: 'infection-control', score: 86 },
      { topicId: 'tools-equipment', score: 83 },
      { topicId: 'anatomy', score: 80 },
      { topicId: 'chemistry', score: 77 },
      { topicId: 'electricity', score: 81 },
      { topicId: 'skin', score: 84 },
      { topicId: 'hair-scalp', score: 78 },
      { topicId: 'scalp-disorders', score: 73 },
      { topicId: 'hair-treatments', score: 85 },
      { topicId: 'facial-massage', score: 0 },
      { topicId: 'shaving', score: 0 },
      { topicId: 'haircutting', score: 0 },
      { topicId: 'haircoloring', score: 0 },
      { topicId: 'state-rules', score: 0 },
      { topicId: 'business', score: 0 },
    ],
    strongAreas: ['infection-control', 'hair-treatments'],
    weakAreas: ['scalp-disorders', 'chemistry'],
    primaryLearningGap: null,
    riskStatus: 'low',
    riskFactors: [],
    recommendedAction: 'Good progress. Review scalp disorders before advancing.',
    chapterProgress: Array.from({ length: 21 }, (_, i) => ({
      chapterNumber: i + 1,
      status: i < 11 ? 'completed' as const : i === 11 ? 'in_progress' as const : 'not_started' as const,
      quizScore: i < 11 ? 74 + Math.floor(Math.random() * 14) : null,
      flashcardsCompleted: i < 11,
      completedAt: i < 11 ? '2026-07-01T10:00:00Z' : null,
    })),
    quizHistory: [
      { chapterNumber: 11, chapterTitle: 'Hair & Scalp Treatments', score: 42, totalQuestions: 50, percentage: 85, completedAt: '2026-08-10T10:00:00Z', passed: true },
      { chapterNumber: 10, chapterTitle: 'Hair & Scalp Properties', score: 47, totalQuestions: 65, percentage: 73, completedAt: '2026-07-01T10:00:00Z', passed: false },
    ],
    studyRecommendations: [
      { id: 'rec-maya-1', type: 'study', title: 'Continue Chapter 12', description: 'Keep up the good work.', chapterNumber: 12, priority: 'medium', estimatedMinutes: 25 },
    ],
    recentActivity: [
      { id: 'act-mp1', type: 'quiz', description: 'Completed Chapter 11 quiz — 85%', timestamp: '2026-08-10T10:00:00Z' },
    ],
    readinessTrendData: [63, 65, 67, 68, 69, 70],
  },

  // ── NEEDS ATTENTION ──

  {
    id: 'demo-student-carlos',
    name: 'Carlos Mendez',
    email: 'carlos.mendez@ascynpro.test',
    program: 'Barbering',
    enrolledAt: '2026-01-20T00:00:00Z',
    overallProgress: 38,
    chaptersCompleted: 8,
    totalChapters: 21,
    currentChapter: 9,
    avgQuizScore: 64,
    quizzesTaken: 10,
    flashcardsReviewed: 134,
    daysSinceActive: 4,
    lastActivityDescription: 'Missed Chapter 8 quiz — 58%',
    lastActiveAt: '2026-08-10T10:00:00Z',
    readinessScore: 48,
    readinessLevel: 'At Risk',
    readinessTrend: 'declining',
    topicMastery: [
      { topicId: 'infection-control', score: 72 },
      { topicId: 'tools-equipment', score: 68 },
      { topicId: 'anatomy', score: 65 },
      { topicId: 'chemistry', score: 58 },
      { topicId: 'electricity', score: 55 },
      { topicId: 'skin', score: 70 },
      { topicId: 'hair-scalp', score: 0 },
      { topicId: 'scalp-disorders', score: 0 },
      { topicId: 'hair-treatments', score: 0 },
      { topicId: 'facial-massage', score: 0 },
      { topicId: 'shaving', score: 0 },
      { topicId: 'haircutting', score: 0 },
      { topicId: 'haircoloring', score: 0 },
      { topicId: 'state-rules', score: 0 },
      { topicId: 'business', score: 0 },
    ],
    strongAreas: ['infection-control'],
    weakAreas: ['electricity', 'chemistry'],
    primaryLearningGap: null,
    riskStatus: 'high',
    riskFactors: [
      'Readiness score (48%) well below passing',
      'Inactive for 4 days',
      'Electricity score (55%) below passing',
      'Chemistry score (58%) below passing',
      'Declining readiness trend',
    ],
    recommendedAction: 'Immediate intervention: schedule 1:1 meeting to discuss study habits. Review Chapters 7–8 fundamentals. Set daily study goal with accountability check-ins.',
    chapterProgress: Array.from({ length: 21 }, (_, i) => ({
      chapterNumber: i + 1,
      status: i < 8 ? 'completed' as const : i === 8 ? 'in_progress' as const : 'not_started' as const,
      quizScore: i < 8 ? 55 + Math.floor(Math.random() * 18) : null,
      flashcardsCompleted: i < 6,
      completedAt: i < 8 ? '2026-06-01T10:00:00Z' : null,
    })),
    quizHistory: [
      { chapterNumber: 8, chapterTitle: 'Basics of Electricity', score: 17, totalQuestions: 30, percentage: 58, completedAt: '2026-08-10T10:00:00Z', passed: false },
      { chapterNumber: 7, chapterTitle: 'Basics of Chemistry', score: 29, totalQuestions: 50, percentage: 58, completedAt: '2026-07-15T10:00:00Z', passed: false },
      { chapterNumber: 6, chapterTitle: 'Anatomy & Physiology', score: 32, totalQuestions: 50, percentage: 65, completedAt: '2026-06-15T10:00:00Z', passed: false },
    ],
    studyRecommendations: [
      { id: 'rec-carlos-1', type: 'review', title: 'Review Electricity Fundamentals', description: 'Focus on electrical safety and equipment.', chapterNumber: 8, priority: 'critical', estimatedMinutes: 30 },
      { id: 'rec-carlos-2', type: 'review', title: 'Review Chemistry Basics', description: 'Focus on pH scale and chemical bonds.', chapterNumber: 7, priority: 'critical', estimatedMinutes: 30 },
    ],
    recentActivity: [
      { id: 'act-c1', type: 'quiz', description: 'Missed Chapter 8 quiz — 58%', timestamp: '2026-08-10T10:00:00Z' },
    ],
    readinessTrendData: [58, 55, 52, 50, 49, 48],
  },

  {
    id: 'demo-student-jasmine',
    name: 'Jasmine Lee',
    email: 'jasmine.lee@ascynpro.test',
    program: 'Barbering',
    enrolledAt: '2026-02-10T00:00:00Z',
    overallProgress: 33,
    chaptersCompleted: 7,
    totalChapters: 21,
    currentChapter: 8,
    avgQuizScore: 71,
    quizzesTaken: 9,
    flashcardsReviewed: 112,
    daysSinceActive: 3,
    lastActivityDescription: 'Completed Chapter 7 quiz — 68%',
    lastActiveAt: '2026-08-11T10:00:00Z',
    readinessScore: 52,
    readinessLevel: 'Needs Review',
    readinessTrend: 'stable',
    topicMastery: [
      { topicId: 'infection-control', score: 78 },
      { topicId: 'tools-equipment', score: 74 },
      { topicId: 'anatomy', score: 72 },
      { topicId: 'chemistry', score: 65 },
      { topicId: 'electricity', score: 0 },
      { topicId: 'skin', score: 0 },
      { topicId: 'hair-scalp', score: 0 },
      { topicId: 'scalp-disorders', score: 0 },
      { topicId: 'hair-treatments', score: 0 },
      { topicId: 'facial-massage', score: 0 },
      { topicId: 'shaving', score: 0 },
      { topicId: 'haircutting', score: 0 },
      { topicId: 'haircoloring', score: 0 },
      { topicId: 'state-rules', score: 0 },
      { topicId: 'business', score: 0 },
    ],
    strongAreas: ['infection-control'],
    weakAreas: ['chemistry'],
    primaryLearningGap: null,
    riskStatus: 'medium',
    riskFactors: ['Chemistry score (65%) below passing', 'Behind on chapter completion'],
    recommendedAction: 'Review chemistry fundamentals. Consider additional tutoring for science-based chapters.',
    chapterProgress: Array.from({ length: 21 }, (_, i) => ({
      chapterNumber: i + 1,
      status: i < 7 ? 'completed' as const : i === 7 ? 'in_progress' as const : 'not_started' as const,
      quizScore: i < 7 ? 62 + Math.floor(Math.random() * 16) : null,
      flashcardsCompleted: i < 7,
      completedAt: i < 7 ? '2026-06-01T10:00:00Z' : null,
    })),
    quizHistory: [
      { chapterNumber: 7, chapterTitle: 'Basics of Chemistry', score: 34, totalQuestions: 50, percentage: 68, completedAt: '2026-08-10T10:00:00Z', passed: false },
      { chapterNumber: 6, chapterTitle: 'Anatomy & Physiology', score: 36, totalQuestions: 50, percentage: 72, completedAt: '2026-07-01T10:00:00Z', passed: false },
    ],
    studyRecommendations: [
      { id: 'rec-jasmine-1', type: 'review', title: 'Review Chemistry Fundamentals', description: 'Focus on pH and chemical bonding.', chapterNumber: 7, priority: 'high', estimatedMinutes: 25 },
    ],
    recentActivity: [
      { id: 'act-jl1', type: 'quiz', description: 'Completed Chapter 7 quiz — 68%', timestamp: '2026-08-10T10:00:00Z' },
    ],
    readinessTrendData: [50, 51, 51, 52, 52, 52],
  },

  {
    id: 'demo-student-tyler',
    name: 'Tyler Brooks',
    email: 'tyler.brooks@ascynpro.test',
    program: 'Barbering',
    enrolledAt: '2026-02-15T00:00:00Z',
    overallProgress: 24,
    chaptersCompleted: 5,
    totalChapters: 21,
    currentChapter: 6,
    avgQuizScore: 58,
    quizzesTaken: 6,
    flashcardsReviewed: 67,
    daysSinceActive: 7,
    lastActivityDescription: 'Inactive — no study in 7 days',
    lastActiveAt: '2026-08-07T10:00:00Z',
    readinessScore: 35,
    readinessLevel: 'At Risk',
    readinessTrend: 'declining',
    topicMastery: [
      { topicId: 'infection-control', score: 62 },
      { topicId: 'tools-equipment', score: 58 },
      { topicId: 'anatomy', score: 0 },
      { topicId: 'chemistry', score: 0 },
      { topicId: 'electricity', score: 0 },
      { topicId: 'skin', score: 0 },
      { topicId: 'hair-scalp', score: 0 },
      { topicId: 'scalp-disorders', score: 0 },
      { topicId: 'hair-treatments', score: 0 },
      { topicId: 'facial-massage', score: 0 },
      { topicId: 'shaving', score: 0 },
      { topicId: 'haircutting', score: 0 },
      { topicId: 'haircoloring', score: 0 },
      { topicId: 'state-rules', score: 0 },
      { topicId: 'business', score: 0 },
    ],
    strongAreas: [],
    weakAreas: ['infection-control', 'tools-equipment'],
    primaryLearningGap: null,
    riskStatus: 'high',
    riskFactors: [
      'Readiness score (35%) critically low',
      'Inactive for 7 days',
      'Only 5 of 21 chapters completed',
      'All quiz scores below passing threshold',
      'Declining readiness trend',
    ],
    recommendedAction: 'Urgent intervention required. Schedule immediate 1:1 meeting. Develop catch-up plan with daily study goals. Consider academic advising referral.',
    chapterProgress: Array.from({ length: 21 }, (_, i) => ({
      chapterNumber: i + 1,
      status: i < 5 ? 'completed' as const : i === 5 ? 'in_progress' as const : 'not_started' as const,
      quizScore: i < 5 ? 50 + Math.floor(Math.random() * 15) : null,
      flashcardsCompleted: i < 3,
      completedAt: i < 5 ? '2026-05-01T10:00:00Z' : null,
    })),
    quizHistory: [
      { chapterNumber: 5, chapterTitle: 'Implements, Tools & Equipment', score: 29, totalQuestions: 50, percentage: 58, completedAt: '2026-08-05T10:00:00Z', passed: false },
      { chapterNumber: 4, chapterTitle: 'Infection Control', score: 18, totalQuestions: 30, percentage: 62, completedAt: '2026-07-01T10:00:00Z', passed: false },
    ],
    studyRecommendations: [
      { id: 'rec-tyler-1', type: 'review', title: 'Review Infection Control', description: 'Fundamental safety concepts need reinforcement.', chapterNumber: 4, priority: 'critical', estimatedMinutes: 30 },
      { id: 'rec-tyler-2', type: 'review', title: 'Review Tools & Equipment', description: 'Focus on tool identification and proper use.', chapterNumber: 5, priority: 'critical', estimatedMinutes: 25 },
    ],
    recentActivity: [
      { id: 'act-t1', type: 'quiz', description: 'Missed Chapter 5 quiz — 58%', timestamp: '2026-08-05T10:00:00Z' },
    ],
    readinessTrendData: [48, 45, 42, 40, 37, 35],
  },

  // ── ADDITIONAL STUDENTS FOR VARIETY ──

  {
    id: 'demo-student-elena',
    name: 'Elena Vasquez',
    email: 'elena.vasquez@ascynpro.test',
    program: 'Barbering',
    enrolledAt: '2026-01-08T00:00:00Z',
    overallProgress: 76,
    chaptersCompleted: 16,
    totalChapters: 21,
    currentChapter: 17,
    avgQuizScore: 85,
    quizzesTaken: 20,
    flashcardsReviewed: 389,
    daysSinceActive: 1,
    lastActivityDescription: 'Completed Chapter 16 quiz — 83%',
    lastActiveAt: '2026-08-13T11:00:00Z',
    readinessScore: 79,
    readinessLevel: 'Nearly Ready',
    readinessTrend: 'improving',
    topicMastery: [
      { topicId: 'infection-control', score: 90 },
      { topicId: 'tools-equipment', score: 87 },
      { topicId: 'anatomy', score: 84 },
      { topicId: 'chemistry', score: 82 },
      { topicId: 'electricity', score: 85 },
      { topicId: 'skin', score: 88 },
      { topicId: 'hair-scalp', score: 83 },
      { topicId: 'scalp-disorders', score: 78 },
      { topicId: 'hair-treatments', score: 87 },
      { topicId: 'facial-massage', score: 85 },
      { topicId: 'shaving', score: 89 },
      { topicId: 'haircutting', score: 86 },
      { topicId: 'haircoloring', score: 0 },
      { topicId: 'state-rules', score: 0 },
      { topicId: 'business', score: 0 },
    ],
    strongAreas: ['infection-control', 'shaving', 'skin'],
    weakAreas: ['scalp-disorders'],
    primaryLearningGap: null,
    riskStatus: 'low',
    riskFactors: [],
    recommendedAction: 'Solid progress. Review scalp disorders to strengthen before board exam.',
    chapterProgress: Array.from({ length: 21 }, (_, i) => ({
      chapterNumber: i + 1,
      status: i < 16 ? 'completed' as const : i === 16 ? 'in_progress' as const : 'not_started' as const,
      quizScore: i < 16 ? 78 + Math.floor(Math.random() * 14) : null,
      flashcardsCompleted: i < 16,
      completedAt: i < 16 ? '2026-07-01T10:00:00Z' : null,
    })),
    quizHistory: [
      { chapterNumber: 16, chapterTitle: "Women's Haircutting & Styling", score: 25, totalQuestions: 30, percentage: 83, completedAt: '2026-08-10T10:00:00Z', passed: true },
      { chapterNumber: 10, chapterTitle: 'Hair & Scalp Properties', score: 51, totalQuestions: 65, percentage: 78, completedAt: '2026-06-15T10:00:00Z', passed: false },
    ],
    studyRecommendations: [
      { id: 'rec-elena-1', type: 'study', title: 'Continue Chapter 17', description: 'Keep up the strong progress.', chapterNumber: 17, priority: 'medium', estimatedMinutes: 25 },
    ],
    recentActivity: [
      { id: 'act-e1', type: 'quiz', description: 'Completed Chapter 16 quiz — 83%', timestamp: '2026-08-10T10:00:00Z' },
    ],
    readinessTrendData: [72, 74, 75, 77, 78, 79],
  },

  {
    id: 'demo-student-kevin',
    name: "Kevin O'Brien",
    email: 'kevin.obrien@ascynpro.test',
    program: 'Barbering',
    enrolledAt: '2026-01-25T00:00:00Z',
    overallProgress: 43,
    chaptersCompleted: 9,
    totalChapters: 21,
    currentChapter: 10,
    avgQuizScore: 73,
    quizzesTaken: 11,
    flashcardsReviewed: 156,
    daysSinceActive: 2,
    lastActivityDescription: 'Completed Chapter 9 quiz — 76%',
    lastActiveAt: '2026-08-12T09:00:00Z',
    readinessScore: 58,
    readinessLevel: 'Needs Review',
    readinessTrend: 'stable',
    topicMastery: [
      { topicId: 'infection-control', score: 76 },
      { topicId: 'tools-equipment', score: 74 },
      { topicId: 'anatomy', score: 71 },
      { topicId: 'chemistry', score: 68 },
      { topicId: 'electricity', score: 72 },
      { topicId: 'skin', score: 76 },
      { topicId: 'hair-scalp', score: 0 },
      { topicId: 'scalp-disorders', score: 0 },
      { topicId: 'hair-treatments', score: 0 },
      { topicId: 'facial-massage', score: 0 },
      { topicId: 'shaving', score: 0 },
      { topicId: 'haircutting', score: 0 },
      { topicId: 'haircoloring', score: 0 },
      { topicId: 'state-rules', score: 0 },
      { topicId: 'business', score: 0 },
    ],
    strongAreas: ['infection-control', 'skin'],
    weakAreas: ['chemistry'],
    primaryLearningGap: null,
    riskStatus: 'medium',
    riskFactors: ['Chemistry score (68%) below passing', 'Approaching Chapter 10 — historically difficult'],
    recommendedAction: 'Review chemistry before starting Chapter 10. Provide extra support for science-based chapters.',
    chapterProgress: Array.from({ length: 21 }, (_, i) => ({
      chapterNumber: i + 1,
      status: i < 9 ? 'completed' as const : i === 9 ? 'in_progress' as const : 'not_started' as const,
      quizScore: i < 9 ? 65 + Math.floor(Math.random() * 15) : null,
      flashcardsCompleted: i < 9,
      completedAt: i < 9 ? '2026-07-01T10:00:00Z' : null,
    })),
    quizHistory: [
      { chapterNumber: 9, chapterTitle: 'Skin Structure & Disorders', score: 23, totalQuestions: 30, percentage: 76, completedAt: '2026-08-10T10:00:00Z', passed: false },
      { chapterNumber: 7, chapterTitle: 'Basics of Chemistry', score: 34, totalQuestions: 50, percentage: 68, completedAt: '2026-07-01T10:00:00Z', passed: false },
    ],
    studyRecommendations: [
      { id: 'rec-kevin-1', type: 'review', title: 'Review Chemistry Basics', description: 'Strengthen before advancing.', chapterNumber: 7, priority: 'high', estimatedMinutes: 20 },
    ],
    recentActivity: [
      { id: 'act-k1', type: 'quiz', description: 'Completed Chapter 9 quiz — 76%', timestamp: '2026-08-10T10:00:00Z' },
    ],
    readinessTrendData: [54, 55, 56, 57, 58, 58],
  },
]

// ───────────────────────────────────────────────
// HELPER FUNCTIONS
// ───────────────────────────────────────────────

/** Get a demo student by ID */
export function getDemoStudentById(id: string): DemoStudentProfile | undefined {
  return demoClassStudents.find((s) => s.id === id)
}

/** Get the primary demo student (Isabella) */
export function getPrimaryDemoStudent(): DemoStudentProfile {
  return isabellaMartinez
}

/** Get all students in the demo class */
export function getDemoClassStudents(): DemoStudentProfile[] {
  return demoClassStudents
}

/** Get students who need instructor attention */
export function getStudentsNeedingAttention(): DemoStudentProfile[] {
  return demoClassStudents.filter((s) => s.riskStatus === 'high' || s.riskStatus === 'medium')
}

/** Get class-wide topic averages for heatmap */
export function getClassTopicAverages(): { topicId: string; topicName: string; classAvg: number; studentCount: number }[] {
  return DEMO_TOPICS.map((topic) => {
    const scores = demoClassStudents
      .map((s) => s.topicMastery.find((tm) => tm.topicId === topic.id)?.score ?? 0)
      .filter((score) => score > 0)
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    return {
      topicId: topic.id,
      topicName: topic.name,
      classAvg: avg,
      studentCount: scores.length,
    }
  }).filter((t) => t.studentCount > 0)
}

/** Get class overview statistics */
export function getClassOverview() {
  const students = demoClassStudents
  const totalStudents = students.length
  const avgProgress = Math.round(students.reduce((sum, s) => sum + s.overallProgress, 0) / totalStudents)
  const avgReadiness = Math.round(students.reduce((sum, s) => sum + s.readinessScore, 0) / totalStudents)
  const avgQuizScore = Math.round(students.reduce((sum, s) => sum + s.avgQuizScore, 0) / totalStudents)
  const studentsNeedingAttention = students.filter((s) => s.riskStatus === 'high' || s.riskStatus === 'medium').length
  const highPerformers = students.filter((s) => s.readinessScore >= 80).length

  return {
    className: DEMO_CLASS_NAME,
    schoolName: DEMO_SCHOOL_NAME,
    totalStudents,
    avgProgress,
    avgReadiness,
    avgQuizScore,
    studentsNeedingAttention,
    highPerformers,
  }
}

/** Get topic display name by ID */
export function getTopicName(topicId: string): string {
  return DEMO_TOPICS.find((t) => t.id === topicId)?.name ?? topicId
}

/** Get topic by ID */
export function getTopic(topicId: string): DemoTopic | undefined {
  return DEMO_TOPICS.find((t) => t.id === topicId)
}

/** Get the primary learning gap for a student (derived from lowest mastery score in weak areas) */
export function getPrimaryLearningGap(student: DemoStudentProfile): string | null {
  // If explicitly set, use that
  if (student.primaryLearningGap) {
    return student.primaryLearningGap
  }
  
  // Otherwise, derive from weak areas with lowest score
  if (student.weakAreas.length === 0) {
    return null
  }
  
  const weakTopicsWithScores = student.weakAreas
    .map(topicId => {
      const mastery = student.topicMastery.find(t => t.topicId === topicId)
      return { topicId, score: mastery?.score ?? 0 }
    })
    .filter(t => t.score > 0) // Only consider topics with actual scores
    .sort((a, b) => a.score - b.score)
  
  return weakTopicsWithScores.length > 0 ? weakTopicsWithScores[0].topicId : null
}

// ───────────────────────────────────────────────
// ISABELLA'S LEARNING GAP — DETAILED DATA
// For the Student ↔ Instructor connection demo.
// ───────────────────────────────────────────────

export const ISABELLA_LEARNING_GAP = {
  topicId: 'scalp-disorders',
  topicName: 'Scalp Disorders & Infections',
  chapterNumber: 10,
  chapterTitle: 'Properties and Disorders of the Hair and Scalp',
  quizScore: 62,
  passingScore: 80,
  classAverage: 76,
  keyConcepts: [
    'Identifying contagious vs. non-contagious scalp conditions',
    'Tinea capitis (ringworm of the scalp) recognition',
    'Tinea barbae (barber\'s itch) identification',
    'Scabies and pediculosis (lice) — when to stop service',
    'Proper referral procedures for medical conditions',
  ],
  missedQuestionTopics: [
    'Tinea barbae identification',
    'Contagious condition protocols',
    'Scabies recognition',
    'Folliculitis vs. pseudofolliculitis',
  ],
  studentViewSummary:
    'Your Chapter 10 quiz showed difficulty identifying contagious scalp conditions. Reviewing these concepts will strengthen your board exam readiness.',
  instructorViewSummary:
    'Isabella scored 62% on Chapter 10 (Hair & Scalp Properties), significantly below her 82% average. Her primary difficulty is identifying contagious scalp conditions — a critical safety topic for the board exam.',
  recommendedStudy: [
    'Review Chapter 10 flashcards — Scalp Disorders & Infections section',
    'Focus on distinguishing tinea capitis, tinea barbae, scabies, and pediculosis',
    'Practice identifying which conditions require stopping service immediately',
    'Retake Chapter 10 quiz after review',
  ],
} as const
