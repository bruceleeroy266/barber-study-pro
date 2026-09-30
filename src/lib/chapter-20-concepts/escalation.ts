import type { Chapter20EvidenceRecord } from './grading'
import type { Chapter20ConceptFamilyId } from './types'
import type { Chapter20MicroCheckQuestion } from './micro-checks'
import {
  chapter20FlashcardConceptMappings,
  chapter20QuizQuestionConceptMappings,
} from './mappings'
import { chapter20MicroChecks } from './micro-checks'
import { chapter20ScenarioEvidenceMappings } from './detection'

export type Chapter20ComplianceDomain =
  | 'worker_classification_compensation'
  | 'tax_income_reporting'
  | 'privacy_client_consent'

export type Chapter20ComplianceInterventionLevel =
  | 'none'
  | 'review'
  | 'elevated'

export interface Chapter20ComplianceTaggedItem {
  itemId: string
  conceptFamilyId:
    | 'ch20-employment-classification-compensation'
    | 'ch20-financial-responsibility-income-reporting'
    | 'ch20-client-retention-marketing-consent'
  domain: Chapter20ComplianceDomain
  rationale: string
}

export interface Chapter20ComplianceIntervention {
  level: Chapter20ComplianceInterventionLevel
  domain: Chapter20ComplianceDomain | null
  conceptFamilyId: Chapter20ConceptFamilyId | null
  affectedConceptFamilyIds: readonly Chapter20ConceptFamilyId[]
  requiresTargetedComplianceReview: boolean
  requiresInstructorReview: boolean
  requiresFormalReassessment: boolean
  reassessmentQuestionCount: 5 | null
  reassessmentPassPercent: 80 | null
  studentMessage: string
  instructorReason: string
}

export const CHAPTER20_COMPLIANCE_RULES = {
  recentWindow: 6,
  elevatedDistinctComplianceMisses: 2,
  formalComplianceReassessmentQuestionCount: 5,
  formalComplianceReassessmentPassPercent: 80,
  clearConsecutiveCorrectComplianceObservations: 3,
} as const

const domainByConcept: Partial<
  Record<Chapter20ConceptFamilyId, Chapter20ComplianceDomain>
> = {
  'ch20-employment-classification-compensation': 'worker_classification_compensation',
  'ch20-financial-responsibility-income-reporting': 'tax_income_reporting',
  'ch20-client-retention-marketing-consent': 'privacy_client_consent',
}

function conceptForItem(itemId: string): Chapter20ConceptFamilyId | null {
  const quiz = chapter20QuizQuestionConceptMappings.find(
    (mapping) => mapping.questionId === itemId,
  )
  if (quiz) return quiz.conceptFamilyId

  const flashcard = chapter20FlashcardConceptMappings.find(
    (mapping) => mapping.flashcardId === itemId,
  )
  if (flashcard) return flashcard.conceptFamilyId

  for (const check of chapter20MicroChecks) {
    const question = check.questions.find((candidate) => candidate.id === itemId)
    if (question) return question.conceptFamilyId
  }

  return (
    chapter20ScenarioEvidenceMappings.find(
      (mapping) => mapping.itemId === itemId,
    )?.conceptFamilyId ?? null
  )
}

export function getChapter20ComplianceTag(
  itemId: string,
): Chapter20ComplianceTaggedItem | null {
  const conceptFamilyId = conceptForItem(itemId)
  if (!conceptFamilyId) return null
  const domain = domainByConcept[conceptFamilyId]
  if (!domain) return null

  return {
    itemId,
    conceptFamilyId,
    domain,
    rationale:
      domain === 'worker_classification_compensation'
        ? 'Worker classification, compensation terms, and booth-rental responsibilities must be verified from the actual relationship, written terms, and applicable rules.'
        : domain === 'tax_income_reporting'
          ? 'Income, tip, tax, and recordkeeping obligations must be handled under current requirements rather than stale thresholds or assumptions.'
          : 'Identifiable client content and marketing practices require clear consent and applicable privacy, advertising, platform, school, and shop rules.',
  }
}

