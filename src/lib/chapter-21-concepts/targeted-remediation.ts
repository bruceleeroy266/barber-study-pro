import {
  calculateChapter21ConceptMastery,
  type Chapter21EvidenceRecord,
} from './grading'
import {
  CHAPTER21_CONCEPT_FAMILY_IDS,
  getChapter21ConceptFamily,
} from './concepts'
import {
  getChapter21FlashcardsForConcept,
  getChapter21RemediationContentBlocksForConcept,
} from './mappings'
import {
  CHAPTER21_COMPLIANCE_RULES,
  evaluateChapter21ComplianceIntervention,
  getChapter21ComplianceTag,
  type Chapter21ComplianceInterventionLevel,
} from './escalation'
import type { Chapter21ConceptFamilyId } from './types'
import type { Chapter21ReassessmentQuestion } from './reassessment-reserve'

export type Chapter21RemediationPriority = 'standard' | 'compliance'

export interface Chapter21RemediationTarget {
  conceptFamilyId: Chapter21ConceptFamilyId
  conceptName: string
  mastery: number
  confidence: ReturnType<typeof calculateChapter21ConceptMastery>['confidence']
  observationCount: number
  sourceTypeCount: number
  initialMissCount: number
  remediationContentBlockIds: readonly string[]
  remediationFlashcardIds: readonly string[]
  priority: Chapter21RemediationPriority
  requiresFormalReassessment: boolean
  plannedReassessmentQuestionCount: 5
  plannedReassessmentPassPercent: 80
  safetyEscalation: null
  complianceEscalation: Chapter21ComplianceInterventionLevel | null
  reason: string
}

export interface Chapter21RemediationPlan {
  targets: Chapter21RemediationTarget[]
  preservedEvidence: readonly Chapter21EvidenceRecord[]
}

export const CHAPTER21_REMEDIATION_RULES = {
  ordinaryTargetMasteryAtOrBelow: 70,
  ordinaryMinInitialMisses: 2,
  minimumEvidenceForMasteryTarget: 2,
  ordinaryReassessmentQuestionCount: 5,
  ordinaryReassessmentPassPercent: 80,
  complianceReassessmentQuestionCount: 5,
  complianceReassessmentPassPercent: 80,
} as const

