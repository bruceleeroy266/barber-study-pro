import type { TLSPublicEvaluationRequest, TLSPublicSnapshot } from '@/lib/tls/public'
import { evaluateTLSPublicSnapshot } from '@/lib/tls/public'

export interface TLSIntegratedConceptDiagnostic {
  conceptName: string
  mastery: number
  confidence:
    | 'insufficient_evidence'
    | 'emerging'
    | 'developing'
    | 'proficient'
    | 'strong'
  observations: number
  initialMisses: number
  reassessmentCorrect: number
  mostRecentEvidenceAt: string | null
}

export interface TLSIntegratedRemediationCycle {
  status: 'targeted' | 'in_review' | 'review_completed' | 'reassessed' | 'evaluated'
  outcome: 'successful' | 'unsuccessful' | 'pending' | null
  isInterrupted?: boolean
  evaluatedAt?: string | null
}

export interface TLSReadOnlyDiagnosticBridgeInput {
  audience: TLSPublicEvaluationRequest['audience']
  chapterPerformancePercent: number | null
  overallConfidence:
    | 'insufficient_evidence'
    | 'emerging'
    | 'developing'
    | 'proficient'
    | 'strong'
  concepts: readonly TLSIntegratedConceptDiagnostic[]
  remediationCycles?: readonly TLSIntegratedRemediationCycle[]
  unresolvedSafetyRequirement?: boolean
  unresolvedComplianceRequirement?: boolean
  freshIndependentPostRecoveryEvidence?: {
    exists: boolean
    percent?: number | null
    observedAt?: string | null
  } | null
}

/**
 * TLS-1C.1 read-only diagnostic bridge.
 *
 * Lives outside the certified TLS core runtime and only consumes the public
 * TLS boundary. It converts already-certified chapter diagnostic summaries
 * into the public TLS request contract without querying storage, mutating
 * evidence, recalculating grades, or changing chapter behavior.
 */
export function buildTLSReadOnlyRequest(
  input: TLSReadOnlyDiagnosticBridgeInput,
): TLSPublicEvaluationRequest {
  return {
    audience: input.audience,
    evidence: {
      chapterPerformancePercent: input.chapterPerformancePercent,
      overallConfidence: input.overallConfidence,
      concepts: input.concepts.map((concept) => ({ ...concept })),
      remediationCycles: (input.remediationCycles ?? []).map((cycle) => ({
        ...cycle,
      })),
      unresolvedSafetyRequirement: input.unresolvedSafetyRequirement ?? false,
      unresolvedComplianceRequirement:
        input.unresolvedComplianceRequirement ?? false,
      freshIndependentPostRecoveryEvidence:
        input.freshIndependentPostRecoveryEvidence
          ? { ...input.freshIndependentPostRecoveryEvidence }
          : null,
    },
  }
}

export function evaluateTLSReadOnlyDiagnostic(
  input: TLSReadOnlyDiagnosticBridgeInput,
): TLSPublicSnapshot {
  return evaluateTLSPublicSnapshot(buildTLSReadOnlyRequest(input))
}
