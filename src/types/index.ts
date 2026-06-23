export interface Profile {
  id: string
  email: string
  full_name: string
  role: 'student' | 'instructor' | 'apprentice' | 'admin'
  school_id: string | null
  barber_shop_name: string | null
  mentor_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface School {
  id: string
  name: string
  address: string | null
  contact_email: string | null
  subscription_status: 'active' | 'inactive' | 'trial'
  created_at: string
}

export interface Chapter {
  id: string
  chapter_number: number
  title: string
  description: string | null
  content: string | null
  order_index: number
  is_active: boolean
}

export interface Flashcard {
  id: string
  chapter_id: string
  front: string
  back: string
  category: string | null
  difficulty: 'easy' | 'medium' | 'hard' | null
  order_index: number
  is_active: boolean
}

export interface Quiz {
  id: string
  chapter_id: string
  title: string
  description: string | null
  is_active: boolean
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correct_answer: 'a' | 'b' | 'c' | 'd'
  explanation: string | null
  difficulty: 'easy' | 'medium' | 'hard'
  order_index: number
}

export interface QuizAttempt {
  id: string
  user_id: string
  quiz_id: string
  score: number
  total_questions: number
  percentage: number
  answers_json: Record<string, string>
  completed_at: string
}

export interface StudentProgress {
  id: string
  user_id: string
  chapter_id: string
  flashcards_completed: boolean
  quiz_completed: boolean
  best_quiz_score: number | null
  last_studied_at: string | null
  progress_percentage: number
}

export interface ChapterWithProgress extends Chapter {
  progress?: StudentProgress
  flashcardCount?: number
  quizQuestionCount?: number
}

export interface InstructorNote {
  id: string
  student_id: string
  instructor_id: string
  instructor_name: string
  note_type: 'coaching' | 'remediation' | 'readiness' | 'general'
  note_text: string
  created_at: string
}

export type HourCategory = 'Theory' | 'Practical' | 'Clinic' | 'Sanitation' | 'Makeup Hours' | 'Other'
export type HourStatus = 'pending' | 'approved' | 'rejected'

export interface HourLog {
  id: string
  user_id: string
  date: string
  category: HourCategory
  minutes: number
  status: HourStatus
  notes: string | null
  created_at: string
  updated_at: string
}

// ============================================================================
// PHASE 5 — BOARD READINESS, ANALYTICS, AND MISSED QUESTIONS
// ============================================================================

export type ReadinessLevel = 'Ready' | 'Nearly Ready' | 'Needs Review' | 'At Risk'

export interface BoardReadiness {
  userId: string
  score: number
  level: ReadinessLevel
  quizAverage: number
  quizCompletionRate: number
  chapterCompletionRate: number
  flashcardEngagementRate: number
  consistencyScore: number
  improvementTrend: 'improving' | 'stable' | 'declining'
  totalQuestionsAnswered: number
  chaptersCompleted: number
  totalChapters: number
  recommendedStudyMinutes: number
  updatedAt: string
}

export interface AreaPerformance {
  id: string
  name: string
  chapterNumber: number | null
  category: string
  score: number
  attempts: number
  trend: 'improving' | 'stable' | 'declining'
  lastAttemptAt: string | null
}

export interface StudyRecommendation {
  id: string
  type: 'study' | 'review' | 'practice'
  title: string
  description: string
  chapterNumber: number | null
  priority: 'critical' | 'high' | 'medium' | 'low'
  estimatedMinutes: number
}

export interface MissedQuestion {
  id: string
  userId: string
  questionId: string
  question: string
  correctAnswer: string
  studentAnswer: string
  explanation: string | null
  chapterId: string
  chapterNumber: number
  category: string
  quizId: string
  missedAt: string
  retakenAt: string | null
  timesMissed: number
}

export interface StudentAnalyticsSummary {
  userId: string
  totalQuestionsAnswered: number
  totalCorrect: number
  totalIncorrect: number
  averageScore: number
  quizzesCompleted: number
  flashcardsReviewed: number
  chaptersCompleted: number
  totalChapters: number
  streakDays: number
  lastStudyAt: string | null
  readiness: BoardReadiness
  weakAreas: AreaPerformance[]
  strongAreas: AreaPerformance[]
  recommendations: StudyRecommendation[]
  missedQuestions: MissedQuestion[]
}

export interface InstructorReadinessOverview {
  userId: string
  fullName: string
  email: string
  role: string
  readinessScore: number
  readinessLevel: ReadinessLevel
  weakestCategory: string | null
  lastActivityAt: string | null
}
