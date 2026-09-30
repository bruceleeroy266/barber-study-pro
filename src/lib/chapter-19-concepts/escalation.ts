import type { Chapter19EvidenceRecord } from './grading'
import type { Chapter19ConceptFamilyId } from './types'
import type { Chapter19MicroCheckQuestion } from './micro-checks'

export type Chapter19SafetyHazard =
  | 'infection_control_omission'
  | 'practical_service_safety_process'

export type Chapter19SafetyInterventionLevel = 'none' | 'review' | 'urgent'

export interface Chapter19SafetyTaggedItem {
  itemId: string
  conceptFamilyId: 'ch19-practical-exam-safety-readiness'
  hazard: Chapter19SafetyHazard
  rationale: string
}

export interface Chapter19SafetyIntervention {
  level: Chapter19SafetyInterventionLevel
  hazard: Chapter19SafetyHazard | null
  conceptFamilyId: Chapter19ConceptFamilyId | null
  affectedConceptFamilyIds: readonly Chapter19ConceptFamilyId[]
  requiresTargetedSafetyReview: boolean
  requiresInstructorReview: boolean
  requiresFormalSafetyReassessment: boolean
  reassessmentQuestionCount: 5 | null
  reassessmentPassPercent: 100 | null
  studentMessage: string
  instructorReason: string
}

export type Chapter19ComplianceDomain =
  | 'licensing_requirements'
  | 'employment_law_contracts'

export type Chapter19ComplianceInterventionLevel = 'none' | 'review' | 'elevated'

export interface Chapter19ComplianceTaggedItem {
  itemId: string
  conceptFamilyId:
    | 'ch19-licensing-requirements-verification'
    | 'ch19-employment-law-contracts-compliance'
  domain: Chapter19ComplianceDomain
  rationale: string
}

export interface Chapter19ComplianceIntervention {
  level: Chapter19ComplianceInterventionLevel
  domain: Chapter19ComplianceDomain | null
  conceptFamilyId: Chapter19ConceptFamilyId | null
  affectedConceptFamilyIds: readonly Chapter19ConceptFamilyId[]
  requiresTargetedComplianceReview: boolean
  requiresInstructorReview: boolean
  requiresFormalReassessment: boolean
  reassessmentQuestionCount: 5 | null
  reassessmentPassPercent: 80 | null
  studentMessage: string
  instructorReason: string
}

export const CHAPTER19_SAFETY_RULES = {
  recentWindow: 5,
  urgentDistinctSafetyMisses: 2,
  formalSafetyReassessmentQuestionCount: 5,
  formalSafetyReassessmentPassPercent: 100,
  ordinaryReassessmentPassPercent: 80,
  clearConsecutiveCorrectSafetyObservations: 5,
} as const

export const CHAPTER19_COMPLIANCE_RULES = {
  recentWindow: 5,
  elevatedDistinctComplianceMisses: 2,
  formalComplianceReassessmentQuestionCount: 5,
  formalComplianceReassessmentPassPercent: 80,
  clearConsecutiveCorrectComplianceObservations: 3,
} as const

export const chapter19SafetyTaggedItems: readonly Chapter19SafetyTaggedItem[] = [
  {
    itemId: 'mcq-19-006',
    conceptFamilyId: 'ch19-practical-exam-safety-readiness',
    hazard: 'infection_control_omission',
    rationale:
      'Skipping a required infection-control step is a practical-service safety miss and must be corrected before speed or exam performance is prioritized.',
  },
  {
    itemId: 'qq-19-03',
    conceptFamilyId: 'ch19-practical-exam-safety-readiness',
    hazard: 'practical_service_safety_process',
    rationale:
      'Practical-exam procedures and safety rules must follow current official instructions; unsafe improvisation must not replace required procedure or infection-control steps.',
  },
  {
    itemId: 'fc-ch19-022',
    conceptFamilyId: 'ch19-practical-exam-safety-readiness',
    hazard: 'practical_service_safety_process',
    rationale:
      'Technical skills and safety steps tested in a practical examination must be verified from current official instructions.',
  },
  {
    itemId: 'fc-ch19-025',
    conceptFamilyId: 'ch19-practical-exam-safety-readiness',
    hazard: 'infection_control_omission',
    rationale:
      'Equipment preparation includes sanitation and condition requirements that cannot be omitted or improvised.',
  },
] as const

