/**
 * Shared Concept-Level Learning-Gap Detection Engine
 *
 * C3-2 Slice 1: chapter-independent extraction of the Phase 6B-3 detection
 * algorithm (formerly src/lib/chapter-2-concepts/detection.ts).
 *
 * The engine receives its concepts, question→concept mappings, and
 * correct-answer data through an explicit ConceptDetectionInput. It imports
 * no chapter assets. Chapter bindings (chapter-2-concepts/detection.ts,
 * chapter-3-concepts/detection.ts) supply the canonical data.
 *
 * Detection thresholds and state semantics are preserved EXACTLY from the
 * established Phase 6B-3 engine. Do not tune thresholds here — that would
 * change Chapter 2 production behavior.
 *
 * Scope: Detection only. No remediation routing, no reassessment,
 * no mastery policy, no instructor UI, no student-facing labels.
 */

import type { QuizAttempt } from '@/types'

// ───────────────────────────────────────────────
// Detection Types
// ───────────────────────────────────────────────

export type DetectionState =
  | 'insufficient_evidence'
  | 'emerging_weakness'
  | 'repeated_weakness'
  | 'improving'
  | 'currently_performing_well'

export type DetectionConfidence = 'low' | 'medium' | 'high'

export type ResponsePattern =
  | 'consistent'
  | 'alternating'
  | 'trending_up'
  | 'trending_down'
  | 'mixed'

export type DetectionFlag =
  | 'single_question_concept'
  | 'low_unique_question_diversity'
  | 'alternating_pattern'
  | 'question_specific_issue'
  | 'recent_improvement'
  | 'recent_deterioration'

export interface ConceptEvidence<
  CId extends string = string,
  LOId extends string = string,
> {
  conceptId: CId
  learningObjectiveId: LOId
  totalObservations: number
  uniqueQuestions: number
  uniqueQuestionsMissed: number
  misses: number
  correct: number
  missRate: number
  consecutiveRecentCorrect: number
  consecutiveRecentMisses: number
  pattern: ResponsePattern
  hasHistoricalWeakness: boolean
  firstAttemptAt: string | null
  lastAttemptAt: string | null
}

export interface ConceptDetectionResult<
  CId extends string = string,
  LOId extends string = string,
> {
  conceptId: CId
  learningObjectiveId: LOId
  state: DetectionState
  confidence: DetectionConfidence
  evidence: ConceptEvidence<CId, LOId>
  flags: DetectionFlag[]
  lastUpdated: string
}

export interface LearningObjectiveDetectionResult<
  CId extends string = string,
  LOId extends string = string,
> {
  learningObjectiveId: LOId
  state: DetectionState
  confidence: DetectionConfidence
  conceptResults: ConceptDetectionResult<CId, LOId>[]
  lastUpdated: string
}

// ───────────────────────────────────────────────
// Chapter Input Contract
// ───────────────────────────────────────────────

/** Minimal concept shape the engine needs. Chapter concepts extend this. */
export interface DetectionConcept<CId extends string, LOId extends string> {
  id: CId
  learningObjectiveId: LOId
  /** 'active' concepts are detected on; any other status is skipped. */
  status: string
}

/** Minimal question→concept mapping shape (questionId is a plain string). */
export interface DetectionQuestionMapping<CId extends string> {
  questionId: string
  conceptId: CId
}

/**
 * Explicit chapter data binding. Built once per chapter by its detection
 * binding module from that chapter's canonical assets.
 */
export interface ConceptDetectionInput<
  CId extends string,
  LOId extends string,
> {
  concepts: readonly DetectionConcept<CId, LOId>[]
  questionMappings: readonly DetectionQuestionMapping<CId>[]
  /** questionId → correct answer key ('a'|'b'|'c'|'d'). */
  correctAnswers: ReadonlyMap<string, string>
}

// ───────────────────────────────────────────────
// Internal Types
// ───────────────────────────────────────────────

interface QuestionResult {
  questionId: string
  isCorrect: boolean
  attemptId: string
  completedAt: string
}

interface ConceptQuestionStats {
  questionId: string
  attempts: number
  misses: number
  results: QuestionResult[]
}

// ───────────────────────────────────────────────
// Constants (established Phase 6B-3 thresholds — do not retune)
// ───────────────────────────────────────────────

