import type { Chapter11EvidenceRecord } from './grading'
import type { Chapter11ConceptFamilyId } from './types'
import type { Chapter11MicroCheckQuestion } from './micro-checks'

export type Chapter11SafetyHazard =
  | 'parasite_treatment_referral'
  | 'staphylococcal_treatment_referral'
  | 'compromised_scalp_service_decision'
  | 'scope_diagnosis_treatment_boundary'

export type Chapter11SafetyInterventionLevel = 'none' | 'review' | 'urgent'

export interface Chapter11SafetyTaggedItem {
  itemId: string
  conceptFamilyId: Chapter11ConceptFamilyId
  hazard: Chapter11SafetyHazard
  rationale: string
}

export interface Chapter11SafetyIntervention {
  level: Chapter11SafetyInterventionLevel
  hazard: Chapter11SafetyHazard | null
  conceptFamilyId: Chapter11ConceptFamilyId | null
  requiresTargetedSafetyReview: boolean
  requiresInstructorReview: boolean
  requiresFormalSafetyReassessment: boolean
  reassessmentQuestionCount: 5 | null
  reassessmentPassPercent: 100 | null
  studentMessage: string
  instructorReason: string
}

export const CHAPTER11_SAFETY_RULES = {
  recentWindow: 3,
  urgentDistinctSafetyMisses: 2,
  urgentDistinctHazards: 2,
  formalSafetyReassessmentQuestionCount: 5,
  formalSafetyReassessmentPassPercent: 100,
  clearConsecutiveCorrectSafetyObservations: 5,
} as const

export const chapter11SafetyTaggedItems: readonly Chapter11SafetyTaggedItem[] = [
  {
    itemId: 'mcq-11-013',
    conceptFamilyId: 'ch11-service-safety-referral',
    hazard: 'parasite_treatment_referral',
    rationale: 'Chapter 11 places parasitic scalp disorders outside barber treatment and directs physician referral.',
  },
  {
    itemId: 'mcq-11-014',
    conceptFamilyId: 'ch11-service-safety-referral',
    hazard: 'staphylococcal_treatment_referral',
    rationale: 'Chapter 11 places staphylococcal scalp infections outside barber treatment and directs physician referral.',
  },
  {
    itemId: 'mcq-11-015',
    conceptFamilyId: 'ch11-service-safety-referral',
    hazard: 'scope_diagnosis_treatment_boundary',
    rationale: 'Chapter 11 limits the barber to observation, cosmetic service decisions, and referral rather than diagnosis, prescribing, or medical treatment.',
  },
  {
    itemId: 'qq-11-031',
    conceptFamilyId: 'ch11-scalp-condition-recognition',
    hazard: 'compromised_scalp_service_decision',
    rationale: 'Abrasions or disorders can make a planned cosmetic service inappropriate and require a safer service decision.',
  },
  {
    itemId: 'qq-11-038',
    conceptFamilyId: 'ch11-service-safety-referral',
    hazard: 'scope_diagnosis_treatment_boundary',
    rationale: 'Students must recognize that parasitic infestations and staphylococcal infections are outside barber treatment scope.',
  },
  {
    itemId: 'qq-11-039',
    conceptFamilyId: 'ch11-service-safety-referral',
    hazard: 'parasite_treatment_referral',
    rationale: 'A parasitic scalp disorder must not be treated by the barber and requires physician referral.',
  },
  {
    itemId: 'qq-11-040',
    conceptFamilyId: 'ch11-service-safety-referral',
    hazard: 'staphylococcal_treatment_referral',
    rationale: 'A suspected staphylococcal scalp infection is outside barber treatment scope and requires referral.',
  },
  {
    itemId: 'qq-11-042',
    conceptFamilyId: 'ch11-service-safety-referral',
    hazard: 'scope_diagnosis_treatment_boundary',
    rationale: 'The barber must decline medical treatment requests and refer appropriately.',
  },
  {
    itemId: 'qq-11-043',
    conceptFamilyId: 'ch11-service-safety-referral',
    hazard: 'compromised_scalp_service_decision',
    rationale: 'When the barber cannot determine that a scalp problem is appropriate for routine cosmetic treatment, the safer decision is to pause or modify service and refer as needed.',
  },
  {
    itemId: 'qq-11-050',
    conceptFamilyId: 'ch11-client-care-professional-practice',
    hazard: 'scope_diagnosis_treatment_boundary',
    rationale: 'Professional practice requires cosmetic care within scope and referral rather than diagnosis, prescribing, or medical treatment.',
  },
] as const

const studentMessageForHazard = (hazard: Chapter11SafetyHazard): string => {
  switch (hazard) {
    case 'parasite_treatment_referral':
      return 'Safety review required: do not treat a parasitic scalp disorder as a barber. Stop or avoid the affected cosmetic service as appropriate and refer the client to a physician.'
    case 'staphylococcal_treatment_referral':
      return 'Safety review required: a suspected staphylococcal scalp infection is outside barber treatment scope. Do not treat it as a barber; refer the client to a physician.'
    case 'compromised_scalp_service_decision':
      return 'Safety review required: abrasions, disorders, or uncertain scalp findings can make a cosmetic service inappropriate. Pause or modify the service as needed and refer when the concern is outside scope.'
    case 'scope_diagnosis_treatment_boundary':
      return 'Scope review required: describe observable findings, make a cosmetic service-safety decision, and refer when appropriate without diagnosing, prescribing, or medically treating the condition.'
  }
}

