import type { Chapter8ConceptFamilyId } from './types'

export type Chapter8EvidenceSource =
  | 'micro_check'
  | 'flashcard'
  | 'chapter_assessment'
  | 'scenario_application'
  | 'remediation_reassessment'

export type Chapter8Difficulty =
  | 'recall'
  | 'understanding'
  | 'application'
  | 'scenario'

export type Chapter8AttemptPhase = 'initial' | 'remediation' | 'reassessment'

export type Chapter8Confidence =
  | 'insufficient_evidence'
  | 'emerging'
  | 'developing'
  | 'proficient'
  | 'strong'

export interface Chapter8EvidenceRecord {
  studentId: string
  chapterId: 'ch-8'
  conceptFamilyId: Chapter8ConceptFamilyId
  source: Chapter8EvidenceSource
  itemId: string
  difficulty: Chapter8Difficulty
  correct: boolean
  attemptPhase: Chapter8AttemptPhase
  timestamp: string
}

export interface Chapter8GradeInput {
  microCheckPercent?: number | null
  flashcardPercent?: number | null
  chapterAssessmentPercent?: number | null
  scenarioApplicationPercent?: number | null
  remediationReassessmentPercent?: number | null
}

export interface Chapter8GradeResult {
  baseGrade: number
  finalGrade: number
  recoveryApplied: boolean
  componentWeights: {
    micro_check: number
    flashcard: number
    chapter_assessment: number
    scenario_application: number
    remediation_reassessment: number
  }
}

export interface Chapter8ConceptMasteryResult {
  mastery: number
  confidence: Chapter8Confidence
  observationCount: number
  uniqueItemCount: number
  sourceTypeCount: number
  initialMissCount: number
  reassessmentCorrectCount: number
  weightedCorrect: number
  weightedTotal: number
}

export const CHAPTER8_GRADE_WEIGHTS = {
  micro_check: 0.20,
  flashcard: 0.10,
  chapter_assessment: 0.40,
  scenario_application: 0.15,
  remediation_reassessment: 0.15,
} as const

const DIFFICULTY_WEIGHT: Record<Chapter8Difficulty, number> = {
  recall: 0.75,
  understanding: 1,
  application: 1.25,
  scenario: 1.5,
}

const SOURCE_MASTERY_WEIGHT: Record<Chapter8EvidenceSource, number> = {
  micro_check: 1,
  flashcard: 0.6,
  chapter_assessment: 1.4,
  scenario_application: 1.5,
  remediation_reassessment: 1.25,
}

const PHASE_WEIGHT: Record<Chapter8AttemptPhase, number> = {
  initial: 1,
  remediation: 0.75,
  reassessment: 1.1,
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, value))
}

function round(value: number): number {
  return Math.round(value * 100) / 100
}

export function calculateChapter8Grade(input: Chapter8GradeInput): Chapter8GradeResult {
  const ordinary: Array<[number | null | undefined, number]> = [
    [input.microCheckPercent, CHAPTER8_GRADE_WEIGHTS.micro_check],
    [input.flashcardPercent, CHAPTER8_GRADE_WEIGHTS.flashcard],
    [input.chapterAssessmentPercent, CHAPTER8_GRADE_WEIGHTS.chapter_assessment],
    [input.scenarioApplicationPercent, CHAPTER8_GRADE_WEIGHTS.scenario_application],
  ]

  let weighted = 0
  let availableWeight = 0

  for (const [value, weight] of ordinary) {
    if (value == null) continue
    weighted += clampPercent(value) * weight
    availableWeight += weight
  }

  const baseGrade = availableWeight > 0 ? weighted / availableWeight : 0
  const recovery = input.remediationReassessmentPercent

  if (recovery == null) {
    return {
      baseGrade: round(baseGrade),
      finalGrade: round(baseGrade),
      recoveryApplied: false,
      componentWeights: CHAPTER8_GRADE_WEIGHTS,
    }
  }

  const recoveryBlend =
    baseGrade * (1 - CHAPTER8_GRADE_WEIGHTS.remediation_reassessment) +
    clampPercent(recovery) * CHAPTER8_GRADE_WEIGHTS.remediation_reassessment

  return {
    baseGrade: round(baseGrade),
    finalGrade: round(Math.max(baseGrade, recoveryBlend)),
    recoveryApplied: recoveryBlend > baseGrade,
    componentWeights: CHAPTER8_GRADE_WEIGHTS,
  }
}

function recencyWeight(timestamp: string, referenceTime: string): number {
  const evidenceTime = new Date(timestamp).getTime()
  const now = new Date(referenceTime).getTime()
  if (!Number.isFinite(evidenceTime) || !Number.isFinite(now)) return 1
  const ageDays = Math.max(0, (now - evidenceTime) / 86_400_000)
  if (ageDays <= 14) return 1
  if (ageDays <= 45) return 0.9
  if (ageDays <= 90) return 0.8
  return 0.7
}

function confidenceFromEvidence(
  records: readonly Chapter8EvidenceRecord[],
  mastery: number,
  weightedCorrect: number,
  weightedTotal: number,
): Chapter8Confidence {
  const uniqueItems = new Set(records.map((record) => record.itemId)).size
  const sourceTypes = new Set(records.map((record) => record.source)).size
  const hardObservations = records.filter(
    (record) => record.difficulty === 'application' || record.difficulty === 'scenario',
  ).length

  if (records.length < 3 || uniqueItems < 3 || sourceTypes < 2) {
    return 'insufficient_evidence'
  }

  const accuracy = weightedTotal > 0 ? weightedCorrect / weightedTotal : 0
  const correctCount = records.filter((record) => record.correct).length
  const wrongCount = records.length - correctCount
  const consistency = Math.max(correctCount, wrongCount) / records.length

  if (records.length >= 8 && uniqueItems >= 6 && sourceTypes >= 3 && hardObservations >= 2 && consistency >= 0.75) {
    return 'strong'
  }
  if (records.length >= 6 && uniqueItems >= 5 && sourceTypes >= 3 && hardObservations >= 1 && mastery >= 70) {
    return 'proficient'
  }
  if (records.length >= 5 && uniqueItems >= 4 && sourceTypes >= 2 && accuracy >= 0.55) {
    return 'developing'
  }
  return 'emerging'
}

export function calculateChapter8ConceptMastery(
  records: readonly Chapter8EvidenceRecord[],
  referenceTime: string,
): Chapter8ConceptMasteryResult {
  let weightedCorrect = 0
  let weightedTotal = 0

  for (const record of records) {
    const weight =
      DIFFICULTY_WEIGHT[record.difficulty] *
      SOURCE_MASTERY_WEIGHT[record.source] *
      PHASE_WEIGHT[record.attemptPhase] *
      recencyWeight(record.timestamp, referenceTime)

    weightedTotal += weight
    if (record.correct) weightedCorrect += weight
  }

  const mastery = weightedTotal > 0 ? (weightedCorrect / weightedTotal) * 100 : 0
  const confidence = confidenceFromEvidence(records, mastery, weightedCorrect, weightedTotal)

  return {
    mastery: round(mastery),
    confidence,
    observationCount: records.length,
    uniqueItemCount: new Set(records.map((record) => record.itemId)).size,
    sourceTypeCount: new Set(records.map((record) => record.source)).size,
    initialMissCount: records.filter((record) => record.attemptPhase === 'initial' && !record.correct).length,
    reassessmentCorrectCount: records.filter(
      (record) => record.attemptPhase === 'reassessment' && record.correct,
    ).length,
    weightedCorrect: round(weightedCorrect),
    weightedTotal: round(weightedTotal),
  }
}
