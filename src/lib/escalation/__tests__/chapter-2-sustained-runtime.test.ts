import { describe, expect, it, vi } from 'vitest'
import type { ConceptDetectionResult } from '@/lib/chapter-2-concepts/detection'
import type { SustainedPerformanceTracking } from '../types'
import { syncChapter2SustainedPerformance } from '../chapter-2-sustained-runtime'

const conceptId = 'C-2-01' as const
const learningObjectiveId = 'LO-2-01' as const

function detection(state: ConceptDetectionResult['state']): ConceptDetectionResult {
  return {
    conceptId,
    learningObjectiveId,
    state,
    confidence: 'high',
    evidence: {
      conceptId,
      learningObjectiveId,
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

  it('breaks continuity without crediting the failing attempt as follow-up evidence', async () => {
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
    expect(result.followUpEvidenceRecorded).toBe(0)
    expect(mockService.recordFollowUpEvidence).not.toHaveBeenCalled()
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

  it('does not double-count follow-up evidence when the same quiz attempt was already recorded', async () => {
    const mockService = service({
      getTrackingState: vi.fn().mockResolvedValue(tracking()),
      recordFollowUpEvidence: vi.fn().mockResolvedValue({ success: true, alreadyRecorded: true }),
    })

    const result = await syncChapter2SustainedPerformance({
      userId: 'user-1',
      chapterId: 'ch-2',
      quizAttemptId: 'attempt-duplicate',
      quizAttemptAnswers: { 'q-1': 'a' },
      detectionResults: [detection('currently_performing_well')],
      service: mockService,
    })

    expect(mockService.recordFollowUpEvidence).toHaveBeenCalledTimes(1)
    expect(result.followUpEvidenceRecorded).toBe(0)
    expect(result.errors).toHaveLength(0)
  })

  it('does not report a reset when the service already executed it for this tracking period', async () => {
    const mockService = service({
      getTrackingState: vi.fn().mockResolvedValue(tracking()),
      checkResetEligibility: vi.fn().mockResolvedValue({ isEligible: true }),
      executeReset: vi.fn().mockResolvedValue({ success: true, alreadyExecuted: true, resetId: 'reset-1' }),
    })

    const result = await syncChapter2SustainedPerformance({
      userId: 'user-1',
      chapterId: 'ch-2',
      quizAttemptId: 'attempt-5',
      quizAttemptAnswers: { 'q-1': 'a' },
      detectionResults: [detection('currently_performing_well')],
      service: mockService,
    })

    expect(mockService.executeReset).toHaveBeenCalledTimes(1)
    expect(result.resetsExecuted).toBe(0)
    expect(result.errors).toHaveLength(0)
  })

  it('captures a transition failure, skips reset for that concept, and keeps processing other concepts', async () => {
    const failingService = service({
      getTrackingState: vi.fn().mockResolvedValue(tracking()),
      recordDetectionTransition: vi.fn().mockResolvedValue({ success: false, error: 'database unavailable' }),
    })

    const okServiceCalls = { transitions: 0 }
    const otherConceptService = service({
      getTrackingState: vi.fn().mockResolvedValue(null),
      recordDetectionTransition: vi.fn().mockImplementation(async () => {
        okServiceCalls.transitions++
        return { success: true, trackingId: 'tracking-2' }
      }),
    })

    const failed = await syncChapter2SustainedPerformance({
      userId: 'user-1',
      chapterId: 'ch-2',
      quizAttemptId: 'attempt-6',
      quizAttemptAnswers: { 'q-1': 'a' },
      detectionResults: [detection('currently_performing_well')],
      service: failingService,
    })

    expect(failed.transitionsRecorded).toBe(0)
    expect(failed.errors).toHaveLength(1)
    expect(failed.errors[0]).toContain('database unavailable')
    expect(failingService.checkResetEligibility).not.toHaveBeenCalled()
    expect(failingService.executeReset).not.toHaveBeenCalled()

    // A second concept processed in the same run must be unaffected by the first failure.
    const second = await syncChapter2SustainedPerformance({
      userId: 'user-1',
      chapterId: 'ch-2',
      quizAttemptId: 'attempt-6',
      quizAttemptAnswers: { 'q-1': 'a' },
      detectionResults: [detection('currently_performing_well')],
      service: otherConceptService,
    })

    expect(second.transitionsRecorded).toBe(1)
    expect(second.errors).toHaveLength(0)
    expect(okServiceCalls.transitions).toBe(1)
  })

  it('captures a follow-up evidence failure instead of silently losing it', async () => {
    const mockService = service({
      getTrackingState: vi.fn().mockResolvedValue(tracking()),
      recordFollowUpEvidence: vi.fn().mockResolvedValue({ success: false, error: 'write conflict' }),
    })

    const result = await syncChapter2SustainedPerformance({
      userId: 'user-1',
      chapterId: 'ch-2',
      quizAttemptId: 'attempt-7',
      quizAttemptAnswers: { 'q-1': 'a' },
      detectionResults: [detection('currently_performing_well')],
      service: mockService,
    })

    expect(result.followUpEvidenceRecorded).toBe(0)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toContain('write conflict')
    // The transition itself is still recorded — one failed evidence write must
    // not corrupt the tracking lifecycle.
    expect(result.transitionsRecorded).toBe(1)
  })
})
