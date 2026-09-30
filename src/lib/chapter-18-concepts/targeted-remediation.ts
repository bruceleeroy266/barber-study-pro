import { calculateChapter18ConceptMastery, type Chapter18EvidenceRecord } from './grading'
import { CHAPTER18_CONCEPT_FAMILY_IDS, getChapter18ConceptFamily } from './concepts'
import {
  getChapter18FlashcardsForConcept,
  getChapter18RemediationContentBlocksForConcept,
} from './mappings'
import {
  CHAPTER18_SAFETY_RULES,
  evaluateChapter18SafetyIntervention,
  getChapter18SafetyTag,
  type Chapter18SafetyInterventionLevel,
} from './safety-intervention'
import type { Chapter18ConceptFamilyId } from './types'

export interface Chapter18RemediationTarget {
  conceptFamilyId: Chapter18ConceptFamilyId
  conceptName: string
  mastery: number
  confidence: ReturnType<typeof calculateChapter18ConceptMastery>['confidence']
  observationCount: number
  sourceTypeCount: number
  initialMissCount: number
  remediationContentBlockIds: readonly string[]
  remediationFlashcardIds: readonly string[]
  priority: 'standard' | 'priority' | 'urgent'
  requiresFormalReassessment: boolean
  plannedReassessmentQuestionCount: 5
  plannedReassessmentPassPercent: 80 | 100
  safetyEscalation: Chapter18SafetyInterventionLevel | null
  reason: string
}

export interface Chapter18RemediationPlan {
  targets: Chapter18RemediationTarget[]
  preservedEvidence: readonly Chapter18EvidenceRecord[]
}

export const CHAPTER18_REMEDIATION_RULES = {
  ordinaryTargetMasteryAtOrBelow: 70,
  ordinaryMinInitialMisses: 2,
  minimumEvidenceForMasteryTarget: 2,
  ordinaryReassessmentQuestionCount: 5,
  ordinaryReassessmentPassPercent: 80,
  urgentSafetyReassessmentQuestionCount: 5,
  urgentSafetyReassessmentPassPercent: 100,
} as const

export function combineChapter18Evidence(
  ...sources: ReadonlyArray<readonly Chapter18EvidenceRecord[]>
): Chapter18EvidenceRecord[] {
  const combined: Chapter18EvidenceRecord[] = []
  const keys = new Set<string>()

  for (const records of sources) {
    for (const record of records) {
      if (record.chapterId !== 'ch-18') continue
      const key = [
        record.studentId,
        record.chapterId,
        record.source,
        record.attemptPhase,
        record.itemId,
      ].join('|')
      if (keys.has(key)) continue
      keys.add(key)
      combined.push(record)
    }
  }
  return combined
}

const toTime = (value: string): number => {
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

function getRecentSafetyMissConcepts(
  evidence: readonly Chapter18EvidenceRecord[],
): Set<Chapter18ConceptFamilyId> {
  const recentTagged = evidence
    .filter((record) => getChapter18SafetyTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
    .slice(-CHAPTER18_SAFETY_RULES.recentWindow)

  return new Set(
    recentTagged.filter((record) => !record.correct).map((record) => record.conceptFamilyId),
  )
}

export function buildChapter18TargetedRemediationPlan(
  evidence: readonly Chapter18EvidenceRecord[],
  referenceTime: string,
): Chapter18RemediationPlan {
  const targets: Chapter18RemediationTarget[] = []
  const safety = evaluateChapter18SafetyIntervention(evidence)
  const recentSafetyMissConcepts = getRecentSafetyMissConcepts(evidence)

  for (const conceptFamilyId of CHAPTER18_CONCEPT_FAMILY_IDS) {
    const conceptEvidence = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    if (conceptEvidence.length === 0) continue

    const mastery = calculateChapter18ConceptMastery(conceptEvidence, referenceTime)
    const ordinaryGap =
      (
        mastery.observationCount >= CHAPTER18_REMEDIATION_RULES.minimumEvidenceForMasteryTarget &&
        mastery.mastery <= CHAPTER18_REMEDIATION_RULES.ordinaryTargetMasteryAtOrBelow
      ) ||
      mastery.initialMissCount >= CHAPTER18_REMEDIATION_RULES.ordinaryMinInitialMisses

    const urgentSafetyGap =
      safety.level === 'urgent' && recentSafetyMissConcepts.has(conceptFamilyId)
    const prioritySafetyGap =
      safety.level === 'review' && safety.conceptFamilyId === conceptFamilyId

    if (!ordinaryGap && !urgentSafetyGap && !prioritySafetyGap) continue

    const concept = getChapter18ConceptFamily(conceptFamilyId)
    targets.push({
      conceptFamilyId,
      conceptName: concept.name,
      mastery: mastery.mastery,
      confidence: mastery.confidence,
      observationCount: mastery.observationCount,
      sourceTypeCount: mastery.sourceTypeCount,
      initialMissCount: mastery.initialMissCount,
      remediationContentBlockIds: getChapter18RemediationContentBlocksForConcept(conceptFamilyId),
      remediationFlashcardIds: getChapter18FlashcardsForConcept(conceptFamilyId),
      priority: urgentSafetyGap ? 'urgent' : prioritySafetyGap ? 'priority' : 'standard',
      requiresFormalReassessment: urgentSafetyGap || ordinaryGap,
      plannedReassessmentQuestionCount: 5,
      plannedReassessmentPassPercent: urgentSafetyGap ? 100 : 80,
      safetyEscalation: urgentSafetyGap ? 'urgent' : prioritySafetyGap ? 'review' : null,
      reason: urgentSafetyGap
        ? 'Recent misses span multiple Chapter 18 high-risk hazard classes.'
        : prioritySafetyGap
          ? 'A recent high-risk miss requires immediate targeted safety review.'
          : mastery.initialMissCount >= CHAPTER18_REMEDIATION_RULES.ordinaryMinInitialMisses
            ? 'Multiple preserved initial misses indicate a concept gap.'
            : 'Combined evidence mastery is at or below the Chapter 18 remediation threshold.',
    })
  }

  const priorityRank = { urgent: 0, priority: 1, standard: 2 } as const
  targets.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority] || a.mastery - b.mastery)

  return { targets, preservedEvidence: evidence }
}

export function buildChapter18RemediationPathForConcept(
  conceptFamilyId: Chapter18ConceptFamilyId,
): {
  conceptFamilyId: Chapter18ConceptFamilyId
  contentBlockIds: readonly string[]
  flashcardIds: readonly string[]
  plannedReassessmentQuestionCount: 5
  plannedReassessmentPassPercent: 80
} {
  return {
    conceptFamilyId,
    contentBlockIds: getChapter18RemediationContentBlocksForConcept(conceptFamilyId),
    flashcardIds: getChapter18FlashcardsForConcept(conceptFamilyId),
    plannedReassessmentQuestionCount: CHAPTER18_REMEDIATION_RULES.ordinaryReassessmentQuestionCount,
    plannedReassessmentPassPercent: CHAPTER18_REMEDIATION_RULES.ordinaryReassessmentPassPercent,
  }
}
