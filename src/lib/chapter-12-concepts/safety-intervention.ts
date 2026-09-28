import type { Chapter12EvidenceRecord } from './grading'
import type { Chapter12ConceptFamilyId } from './types'
import type { Chapter12MicroCheckQuestion } from './micro-checks'

export type Chapter12SafetyHazard =
  | 'contamination_exposure_control'
  | 'contagious_condition_service_deferral'
  | 'equipment_contraindication_deferral'
  | 'adverse_reaction_stop_service'
  | 'scope_diagnosis_treatment_boundary'

export type Chapter12SafetyInterventionLevel = 'none' | 'review' | 'urgent'

export interface Chapter12SafetyTaggedItem {
  itemId: string
  conceptFamilyId: Chapter12ConceptFamilyId
  hazard: Chapter12SafetyHazard
  rationale: string
}

export interface Chapter12SafetyIntervention {
  level: Chapter12SafetyInterventionLevel
  hazard: Chapter12SafetyHazard | null
  conceptFamilyId: Chapter12ConceptFamilyId | null
  requiresTargetedSafetyReview: boolean
  requiresInstructorReview: boolean
  requiresFormalSafetyReassessment: boolean
  reassessmentQuestionCount: 5 | null
  reassessmentPassPercent: 100 | null
  studentMessage: string
  instructorReason: string
}

export const CHAPTER12_SAFETY_RULES = {
  recentWindow: 3,
  urgentDistinctSafetyMisses: 2,
  urgentDistinctHazards: 2,
  formalSafetyReassessmentQuestionCount: 5,
  formalSafetyReassessmentPassPercent: 100,
  clearConsecutiveCorrectSafetyObservations: 5,
} as const

