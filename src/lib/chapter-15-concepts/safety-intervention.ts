import type { Chapter15EvidenceRecord } from './grading'
import type { Chapter15ConceptFamilyId } from './types'
import type { Chapter15MicroCheckQuestion } from './micro-checks'

export type Chapter15SafetyHazard =
  | 'medication_scope_boundary'
  | 'surgical_scope_boundary'
  | 'attachment_cure_water_exposure'
  | 'chemical_service_compatibility'

export type Chapter15SafetyInterventionLevel = 'none' | 'review' | 'urgent'

export interface Chapter15SafetyTaggedItem {
  itemId: string
  conceptFamilyId: Chapter15ConceptFamilyId
  hazard: Chapter15SafetyHazard
  rationale: string
}

export interface Chapter15SafetyIntervention {
  level: Chapter15SafetyInterventionLevel
  hazard: Chapter15SafetyHazard | null
  conceptFamilyId: Chapter15ConceptFamilyId | null
  affectedConceptFamilyIds: readonly Chapter15ConceptFamilyId[]
  requiresTargetedSafetyReview: boolean
  requiresInstructorReview: boolean
  requiresFormalSafetyReassessment: boolean
  reassessmentQuestionCount: 5 | null
  reassessmentPassPercent: 100 | null
  studentMessage: string
  instructorReason: string
}

export const CHAPTER15_SAFETY_RULES = {
  recentWindow: 4,
  urgentDistinctSafetyMisses: 2,
  urgentDistinctHazards: 2,
  formalSafetyReassessmentQuestionCount: 5,
  formalSafetyReassessmentPassPercent: 100,
  ordinaryReassessmentPassPercent: 80,
  clearConsecutiveCorrectSafetyObservations: 5,
} as const

export const chapter15SafetyTaggedItems: readonly Chapter15SafetyTaggedItem[] = [
  { itemId: 'mcq-15-003', conceptFamilyId: 'ch15-alternatives-scope-referral', hazard: 'medication_scope_boundary', rationale: 'Medication formulation and dosing decisions require verified labeling and an appropriately licensed healthcare professional rather than individualized barber advice.' },
  { itemId: 'qq-15-014', conceptFamilyId: 'ch15-alternatives-scope-referral', hazard: 'medication_scope_boundary', rationale: 'A barber should not select a Minoxidil formulation or dosing schedule for a client.' },
  { itemId: 'qq-15-056', conceptFamilyId: 'ch15-alternatives-scope-referral', hazard: 'medication_scope_boundary', rationale: 'Individualized prescription-medication directions cross the barbering/medical boundary.' },
  { itemId: 'mcq-15-004', conceptFamilyId: 'ch15-alternatives-scope-referral', hazard: 'surgical_scope_boundary', rationale: 'Hair transplantation is a medical procedure; candidacy and surgical selection belong with an appropriately licensed medical professional.' },
  { itemId: 'qq-15-060', conceptFamilyId: 'ch15-alternatives-scope-referral', hazard: 'surgical_scope_boundary', rationale: 'Hair transplantation is not a cosmetic barbering service.' },
  { itemId: 'mcq-15-009', conceptFamilyId: 'ch15-attachment-methods-bonding', hazard: 'attachment_cure_water_exposure', rationale: 'Bonding cure and water exposure are adhesive-specific and should follow manufacturer instructions rather than a universal time rule.' },
  { itemId: 'mcq-15-010', conceptFamilyId: 'ch15-attachment-methods-bonding', hazard: 'attachment_cure_water_exposure', rationale: 'Water-exposure attachment decisions must be based on the system and product rating rather than assumed waterproof performance.' },
  { itemId: 'qq-15-038', conceptFamilyId: 'ch15-attachment-methods-bonding', hazard: 'attachment_cure_water_exposure', rationale: 'Cure time is product-specific and governs when shampooing or water exposure is appropriate.' },
  { itemId: 'qq-15-040', conceptFamilyId: 'ch15-attachment-methods-bonding', hazard: 'attachment_cure_water_exposure', rationale: 'Frequent-water-exposure clients require verified attachment/product compatibility rather than universal waterproof claims.' },
  { itemId: 'mcq-15-011', conceptFamilyId: 'ch15-cleaning-maintenance-chemical-care', hazard: 'chemical_service_compatibility', rationale: 'Chemical-service suitability depends on fiber, base, prior processing, and manufacturer approval.' },
  { itemId: 'qq-15-048', conceptFamilyId: 'ch15-cleaning-maintenance-chemical-care', hazard: 'chemical_service_compatibility', rationale: 'Natural-hair chemical procedures must not be assumed safe for a replacement system.' },
  { itemId: 'qq-15-062', conceptFamilyId: 'ch15-cleaning-maintenance-chemical-care', hazard: 'chemical_service_compatibility', rationale: 'Human hair alone does not establish that lightening or another chemical service is safe for a replacement system.' },
] as const

