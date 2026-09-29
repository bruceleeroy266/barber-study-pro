import { calculateChapter17ConceptMastery, type Chapter17EvidenceRecord } from './grading'
import { CHAPTER17_CONCEPT_FAMILY_IDS, getChapter17ConceptFamily } from './concepts'
import { getChapter17ContentBlocksForConcept, getChapter17FlashcardsForConcept } from './mappings'
import {
  CHAPTER17_SAFETY_RULES,
  evaluateChapter17SafetyIntervention,
  getChapter17SafetyTag,
  type Chapter17SafetyInterventionLevel,
} from './safety-intervention'
import type { Chapter17ConceptFamilyId } from './types'
import type { Chapter17ReassessmentQuestion } from './reassessment-reserve'

export interface Chapter17RemediationTarget {
  conceptFamilyId: Chapter17ConceptFamilyId
  conceptName: string
  mastery: number
  confidence: ReturnType<typeof calculateChapter17ConceptMastery>['confidence']
  observationCount: number
  sourceTypeCount: number
  initialMissCount: number
  remediationContentBlockIds: readonly string[]
  remediationFlashcardIds: readonly string[]
  priority: 'standard' | 'priority' | 'urgent'
  requiresFormalReassessment: boolean
  plannedReassessmentQuestionCount: 5
  plannedReassessmentPassPercent: 80 | 100
  safetyEscalation: Chapter17SafetyInterventionLevel | null
  reason: string
}

export interface Chapter17RemediationPlan {
  targets: Chapter17RemediationTarget[]
  preservedEvidence: readonly Chapter17EvidenceRecord[]
}

export const CHAPTER17_REMEDIATION_RULES = {
  ordinaryTargetMasteryAtOrBelow: 70,
  ordinaryMinInitialMisses: 2,
  minimumEvidenceForMasteryTarget: 2,
  ordinaryReassessmentQuestionCount: 5,
  ordinaryReassessmentPassPercent: 80,
  urgentSafetyReassessmentQuestionCount: 5,
  urgentSafetyReassessmentPassPercent: 100,
} as const

