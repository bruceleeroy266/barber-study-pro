import type { Chapter8EvidenceRecord } from './grading'
import { CHAPTER8_GRADE_WEIGHTS } from './grading'
import { getChapter8ConceptFamily } from './concepts'
import type { Chapter8ConceptFamilyId } from './types'
import {
  CHAPTER8_CRITICAL_SAFETY_CONCEPT_IDS,
  evaluateChapter8SafetyEscalation,
  type Chapter8SafetyConceptId,
} from './safety-mastery'

export type Chapter8InterventionFlagType = 'repeated_safety_misses'
export type Chapter8InterventionSeverity = 'priority' | 'urgent'

export interface Chapter8PreviousActiveFlag {
  type: Chapter8InterventionFlagType
  conceptFamilyId: Chapter8ConceptFamilyId
}

export interface Chapter8InterventionInput {
  evidence: readonly Chapter8EvidenceRecord[]
  previousActiveFlags?: readonly Chapter8PreviousActiveFlag[]
}

export interface Chapter8InterventionFlag {
  key: string
  type: Chapter8InterventionFlagType
  severity: Chapter8InterventionSeverity
  scope: 'concept'
  conceptFamilyId: Chapter8SafetyConceptId
  conceptName: string
  reason: string
  evidenceCount: number
  recentMissCount: number
  requiresInstructorReview: boolean
  requiresFormalReassessment: boolean
  firstObservedAt: string | null
  mostRecentObservedAt: string | null
}

function toTime(value: string): number {
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

function qualifyingEvidence(
  allEvidence: readonly Chapter8EvidenceRecord[],
  conceptFamilyId: Chapter8SafetyConceptId,
): Chapter8EvidenceRecord[] {
  return allEvidence
    .filter(
      (record) =>
        record.conceptFamilyId === conceptFamilyId &&
        (record.difficulty === 'application' || record.difficulty === 'scenario'),
    )
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
}

function isPreviousSafetyFlagActive(
  previous: readonly Chapter8PreviousActiveFlag[],
  conceptFamilyId: Chapter8SafetyConceptId,
): boolean {
  return previous.some(
    (flag) =>
      flag.type === 'repeated_safety_misses' &&
      flag.conceptFamilyId === conceptFamilyId,
  )
}

export function evaluateChapter8InterventionFlags(
  input: Chapter8InterventionInput,
): Chapter8InterventionFlag[] {
  const previous = input.previousActiveFlags ?? []
  const flags: Chapter8InterventionFlag[] = []

  for (const conceptFamilyId of CHAPTER8_CRITICAL_SAFETY_CONCEPT_IDS) {
    const result = evaluateChapter8SafetyEscalation(input.evidence, conceptFamilyId)
    if (!result) continue

    const wasActive = isPreviousSafetyFlagActive(previous, conceptFamilyId)
    const active = result.level === 'urgent' || result.level === 'watch'

    // Prior flags remain active only while the current evidence still requires review.
    // Five consecutive correct hard observations clear the underlying safety escalation.
    if (!active && wasActive) continue
    if (!active) continue

    const evidence = qualifyingEvidence(input.evidence, conceptFamilyId)
    const recent = evidence.slice(-3)
    const concept = getChapter8ConceptFamily(conceptFamilyId)

    flags.push({
      key: `repeated_safety_misses:${conceptFamilyId}`,
      type: 'repeated_safety_misses',
      severity: result.level === 'urgent' ? 'urgent' : 'priority',
      scope: 'concept',
      conceptFamilyId,
      conceptName: concept.name,
      reason: result.reason,
      evidenceCount: recent.length,
      recentMissCount: result.recentMissCount,
      requiresInstructorReview: result.requiresInstructorReview,
      requiresFormalReassessment: result.requiresFormalReassessment,
      firstObservedAt: recent[0]?.timestamp ?? null,
      mostRecentObservedAt: recent.at(-1)?.timestamp ?? null,
    })
  }

  return flags.sort((a, b) => {
    const severityRank: Record<Chapter8InterventionSeverity, number> = {
      urgent: 0,
      priority: 1,
    }
    return severityRank[a.severity] - severityRank[b.severity] ||
      a.key.localeCompare(b.key)
  })
}

// This export exists only as an explicit architecture guard for tests and consumers.
// Intervention state must never mutate or replace the shared Chapter 8 grade weights.
export const CHAPTER8_INTERVENTION_GRADE_WEIGHTS = CHAPTER8_GRADE_WEIGHTS
