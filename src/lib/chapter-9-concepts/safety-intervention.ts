import type { Chapter9EvidenceRecord } from './grading'
import type { Chapter9ConceptFamilyId } from './types'
import type { Chapter9MicroCheckQuestion } from './micro-checks'

export type Chapter9SafetyHazard =
  | 'active_infectious_lesion'
  | 'suspicious_changing_lesion'
  | 'open_compromised_skin'
  | 'heat_regulation_danger'
  | 'scope_diagnosis_boundary'

export type Chapter9SafetyInterventionLevel = 'none' | 'review' | 'urgent'

export interface Chapter9SafetyTaggedItem {
  itemId: string
  conceptFamilyId: Chapter9ConceptFamilyId
  hazard: Chapter9SafetyHazard
  rationale: string
}

export interface Chapter9SafetyIntervention {
  level: Chapter9SafetyInterventionLevel
  hazard: Chapter9SafetyHazard | null
  conceptFamilyId: Chapter9ConceptFamilyId | null
  requiresTargetedSafetyReview: boolean
  requiresInstructorReview: boolean
  requiresFormalSafetyReassessment: boolean
  reassessmentQuestionCount: 5 | null
  reassessmentPassPercent: 100 | null
  studentMessage: string
  instructorReason: string
}

export const CHAPTER9_SAFETY_RULES = {
  recentWindow: 3,
  urgentDistinctSafetyMisses: 2,
  urgentDistinctHazards: 2,
  formalSafetyReassessmentQuestionCount: 5,
  formalSafetyReassessmentPassPercent: 100,
  clearConsecutiveCorrectSafetyObservations: 5,
} as const

export const chapter9SafetyTaggedItems: readonly Chapter9SafetyTaggedItem[] = [
  {
    itemId: 'mcq-9-010',
    conceptFamilyId: 'ch9-secondary-lesions',
    hazard: 'open_compromised_skin',
    rationale: 'Open or depth-compromised skin in the direct service path requires a stop/avoid decision rather than continued razor work.',
  },
  {
    itemId: 'mcq-9-011',
    conceptFamilyId: 'ch9-sebaceous-sudoriferous-disorders',
    hazard: 'heat_regulation_danger',
    rationale: 'Inability to perspire with overheating is a service-safety hazard that requires stopping heat exposure and appropriate escalation.',
  },
  {
    itemId: 'mcq-9-014',
    conceptFamilyId: 'ch9-inflammatory-infectious-conditions',
    hazard: 'active_infectious_lesion',
    rationale: 'An active potentially contagious lesion in the service area requires avoiding direct service and following sanitation/referral guidance.',
  },
  {
    itemId: 'mcq-9-019',
    conceptFamilyId: 'ch9-service-safety-referral',
    hazard: 'suspicious_changing_lesion',
    rationale: 'A changing lesion in the service path requires observation, avoidance of unsafe direct service, and referral without diagnosis.',
  },
  {
    itemId: 'mcq-9-020',
    conceptFamilyId: 'ch9-service-safety-referral',
    hazard: 'active_infectious_lesion',
    rationale: 'Open, draining, or potentially infectious skin in the service area requires an infection-control response without diagnosing the condition.',
  },
  {
    itemId: 'mcq-9-021',
    conceptFamilyId: 'ch9-service-safety-referral',
    hazard: 'scope_diagnosis_boundary',
    rationale: 'Barbers may describe observable findings and service implications but must not assign a medical diagnosis.',
  },
  {
    itemId: 'q9-015',
    conceptFamilyId: 'ch9-primary-lesions',
    hazard: 'active_infectious_lesion',
    rationale: 'A pus-filled lesion in the shave path requires avoiding direct service when open, draining, or potentially infectious without diagnosing a disease.',
  },
  {
    itemId: 'q9-018',
    conceptFamilyId: 'ch9-secondary-lesions',
    hazard: 'open_compromised_skin',
    rationale: 'An open lesion with loss of skin depth in the shave path requires pausing direct service and appropriate referral.',
  },
  {
    itemId: 'q9-022',
    conceptFamilyId: 'ch9-sebaceous-sudoriferous-disorders',
    hazard: 'heat_regulation_danger',
    rationale: 'Inability to sweat with overheating is a heat-regulation danger requiring immediate stop-heat service logic.',
  },
  {
    itemId: 'q9-024',
    conceptFamilyId: 'ch9-inflammatory-infectious-conditions',
    hazard: 'active_infectious_lesion',
    rationale: 'An active contagious lesion in the facial service area requires pausing the affected service and sanitation/referral action.',
  },
  {
    itemId: 'q9-026',
    conceptFamilyId: 'ch9-pigmentation-hypertrophies',
    hazard: 'active_infectious_lesion',
    rationale: 'An infectious growth in the razor path should not be traumatized or directly serviced and does not authorize diagnosis or removal.',
  },
  {
    itemId: 'q9-029',
    conceptFamilyId: 'ch9-skin-cancer-recognition',
    hazard: 'suspicious_changing_lesion',
    rationale: 'ABCDE evolution is an observation warning sign that supports referral, not a diagnosis.',
  },
  {
    itemId: 'q9-030',
    conceptFamilyId: 'ch9-service-safety-referral',
    hazard: 'scope_diagnosis_boundary',
    rationale: 'An unfamiliar changing lesion must be described without diagnosis; unsafe direct service is paused and qualified evaluation is recommended.',
  },
] as const

