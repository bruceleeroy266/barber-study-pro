import {
  calculateChapter19ConceptMastery,
  type Chapter19EvidenceRecord,
} from './grading'
import {
  CHAPTER19_CONCEPT_FAMILY_IDS,
  getChapter19ConceptFamily,
} from './concepts'
import {
  getChapter19FlashcardsForConcept,
  getChapter19RemediationContentBlocksForConcept,
} from './mappings'
import {
  CHAPTER19_COMPLIANCE_RULES,
  CHAPTER19_SAFETY_RULES,
  evaluateChapter19ComplianceIntervention,
  evaluateChapter19SafetyIntervention,
  getChapter19ComplianceTag,
  getChapter19SafetyTag,
  type Chapter19ComplianceInterventionLevel,
  type Chapter19SafetyInterventionLevel,
} from './escalation'
import type { Chapter19ConceptFamilyId } from './types'
import type { Chapter19ReassessmentQuestion } from './reassessment-reserve'

export type Chapter19RemediationPriority =
  | 'standard'
  | 'compliance'
  | 'priority'
  | 'urgent'

export interface Chapter19RemediationTarget {
  conceptFamilyId: Chapter19ConceptFamilyId
  conceptName: string
  mastery: number
  confidence: ReturnType<typeof calculateChapter19ConceptMastery>['confidence']
  observationCount: number
  sourceTypeCount: number
  initialMissCount: number
  remediationContentBlockIds: readonly string[]
  remediationFlashcardIds: readonly string[]
  priority: Chapter19RemediationPriority
  requiresFormalReassessment: boolean
  plannedReassessmentQuestionCount: 5
  plannedReassessmentPassPercent: 80 | 100
  safetyEscalation: Chapter19SafetyInterventionLevel | null
  complianceEscalation: Chapter19ComplianceInterventionLevel | null
  reason: string
}

export interface Chapter19RemediationPlan {
  targets: Chapter19RemediationTarget[]
  preservedEvidence: readonly Chapter19EvidenceRecord[]
}

export const CHAPTER19_REMEDIATION_RULES = {
  ordinaryTargetMasteryAtOrBelow: 70,
  ordinaryMinInitialMisses: 2,
  minimumEvidenceForMasteryTarget: 2,
  ordinaryReassessmentQuestionCount: 5,
  ordinaryReassessmentPassPercent: 80,
  urgentSafetyReassessmentQuestionCount: 5,
  urgentSafetyReassessmentPassPercent: 100,
  complianceReassessmentQuestionCount: 5,
  complianceReassessmentPassPercent: 80,
} as const

