import { calculateChapter8ConceptMastery, type Chapter8EvidenceRecord } from './grading'
import { CHAPTER8_CONCEPT_FAMILY_IDS, getChapter8ConceptFamily } from './concepts'
import { evaluateChapter8SafetyEscalation, type Chapter8SafetyEscalationLevel } from './safety-mastery'
import type { Chapter8ConceptFamilyId } from './types'

export interface Chapter8RemediationTarget {
  conceptFamilyId: Chapter8ConceptFamilyId
  conceptName: string
  mastery: number
  observationCount: number
  initialMissCount: number
  priority: 'standard' | 'priority' | 'urgent'
  requiresFormalReassessment: boolean
  reassessmentQuestionCount: 5
  reassessmentPassPercent: 80 | 100
  safetyEscalation: Chapter8SafetyEscalationLevel | null
  reason: string
}

export interface Chapter8RemediationPlan {
  targets: Chapter8RemediationTarget[]
  preservedInitialEvidence: readonly Chapter8EvidenceRecord[]
}

export const CHAPTER8_REMEDIATION_RULES = {
  ordinaryTargetMasteryAtOrBelow: 70,
  ordinaryMinInitialMisses: 2,
  ordinaryReassessmentQuestionCount: 5,
  ordinaryReassessmentPassPercent: 80,
  safetyReassessmentQuestionCount: 5,
  safetyReassessmentPassPercent: 100,
} as const

export function buildChapter8TargetedRemediationPlan(
  evidence: readonly Chapter8EvidenceRecord[],
  referenceTime: string,
): Chapter8RemediationPlan {
  const targets: Chapter8RemediationTarget[] = []

  for (const conceptFamilyId of CHAPTER8_CONCEPT_FAMILY_IDS) {
    const conceptEvidence = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    if (conceptEvidence.length === 0) continue

    const mastery = calculateChapter8ConceptMastery(conceptEvidence, referenceTime)
    const safety = evaluateChapter8SafetyEscalation(evidence, conceptFamilyId)

    const safetyRequiresFormal = safety?.requiresFormalReassessment ?? false
    const ordinaryGap =
      mastery.mastery <= CHAPTER8_REMEDIATION_RULES.ordinaryTargetMasteryAtOrBelow ||
      mastery.initialMissCount >= CHAPTER8_REMEDIATION_RULES.ordinaryMinInitialMisses

    if (!ordinaryGap && !safetyRequiresFormal && safety?.level !== 'watch') continue

    const concept = getChapter8ConceptFamily(conceptFamilyId)
    const isUrgent = safety?.level === 'urgent'
    const isPriority = isUrgent || safety?.level === 'watch'

    targets.push({
      conceptFamilyId,
      conceptName: concept.name,
      mastery: mastery.mastery,
      observationCount: mastery.observationCount,
      initialMissCount: mastery.initialMissCount,
      priority: isUrgent ? 'urgent' : isPriority ? 'priority' : 'standard',
      requiresFormalReassessment: isUrgent || ordinaryGap,
      reassessmentQuestionCount: 5,
      reassessmentPassPercent: isUrgent
        ? CHAPTER8_REMEDIATION_RULES.safetyReassessmentPassPercent
        : CHAPTER8_REMEDIATION_RULES.ordinaryReassessmentPassPercent,
      safetyEscalation: safety?.level ?? null,
      reason: isUrgent
        ? `${concept.name} has repeated hard safety misses and requires targeted remediation followed by a perfect 5-question safety reassessment.`
        : safety?.level === 'watch'
          ? `${concept.name} has a scenario-level safety miss requiring targeted review; formal reassessment becomes mandatory if repeated misses escalate.`
          : `${concept.name} is targeted because mastery is ${mastery.mastery}% with ${mastery.initialMissCount} preserved initial misses.`,
    })
  }

  const priorityRank = { urgent: 0, priority: 1, standard: 2 } as const
  targets.sort((a, b) =>
    priorityRank[a.priority] - priorityRank[b.priority] ||
    a.mastery - b.mastery ||
    a.conceptFamilyId.localeCompare(b.conceptFamilyId),
  )

  // Deliberately return the original immutable evidence reference. C8-7 adds
  // remediation/reassessment evidence; it never rewrites first-attempt history.
  return { targets, preservedInitialEvidence: evidence }
}

export function appendChapter8ReassessmentEvidence(
  originalEvidence: readonly Chapter8EvidenceRecord[],
  reassessmentEvidence: readonly Chapter8EvidenceRecord[],
): Chapter8EvidenceRecord[] {
  if (reassessmentEvidence.some(
    (record) =>
      record.chapterId !== 'ch-8' ||
      record.source !== 'remediation_reassessment' ||
      record.attemptPhase !== 'reassessment',
  )) {
    throw new Error('Reassessment evidence must use Chapter 8 remediation_reassessment / reassessment semantics.')
  }

  return [...originalEvidence, ...reassessmentEvidence]
}