const studentMessageForHazard = (hazard: Chapter9SafetyHazard): string => {
  switch (hazard) {
    case 'active_infectious_lesion':
      return 'Safety review required: recognize observable infection risk, avoid direct service on the affected area, follow sanitation requirements, and refer when appropriate. Do not diagnose the condition.'
    case 'suspicious_changing_lesion':
      return 'Safety review required: describe the observable change, avoid unsafe direct service, and recommend qualified medical evaluation. Do not label or diagnose the lesion.'
    case 'open_compromised_skin':
      return 'Safety review required: do not perform direct razor or tool work over open or compromised skin. Protect the area, follow sanitation procedures, and refer when appropriate.'
    case 'heat_regulation_danger':
      return 'Safety review required: stop heat exposure when a client shows overheating risk or cannot regulate heat normally. Follow service-safety procedures and recommend qualified evaluation when needed.'
    case 'scope_diagnosis_boundary':
      return 'Scope review required: a barber may observe and describe visible signs and make a safe service decision, but may not diagnose, prescribe, or treat a medical condition.'
  }
}

export function getChapter9SafetyTag(itemId: string): Chapter9SafetyTaggedItem | null {
  return chapter9SafetyTaggedItems.find((item) => item.itemId === itemId) ?? null
}

export function classifyChapter9MicroCheckSafetyMiss(
  question: Chapter9MicroCheckQuestion,
  correct: boolean,
): Chapter9SafetyIntervention {
  if (correct) {
    return {
      level: 'none',
      hazard: null,
      conceptFamilyId: null,
      requiresTargetedSafetyReview: false,
      requiresInstructorReview: false,
      requiresFormalSafetyReassessment: false,
      reassessmentQuestionCount: null,
      reassessmentPassPercent: null,
      studentMessage: '',
      instructorReason: 'No Chapter 9 high-risk safety miss is active for this response.',
    }
  }

  const tag = getChapter9SafetyTag(question.id)
  if (!tag) {
    return {
      level: 'none',
      hazard: null,
      conceptFamilyId: question.conceptFamilyId,
      requiresTargetedSafetyReview: false,
      requiresInstructorReview: false,
      requiresFormalSafetyReassessment: false,
      reassessmentQuestionCount: null,
      reassessmentPassPercent: null,
      studentMessage: '',
      instructorReason: 'This miss remains ordinary concept evidence and does not independently trigger a Chapter 9 clinical-boundary intervention.',
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

const safetyEvidence = (records: readonly Chapter9EvidenceRecord[]) =>
  records
    .filter((record) => getChapter9SafetyTag(record.itemId) !== null)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

function trailingCorrectCount(records: readonly Chapter9EvidenceRecord[]): number {
  let count = 0
  for (let index = records.length - 1; index >= 0; index--) {
    if (!records[index].correct) break
    count += 1
  }
  return count
}

export function evaluateChapter9SafetyIntervention(
  records: readonly Chapter9EvidenceRecord[],
): Chapter9SafetyIntervention {
  const qualifying = safetyEvidence(records)
  if (qualifying.length === 0) {
    return {
      level: 'none',
      hazard: null,
      conceptFamilyId: null,
      requiresTargetedSafetyReview: false,
      requiresInstructorReview: false,
      requiresFormalSafetyReassessment: false,
      reassessmentQuestionCount: null,
      reassessmentPassPercent: null,
      studentMessage: '',
      instructorReason: 'No tagged Chapter 9 high-risk safety evidence is present.',
    }
  }

  const trailingCorrect = trailingCorrectCount(qualifying)
  if (trailingCorrect >= CHAPTER9_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations) {
    return {
      level: 'none',
      hazard: null,
      conceptFamilyId: null,
      requiresTargetedSafetyReview: false,
      requiresInstructorReview: false,
      requiresFormalSafetyReassessment: false,
      reassessmentQuestionCount: null,
      reassessmentPassPercent: null,
      studentMessage: '',
      instructorReason: `Safety intervention cleared after ${trailingCorrect} consecutive correct high-risk observations.`,
    }
  }

  const recent = qualifying.slice(-CHAPTER9_SAFETY_RULES.recentWindow)
  const misses = recent.filter((record) => !record.correct)
  const distinctItems = new Set(misses.map((record) => record.itemId))
  const hazards = new Set(
    misses
      .map((record) => getChapter9SafetyTag(record.itemId)?.hazard)
      .filter((hazard): hazard is Chapter9SafetyHazard => !!hazard),
  )

  if (
    distinctItems.size >= CHAPTER9_SAFETY_RULES.urgentDistinctSafetyMisses &&
    hazards.size >= CHAPTER9_SAFETY_RULES.urgentDistinctHazards
  ) {
    return {
      level: 'urgent',
      hazard: null,
      conceptFamilyId: null,
      requiresTargetedSafetyReview: true,
      requiresInstructorReview: true,
      requiresFormalSafetyReassessment: true,
      reassessmentQuestionCount: CHAPTER9_SAFETY_RULES.formalSafetyReassessmentQuestionCount,
      reassessmentPassPercent: CHAPTER9_SAFETY_RULES.formalSafetyReassessmentPassPercent,
      studentMessage: 'Urgent safety remediation required: review service-stopping hazards, infection-control decisions, referral boundaries, and barber-versus-medical scope before reassessment. The system identifies observable risk patterns; it does not diagnose medical conditions.',
      instructorReason: `${misses.length} recent high-risk misses span ${hazards.size} distinct safety hazards; formal safety remediation and a perfect five-question reassessment are required.`,
    }
  }

  const latestMiss = [...qualifying].reverse().find((record) => !record.correct)
  if (latestMiss) {
    const tag = getChapter9SafetyTag(latestMiss.itemId)!
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

  return {
    level: 'none',
    hazard: null,
    conceptFamilyId: null,
    requiresTargetedSafetyReview: false,
    requiresInstructorReview: false,
    requiresFormalSafetyReassessment: false,
    reassessmentQuestionCount: null,
    reassessmentPassPercent: null,
    studentMessage: '',
    instructorReason: 'Recent tagged Chapter 9 safety evidence is correct and no active intervention is required.',
  }
}

export function containsProhibitedDiagnosticLanguage(message: string): boolean {
  const normalized = message.toLowerCase()
  const prohibited = [
    'you have ',
    'client has ',
    'this is cancer',
    'this is melanoma',
    'this is an infection',
    'diagnosis:',
    'diagnosed with',
    'prescribe ',
    'treat with ',
  ]
  return prohibited.some((phrase) => normalized.includes(phrase))
}