export function combineChapter21Evidence(
  ...sources: ReadonlyArray<readonly Chapter21EvidenceRecord[]>
): Chapter21EvidenceRecord[] {
  const combined: Chapter21EvidenceRecord[] = []
  const keys = new Set<string>()

  for (const records of sources) {
    for (const record of records) {
      if (record.chapterId !== 'ch-21') continue
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

function recentComplianceMissConcepts(
  evidence: readonly Chapter21EvidenceRecord[],
): Set<Chapter21ConceptFamilyId> {
  const tagged = evidence
    .filter((record) => getChapter21ComplianceTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
    .slice(-CHAPTER21_COMPLIANCE_RULES.recentWindow)

  return new Set(
    tagged
      .filter((record) => !record.correct)
      .map((record) => record.conceptFamilyId),
  )
}

export function buildChapter21TargetedRemediationPlan(
  evidence: readonly Chapter21EvidenceRecord[],
  referenceTime: string,
): Chapter21RemediationPlan {
  const targets: Chapter21RemediationTarget[] = []
  const compliance = evaluateChapter21ComplianceIntervention(evidence)
  const recentCompliance = recentComplianceMissConcepts(evidence)

  for (const conceptFamilyId of CHAPTER21_CONCEPT_FAMILY_IDS) {
    const conceptEvidence = evidence.filter(
      (record) => record.conceptFamilyId === conceptFamilyId,
    )
    if (conceptEvidence.length === 0) continue

    const mastery = calculateChapter21ConceptMastery(
      conceptEvidence,
      referenceTime,
    )
    const ordinaryGap =
      (mastery.observationCount >=
        CHAPTER21_REMEDIATION_RULES.minimumEvidenceForMasteryTarget &&
        mastery.mastery <=
          CHAPTER21_REMEDIATION_RULES.ordinaryTargetMasteryAtOrBelow) ||
      mastery.initialMissCount >=
        CHAPTER21_REMEDIATION_RULES.ordinaryMinInitialMisses

    const elevatedComplianceGap =
      compliance.level === 'elevated' &&
      recentCompliance.has(conceptFamilyId)
    const reviewComplianceGap =
      compliance.level === 'review' &&
      compliance.conceptFamilyId === conceptFamilyId

    if (!ordinaryGap && !elevatedComplianceGap && !reviewComplianceGap) {
      continue
    }

    const concept = getChapter21ConceptFamily(conceptFamilyId)
    targets.push({
      conceptFamilyId,
      conceptName: concept.name,
      mastery: mastery.mastery,
      confidence: mastery.confidence,
      observationCount: mastery.observationCount,
      sourceTypeCount: mastery.sourceTypeCount,
      initialMissCount: mastery.initialMissCount,
      remediationContentBlockIds:
        getChapter21RemediationContentBlocksForConcept(conceptFamilyId),
      remediationFlashcardIds:
        getChapter21FlashcardsForConcept(conceptFamilyId),
      priority:
        elevatedComplianceGap || reviewComplianceGap
          ? 'compliance'
          : 'standard',
      requiresFormalReassessment:
        elevatedComplianceGap || ordinaryGap,
      plannedReassessmentQuestionCount: 5,
      plannedReassessmentPassPercent: 80,
      safetyEscalation: null,
      complianceEscalation:
        elevatedComplianceGap
          ? 'elevated'
          : reviewComplianceGap
            ? 'review'
            : null,
      reason: elevatedComplianceGap
        ? 'Multiple distinct Chapter 21 compliance misses require elevated targeted review.'
        : reviewComplianceGap
          ? 'A tagged Chapter 21 compliance miss requires targeted review.'
          : mastery.initialMissCount >=
                CHAPTER21_REMEDIATION_RULES.ordinaryMinInitialMisses
            ? 'Multiple preserved initial misses indicate a concept gap.'
            : 'Combined evidence mastery is at or below the Chapter 21 remediation threshold.',
    })
  }

  targets.sort(
    (a, b) =>
      (a.priority === 'compliance' ? 0 : 1) -
        (b.priority === 'compliance' ? 0 : 1) ||
      a.mastery - b.mastery,
  )

  return { targets, preservedEvidence: evidence }
}

export function buildChapter21RemediationPathForConcept(
  conceptFamilyId: Chapter21ConceptFamilyId,
) {
  return {
    conceptFamilyId,
    contentBlockIds:
      getChapter21RemediationContentBlocksForConcept(conceptFamilyId),
    flashcardIds: getChapter21FlashcardsForConcept(conceptFamilyId),
    plannedReassessmentQuestionCount: 5 as const,
    plannedReassessmentPassPercent: 80 as const,
  }
}


export interface Chapter21ReassessmentCycle {
  cycleId: string
  conceptFamilyId: Chapter21ConceptFamilyId
  questionIds: readonly string[]
  correctCount: number
  questionCount: 5
  percent: number
  passPercent: 80
  passed: boolean
}

export function selectChapter21ReassessmentQuestions(
  conceptFamilyId: Chapter21ConceptFamilyId,
  reserve: readonly Pick<Chapter21ReassessmentQuestion, 'id' | 'conceptFamilyId'>[],
  count = 5,
  excludedQuestionIds: ReadonlySet<string> = new Set(),
): readonly string[] {
  const ids = reserve
    .filter(
      (question) =>
        question.conceptFamilyId === conceptFamilyId &&
        !excludedQuestionIds.has(question.id),
    )
    .map((question) => question.id)
    .sort((a, b) => a.localeCompare(b))

  if (ids.length < count) {
    throw new Error(
      'Chapter 21 reassessment reserve for ' +
        conceptFamilyId +
        ' requires at least ' +
        count +
        ' fresh non-excluded questions.',
    )
  }

  return ids.slice(0, count)
}

export function scoreChapter21ReassessmentCycle(args: {
  cycleId: string
  conceptFamilyId: Chapter21ConceptFamilyId
  selectedQuestionIds: readonly string[]
  responses: readonly { questionId: string; correct: boolean }[]
}): Chapter21ReassessmentCycle {
  const selected = [...args.selectedQuestionIds]

  if (selected.length !== 5 || new Set(selected).size !== 5) {
    throw new Error(
      'Chapter 21 formal reassessment cycles require exactly five unique questions.',
    )
  }

  const responseMap = new Map(
    args.responses.map((response) => [response.questionId, response.correct]),
  )

  if (responseMap.size !== 5 || selected.some((id) => !responseMap.has(id))) {
    throw new Error(
      'Chapter 21 formal reassessment scoring requires one response for each selected question.',
    )
  }

  const correctCount = selected.filter(
    (id) => responseMap.get(id) === true,
  ).length
  const percent = Math.round((correctCount / 5) * 10000) / 100

  return {
    cycleId: args.cycleId,
    conceptFamilyId: args.conceptFamilyId,
    questionIds: selected,
    correctCount,
    questionCount: 5,
    percent,
    passPercent: 80,
    passed: percent >= 80,
  }
}

export function buildChapter21ReassessmentEvidence(args: {
  studentId: string
  conceptFamilyId: Chapter21ConceptFamilyId
  selectedQuestions: readonly Chapter21ReassessmentQuestion[]
  responses: readonly { questionId: string; correct: boolean }[]
  timestamp: string
}): Chapter21EvidenceRecord[] {
  if (
    args.selectedQuestions.length !== 5 ||
    new Set(args.selectedQuestions.map((question) => question.id)).size !== 5
  ) {
    throw new Error(
      'Chapter 21 reassessment evidence requires exactly five unique selected questions.',
    )
  }

  if (
    args.selectedQuestions.some(
      (question) => question.conceptFamilyId !== args.conceptFamilyId,
    )
  ) {
    throw new Error(
      'Chapter 21 reassessment questions must all match the target concept family.',
    )
  }

  const responseMap = new Map(
    args.responses.map((response) => [response.questionId, response.correct]),
  )

  if (
    responseMap.size !== 5 ||
    args.selectedQuestions.some(
      (question) => !responseMap.has(question.id),
    )
  ) {
    throw new Error(
      'Chapter 21 reassessment evidence requires one response for each selected question.',
    )
  }

  return args.selectedQuestions.map((question) => ({
    studentId: args.studentId,
    chapterId: 'ch-21',
    conceptFamilyId: args.conceptFamilyId,
    source: 'remediation_reassessment',
    itemId: question.id,
    difficulty: question.difficulty,
    correct: responseMap.get(question.id) === true,
    attemptPhase: 'reassessment',
    timestamp: args.timestamp,
  }))
}

export function appendChapter21ReassessmentEvidence(
  originalEvidence: readonly Chapter21EvidenceRecord[],
  reassessmentEvidence: readonly Chapter21EvidenceRecord[],
): Chapter21EvidenceRecord[] {
  if (
    reassessmentEvidence.some(
      (record) =>
        record.chapterId !== 'ch-21' ||
        record.source !== 'remediation_reassessment' ||
        record.attemptPhase !== 'reassessment',
    )
  ) {
    throw new Error(
      'Reassessment evidence must use Chapter 21 remediation_reassessment / reassessment semantics.',
    )
  }

  const existingKeys = new Set(
    originalEvidence.map((record) =>
      [
        record.studentId,
        record.chapterId,
        record.source,
        record.attemptPhase,
        record.itemId,
      ].join('|'),
    ),
  )

  const additions = reassessmentEvidence.filter((record) => {
    const key = [
      record.studentId,
      record.chapterId,
      record.source,
      record.attemptPhase,
      record.itemId,
    ].join('|')

    if (existingKeys.has(key)) return false
    existingKeys.add(key)
    return true
  })

  return [...originalEvidence, ...additions]
}

export function calculateChapter21RecoveredMastery(
  originalEvidence: readonly Chapter21EvidenceRecord[],
  reassessmentEvidence: readonly Chapter21EvidenceRecord[],
  conceptFamilyId: Chapter21ConceptFamilyId,
  referenceTime: string,
) {
  const before = calculateChapter21ConceptMastery(
    originalEvidence.filter(
      (record) => record.conceptFamilyId === conceptFamilyId,
    ),
    referenceTime,
  )

  const combined = appendChapter21ReassessmentEvidence(
    originalEvidence,
    reassessmentEvidence,
  )

  const after = calculateChapter21ConceptMastery(
    combined.filter(
      (record) => record.conceptFamilyId === conceptFamilyId,
    ),
    referenceTime,
  )

  return {
    before,
    after,
    combinedEvidence: combined,
    originalEvidencePreserved:
      JSON.stringify(combined.slice(0, originalEvidence.length)) ===
      JSON.stringify(originalEvidence),
  }
}
