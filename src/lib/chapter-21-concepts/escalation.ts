import type { Chapter21EvidenceRecord } from './grading'
import type { Chapter21ConceptFamilyId } from './types'
import type { Chapter21MicroCheckQuestion } from './micro-checks'
import {
  chapter21FlashcardConceptMappings,
  chapter21QuizQuestionConceptMappings,
} from './mappings'
import { chapter21MicroChecks } from './micro-checks'
import { chapter21ScenarioEvidenceMappings } from './detection'

export type Chapter21ComplianceDomain =
  | 'business_licensing_entity'
  | 'recordkeeping_tax_reporting'
  | 'booth_rental_worker_classification'
  | 'privacy_advertising_consent'

export type Chapter21ComplianceInterventionLevel =
  | 'none'
  | 'review'
  | 'elevated'

export interface Chapter21ComplianceTaggedItem {
  itemId: string
  conceptFamilyId:
    | 'ch21-shop-opening-planning'
    | 'ch21-ownership-legal-structures'
    | 'ch21-recordkeeping-financial-compliance'
    | 'ch21-booth-rental-independent-business-responsibilities'
    | 'ch21-advertising-marketing-client-consent'
  domain: Chapter21ComplianceDomain
  rationale: string
}

export interface Chapter21ComplianceIntervention {
  level: Chapter21ComplianceInterventionLevel
  domain: Chapter21ComplianceDomain | null
  conceptFamilyId: Chapter21ConceptFamilyId | null
  affectedConceptFamilyIds: readonly Chapter21ConceptFamilyId[]
  requiresTargetedComplianceReview: boolean
  requiresInstructorReview: boolean
  requiresFormalReassessment: boolean
  reassessmentQuestionCount: 5 | null
  reassessmentPassPercent: 80 | null
  studentMessage: string
  instructorReason: string
}

export const CHAPTER21_COMPLIANCE_RULES = {
  recentWindow: 6,
  elevatedDistinctComplianceMisses: 2,
  formalComplianceReassessmentQuestionCount: 5,
  formalComplianceReassessmentPassPercent: 80,
  clearConsecutiveCorrectComplianceObservations: 3,
} as const

type Chapter21ComplianceConceptFamilyId =
  Chapter21ComplianceTaggedItem['conceptFamilyId']

function isChapter21ComplianceConceptFamilyId(
  value: Chapter21ConceptFamilyId,
): value is Chapter21ComplianceConceptFamilyId {
  return (
    value === 'ch21-shop-opening-planning' ||
    value === 'ch21-ownership-legal-structures' ||
    value === 'ch21-recordkeeping-financial-compliance' ||
    value === 'ch21-booth-rental-independent-business-responsibilities' ||
    value === 'ch21-advertising-marketing-client-consent'
  )
}

const domainByConcept: Partial<
  Record<Chapter21ConceptFamilyId, Chapter21ComplianceDomain>
> = {
  'ch21-shop-opening-planning': 'business_licensing_entity',
  'ch21-ownership-legal-structures': 'business_licensing_entity',
  'ch21-recordkeeping-financial-compliance': 'recordkeeping_tax_reporting',
  'ch21-booth-rental-independent-business-responsibilities':
    'booth_rental_worker_classification',
  'ch21-advertising-marketing-client-consent':
    'privacy_advertising_consent',
}

function conceptForItem(itemId: string): Chapter21ConceptFamilyId | null {
  const quiz = chapter21QuizQuestionConceptMappings.find(
    (mapping) => mapping.questionId === itemId,
  )
  if (quiz) return quiz.conceptFamilyId

  const flashcard = chapter21FlashcardConceptMappings.find(
    (mapping) => mapping.flashcardId === itemId,
  )
  if (flashcard) return flashcard.conceptFamilyId

  for (const check of chapter21MicroChecks) {
    const question = check.questions.find((candidate) => candidate.id === itemId)
    if (question) return question.conceptFamilyId
  }

  return (
    chapter21ScenarioEvidenceMappings.find(
      (mapping) => mapping.itemId === itemId,
    )?.conceptFamilyId ?? null
  )
}

