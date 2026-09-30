import {
  calculateChapter19ConceptMastery,
  type Chapter19EvidenceRecord,
} from './grading'
import {
  CHAPTER19_CONCEPT_FAMILY_IDS,
  getChapter19ConceptFamily,
} from './concepts'
import {
  getChapter19FlashcardsForConcept,
  getChapter19RemediationContentBlocksForConcept,
} from './mappings'
import {
  CHAPTER19_COMPLIANCE_RULES,
  CHAPTER19_SAFETY_RULES,
  evaluateChapter19ComplianceIntervention,
  evaluateChapter19SafetyIntervention,
  getChapter19ComplianceTag,
  getChapter19SafetyTag,
  type Chapter19ComplianceInterventionLevel,
  type Chapter19SafetyInterventionLevel,
} from './escalation'
import type { Chapter19ConceptFamilyId } from './types'

export type Chapter19RemediationPriority =
  | 'standard'
  | 'compliance'
  | 'priority'
  | 'urgent'

export interface Chapter19RemediationTarget {
  conceptFamilyId: Chapter19ConceptFamilyId
  conceptName: string
  mastery: number
  confidence: ReturnType<typeof calculateChapter19ConceptMastery>['confidence']
  observationCount: number
  sourceTypeCount: number
  initialMissCount: number
  remediationContentBlockIds: readonly string[]
  remediationFlashcardIds: readonly string[]
  priority: Chapter19RemediationPriority
  requiresFormalReassessment: boolean
  plannedReassessmentQuestionCount: 5
  plannedReassessmentPassPercent: 80 | 100
  safetyEscalation: Chapter19SafetyInterventionLevel | null
  complianceEscalation: Chapter19ComplianceInterventionLevel | null
  reason: string
}

export interface Chapter19RemediationPlan {
  targets: Chapter19RemediationTarget[]
  preservedEvidence: readonly Chapter19EvidenceRecord[]
}

export const CHAPTER19_REMEDIATION_RULES = {
  ordinaryTargetMasteryAtOrBelow: 70,
  ordinaryMinInitialMisses: 2,
  minimumEvidenceForMasteryTarget: 2,
  ordinaryReassessmentQuestionCount: 5,
  ordinaryReassessmentPassPercent: 80,
  urgentSafetyReassessmentQuestionCount: 5,
  urgentSafetyReassessmentPassPercent: 100,
  complianceReassessmentQuestionCount: 5,
  complianceReassessmentPassPercent: 80,
} as const

