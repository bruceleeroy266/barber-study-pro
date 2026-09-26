import type { Chapter8ConceptFamilyId } from './types'
import type { Chapter8EvidenceRecord } from './grading'

export const CHAPTER8_CRITICAL_SAFETY_CONCEPT_IDS = [
  'ch8-equipment-safety',
  'ch8-light-therapy-safety',
] as const satisfies readonly Chapter8ConceptFamilyId[]

export type Chapter8SafetyConceptId = (typeof CHAPTER8_CRITICAL_SAFETY_CONCEPT_IDS)[number]

export type Chapter8SafetyEscalationLevel =
  | 'clear'
  | 'watch'
  | 'urgent'

export interface Chapter8SafetyEscalationResult {
  level: Chapter8SafetyEscalationLevel
  conceptFamilyId: Chapter8SafetyConceptId
  recentObservationCount: number
  recentMissCount: number
  consecutiveCorrectAtEnd: number
  requiresInstructorReview: boolean
  requiresFormalReassessment: boolean
  reason: string
}

export const CHAPTER8_SAFETY_MASTERY_RULES = {
  qualifyingDifficulties: ['application', 'scenario'] as const,
  reviewWindow: 3,
  watchAfterSingleScenarioMiss: true,
  urgentMissesInWindow: 2,
  urgentMinUniqueItems: 2,
  clearConsecutiveCorrect: 5,
  formalReassessmentQuestionCount: 5,
  formalReassessmentPassPercent: 100,
} as const

function isCriticalSafetyConcept(
  value: Chapter8ConceptFamilyId,
): value is Chapter8SafetyConceptId {
  return (CHAPTER8_CRITICAL_SAFETY_CONCEPT_IDS as readonly string[]).includes(value)
}

function toTime(value: string): number {
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

function qualifyingEvidence(
  records: readonly Chapter8EvidenceRecord[],
  conceptFamilyId: Chapter8SafetyConceptId,
): Chapter8EvidenceRecord[] {
  return records
    .filter(
      (record) =>
        record.conceptFamilyId === conceptFamilyId &&
        (record.difficulty === 'application' || record.difficulty === 'scenario'),
    )
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
}

function consecutiveCorrectAtEnd(records: readonly Chapter8EvidenceRecord[]): number {
  let count = 0
  for (let index = records.length - 1; index >= 0; index--) {
    if (!records[index].correct) break
    count += 1
  }
  return count
}

export function evaluateChapter8SafetyEscalation(
  records: readonly Chapter8EvidenceRecord[],
  conceptFamilyId: Chapter8ConceptFamilyId,
): Chapter8SafetyEscalationResult | null {
  if (!isCriticalSafetyConcept(conceptFamilyId)) return null

  const rules = CHAPTER8_SAFETY_MASTERY_RULES
  const qualifying = qualifyingEvidence(records, conceptFamilyId)
  const recent = qualifying.slice(-rules.reviewWindow)
  const recentMisses = recent.filter((record) => !record.correct)
  const uniqueMissItems = new Set(recentMisses.map((record) => record.itemId)).size
  const trailingCorrect = consecutiveCorrectAtEnd(qualifying)

  if (trailingCorrect >= rules.clearConsecutiveCorrect) {
    return {
      level: 'clear',
      conceptFamilyId,
      recentObservationCount: recent.length,
      recentMissCount: recentMisses.length,
      consecutiveCorrectAtEnd: trailingCorrect,
      requiresInstructorReview: false,
      requiresFormalReassessment: false,
      reason: `Safety escalation cleared after ${trailingCorrect} consecutive correct application/scenario observations.`,
    }
  }

  if (
    recentMisses.length >= rules.urgentMissesInWindow &&
    uniqueMissItems >= rules.urgentMinUniqueItems
  ) {
    return {
      level: 'urgent',
      conceptFamilyId,
      recentObservationCount: recent.length,
      recentMissCount: recentMisses.length,
      consecutiveCorrectAtEnd: trailingCorrect,
      requiresInstructorReview: true,
      requiresFormalReassessment: true,
      reason: `${recentMisses.length} of the latest ${recent.length} high-priority safety observations were missed across ${uniqueMissItems} distinct items.`,
    }
  }

  const latest = qualifying.at(-1)
  if (
    rules.watchAfterSingleScenarioMiss &&
    latest &&
    !latest.correct &&
    latest.difficulty === 'scenario'
  ) {
    return {
      level: 'watch',
      conceptFamilyId,
      recentObservationCount: recent.length,
      recentMissCount: recentMisses.length,
      consecutiveCorrectAtEnd: trailingCorrect,
      requiresInstructorReview: true,
      requiresFormalReassessment: false,
      reason: 'The latest scenario-level safety observation was missed; instructor review is required before escalation is cleared.',
    }
  }

  return {
    level: 'clear',
    conceptFamilyId,
    recentObservationCount: recent.length,
    recentMissCount: recentMisses.length,
    consecutiveCorrectAtEnd: trailingCorrect,
    requiresInstructorReview: false,
    requiresFormalReassessment: false,
    reason: 'No repeated high-priority safety-miss pattern is active.',
  }
}
