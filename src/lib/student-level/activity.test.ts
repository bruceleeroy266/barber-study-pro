import { describe, expect, it } from 'vitest'
import type { QuizAttempt, StudentProgress } from '@/types'
import { resolveLastLearningActivityAt } from './activity'

const progress = (lastStudiedAt: string | null) => ({
  last_studied_at: lastStudiedAt,
}) as StudentProgress

const attempt = (completedAt: string) => ({
  completed_at: completedAt,
}) as QuizAttempt

describe('ADM-1D canonical last learning activity', () => {
  it('uses the newest timestamp across trusted activity, progress, and quizzes', () => {
    expect(resolveLastLearningActivityAt({
      progress: [progress('2026-10-01T12:00:00.000Z')],
      attempts: [attempt('2026-10-02T12:00:00.000Z')],
      trustedActivity: [{ last_active_at: '2026-10-03T12:00:00.000Z' }],
    })).toBe('2026-10-03T12:00:00.000Z')
  })

  it('uses a quiz completion when legacy progress activity is stale', () => {
    expect(resolveLastLearningActivityAt({
      progress: [progress('2026-09-30T12:00:00.000Z')],
      attempts: [attempt('2026-10-03T08:00:00.000Z')],
      trustedActivity: [],
    })).toBe('2026-10-03T08:00:00.000Z')
  })

  it('ignores invalid and missing timestamps', () => {
    expect(resolveLastLearningActivityAt({
      progress: [progress(null), progress('not-a-date')],
      attempts: [],
      trustedActivity: [{ last_active_at: null }],
    })).toBeNull()
  })
})
