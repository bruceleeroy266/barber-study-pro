import type { Chapter10EvidenceRecord } from './grading'
import type { Chapter10ConceptFamilyId } from './types'
import type { Chapter10MicroCheckQuestion } from './micro-checks'

export type Chapter10SafetyHazard =
  | 'parasite_service_stop'
  | 'contagious_condition_referral'
  | 'chemical_service_compromised_scalp'
  | 'scope_diagnosis_treatment_boundary'

export type Chapter10SafetyInterventionLevel = 'none' | 'review' | 'urgent'

export interface Chapter10SafetyTaggedItem {
  itemId: string
  conceptFamilyId: Chapter10ConceptFamilyId
  hazard: Chapter10SafetyHazard
  rationale: string
}

export interface Chapter10SafetyIntervention {
  level: Chapter10SafetyInterventionLevel
  hazard: Chapter10SafetyHazard | null
  conceptFamilyId: Chapter10ConceptFamilyId | null
  requiresTargetedSafetyReview: boolean
  requiresInstructorReview: boolean
  requiresFormalSafetyReassessment: boolean
  reassessmentQuestionCount: 5 | null
  reassessmentPassPercent: 100 | null
  studentMessage: string
  instructorReason: string
}

export const CHAPTER10_SAFETY_RULES = {
  recentWindow: 3,
  urgentDistinctSafetyMisses: 2,
  urgentDistinctHazards: 2,
  formalSafetyReassessmentQuestionCount: 5,
  formalSafetyReassessmentPassPercent: 100,
  clearConsecutiveCorrectSafetyObservations: 5,
} as const

export const chapter10SafetyTaggedItems: readonly Chapter10SafetyTaggedItem[] = [
  {
    itemId: 'mcq-10-015',
    conceptFamilyId: 'ch10-infectious-parasitic-scalp',
    hazard: 'parasite_service_stop',
    rationale: 'Missing head-lice recognition can undermine the Chapter 10 rule that a service should not begin when parasites are present.',
  },
  {
    itemId: 'mcq-10-016',
    conceptFamilyId: 'ch10-infectious-parasitic-scalp',
    hazard: 'contagious_condition_referral',
    rationale: 'Tinea capitis is a contagious scalp condition in the Chapter 10 source record and requires recognition plus referral boundaries.',
  },
  {
    itemId: 'mcq-10-017',
    conceptFamilyId: 'ch10-service-safety-referral',
    hazard: 'parasite_service_stop',
    rationale: 'Live parasites require a do-not-begin service decision plus cleaning/disinfection and referral guidance.',
  },
  {
    itemId: 'mcq-10-018',
    conceptFamilyId: 'ch10-service-safety-referral',
    hazard: 'chemical_service_compromised_scalp',
    rationale: 'Irritation or abrasions are a direct Chapter 10 contraindication to proceeding with a chemical service.',
  },
  {
    itemId: 'mcq-10-019',
    conceptFamilyId: 'ch10-service-safety-referral',
    hazard: 'scope_diagnosis_treatment_boundary',
    rationale: 'Barbers may observe, communicate, make a safe service decision, and refer, but must not diagnose or prescribe treatment.',
  },
  {
    itemId: 'qq-10-034',
    conceptFamilyId: 'ch10-service-safety-referral',
    hazard: 'parasite_service_stop',
    rationale: 'Live head lice before service require the service not to begin and require cleaning/disinfection guidance.',
  },
  {
    itemId: 'qq-10-035',
    conceptFamilyId: 'ch10-service-safety-referral',
    hazard: 'parasite_service_stop',
    rationale: 'Scabies is a contagious parasitic condition; missing parasite recognition can lead to an unsafe service decision.',
  },
  {
    itemId: 'qq-10-040',
    conceptFamilyId: 'ch10-service-safety-referral',
    hazard: 'contagious_condition_referral',
    rationale: 'Suspected tinea is handled through affected-service avoidance and physician referral rather than barber treatment.',
  },
  {
    itemId: 'qq-10-066',
    conceptFamilyId: 'ch10-service-safety-referral',
    hazard: 'parasite_service_stop',
    rationale: 'Parasites are explicitly identified as a finding that means the barber should not begin the service.',
  },
  {
    itemId: 'qq-10-067',
    conceptFamilyId: 'ch10-service-safety-referral',
    hazard: 'chemical_service_compromised_scalp',
    rationale: 'Chemical services should not proceed when irritation or abrasions are present.',
  },
  {
    itemId: 'qq-10-075',
    conceptFamilyId: 'ch10-infectious-parasitic-scalp',
    hazard: 'contagious_condition_referral',
    rationale: 'Tinea capitis recognition supports the Chapter 10 contagious-condition and referral boundary.',
  },
] as const