export function combineChapter19Evidence(
  ...sources: ReadonlyArray<readonly Chapter19EvidenceRecord[]>
): Chapter19EvidenceRecord[] {
  const combined: Chapter19EvidenceRecord[] = []
  const keys = new Set<string>()

  for (const records of sources) {
    for (const record of records) {
      if (record.chapterId !== 'ch-19') continue
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

function recentTaggedMissConcepts(
  evidence: readonly Chapter19EvidenceRecord[],
  kind: 'safety' | 'compliance',
): Set<Chapter19ConceptFamilyId> {
  const window =
    kind === 'safety'
      ? CHAPTER19_SAFETY_RULES.recentWindow
      : CHAPTER19_COMPLIANCE_RULES.recentWindow

  const tagged = evidence
    .filter((record) =>
      kind === 'safety'
        ? getChapter19SafetyTag(record.itemId) !== null
        : getChapter19ComplianceTag(record.itemId) !== null,
    )
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
    .slice(-window)

  return new Set(
    tagged
      .filter((record) => !record.correct)
      .map((record) => record.conceptFamilyId),
  )
}

export function buildChapter19TargetedRemediationPlan(
  evidence: readonly Chapter19EvidenceRecord[],
  referenceTime: string,
): Chapter19RemediationPlan {
  const targets: Chapter19RemediationTarget[] = []
  const safety = evaluateChapter19SafetyIntervention(evidence)
  const compliance = evaluateChapter19ComplianceIntervention(evidence)
  const recentSafetyMissConcepts = recentTaggedMissConcepts(evidence, 'safety')
  const recentComplianceMissConcepts = recentTaggedMissConcepts(
    evidence,
    'compliance',
  )

  for (const conceptFamilyId of CHAPTER19_CONCEPT_FAMILY_IDS) {
    const conceptEvidence = evidence.filter(
      (record) => record.conceptFamilyId === conceptFamilyId,
    )
    if (conceptEvidence.length === 0) continue

    const mastery = calculateChapter19ConceptMastery(
      conceptEvidence,
      referenceTime,
    )

    const ordinaryGap =
      (mastery.observationCount >=
        CHAPTER19_REMEDIATION_RULES.minimumEvidenceForMasteryTarget &&
        mastery.mastery <=
          CHAPTER19_REMEDIATION_RULES.ordinaryTargetMasteryAtOrBelow) ||
      mastery.initialMissCount >=
        CHAPTER19_REMEDIATION_RULES.ordinaryMinInitialMisses

    const urgentSafetyGap =
      safety.level === 'urgent' &&
      recentSafetyMissConcepts.has(conceptFamilyId)

    const prioritySafetyGap =
      safety.level === 'review' &&
      safety.conceptFamilyId === conceptFamilyId

    const elevatedComplianceGap =
      compliance.level === 'elevated' &&
      recentComplianceMissConcepts.has(conceptFamilyId)

    const reviewComplianceGap =
      compliance.level === 'review' &&
      compliance.conceptFamilyId === conceptFamilyId

    if (
      !ordinaryGap &&
      !urgentSafetyGap &&
      !prioritySafetyGap &&
      !elevatedComplianceGap &&
      !reviewComplianceGap
    ) {
      continue
    }

    const concept = getChapter19ConceptFamily(conceptFamilyId)

    const priority: Chapter19RemediationPriority = urgentSafetyGap
      ? 'urgent'
      : prioritySafetyGap
        ? 'priority'
        : elevatedComplianceGap || reviewComplianceGap
          ? 'compliance'
          : 'standard'

    const requiresFormalReassessment =
      urgentSafetyGap || elevatedComplianceGap || ordinaryGap

    const plannedReassessmentPassPercent: 80 | 100 = urgentSafetyGap
      ? 100
      : 80

    targets.push({
      conceptFamilyId,
      conceptName: concept.name,
      mastery: mastery.mastery,
      confidence: mastery.confidence,
      observationCount: mastery.observationCount,
      sourceTypeCount: mastery.sourceTypeCount,
      initialMissCount: mastery.initialMissCount,
      remediationContentBlockIds:
        getChapter19RemediationContentBlocksForConcept(conceptFamilyId),
      remediationFlashcardIds:
        getChapter19FlashcardsForConcept(conceptFamilyId),
      priority,
      requiresFormalReassessment,
      plannedReassessmentQuestionCount: 5,
      plannedReassessmentPassPercent,
      safetyEscalation:
        urgentSafetyGap
          ? 'urgent'
          : prioritySafetyGap
            ? 'review'
            : null,
      complianceEscalation:
        elevatedComplianceGap
          ? 'elevated'
          : reviewComplianceGap
            ? 'review'
            : null,
      reason: urgentSafetyGap
        ? 'Multiple distinct practical-safety misses require urgent safety remediation.'
        : prioritySafetyGap
          ? 'A tagged practical-safety miss requires immediate targeted safety review.'
          : elevatedComplianceGap
            ? 'Multiple distinct licensing or employment-law misses require elevated compliance review.'
            : reviewComplianceGap
              ? 'A tagged licensing or employment-law miss requires targeted compliance review.'
              : mastery.initialMissCount >=
                    CHAPTER19_REMEDIATION_RULES.ordinaryMinInitialMisses
                ? 'Multiple preserved initial misses indicate a concept gap.'
                : 'Combined evidence mastery is at or below the Chapter 19 remediation threshold.',
    })
  }

  const priorityRank: Record<Chapter19RemediationPriority, number> = {
    urgent: 0,
    priority: 1,
    compliance: 2,
    standard: 3,
  }

  targets.sort(
    (a, b) =>
      priorityRank[a.priority] - priorityRank[b.priority] ||
      a.mastery - b.mastery,
  )

  return {
    targets,
    preservedEvidence: evidence,
  }
}

export function buildChapter19RemediationPathForConcept(
  conceptFamilyId: Chapter19ConceptFamilyId,
): {
  conceptFamilyId: Chapter19ConceptFamilyId
  contentBlockIds: readonly string[]
  flashcardIds: readonly string[]
  plannedReassessmentQuestionCount: 5
  plannedReassessmentPassPercent: 80
} {
  return {
    conceptFamilyId,
    contentBlockIds:
      getChapter19RemediationContentBlocksForConcept(conceptFamilyId),
    flashcardIds: getChapter19FlashcardsForConcept(conceptFamilyId),
    plannedReassessmentQuestionCount:
      CHAPTER19_REMEDIATION_RULES.ordinaryReassessmentQuestionCount,
    plannedReassessmentPassPercent:
      CHAPTER19_REMEDIATION_RULES.ordinaryReassessmentPassPercent,
  }
}

export function containsLegacyChapter19RemediationId(value: string): boolean {
  return /CH19-R-(?:qq-19-|LO[123])/i.test(value)
}
