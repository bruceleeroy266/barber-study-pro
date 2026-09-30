import type { Chapter18EvidenceRecord } from './grading'
import type { Chapter18ConceptFamilyId } from './types'
import type { Chapter18MicroCheckQuestion } from './micro-checks'

export type Chapter18SafetyHazard =
  | 'allergy_scalp_contraindication'
  | 'product_use_handling_boundary'
  | 'compatibility_unknown_history'
  | 'overlap_overprocessing_control'

export type Chapter18SafetyInterventionLevel = 'none' | 'review' | 'urgent'

export interface Chapter18SafetyTaggedItem {
  itemId: string
  conceptFamilyId: Chapter18ConceptFamilyId
  hazard: Chapter18SafetyHazard
  rationale: string
}

export interface Chapter18SafetyIntervention {
  level: Chapter18SafetyInterventionLevel
  hazard: Chapter18SafetyHazard | null
  conceptFamilyId: Chapter18ConceptFamilyId | null
  affectedConceptFamilyIds: readonly Chapter18ConceptFamilyId[]
  requiresTargetedSafetyReview: boolean
  requiresInstructorReview: boolean
  requiresFormalSafetyReassessment: boolean
  reassessmentQuestionCount: 5 | null
  reassessmentPassPercent: 100 | null
  studentMessage: string
  instructorReason: string
}

export const CHAPTER18_SAFETY_RULES = {
  recentWindow: 5,
  urgentDistinctSafetyMisses: 2,
  urgentDistinctHazards: 2,
  formalSafetyReassessmentQuestionCount: 5,
  formalSafetyReassessmentPassPercent: 100,
  ordinaryReassessmentPassPercent: 80,
  clearConsecutiveCorrectSafetyObservations: 5,
} as const

export const chapter18SafetyTaggedItems: readonly Chapter18SafetyTaggedItem[] = [
  { itemId: 'mcq-18-013', conceptFamilyId: 'ch18-service-safety-chemical-handling', hazard: 'allergy_scalp_contraindication', rationale: 'Visible scalp irritation or sunburn is a reason to postpone haircolor rather than apply chemical product to compromised tissue.' },
  { itemId: 'qq-18-12', conceptFamilyId: 'ch18-service-safety-chemical-handling', hazard: 'allergy_scalp_contraindication', rationale: 'Product-specific allergy-alert or skin-test directions must be followed; a prior uneventful use does not replace the current product directions.' },
  { itemId: 'fc-ch18-034', conceptFamilyId: 'ch18-service-safety-chemical-handling', hazard: 'allergy_scalp_contraindication', rationale: 'A reaction during the product-directed allergy-alert test means that dye product should not be used.' },
  { itemId: 'fc-ch18-048', conceptFamilyId: 'ch18-service-safety-chemical-handling', hazard: 'allergy_scalp_contraindication', rationale: 'Compromised scalp tissue requires postponing a chemical color service rather than diagnosing or treating the condition.' },

  { itemId: 'mcq-18-008', conceptFamilyId: 'ch18-developers-lighteners-toners', hazard: 'product_use_handling_boundary', rationale: 'An off-scalp-only lightener must not be adapted for scalp use outside manufacturer directions.' },
  { itemId: 'mcq-18-014', conceptFamilyId: 'ch18-service-safety-chemical-handling', hazard: 'product_use_handling_boundary', rationale: 'A scalp-hair color product must not be transferred to beard or mustache use unless the manufacturer expressly permits it.' },
  { itemId: 'qq-18-13', conceptFamilyId: 'ch18-service-safety-chemical-handling', hazard: 'product_use_handling_boundary', rationale: 'Facial-hair application requires a product expressly permitted for that intended beard or mustache use.' },
  { itemId: 'qq-18-14', conceptFamilyId: 'ch18-service-safety-chemical-handling', hazard: 'product_use_handling_boundary', rationale: 'Damaged, swollen, leaking, or otherwise compromised chemical packaging should not be used or improvised with.' },

  { itemId: 'mcq-18-010', conceptFamilyId: 'ch18-application-consultation-procedures', hazard: 'compatibility_unknown_history', rationale: 'Unknown prior home color or chemical history must be clarified and checked against manufacturer-supported compatibility guidance before proceeding.' },
  { itemId: 'fc-ch18-020', conceptFamilyId: 'ch18-service-safety-chemical-handling', hazard: 'compatibility_unknown_history', rationale: 'Prior progressive or metallic-salt color history can create compatibility concerns with later oxidative services.' },
  { itemId: 'fc-ch18-050', conceptFamilyId: 'ch18-service-safety-chemical-handling', hazard: 'compatibility_unknown_history', rationale: 'Chemical combinations outside manufacturer authorization should not be improvised.' },

  { itemId: 'mcq-18-009', conceptFamilyId: 'ch18-application-consultation-procedures', hazard: 'overlap_overprocessing_control', rationale: 'Lightener retouch should target new growth while avoiding unapproved overlap onto previously lightened or sensitized hair.' },
  { itemId: 'qq-18-09', conceptFamilyId: 'ch18-application-consultation-procedures', hazard: 'overlap_overprocessing_control', rationale: 'Previously lightened hair is more vulnerable; unapproved overlap can increase damage and breakage risk.' },
  { itemId: 'fc-ch18-035', conceptFamilyId: 'ch18-service-safety-chemical-handling', hazard: 'overlap_overprocessing_control', rationale: 'Lightener placement, developer, heat, timing, and overlap must remain within manufacturer limits and hair-integrity boundaries.' },
] as const

