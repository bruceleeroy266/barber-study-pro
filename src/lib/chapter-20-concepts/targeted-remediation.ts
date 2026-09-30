import {
  calculateChapter20ConceptMastery,
  type Chapter20EvidenceRecord,
} from './grading'
import {
  CHAPTER20_CONCEPT_FAMILY_IDS,
  getChapter20ConceptFamily,
} from './concepts'
import {
  getChapter20FlashcardsForConcept,
  getChapter20RemediationContentBlocksForConcept,
} from './mappings'
import {
  CHAPTER20_COMPLIANCE_RULES,
  evaluateChapter20ComplianceIntervention,
  getChapter20ComplianceTag,
  type Chapter20ComplianceInterventionLevel,
} from './escalation'
import type { Chapter20ConceptFamilyId } from './types'
import type { Chapter20ReassessmentQuestion } from './reassessment-reserve'

export type Chapter20RemediationPriority = 'standard' | 'compliance'

export interface Chapter20RemediationTarget {
  conceptFamilyId: Chapter20ConceptFamilyId
  conceptName: string
  mastery: number
  confidence: ReturnType<typeof calculateChapter20ConceptMastery>['confidence']
  observationCount: number
  sourceTypeCount: number
  initialMissCount: number
  remediationContentBlockIds: readonly string[]
  remediationFlashcardIds: readonly string[]
  priority: Chapter20RemediationPriority
  requiresFormalReassessment: boolean
  plannedReassessmentQuestionCount: 5
  plannedReassessmentPassPercent: 80
  safetyEscalation: null
  complianceEscalation: Chapter20ComplianceInterventionLevel | null
  reason: string
}

export interface Chapter20RemediationPlan {
  targets: Chapter20RemediationTarget[]
  preservedEvidence: readonly Chapter20EvidenceRecord[]
}

export const CHAPTER20_REMEDIATION_RULES = {
  ordinaryTargetMasteryAtOrBelow: 70,
  ordinaryMinInitialMisses: 2,
  minimumEvidenceForMasteryTarget: 2,
  ordinaryReassessmentQuestionCount: 5,
  ordinaryReassessmentPassPercent: 80,
  complianceReassessmentQuestionCount: 5,
  complianceReassessmentPassPercent: 80,
} as const

