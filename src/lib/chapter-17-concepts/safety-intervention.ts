import type { Chapter17EvidenceRecord } from './grading'
import type { Chapter17ConceptFamilyId } from './types'
import type { Chapter17MicroCheckQuestion } from './micro-checks'

export type Chapter17SafetyHazard =
  | 'chemical_incompatibility'
  | 'scalp_compromise_burning'
  | 'overprocessing_control'
  | 'unsafe_service_sequence'

export type Chapter17SafetyInterventionLevel = 'none' | 'review' | 'urgent'

export interface Chapter17SafetyTaggedItem {
  itemId: string
  conceptFamilyId: Chapter17ConceptFamilyId
  hazard: Chapter17SafetyHazard
  rationale: string
}

export interface Chapter17SafetyIntervention {
  level: Chapter17SafetyInterventionLevel
  hazard: Chapter17SafetyHazard | null
  conceptFamilyId: Chapter17ConceptFamilyId | null
  affectedConceptFamilyIds: readonly Chapter17ConceptFamilyId[]
  requiresTargetedSafetyReview: boolean
  requiresInstructorReview: boolean
  requiresFormalSafetyReassessment: boolean
  reassessmentQuestionCount: 5 | null
  reassessmentPassPercent: 100 | null
  studentMessage: string
  instructorReason: string
}

export const CHAPTER17_SAFETY_RULES = {
  recentWindow: 5,
  urgentDistinctSafetyMisses: 2,
  urgentDistinctHazards: 2,
  formalSafetyReassessmentQuestionCount: 5,
  formalSafetyReassessmentPassPercent: 100,
  ordinaryReassessmentPassPercent: 80,
  clearConsecutiveCorrectSafetyObservations: 5,
} as const

export const chapter17SafetyTaggedItems: readonly Chapter17SafetyTaggedItem[] = [
  { itemId: 'mcq-17-011', conceptFamilyId: 'ch17-safety-strand-tests-compatibility', hazard: 'chemical_incompatibility', rationale: 'A strand test does not override known hydroxide/thio incompatibility; verified product-system guidance is required.' },
  { itemId: 'qq-17-005', conceptFamilyId: 'ch17-consultation-hair-analysis', hazard: 'chemical_incompatibility', rationale: 'Prior hydroxide-relaxer history materially affects future chemical-texture compatibility.' },
  { itemId: 'qq-17-022', conceptFamilyId: 'ch17-chemical-relaxing-procedures', hazard: 'chemical_incompatibility', rationale: 'Applying incompatible thio chemistry over hydroxide-treated hair can severely weaken or break the hair.' },
  { itemId: 'qq-17-024', conceptFamilyId: 'ch17-chemical-relaxing-procedures', hazard: 'chemical_incompatibility', rationale: 'Compatibility must be verified from exact prior chemistry, hair condition, and product-system guidance.' },

  { itemId: 'mcq-17-002', conceptFamilyId: 'ch17-consultation-hair-analysis', hazard: 'scalp_compromise_burning', rationale: 'A chemical service should be postponed over visibly compromised scalp tissue.' },
  { itemId: 'mcq-17-008', conceptFamilyId: 'ch17-chemical-relaxing-procedures', hazard: 'scalp_compromise_burning', rationale: 'Burning or pain requires stopping the service and removing product according to safety directions.' },
  { itemId: 'qq-17-003', conceptFamilyId: 'ch17-consultation-hair-analysis', hazard: 'scalp_compromise_burning', rationale: 'Visible open, abraded, irritated, or otherwise compromised scalp tissue is a reason to postpone the service.' },
  { itemId: 'qq-17-023', conceptFamilyId: 'ch17-chemical-relaxing-procedures', hazard: 'scalp_compromise_burning', rationale: 'Burning or pain during relaxer processing requires immediate stop/removal action.' },

  { itemId: 'mcq-17-006', conceptFamilyId: 'ch17-permanent-waving-procedures', hazard: 'overprocessing_control', rationale: 'Heat and processing time must follow product directions and ongoing hair assessment rather than automatic extension.' },
  { itemId: 'qq-17-015', conceptFamilyId: 'ch17-permanent-waving-procedures', hazard: 'overprocessing_control', rationale: 'Underprocessing indicates inadequate processing for the selected hair/product system.' },
  { itemId: 'qq-17-016', conceptFamilyId: 'ch17-permanent-waving-procedures', hazard: 'overprocessing_control', rationale: 'Excessive processing can weaken hair and increase breakage or unwanted results.' },
  { itemId: 'qq-17-017', conceptFamilyId: 'ch17-permanent-waving-procedures', hazard: 'overprocessing_control', rationale: 'Representative test curls should follow product-specific timing and placement rather than a universal fixed count.' },

  { itemId: 'mcq-17-010', conceptFamilyId: 'ch17-curl-reformation', hazard: 'unsafe_service_sequence', rationale: 'Unknown prior chemistry must be clarified and compatibility verified before a multi-stage curl-reformation service proceeds.' },
  { itemId: 'qq-17-026', conceptFamilyId: 'ch17-curl-reformation', hazard: 'unsafe_service_sequence', rationale: 'Curl reformation uses multiple chemical service stages and requires compatibility, fiber-condition, and process control.' },
  { itemId: 'qq-17-028', conceptFamilyId: 'ch17-permanent-waving-procedures', hazard: 'unsafe_service_sequence', rationale: 'Waving solution must be rinsed as directed before compatible neutralizer application.' },
  { itemId: 'qq-17-029', conceptFamilyId: 'ch17-chemistry-bond-transformation', hazard: 'unsafe_service_sequence', rationale: 'Incomplete or incorrect neutralization can compromise stabilization of the intended result.' },
] as const

