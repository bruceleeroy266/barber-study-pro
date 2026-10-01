import type { TLSPublicSnapshot } from '@/lib/tls/public'
import {
  evaluateTLSReadOnlyDiagnostic,
  type TLSIntegratedRemediationCycle,
} from './diagnostic-bridge'

export interface CertifiedChapterConceptSummary {
  conceptName: string
  mastery: number
  confidence:
    | 'insufficient_evidence'
    | 'emerging'
    | 'developing'
    | 'proficient'
    | 'strong'
  observations: number
  mostRecentEvidenceAt: string | null
  initialMisses: number
  reassessmentCorrect: number
}

export interface CertifiedChapterDiagnosticSummary {
  chapterGrade: {
    finalGrade: number
  }
  overallConfidence:
    | 'insufficient_evidence'
    | 'emerging'
    | 'developing'
    | 'proficient'
    | 'strong'
  concepts: readonly CertifiedChapterConceptSummary[]
}

export interface CertifiedDiagnosticIntegrationState {
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
 * TLS-1C.2 maps the common certified instructor-diagnostic summary shape
 * into the read-only TLS integration bridge.
 *
 * It deliberately uses chapterGrade.finalGrade as the authoritative score
 * and never derives safety/compliance or remediation state from raw answers.
 */
export function mapCertifiedDiagnosticSummaryToTLS(input: {
  audience: 'student' | 'instructor'
  summary: CertifiedChapterDiagnosticSummary
  integrationState?: CertifiedDiagnosticIntegrationState
}): TLSPublicSnapshot {
  return evaluateTLSReadOnlyDiagnostic({
    audience: input.audience,
    chapterPerformancePercent: input.summary.chapterGrade.finalGrade,
    overallConfidence: input.summary.overallConfidence,
    concepts: input.summary.concepts.map((concept) => ({ ...concept })),
    remediationCycles: input.integrationState?.remediationCycles ?? [],
    unresolvedSafetyRequirement:
      input.integrationState?.unresolvedSafetyRequirement ?? false,
    unresolvedComplianceRequirement:
      input.integrationState?.unresolvedComplianceRequirement ?? false,
    freshIndependentPostRecoveryEvidence:
      input.integrationState?.freshIndependentPostRecoveryEvidence ?? null,
  })
}