const none = (reason: string): Chapter11SafetyIntervention => ({
  level: 'none',
  hazard: null,
  conceptFamilyId: null,
  requiresTargetedSafetyReview: false,
  requiresInstructorReview: false,
  requiresFormalSafetyReassessment: false,
  reassessmentQuestionCount: null,
  reassessmentPassPercent: null,
  studentMessage: '',
  instructorReason: reason,
})

export function getChapter11SafetyTag(itemId: string): Chapter11SafetyTaggedItem | null {
  return chapter11SafetyTaggedItems.find((item) => item.itemId === itemId) ?? null
}

export function classifyChapter11MicroCheckSafetyMiss(
  question: Chapter11MicroCheckQuestion,
  correct: boolean,
): Chapter11SafetyIntervention {
  if (correct) return none('No Chapter 11 high-risk safety miss is active for this response.')

  const tag = getChapter11SafetyTag(question.id)
  if (!tag) {
    return {
      ...none('This miss remains ordinary concept evidence and does not independently trigger a Chapter 11 safety intervention.'),
      conceptFamilyId: question.conceptFamilyId,
    }
  }

  return {
    level: 'review',
    hazard: tag.hazard,
    conceptFamilyId: tag.conceptFamilyId,
    requiresTargetedSafetyReview: true,
    requiresInstructorReview: true,
    requiresFormalSafetyReassessment: false,
    reassessmentQuestionCount: null,
    reassessmentPassPercent: null,
    studentMessage: studentMessageForHazard(tag.hazard),
    instructorReason: tag.rationale,
  }
}

const safetyEvidence = (records: readonly Chapter11EvidenceRecord[]) =>
  records
    .filter((record) => getChapter11SafetyTag(record.itemId) !== null)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

function trailingCorrectCount(records: readonly Chapter11EvidenceRecord[]): number {
  let count = 0
  for (let index = records.length - 1; index >= 0; index--) {
    if (!records[index].correct) break
    count += 1
  }
  return count
}

export function evaluateChapter11SafetyIntervention(
  records: readonly Chapter11EvidenceRecord[],
): Chapter11SafetyIntervention {
  const qualifying = safetyEvidence(records)
  if (qualifying.length === 0) {
    return none('No tagged Chapter 11 high-risk safety evidence is present.')
  }

  const trailingCorrect = trailingCorrectCount(qualifying)
  if (trailingCorrect >= CHAPTER11_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations) {
    return none(
      `Safety intervention cleared after ${trailingCorrect} consecutive correct high-risk observations.`,
    )
  }

  const recent = qualifying.slice(-CHAPTER11_SAFETY_RULES.recentWindow)
  const misses = recent.filter((record) => !record.correct)
  const distinctItems = new Set(misses.map((record) => record.itemId))
  const hazards = new Set(
    misses
      .map((record) => getChapter11SafetyTag(record.itemId)?.hazard)
      .filter((hazard): hazard is Chapter11SafetyHazard => !!hazard),
  )

  if (
    distinctItems.size >= CHAPTER11_SAFETY_RULES.urgentDistinctSafetyMisses &&
    hazards.size >= CHAPTER11_SAFETY_RULES.urgentDistinctHazards
  ) {
    return {
      level: 'urgent',
      hazard: null,
      conceptFamilyId: null,
      requiresTargetedSafetyReview: true,
      requiresInstructorReview: true,
      requiresFormalSafetyReassessment: true,
      reassessmentQuestionCount: CHAPTER11_SAFETY_RULES.formalSafetyReassessmentQuestionCount,
      reassessmentPassPercent: CHAPTER11_SAFETY_RULES.formalSafetyReassessmentPassPercent,
      studentMessage: 'Urgent safety remediation required: review prohibited-disorder treatment boundaries, safe service decisions for compromised scalp findings, and barber-versus-medical scope before reassessment. A perfect five-question safety reassessment is required.',
      instructorReason: `${misses.length} recent high-risk misses span ${hazards.size} distinct Chapter 11 safety hazards; formal safety remediation and a perfect five-question reassessment are required.`,
    }
  }

  const latestMiss = [...qualifying].reverse().find((record) => !record.correct)
  if (latestMiss) {
    const tag = getChapter11SafetyTag(latestMiss.itemId)!
    return {
      level: 'review',
      hazard: tag.hazard,
      conceptFamilyId: tag.conceptFamilyId,
      requiresTargetedSafetyReview: true,
      requiresInstructorReview: true,
      requiresFormalSafetyReassessment: false,
      reassessmentQuestionCount: null,
      reassessmentPassPercent: null,
      studentMessage: studentMessageForHazard(tag.hazard),
      instructorReason: tag.rationale,
    }
  }

  return none('Recent tagged Chapter 11 safety evidence is correct and no active intervention is required.')
}

export function containsProhibitedChapter11SafetyLanguage(message: string): boolean {
  const normalized = message.toLowerCase()
  const prohibited = [
    'you have ',
    'client has ',
    'diagnosis:',
    'diagnosed with',
    'prescribe ',
    'treat with ',
    'this is an infection',
    'this is a parasite',
  ]
  return prohibited.some((phrase) => normalized.includes(phrase))
}
