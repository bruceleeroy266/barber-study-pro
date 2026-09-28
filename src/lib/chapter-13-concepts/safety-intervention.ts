import type { Chapter13EvidenceRecord } from './grading'
import type { Chapter13ConceptFamilyId } from './types'
import type { Chapter13MicroCheckQuestion } from './micro-checks'

export type Chapter13SafetyHazard =
  | 'blood_exposure_response'
  | 'compromised_skin_service_deferral'
  | 'medical_scope_boundary'
  | 'heat_towel_contraindication'

export type Chapter13SafetyInterventionLevel = 'none' | 'review' | 'urgent'

export interface Chapter13SafetyTaggedItem {
  itemId: string
  conceptFamilyId: Chapter13ConceptFamilyId
  hazard: Chapter13SafetyHazard
  rationale: string
}

export interface Chapter13SafetyIntervention {
  level: Chapter13SafetyInterventionLevel
  hazard: Chapter13SafetyHazard | null
  conceptFamilyId: Chapter13ConceptFamilyId | null
  affectedConceptFamilyIds: readonly Chapter13ConceptFamilyId[]
  requiresTargetedSafetyReview: boolean
  requiresInstructorReview: boolean
  requiresFormalSafetyReassessment: boolean
  reassessmentQuestionCount: 5 | null
  reassessmentPassPercent: 100 | null
  studentMessage: string
  instructorReason: string
}

export const CHAPTER13_SAFETY_RULES = {
  recentWindow: 3,
  urgentDistinctSafetyMisses: 2,
  urgentDistinctHazards: 2,
  formalSafetyReassessmentQuestionCount: 5,
  formalSafetyReassessmentPassPercent: 100,
  ordinaryReassessmentPassPercent: 80,
  clearConsecutiveCorrectSafetyObservations: 5,
} as const

export const chapter13SafetyTaggedItems: readonly Chapter13SafetyTaggedItem[] = [
  {
    itemId: 'qq-13-006',
    conceptFamilyId: 'ch13-infection-control-service-safety',
    hazard: 'compromised_skin_service_deferral',
    rationale: 'Visible pustules or signs of active infection require a safer service decision rather than shaving through the affected area.',
  },
  {
    itemId: 'qq-13-007',
    conceptFamilyId: 'ch13-infection-control-service-safety',
    hazard: 'heat_towel_contraindication',
    rationale: 'Compromised or highly heat-sensitive skin requires towel preparation to be avoided or modified.',
  },
  {
    itemId: 'qq-13-010',
    conceptFamilyId: 'ch13-infection-control-service-safety',
    hazard: 'blood_exposure_response',
    rationale: 'Visible blood requires the service to stop and the applicable exposure-control procedure to be followed.',
  },
  {
    itemId: 'qq-13-014',
    conceptFamilyId: 'ch13-hair-growth-ingrown-prevention',
    hazard: 'medical_scope_boundary',
    rationale: 'Inflamed ingrown-hair findings must not be diagnosed or medically treated by the barber.',
  },
  {
    itemId: 'mcq-13-002',
    conceptFamilyId: 'ch13-consultation-service-preparation',
    hazard: 'heat_towel_contraindication',
    rationale: 'Heat preparation must be adjusted to the client’s skin tolerance rather than intensified automatically for coarse beard growth.',
  },
  {
    itemId: 'mcq-13-004',
    conceptFamilyId: 'ch13-hair-growth-ingrown-prevention',
    hazard: 'medical_scope_boundary',
    rationale: 'The barber must recognize the service boundary for inflamed ingrown-hair findings without diagnosing or treating a medical condition.',
  },
  {
    itemId: 'mcq-13-013',
    conceptFamilyId: 'ch13-infection-control-service-safety',
    hazard: 'blood_exposure_response',
    rationale: 'A razor nick with visible blood requires an immediate pause and proper exposure-control procedure.',
  },
] as const