const none = (reason: string): Chapter18SafetyIntervention => ({
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

function studentMessageForHazard(hazard: Chapter18SafetyHazard): string {
  switch (hazard) {
    case 'allergy_scalp_contraindication':
      return 'Haircolor safety review required: follow the product allergy-alert directions and postpone chemical color over visibly irritated, sunburned, or otherwise compromised scalp tissue.'
    case 'product_use_handling_boundary':
      return 'Product-use safety review required: use the product only for the application area, developer, mixing, timing, and handling conditions expressly permitted by its manufacturer.'
    case 'compatibility_unknown_history':
      return 'Compatibility review required: clarify prior color/chemical history and verify product-system compatibility before proceeding. Do not guess or improvise incompatible mixtures.'
    case 'overlap_overprocessing_control':
      return 'Lightening-control review required: protect previously lightened or sensitized hair from unapproved overlap and follow manufacturer limits for developer, timing, heat, and application area.'
  }
}

export function getChapter18SafetyTag(itemId: string): Chapter18SafetyTaggedItem | null {
  return chapter18SafetyTaggedItems.find((item) => item.itemId === itemId) ?? null
}

export function classifyChapter18MicroCheckSafetyMiss(
  question: Chapter18MicroCheckQuestion,
  correct: boolean,
): Chapter18SafetyIntervention {
  if (correct) return none('No Chapter 18 high-risk miss is active for this response.')
  const tag = getChapter18SafetyTag(question.id)
  if (!tag) {
    return {
      ...none('This miss remains ordinary concept evidence and does not independently trigger a Chapter 18 safety intervention.'),
      conceptFamilyId: question.conceptFamilyId,
    }
  }
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
    studentMessage: studentMessageForHazard(tag.hazard),
    instructorReason: tag.rationale,
  }
}

const toTime = (value: string): number => {
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

const safetyEvidence = (records: readonly Chapter18EvidenceRecord[]) =>
  records
    .filter((record) => getChapter18SafetyTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))

function trailingCorrectCount(records: readonly Chapter18EvidenceRecord[]): number {
  let count = 0
  for (let index = records.length - 1; index >= 0; index--) {
    if (!records[index].correct) break
    count += 1
  }
  return count
}

export function evaluateChapter18SafetyIntervention(
  records: readonly Chapter18EvidenceRecord[],
): Chapter18SafetyIntervention {
  const qualifying = safetyEvidence(records)
  if (qualifying.length === 0) return none('No tagged Chapter 18 high-risk evidence is present.')

  const trailingCorrect = trailingCorrectCount(qualifying)
  if (trailingCorrect >= CHAPTER18_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations) {
    return none('Safety intervention cleared after ' + trailingCorrect + ' consecutive correct high-risk observations.')
  }

  const recent = qualifying.slice(-CHAPTER18_SAFETY_RULES.recentWindow)
  const misses = recent.filter((record) => !record.correct)
  const distinctItems = new Set(misses.map((record) => record.itemId))
  const hazards = new Set(
    misses
      .map((record) => getChapter18SafetyTag(record.itemId)?.hazard)
      .filter((hazard): hazard is Chapter18SafetyHazard => !!hazard),
  )
  const affectedConceptFamilyIds = [...new Set(misses.map((record) => record.conceptFamilyId))]

  if (
    distinctItems.size >= CHAPTER18_SAFETY_RULES.urgentDistinctSafetyMisses &&
    hazards.size >= CHAPTER18_SAFETY_RULES.urgentDistinctHazards
  ) {
    return {
      level: 'urgent',
      hazard: null,
      conceptFamilyId: null,
      affectedConceptFamilyIds,
      requiresTargetedSafetyReview: true,
      requiresInstructorReview: true,
      requiresFormalSafetyReassessment: true,
      reassessmentQuestionCount: CHAPTER18_SAFETY_RULES.formalSafetyReassessmentQuestionCount,
      reassessmentPassPercent: CHAPTER18_SAFETY_RULES.formalSafetyReassessmentPassPercent,
      studentMessage: 'Urgent Chapter 18 safety remediation required. Review the affected allergy/scalp, product-use, compatibility, and/or lightener-control boundaries before continuing. A perfect five-question safety reassessment will be required before urgent safety mastery can recover.',
      instructorReason: misses.length + ' recent high-risk misses span ' + hazards.size + ' distinct Chapter 18 hazard classes; formal safety remediation and a perfect five-question reassessment are required.',
    }
  }

  const latestMiss = [...qualifying].reverse().find((record) => !record.correct)
  if (latestMiss) {
    const tag = getChapter18SafetyTag(latestMiss.itemId)!
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
      studentMessage: studentMessageForHazard(tag.hazard),
      instructorReason: tag.rationale,
    }
  }

  return none('Recent tagged Chapter 18 high-risk evidence is correct and no active intervention is required.')
}

export function getChapter18RequiredReassessmentPassPercent(
  records: readonly Chapter18EvidenceRecord[],
  conceptFamilyId: Chapter18ConceptFamilyId,
): 80 | 100 {
  const intervention = evaluateChapter18SafetyIntervention(records)
  if (intervention.level === 'urgent' && intervention.affectedConceptFamilyIds.includes(conceptFamilyId)) {
    return CHAPTER18_SAFETY_RULES.formalSafetyReassessmentPassPercent
  }
  return CHAPTER18_SAFETY_RULES.ordinaryReassessmentPassPercent
}

export function containsProhibitedChapter18SafetyLanguage(message: string): boolean {
  const normalized = message.toLowerCase()
  const prohibited = [
    'you have ',
    'client has ',
    'diagnosis:',
    'diagnosed with',
    'prescribe this',
    'this is an infection',
    'this is a disease',
    'this is an allergic reaction',
  ]
  return prohibited.some((phrase) => normalized.includes(phrase))
}