const studentMessageForHazard = (hazard: Chapter10SafetyHazard): string => {
  switch (hazard) {
    case 'parasite_service_stop':
      return 'Safety review required: when parasites are present, do not begin the service. Follow required cleaning and disinfection procedures and use appropriate referral guidance.'
    case 'contagious_condition_referral':
      return 'Safety review required: recognize the contagious-condition risk, avoid the affected service, follow sanitation requirements, and use appropriate referral guidance. Do not diagnose or treat the condition.'
    case 'chemical_service_compromised_scalp':
      return 'Safety review required: do not proceed with a chemical service when irritation or abrasions are present. Protect the client and stay within barbering scope.'
    case 'scope_diagnosis_treatment_boundary':
      return 'Scope review required: describe observable signs, make a service-safety decision, and refer when appropriate without diagnosing, prescribing, or treating a medical condition.'
  }
}

const none = (reason: string): Chapter10SafetyIntervention => ({
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

export function getChapter10SafetyTag(itemId: string): Chapter10SafetyTaggedItem | null {
  return chapter10SafetyTaggedItems.find((item) => item.itemId === itemId) ?? null
}

export function classifyChapter10MicroCheckSafetyMiss(
  question: Chapter10MicroCheckQuestion,
  correct: boolean,
): Chapter10SafetyIntervention {
  if (correct) return none('No Chapter 10 high-risk safety miss is active for this response.')

  const tag = getChapter10SafetyTag(question.id)
  if (!tag) {
    return {
      ...none('This miss remains ordinary concept evidence and does not independently trigger a Chapter 10 safety intervention.'),
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

const safetyEvidence = (records: readonly Chapter10EvidenceRecord[]) =>
  records
    .filter((record) => getChapter10SafetyTag(record.itemId) !== null)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

function trailingCorrectCount(records: readonly Chapter10EvidenceRecord[]): number {
  let count = 0
  for (let index = records.length - 1; index >= 0; index--) {
    if (!records[index].correct) break
    count += 1
  }
  return count
}

export function evaluateChapter10SafetyIntervention(
  records: readonly Chapter10EvidenceRecord[],
): Chapter10SafetyIntervention {
  const qualifying = safetyEvidence(records)
  if (qualifying.length === 0) {
    return none('No tagged Chapter 10 high-risk safety evidence is present.')
  }

  const trailingCorrect = trailingCorrectCount(qualifying)
  if (trailingCorrect >= CHAPTER10_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations) {
    return none(
      `Safety intervention cleared after ${trailingCorrect} consecutive correct high-risk observations.`,
    )
  }

  const recent = qualifying.slice(-CHAPTER10_SAFETY_RULES.recentWindow)
  const misses = recent.filter((record) => !record.correct)
  const distinctItems = new Set(misses.map((record) => record.itemId))
  const hazards = new Set(
    misses
      .map((record) => getChapter10SafetyTag(record.itemId)?.hazard)
      .filter((hazard): hazard is Chapter10SafetyHazard => !!hazard),
  )

  if (
    distinctItems.size >= CHAPTER10_SAFETY_RULES.urgentDistinctSafetyMisses &&
    hazards.size >= CHAPTER10_SAFETY_RULES.urgentDistinctHazards
  ) {
    return {
      level: 'urgent',
      hazard: null,
      conceptFamilyId: null,
      requiresTargetedSafetyReview: true,
      requiresInstructorReview: true,
      requiresFormalSafetyReassessment: true,
      reassessmentQuestionCount: CHAPTER10_SAFETY_RULES.formalSafetyReassessmentQuestionCount,
      reassessmentPassPercent: CHAPTER10_SAFETY_RULES.formalSafetyReassessmentPassPercent,
      studentMessage: 'Urgent safety remediation required: review parasite service-stop rules, contagious-condition/referral boundaries, chemical-service contraindications, sanitation, and barber-versus-medical scope before reassessment. A perfect five-question safety reassessment is required.',
      instructorReason: `${misses.length} recent high-risk misses span ${hazards.size} distinct Chapter 10 safety hazards; formal safety remediation and a perfect five-question reassessment are required.`,
    }
  }

  const latestMiss = [...qualifying].reverse().find((record) => !record.correct)
  if (latestMiss) {
    const tag = getChapter10SafetyTag(latestMiss.itemId)!
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

  return none('Recent tagged Chapter 10 safety evidence is correct and no active intervention is required.')
}

export function containsProhibitedChapter10SafetyLanguage(message: string): boolean {
  const normalized = message.toLowerCase()
  const prohibited = [
    'you have ',
    'client has ',
    'diagnosis:',
    'diagnosed with',
    'prescribe ',
    'treat with ',
    'this is an infection',
    'this is ringworm',
    'this is scabies',
  ]
  return prohibited.some((phrase) => normalized.includes(phrase))
}
