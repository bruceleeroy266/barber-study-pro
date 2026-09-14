import type { ChapterId, ConceptId } from '@/lib/reassessment/types'
import type { ConceptDetectionResult } from '@/lib/chapter-2-concepts/detection'
import type { SustainedPerformanceTracking } from './types'

export interface SustainedPerformanceRuntimeService {
  getTrackingState(userId: string, conceptId: ConceptId): Promise<SustainedPerformanceTracking | null>
  isActivelyTracking(tracking: SustainedPerformanceTracking): boolean
  recordFollowUpEvidence(
    params: {
      userId: string
      conceptId: ConceptId
      chapterId: ChapterId
      quizAttemptId: string
    },
    quizAttemptAnswers: Record<string, unknown>,
  ): Promise<{ success: boolean; alreadyRecorded?: boolean; error?: string }>
  recordDetectionTransition(params: {
    userId: string
    conceptId: ConceptId
    chapterId: ChapterId
    newState: ConceptDetectionResult['state']
    evidence: ConceptDetectionResult['evidence']
  }): Promise<{ success: boolean; error?: string }>
  checkResetEligibility(userId: string, conceptId: ConceptId): Promise<{ isEligible: boolean }>
  executeReset(userId: string, conceptId: ConceptId): Promise<{ success: boolean; alreadyExecuted?: boolean; resetId?: string; error?: string }>
}

export interface Chapter2SustainedRuntimeResult {
  transitionsRecorded: number
  followUpEvidenceRecorded: number
  resetsExecuted: number
  errors: string[]
}

export async function syncChapter2SustainedPerformance(params: {
  userId: string
  chapterId: ChapterId
  quizAttemptId: string
  quizAttemptAnswers: Record<string, unknown>
  detectionResults: Iterable<ConceptDetectionResult>
  service: SustainedPerformanceRuntimeService
}): Promise<Chapter2SustainedRuntimeResult> {
  const {
    userId,
    chapterId,
    quizAttemptId,
    quizAttemptAnswers,
    detectionResults,
    service,
  } = params

  const result: Chapter2SustainedRuntimeResult = {
    transitionsRecorded: 0,
    followUpEvidenceRecorded: 0,
    resetsExecuted: 0,
    errors: [],
  }

  for (const detection of detectionResults) {
    try {
      const trackingBefore = await service.getTrackingState(userId, detection.conceptId)
      const isEnteringCpw = detection.state === 'currently_performing_well'

      // Do not create tracking records for concepts that are not performing well.
      // Non-CPW states matter here only when an existing tracking period must be
      // continued/broken.
      if (!trackingBefore && !isEnteringCpw) {
        continue
      }

      // The attempt that first establishes currently_performing_well starts the
      // tracking period. Only later attempts may count as follow-up evidence.
      if (trackingBefore && service.isActivelyTracking(trackingBefore)) {
        const followUp = await service.recordFollowUpEvidence(
          {
            userId,
            conceptId: detection.conceptId,
            chapterId,
            quizAttemptId,
          },
          quizAttemptAnswers,
        )

        if (followUp.success && !followUp.alreadyRecorded) {
          result.followUpEvidenceRecorded++
        }
      }

      const transition = await service.recordDetectionTransition({
        userId,
        conceptId: detection.conceptId,
        chapterId,
        newState: detection.state,
        evidence: detection.evidence,
      })

      if (!transition.success) {
        result.errors.push(
          `Transition failed for ${detection.conceptId}: ${transition.error ?? 'unknown error'}`,
        )
        continue
      }

      result.transitionsRecorded++

      // A transition out of CPW only needs to break continuity. It can never
      // qualify for reset on the same observation.
      if (!isEnteringCpw) {
        continue
      }

      const eligibility = await service.checkResetEligibility(userId, detection.conceptId)
      if (!eligibility.isEligible) {
        continue
      }

      const reset = await service.executeReset(userId, detection.conceptId)
      if (!reset.success) {
        result.errors.push(
          `Reset failed for ${detection.conceptId}: ${reset.error ?? 'unknown error'}`,
        )
        continue
      }

      if (!reset.alreadyExecuted) {
        result.resetsExecuted++
      }
    } catch (error) {
      result.errors.push(
        `Sustained-performance sync failed for ${detection.conceptId}: ${error instanceof Error ? error.message : 'unknown error'}`,
      )
    }
  }

  return result
}
