import { describe, expect, it, vi } from 'vitest'
import type { ConceptDetectionResult } from '@/lib/chapter-2-concepts/detection'
import type { SustainedPerformanceTracking } from '../types'
import { syncChapter2SustainedPerformance } from '../chapter-2-sustained-runtime'

const conceptId = 'ch2-c1' as const

function detection(state: ConceptDetectionResult['state']): ConceptDetectionResult {
  return {
    conceptId,
    learningObjectiveId: 'ch2-lo1',
    state,
    confidence: 'high',
    evidence: {
      conceptId,
      learningObjectiveId: 'ch2-lo1',
      totalObservations: 4,
      uniqueQuestions: 2,
      uniqueQuestionsMissed: state === 'currently_performing_well' ? 0 : 1,
      misses: state === 'currently_performing_well' ? 0 : 1,
      correct: state === 'currently_performing_well' ? 4 : 3,
      missRate: state === 'currently_performing_well' ? 0 : 0.25,
      consecutiveRecentCorrect: state === 'currently_performing_well' ? 3 : 0,
      consecutiveRecentMisses: state === 'currently_performing_well' ? 0 : 1,
      pattern: 'consistent',
      hasHistoricalWeakness: state !== 'currently_performing_well',
      firstAttemptAt: '2026-08-01T00:00:00.000Z',
      lastAttemptAt: '2026-09-13T00:00:00.000Z',
    },
    flags: [],
    lastUpdated: '2026-09-13T00:00:00.000Z',
  }
}

function tracking(): SustainedPerformanceTracking {
  return {
    id: 'tracking-1',
    userId: 'user-1',
    conceptId,
    chapterId: 'ch-2',
    enteredCpwAt: new Date('2026-08-01T00:00:00.000Z'),
    lastVerifiedAt: new Date('2026-09-01T00:00:00.000Z'),
    continuityBrokenAt: null,
    followUpEvidenceCount: 0,
    followUpEvidenceIds: [],
    isActive: true,
    resetAt: null,
    resetId: null,
    createdAt: new Date('2026-08-01T00:00:00.000Z'),
    updatedAt: new Date('2026-09-01T00:00:00.000Z'),
  }
}

function service(overrides: Record<string, unknown> = {}) {
  return {
    getTrackingState: vi.fn().mockResolvedValue(null),
    isActivelyTracking: vi.fn().mockReturnValue(true),
    recordFollowUpEvidence: vi.fn().mockResolvedValue({ success: true, evidenceId: 'evidence-1' }),
    recordDetectionTransition: vi.fn().mockResolvedValue({ success: true, trackingId: 'tracking-1' }),
    checkResetEligibility: vi.fn().mockResolvedValue({ isEligible: false }),
    executeReset: vi.fn().mockResolvedValue({ success: true, resetId: 'reset-1' }),
    ...overrides,
  }
}

describe('Chapter 2 sustained-performance runtime', () => {
  it('starts tracking on the first currently-performing-well detection without counting the same attempt as follow-up evidence', async () => {
    const mockService = service()

    const result = await syncChapter2SustainedPerformance({
      userId: 'user-1',
      chapterId: 'ch-2',
      quizAttemptId: 'attempt-1',
      quizAttemptAnswers: { 'q-1': 'a' },
      detectionResults: [detection('currently_performing_well')],
      service: mockService,
    })

    expect(result.transitionsRecorded).toBe(1)
    expect(result.followUpEvidenceRecorded).toBe(0)
    expect(mockService.recordFollowUpEvidence).not.toHaveBeenCalled()
    expect(mockService.recordDetectionTransition).toHaveBeenCalledTimes(1)
    expect(mockService.executeReset).not.toHaveBeenCalled()
  })

  it('records later mapped evidence and executes reset when an active CPW period becomes eligible', async () => {
    const mockService = service({
      getTrackingState: vi.fn().mockResolvedValue(tracking()),
      checkResetEligibility: vi.fn().mockResolvedValue({ isEligible: true }),
    })

    const result = await syncChapter2SustainedPerformance({
      userId: 'user-1',
      chapterId: 'ch-2',
      quizAttemptId: 'attempt-2',
      quizAttemptAnswers: { 'q-1': 'a' },
      detectionResults: [detection('currently_performing_well')],
      service: mockService,
    })

    expect(result.followUpEvidenceRecorded).toBe(1)
    expect(result.transitionsRecorded).toBe(1)
    expect(result.resetsExecuted).toBe(1)
    expect(mockService.recordFollowUpEvidence).toHaveBeenCalledTimes(1)
    expect(mockService.executeReset).toHaveBeenCalledWith('user-1', conceptId)
  })

  it('breaks continuity for an existing tracking period when the concept leaves CPW and does not reset', async () => {
    const mockService = service({
      getTrackingState: vi.fn().mockResolvedValue(tracking()),
    })

    const result = await syncChapter2SustainedPerformance({
      userId: 'user-1',
      chapterId: 'ch-2',
      quizAttemptId: 'attempt-3',
      quizAttemptAnswers: { 'q-1': 'b' },
      detectionResults: [detection('emerging_weakness')],
      service: mockService,
    })

    expect(result.transitionsRecorded).toBe(1)
    expect(mockService.recordDetectionTransition).toHaveBeenCalledWith(
      expect.objectContaining({ newState: 'emerging_weakness' }),
    )
    expect(mockService.checkResetEligibility).not.toHaveBeenCalled()
    expect(mockService.executeReset).not.toHaveBeenCalled()
  })

  it('does not create sustained tracking for a weak concept that has no active CPW period', async () => {
    const mockService = service()

    const result = await syncChapter2SustainedPerformance({
      userId: 'user-1',
      chapterId: 'ch-2',
      quizAttemptId: 'attempt-4',
      quizAttemptAnswers: { 'q-1': 'b' },
      detectionResults: [detection('repeated_weakness')],
      service: mockService,
    })

    expect(result.transitionsRecorded).toBe(0)
    expect(mockService.recordDetectionTransition).not.toHaveBeenCalled()
    expect(mockService.recordFollowUpEvidence).not.toHaveBeenCalled()
  })
})
