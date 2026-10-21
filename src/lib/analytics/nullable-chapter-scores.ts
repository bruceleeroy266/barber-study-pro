import type { QuizAttempt } from '@/types'
import { selectCanonicalQuizAttempts } from './select-quiz-attempt'
import { quizIdToChapterId } from './utils'
import type { ChapterMeta } from './types'

export interface NullableChapterAcademicScore {
  chapterId: string
  latestPercent: number | null
  bestPercent: number | null
  firstPercent: number | null
  latestCorrect: number | null
  latestTotal: number | null
  attemptCount: number
  state: 'unassessed' | 'assessed'
}

/**
 * Source-of-truth sidecar for BOTH student and instructor report pipelines.
 * This never reads student_progress and cannot elevate completion to accuracy.
 * The caller must obtain school-authorized attempts before invoking.
 */
export function buildNullableChapterAcademicScores(
  chapters: readonly ChapterMeta[],
  attempts: readonly QuizAttempt[],
): NullableChapterAcademicScore[] {
  return chapters.map(chapter => {
    const chapterAttempts = attempts.filter(a => quizIdToChapterId(a.quiz_id) === chapter.id)
    const quizId = 'quiz-' + chapter.chapter_number
    const selected = selectCanonicalQuizAttempts(chapterAttempts, quizId)
    const percent = (a: typeof selected.latest) =>
      a ? Math.round((a.score / a.total_questions) * 10000) / 100 : null
    return {
      chapterId: chapter.id,
      latestPercent: percent(selected.latest),
      bestPercent: percent(selected.best),
      firstPercent: percent(selected.first),
      latestCorrect: selected.latest?.score ?? null,
      latestTotal: selected.latest?.total_questions ?? null,
      attemptCount: selected.count,
      state: selected.latest ? 'assessed' as const : 'unassessed' as const,
    }
  })
}