const none = (reason: string): Chapter15SafetyIntervention => ({
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

function studentMessageForHazard(hazard: Chapter15SafetyHazard): string {
  switch (hazard) {
    case 'medication_scope_boundary':
      return 'Scope review required: provide general education only and refer individualized medication formulation, dosing, benefit, risk, and contraindication questions to verified labeling and an appropriately licensed healthcare professional.'
    case 'surgical_scope_boundary':
      return 'Scope review required: hair transplantation is a medical procedure. Do not diagnose candidacy, select a surgical technique, or perform the procedure as a barbering service.'
    case 'attachment_cure_water_exposure':
      return 'Attachment-safety review required: cure time, water exposure, wear expectations, removal, and product compatibility must follow the specific system and attachment manufacturer instructions.'
    case 'chemical_service_compatibility':
      return 'Chemical-care review required: do not assume natural-hair chemical procedures are safe for a replacement system. Verify fiber, base, prior processing, and manufacturer approval first.'
  }
}

export function getChapter15SafetyTag(itemId: string): Chapter15SafetyTaggedItem | null {
  return chapter15SafetyTaggedItems.find((item) => item.itemId === itemId) ?? null
}

export function classifyChapter15MicroCheckSafetyMiss(
  question: Chapter15MicroCheckQuestion,
  correct: boolean,
): Chapter15SafetyIntervention {
  if (correct) return none('No Chapter 15 high-risk miss is active for this response.')

  const tag = getChapter15SafetyTag(question.id)
  if (!tag) {
    return {
      ...none('This miss remains ordinary concept evidence and does not independently trigger a Chapter 15 safety intervention.'),
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

const safetyEvidence = (records: readonly Chapter15EvidenceRecord[]) =>
  records
    .filter((record) => getChapter15SafetyTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))

function trailingCorrectCount(records: readonly Chapter15EvidenceRecord[]): number {
  let count = 0
  for (let index = records.length - 1; index >= 0; index--) {
    if (!records[index].correct) break
    count += 1
  }
  return count
}

export function evaluateChapter15SafetyIntervention(
  records: readonly Chapter15EvidenceRecord[],
): Chapter15SafetyIntervention {
  const qualifying = safetyEvidence(records)
  if (qualifying.length === 0) return none('No tagged Chapter 15 high-risk evidence is present.')

  const trailingCorrect = trailingCorrectCount(qualifying)
  if (trailingCorrect >= CHAPTER15_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations) {
    return none('Safety intervention cleared after ' + trailingCorrect + ' consecutive correct high-risk observations.')
  }

  const recent = qualifying.slice(-CHAPTER15_SAFETY_RULES.recentWindow)
  const misses = recent.filter((record) => !record.correct)
  const distinctItems = new Set(misses.map((record) => record.itemId))
  const hazards = new Set(
    misses
      .map((record) => getChapter15SafetyTag(record.itemId)?.hazard)
      .filter((hazard): hazard is Chapter15SafetyHazard => !!hazard),
  )
  const affectedConceptFamilyIds = [...new Set(misses.map((record) => record.conceptFamilyId))]

  if (
    distinctItems.size >= CHAPTER15_SAFETY_RULES.urgentDistinctSafetyMisses &&
    hazards.size >= CHAPTER15_SAFETY_RULES.urgentDistinctHazards
  ) {
    return {
      level: 'urgent',
      hazard: null,
      conceptFamilyId: null,
      affectedConceptFamilyIds,
      requiresTargetedSafetyReview: true,
      requiresInstructorReview: true,
      requiresFormalSafetyReassessment: true,
      reassessmentQuestionCount: CHAPTER15_SAFETY_RULES.formalSafetyReassessmentQuestionCount,
      reassessmentPassPercent: CHAPTER15_SAFETY_RULES.formalSafetyReassessmentPassPercent,
      studentMessage: 'Urgent Chapter 15 remediation required: review the affected medical/scope, attachment, and/or chemical-care safety boundaries. A perfect five-question safety reassessment will be required before urgent safety mastery can recover.',
      instructorReason: misses.length + ' recent high-risk misses span ' + hazards.size + ' distinct Chapter 15 hazards; formal safety remediation and a perfect five-question reassessment are required.',
    }
  }

  const latestMiss = [...qualifying].reverse().find((record) => !record.correct)
  if (latestMiss) {
    const tag = getChapter15SafetyTag(latestMiss.itemId)!
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

  return none('Recent tagged Chapter 15 high-risk evidence is correct and no active intervention is required.')
}

export function getChapter15RequiredReassessmentPassPercent(
  records: readonly Chapter15EvidenceRecord[],
  conceptFamilyId: Chapter15ConceptFamilyId,
): 80 | 100 {
  const intervention = evaluateChapter15SafetyIntervention(records)
  if (
    intervention.level === 'urgent' &&
    intervention.affectedConceptFamilyIds.includes(conceptFamilyId)
  ) {
    return CHAPTER15_SAFETY_RULES.formalSafetyReassessmentPassPercent
  }
  return CHAPTER15_SAFETY_RULES.ordinaryReassessmentPassPercent
}

export function containsProhibitedChapter15SafetyLanguage(message: string): boolean {
  const normalized = message.toLowerCase()
  const prohibited = [
    'you have ',
    'client has ',
    'diagnosis:',
    'diagnosed with',
    'prescribe this',
    'take this dose',
    'this medication is right for you',
    'this is an allergic reaction',
  ]
  return prohibited.some((phrase) => normalized.includes(phrase))
}
