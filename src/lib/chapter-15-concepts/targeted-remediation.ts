import { calculateChapter15ConceptMastery, type Chapter15EvidenceRecord } from './grading'
import { CHAPTER15_CONCEPT_FAMILY_IDS, getChapter15ConceptFamily } from './concepts'
import { getChapter15ContentBlocksForConcept, getChapter15FlashcardsForConcept } from './mappings'
import {
  CHAPTER15_SAFETY_RULES,
  evaluateChapter15SafetyIntervention,
  getChapter15SafetyTag,
  type Chapter15SafetyInterventionLevel,
} from './safety-intervention'
import type { Chapter15ConceptFamilyId } from './types'

export interface Chapter15RemediationTarget {
  conceptFamilyId: Chapter15ConceptFamilyId
  conceptName: string
  mastery: number
  confidence: ReturnType<typeof calculateChapter15ConceptMastery>['confidence']
  observationCount: number
  sourceTypeCount: number
  initialMissCount: number
  remediationContentBlockIds: readonly string[]
  remediationFlashcardIds: readonly string[]
  priority: 'standard' | 'priority' | 'urgent'
  requiresFormalReassessment: boolean
  plannedReassessmentQuestionCount: 5
  plannedReassessmentPassPercent: 80 | 100
  safetyEscalation: Chapter15SafetyInterventionLevel | null
  reason: string
}

export interface Chapter15RemediationPlan {
  targets: Chapter15RemediationTarget[]
  preservedEvidence: readonly Chapter15EvidenceRecord[]
}

export const CHAPTER15_REMEDIATION_RULES = {
  ordinaryTargetMasteryAtOrBelow: 70,
  ordinaryMinInitialMisses: 2,
  minimumEvidenceForMasteryTarget: 2,
  ordinaryReassessmentQuestionCount: 5,
  ordinaryReassessmentPassPercent: 80,
  urgentSafetyReassessmentQuestionCount: 5,
  urgentSafetyReassessmentPassPercent: 100,
} as const

export function combineChapter15Evidence(
  ...sources: ReadonlyArray<readonly Chapter15EvidenceRecord[]>
): Chapter15EvidenceRecord[] {
  const combined: Chapter15EvidenceRecord[] = []
  const keys = new Set<string>()

  for (const records of sources) {
    for (const record of records) {
      if (record.chapterId !== 'ch-15') continue
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
  evidence: readonly Chapter15EvidenceRecord[],
): Set<Chapter15ConceptFamilyId> {
  const recentTagged = evidence
    .filter((record) => getChapter15SafetyTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
    .slice(-CHAPTER15_SAFETY_RULES.recentWindow)

  return new Set(
    recentTagged.filter((record) => !record.correct).map((record) => record.conceptFamilyId),
  )
}

export function buildChapter15TargetedRemediationPlan(
  evidence: readonly Chapter15EvidenceRecord[],
  referenceTime: string,
): Chapter15RemediationPlan {
  const targets: Chapter15RemediationTarget[] = []
  const safety = evaluateChapter15SafetyIntervention(evidence)
  const recentSafetyMissConcepts = getRecentSafetyMissConcepts(evidence)

  for (const conceptFamilyId of CHAPTER15_CONCEPT_FAMILY_IDS) {
    const conceptEvidence = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    if (conceptEvidence.length === 0) continue

    const mastery = calculateChapter15ConceptMastery(conceptEvidence, referenceTime)
    const ordinaryGap =
      (
        mastery.observationCount >= CHAPTER15_REMEDIATION_RULES.minimumEvidenceForMasteryTarget &&
        mastery.mastery <= CHAPTER15_REMEDIATION_RULES.ordinaryTargetMasteryAtOrBelow
      ) ||
      mastery.initialMissCount >= CHAPTER15_REMEDIATION_RULES.ordinaryMinInitialMisses

    const urgentSafetyGap =
      safety.level === 'urgent' && recentSafetyMissConcepts.has(conceptFamilyId)
    const prioritySafetyGap =
      safety.level === 'review' && safety.conceptFamilyId === conceptFamilyId

    if (!ordinaryGap && !urgentSafetyGap && !prioritySafetyGap) continue

    const concept = getChapter15ConceptFamily(conceptFamilyId)
    targets.push({
      conceptFamilyId,
      conceptName: concept.name,
      mastery: mastery.mastery,
      confidence: mastery.confidence,
      observationCount: mastery.observationCount,
      sourceTypeCount: mastery.sourceTypeCount,
      initialMissCount: mastery.initialMissCount,
      remediationContentBlockIds: getChapter15ContentBlocksForConcept(conceptFamilyId),
      remediationFlashcardIds: getChapter15FlashcardsForConcept(conceptFamilyId),
      priority: urgentSafetyGap ? 'urgent' : prioritySafetyGap ? 'priority' : 'standard',
      requiresFormalReassessment: urgentSafetyGap || ordinaryGap,
      plannedReassessmentQuestionCount: CHAPTER15_REMEDIATION_RULES.ordinaryReassessmentQuestionCount,
      plannedReassessmentPassPercent: urgentSafetyGap ? 100 : 80,
      safetyEscalation: urgentSafetyGap ? 'urgent' : prioritySafetyGap ? 'review' : null,
      reason: urgentSafetyGap
        ? concept.name + ' includes a recent urgent high-risk gap and requires targeted review plus a perfect five-question reassessment before recovery.'
        : prioritySafetyGap
          ? concept.name + ' includes the current high-risk miss and requires immediate targeted review.'
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

export function buildChapter15RemediationPathForConcept(
  conceptFamilyId: Chapter15ConceptFamilyId,
): {
  conceptFamilyId: Chapter15ConceptFamilyId
  contentBlockIds: readonly string[]
  flashcardIds: readonly string[]
} {
  return {
    conceptFamilyId,
    contentBlockIds: getChapter15ContentBlocksForConcept(conceptFamilyId),
    flashcardIds: getChapter15FlashcardsForConcept(conceptFamilyId),
  }
}