export function combineChapter17Evidence(
  ...sources: ReadonlyArray<readonly Chapter17EvidenceRecord[]>
): Chapter17EvidenceRecord[] {
  const combined: Chapter17EvidenceRecord[] = []
  const keys = new Set<string>()

  for (const records of sources) {
    for (const record of records) {
      if (record.chapterId !== 'ch-17') continue
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
  evidence: readonly Chapter17EvidenceRecord[],
): Set<Chapter17ConceptFamilyId> {
  const recentTagged = evidence
    .filter((record) => getChapter17SafetyTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
    .slice(-CHAPTER17_SAFETY_RULES.recentWindow)

  return new Set(
    recentTagged.filter((record) => !record.correct).map((record) => record.conceptFamilyId),
  )
}

export function buildChapter17TargetedRemediationPlan(
  evidence: readonly Chapter17EvidenceRecord[],
  referenceTime: string,
): Chapter17RemediationPlan {
  const targets: Chapter17RemediationTarget[] = []
  const safety = evaluateChapter17SafetyIntervention(evidence)
  const recentSafetyMissConcepts = getRecentSafetyMissConcepts(evidence)

  for (const conceptFamilyId of CHAPTER17_CONCEPT_FAMILY_IDS) {
    const conceptEvidence = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    if (conceptEvidence.length === 0) continue

    const mastery = calculateChapter17ConceptMastery(conceptEvidence, referenceTime)
    const ordinaryGap =
      (
        mastery.observationCount >= CHAPTER17_REMEDIATION_RULES.minimumEvidenceForMasteryTarget &&
        mastery.mastery <= CHAPTER17_REMEDIATION_RULES.ordinaryTargetMasteryAtOrBelow
      ) ||
      mastery.initialMissCount >= CHAPTER17_REMEDIATION_RULES.ordinaryMinInitialMisses

    const urgentSafetyGap =
      safety.level === 'urgent' && recentSafetyMissConcepts.has(conceptFamilyId)
    const prioritySafetyGap =
      safety.level === 'review' && safety.conceptFamilyId === conceptFamilyId

    if (!ordinaryGap && !urgentSafetyGap && !prioritySafetyGap) continue

    const concept = getChapter17ConceptFamily(conceptFamilyId)
    targets.push({
      conceptFamilyId,
      conceptName: concept.name,
      mastery: mastery.mastery,
      confidence: mastery.confidence,
      observationCount: mastery.observationCount,
      sourceTypeCount: mastery.sourceTypeCount,
      initialMissCount: mastery.initialMissCount,
      remediationContentBlockIds: getChapter17ContentBlocksForConcept(conceptFamilyId),
      remediationFlashcardIds: getChapter17FlashcardsForConcept(conceptFamilyId),
      priority: urgentSafetyGap ? 'urgent' : prioritySafetyGap ? 'priority' : 'standard',
      requiresFormalReassessment: urgentSafetyGap || ordinaryGap,
      plannedReassessmentQuestionCount: 5,
      plannedReassessmentPassPercent: urgentSafetyGap ? 100 : 80,
      safetyEscalation: urgentSafetyGap ? 'urgent' : prioritySafetyGap ? 'review' : null,
      reason: urgentSafetyGap
        ? concept.name + ' includes a recent urgent high-risk gap and requires targeted review plus a perfect five-question reassessment before recovery.'
        : prioritySafetyGap
          ? concept.name + ' includes the current high-risk miss and requires immediate targeted review.'
          : concept.name + ' is targeted because combined-evidence mastery is ' + mastery.mastery + '% with ' + mastery.initialMissCount + ' preserved initial misses.',
    })
  }

  const rank = { urgent: 0, priority: 1, standard: 2 } as const
  targets.sort((a, b) =>
    rank[a.priority] - rank[b.priority] ||
    a.mastery - b.mastery ||
    a.conceptFamilyId.localeCompare(b.conceptFamilyId),
  )

  return { targets, preservedEvidence: evidence }
}

export function buildChapter17RemediationPathForConcept(
  conceptFamilyId: Chapter17ConceptFamilyId,
): {
  conceptFamilyId: Chapter17ConceptFamilyId
  contentBlockIds: readonly string[]
  flashcardIds: readonly string[]
} {
  return {
    conceptFamilyId,
    contentBlockIds: getChapter17ContentBlocksForConcept(conceptFamilyId),
    flashcardIds: getChapter17FlashcardsForConcept(conceptFamilyId),
  }
}


export interface Chapter17ReassessmentCycle {
  cycleId: string
  conceptFamilyId: Chapter17ConceptFamilyId
  questionIds: readonly string[]
  correctCount: number
  questionCount: 5
  percent: number
  passPercent: 80 | 100
  passed: boolean
}

export function selectChapter17ReassessmentQuestions(
  conceptFamilyId: Chapter17ConceptFamilyId,
  reserve: readonly Pick<Chapter17ReassessmentQuestion, 'id' | 'conceptFamilyId'>[],
  count = 5,
): readonly string[] {
  const ids = reserve
    .filter((question) => question.conceptFamilyId === conceptFamilyId)
    .map((question) => question.id)
    .sort((a, b) => a.localeCompare(b))

  if (ids.length < count) {
    throw new Error('Chapter 17 reassessment reserve for ' + conceptFamilyId + ' requires at least ' + count + ' questions.')
  }
  return ids.slice(0, count)
}

export function scoreChapter17ReassessmentCycle(args: {
  cycleId: string
  conceptFamilyId: Chapter17ConceptFamilyId
  selectedQuestionIds: readonly string[]
  responses: readonly { questionId: string; correct: boolean }[]
  passPercent: 80 | 100
}): Chapter17ReassessmentCycle {
  const selected = [...args.selectedQuestionIds]
  if (selected.length !== 5 || new Set(selected).size !== 5) {
    throw new Error('Chapter 17 formal reassessment cycles require exactly five unique questions.')
  }

  const responseMap = new Map(args.responses.map((response) => [response.questionId, response.correct]))
  if (responseMap.size !== 5 || selected.some((id) => !responseMap.has(id))) {
    throw new Error('Chapter 17 formal reassessment scoring requires one response for each selected question.')
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

export function buildChapter17ReassessmentEvidence(args: {
  studentId: string
  conceptFamilyId: Chapter17ConceptFamilyId
  selectedQuestions: readonly Chapter17ReassessmentQuestion[]
  responses: readonly { questionId: string; correct: boolean }[]
  timestamp: string
}): Chapter17EvidenceRecord[] {
  if (args.selectedQuestions.length !== 5 || new Set(args.selectedQuestions.map((q) => q.id)).size !== 5) {
    throw new Error('Chapter 17 reassessment evidence requires exactly five unique selected questions.')
  }
  if (args.selectedQuestions.some((question) => question.conceptFamilyId !== args.conceptFamilyId)) {
    throw new Error('Chapter 17 reassessment questions must all match the target concept family.')
  }

  const responseMap = new Map(args.responses.map((response) => [response.questionId, response.correct]))
  if (responseMap.size !== 5 || args.selectedQuestions.some((question) => !responseMap.has(question.id))) {
    throw new Error('Chapter 17 reassessment evidence requires one response for each selected question.')
  }

  return args.selectedQuestions.map((question) => ({
    studentId: args.studentId,
    chapterId: 'ch-17',
    conceptFamilyId: args.conceptFamilyId,
    source: 'remediation_reassessment',
    itemId: question.id,
    difficulty: question.difficulty,
    correct: responseMap.get(question.id) === true,
    attemptPhase: 'reassessment',
    timestamp: args.timestamp,
  }))
}

export function appendChapter17ReassessmentEvidence(
  originalEvidence: readonly Chapter17EvidenceRecord[],
  reassessmentEvidence: readonly Chapter17EvidenceRecord[],
): Chapter17EvidenceRecord[] {
  if (reassessmentEvidence.some(
    (record) =>
      record.chapterId !== 'ch-17' ||
      record.source !== 'remediation_reassessment' ||
      record.attemptPhase !== 'reassessment',
  )) {
    throw new Error('Reassessment evidence must use Chapter 17 remediation_reassessment / reassessment semantics.')
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

export function calculateChapter17RecoveredMastery(
  originalEvidence: readonly Chapter17EvidenceRecord[],
  reassessmentEvidence: readonly Chapter17EvidenceRecord[],
  conceptFamilyId: Chapter17ConceptFamilyId,
  referenceTime: string,
) {
  const before = calculateChapter17ConceptMastery(
    originalEvidence.filter((record) => record.conceptFamilyId === conceptFamilyId),
    referenceTime,
  )
  const combined = appendChapter17ReassessmentEvidence(originalEvidence, reassessmentEvidence)
  const after = calculateChapter17ConceptMastery(
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