const complianceNone = (reason: string): Chapter20ComplianceIntervention => ({
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

export function classifyChapter20MicroCheckMiss(
  question: Chapter20MicroCheckQuestion,
  correct: boolean,
): Chapter20ComplianceIntervention {
  if (correct) {
    return complianceNone('No Chapter 20 compliance miss is active for this response.')
  }

  const tag = getChapter20ComplianceTag(question.id)
  if (!tag) {
    return {
      ...complianceNone(
        'This miss does not independently trigger Chapter 20 compliance escalation.',
      ),
      conceptFamilyId: question.conceptFamilyId,
    }
  }

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
      tag.domain === 'worker_classification_compensation'
        ? 'Compliance review required: verify the actual work relationship and written compensation or booth-rental terms instead of relying on labels.'
        : tag.domain === 'tax_income_reporting'
          ? 'Compliance review required: use accurate records and verify current tax and income-reporting requirements for the actual work arrangement.'
          : 'Compliance review required: confirm clear client permission and applicable privacy, advertising, platform, school, and shop rules before using identifiable client content.',
    instructorReason: tag.rationale,
  }
}

const toTime = (value: string): number => {
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

function trailingCorrectCount(records: readonly Chapter20EvidenceRecord[]) {
  let count = 0
  for (let index = records.length - 1; index >= 0; index--) {
    if (!records[index].correct) break
    count += 1
  }
  return count
}

export function evaluateChapter20ComplianceIntervention(
  records: readonly Chapter20EvidenceRecord[],
): Chapter20ComplianceIntervention {
  const qualifying = records
    .filter((record) => getChapter20ComplianceTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))

  if (qualifying.length === 0) {
    return complianceNone('No tagged Chapter 20 compliance evidence is present.')
  }

  const trailingCorrect = trailingCorrectCount(qualifying)
  if (
    trailingCorrect >=
    CHAPTER20_COMPLIANCE_RULES.clearConsecutiveCorrectComplianceObservations
  ) {
    return complianceNone(
      `Compliance intervention cleared after ${trailingCorrect} consecutive correct tagged observations.`,
    )
  }

  const recent = qualifying.slice(-CHAPTER20_COMPLIANCE_RULES.recentWindow)
  const misses = recent.filter((record) => !record.correct)
  const distinctItems = new Set(misses.map((record) => record.itemId))
  const domains = new Set(
    misses
      .map((record) => getChapter20ComplianceTag(record.itemId)?.domain)
      .filter((domain): domain is Chapter20ComplianceDomain => !!domain),
  )
  const affectedConceptFamilyIds = [
    ...new Set(misses.map((record) => record.conceptFamilyId)),
  ]

  if (
    distinctItems.size >=
      CHAPTER20_COMPLIANCE_RULES.elevatedDistinctComplianceMisses
  ) {
    return {
      level: 'elevated',
      domain: domains.size === 1 ? [...domains][0] : null,
      conceptFamilyId:
        affectedConceptFamilyIds.length === 1
          ? affectedConceptFamilyIds[0]
          : null,
      affectedConceptFamilyIds,
      requiresTargetedComplianceReview: true,
      requiresInstructorReview: true,
      requiresFormalReassessment: true,
      reassessmentQuestionCount:
        CHAPTER20_COMPLIANCE_RULES.formalComplianceReassessmentQuestionCount,
      reassessmentPassPercent:
        CHAPTER20_COMPLIANCE_RULES.formalComplianceReassessmentPassPercent,
      studentMessage:
        'Elevated Chapter 20 compliance remediation required. Review the affected classification, reporting, or consent rules and verify current requirements before formal reassessment.',
      instructorReason:
        `${distinctItems.size} recent distinct Chapter 20 compliance misses span ${domains.size} compliance domain(s).`,
    }
  }

  const latestMiss = [...qualifying].reverse().find((record) => !record.correct)
  if (!latestMiss) {
    return complianceNone(
      'Recent tagged Chapter 20 compliance evidence is correct and no active review is required.',
    )
  }

  const tag = getChapter20ComplianceTag(latestMiss.itemId)!
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
      'Targeted compliance review required for this Chapter 20 concept before relying on the rule in practice.',
    instructorReason: tag.rationale,
  }
}