export const chapter12SafetyTaggedItems: readonly Chapter12SafetyTaggedItem[] = [
  {
    itemId: 'mcq-12-004',
    conceptFamilyId: 'ch12-massage-principles-manipulations',
    hazard: 'adverse_reaction_stop_service',
    rationale: 'Client discomfort or increasing irritation requires the barber to stop or modify the massage and reassess whether the service remains appropriate.',
  },
  {
    itemId: 'mcq-12-005',
    conceptFamilyId: 'ch12-equipment-electrotherapy',
    hazard: 'equipment_contraindication_deferral',
    rationale: 'Electrical equipment settings must come from the specific device guidance, training, and applicable rules rather than a universal setting.',
  },
  {
    itemId: 'mcq-12-006',
    conceptFamilyId: 'ch12-equipment-electrotherapy',
    hazard: 'equipment_contraindication_deferral',
    rationale: 'If safe use cannot be established from device guidance and training, the electrical service must be deferred rather than tested on the client.',
  },
  {
    itemId: 'mcq-12-010',
    conceptFamilyId: 'ch12-facial-treatment-procedures',
    hazard: 'scope_diagnosis_treatment_boundary',
    rationale: 'Beard products are cosmetic and should not be presented as medical treatment; out-of-scope concerns require referral rather than diagnosis.',
  },
  {
    itemId: 'mcq-12-012',
    conceptFamilyId: 'ch12-sanitation-infection-control',
    hazard: 'contamination_exposure_control',
    rationale: 'Blood or body-fluid exposure requires stopping the service and following the applicable exposure-control procedure.',
  },
  {
    itemId: 'mcq-12-013',
    conceptFamilyId: 'ch12-contraindications-service-safety',
    hazard: 'contagious_condition_service_deferral',
    rationale: 'An active or potentially contagious facial condition can make contact unsafe and requires deferring the facial service without diagnosing.',
  },
  {
    itemId: 'mcq-12-014',
    conceptFamilyId: 'ch12-contraindications-service-safety',
    hazard: 'adverse_reaction_stop_service',
    rationale: 'Burning, dizziness, or another unsafe response requires immediately stopping the service and reassessing safety.',
  },
  {
    itemId: 'mcq-12-016',
    conceptFamilyId: 'ch12-client-care-professional-practice',
    hazard: 'scope_diagnosis_treatment_boundary',
    rationale: 'When a recent procedure, medication change, or other concern makes service safety uncertain, the barber must stay within cosmetic scope and defer when safe service cannot be established.',
  },
  {
    itemId: 'qq-12-029',
    conceptFamilyId: 'ch12-equipment-electrotherapy',
    hazard: 'equipment_contraindication_deferral',
    rationale: 'Device time, distance, intensity, and other operating settings must follow manufacturer directions, training, and applicable rules.',
  },
  {
    itemId: 'qq-12-035',
    conceptFamilyId: 'ch12-skin-analysis-product-selection',
    hazard: 'scope_diagnosis_treatment_boundary',
    rationale: 'Chemical exfoliation requires product directions, training, applicable scope, and jurisdiction-specific requirements rather than medical treatment claims.',
  },
  {
    itemId: 'qq-12-037',
    conceptFamilyId: 'ch12-facial-treatment-procedures',
    hazard: 'adverse_reaction_stop_service',
    rationale: 'Warm-towel service requires comfortable warmth, an unobstructed airway, continuous monitoring, and removal when discomfort occurs.',
  },
  {
    itemId: 'qq-12-038',
    conceptFamilyId: 'ch12-facial-treatment-procedures',
    hazard: 'scope_diagnosis_treatment_boundary',
    rationale: 'A cosmetic beard product must not be presented as treatment for a persistent skin disorder; out-of-scope findings require appropriate referral.',
  },
  {
    itemId: 'qq-12-041',
    conceptFamilyId: 'ch12-sanitation-infection-control',
    hazard: 'contamination_exposure_control',
    rationale: 'Reusable tools and service surfaces must be cleaned and disinfected as required and protected from recontamination.',
  },
  {
    itemId: 'qq-12-042',
    conceptFamilyId: 'ch12-sanitation-infection-control',
    hazard: 'contamination_exposure_control',
    rationale: 'Blood or body-fluid exposure requires stopping the service and following the applicable exposure-control procedure.',
  },
  {
    itemId: 'qq-12-043',
    conceptFamilyId: 'ch12-contraindications-service-safety',
    hazard: 'contagious_condition_service_deferral',
    rationale: 'An active or potentially contagious facial condition can require deferral when contact would be unsafe, without diagnosis or prescribing.',
  },
  {
    itemId: 'qq-12-044',
    conceptFamilyId: 'ch12-contraindications-service-safety',
    hazard: 'equipment_contraindication_deferral',
    rationale: 'If safe use of electrical equipment cannot be established for a disclosed client factor, the electrical service must be deferred rather than tested.',
  },
  {
    itemId: 'qq-12-045',
    conceptFamilyId: 'ch12-contraindications-service-safety',
    hazard: 'adverse_reaction_stop_service',
    rationale: 'Burning and dizziness are unsafe responses that require stopping the service and reassessing before proceeding.',
  },
] as const

const studentMessageForHazard = (hazard: Chapter12SafetyHazard): string => {
  switch (hazard) {
    case 'contamination_exposure_control':
      return 'Safety review required: stop when contamination or blood/body-fluid exposure makes the service unsafe, then follow the applicable exposure-control, cleaning, disinfection, and contamination-prevention procedure.'
    case 'contagious_condition_service_deferral':
      return 'Safety review required: when an active or potentially contagious facial condition makes contact unsafe, defer the affected facial service. Describe observable findings and refer appropriately without diagnosing or prescribing.'
    case 'equipment_contraindication_deferral':
      return 'Safety review required: use electrical or heat equipment only when the specific device directions, training, client consultation, and applicable rules establish safe use. If safety is uncertain, defer the modality rather than testing it on the client.'
    case 'adverse_reaction_stop_service':
      return 'Safety review required: burning, dizziness, increasing irritation, excessive heat, or another unsafe client response requires stopping the service and reassessing safety before proceeding.'
    case 'scope_diagnosis_treatment_boundary':
      return 'Scope review required: keep facial and beard services cosmetic. Observe, make a service-safety decision, and refer when appropriate without diagnosing, prescribing, or presenting cosmetic products or services as medical treatment.'
  }
}

