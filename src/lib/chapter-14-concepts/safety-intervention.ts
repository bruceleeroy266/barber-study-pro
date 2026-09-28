import type { Chapter14EvidenceRecord } from './grading'
import type { Chapter14ConceptFamilyId } from './types'
import type { Chapter14MicroCheckQuestion } from './micro-checks'

export type Chapter14SafetyHazard =
  | 'compromised_skin_service_deferral'
  | 'thermal_burn_prevention'

export type Chapter14SafetyInterventionLevel = 'none' | 'review' | 'urgent'

export interface Chapter14SafetyTaggedItem {
  itemId: string
  conceptFamilyId: Chapter14ConceptFamilyId
  hazard: Chapter14SafetyHazard
  rationale: string
}

export interface Chapter14SafetyIntervention {
  level: Chapter14SafetyInterventionLevel
  hazard: Chapter14SafetyHazard | null
  conceptFamilyId: Chapter14ConceptFamilyId | null
  affectedConceptFamilyIds: readonly Chapter14ConceptFamilyId[]
  requiresTargetedSafetyReview: boolean
  requiresInstructorReview: boolean
  requiresFormalSafetyReassessment: boolean
  reassessmentQuestionCount: 5 | null
  reassessmentPassPercent: 100 | null
  studentMessage: string
  instructorReason: string
}

export const CHAPTER14_SAFETY_RULES = {
  recentWindow: 3,
  urgentDistinctSafetyMisses: 2,
  urgentDistinctHazards: 2,
  formalSafetyReassessmentQuestionCount: 5,
  formalSafetyReassessmentPassPercent: 100,
  ordinaryReassessmentPassPercent: 80,
  clearConsecutiveCorrectSafetyObservations: 5,
} as const

export const chapter14SafetyTaggedItems: readonly Chapter14SafetyTaggedItem[] = [
  {
    itemId: 'mcq-14-013',
    conceptFamilyId: 'ch14-service-safety-sanitation',
    hazard: 'compromised_skin_service_deferral',
    rationale: 'Broken or compromised skin in a planned head-shave area requires a safer service decision rather than shaving through the affected area.',
  },
  {
    itemId: 'mcq-14-014',
    conceptFamilyId: 'ch14-service-safety-sanitation',
    hazard: 'thermal_burn_prevention',
    rationale: 'Blow-drying near the scalp requires moving airflow and monitoring client comfort to reduce excessive localized heat.',
  },
  {
    itemId: 'qq-14-070',
    conceptFamilyId: 'ch14-service-safety-sanitation',
    hazard: 'thermal_burn_prevention',
    rationale: 'Holding concentrated blow-dryer heat on one area can create an avoidable burn risk; airflow and hair should remain in controlled motion.',
  },
] as const

