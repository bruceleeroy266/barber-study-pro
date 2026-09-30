import { calculateChapter18ConceptMastery, type Chapter18EvidenceRecord } from './grading'
import { CHAPTER18_CONCEPT_FAMILY_IDS, getChapter18ConceptFamily } from './concepts'
import {
  getChapter18FlashcardsForConcept,
  getChapter18RemediationContentBlocksForConcept,
} from './mappings'
import {
  CHAPTER18_SAFETY_RULES,
  evaluateChapter18SafetyIntervention,
  getChapter18SafetyTag,
  type Chapter18SafetyInterventionLevel,
} from './safety-intervention'
import type { Chapter18ConceptFamilyId } from './types'
import type { Chapter18ReassessmentQuestion } from './reassessment-reserve'

export interface Chapter18RemediationTarget {
  conceptFamilyId: Chapter18ConceptFamilyId
  conceptName: string
  mastery: number
  confidence: ReturnType<typeof calculateChapter18ConceptMastery>['confidence']
  observationCount: number
  sourceTypeCount: number
  initialMissCount: number
  remediationContentBlockIds: readonly string[]
  remediationFlashcardIds: readonly string[]
  priority: 'standard' | 'priority' | 'urgent'
  requiresFormalReassessment: boolean
  plannedReassessmentQuestionCount: 5
  plannedReassessmentPassPercent: 80 | 100
  safetyEscalation: Chapter18SafetyInterventionLevel | null
  reason: string
}

export interface Chapter18RemediationPlan {
  targets: Chapter18RemediationTarget[]
  preservedEvidence: readonly Chapter18EvidenceRecord[]
}

export const CHAPTER18_REMEDIATION_RULES = {
  ordinaryTargetMasteryAtOrBelow: 70,
  ordinaryMinInitialMisses: 2,
  minimumEvidenceForMasteryTarget: 2,
  ordinaryReassessmentQuestionCount: 5,
  ordinaryReassessmentPassPercent: 80,
  urgentSafetyReassessmentQuestionCount: 5,
  urgentSafetyReassessmentPassPercent: 100,
} as const

export function combineChapter18Evidence(
  ...sources: ReadonlyArray<readonly Chapter18EvidenceRecord[]>
): Chapter18EvidenceRecord[] {
  const combined: Chapter18EvidenceRecord[] = []
  const keys = new Set<string>()

  for (const records of sources) {
    for (const record of records) {
      if (record.chapterId !== 'ch-18') continue
      const key = [
        record.studentId,
        record.chapterId,
        record.source,
        record.attemptPhase,
        record.itemId,
      ].join('|')
      if (keys.has(key)) continue
      keys.add(key)
      combined.push(record)
    }
  }
  return combined
}

const toTime = (value: string): number => {
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

function getRecentSafetyMissConcepts(
  evidence: readonly Chapter18EvidenceRecord[],
): Set<Chapter18ConceptFamilyId> {
  const recentTagged = evidence
    .filter((record) => getChapter18SafetyTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
    .slice(-CHAPTER18_SAFETY_RULES.recentWindow)

  return new Set(
    recentTagged.filter((record) => !record.correct).map((record) => record.conceptFamilyId),
  )
}

export function buildChapter18TargetedRemediationPlan(
  evidence: readonly Chapter18EvidenceRecord[],
  referenceTime: string,
): Chapter18RemediationPlan {
  const targets: Chapter18RemediationTarget[] = []
  const safety = evaluateChapter18SafetyIntervention(evidence)
  const recentSafetyMissConcepts = getRecentSafetyMissConcepts(evidence)

  for (const conceptFamilyId of CHAPTER18_CONCEPT_FAMILY_IDS) {
    const conceptEvidence = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    if (conceptEvidence.length === 0) continue

    const mastery = calculateChapter18ConceptMastery(conceptEvidence, referenceTime)
    const ordinaryGap =
      (
        mastery.observationCount >= CHAPTER18_REMEDIATION_RULES.minimumEvidenceForMasteryTarget &&
        mastery.mastery <= CHAPTER18_REMEDIATION_RULES.ordinaryTargetMasteryAtOrBelow
      ) ||
      mastery.initialMissCount >= CHAPTER18_REMEDIATION_RULES.ordinaryMinInitialMisses

    const urgentSafetyGap =
      safety.level === 'urgent' && recentSafetyMissConcepts.has(conceptFamilyId)
    const prioritySafetyGap =
      safety.level === 'review' && safety.conceptFamilyId === conceptFamilyId

    if (!ordinaryGap && !urgentSafetyGap && !prioritySafetyGap) continue

    const concept = getChapter18ConceptFamily(conceptFamilyId)
    targets.push({
      conceptFamilyId,
      conceptName: concept.name,
      mastery: mastery.mastery,
      confidence: mastery.confidence,
      observationCount: mastery.observationCount,
      sourceTypeCount: mastery.sourceTypeCount,
      initialMissCount: mastery.initialMissCount,
      remediationContentBlockIds: getChapter18RemediationContentBlocksForConcept(conceptFamilyId),
      remediationFlashcardIds: getChapter18FlashcardsForConcept(conceptFamilyId),
      priority: urgentSafetyGap ? 'urgent' : prioritySafetyGap ? 'priority' : 'standard',
      requiresFormalReassessment: urgentSafetyGap || ordinaryGap,
      plannedReassessmentQuestionCount: 5,
      plannedReassessmentPassPercent: urgentSafetyGap ? 100 : 80,
      safetyEscalation: urgentSafetyGap ? 'urgent' : prioritySafetyGap ? 'review' : null,
      reason: urgentSafetyGap
        ? 'Recent misses span multiple Chapter 18 high-risk hazard classes.'
        : prioritySafetyGap
          ? 'A recent high-risk miss requires immediate targeted safety review.'
          : mastery.initialMissCount >= CHAPTER18_REMEDIATION_RULES.ordinaryMinInitialMisses
            ? 'Multiple preserved initial misses indicate a concept gap.'
            : 'Combined evidence mastery is at or below the Chapter 18 remediation threshold.',
    })
  }

  const priorityRank = { urgent: 0, priority: 1, standard: 2 } as const
  targets.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority] || a.mastery - b.mastery)

  return { targets, preservedEvidence: evidence }
}