const SINGLE_QUESTION_MIN_OBSERVATIONS = 4
const MULTI_QUESTION_MIN_OBSERVATIONS = 2
const REPEATED_WEAKNESS_MIN_OBSERVATIONS = 3
const HIGH_CONFIDENCE_MIN_OBSERVATIONS = 7
const MEDIUM_CONFIDENCE_MIN_OBSERVATIONS = 4
const IMPROVING_MIN_CONSECUTIVE_CORRECT = 2
const RECENT_ATTEMPTS_WINDOW = 3

// ───────────────────────────────────────────────
// Concept Metadata Helpers
// ───────────────────────────────────────────────

function getConceptQuestionCount<CId extends string>(
  conceptId: CId,
  questionMappings: readonly DetectionQuestionMapping<CId>[],
): number {
  return questionMappings.filter((m) => m.conceptId === conceptId).length
}

function getConceptLearningObjectiveId<
  CId extends string,
  LOId extends string,
>(conceptId: CId, concepts: readonly DetectionConcept<CId, LOId>[]): LOId {
  const concept = concepts.find((c) => c.id === conceptId)
  if (!concept) {
    throw new Error(`Concept ${conceptId} not found`)
  }
  return concept.learningObjectiveId
}

// ───────────────────────────────────────────────
// Evidence Building
// ───────────────────────────────────────────────

/**
 * Build concept-level evidence from quiz attempts.
 *
 * Uses quiz_attempts.answers_json as the authoritative historical source.
 * Does NOT use missed_questions.times_missed for historical reconstruction.
 */
export function buildConceptEvidence<
  CId extends string,
  LOId extends string,
>(
  conceptId: CId,
  quizAttempts: QuizAttempt[],
  input: ConceptDetectionInput<CId, LOId>,
): ConceptEvidence<CId, LOId> {
  const learningObjectiveId = getConceptLearningObjectiveId(
    conceptId,
    input.concepts,
  )
  const conceptQuestionIds = new Set(
    input.questionMappings
      .filter((m) => m.conceptId === conceptId)
      .map((m) => m.questionId),
  )

  // Sort attempts by completion date (oldest first)
  const sortedAttempts = [...quizAttempts].sort(
    (a, b) =>
      new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime(),
  )

  // Build question-level statistics
  const questionStats = new Map<string, ConceptQuestionStats>()
  const allResults: QuestionResult[] = []

  for (const attempt of sortedAttempts) {
    const answers = attempt.answers_json as Record<string, string>

    for (const [questionId, studentAnswer] of Object.entries(answers)) {
      if (!conceptQuestionIds.has(questionId)) {
        continue
      }

      const correctAnswer = input.correctAnswers.get(questionId)
      if (!correctAnswer) {
        continue
      }

      const isCorrect = studentAnswer === correctAnswer
      const result: QuestionResult = {
        questionId,
        isCorrect,
        attemptId: attempt.id,
        completedAt: attempt.completed_at,
      }

      allResults.push(result)

      const existing = questionStats.get(questionId) || {
        questionId,
        attempts: 0,
        misses: 0,
        results: [],
      }

      existing.attempts++
      if (!isCorrect) {
        existing.misses++
      }
      existing.results.push(result)
      questionStats.set(questionId, existing)
    }
  }

  // Calculate aggregate metrics
  const totalObservations = allResults.length
  const uniqueQuestions = questionStats.size
  const uniqueQuestionsMissed = Array.from(questionStats.values()).filter(
    (s) => s.misses > 0,
  ).length
  const misses = allResults.filter((r) => !r.isCorrect).length
  const correct = allResults.filter((r) => r.isCorrect).length
  const missRate = totalObservations > 0 ? misses / totalObservations : 0

  // Calculate consecutive recent correct/misses
  const recentResults = allResults.slice(-RECENT_ATTEMPTS_WINDOW)
  let consecutiveRecentCorrect = 0
  let consecutiveRecentMisses = 0

  // Count from most recent backwards
  for (let i = recentResults.length - 1; i >= 0; i--) {
    if (recentResults[i].isCorrect) {
      if (consecutiveRecentMisses > 0) break
      consecutiveRecentCorrect++
    } else {
      if (consecutiveRecentCorrect > 0) break
      consecutiveRecentMisses++
    }
  }

  // Determine pattern
  const pattern = determinePattern(allResults)

  // Check for historical weakness
  const hasHistoricalWeakness = misses > 0

  // Timestamps
  const firstAttemptAt =
    sortedAttempts.length > 0 ? sortedAttempts[0].completed_at : null
  const lastAttemptAt =
    sortedAttempts.length > 0
      ? sortedAttempts[sortedAttempts.length - 1].completed_at
      : null

  return {
    conceptId,
    learningObjectiveId,
    totalObservations,
    uniqueQuestions,
    uniqueQuestionsMissed,
    misses,
    correct,
    missRate,
    consecutiveRecentCorrect,
    consecutiveRecentMisses,
    pattern,
    hasHistoricalWeakness,
    firstAttemptAt,
    lastAttemptAt,
  }
}