export const chapter19ComplianceTaggedItems: readonly Chapter19ComplianceTaggedItem[] = [
  {
    itemId: 'mcq-19-001',
    conceptFamilyId: 'ch19-licensing-requirements-verification',
    domain: 'licensing_requirements',
    rationale:
      'Licensing requirements are jurisdiction-specific and must be verified through applicable official sources.',
  },
  {
    itemId: 'mcq-19-002',
    conceptFamilyId: 'ch19-licensing-requirements-verification',
    domain: 'licensing_requirements',
    rationale:
      'Candidate bulletins and identification/testing-site rules can change and must be verified before use.',
  },
  {
    itemId: 'qq-19-01',
    conceptFamilyId: 'ch19-licensing-requirements-verification',
    domain: 'licensing_requirements',
    rationale:
      'Students must verify current jurisdiction-specific licensing and exam requirements rather than relying on informal or outdated guidance.',
  },
  {
    itemId: 'mcq-19-013',
    conceptFamilyId: 'ch19-employment-law-contracts-compliance',
    domain: 'employment_law_contracts',
    rationale:
      'Interview-law boundaries vary by jurisdiction and situation and require appropriate official, workforce, or qualified legal verification.',
  },
  {
    itemId: 'mcq-19-014',
    conceptFamilyId: 'ch19-employment-law-contracts-compliance',
    domain: 'employment_law_contracts',
    rationale:
      'Contract meaning and enforceability depend on wording, facts, and applicable law rather than universal assumptions.',
  },
  {
    itemId: 'qq-19-14',
    conceptFamilyId: 'ch19-employment-law-contracts-compliance',
    domain: 'employment_law_contracts',
    rationale:
      'Generic legal/illegal interview-question lists are not universal legal authority.',
  },
  {
    itemId: 'qq-19-15',
    conceptFamilyId: 'ch19-employment-law-contracts-compliance',
    domain: 'employment_law_contracts',
    rationale:
      'Agreement terms should be read carefully and reviewed with qualified legal help when consequences are significant.',
  },
] as const

const safetyNone = (reason: string): Chapter19SafetyIntervention => ({
  level: 'none',
  hazard: null,
  conceptFamilyId: null,
  affectedConceptFamilyIds: [],
  requiresTargetedSafetyReview: false,
  requiresInstructorReview: false,
  requiresFormalSafetyReassessment: false,
  reassessmentQuestionCount: null,
  reassessmentPassPercent: null,
  studentMessage: '',
  instructorReason: reason,
})

const complianceNone = (reason: string): Chapter19ComplianceIntervention => ({
  level: 'none',
  domain: null,
  conceptFamilyId: null,
  affectedConceptFamilyIds: [],
  requiresTargetedComplianceReview: false,
  requiresInstructorReview: false,
  requiresFormalReassessment: false,
  reassessmentQuestionCount: null,
  reassessmentPassPercent: null,
  studentMessage: '',
  instructorReason: reason,
})

export function getChapter19SafetyTag(
  itemId: string,
): Chapter19SafetyTaggedItem | null {
  return chapter19SafetyTaggedItems.find((item) => item.itemId === itemId) ?? null
}

export function getChapter19ComplianceTag(
  itemId: string,
): Chapter19ComplianceTaggedItem | null {
  return chapter19ComplianceTaggedItems.find((item) => item.itemId === itemId) ?? null
}

