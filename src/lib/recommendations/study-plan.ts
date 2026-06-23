/**
 * STUDY PLAN / RECOMMENDATIONS ENGINE
 * ASCYN PRO / Barber Study Pro V2
 *
 * Generates personalized study recommendations from readiness scores,
 * weak areas, strong areas, and missed questions.
 */

import {
  AreaPerformance,
  BoardReadiness,
  MissedQuestion,
  StudyRecommendation,
} from '@/types'

export interface RecommendationsInputs {
  userId: string
  readiness: BoardReadiness
  weakAreas: AreaPerformance[]
  strongAreas: AreaPerformance[]
  missedQuestions: MissedQuestion[]
  totalChapters: number
}

function nextIncompleteChapter(
  readiness: BoardReadiness,
  weakAreas: AreaPerformance[]
): { chapterNumber: number; title: string } | null {
  for (const area of weakAreas) {
    if (area.chapterNumber && area.score < 75) {
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

  const nextChapter = nextIncompleteChapter(readiness, weakAreas)

  if (nextChapter) {
    recommendations.push({
      id: `rec-study-${userId}-next`,
      type: 'study',
      title: `Study ${nextChapter.title}`,
      description:
        readiness.score < 70
          ? 'Focus here first — this chapter is your highest-priority gap.'
          : 'Continue building your knowledge with this chapter.',
      chapterNumber: nextChapter.chapterNumber,
      priority: readiness.score < 70 ? 'critical' : 'high',
      estimatedMinutes: readiness.recommendedStudyMinutes,
    })
  }

  if (missedQuestions.length > 0) {
    recommendations.push({
      id: `rec-review-${userId}-missed`,
      type: 'review',
      title: `Review ${missedQuestions.length} Missed Question${
        missedQuestions.length === 1 ? '' : 's'
      }`,
      description:
        'Retaking questions you missed is one of the fastest ways to raise your score.',
      chapterNumber: null,
      priority: missedQuestions.length >= 5 ? 'high' : 'medium',
      estimatedMinutes: Math.min(30, missedQuestions.length * 2),
    })
  }

  if (weakAreas.length > 0) {
    const topWeak = weakAreas[0]
    recommendations.push({
      id: `rec-review-${userId}-flashcards`,
      type: 'review',
      title: `Flashcard Review: ${topWeak.name}`,
      description: 'Spaced repetition will lock in the concepts you\'re struggling with.',
      chapterNumber: topWeak.chapterNumber,
      priority: topWeak.score < 60 ? 'critical' : 'high',
      estimatedMinutes: 15,
    })
  }

  if (readiness.quizAverage < 80 || weakAreas.length > 0) {
    recommendations.push({
      id: `rec-practice-${userId}-quiz`,
      type: 'practice',
      title: 'Take a Practice Quiz',
      description:
        readiness.score >= 80
          ? 'Stay sharp with a mixed-chapter practice quiz.'
          : 'Practice quizzes will expose weak spots before the board exam.',
      chapterNumber: null,
      priority: readiness.score < 70 ? 'high' : 'medium',
      estimatedMinutes: 20,
    })
  }

  if (readiness.score >= 85 && totalChapters >= 16) {
    recommendations.push({
      id: `rec-study-${userId}-stateboard`,
      type: 'study',
      title: 'State Board Preparation',
      description:
        'You\'re nearly ready. Focus on high-risk exam concepts like infection control and state law.',
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