const none = (reason: string): Chapter14SafetyIntervention => ({
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

function studentMessageForHazard(hazard: Chapter14SafetyHazard): string {
  switch (hazard) {
    case 'compromised_skin_service_deferral':
      return 'Safety review required: if broken or compromised skin is present in the planned shave area, defer the affected service until it is safe to perform. Describe what you observe without diagnosing or prescribing.'
    case 'thermal_burn_prevention':
      return 'Safety review required: keep blow-dryer airflow and the hair moving, avoid prolonged concentrated heat on one spot, and monitor client comfort throughout thermal styling.'
  }
}

export function getChapter14SafetyTag(itemId: string): Chapter14SafetyTaggedItem | null {
  return chapter14SafetyTaggedItems.find((item) => item.itemId === itemId) ?? null
}

export function classifyChapter14MicroCheckSafetyMiss(
  question: Chapter14MicroCheckQuestion,
  correct: boolean,
): Chapter14SafetyIntervention {
  if (correct) return none('No Chapter 14 high-risk safety miss is active for this response.')

  const tag = getChapter14SafetyTag(question.id)
  if (!tag) {
    return {
      ...none('This miss remains ordinary concept evidence and does not independently trigger a Chapter 14 safety intervention.'),
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

const safetyEvidence = (records: readonly Chapter14EvidenceRecord[]) =>
  records
    .filter((record) => getChapter14SafetyTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))

function trailingCorrectCount(records: readonly Chapter14EvidenceRecord[]): number {
  let count = 0
  for (let index = records.length - 1; index >= 0; index--) {
    if (!records[index].correct) break
    count += 1
  }
  return count
}

export function evaluateChapter14SafetyIntervention(
  records: readonly Chapter14EvidenceRecord[],
): Chapter14SafetyIntervention {
  const qualifying = safetyEvidence(records)
  if (qualifying.length === 0) return none('No tagged Chapter 14 high-risk safety evidence is present.')

  const trailingCorrect = trailingCorrectCount(qualifying)
  if (trailingCorrect >= CHAPTER14_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations) {
    return none(`Safety intervention cleared after ${trailingCorrect} consecutive correct high-risk observations.`)
  }

  const recent = qualifying.slice(-CHAPTER14_SAFETY_RULES.recentWindow)
  const misses = recent.filter((record) => !record.correct)
  const distinctItems = new Set(misses.map((record) => record.itemId))
  const hazards = new Set(
    misses
      .map((record) => getChapter14SafetyTag(record.itemId)?.hazard)
      .filter((hazard): hazard is Chapter14SafetyHazard => !!hazard),
  )
  const affectedConceptFamilyIds = [...new Set(misses.map((record) => record.conceptFamilyId))]

  if (
    distinctItems.size >= CHAPTER14_SAFETY_RULES.urgentDistinctSafetyMisses &&
    hazards.size >= CHAPTER14_SAFETY_RULES.urgentDistinctHazards
  ) {
    return {
      level: 'urgent',
      hazard: null,
      conceptFamilyId: null,
      affectedConceptFamilyIds,
      requiresTargetedSafetyReview: true,
      requiresInstructorReview: true,
      requiresFormalSafetyReassessment: true,
      reassessmentQuestionCount: CHAPTER14_SAFETY_RULES.formalSafetyReassessmentQuestionCount,
      reassessmentPassPercent: CHAPTER14_SAFETY_RULES.formalSafetyReassessmentPassPercent,
      studentMessage: 'Urgent haircutting-safety remediation required: review compromised-skin service deferral and thermal burn prevention. A perfect five-question safety reassessment is required before urgent safety mastery can recover.',
      instructorReason: `${misses.length} recent high-risk misses span ${hazards.size} distinct Chapter 14 safety hazards; formal safety remediation and a perfect five-question reassessment are required.`,
    }
  }

  const latestMiss = [...qualifying].reverse().find((record) => !record.correct)
  if (latestMiss) {
    const tag = getChapter14SafetyTag(latestMiss.itemId)!
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

  return none('Recent tagged Chapter 14 safety evidence is correct and no active intervention is required.')
}

export function getChapter14RequiredReassessmentPassPercent(
  records: readonly Chapter14EvidenceRecord[],
  conceptFamilyId: Chapter14ConceptFamilyId,
): 80 | 100 {
  const intervention = evaluateChapter14SafetyIntervention(records)
  if (
    intervention.level === 'urgent' &&
    intervention.affectedConceptFamilyIds.includes(conceptFamilyId)
  ) {
    return CHAPTER14_SAFETY_RULES.formalSafetyReassessmentPassPercent
  }
  return CHAPTER14_SAFETY_RULES.ordinaryReassessmentPassPercent
}

export function evaluateChapter14SafetyRecovery(args: {
  records: readonly Chapter14EvidenceRecord[]
  conceptFamilyId: Chapter14ConceptFamilyId
  responses: readonly boolean[]
}): {
  requiredPassPercent: 80 | 100
  percent: number
  passed: boolean
  blocksMasteryRecovery: boolean
} {
  if (args.responses.length !== CHAPTER14_SAFETY_RULES.formalSafetyReassessmentQuestionCount) {
    throw new Error('Chapter 14 formal reassessment requires exactly five responses.')
  }

  const correct = args.responses.filter(Boolean).length
  const percent = Math.round((correct / args.responses.length) * 10000) / 100
  const requiredPassPercent = getChapter14RequiredReassessmentPassPercent(args.records, args.conceptFamilyId)
  const passed = percent >= requiredPassPercent

  return {
    requiredPassPercent,
    percent,
    passed,
    blocksMasteryRecovery: requiredPassPercent === 100 && !passed,
  }
}

export function containsProhibitedChapter14SafetyLanguage(message: string): boolean {
  const normalized = message.toLowerCase()
  const prohibited = [
    'you have ',
    'client has ',
    'diagnosis:',
    'diagnosed with',
    'prescribe ',
    'treat the infection',
    'this is an infection',
  ]
  return prohibited.some((phrase) => normalized.includes(phrase))
}
