import { describe, expect, test } from 'vitest'
import { calculateCanonicalStudentLearningMetrics } from '@/lib/student-level/metrics'
import type { QuizAttempt, StudentProgress } from '@/types'

describe('ADMIN-SUPPORT-ACCESS fixture readiness calculation', () => {
  test('unassessed student stays no-data rather than 0% readiness evidence', () => {
    const x=calculateCanonicalStudentLearningMetrics({userId:'fixture-no-data',attempts:[],progress:[],totalChapters:21})
    expect(x.hasReadinessEvidence).toBe(false)
    expect(x.hasQuizEvidence).toBe(false)
    expect(x.overallProgress).toBe(0)
  })
  test('single high quiz cannot imply whole-curriculum board readiness', () => {
    const attempts=[{user_id:'fixture-a',quiz_id:'quiz-4',percentage:100,total_questions:30,completed_at:'2020-01-01T00:00:00Z'}] as QuizAttempt[]
    const progress=[{user_id:'fixture-a',chapter_id:'ch-4',progress_percentage:100,flashcards_completed:false,quiz_completed:true}] as StudentProgress[]
    const x=calculateCanonicalStudentLearningMetrics({userId:'fixture-a',attempts,progress,totalChapters:21})
    expect(x.hasReadinessEvidence).toBe(true)
    expect(x.averageQuizScore).toBe(100)
    expect(x.overallProgress).toBe(5)
    expect(x.readiness.score).toBe(57)
    expect(x.readiness.level).toBe('At Risk')
  })
})