export function buildChapter18RemediationPathForConcept(
  conceptFamilyId: Chapter18ConceptFamilyId,
): {
  conceptFamilyId: Chapter18ConceptFamilyId
  contentBlockIds: readonly string[]
  flashcardIds: readonly string[]
  plannedReassessmentQuestionCount: 5
  plannedReassessmentPassPercent: 80
} {
  return {
    conceptFamilyId,
    contentBlockIds: getChapter18RemediationContentBlocksForConcept(conceptFamilyId),
    flashcardIds: getChapter18FlashcardsForConcept(conceptFamilyId),
    plannedReassessmentQuestionCount: CHAPTER18_REMEDIATION_RULES.ordinaryReassessmentQuestionCount,
    plannedReassessmentPassPercent: CHAPTER18_REMEDIATION_RULES.ordinaryReassessmentPassPercent,
  }
}


export interface Chapter18ReassessmentCycle {
  cycleId: string
  conceptFamilyId: Chapter18ConceptFamilyId
  questionIds: readonly string[]
  correctCount: number
  questionCount: 5
  percent: number
  passPercent: 80 | 100
  passed: boolean
}

export function selectChapter18ReassessmentQuestions(
  conceptFamilyId: Chapter18ConceptFamilyId,
  reserve: readonly Pick<Chapter18ReassessmentQuestion, 'id' | 'conceptFamilyId'>[],
  count = 5,
): readonly string[] {
  const ids = reserve
    .filter((question) => question.conceptFamilyId === conceptFamilyId)
    .map((question) => question.id)
    .sort((a, b) => a.localeCompare(b))

  if (ids.length < count) {
    throw new Error('Chapter 18 reassessment reserve for ' + conceptFamilyId + ' requires at least ' + count + ' questions.')
  }
  return ids.slice(0, count)
}

export function scoreChapter18ReassessmentCycle(args: {
  cycleId: string
  conceptFamilyId: Chapter18ConceptFamilyId
  selectedQuestionIds: readonly string[]
  responses: readonly { questionId: string; correct: boolean }[]
  passPercent: 80 | 100
}): Chapter18ReassessmentCycle {
  const selected = [...args.selectedQuestionIds]
  if (selected.length !== 5 || new Set(selected).size !== 5) {
    throw new Error('Chapter 18 formal reassessment cycles require exactly five unique questions.')
  }

  const responseMap = new Map(args.responses.map((response) => [response.questionId, response.correct]))
  if (responseMap.size !== 5 || selected.some((id) => !responseMap.has(id))) {
    throw new Error('Chapter 18 formal reassessment scoring requires one response for each selected question.')
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

export function buildChapter18ReassessmentEvidence(args: {
  studentId: string
  conceptFamilyId: Chapter18ConceptFamilyId
  selectedQuestions: readonly Chapter18ReassessmentQuestion[]
  responses: readonly { questionId: string; correct: boolean }[]
  timestamp: string
}): Chapter18EvidenceRecord[] {
  if (args.selectedQuestions.length !== 5 || new Set(args.selectedQuestions.map((q) => q.id)).size !== 5) {
    throw new Error('Chapter 18 reassessment evidence requires exactly five unique selected questions.')
  }
  if (args.selectedQuestions.some((question) => question.conceptFamilyId !== args.conceptFamilyId)) {
    throw new Error('Chapter 18 reassessment questions must all match the target concept family.')
  }

  const responseMap = new Map(args.responses.map((response) => [response.questionId, response.correct]))
  if (responseMap.size !== 5 || args.selectedQuestions.some((question) => !responseMap.has(question.id))) {
    throw new Error('Chapter 18 reassessment evidence requires one response for each selected question.')
  }

  return args.selectedQuestions.map((question) => ({
    studentId: args.studentId,
    chapterId: 'ch-18',
    conceptFamilyId: args.conceptFamilyId,
    source: 'remediation_reassessment',
    itemId: question.id,
    difficulty: question.difficulty,
    correct: responseMap.get(question.id) === true,
    attemptPhase: 'reassessment',
    timestamp: args.timestamp,
  }))
}

export function appendChapter18ReassessmentEvidence(
  originalEvidence: readonly Chapter18EvidenceRecord[],
  reassessmentEvidence: readonly Chapter18EvidenceRecord[],
): Chapter18EvidenceRecord[] {
  if (reassessmentEvidence.some(
    (record) =>
      record.chapterId !== 'ch-18' ||
      record.source !== 'remediation_reassessment' ||
      record.attemptPhase !== 'reassessment',
  )) {
    throw new Error('Reassessment evidence must use Chapter 18 remediation_reassessment / reassessment semantics.')
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

export function calculateChapter18RecoveredMastery(
  originalEvidence: readonly Chapter18EvidenceRecord[],
  reassessmentEvidence: readonly Chapter18EvidenceRecord[],
  conceptFamilyId: Chapter18ConceptFamilyId,
  referenceTime: string,
) {
  const before = calculateChapter18ConceptMastery(
    originalEvidence.filter((record) => record.conceptFamilyId === conceptFamilyId),
    referenceTime,
  )
  const combined = appendChapter18ReassessmentEvidence(originalEvidence, reassessmentEvidence)
  const after = calculateChapter18ConceptMastery(
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
