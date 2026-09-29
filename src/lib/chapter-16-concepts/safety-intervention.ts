import type { Chapter16EvidenceRecord } from './grading'
import type { Chapter16ConceptFamilyId } from './types'
import type { Chapter16MicroCheckQuestion } from './micro-checks'

export type Chapter16SafetyHazard =
  | 'razor_tool_suitability'
  | 'thermal_heat_client_protection'

export type Chapter16SafetyInterventionLevel = 'none' | 'review' | 'urgent'

export interface Chapter16SafetyTaggedItem {
  itemId: string
  conceptFamilyId: Chapter16ConceptFamilyId
  hazard: Chapter16SafetyHazard
  rationale: string
}

export interface Chapter16SafetyIntervention {
  level: Chapter16SafetyInterventionLevel
  hazard: Chapter16SafetyHazard | null
  conceptFamilyId: Chapter16ConceptFamilyId | null
  affectedConceptFamilyIds: readonly Chapter16ConceptFamilyId[]
  requiresTargetedSafetyReview: boolean
  requiresInstructorReview: boolean
  requiresFormalSafetyReassessment: boolean
  reassessmentQuestionCount: 5 | null
  reassessmentPassPercent: 100 | null
  studentMessage: string
  instructorReason: string
}

export const CHAPTER16_SAFETY_RULES = {
  recentWindow: 4,
  urgentDistinctSafetyMisses: 2,
  urgentDistinctHazards: 2,
  formalSafetyReassessmentQuestionCount: 5,
  formalSafetyReassessmentPassPercent: 100,
  ordinaryReassessmentPassPercent: 80,
  clearConsecutiveCorrectSafetyObservations: 5,
} as const

export const chapter16SafetyTaggedItems: readonly Chapter16SafetyTaggedItem[] = [
  {
    itemId: 'mcq-16-013',
    conceptFamilyId: 'ch16-advanced-techniques-texturizing',
    hazard: 'razor_tool_suitability',
    rationale: 'Razor use should account for hair condition, texture, density, desired finish, blade condition, and technique rather than a universal suitability rule.',
  },
  {
    itemId: 'qq-16-022',
    conceptFamilyId: 'ch16-advanced-techniques-texturizing',
    hazard: 'razor_tool_suitability',
    rationale: 'Hair that is fragile, highly porous, or otherwise vulnerable requires greater caution before razor cutting.',
  },
  {
    itemId: 'mcq-16-015',
    conceptFamilyId: 'ch16-styling-finishing-safety',
    hazard: 'thermal_heat_client_protection',
    rationale: 'Thermal styling should use the lowest effective heat, avoid prolonged concentration, and protect the client and work surface.',
  },
  {
    itemId: 'qq-16-027',
    conceptFamilyId: 'ch16-styling-finishing-safety',
    hazard: 'thermal_heat_client_protection',
    rationale: 'Thermal-tool use should follow product/tool directions, hair-condition needs, labeled damp/wet use, and client-protection practices.',
  },
] as const

const none = (reason: string): Chapter16SafetyIntervention => ({
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

function studentMessageForHazard(hazard: Chapter16SafetyHazard): string {
  switch (hazard) {
    case 'razor_tool_suitability':
      return 'Razor/tool review required: reassess hair condition, texture, density, desired finish, blade condition, and technique before choosing razor cutting.'
    case 'thermal_heat_client_protection':
      return 'Thermal-safety review required: follow the tool and product directions, use the lowest effective heat, avoid prolonged heat concentration, and protect the client and work surface.'
  }
}

export function getChapter16SafetyTag(itemId: string): Chapter16SafetyTaggedItem | null {
  return chapter16SafetyTaggedItems.find((item) => item.itemId === itemId) ?? null
}

export function classifyChapter16MicroCheckSafetyMiss(
  question: Chapter16MicroCheckQuestion,
  correct: boolean,
): Chapter16SafetyIntervention {
  if (correct) return none('No Chapter 16 safety miss is active for this response.')
  const tag = getChapter16SafetyTag(question.id)
  if (!tag) {
    return { ...none('This miss remains ordinary concept evidence and does not independently trigger Chapter 16 safety escalation.'), conceptFamilyId: question.conceptFamilyId }
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

function trailingCorrectCount(records: readonly Chapter16EvidenceRecord[]): number {
  let count = 0
  for (let index = records.length - 1; index >= 0; index--) {
    if (!records[index].correct) break
    count += 1
  }
  return count
}

export function evaluateChapter16SafetyIntervention(
  records: readonly Chapter16EvidenceRecord[],
): Chapter16SafetyIntervention {
  const qualifying = records
    .filter((record) => getChapter16SafetyTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))

  if (qualifying.length === 0) return none('No tagged Chapter 16 safety evidence is present.')

  const trailingCorrect = trailingCorrectCount(qualifying)
  if (trailingCorrect >= CHAPTER16_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations) {
    return none('Safety intervention cleared after ' + trailingCorrect + ' consecutive correct safety observations.')
  }

  const recent = qualifying.slice(-CHAPTER16_SAFETY_RULES.recentWindow)
  const misses = recent.filter((record) => !record.correct)
  const distinctItems = new Set(misses.map((record) => record.itemId))
  const hazards = new Set(
    misses.map((record) => getChapter16SafetyTag(record.itemId)?.hazard)
      .filter((hazard): hazard is Chapter16SafetyHazard => !!hazard),
  )
  const affectedConceptFamilyIds = [...new Set(misses.map((record) => record.conceptFamilyId))]

  if (
    distinctItems.size >= CHAPTER16_SAFETY_RULES.urgentDistinctSafetyMisses &&
    hazards.size >= CHAPTER16_SAFETY_RULES.urgentDistinctHazards
  ) {
    return {
      level: 'urgent',
      hazard: null,
      conceptFamilyId: null,
      affectedConceptFamilyIds,
      requiresTargetedSafetyReview: true,
      requiresInstructorReview: true,
      requiresFormalSafetyReassessment: true,
      reassessmentQuestionCount: 5,
      reassessmentPassPercent: 100,
      studentMessage: 'Urgent Chapter 16 safety remediation required: review both razor/tool suitability and thermal heat/client-protection decisions. A perfect five-question safety reassessment will be required before urgent safety mastery can recover.',
      instructorReason: misses.length + ' recent safety-sensitive misses span both Chapter 16 safety hazards.',
    }
  }

  const latestMiss = [...qualifying].reverse().find((record) => !record.correct)
  if (!latestMiss) return none('Recent tagged Chapter 16 safety evidence is correct and no active intervention is required.')

  const tag = getChapter16SafetyTag(latestMiss.itemId)!
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

export function getChapter16RequiredReassessmentPassPercent(
  records: readonly Chapter16EvidenceRecord[],
  conceptFamilyId: Chapter16ConceptFamilyId,
): 80 | 100 {
  const intervention = evaluateChapter16SafetyIntervention(records)
  if (intervention.level === 'urgent' && intervention.affectedConceptFamilyIds.includes(conceptFamilyId)) return 100
  return 80
}