function determinePattern(results: QuestionResult[]): ResponsePattern {
  if (results.length < 2) {
    return 'consistent'
  }

  const resultsSequence = results.map((r) => (r.isCorrect ? 'C' : 'M'))

  // Check for consistent
  const allCorrect = resultsSequence.every((r) => r === 'C')
  const allMissed = resultsSequence.every((r) => r === 'M')
  if (allCorrect || allMissed) {
    return 'consistent'
  }

  // Check for trending
  const firstHalf = resultsSequence.slice(0, Math.floor(resultsSequence.length / 2))
  const secondHalf = resultsSequence.slice(Math.floor(resultsSequence.length / 2))

  const firstHalfMissRate =
    firstHalf.filter((r) => r === 'M').length / firstHalf.length
  const secondHalfMissRate =
    secondHalf.filter((r) => r === 'M').length / secondHalf.length

  if (secondHalfMissRate < firstHalfMissRate - 0.3) {
    return 'trending_up'
  }
  if (secondHalfMissRate > firstHalfMissRate + 0.3) {
    return 'trending_down'
  }

  // Check for alternating
  let alternations = 0
  for (let i = 1; i < resultsSequence.length; i++) {
    if (resultsSequence[i] !== resultsSequence[i - 1]) {
      alternations++
    }
  }
  if (alternations >= resultsSequence.length - 1) {
    return 'alternating'
  }

  return 'mixed'
}

// ───────────────────────────────────────────────
// Detection Logic
// ───────────────────────────────────────────────

/**
 * Detect concept-level learning gap state and confidence.
 *
 * Implements the refined stress-tested thresholds from Phase 6B-3.
 */
export function detectConceptState<
  CId extends string,
  LOId extends string,
>(
  evidence: ConceptEvidence<CId, LOId>,
  input: ConceptDetectionInput<CId, LOId>,
): ConceptDetectionResult<CId, LOId> {
  const {
    conceptId,
    learningObjectiveId,
    totalObservations,
    uniqueQuestions,
    uniqueQuestionsMissed,
    misses,
    correct,
    missRate,
    consecutiveRecentCorrect,
    consecutiveRecentMisses,
    pattern,
    hasHistoricalWeakness,
    firstAttemptAt,
    lastAttemptAt,
  } = evidence

  const conceptQuestionCount = getConceptQuestionCount(
    conceptId,
    input.questionMappings,
  )
  const isSingleQuestionConcept = conceptQuestionCount === 1

  // Determine state
  const state = determineState(
    totalObservations,
    misses,
    correct,
    missRate,
    consecutiveRecentCorrect,
    consecutiveRecentMisses,
    isSingleQuestionConcept,
    hasHistoricalWeakness,
    pattern,
  )

  // Determine confidence
  const confidence = determineConfidence(
    totalObservations,
    uniqueQuestions,
    uniqueQuestionsMissed,
    misses,
    pattern,
    isSingleQuestionConcept,
  )

  // Determine flags
  const flags = determineFlags(
    isSingleQuestionConcept,
    uniqueQuestions,
    uniqueQuestionsMissed,
    misses,
    pattern,
    consecutiveRecentCorrect,
    consecutiveRecentMisses,
  )

  return {
    conceptId,
    learningObjectiveId,
    state,
    confidence,
    evidence,
    flags,
    lastUpdated: new Date().toISOString(),
  }
}

