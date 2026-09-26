import { describe, expect, it } from 'vitest'
import { buildChapter8PersistedReassessmentEvent, chapter8PersistedEventToEvidence } from './reassessment-evidence'

describe('C8-7 persisted reassessment evidence', () => {
  it('converts a completed reserve response into remediation_reassessment evidence', () => {
    const event = buildChapter8PersistedReassessmentEvent({
      attemptId: 'attempt-8-1',
      questionId: 'r8-equipment-safety-001',
      conceptFamilyId: 'ch8-equipment-safety',
      correct: true,
      answeredAt: '2026-09-26T15:55:00.000Z',
    })

    expect(event.source).toBe('remediation_reassessment')
    expect(event.attemptPhase).toBe('reassessment')
    expect(event.difficulty).toBe('scenario')

    expect(chapter8PersistedEventToEvidence('student-8', event)).toEqual({
      studentId: 'student-8',
      chapterId: 'ch-8',
      conceptFamilyId: 'ch8-equipment-safety',
      source: 'remediation_reassessment',
      itemId: 'r8-equipment-safety-001',
      difficulty: 'scenario',
      correct: true,
      attemptPhase: 'reassessment',
      timestamp: '2026-09-26T15:55:00.000Z',
    })
  })

  it('rejects a question/concept mismatch rather than contaminating evidence', () => {
    expect(() => buildChapter8PersistedReassessmentEvent({
      attemptId: 'attempt-8-2',
      questionId: 'r8-equipment-safety-001',
      conceptFamilyId: 'ch8-light-therapy-safety',
      correct: false,
      answeredAt: '2026-09-26T15:56:00.000Z',
    })).toThrow('not mapped to the supplied concept family')
  })
})
