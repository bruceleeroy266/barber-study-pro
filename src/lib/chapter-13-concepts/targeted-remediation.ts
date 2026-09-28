import { calculateChapter13ConceptMastery, type Chapter13EvidenceRecord } from './grading'
import { CHAPTER13_CONCEPT_FAMILY_IDS, getChapter13ConceptFamily } from './concepts'
import { getChapter13ContentBlocksForConcept } from './mappings'
import {
  CHAPTER13_SAFETY_RULES,
  evaluateChapter13SafetyIntervention,
  getChapter13SafetyTag,
  type Chapter13SafetyInterventionLevel,
} from './safety-intervention'
import type { Chapter13ConceptFamilyId } from './types'
import type { Chapter13ReassessmentQuestion } from './reassessment-reserve'

export interface Chapter13RemediationTarget {
  conceptFamilyId: Chapter13ConceptFamilyId
  conceptName: string
  mastery: number
  observationCount: number
  initialMissCount: number
  remediationContentBlockIds: readonly string[]
  priority: 'standard' | 'priority' | 'urgent'
  requiresFormalReassessment: boolean
  reassessmentQuestionCount: 5
  reassessmentPassPercent: 80 | 100
  safetyEscalation: Chapter13SafetyInterventionLevel | null
  reason: string
}

export interface Chapter13RemediationPlan {
  targets: Chapter13RemediationTarget[]
  preservedInitialEvidence: readonly Chapter13EvidenceRecord[]
}