function determineState(
  totalObservations: number,
  misses: number,
  correct: number,
  missRate: number,
  consecutiveRecentCorrect: number,
  consecutiveRecentMisses: number,
  isSingleQuestionConcept: boolean,
  hasHistoricalWeakness: boolean,
  pattern: ResponsePattern,
): DetectionState {
  // Single-question concept protection
  if (
    isSingleQuestionConcept &&
    totalObservations < SINGLE_QUESTION_MIN_OBSERVATIONS
  ) {
    return 'insufficient_evidence'
  }

  // Multi-question concept minimum
  if (
    !isSingleQuestionConcept &&
    totalObservations < MULTI_QUESTION_MIN_OBSERVATIONS
  ) {
    return 'insufficient_evidence'
  }

  // Currently performing well: no misses OR (sustained correct with low recent miss rate)
  // Requires: consecutive correct >= 2 AND (miss rate <= 20% OR sustained correct >= 3)
  if (
    (misses === 0 ||
      (consecutiveRecentCorrect >= IMPROVING_MIN_CONSECUTIVE_CORRECT &&
        (missRate <= 0.2 || consecutiveRecentCorrect >= 3))) &&
    totalObservations >= MULTI_QUESTION_MIN_OBSERVATIONS
  ) {
    return 'currently_performing_well'
  }

  // Improving: consecutive correct following previous misses
  // Requires: consecutive correct >= 2 AND historical weakness AND minimum observations
  // AND NOT currently performing well (checked above)
  if (
    consecutiveRecentCorrect >= IMPROVING_MIN_CONSECUTIVE_CORRECT &&
    hasHistoricalWeakness &&
    totalObservations >= REPEATED_WEAKNESS_MIN_OBSERVATIONS
  ) {
    return 'improving'
  }

  // Repeated weakness: minimum observations AND (multiple misses OR high miss rate)
  // AND not currently improving (checked above)
  // AND not alternating pattern (alternating suggests guessing, not consistent weakness)
  // AND not a single correct response breaking up the miss pattern
  if (
    totalObservations >= REPEATED_WEAKNESS_MIN_OBSERVATIONS &&
    (misses >= 2 || missRate >= 0.5) &&
    pattern !== 'alternating'
  ) {
    // Additional check: if there's a recent correct response that breaks the miss pattern,
    // and the most recent attempt is a miss, this might be emerging rather than repeated
    // This handles the case: M, M, C, M — single correct breaks the pattern
    if (
      consecutiveRecentMisses === 1 &&
      correct >= 1 &&
      totalObservations <= 4
    ) {
      return 'emerging_weakness'
    }
    return 'repeated_weakness'
  }

  // Emerging weakness: some evidence of weakness but not meeting repeated criteria
  // OR alternating pattern (suggests inconsistent understanding)
  if (misses >= 1) {
    return 'emerging_weakness'
  }

  // Default: insufficient evidence
  return 'insufficient_evidence'
}

function determineConfidence(
  totalObservations: number,
  uniqueQuestions: number,
  uniqueQuestionsMissed: number,
  misses: number,
  pattern: ResponsePattern,
  isSingleQuestionConcept: boolean,
): DetectionConfidence {
  // High confidence requirements
  if (totalObservations >= HIGH_CONFIDENCE_MIN_OBSERVATIONS) {
    // Multi-question concepts need question diversity
    if (!isSingleQuestionConcept && uniqueQuestions < 3) {
      return 'medium'
    }
    // Alternating pattern reduces confidence
    if (pattern === 'alternating') {
      return 'medium'
    }
    return 'high'
  }

  // Medium confidence requirements
  if (totalObservations >= MEDIUM_CONFIDENCE_MIN_OBSERVATIONS) {
    // Multi-question concepts need some diversity
    if (!isSingleQuestionConcept && uniqueQuestions < 2) {
      return 'low'
    }
    // Alternating pattern reduces confidence
    if (pattern === 'alternating') {
      return 'low'
    }
    return 'medium'
  }

  // Low confidence for limited observations
  return 'low'
}

function determineFlags(
  isSingleQuestionConcept: boolean,
  uniqueQuestions: number,
  uniqueQuestionsMissed: number,
  misses: number,
  pattern: ResponsePattern,
  consecutiveRecentCorrect: number,
  consecutiveRecentMisses: number,
): DetectionFlag[] {
  const flags: DetectionFlag[] = []

  if (isSingleQuestionConcept) {
    flags.push('single_question_concept')
  }

  if (!isSingleQuestionConcept && uniqueQuestions < 2) {
    flags.push('low_unique_question_diversity')
  }

  if (pattern === 'alternating') {
    flags.push('alternating_pattern')
  }

  // Question-specific issue: many misses but only on one question
  if (
    !isSingleQuestionConcept &&
    uniqueQuestionsMissed === 1 &&
    misses >= 3
  ) {
    flags.push('question_specific_issue')
  }

  if (consecutiveRecentCorrect >= IMPROVING_MIN_CONSECUTIVE_CORRECT) {
    flags.push('recent_improvement')
  }

  if (consecutiveRecentMisses >= 2) {
    flags.push('recent_deterioration')
  }

  return flags
}

