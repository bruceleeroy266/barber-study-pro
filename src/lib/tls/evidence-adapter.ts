import type {
  TLSRecoveryState,
  TLSStatusResolverInput,
  TLSWeaknessState,
} from './types'

export interface TLSConceptEvidenceSummary {
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

export interface TLSRemediationCycleSummary {
  status: 'targeted' | 'in_review' | 'review_completed' | 'reassessed' | 'evaluated'
  outcome: 'successful' | 'unsuccessful' | 'pending' | null
  isInterrupted?: boolean
  evaluatedAt?: string | null
}

export interface TLSFreshIndependentEvidenceSummary {
  exists: boolean
  percent?: number | null
  observedAt?: string | null
}

export interface TLSChapterEvidenceSnapshot {
  chapterPerformancePercent: number | null
  overallConfidence:
    | 'insufficient_evidence'
    | 'emerging'
    | 'developing'
    | 'proficient'
    | 'strong'
  concepts: readonly TLSConceptEvidenceSummary[]
  remediationCycles: readonly TLSRemediationCycleSummary[]
  unresolvedSafetyRequirement: boolean
  unresolvedComplianceRequirement: boolean
  freshIndependentPostRecoveryEvidence?: TLSFreshIndependentEvidenceSummary | null
}

function deriveWeaknessState(
  concepts: readonly TLSConceptEvidenceSummary[],
): TLSWeaknessState {
  const supported = concepts.filter((concept) => concept.observations > 0)
  const repeatedMiss = supported.some((concept) => concept.initialMisses >= 2)
  const multipleWeakConcepts =
    supported.filter((concept) => concept.mastery < 80 && concept.initialMisses > 0)
      .length >= 2

  if (repeatedMiss || multipleWeakConcepts) return 'significant_or_repeated'

  const hasSingleSignal = supported.some(
    (concept) => concept.initialMisses === 1 || concept.mastery < 80,
  )
  return hasSingleSignal ? 'single_signal' : 'none'
}

function deriveRecoveryState(
  cycles: readonly TLSRemediationCycleSummary[],
): TLSRecoveryState {
  if (cycles.some((cycle) => cycle.outcome === 'unsuccessful')) return 'failed'

  const active = [...cycles]
    .filter((cycle) => cycle.outcome !== 'successful' && cycle.outcome !== 'unsuccessful')
    .reverse()[0]

  if (active) {
    if (active.isInterrupted) return 'interrupted'
    if (active.status === 'targeted') return 'assigned'
    return 'in_progress'
  }

  if (cycles.some((cycle) => cycle.outcome === 'successful')) {
    return 'recovered_awaiting_confirmation'
  }

  return 'none'
}

function primaryFocus(
  concepts: readonly TLSConceptEvidenceSummary[],
): string | null {
  const supported = concepts.filter((concept) => concept.observations > 0)
  if (supported.length === 0) return null

  return [...supported].sort((a, b) => {
    if (a.mastery !== b.mastery) return a.mastery - b.mastery
    if (a.initialMisses !== b.initialMisses) return b.initialMisses - a.initialMisses
    return a.conceptName.localeCompare(b.conceptName)
  })[0]?.conceptName ?? null
}

function additionalAreaCount(
  concepts: readonly TLSConceptEvidenceSummary[],
  focus: string | null,
): number {
  if (!focus) return 0
  return concepts.filter(
    (concept) =>
      concept.observations > 0 &&
      concept.conceptName !== focus &&
      (concept.mastery < 80 || concept.initialMisses > 0),
  ).length
}

/**
 * TLS-1B.2 evidence adapter.
 *
 * This function translates already-certified chapter evidence into the pure
 * TLS resolver contract. It intentionally does not recalculate chapter grades,
 * alter evidence history, infer safety/compliance from raw answers, or mutate
 * remediation state.
 */
export function buildTLSStatusInput(
  snapshot: TLSChapterEvidenceSnapshot,
): TLSStatusResolverInput {
  const focus = primaryFocus(snapshot.concepts)
  const fresh = snapshot.freshIndependentPostRecoveryEvidence

  return {
    chapterPerformancePercent: snapshot.chapterPerformancePercent,
    evidenceSufficiency:
      snapshot.chapterPerformancePercent == null ||
      snapshot.overallConfidence === 'insufficient_evidence'
        ? 'insufficient'
        : 'sufficient',
    confidence: snapshot.overallConfidence,
    weaknessState: deriveWeaknessState(snapshot.concepts),
    recoveryState: deriveRecoveryState(snapshot.remediationCycles),
    unresolvedSafetyRequirement: snapshot.unresolvedSafetyRequirement,
    unresolvedComplianceRequirement: snapshot.unresolvedComplianceRequirement,
    hasFreshIndependentPostRecoveryEvidence: fresh?.exists === true,
    freshIndependentPostRecoveryPercent: fresh?.percent ?? null,
    primaryFocus: focus,
    additionalAreaCount: additionalAreaCount(snapshot.concepts, focus),
  }
}
