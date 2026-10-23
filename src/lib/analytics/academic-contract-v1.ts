/**
 * QUIZ-MICRO-ANALYTICS-2
 * Versioned, pure academic evidence contract. No database writes.
 *
 * A score is measured accuracy, never a completion percentage. Null means
 * unassessed. Completion, pass and recovery remain separate concepts.
 */
export const ACADEMIC_SCORING_VERSION = 'academic-v1' as const

export type AssessmentSource = 'chapter_quiz' | 'micro_check'
export interface AnswerEvidence {
  attemptId: string
  questionId: string
  conceptId: string
  source: AssessmentSource
  correct: boolean
  answeredAt: string
}
export interface AcademicScore {
  correct: number
  answered: number
  incorrect: number
  percent: number | null
}
export interface ConceptScore extends AcademicScore {
  conceptId: string
  quiz: AcademicScore
  micro: AcademicScore
  evidenceStatus: 'unassessed' | 'limited' | 'supported'
}
export interface AcademicSnapshot {
  version: typeof ACADEMIC_SCORING_VERSION
  quiz: AcademicScore
  micro: AcademicScore
  combinedAccuracy: AcademicScore
  concepts: ConceptScore[]
  // Completion is not academic accuracy; requires independent course progress.
  completed: boolean
  passed: boolean | null
  passThreshold: number
}

/** Exact count-based scoring. Rounding is display-only, after aggregation. */
export function scoreEvidence(rows: readonly Pick<AnswerEvidence, 'correct'>[]): AcademicScore {
  const answered = rows.length
  const correct = rows.reduce((n, row) => n + Number(row.correct === true), 0)
  return {
    correct,
    answered,
    incorrect: answered - correct,
    percent: answered === 0 ? null : Math.round((correct / answered) * 10000) / 100,
  }
}

function validThreshold(value: number): void {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error('Passing threshold must be between 0 and 100')
  }
}

function validatedEvidence(rows: readonly AnswerEvidence[]): void {
  const seen = new Set<string>()
  for (const row of rows) {
    if (!row.attemptId || !row.questionId || !row.conceptId ||
      !['chapter_quiz','micro_check'].includes(row.source) ||
      typeof row.correct !== 'boolean' ||
      !Number.isFinite(Date.parse(row.answeredAt))) {
      throw new Error('Invalid academic evidence')
    }
    // One scored answer per question per attempt/source.
    const key = [row.attemptId, row.source, row.questionId].join(':')
    if (seen.has(key)) throw new Error('Duplicate answer within attempt')
    seen.add(key)
  }
}

/**
 * Caller supplies explicitly selected canonical attempts (e.g. latest quiz);
 * never mix retries without an explicit, published selection policy.
 * Micro checks should be unique persisted first-attempt question evidence.
 */
export function buildAcademicSnapshot(input: {
  evidence: readonly AnswerEvidence[]
  passThreshold: number
  completed: boolean
  minimumConceptEvidence?: number
}): AcademicSnapshot {
  validThreshold(input.passThreshold)
  validatedEvidence(input.evidence)
  const minimum = input.minimumConceptEvidence ?? 3
  if (!Number.isInteger(minimum) || minimum < 1) throw new Error('Invalid minimum evidence')
  const quizRows = input.evidence.filter(r => r.source === 'chapter_quiz')
  const microRows = input.evidence.filter(r => r.source === 'micro_check')
  const quiz = scoreEvidence(quizRows)
  const micro = scoreEvidence(microRows)
  const grouped = new Map<string, AnswerEvidence[]>()
  for (const row of input.evidence) {
    const group = grouped.get(row.conceptId) ?? []
    group.push(row)
    grouped.set(row.conceptId, group)
  }
  const concepts = [...grouped].map(([conceptId, rows]) => {
    const combined = scoreEvidence(rows)
    return {
      conceptId,
      ...combined,
      quiz: scoreEvidence(rows.filter(r => r.source === 'chapter_quiz')),
      micro: scoreEvidence(rows.filter(r => r.source === 'micro_check')),
      evidenceStatus: rows.length >= minimum ? 'supported' as const : 'limited' as const,
    }
  }).sort((a,b)=>a.conceptId.localeCompare(b.conceptId))
  return {
    version: ACADEMIC_SCORING_VERSION,
    quiz,
    micro,
    combinedAccuracy: scoreEvidence(input.evidence),
    concepts,
    completed: input.completed,
    // Compare exact counts: rounding must never falsely pass a borderline score.
    passed: quiz.answered === 0 ? null :
      quiz.correct * 100 >= input.passThreshold * quiz.answered,
    passThreshold: input.passThreshold,
  }
}