const none = (reason: string): Chapter13SafetyIntervention => ({
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

function studentMessageForHazard(hazard: Chapter13SafetyHazard): string {
  switch (hazard) {
    case 'blood_exposure_response':
      return 'Safety review required: if visible blood occurs, stop the service and follow standard precautions and the applicable exposure incident procedure before continuing.'
    case 'compromised_skin_service_deferral':
      return 'Safety review required: do not shave through visible pustules or signs of active infection. Defer the affected area and follow the appropriate infection-control and referral process.'
    case 'medical_scope_boundary':
      return 'Scope review required: describe observable findings and make a safe service decision without diagnosing, prescribing, opening lesions, or medically treating the condition.'
    case 'heat_towel_contraindication':
      return 'Safety review required: hot-towel preparation must be avoided or modified when the skin is compromised, highly sensitive, or poorly tolerant of heat.'
  }
}

export function getChapter13SafetyTag(itemId: string): Chapter13SafetyTaggedItem | null {
  return chapter13SafetyTaggedItems.find((item) => item.itemId === itemId) ?? null
}

export function classifyChapter13MicroCheckSafetyMiss(
  question: Chapter13MicroCheckQuestion,
  correct: boolean,
): Chapter13SafetyIntervention {
  if (correct) return none('No Chapter 13 high-risk safety miss is active for this response.')

  const tag = getChapter13SafetyTag(question.id)
  if (!tag) {
    return {
      ...none('This miss remains ordinary concept evidence and does not independently trigger a Chapter 13 safety intervention.'),
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

const safetyEvidence = (records: readonly Chapter13EvidenceRecord[]) =>
  records
    .filter((record) => getChapter13SafetyTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))

function trailingCorrectCount(records: readonly Chapter13EvidenceRecord[]): number {
  let count = 0
  for (let index = records.length - 1; index >= 0; index--) {
    if (!records[index].correct) break
    count += 1
  }
  return count
}

export function evaluateChapter13SafetyIntervention(
  records: readonly Chapter13EvidenceRecord[],
): Chapter13SafetyIntervention {
  const qualifying = safetyEvidence(records)
  if (qualifying.length === 0) {
    return none('No tagged Chapter 13 high-risk safety evidence is present.')
  }

  const trailingCorrect = trailingCorrectCount(qualifying)
  if (trailingCorrect >= CHAPTER13_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations) {
    return none(
      `Safety intervention cleared after ${trailingCorrect} consecutive correct high-risk observations.`,
    )
  }

  const recent = qualifying.slice(-CHAPTER13_SAFETY_RULES.recentWindow)
  const misses = recent.filter((record) => !record.correct)
  const distinctItems = new Set(misses.map((record) => record.itemId))
  const hazards = new Set(
    misses
      .map((record) => getChapter13SafetyTag(record.itemId)?.hazard)
      .filter((hazard): hazard is Chapter13SafetyHazard => !!hazard),
  )
  const affectedConceptFamilyIds = [...new Set(misses.map((record) => record.conceptFamilyId))]

  if (
    distinctItems.size >= CHAPTER13_SAFETY_RULES.urgentDistinctSafetyMisses &&
    hazards.size >= CHAPTER13_SAFETY_RULES.urgentDistinctHazards
  ) {
    return {
      level: 'urgent',
      hazard: null,
      conceptFamilyId: null,
      affectedConceptFamilyIds,
      requiresTargetedSafetyReview: true,
      requiresInstructorReview: true,
      requiresFormalSafetyReassessment: true,
      reassessmentQuestionCount: CHAPTER13_SAFETY_RULES.formalSafetyReassessmentQuestionCount,
      reassessmentPassPercent: CHAPTER13_SAFETY_RULES.formalSafetyReassessmentPassPercent,
      studentMessage: 'Urgent shaving-safety remediation required: review blood-exposure response, compromised-skin service decisions, heat/towel contraindications, and barbering scope as applicable. A perfect five-question safety reassessment is required before urgent safety mastery can recover.',
      instructorReason: `${misses.length} recent high-risk misses span ${hazards.size} distinct Chapter 13 safety hazards; formal safety remediation and a perfect five-question reassessment are required.`,
    }
  }

  const latestMiss = [...qualifying].reverse().find((record) => !record.correct)
  if (latestMiss) {
    const tag = getChapter13SafetyTag(latestMiss.itemId)!
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

  return none('Recent tagged Chapter 13 safety evidence is correct and no active intervention is required.')
}

export function getChapter13RequiredReassessmentPassPercent(
  records: readonly Chapter13EvidenceRecord[],
  conceptFamilyId: Chapter13ConceptFamilyId,
): 80 | 100 {
  const intervention = evaluateChapter13SafetyIntervention(records)
  if (
    intervention.level === 'urgent' &&
    intervention.affectedConceptFamilyIds.includes(conceptFamilyId)
  ) {
    return CHAPTER13_SAFETY_RULES.formalSafetyReassessmentPassPercent
  }
  return CHAPTER13_SAFETY_RULES.ordinaryReassessmentPassPercent
}

export function evaluateChapter13SafetyRecovery(args: {
  records: readonly Chapter13EvidenceRecord[]
  conceptFamilyId: Chapter13ConceptFamilyId
  responses: readonly boolean[]
}): {
  requiredPassPercent: 80 | 100
  percent: number
  passed: boolean
  blocksMasteryRecovery: boolean
} {
  if (args.responses.length !== CHAPTER13_SAFETY_RULES.formalSafetyReassessmentQuestionCount) {
    throw new Error('Chapter 13 formal reassessment requires exactly five responses.')
  }
  const correct = args.responses.filter(Boolean).length
  const percent = Math.round((correct / args.responses.length) * 10000) / 100
  const requiredPassPercent = getChapter13RequiredReassessmentPassPercent(args.records, args.conceptFamilyId)
  const passed = percent >= requiredPassPercent
  return {
    requiredPassPercent,
    percent,
    passed,
    blocksMasteryRecovery: requiredPassPercent === 100 && !passed,
  }
}

export function containsProhibitedChapter13SafetyLanguage(message: string): boolean {
  const normalized = message.toLowerCase()
  const prohibited = [
    'you have ',
    'client has ',
    'diagnosis:',
    'diagnosed with',
    'prescribe ',
    'open the lesion',
    'treat the infection',
    'this is an infection',
  ]
  return prohibited.some((phrase) => normalized.includes(phrase))
}
