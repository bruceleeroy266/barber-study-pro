/**
 * STUDY PLAN / RECOMMENDATIONS ENGINE
 * ASCYN PRO / ASCYN PRO V2
 *
 * Generates personalized study recommendations from readiness scores,
 * weak areas, strong areas, and missed questions.
 */

import {
  AreaPerformance,
  BoardReadiness,
  MissedQuestion,
  StudyRecommendation,
  StudentProgress,
  QuizAttempt,
  Chapter,
} from '@/types'
import { quizIdToChapterId } from '@/lib/analytics/utils'
import { getLocalQuiz } from '@/lib/local-data'

export interface RecommendationsInputs {
  userId: string
  readiness: BoardReadiness
  weakAreas: AreaPerformance[]
  strongAreas: AreaPerformance[]
  missedQuestions: MissedQuestion[]
  totalChapters: number
  /** Explicit learning/readiness evidence gate for zero-data surfaces. */
  hasEvidence?: boolean
  chapterProgress?: StudentProgress[]
  quizAttempts?: QuizAttempt[]
  chapters?: Chapter[]
}

function nextIncompleteChapter(
  readiness: BoardReadiness,
  weakAreas: AreaPerformance[]
): { chapterNumber: number; title: string } | null {
  for (const area of weakAreas) {
    if (area.chapterNumber && area.score < 80) {
      return { chapterNumber: area.chapterNumber, title: area.name }
    }
  }

  const next = Math.min(readiness.chaptersCompleted + 1, readiness.totalChapters)
  if (next <= readiness.totalChapters) {
    return { chapterNumber: next, title: `Chapter ${next}` }
  }
  return null
}

