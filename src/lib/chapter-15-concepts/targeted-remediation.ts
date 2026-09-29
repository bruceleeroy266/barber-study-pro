import { calculateChapter15ConceptMastery, type Chapter15EvidenceRecord } from './grading'
import { CHAPTER15_CONCEPT_FAMILY_IDS, getChapter15ConceptFamily } from './concepts'
import { getChapter15ContentBlocksForConcept, getChapter15FlashcardsForConcept } from './mappings'
import {
  CHAPTER15_SAFETY_RULES,
  evaluateChapter15SafetyIntervention,
  getChapter15SafetyTag,
  type Chapter15SafetyInterventionLevel,
} from './safety-intervention'
import type { Chapter15ConceptFamilyId } from './types'
import type { Chapter15ReassessmentQuestion } from './reassessment-reserve'

export interface Chapter15RemediationTarget {
  conceptFamilyId: Chapter15ConceptFamilyId
  conceptName: string
  mastery: number
  confidence: ReturnType<typeof calculateChapter15ConceptMastery>['confidence']
  observationCount: number
  sourceTypeCount: number
  initialMissCount: number
  remediationContentBlockIds: readonly string[]
  remediationFlashcardIds: readonly string[]
  priority: 'standard' | 'priority' | 'urgent'
  requiresFormalReassessment: boolean
  plannedReassessmentQuestionCount: 5
  plannedReassessmentPassPercent: 80 | 100
  safetyEscalation: Chapter15SafetyInterventionLevel | null
  reason: string
}

export interface Chapter15RemediationPlan {
  targets: Chapter15RemediationTarget[]
  preservedEvidence: readonly Chapter15EvidenceRecord[]
}

export const CHAPTER15_REMEDIATION_RULES = {
  ordinaryTargetMasteryAtOrBelow: 70,
  ordinaryMinInitialMisses: 2,
  minimumEvidenceForMasteryTarget: 2,
  ordinaryReassessmentQuestionCount: 5,
  ordinaryReassessmentPassPercent: 80,
  urgentSafetyReassessmentQuestionCount: 5,
  urgentSafetyReassessmentPassPercent: 100,
} as const