export function classifyChapter19MicroCheckMiss(
  question: Chapter19MicroCheckQuestion,
  correct: boolean,
): {
  safety: Chapter19SafetyIntervention
  compliance: Chapter19ComplianceIntervention
} {
  if (correct) {
    return {
      safety: safetyNone('No Chapter 19 safety miss is active for this response.'),
      compliance: complianceNone('No Chapter 19 compliance miss is active for this response.'),
    }
  }

  const safetyTag = getChapter19SafetyTag(question.id)
  const complianceTag = getChapter19ComplianceTag(question.id)

  const safety = safetyTag
    ? {
        level: 'review' as const,
        hazard: safetyTag.hazard,
        conceptFamilyId: safetyTag.conceptFamilyId,
        affectedConceptFamilyIds: [safetyTag.conceptFamilyId],
        requiresTargetedSafetyReview: true,
        requiresInstructorReview: true,
        requiresFormalSafetyReassessment: false,
        reassessmentQuestionCount: null,
        reassessmentPassPercent: null,
        studentMessage:
          'Safety review required: correct the practical-exam infection-control or service-safety process before continuing. Follow current official instructions and do not trade required safety steps for speed.',
        instructorReason: safetyTag.rationale,
      }
    : {
        ...safetyNone(
          'This miss does not independently trigger the Chapter 19 bodily-safety pathway.',
        ),
        conceptFamilyId: question.conceptFamilyId,
      }

  const compliance = complianceTag
    ? {
        level: 'review' as const,
        domain: complianceTag.domain,
        conceptFamilyId: complianceTag.conceptFamilyId,
        affectedConceptFamilyIds: [complianceTag.conceptFamilyId],
        requiresTargetedComplianceReview: true,
        requiresInstructorReview: true,
        requiresFormalReassessment: false,
        reassessmentQuestionCount: null,
        reassessmentPassPercent: null,
        studentMessage:
          complianceTag.domain === 'licensing_requirements'
            ? 'Compliance review required: verify current licensing and examination requirements through the applicable official licensing agency and authorized exam provider.'
            : 'Legal/compliance review required: do not treat generic interview or contract rules as universal law. Verify the applicable rule or agreement with an appropriate official, workforce, or qualified legal resource.',
        instructorReason: complianceTag.rationale,
      }
    : {
        ...complianceNone(
          'This miss does not independently trigger the Chapter 19 compliance/legal pathway.',
        ),
        conceptFamilyId: question.conceptFamilyId,
      }

  return { safety, compliance }
}

const toTime = (value: string): number => {
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

function trailingCorrectCount(
  records: readonly Chapter19EvidenceRecord[],
): number {
  let count = 0
  for (let index = records.length - 1; index >= 0; index--) {
    if (!records[index].correct) break
    count += 1
  }
  return count
}

export function evaluateChapter19SafetyIntervention(
  records: readonly Chapter19EvidenceRecord[],
): Chapter19SafetyIntervention {
  const qualifying = records
    .filter((record) => getChapter19SafetyTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))

  if (qualifying.length === 0) {
    return safetyNone('No tagged Chapter 19 bodily-safety evidence is present.')
  }

  const trailingCorrect = trailingCorrectCount(qualifying)
  if (
    trailingCorrect >=
    CHAPTER19_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations
  ) {
    return safetyNone(
      'Safety intervention cleared after ' +
        trailingCorrect +
        ' consecutive correct tagged safety observations.',
    )
  }

  const recent = qualifying.slice(-CHAPTER19_SAFETY_RULES.recentWindow)
  const misses = recent.filter((record) => !record.correct)
  const distinctItems = new Set(misses.map((record) => record.itemId))
  const hazards = new Set(
    misses
      .map((record) => getChapter19SafetyTag(record.itemId)?.hazard)
      .filter((hazard): hazard is Chapter19SafetyHazard => !!hazard),
  )

  if (
    distinctItems.size >= CHAPTER19_SAFETY_RULES.urgentDistinctSafetyMisses &&
    hazards.size >= 2
  ) {
    return {
      level: 'urgent',
      hazard: null,
      conceptFamilyId: 'ch19-practical-exam-safety-readiness',
      affectedConceptFamilyIds: ['ch19-practical-exam-safety-readiness'],
      requiresTargetedSafetyReview: true,
      requiresInstructorReview: true,
      requiresFormalSafetyReassessment: true,
      reassessmentQuestionCount:
        CHAPTER19_SAFETY_RULES.formalSafetyReassessmentQuestionCount,
      reassessmentPassPercent:
        CHAPTER19_SAFETY_RULES.formalSafetyReassessmentPassPercent,
      studentMessage:
        'Urgent Chapter 19 practical-safety remediation required. Review infection-control and service-safety process boundaries before continuing. Recovery requires a perfect five-question safety reassessment.',
      instructorReason:
        distinctItems.size +
        ' recent distinct Chapter 19 safety misses span ' +
        hazards.size +
        ' practical-safety hazard classes.',
    }
  }

  const latestMiss = [...qualifying].reverse().find((record) => !record.correct)
  if (!latestMiss) {
    return safetyNone(
      'Recent tagged Chapter 19 safety evidence is correct and no active safety intervention is required.',
    )
  }

  const tag = getChapter19SafetyTag(latestMiss.itemId)!
  return {
    level: 'review',
    hazard: tag.hazard,
    conceptFamilyId: tag.conceptFamilyId,
    affectedConceptFamilyIds: [tag.conceptFamilyId],
    requiresTargetedSafetyReview: true,
    requiresInstructorReview: true,
    requiresFormalSafetyReassessment: false,
    reassessmentQuestionCount: null,
    reassessmentPassPercent: null,
    studentMessage:
      'Safety review required: correct the practical-exam infection-control or service-safety process before continuing.',
    instructorReason: tag.rationale,
  }
}