export function combineChapter19Evidence(
  ...sources: ReadonlyArray<readonly Chapter19EvidenceRecord[]>
): Chapter19EvidenceRecord[] {
  const combined: Chapter19EvidenceRecord[] = []
  const keys = new Set<string>()

  for (const records of sources) {
    for (const record of records) {
      if (record.chapterId !== 'ch-19') continue
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

function recentTaggedMissConcepts(
  evidence: readonly Chapter19EvidenceRecord[],
  kind: 'safety' | 'compliance',
): Set<Chapter19ConceptFamilyId> {
  const window =
    kind === 'safety'
      ? CHAPTER19_SAFETY_RULES.recentWindow
      : CHAPTER19_COMPLIANCE_RULES.recentWindow

  const tagged = evidence
    .filter((record) =>
      kind === 'safety'
        ? getChapter19SafetyTag(record.itemId) !== null
        : getChapter19ComplianceTag(record.itemId) !== null,
    )
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
    .slice(-window)

  return new Set(
    tagged
      .filter((record) => !record.correct)
      .map((record) => record.conceptFamilyId),
  )
}

export function buildChapter19TargetedRemediationPlan(
  evidence: readonly Chapter19EvidenceRecord[],
  referenceTime: string,
): Chapter19RemediationPlan {
  const targets: Chapter19RemediationTarget[] = []
  const safety = evaluateChapter19SafetyIntervention(evidence)
  const compliance = evaluateChapter19ComplianceIntervention(evidence)
  const recentSafetyMissConcepts = recentTaggedMissConcepts(evidence, 'safety')
  const recentComplianceMissConcepts = recentTaggedMissConcepts(
    evidence,
    'compliance',
  )

  for (const conceptFamilyId of CHAPTER19_CONCEPT_FAMILY_IDS) {
    const conceptEvidence = evidence.filter(
      (record) => record.conceptFamilyId === conceptFamilyId,
    )
    if (conceptEvidence.length === 0) continue

    const mastery = calculateChapter19ConceptMastery(
      conceptEvidence,
      referenceTime,
    )

    const ordinaryGap =
      (mastery.observationCount >=
        CHAPTER19_REMEDIATION_RULES.minimumEvidenceForMasteryTarget &&
        mastery.mastery <=
          CHAPTER19_REMEDIATION_RULES.ordinaryTargetMasteryAtOrBelow) ||
      mastery.initialMissCount >=
        CHAPTER19_REMEDIATION_RULES.ordinaryMinInitialMisses

    const urgentSafetyGap =
      safety.level === 'urgent' &&
      recentSafetyMissConcepts.has(conceptFamilyId)

    const prioritySafetyGap =
      safety.level === 'review' &&
      safety.conceptFamilyId === conceptFamilyId

    const elevatedComplianceGap =
      compliance.level === 'elevated' &&
      recentComplianceMissConcepts.has(conceptFamilyId)

    const reviewComplianceGap =
      compliance.level === 'review' &&
      compliance.conceptFamilyId === conceptFamilyId

    if (
      !ordinaryGap &&
      !urgentSafetyGap &&
      !prioritySafetyGap &&
      !elevatedComplianceGap &&
      !reviewComplianceGap
    ) {
      continue
    }

    const concept = getChapter19ConceptFamily(conceptFamilyId)

    const priority: Chapter19RemediationPriority = urgentSafetyGap
      ? 'urgent'
      : prioritySafetyGap
        ? 'priority'
        : elevatedComplianceGap || reviewComplianceGap
          ? 'compliance'
          : 'standard'

    const requiresFormalReassessment =
      urgentSafetyGap || elevatedComplianceGap || ordinaryGap

    const plannedReassessmentPassPercent: 80 | 100 = urgentSafetyGap
      ? 100
      : 80

    targets.push({
      conceptFamilyId,
      conceptName: concept.name,
      mastery: mastery.mastery,
      confidence: mastery.confidence,
      observationCount: mastery.observationCount,
      sourceTypeCount: mastery.sourceTypeCount,
      initialMissCount: mastery.initialMissCount,
      remediationContentBlockIds:
        getChapter19RemediationContentBlocksForConcept(conceptFamilyId),
      remediationFlashcardIds:
        getChapter19FlashcardsForConcept(conceptFamilyId),
      priority,
      requiresFormalReassessment,
      plannedReassessmentQuestionCount: 5,
      plannedReassessmentPassPercent,
      safetyEscalation:
        urgentSafetyGap
          ? 'urgent'
          : prioritySafetyGap
            ? 'review'
            : null,
      complianceEscalation:
        elevatedComplianceGap
          ? 'elevated'
          : reviewComplianceGap
            ? 'review'
            : null,
      reason: urgentSafetyGap
        ? 'Multiple distinct practical-safety misses require urgent safety remediation.'
        : prioritySafetyGap
          ? 'A tagged practical-safety miss requires immediate targeted safety review.'
          : elevatedComplianceGap
            ? 'Multiple distinct licensing or employment-law misses require elevated compliance review.'
            : reviewComplianceGap
              ? 'A tagged licensing or employment-law miss requires targeted compliance review.'
              : mastery.initialMissCount >=
                    CHAPTER19_REMEDIATION_RULES.ordinaryMinInitialMisses
                ? 'Multiple preserved initial misses indicate a concept gap.'
                : 'Combined evidence mastery is at or below the Chapter 19 remediation threshold.',
    })
  }

  const priorityRank: Record<Chapter19RemediationPriority, number> = {
    urgent: 0,
    priority: 1,
    compliance: 2,
    standard: 3,
  }

  targets.sort(
    (a, b) =>
      priorityRank[a.priority] - priorityRank[b.priority] ||
      a.mastery - b.mastery,
  )

  return {
    targets,
    preservedEvidence: evidence,
  }
}

export function buildChapter19RemediationPathForConcept(
  conceptFamilyId: Chapter19ConceptFamilyId,
): {
  conceptFamilyId: Chapter19ConceptFamilyId
  contentBlockIds: readonly string[]
  flashcardIds: readonly string[]
  plannedReassessmentQuestionCount: 5
  plannedReassessmentPassPercent: 80
} {
  return {
    conceptFamilyId,
    contentBlockIds:
      getChapter19RemediationContentBlocksForConcept(conceptFamilyId),
    flashcardIds: getChapter19FlashcardsForConcept(conceptFamilyId),
    plannedReassessmentQuestionCount:
      CHAPTER19_REMEDIATION_RULES.ordinaryReassessmentQuestionCount,
    plannedReassessmentPassPercent:
      CHAPTER19_REMEDIATION_RULES.ordinaryReassessmentPassPercent,
  }
}

export function containsLegacyChapter19RemediationId(value: string): boolean {
  return /CH19-R-(?:qq-19-|LO[123])/i.test(value)
}


export interface Chapter19ReassessmentCycle {
  cycleId: string
  conceptFamilyId: Chapter19ConceptFamilyId
  questionIds: readonly string[]
  correctCount: number
  questionCount: 5
  percent: number
  passPercent: 80 | 100
  passed: boolean
}

export function selectChapter19ReassessmentQuestions(
  conceptFamilyId: Chapter19ConceptFamilyId,
  reserve: readonly Pick<Chapter19ReassessmentQuestion, 'id' | 'conceptFamilyId'>[],
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
      'Chapter 19 reassessment reserve for ' +
        conceptFamilyId +
        ' requires at least ' +
        count +
        ' fresh non-excluded questions.',
    )
  }

  return ids.slice(0, count)
}

export function scoreChapter19ReassessmentCycle(args: {
  cycleId: string
  conceptFamilyId: Chapter19ConceptFamilyId
  selectedQuestionIds: readonly string[]
  responses: readonly { questionId: string; correct: boolean }[]
  passPercent: 80 | 100
}): Chapter19ReassessmentCycle {
  const selected = [...args.selectedQuestionIds]
  if (selected.length !== 5 || new Set(selected).size !== 5) {
    throw new Error(
      'Chapter 19 formal reassessment cycles require exactly five unique questions.',
    )
  }

  const responseMap = new Map(
    args.responses.map((response) => [response.questionId, response.correct]),
  )
  if (
    responseMap.size !== 5 ||
    selected.some((id) => !responseMap.has(id))
  ) {
    throw new Error(
      'Chapter 19 formal reassessment scoring requires one response for each selected question.',
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
    passPercent: args.passPercent,
    passed: percent >= args.passPercent,
  }
}

export function buildChapter19ReassessmentEvidence(args: {
  studentId: string
  conceptFamilyId: Chapter19ConceptFamilyId
  selectedQuestions: readonly Chapter19ReassessmentQuestion[]
  responses: readonly { questionId: string; correct: boolean }[]
  timestamp: string
}): Chapter19EvidenceRecord[] {
  if (
    args.selectedQuestions.length !== 5 ||
    new Set(args.selectedQuestions.map((question) => question.id)).size !== 5
  ) {
    throw new Error(
      'Chapter 19 reassessment evidence requires exactly five unique selected questions.',
    )
  }

  if (
    args.selectedQuestions.some(
      (question) => question.conceptFamilyId !== args.conceptFamilyId,
    )
  ) {
    throw new Error(
      'Chapter 19 reassessment questions must all match the target concept family.',
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
      'Chapter 19 reassessment evidence requires one response for each selected question.',
    )
  }

  return args.selectedQuestions.map((question) => ({
    studentId: args.studentId,
    chapterId: 'ch-19',
    conceptFamilyId: args.conceptFamilyId,
    source: 'remediation_reassessment',
    itemId: question.id,
    difficulty: question.difficulty,
    correct: responseMap.get(question.id) === true,
    attemptPhase: 'reassessment',
    timestamp: args.timestamp,
  }))
}

export function appendChapter19ReassessmentEvidence(
  originalEvidence: readonly Chapter19EvidenceRecord[],
  reassessmentEvidence: readonly Chapter19EvidenceRecord[],
): Chapter19EvidenceRecord[] {
  if (
    reassessmentEvidence.some(
      (record) =>
        record.chapterId !== 'ch-19' ||
        record.source !== 'remediation_reassessment' ||
        record.attemptPhase !== 'reassessment',
    )
  ) {
    throw new Error(
      'Reassessment evidence must use Chapter 19 remediation_reassessment / reassessment semantics.',
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

export function calculateChapter19RecoveredMastery(
  originalEvidence: readonly Chapter19EvidenceRecord[],
  reassessmentEvidence: readonly Chapter19EvidenceRecord[],
  conceptFamilyId: Chapter19ConceptFamilyId,
  referenceTime: string,
) {
  const before = calculateChapter19ConceptMastery(
    originalEvidence.filter(
      (record) => record.conceptFamilyId === conceptFamilyId,
    ),
    referenceTime,
  )
  const combined = appendChapter19ReassessmentEvidence(
    originalEvidence,
    reassessmentEvidence,
  )
  const after = calculateChapter19ConceptMastery(
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
