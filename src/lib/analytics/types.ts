import { QuizAttempt, QuizQuestion, StudentProgress } from '@/types'

export interface ChapterMeta {
  id: string
  chapter_number: number
  title: string
}

export interface AnalyticsInputs {
  userId: string
  attempts: QuizAttempt[]
  progress: StudentProgress[]
  chapters: ChapterMeta[]
  questions: QuizQuestion[]
}

export interface AnalyticsResult {
  categoryPerformance: import('@/types').AreaPerformance[]
  chapterPerformance: import('@/types').AreaPerformance[]
  weakAreas: import('@/types').AreaPerformance[]
  strongAreas: import('@/types').AreaPerformance[]
  missedQuestionTrend: { date: string; count: number }[]
  totalQuestionsAnswered: number
  totalCorrect: number
  totalIncorrect: number
  averageScore: number
}