// ───────────────────────────────────────────────
// Batch Detection
// ───────────────────────────────────────────────

/**
 * Detect learning gaps for all active concepts in the chapter input.
 */
export function detectAllConceptGaps<
  CId extends string,
  LOId extends string,
>(
  quizAttempts: QuizAttempt[],
  input: ConceptDetectionInput<CId, LOId>,
): Map<CId, ConceptDetectionResult<CId, LOId>> {
  const results = new Map<CId, ConceptDetectionResult<CId, LOId>>()

  // Get all active concept IDs
  const activeConceptIds = input.concepts
    .filter((c) => c.status === 'active')
    .map((c) => c.id)

  for (const conceptId of activeConceptIds) {
    const evidence = buildConceptEvidence(conceptId, quizAttempts, input)
    const result = detectConceptState(evidence, input)
    results.set(conceptId, result)
  }

  return results
}

/**
 * Detect learning gaps for concepts with evidence only.
 */
export function detectConceptGapsWithEvidence<
  CId extends string,
  LOId extends string,
>(
  quizAttempts: QuizAttempt[],
  input: ConceptDetectionInput<CId, LOId>,
): Map<CId, ConceptDetectionResult<CId, LOId>> {
  const allResults = detectAllConceptGaps(quizAttempts, input)
  const withEvidence = new Map<CId, ConceptDetectionResult<CId, LOId>>()

  for (const [conceptId, result] of allResults) {
    if (result.evidence.totalObservations > 0) {
      withEvidence.set(conceptId, result)
    }
  }

  return withEvidence
}

// ───────────────────────────────────────────────
// Learning Objective Rollup
// ───────────────────────────────────────────────

/**
 * Roll up concept-level detection to learning objectives.
 */
export function rollupToLearningObjectives<
  CId extends string,
  LOId extends string,
>(
  conceptResults: Map<CId, ConceptDetectionResult<CId, LOId>>,
): Map<LOId, LearningObjectiveDetectionResult<CId, LOId>> {
  const loResults = new Map<LOId, LearningObjectiveDetectionResult<CId, LOId>>()

  // Group concepts by LO
  const conceptsByLO = new Map<LOId, ConceptDetectionResult<CId, LOId>[]>()
  for (const result of conceptResults.values()) {
    const loId = result.learningObjectiveId
    const existing = conceptsByLO.get(loId) || []
    existing.push(result)
    conceptsByLO.set(loId, existing)
  }

  // Determine LO state for each group
  for (const [loId, concepts] of conceptsByLO) {
    const state = determineLOState(concepts)
    const confidence = determineLOConfidence(concepts)

    loResults.set(loId, {
      learningObjectiveId: loId,
      state,
      confidence,
      conceptResults: concepts,
      lastUpdated: new Date().toISOString(),
    })
  }

  return loResults
}

function determineLOState<CId extends string, LOId extends string>(
  concepts: ConceptDetectionResult<CId, LOId>[],
): DetectionState {
  const states = concepts.map((c) => c.state)

  // Repeated weakness dominates
  if (states.includes('repeated_weakness')) {
    return 'repeated_weakness'
  }

  // Emerging weakness if any concept has it
  if (states.includes('emerging_weakness')) {
    return 'emerging_weakness'
  }

  // Improving if any concept is improving
  if (states.includes('improving')) {
    return 'improving'
  }

  // Currently performing well if all are
  if (states.every((s) => s === 'currently_performing_well')) {
    return 'currently_performing_well'
  }

  // Default to insufficient evidence
  return 'insufficient_evidence'
}

function determineLOConfidence<CId extends string, LOId extends string>(
  concepts: ConceptDetectionResult<CId, LOId>[],
): DetectionConfidence {
  const confidences = concepts.map((c) => c.confidence)

  // High confidence if all high
  if (confidences.every((c) => c === 'high')) {
    return 'high'
  }

  // Medium confidence if any medium or high
  if (confidences.some((c) => c === 'medium' || c === 'high')) {
    return 'medium'
  }

  // Default low
  return 'low'
}