export const CHAPTER13_REMEDIATION_RULES = {
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
  evidence: readonly Chapter13EvidenceRecord[],
): Set<Chapter13ConceptFamilyId> {
  const recentTagged = evidence
    .filter((record) => getChapter13SafetyTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
    .slice(-CHAPTER13_SAFETY_RULES.recentWindow)

  return new Set(
    recentTagged.filter((record) => !record.correct).map((record) => record.conceptFamilyId),
  )
}

export function buildChapter13TargetedRemediationPlan(
  evidence: readonly Chapter13EvidenceRecord[],
  referenceTime: string,
): Chapter13RemediationPlan {
  const targets: Chapter13RemediationTarget[] = []
  const safety = evaluateChapter13SafetyIntervention(evidence)
  const recentSafetyMissConcepts = getRecentSafetyMissConcepts(evidence)

  for (const conceptFamilyId of CHAPTER13_CONCEPT_FAMILY_IDS) {
    const conceptEvidence = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    if (conceptEvidence.length === 0) continue

    const mastery = calculateChapter13ConceptMastery(conceptEvidence, referenceTime)
    const ordinaryGap =
      mastery.mastery <= CHAPTER13_REMEDIATION_RULES.ordinaryTargetMasteryAtOrBelow ||
      mastery.initialMissCount >= CHAPTER13_REMEDIATION_RULES.ordinaryMinInitialMisses

    const urgentSafetyGap =
      safety.level === 'urgent' && recentSafetyMissConcepts.has(conceptFamilyId)
    const prioritySafetyGap =
      safety.level === 'review' && safety.conceptFamilyId === conceptFamilyId

    if (!ordinaryGap && !urgentSafetyGap && !prioritySafetyGap) continue

    const concept = getChapter13ConceptFamily(conceptFamilyId)
    targets.push({
      conceptFamilyId,
      conceptName: concept.name,
      mastery: mastery.mastery,
      observationCount: mastery.observationCount,
      initialMissCount: mastery.initialMissCount,
      remediationContentBlockIds: getChapter13ContentBlocksForConcept(conceptFamilyId),
      priority: urgentSafetyGap ? 'urgent' : prioritySafetyGap ? 'priority' : 'standard',
      requiresFormalReassessment: urgentSafetyGap || ordinaryGap,
      reassessmentQuestionCount: 5,
      reassessmentPassPercent: urgentSafetyGap ? 100 : 80,
      safetyEscalation: urgentSafetyGap ? 'urgent' : prioritySafetyGap ? 'review' : null,
      reason: urgentSafetyGap
        ? `${concept.name} includes a recent urgent safety gap and requires targeted remediation plus a perfect five-question reassessment.`
        : prioritySafetyGap
          ? `${concept.name} includes the current high-risk safety miss and requires immediate targeted review.`
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

export interface Chapter13ReassessmentCycle {
  cycleId: string
  conceptFamilyId: Chapter13ConceptFamilyId
  questionIds: readonly string[]
  correctCount: number
  questionCount: 5
  percent: number
  passPercent: 80 | 100
  passed: boolean
}

export function selectChapter13ReassessmentQuestions(
  conceptFamilyId: Chapter13ConceptFamilyId,
  reserve: readonly Pick<Chapter13ReassessmentQuestion, 'id' | 'conceptFamilyId'>[],
  count = 5,
): readonly string[] {
  const ids = reserve
    .filter((question) => question.conceptFamilyId === conceptFamilyId)
    .map((question) => question.id)
    .sort((a, b) => a.localeCompare(b))

  if (ids.length < count) {
    throw new Error(`Chapter 13 reassessment reserve for ${conceptFamilyId} requires at least ${count} questions.`)
  }
  return ids.slice(0, count)
}

export function scoreChapter13ReassessmentCycle(args: {
  cycleId: string
  conceptFamilyId: Chapter13ConceptFamilyId
  selectedQuestionIds: readonly string[]
  responses: readonly { questionId: string; correct: boolean }[]
  passPercent: 80 | 100
}): Chapter13ReassessmentCycle {
  const selected = [...args.selectedQuestionIds]
  if (selected.length !== 5 || new Set(selected).size !== 5) {
    throw new Error('Chapter 13 formal reassessment cycles require exactly five unique questions.')
  }
  const responseMap = new Map(args.responses.map((response) => [response.questionId, response.correct]))
  if (responseMap.size !== 5 || selected.some((id) => !responseMap.has(id))) {
    throw new Error('Chapter 13 formal reassessment scoring requires one response for each selected question.')
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

export function buildChapter13ReassessmentEvidence(args: {
  studentId: string
  conceptFamilyId: Chapter13ConceptFamilyId
  selectedQuestions: readonly Chapter13ReassessmentQuestion[]
  responses: readonly { questionId: string; correct: boolean }[]
  timestamp: string
}): Chapter13EvidenceRecord[] {
  if (args.selectedQuestions.length !== 5 || new Set(args.selectedQuestions.map((q) => q.id)).size !== 5) {
    throw new Error('Chapter 13 reassessment evidence requires exactly five unique selected questions.')
  }
  if (args.selectedQuestions.some((question) => question.conceptFamilyId !== args.conceptFamilyId)) {
    throw new Error('Chapter 13 reassessment questions must all match the target concept family.')
  }
  const responseMap = new Map(args.responses.map((response) => [response.questionId, response.correct]))
  if (responseMap.size !== 5 || args.selectedQuestions.some((question) => !responseMap.has(question.id))) {
    throw new Error('Chapter 13 reassessment evidence requires one response for each selected question.')
  }

  return args.selectedQuestions.map((question) => ({
    studentId: args.studentId,
    chapterId: 'ch-13',
    conceptFamilyId: args.conceptFamilyId,
    source: 'remediation_reassessment',
    itemId: question.id,
    difficulty: question.difficulty,
    correct: responseMap.get(question.id) === true,
    attemptPhase: 'reassessment',
    timestamp: args.timestamp,
  }))
}

export function appendChapter13ReassessmentEvidence(
  originalEvidence: readonly Chapter13EvidenceRecord[],
  reassessmentEvidence: readonly Chapter13EvidenceRecord[],
): Chapter13EvidenceRecord[] {
  if (reassessmentEvidence.some(
    (record) =>
      record.chapterId !== 'ch-13' ||
      record.source !== 'remediation_reassessment' ||
      record.attemptPhase !== 'reassessment',
  )) {
    throw new Error('Reassessment evidence must use Chapter 13 remediation_reassessment / reassessment semantics.')
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

export function calculateChapter13RecoveredMastery(
  originalEvidence: readonly Chapter13EvidenceRecord[],
  reassessmentEvidence: readonly Chapter13EvidenceRecord[],
  conceptFamilyId: Chapter13ConceptFamilyId,
  referenceTime: string,
) {
  const before = calculateChapter13ConceptMastery(
    originalEvidence.filter((record) => record.conceptFamilyId === conceptFamilyId),
    referenceTime,
  )
  const combined = appendChapter13ReassessmentEvidence(originalEvidence, reassessmentEvidence)
  const after = calculateChapter13ConceptMastery(
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
