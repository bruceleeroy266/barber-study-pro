/**
 * CHAPTER PERFORMANCE ANALYTICS
 * ASCYN PRO / Barber Study Pro V2
 */

import { AreaPerformance, QuizAttempt, StudentProgress } from '@/types'
import { ChapterMeta } from './types'
import { getCategoryForChapter, trendDirection } from './utils'
import { quizIdToChapterId } from './utils'

export function calculateChapterPerformance(
  chapters: ChapterMeta[],
  attempts: QuizAttempt[],
  progress: StudentProgress[]
): AreaPerformance[] {
  const chapterAttempts = new Map<string, QuizAttempt[]>()

  for (const attempt of attempts) {
    const chapterId = quizIdToChapterId(attempt.quiz_id)
    if (!chapterId) continue
    if (!chapterAttempts.has(chapterId)) {
      chapterAttempts.set(chapterId, [])
    }
    chapterAttempts.get(chapterId)!.push(attempt)
  }

  const chapterPerformance: AreaPerformance[] = []

  for (const chapter of chapters) {
    const attemptsForChapter = chapterAttempts.get(chapter.id) || []
    const scores = attemptsForChapter.map((a) => a.percentage)
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0

    const progressRecord = progress.find((p) => p.chapter_id === chapter.id)
    const attemptsCount = attemptsForChapter.length
    const trend = trendDirection(scores)

    chapterPerformance.push({
      id: `chapter-${chapter.id}`,
      name: `Ch.${chapter.chapter_number} ${chapter.title}`,
      chapterNumber: chapter.chapter_number,
      category: getCategoryForChapter(chapter.chapter_number),
      score: bestScore || (progressRecord?.progress_percentage ?? 0),
      attempts: attemptsCount,
      trend,
      lastAttemptAt: attemptsForChapter[0]?.completed_at || null,
    })
  }

  return chapterPerformance
}