export function getChapter21ComplianceTag(
  itemId: string,
): Chapter21ComplianceTaggedItem | null {
  const conceptFamilyId = conceptForItem(itemId)
  if (!conceptFamilyId) return null
  const domain = domainByConcept[conceptFamilyId]
  if (!domain || !isChapter21ComplianceConceptFamilyId(conceptFamilyId)) {
    return null
  }

  const rationale =
    domain === 'business_licensing_entity'
      ? 'Business structure, registration, licensing, permits, occupancy, liability, governance, and filing duties must be verified from the actual facts and current applicable requirements.'
      : domain === 'recordkeeping_tax_reporting'
        ? 'Income, expense, payroll, tax, reporting, and retention obligations depend on accurate records and current federal, state, and local requirements.'
        : domain === 'booth_rental_worker_classification'
          ? 'Booth-rental labels do not determine worker classification, taxes, insurance, licensing, payment handling, client records, or other business responsibilities; the actual agreement and working relationship control.'
          : 'Client images, testimonials, promotions, referrals, outreach, and advertising claims require truthful terms, appropriate permission, privacy protection, and applicable platform or legal rules.'

  return {
    itemId,
    conceptFamilyId,
    domain,
    rationale,
  }
}

const complianceNone = (reason: string): Chapter21ComplianceIntervention => ({
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

export function classifyChapter21MicroCheckMiss(
  question: Chapter21MicroCheckQuestion,
  correct: boolean,
): Chapter21ComplianceIntervention {
  if (correct) {
    return complianceNone(
      'No Chapter 21 compliance miss is active for this response.',
    )
  }

  const tag = getChapter21ComplianceTag(question.id)
  if (!tag) {
    return {
      ...complianceNone(
        'This miss does not independently trigger Chapter 21 compliance escalation.',
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
      'Compliance review required: verify the actual agreement, business facts, current official requirements, and any applicable professional guidance before relying on this rule in practice.',
    instructorReason: tag.rationale,
  }
}

const toTime = (value: string): number => {
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

function trailingCorrectCount(records: readonly Chapter21EvidenceRecord[]) {
  let count = 0
  for (let index = records.length - 1; index >= 0; index--) {
    if (!records[index].correct) break
    count += 1
  }
  return count
}

export function evaluateChapter21ComplianceIntervention(
  records: readonly Chapter21EvidenceRecord[],
): Chapter21ComplianceIntervention {
  const qualifying = records
    .filter((record) => getChapter21ComplianceTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))

  if (qualifying.length === 0) {
    return complianceNone('No tagged Chapter 21 compliance evidence is present.')
  }

  const trailingCorrect = trailingCorrectCount(qualifying)
  if (
    trailingCorrect >=
    CHAPTER21_COMPLIANCE_RULES.clearConsecutiveCorrectComplianceObservations
  ) {
    return complianceNone(
      `Compliance intervention cleared after ${trailingCorrect} consecutive correct tagged observations.`,
    )
  }

  const recent = qualifying.slice(-CHAPTER21_COMPLIANCE_RULES.recentWindow)
  const misses = recent.filter((record) => !record.correct)
  const distinctItems = new Set(misses.map((record) => record.itemId))
  const domains = new Set(
    misses
      .map((record) => getChapter21ComplianceTag(record.itemId)?.domain)
      .filter((domain): domain is Chapter21ComplianceDomain => !!domain),
  )
  const affectedConceptFamilyIds = [
    ...new Set(misses.map((record) => record.conceptFamilyId)),
  ]

  if (
    distinctItems.size >=
    CHAPTER21_COMPLIANCE_RULES.elevatedDistinctComplianceMisses
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
        CHAPTER21_COMPLIANCE_RULES.formalComplianceReassessmentQuestionCount,
      reassessmentPassPercent:
        CHAPTER21_COMPLIANCE_RULES.formalComplianceReassessmentPassPercent,
      studentMessage:
        'Elevated Chapter 21 compliance remediation required. Review the affected business, legal, tax, recordkeeping, worker-classification, privacy, or advertising rules and verify current requirements before formal reassessment.',
      instructorReason:
        `${distinctItems.size} recent distinct Chapter 21 compliance misses span ${domains.size} compliance domain(s).`,
    }
  }

  const latestMiss = [...qualifying].reverse().find((record) => !record.correct)
  if (!latestMiss) {
    return complianceNone(
      'Recent tagged Chapter 21 compliance evidence is correct and no active review is required.',
    )
  }

  const tag = getChapter21ComplianceTag(latestMiss.itemId)!
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
      'Targeted Chapter 21 compliance review required before relying on this business rule in practice.',
    instructorReason: tag.rationale,
  }
}
