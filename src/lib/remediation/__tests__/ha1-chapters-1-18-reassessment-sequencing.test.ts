import { describe, expect, it } from 'vitest'
import { getKnowledgeCheckLength, getKnowledgeCheckProgress, type IKnowledgeCheckDbClient } from '../knowledge-check'

const CHAPTERS = Array.from({ length: 18 }, (_, index) => `ch-${index + 1}`) as Array<`ch-${number}`>

function dbWithAttempts(count: number): IKnowledgeCheckDbClient {
  return {
    async getReassessmentAttemptsForCycle() {
      return Array.from({ length: count }, (_, index) => ({
        id: `attempt-${index + 1}`,
        completed_at: `2026-09-30T00:00:0${index}Z`,
      }))
    },
    async getReassessmentReservationsForCycle() {
      return []
    },
    async quizAttemptExists() {
      return false
    },
  }
}

describe('HA1-01 Chapters 1-18 persisted reassessment sequencing', () => {
  it.each(CHAPTERS)('%s requires exactly five fresh persisted answers', (chapterId) => {
    expect(getKnowledgeCheckLength(chapterId)).toBe(5)
  })

  it.each(CHAPTERS)('%s cannot complete/evaluate after answers 1-4 and completes at answer 5', async (chapterId) => {
    const requiredCount = getKnowledgeCheckLength(chapterId)
    for (let answered = 0; answered < 5; answered += 1) {
      const progress = await getKnowledgeCheckProgress(
        dbWithAttempts(answered),
        'cycle-ha1',
        'student-ha1',
        requiredCount,
      )
      expect(progress.answeredCount).toBe(answered)
      expect(progress.isComplete).toBe(false)
    }

    const complete = await getKnowledgeCheckProgress(
      dbWithAttempts(5),
      'cycle-ha1',
      'student-ha1',
      requiredCount,
    )
    expect(complete.answeredCount).toBe(5)
    expect(complete.isComplete).toBe(true)
    expect(complete.answeredAttemptIds).toHaveLength(5)
  })
})