export function combineChapter20Evidence(
  ...sources: ReadonlyArray<readonly Chapter20EvidenceRecord[]>
): Chapter20EvidenceRecord[] {
  const combined: Chapter20EvidenceRecord[] = []
  const keys = new Set<string>()

  for (const records of sources) {
    for (const record of records) {
      if (record.chapterId !== 'ch-20') continue
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
  evidence: readonly Chapter20EvidenceRecord[],
): Set<Chapter20ConceptFamilyId> {
  const tagged = evidence
    .filter((record) => getChapter20ComplianceTag(record.itemId) !== null)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
    .slice(-CHAPTER20_COMPLIANCE_RULES.recentWindow)

  return new Set(
    tagged
      .filter((record) => !record.correct)
      .map((record) => record.conceptFamilyId),
  )
}

export function buildChapter20TargetedRemediationPlan(
  evidence: readonly Chapter20EvidenceRecord[],
  referenceTime: string,
): Chapter20RemediationPlan {
  const targets: Chapter20RemediationTarget[] = []
  const compliance = evaluateChapter20ComplianceIntervention(evidence)
  const recentCompliance = recentComplianceMissConcepts(evidence)

  for (const conceptFamilyId of CHAPTER20_CONCEPT_FAMILY_IDS) {
    const conceptEvidence = evidence.filter(
      (record) => record.conceptFamilyId === conceptFamilyId,
    )
    if (conceptEvidence.length === 0) continue

    const mastery = calculateChapter20ConceptMastery(
      conceptEvidence,
      referenceTime,
    )
    const ordinaryGap =
      (mastery.observationCount >=
        CHAPTER20_REMEDIATION_RULES.minimumEvidenceForMasteryTarget &&
        mastery.mastery <=
          CHAPTER20_REMEDIATION_RULES.ordinaryTargetMasteryAtOrBelow) ||
      mastery.initialMissCount >=
        CHAPTER20_REMEDIATION_RULES.ordinaryMinInitialMisses

    const elevatedComplianceGap =
      compliance.level === 'elevated' &&
      recentCompliance.has(conceptFamilyId)
    const reviewComplianceGap =
      compliance.level === 'review' &&
      compliance.conceptFamilyId === conceptFamilyId

    if (!ordinaryGap && !elevatedComplianceGap && !reviewComplianceGap) {
      continue
    }

    const concept = getChapter20ConceptFamily(conceptFamilyId)
    targets.push({
      conceptFamilyId,
      conceptName: concept.name,
      mastery: mastery.mastery,
      confidence: mastery.confidence,
      observationCount: mastery.observationCount,
      sourceTypeCount: mastery.sourceTypeCount,
      initialMissCount: mastery.initialMissCount,
      remediationContentBlockIds:
        getChapter20RemediationContentBlocksForConcept(conceptFamilyId),
      remediationFlashcardIds:
        getChapter20FlashcardsForConcept(conceptFamilyId),
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
        ? 'Multiple distinct Chapter 20 compliance misses require elevated targeted review.'
        : reviewComplianceGap
          ? 'A tagged Chapter 20 compliance miss requires targeted review.'
          : mastery.initialMissCount >=
                CHAPTER20_REMEDIATION_RULES.ordinaryMinInitialMisses
            ? 'Multiple preserved initial misses indicate a concept gap.'
            : 'Combined evidence mastery is at or below the Chapter 20 remediation threshold.',
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

export function buildChapter20RemediationPathForConcept(
  conceptFamilyId: Chapter20ConceptFamilyId,
) {
  return {
    conceptFamilyId,
    contentBlockIds:
      getChapter20RemediationContentBlocksForConcept(conceptFamilyId),
    flashcardIds: getChapter20FlashcardsForConcept(conceptFamilyId),
    plannedReassessmentQuestionCount: 5 as const,
    plannedReassessmentPassPercent: 80 as const,
  }
}


export interface Chapter20ReassessmentCycle {
  cycleId: string
  conceptFamilyId: Chapter20ConceptFamilyId
  questionIds: readonly string[]
  correctCount: number
  questionCount: 5
  percent: number
  passPercent: 80
  passed: boolean
}

export function selectChapter20ReassessmentQuestions(
  conceptFamilyId: Chapter20ConceptFamilyId,
  reserve: readonly Pick<Chapter20ReassessmentQuestion, 'id' | 'conceptFamilyId'>[],
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
      'Chapter 20 reassessment reserve for ' +
        conceptFamilyId +
        ' requires at least ' +
        count +
        ' fresh non-excluded questions.',
    )
  }
  return ids.slice(0, count)
}

export function scoreChapter20ReassessmentCycle(args: {
  cycleId: string
  conceptFamilyId: Chapter20ConceptFamilyId
  selectedQuestionIds: readonly string[]
  responses: readonly { questionId: string; correct: boolean }[]
}): Chapter20ReassessmentCycle {
  const selected = [...args.selectedQuestionIds]
  if (selected.length !== 5 || new Set(selected).size !== 5) {
    throw new Error(
      'Chapter 20 formal reassessment cycles require exactly five unique questions.',
    )
  }

  const responseMap = new Map(
    args.responses.map((response) => [response.questionId, response.correct]),
  )
  if (responseMap.size !== 5 || selected.some((id) => !responseMap.has(id))) {
    throw new Error(
      'Chapter 20 formal reassessment scoring requires one response for each selected question.',
    )
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
    passPercent: 80,
    passed: percent >= 80,
  }
}

export function buildChapter20ReassessmentEvidence(args: {
  studentId: string
  conceptFamilyId: Chapter20ConceptFamilyId
  selectedQuestions: readonly Chapter20ReassessmentQuestion[]
  responses: readonly { questionId: string; correct: boolean }[]
  timestamp: string
}): Chapter20EvidenceRecord[] {
  if (
    args.selectedQuestions.length !== 5 ||
    new Set(args.selectedQuestions.map((question) => question.id)).size !== 5
  ) {
    throw new Error(
      'Chapter 20 reassessment evidence requires exactly five unique selected questions.',
    )
  }
  if (
    args.selectedQuestions.some(
      (question) => question.conceptFamilyId !== args.conceptFamilyId,
    )
  ) {
    throw new Error(
      'Chapter 20 reassessment questions must all match the target concept family.',
    )
  }

  const responseMap = new Map(
    args.responses.map((response) => [response.questionId, response.correct]),
  )
  if (
    responseMap.size !== 5 ||
    args.selectedQuestions.some((question) => !responseMap.has(question.id))
  ) {
    throw new Error(
      'Chapter 20 reassessment evidence requires one response for each selected question.',
    )
  }

  return args.selectedQuestions.map((question) => ({
    studentId: args.studentId,
    chapterId: 'ch-20',
    conceptFamilyId: args.conceptFamilyId,
    source: 'remediation_reassessment',
    itemId: question.id,
    difficulty: question.difficulty,
    correct: responseMap.get(question.id) === true,
    attemptPhase: 'reassessment',
    timestamp: args.timestamp,
  }))
}

export function appendChapter20ReassessmentEvidence(
  originalEvidence: readonly Chapter20EvidenceRecord[],
  reassessmentEvidence: readonly Chapter20EvidenceRecord[],
): Chapter20EvidenceRecord[] {
  if (
    reassessmentEvidence.some(
      (record) =>
        record.chapterId !== 'ch-20' ||
        record.source !== 'remediation_reassessment' ||
        record.attemptPhase !== 'reassessment',
    )
  ) {
    throw new Error(
      'Reassessment evidence must use Chapter 20 remediation_reassessment / reassessment semantics.',
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

export function calculateChapter20RecoveredMastery(
  originalEvidence: readonly Chapter20EvidenceRecord[],
  reassessmentEvidence: readonly Chapter20EvidenceRecord[],
  conceptFamilyId: Chapter20ConceptFamilyId,
  referenceTime: string,
) {
  const before = calculateChapter20ConceptMastery(
    originalEvidence.filter(
      (record) => record.conceptFamilyId === conceptFamilyId,
    ),
    referenceTime,
  )
  const combined = appendChapter20ReassessmentEvidence(
    originalEvidence,
    reassessmentEvidence,
  )
  const after = calculateChapter20ConceptMastery(
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