export function combineChapter15Evidence(
  ...sources: ReadonlyArray<readonly Chapter15EvidenceRecord[]>
): Chapter15EvidenceRecord[] {
  const combined: Chapter15EvidenceRecord[] = []
  const keys = new Set<string>()

  for (const records of sources) {
    for (const record of records) {
      if (record.chapterId !== 'ch-15') continue
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
  evidence: readonly Chapter15EvidenceRecord[],
): Set<Chapter15ConceptFamilyId> {
  const recentTagged = evidence
    .filter((record) => getChapter15SafetyTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
    .slice(-CHAPTER15_SAFETY_RULES.recentWindow)

  return new Set(
    recentTagged.filter((record) => !record.correct).map((record) => record.conceptFamilyId),
  )
}

export function buildChapter15TargetedRemediationPlan(
  evidence: readonly Chapter15EvidenceRecord[],
  referenceTime: string,
): Chapter15RemediationPlan {
  const targets: Chapter15RemediationTarget[] = []
  const safety = evaluateChapter15SafetyIntervention(evidence)
  const recentSafetyMissConcepts = getRecentSafetyMissConcepts(evidence)

  for (const conceptFamilyId of CHAPTER15_CONCEPT_FAMILY_IDS) {
    const conceptEvidence = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    if (conceptEvidence.length === 0) continue

    const mastery = calculateChapter15ConceptMastery(conceptEvidence, referenceTime)
    const ordinaryGap =
      (
        mastery.observationCount >= CHAPTER15_REMEDIATION_RULES.minimumEvidenceForMasteryTarget &&
        mastery.mastery <= CHAPTER15_REMEDIATION_RULES.ordinaryTargetMasteryAtOrBelow
      ) ||
      mastery.initialMissCount >= CHAPTER15_REMEDIATION_RULES.ordinaryMinInitialMisses

    const urgentSafetyGap =
      safety.level === 'urgent' && recentSafetyMissConcepts.has(conceptFamilyId)
    const prioritySafetyGap =
      safety.level === 'review' && safety.conceptFamilyId === conceptFamilyId

    if (!ordinaryGap && !urgentSafetyGap && !prioritySafetyGap) continue

    const concept = getChapter15ConceptFamily(conceptFamilyId)
    targets.push({
      conceptFamilyId,
      conceptName: concept.name,
      mastery: mastery.mastery,
      confidence: mastery.confidence,
      observationCount: mastery.observationCount,
      sourceTypeCount: mastery.sourceTypeCount,
      initialMissCount: mastery.initialMissCount,
      remediationContentBlockIds: getChapter15ContentBlocksForConcept(conceptFamilyId),
      remediationFlashcardIds: getChapter15FlashcardsForConcept(conceptFamilyId),
      priority: urgentSafetyGap ? 'urgent' : prioritySafetyGap ? 'priority' : 'standard',
      requiresFormalReassessment: urgentSafetyGap || ordinaryGap,
      plannedReassessmentQuestionCount: CHAPTER15_REMEDIATION_RULES.ordinaryReassessmentQuestionCount,
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

export function buildChapter15RemediationPathForConcept(
  conceptFamilyId: Chapter15ConceptFamilyId,
): {
  conceptFamilyId: Chapter15ConceptFamilyId
  contentBlockIds: readonly string[]
  flashcardIds: readonly string[]
} {
  return {
    conceptFamilyId,
    contentBlockIds: getChapter15ContentBlocksForConcept(conceptFamilyId),
    flashcardIds: getChapter15FlashcardsForConcept(conceptFamilyId),
  }
}


export interface Chapter15ReassessmentCycle {
  cycleId: string
  conceptFamilyId: Chapter15ConceptFamilyId
  questionIds: readonly string[]
  correctCount: number
  questionCount: 5
  percent: number
  passPercent: 80 | 100
  passed: boolean
}

export function selectChapter15ReassessmentQuestions(
  conceptFamilyId: Chapter15ConceptFamilyId,
  reserve: readonly Pick<Chapter15ReassessmentQuestion, 'id' | 'conceptFamilyId'>[],
  count = 5,
): readonly string[] {
  const ids = reserve
    .filter((question) => question.conceptFamilyId === conceptFamilyId)
    .map((question) => question.id)
    .sort((a, b) => a.localeCompare(b))

  if (ids.length < count) {
    throw new Error('Chapter 15 reassessment reserve for ' + conceptFamilyId + ' requires at least ' + count + ' questions.')
  }
  return ids.slice(0, count)
}

export function scoreChapter15ReassessmentCycle(args: {
  cycleId: string
  conceptFamilyId: Chapter15ConceptFamilyId
  selectedQuestionIds: readonly string[]
  responses: readonly { questionId: string; correct: boolean }[]
  passPercent: 80 | 100
}): Chapter15ReassessmentCycle {
  const selected = [...args.selectedQuestionIds]
  if (selected.length !== 5 || new Set(selected).size !== 5) {
    throw new Error('Chapter 15 formal reassessment cycles require exactly five unique questions.')
  }

  const responseMap = new Map(args.responses.map((response) => [response.questionId, response.correct]))
  if (responseMap.size !== 5 || selected.some((id) => !responseMap.has(id))) {
    throw new Error('Chapter 15 formal reassessment scoring requires one response for each selected question.')
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

export function buildChapter15ReassessmentEvidence(args: {
  studentId: string
  conceptFamilyId: Chapter15ConceptFamilyId
  selectedQuestions: readonly Chapter15ReassessmentQuestion[]
  responses: readonly { questionId: string; correct: boolean }[]
  timestamp: string
}): Chapter15EvidenceRecord[] {
  if (args.selectedQuestions.length !== 5 || new Set(args.selectedQuestions.map((q) => q.id)).size !== 5) {
    throw new Error('Chapter 15 reassessment evidence requires exactly five unique selected questions.')
  }
  if (args.selectedQuestions.some((question) => question.conceptFamilyId !== args.conceptFamilyId)) {
    throw new Error('Chapter 15 reassessment questions must all match the target concept family.')
  }

  const responseMap = new Map(args.responses.map((response) => [response.questionId, response.correct]))
  if (responseMap.size !== 5 || args.selectedQuestions.some((question) => !responseMap.has(question.id))) {
    throw new Error('Chapter 15 reassessment evidence requires one response for each selected question.')
  }

  return args.selectedQuestions.map((question) => ({
    studentId: args.studentId,
    chapterId: 'ch-15',
    conceptFamilyId: args.conceptFamilyId,
    source: 'remediation_reassessment',
    itemId: question.id,
    difficulty: question.difficulty,
    correct: responseMap.get(question.id) === true,
    attemptPhase: 'reassessment',
    timestamp: args.timestamp,
  }))
}

export function appendChapter15ReassessmentEvidence(
  originalEvidence: readonly Chapter15EvidenceRecord[],
  reassessmentEvidence: readonly Chapter15EvidenceRecord[],
): Chapter15EvidenceRecord[] {
  if (reassessmentEvidence.some(
    (record) =>
      record.chapterId !== 'ch-15' ||
      record.source !== 'remediation_reassessment' ||
      record.attemptPhase !== 'reassessment',
  )) {
    throw new Error('Reassessment evidence must use Chapter 15 remediation_reassessment / reassessment semantics.')
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

export function calculateChapter15RecoveredMastery(
  originalEvidence: readonly Chapter15EvidenceRecord[],
  reassessmentEvidence: readonly Chapter15EvidenceRecord[],
  conceptFamilyId: Chapter15ConceptFamilyId,
  referenceTime: string,
) {
  const before = calculateChapter15ConceptMastery(
    originalEvidence.filter((record) => record.conceptFamilyId === conceptFamilyId),
    referenceTime,
  )
  const combined = appendChapter15ReassessmentEvidence(originalEvidence, reassessmentEvidence)
  const after = calculateChapter15ConceptMastery(
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