export function generateStudyPlan(inputs: RecommendationsInputs): StudyRecommendation[] {
  const { userId, readiness, weakAreas, missedQuestions, totalChapters } = inputs
  const recommendations: StudyRecommendation[] = []
  const inferredEvidence =
    readiness.totalQuestionsAnswered > 0 ||
    readiness.chaptersCompleted > 0 ||
    readiness.quizCompletionRate > 0 ||
    readiness.flashcardEngagementRate > 0 ||
    weakAreas.length > 0 ||
    missedQuestions.length > 0
  const hasEvidence = inputs.hasEvidence ?? inferredEvidence

  if (!hasEvidence) {
    recommendations.push({
      id: `rec-start-${userId}`,
      type: 'study',
      title: 'Start your first learning activity',
      description: 'Complete a lesson, flashcard deck, or quiz to begin building personalized recommendations.',
      chapterNumber: 1,
      priority: 'medium',
      estimatedMinutes: 15,
    })
    return recommendations
  }

  // Authenticated chapter evidence takes precedence over derived weak-area rankings.
  const chapterStates = inputs.chapters && inputs.chapterProgress && inputs.quizAttempts
    ? inputs.chapters.map((chapter) => {
        const progress = inputs.chapterProgress!.find((p) => p.chapter_id === chapter.id)
        const scores = inputs.quizAttempts!
          .filter((a) => quizIdToChapterId(a.quiz_id) === chapter.id && !a.is_reassessment)
          .map((a) => a.percentage)
        const best = Math.max(-1, progress?.best_quiz_score ?? -1, ...scores)
        return {
          chapterNumber: chapter.chapter_number,
          title: `Ch.${chapter.chapter_number} ${chapter.title}`,
          passed: best >= (getLocalQuiz(chapter.id)?.passing_score ?? 80),
          complete: progress?.progress_percentage === 100,
          score: best >= 0 ? best : null,
        }
      })
    : null

  const failingChapter = chapterStates?.find((state) => state.score !== null && !state.passed)
  const incompleteChapter = chapterStates?.find((state) => !state.complete)
  const selectedChapter = failingChapter ?? incompleteChapter
  const nextChapter = chapterStates
    ? selectedChapter && { chapterNumber: selectedChapter.chapterNumber, title: selectedChapter.title }
    : nextIncompleteChapter(readiness, weakAreas)
  const needsCompletion = Boolean(selectedChapter?.passed && !selectedChapter.complete)
  const criticalGap = Boolean(selectedChapter && !selectedChapter.passed && selectedChapter.score !== null && selectedChapter.score < 60)

  if (nextChapter) {
    recommendations.push({
      id: `rec-study-${userId}-next`,
      type: 'study',
      title: `Study ${nextChapter.title}`,
      description:
        needsCompletion
          ? 'Your quiz is passed. Finish the remaining chapter requirements.'
          : criticalGap
          ? 'Your saved chapter assessment needs targeted review.'
          : 'Continue the chapter or finish its remaining requirements.',
      chapterNumber: nextChapter.chapterNumber,
      priority: criticalGap ? 'critical' : needsCompletion ? 'medium' : 'high',
      estimatedMinutes: readiness.recommendedStudyMinutes,
    })
  }

  if (missedQuestions.length > 0) {
    recommendations.push({
      id: `rec-review-${userId}-missed`,
      type: 'review',
      title: `Review ${missedQuestions.length} Current Missed Question${
        missedQuestions.length === 1 ? '' : 's'
      }`,
      description:
        'These are questions your most recent answers show still need review.',
      chapterNumber: null,
      priority: missedQuestions.length >= 5 ? 'high' : 'medium',
      estimatedMinutes: Math.min(30, missedQuestions.length * 2),
    })
  }

  if (weakAreas.length > 0) {
    const topWeak = weakAreas.find((area) => !chapterStates || !area.chapterNumber || !chapterStates.find((state) => state.chapterNumber === area.chapterNumber)?.passed)
    if (topWeak) recommendations.push({
      id: `rec-review-${userId}-flashcards`,
      type: 'review',
      title: `Flashcard Review: ${topWeak.name}`,
      description: 'Spaced repetition will lock in the concepts you\'re struggling with.',
      chapterNumber: topWeak.chapterNumber,
      priority: topWeak.score < 60 ? 'critical' : 'high',
      estimatedMinutes: 15,
    })
  }

  // Only offer a practice action when a real, active chapter quiz can be targeted.
  const practiceCandidates = (inputs.chapters ?? []).filter((chapter) =>
    chapter.is_active && Boolean(getLocalQuiz(chapter.id))
  )
  const practiceChapter = practiceCandidates.find((chapter) =>
    chapter.chapter_number === failingChapter?.chapterNumber
  ) ?? practiceCandidates.find((chapter) =>
    weakAreas.some((area) => area.chapterNumber === chapter.chapter_number)
  ) ?? practiceCandidates.find((chapter) =>
    chapter.chapter_number === incompleteChapter?.chapterNumber
  ) ?? practiceCandidates[0]

  if ((readiness.quizAverage < 80 || weakAreas.length > 0) && practiceChapter) {
    recommendations.push({
      id: `rec-practice-${userId}-quiz`,
      type: 'practice',
      title: 'Take a Practice Quiz',
      description:
        readiness.score >= 80
          ? 'Stay sharp with a mixed-chapter practice quiz.'
          : 'Practice quizzes will expose weak spots before the board exam.',
      chapterNumber: practiceChapter.chapter_number,
      priority: readiness.score < 70 ? 'high' : 'medium',
      estimatedMinutes: 20,
    })
  }

  if (readiness.score >= 85 && totalChapters >= 16) {
    recommendations.push({
      id: `rec-study-${userId}-ch16`,
      type: 'study',
      title: "Women's Haircutting & Styling",
      description:
        "You're nearly ready. Focus on women's haircut structures, hair analysis, texture and density, curly hair, overdirection, razor cutting, texturizing, wet styling, blow-drying, thermal styling, and finishing.",
      chapterNumber: 16,
      priority: 'medium',
      estimatedMinutes: 25,
    })
  }

  return recommendations
}

export function estimateExamReadinessWeeks(score: number): string {
  if (score >= 90) return 'Ready now — schedule your exam'
  if (score >= 80) return '1–2 weeks of polish'
  if (score >= 70) return '3–4 weeks of focused review'
  if (score >= 50) return '6–8 weeks of consistent study'
  return '10+ weeks — start with fundamentals'
}
