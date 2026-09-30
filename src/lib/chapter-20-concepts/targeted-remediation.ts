import {
  calculateChapter20ConceptMastery,
  type Chapter20EvidenceRecord,
} from './grading'
import {
  CHAPTER20_CONCEPT_FAMILY_IDS,
  getChapter20ConceptFamily,
} from './concepts'
import {
  getChapter20FlashcardsForConcept,
  getChapter20RemediationContentBlocksForConcept,
} from './mappings'
import {
  CHAPTER20_COMPLIANCE_RULES,
  evaluateChapter20ComplianceIntervention,
  getChapter20ComplianceTag,
  type Chapter20ComplianceInterventionLevel,
} from './escalation'
import type { Chapter20ConceptFamilyId } from './types'

export type Chapter20RemediationPriority = 'standard' | 'compliance'

export interface Chapter20RemediationTarget {
  conceptFamilyId: Chapter20ConceptFamilyId
  conceptName: string
  mastery: number
  confidence: ReturnType<typeof calculateChapter20ConceptMastery>['confidence']
  observationCount: number
  sourceTypeCount: number
  initialMissCount: number
  remediationContentBlockIds: readonly string[]
  remediationFlashcardIds: readonly string[]
  priority: Chapter20RemediationPriority
  requiresFormalReassessment: boolean
  plannedReassessmentQuestionCount: 5
  plannedReassessmentPassPercent: 80
  safetyEscalation: null
  complianceEscalation: Chapter20ComplianceInterventionLevel | null
  reason: string
}

export interface Chapter20RemediationPlan {
  targets: Chapter20RemediationTarget[]
  preservedEvidence: readonly Chapter20EvidenceRecord[]
}

export const CHAPTER20_REMEDIATION_RULES = {
  ordinaryTargetMasteryAtOrBelow: 70,
  ordinaryMinInitialMisses: 2,
  minimumEvidenceForMasteryTarget: 2,
  ordinaryReassessmentQuestionCount: 5,
  ordinaryReassessmentPassPercent: 80,
  complianceReassessmentQuestionCount: 5,
  complianceReassessmentPassPercent: 80,
} as const

export function combineChapter20Evidence(
  ...sources: ReadonlyArray<readonly Chapter20EvidenceRecord[]>
): Chapter20EvidenceRecord[] {
  const combined: Chapter20EvidenceRecord[] = []
  const keys = new Set<string>()

  for (const records of sources) {
    for (const record of records) {
      if (record.chapterId !== 'ch-20') continue
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

function recentComplianceMissConcepts(
  evidence: readonly Chapter20EvidenceRecord[],
): Set<Chapter20ConceptFamilyId> {
  const tagged = evidence
    .filter((record) => getChapter20ComplianceTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
    .slice(-CHAPTER20_COMPLIANCE_RULES.recentWindow)

  return new Set(
    tagged
      .filter((record) => !record.correct)
      .map((record) => record.conceptFamilyId),
  )
}

export function buildChapter20TargetedRemediationPlan(
  evidence: readonly Chapter20EvidenceRecord[],
  referenceTime: string,
): Chapter20RemediationPlan {
  const targets: Chapter20RemediationTarget[] = []
  const compliance = evaluateChapter20ComplianceIntervention(evidence)
  const recentCompliance = recentComplianceMissConcepts(evidence)

  for (const conceptFamilyId of CHAPTER20_CONCEPT_FAMILY_IDS) {
    const conceptEvidence = evidence.filter(
      (record) => record.conceptFamilyId === conceptFamilyId,
    )
    if (conceptEvidence.length === 0) continue

    const mastery = calculateChapter20ConceptMastery(
      conceptEvidence,
      referenceTime,
    )
    const ordinaryGap =
      (mastery.observationCount >=
        CHAPTER20_REMEDIATION_RULES.minimumEvidenceForMasteryTarget &&
        mastery.mastery <=
          CHAPTER20_REMEDIATION_RULES.ordinaryTargetMasteryAtOrBelow) ||
      mastery.initialMissCount >=
        CHAPTER20_REMEDIATION_RULES.ordinaryMinInitialMisses

    const elevatedComplianceGap =
      compliance.level === 'elevated' &&
      recentCompliance.has(conceptFamilyId)
    const reviewComplianceGap =
      compliance.level === 'review' &&
      compliance.conceptFamilyId === conceptFamilyId

    if (!ordinaryGap && !elevatedComplianceGap && !reviewComplianceGap) {
      continue
    }

    const concept = getChapter20ConceptFamily(conceptFamilyId)
    targets.push({
      conceptFamilyId,
      conceptName: concept.name,
      mastery: mastery.mastery,
      confidence: mastery.confidence,
      observationCount: mastery.observationCount,
      sourceTypeCount: mastery.sourceTypeCount,
      initialMissCount: mastery.initialMissCount,
      remediationContentBlockIds:
        getChapter20RemediationContentBlocksForConcept(conceptFamilyId),
      remediationFlashcardIds:
        getChapter20FlashcardsForConcept(conceptFamilyId),
      priority:
        elevatedComplianceGap || reviewComplianceGap
          ? 'compliance'
          : 'standard',
      requiresFormalReassessment:
        elevatedComplianceGap || ordinaryGap,
      plannedReassessmentQuestionCount: 5,
      plannedReassessmentPassPercent: 80,
      safetyEscalation: null,
      complianceEscalation:
        elevatedComplianceGap
          ? 'elevated'
          : reviewComplianceGap
            ? 'review'
            : null,
      reason: elevatedComplianceGap
        ? 'Multiple distinct Chapter 20 compliance misses require elevated targeted review.'
        : reviewComplianceGap
          ? 'A tagged Chapter 20 compliance miss requires targeted review.'
          : mastery.initialMissCount >=
                CHAPTER20_REMEDIATION_RULES.ordinaryMinInitialMisses
            ? 'Multiple preserved initial misses indicate a concept gap.'
            : 'Combined evidence mastery is at or below the Chapter 20 remediation threshold.',
    })
  }

  targets.sort(
    (a, b) =>
      (a.priority === 'compliance' ? 0 : 1) -
        (b.priority === 'compliance' ? 0 : 1) ||
      a.mastery - b.mastery,
  )

  return { targets, preservedEvidence: evidence }
}

export function buildChapter20RemediationPathForConcept(
  conceptFamilyId: Chapter20ConceptFamilyId,
) {
  return {
    conceptFamilyId,
    contentBlockIds:
      getChapter20RemediationContentBlocksForConcept(conceptFamilyId),
    flashcardIds: getChapter20FlashcardsForConcept(conceptFamilyId),
    plannedReassessmentQuestionCount: 5 as const,
    plannedReassessmentPassPercent: 80 as const,
  }
}
