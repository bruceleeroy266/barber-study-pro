import { calculateChapter10ConceptMastery, type Chapter10EvidenceRecord } from './grading'
import { CHAPTER10_CONCEPT_FAMILY_IDS, getChapter10ConceptFamily } from './concepts'
import { getChapter10ContentBlocksForConcept } from './mappings'
import {
  CHAPTER10_SAFETY_RULES,
  evaluateChapter10SafetyIntervention,
  getChapter10SafetyTag,
  type Chapter10SafetyInterventionLevel,
} from './safety-intervention'
import type { Chapter10ConceptFamilyId } from './types'
import type { Chapter10ReassessmentQuestion } from './reassessment-reserve'

export interface Chapter10RemediationTarget {
  conceptFamilyId: Chapter10ConceptFamilyId
  conceptName: string
  mastery: number
  observationCount: number
  initialMissCount: number
  remediationContentBlockIds: readonly string[]
  priority: 'standard' | 'priority' | 'urgent'
  requiresFormalReassessment: boolean
  reassessmentQuestionCount: 5
  reassessmentPassPercent: 80 | 100
  safetyEscalation: Chapter10SafetyInterventionLevel | null
  reason: string
}

export interface Chapter10RemediationPlan {
  targets: Chapter10RemediationTarget[]
  preservedInitialEvidence: readonly Chapter10EvidenceRecord[]
}

export const CHAPTER10_REMEDIATION_RULES = {
  ordinaryTargetMasteryAtOrBelow: 70,
  ordinaryMinInitialMisses: 2,
  ordinaryReassessmentQuestionCount: 5,
  ordinaryReassessmentPassPercent: 80,
  safetyReassessmentQuestionCount: 5,
  safetyReassessmentPassPercent: 100,
} as const