const none = (reason: string): Chapter12SafetyIntervention => ({
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

export function getChapter12SafetyTag(itemId: string): Chapter12SafetyTaggedItem | null {
  return chapter12SafetyTaggedItems.find((item) => item.itemId === itemId) ?? null
}

export function classifyChapter12MicroCheckSafetyMiss(
  question: Chapter12MicroCheckQuestion,
  correct: boolean,
): Chapter12SafetyIntervention {
  if (correct) return none('No Chapter 12 high-risk safety miss is active for this response.')

  const tag = getChapter12SafetyTag(question.id)
  if (!tag) {
    return {
      ...none('This miss remains ordinary concept evidence and does not independently trigger a Chapter 12 safety intervention.'),
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

const safetyEvidence = (records: readonly Chapter12EvidenceRecord[]) =>
  records
    .filter((record) => getChapter12SafetyTag(record.itemId) !== null)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

function trailingCorrectCount(records: readonly Chapter12EvidenceRecord[]): number {
  let count = 0
  for (let index = records.length - 1; index >= 0; index--) {
    if (!records[index].correct) break
    count += 1
  }
  return count
}

export function evaluateChapter12SafetyIntervention(
  records: readonly Chapter12EvidenceRecord[],
): Chapter12SafetyIntervention {
  const qualifying = safetyEvidence(records)
  if (qualifying.length === 0) {
    return none('No tagged Chapter 12 high-risk safety evidence is present.')
  }

  const trailingCorrect = trailingCorrectCount(qualifying)
  if (trailingCorrect >= CHAPTER12_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations) {
    return none(
      `Safety intervention cleared after ${trailingCorrect} consecutive correct high-risk observations.`,
    )
  }

  const recent = qualifying.slice(-CHAPTER12_SAFETY_RULES.recentWindow)
  const misses = recent.filter((record) => !record.correct)
  const distinctItems = new Set(misses.map((record) => record.itemId))
  const hazards = new Set(
    misses
      .map((record) => getChapter12SafetyTag(record.itemId)?.hazard)
      .filter((hazard): hazard is Chapter12SafetyHazard => !!hazard),
  )

  if (
    distinctItems.size >= CHAPTER12_SAFETY_RULES.urgentDistinctSafetyMisses &&
    hazards.size >= CHAPTER12_SAFETY_RULES.urgentDistinctHazards
  ) {
    return {
      level: 'urgent',
      hazard: null,
      conceptFamilyId: null,
      requiresTargetedSafetyReview: true,
      requiresInstructorReview: true,
      requiresFormalSafetyReassessment: true,
      reassessmentQuestionCount: CHAPTER12_SAFETY_RULES.formalSafetyReassessmentQuestionCount,
      reassessmentPassPercent: CHAPTER12_SAFETY_RULES.formalSafetyReassessmentPassPercent,
      studentMessage: 'Urgent safety remediation required: review contamination/exposure control, service deferral, equipment contraindications, adverse-reaction stop rules, and barbering scope before reassessment. A perfect five-question safety reassessment is required.',
      instructorReason: `${misses.length} recent high-risk misses span ${hazards.size} distinct Chapter 12 safety hazards; formal safety remediation and a perfect five-question reassessment are required.`,
    }
  }

  const latestMiss = [...qualifying].reverse().find((record) => !record.correct)
  if (latestMiss) {
    const tag = getChapter12SafetyTag(latestMiss.itemId)!
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

  return none('Recent tagged Chapter 12 safety evidence is correct and no active intervention is required.')
}

export function containsProhibitedChapter12SafetyLanguage(message: string): boolean {
  const normalized = message.toLowerCase()
  const prohibited = [
    'you have ',
    'client has ',
    'diagnosis:',
    'diagnosed with',
    'prescribe ',
    'treat with ',
    'this is an infection',
    'this is contagious',
    'this medication means',
  ]
  return prohibited.some((phrase) => normalized.includes(phrase))
}
