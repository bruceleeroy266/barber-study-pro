import { calculateChapter16ConceptMastery, type Chapter16EvidenceRecord } from './grading'
import { CHAPTER16_CONCEPT_FAMILY_IDS, getChapter16ConceptFamily } from './concepts'
import { getChapter16ContentBlocksForConcept, getChapter16FlashcardsForConcept } from './mappings'
import {
  CHAPTER16_SAFETY_RULES,
  evaluateChapter16SafetyIntervention,
  getChapter16SafetyTag,
  type Chapter16SafetyInterventionLevel,
} from './safety-intervention'
import type { Chapter16ConceptFamilyId } from './types'

export interface Chapter16RemediationTarget {
  conceptFamilyId: Chapter16ConceptFamilyId
  conceptName: string
  mastery: number
  confidence: ReturnType<typeof calculateChapter16ConceptMastery>['confidence']
  observationCount: number
  sourceTypeCount: number
  initialMissCount: number
  remediationContentBlockIds: readonly string[]
  remediationFlashcardIds: readonly string[]
  priority: 'standard' | 'priority' | 'urgent'
  requiresFormalReassessment: boolean
  plannedReassessmentQuestionCount: 5
  plannedReassessmentPassPercent: 80 | 100
  safetyEscalation: Chapter16SafetyInterventionLevel | null
  reason: string
}

export interface Chapter16RemediationPlan {
  targets: Chapter16RemediationTarget[]
  preservedEvidence: readonly Chapter16EvidenceRecord[]
}

export const CHAPTER16_REMEDIATION_RULES = {
  ordinaryTargetMasteryAtOrBelow: 70,
  ordinaryMinInitialMisses: 2,
  minimumEvidenceForMasteryTarget: 2,
  ordinaryReassessmentQuestionCount: 5,
  ordinaryReassessmentPassPercent: 80,
  urgentSafetyReassessmentQuestionCount: 5,
  urgentSafetyReassessmentPassPercent: 100,
} as const

const toTime = (value: string): number => {
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

function getRecentSafetyMissConcepts(
  evidence: readonly Chapter16EvidenceRecord[],
): Set<Chapter16ConceptFamilyId> {
  const recentTagged = evidence
    .filter((record) => getChapter16SafetyTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
    .slice(-CHAPTER16_SAFETY_RULES.recentWindow)

  return new Set(
    recentTagged.filter((record) => !record.correct).map((record) => record.conceptFamilyId),
  )
}

export function buildChapter16TargetedRemediationPlan(
  evidence: readonly Chapter16EvidenceRecord[],
  referenceTime: string,
): Chapter16RemediationPlan {
  const targets: Chapter16RemediationTarget[] = []
  const safety = evaluateChapter16SafetyIntervention(evidence)
  const recentSafetyMissConcepts = getRecentSafetyMissConcepts(evidence)

  for (const conceptFamilyId of CHAPTER16_CONCEPT_FAMILY_IDS) {
    const conceptEvidence = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    if (conceptEvidence.length === 0) continue

    const mastery = calculateChapter16ConceptMastery(conceptEvidence, referenceTime)
    const ordinaryGap =
      (
        mastery.observationCount >= CHAPTER16_REMEDIATION_RULES.minimumEvidenceForMasteryTarget &&
        mastery.mastery <= CHAPTER16_REMEDIATION_RULES.ordinaryTargetMasteryAtOrBelow
      ) ||
      mastery.initialMissCount >= CHAPTER16_REMEDIATION_RULES.ordinaryMinInitialMisses

    const urgentSafetyGap =
      safety.level === 'urgent' && recentSafetyMissConcepts.has(conceptFamilyId)
    const prioritySafetyGap =
      safety.level === 'review' && safety.conceptFamilyId === conceptFamilyId

    if (!ordinaryGap && !urgentSafetyGap && !prioritySafetyGap) continue

    const concept = getChapter16ConceptFamily(conceptFamilyId)
    targets.push({
      conceptFamilyId,
      conceptName: concept.name,
      mastery: mastery.mastery,
      confidence: mastery.confidence,
      observationCount: mastery.observationCount,
      sourceTypeCount: mastery.sourceTypeCount,
      initialMissCount: mastery.initialMissCount,
      remediationContentBlockIds: getChapter16ContentBlocksForConcept(conceptFamilyId),
      remediationFlashcardIds: getChapter16FlashcardsForConcept(conceptFamilyId),
      priority: urgentSafetyGap ? 'urgent' : prioritySafetyGap ? 'priority' : 'standard',
      requiresFormalReassessment: urgentSafetyGap || ordinaryGap,
      plannedReassessmentQuestionCount: CHAPTER16_REMEDIATION_RULES.ordinaryReassessmentQuestionCount,
      plannedReassessmentPassPercent: urgentSafetyGap ? 100 : 80,
      safetyEscalation: urgentSafetyGap ? 'urgent' : prioritySafetyGap ? 'review' : null,
      reason: urgentSafetyGap
        ? concept.name + ' includes a recent urgent safety gap and requires targeted review plus a perfect five-question reassessment before recovery.'
        : prioritySafetyGap
          ? concept.name + ' includes the current safety-sensitive miss and requires immediate targeted review.'
          : concept.name + ' is targeted because combined-evidence mastery is ' + mastery.mastery + '% with ' + mastery.initialMissCount + ' preserved initial misses.',
    })
  }

  const rank = { urgent: 0, priority: 1, standard: 2 } as const
  targets.sort((a, b) =>
    rank[a.priority] - rank[b.priority] ||
    a.mastery - b.mastery ||
    a.conceptFamilyId.localeCompare(b.conceptFamilyId),
  )

  return { targets, preservedEvidence: evidence }
}

export function buildChapter16RemediationPathForConcept(
  conceptFamilyId: Chapter16ConceptFamilyId,
): {
  conceptFamilyId: Chapter16ConceptFamilyId
  contentBlockIds: readonly string[]
  flashcardIds: readonly string[]
} {
  return {
    conceptFamilyId,
    contentBlockIds: getChapter16ContentBlocksForConcept(conceptFamilyId),
    flashcardIds: getChapter16FlashcardsForConcept(conceptFamilyId),
  }
}