export function evaluateChapter19ComplianceIntervention(
  records: readonly Chapter19EvidenceRecord[],
): Chapter19ComplianceIntervention {
  const qualifying = records
    .filter((record) => getChapter19ComplianceTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))

  if (qualifying.length === 0) {
    return complianceNone('No tagged Chapter 19 compliance/legal evidence is present.')
  }

  const trailingCorrect = trailingCorrectCount(qualifying)
  if (
    trailingCorrect >=
    CHAPTER19_COMPLIANCE_RULES.clearConsecutiveCorrectComplianceObservations
  ) {
    return complianceNone(
      'Compliance intervention cleared after ' +
        trailingCorrect +
        ' consecutive correct tagged compliance observations.',
    )
  }

  const recent = qualifying.slice(-CHAPTER19_COMPLIANCE_RULES.recentWindow)
  const misses = recent.filter((record) => !record.correct)
  const distinctItems = new Set(misses.map((record) => record.itemId))
  const affected = [...new Set(misses.map((record) => record.conceptFamilyId))]

  if (
    distinctItems.size >=
    CHAPTER19_COMPLIANCE_RULES.elevatedDistinctComplianceMisses
  ) {
    return {
      level: 'elevated',
      domain: null,
      conceptFamilyId: null,
      affectedConceptFamilyIds: affected,
      requiresTargetedComplianceReview: true,
      requiresInstructorReview: true,
      requiresFormalReassessment: true,
      reassessmentQuestionCount:
        CHAPTER19_COMPLIANCE_RULES.formalComplianceReassessmentQuestionCount,
      reassessmentPassPercent:
        CHAPTER19_COMPLIANCE_RULES.formalComplianceReassessmentPassPercent,
      studentMessage:
        'Compliance review required. Revisit the affected licensing and/or employment-law concept using the Chapter 19 lesson and mapped flashcards, then complete the planned five-question reassessment.',
      instructorReason:
        distinctItems.size +
        ' recent distinct Chapter 19 compliance/legal misses require targeted review. This is not a bodily-safety escalation.',
    }
  }

  const latestMiss = [...qualifying].reverse().find((record) => !record.correct)
  if (!latestMiss) {
    return complianceNone(
      'Recent tagged Chapter 19 compliance evidence is correct and no active compliance intervention is required.',
    )
  }

  const tag = getChapter19ComplianceTag(latestMiss.itemId)!
  return {
    level: 'review',
    domain: tag.domain,
    conceptFamilyId: tag.conceptFamilyId,
    affectedConceptFamilyIds: [tag.conceptFamilyId],
    requiresTargetedComplianceReview: true,
    requiresInstructorReview: true,
    requiresFormalReassessment: false,
    reassessmentQuestionCount: null,
    reassessmentPassPercent: null,
    studentMessage:
      tag.domain === 'licensing_requirements'
        ? 'Compliance review required: verify the current jurisdiction-specific licensing or examination rule using the applicable official source.'
        : 'Legal/compliance review required: verify the applicable interview or agreement rule rather than relying on a universal legal assumption.',
    instructorReason: tag.rationale,
  }
}

export function getChapter19RequiredReassessmentPassPercent(
  records: readonly Chapter19EvidenceRecord[],
  conceptFamilyId: Chapter19ConceptFamilyId,
): 80 | 100 {
  const safety = evaluateChapter19SafetyIntervention(records)
  if (
    safety.level === 'urgent' &&
    safety.affectedConceptFamilyIds.includes(conceptFamilyId)
  ) {
    return CHAPTER19_SAFETY_RULES.formalSafetyReassessmentPassPercent
  }
  return CHAPTER19_SAFETY_RULES.ordinaryReassessmentPassPercent
}