const toTime = (value: string): number => {
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

function getRecentSafetyMissConcepts(
  evidence: readonly Chapter10EvidenceRecord[],
): Set<Chapter10ConceptFamilyId> {
  const recentTagged = evidence
    .filter((record) => getChapter10SafetyTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
    .slice(-CHAPTER10_SAFETY_RULES.recentWindow)

  return new Set(
    recentTagged
      .filter((record) => !record.correct)
      .map((record) => record.conceptFamilyId),
  )
}

export function buildChapter10TargetedRemediationPlan(
  evidence: readonly Chapter10EvidenceRecord[],
  referenceTime: string,
): Chapter10RemediationPlan {
  const targets: Chapter10RemediationTarget[] = []
  const safety = evaluateChapter10SafetyIntervention(evidence)
  const recentSafetyMissConcepts = getRecentSafetyMissConcepts(evidence)

  for (const conceptFamilyId of CHAPTER10_CONCEPT_FAMILY_IDS) {
    const conceptEvidence = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    if (conceptEvidence.length === 0) continue

    const mastery = calculateChapter10ConceptMastery(conceptEvidence, referenceTime)
    const ordinaryGap =
      mastery.mastery <= CHAPTER10_REMEDIATION_RULES.ordinaryTargetMasteryAtOrBelow ||
      mastery.initialMissCount >= CHAPTER10_REMEDIATION_RULES.ordinaryMinInitialMisses

    const urgentSafetyGap =
      safety.level === 'urgent' && recentSafetyMissConcepts.has(conceptFamilyId)

    const prioritySafetyGap =
      safety.level === 'review' && safety.conceptFamilyId === conceptFamilyId

    if (!ordinaryGap && !urgentSafetyGap && !prioritySafetyGap) continue

    const concept = getChapter10ConceptFamily(conceptFamilyId)
    const remediationContentBlockIds = getChapter10ContentBlocksForConcept(conceptFamilyId)

    targets.push({
      conceptFamilyId,
      conceptName: concept.name,
      mastery: mastery.mastery,
      observationCount: mastery.observationCount,
      initialMissCount: mastery.initialMissCount,
      remediationContentBlockIds,
      priority: urgentSafetyGap ? 'urgent' : prioritySafetyGap ? 'priority' : 'standard',
      requiresFormalReassessment: urgentSafetyGap || ordinaryGap,
      reassessmentQuestionCount: 5,
      reassessmentPassPercent: urgentSafetyGap
        ? CHAPTER10_REMEDIATION_RULES.safetyReassessmentPassPercent
        : CHAPTER10_REMEDIATION_RULES.ordinaryReassessmentPassPercent,
      safetyEscalation: urgentSafetyGap ? 'urgent' : prioritySafetyGap ? 'review' : null,
      reason: urgentSafetyGap
        ? `${concept.name} includes a recent urgent safety miss and requires targeted remediation plus a perfect five-question reassessment.`
        : prioritySafetyGap
          ? `${concept.name} includes the current high-risk safety miss and requires immediate targeted review; formal reassessment is also required if the ordinary mastery-gap rule is met.`
          : `${concept.name} is targeted because mastery is ${mastery.mastery}% with ${mastery.initialMissCount} preserved initial misses.`,
    })
  }

  const priorityRank = { urgent: 0, priority: 1, standard: 2 } as const
  targets.sort((a, b) =>
    priorityRank[a.priority] - priorityRank[b.priority] ||
    a.mastery - b.mastery ||
    a.conceptFamilyId.localeCompare(b.conceptFamilyId),
  )

  return { targets, preservedInitialEvidence: evidence }
}

export interface Chapter10ReassessmentCycle {
  cycleId: string
  conceptFamilyId: Chapter10ConceptFamilyId
  questionIds: readonly string[]
  correctCount: number
  questionCount: 5
  percent: number
  passPercent: 80 | 100
  passed: boolean
}

export function selectChapter10ReassessmentQuestions(
  conceptFamilyId: Chapter10ConceptFamilyId,
  reserve: readonly Pick<Chapter10ReassessmentQuestion, 'id' | 'conceptFamilyId'>[],
  count = 5,
): readonly string[] {
  const ids = reserve
    .filter((question) => question.conceptFamilyId === conceptFamilyId)
    .map((question) => question.id)
    .sort((a, b) => a.localeCompare(b))

  if (ids.length < count) {
    throw new Error(`Chapter 10 reassessment reserve for ${conceptFamilyId} requires at least ${count} questions.`)
  }

  return ids.slice(0, count)
}

export function scoreChapter10ReassessmentCycle(args: {
  cycleId: string
  conceptFamilyId: Chapter10ConceptFamilyId
  selectedQuestionIds: readonly string[]
  responses: readonly { questionId: string; correct: boolean }[]
  passPercent: 80 | 100
}): Chapter10ReassessmentCycle {
  const selected = [...args.selectedQuestionIds]
  if (selected.length !== 5 || new Set(selected).size !== 5) {
    throw new Error('Chapter 10 formal reassessment cycles require exactly five unique questions.')
  }

  const responseMap = new Map(args.responses.map((response) => [response.questionId, response.correct]))
  if (responseMap.size !== 5 || selected.some((id) => !responseMap.has(id))) {
    throw new Error('Chapter 10 formal reassessment scoring requires one response for each selected question.')
  }

  const correctCount = selected.filter((id) => responseMap.get(id) === true).length
  const percent = Math.round((correctCount / 5) * 10000) / 100

  return {
    cycleId: args.cycleId,
    conceptFamilyId: args.conceptFamilyId,
    questionIds: selected,
    correctCount,
    questionCount: 5,
    percent,
    passPercent: args.passPercent,
    passed: percent >= args.passPercent,
  }
}

export function buildChapter10ReassessmentEvidence(args: {
  studentId: string
  conceptFamilyId: Chapter10ConceptFamilyId
  selectedQuestions: readonly Chapter10ReassessmentQuestion[]
  responses: readonly { questionId: string; correct: boolean }[]
  timestamp: string
}): Chapter10EvidenceRecord[] {
  if (args.selectedQuestions.length !== 5 || new Set(args.selectedQuestions.map((q) => q.id)).size !== 5) {
    throw new Error('Chapter 10 reassessment evidence requires exactly five unique selected questions.')
  }
  if (args.selectedQuestions.some((question) => question.conceptFamilyId !== args.conceptFamilyId)) {
    throw new Error('Chapter 10 reassessment questions must all match the target concept family.')
  }

  const responseMap = new Map(args.responses.map((response) => [response.questionId, response.correct]))
  if (
    responseMap.size !== 5 ||
    args.selectedQuestions.some((question) => !responseMap.has(question.id))
  ) {
    throw new Error('Chapter 10 reassessment evidence requires one response for each selected question.')
  }

  return args.selectedQuestions.map((question) => ({
    studentId: args.studentId,
    chapterId: 'ch-10',
    conceptFamilyId: args.conceptFamilyId,
    source: 'remediation_reassessment',
    itemId: question.id,
    difficulty: question.difficulty,
    correct: responseMap.get(question.id) === true,
    attemptPhase: 'reassessment',
    timestamp: args.timestamp,
  }))
}

export function appendChapter10ReassessmentEvidence(
  originalEvidence: readonly Chapter10EvidenceRecord[],
  reassessmentEvidence: readonly Chapter10EvidenceRecord[],
): Chapter10EvidenceRecord[] {
  if (reassessmentEvidence.some(
    (record) =>
      record.chapterId !== 'ch-10' ||
      record.source !== 'remediation_reassessment' ||
      record.attemptPhase !== 'reassessment',
  )) {
    throw new Error('Reassessment evidence must use Chapter 10 remediation_reassessment / reassessment semantics.')
  }

  const existingKeys = new Set(originalEvidence.map((record) =>
    [record.studentId, record.chapterId, record.source, record.attemptPhase, record.itemId].join('|'),
  ))

  const additions = reassessmentEvidence.filter((record) => {
    const key = [record.studentId, record.chapterId, record.source, record.attemptPhase, record.itemId].join('|')
    if (existingKeys.has(key)) return false
    existingKeys.add(key)
    return true
  })

  return [...originalEvidence, ...additions]
}

export function calculateChapter10RecoveredMastery(
  originalEvidence: readonly Chapter10EvidenceRecord[],
  reassessmentEvidence: readonly Chapter10EvidenceRecord[],
  conceptFamilyId: Chapter10ConceptFamilyId,
  referenceTime: string,
) {
  const before = calculateChapter10ConceptMastery(
    originalEvidence.filter((record) => record.conceptFamilyId === conceptFamilyId),
    referenceTime,
  )
  const combined = appendChapter10ReassessmentEvidence(originalEvidence, reassessmentEvidence)
  const after = calculateChapter10ConceptMastery(
    combined.filter((record) => record.conceptFamilyId === conceptFamilyId),
    referenceTime,
  )

  return {
    before,
    after,
    combinedEvidence: combined,
    originalEvidencePreserved:
      JSON.stringify(combined.slice(0, originalEvidence.length)) === JSON.stringify(originalEvidence),
  }
}