const none = (reason: string): Chapter17SafetyIntervention => ({
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

function studentMessageForHazard(hazard: Chapter17SafetyHazard): string {
  switch (hazard) {
    case 'chemical_incompatibility':
      return 'Chemical compatibility review required: verify the exact prior chemistry and product-system guidance before proceeding. A strand test does not override a known incompatibility.'
    case 'scalp_compromise_burning':
      return 'Chemical-service safety review required: postpone service over visibly compromised scalp tissue, and stop/remove product according to safety directions if burning or pain occurs.'
    case 'overprocessing_control':
      return 'Processing-control review required: timing, heat, test-curl evaluation, and product strength must follow the selected system and ongoing hair assessment rather than universal extensions.'
    case 'unsafe_service_sequence':
      return 'Service-sequence review required: follow the verified chemical sequence, rinsing, compatibility, and finishing/neutralization directions before moving to the next stage.'
  }
}

export function getChapter17SafetyTag(itemId: string): Chapter17SafetyTaggedItem | null {
  return chapter17SafetyTaggedItems.find((item) => item.itemId === itemId) ?? null
}

export function classifyChapter17MicroCheckSafetyMiss(
  question: Chapter17MicroCheckQuestion,
  correct: boolean,
): Chapter17SafetyIntervention {
  if (correct) return none('No Chapter 17 high-risk miss is active for this response.')
  const tag = getChapter17SafetyTag(question.id)
  if (!tag) {
    return {
      ...none('This miss remains ordinary concept evidence and does not independently trigger a Chapter 17 safety intervention.'),
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

const safetyEvidence = (records: readonly Chapter17EvidenceRecord[]) =>
  records
    .filter((record) => getChapter17SafetyTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))

function trailingCorrectCount(records: readonly Chapter17EvidenceRecord[]): number {
  let count = 0
  for (let index = records.length - 1; index >= 0; index--) {
    if (!records[index].correct) break
    count += 1
  }
  return count
}

export function evaluateChapter17SafetyIntervention(
  records: readonly Chapter17EvidenceRecord[],
): Chapter17SafetyIntervention {
  const qualifying = safetyEvidence(records)
  if (qualifying.length === 0) return none('No tagged Chapter 17 high-risk evidence is present.')

  const trailingCorrect = trailingCorrectCount(qualifying)
  if (trailingCorrect >= CHAPTER17_SAFETY_RULES.clearConsecutiveCorrectSafetyObservations) {
    return none('Safety intervention cleared after ' + trailingCorrect + ' consecutive correct high-risk observations.')
  }

  const recent = qualifying.slice(-CHAPTER17_SAFETY_RULES.recentWindow)
  const misses = recent.filter((record) => !record.correct)
  const distinctItems = new Set(misses.map((record) => record.itemId))
  const hazards = new Set(
    misses
      .map((record) => getChapter17SafetyTag(record.itemId)?.hazard)
      .filter((hazard): hazard is Chapter17SafetyHazard => !!hazard),
  )
  const affectedConceptFamilyIds = [...new Set(misses.map((record) => record.conceptFamilyId))]

  if (
    distinctItems.size >= CHAPTER17_SAFETY_RULES.urgentDistinctSafetyMisses &&
    hazards.size >= CHAPTER17_SAFETY_RULES.urgentDistinctHazards
  ) {
    return {
      level: 'urgent',
      hazard: null,
      conceptFamilyId: null,
      affectedConceptFamilyIds,
      requiresTargetedSafetyReview: true,
      requiresInstructorReview: true,
      requiresFormalSafetyReassessment: true,
      reassessmentQuestionCount: CHAPTER17_SAFETY_RULES.formalSafetyReassessmentQuestionCount,
      reassessmentPassPercent: CHAPTER17_SAFETY_RULES.formalSafetyReassessmentPassPercent,
      studentMessage: 'Urgent Chapter 17 safety remediation required. Review the affected compatibility, scalp/burning, processing-control, and/or service-sequence boundaries before continuing. A perfect five-question safety reassessment will be required before urgent safety mastery can recover.',
      instructorReason: misses.length + ' recent high-risk misses span ' + hazards.size + ' distinct Chapter 17 hazard classes; formal safety remediation and a perfect five-question reassessment are required.',
    }
  }

  const latestMiss = [...qualifying].reverse().find((record) => !record.correct)
  if (latestMiss) {
    const tag = getChapter17SafetyTag(latestMiss.itemId)!
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

  return none('Recent tagged Chapter 17 high-risk evidence is correct and no active intervention is required.')
}

export function getChapter17RequiredReassessmentPassPercent(
  records: readonly Chapter17EvidenceRecord[],
  conceptFamilyId: Chapter17ConceptFamilyId,
): 80 | 100 {
  const intervention = evaluateChapter17SafetyIntervention(records)
  if (intervention.level === 'urgent' && intervention.affectedConceptFamilyIds.includes(conceptFamilyId)) {
    return CHAPTER17_SAFETY_RULES.formalSafetyReassessmentPassPercent
  }
  return CHAPTER17_SAFETY_RULES.ordinaryReassessmentPassPercent
}

export function containsProhibitedChapter17SafetyLanguage(message: string): boolean {
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
