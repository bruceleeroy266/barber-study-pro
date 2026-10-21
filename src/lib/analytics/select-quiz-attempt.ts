/**
 * Deterministic quiz attempt selection for academic reporting.
 * Scoped and authorized rows must be fetched by caller; this module performs
 * no database access and cannot grant access to other schools.
 */
export interface SelectableQuizAttempt {
  id: string
  quiz_id: string
  completed_at: string
  score: number
  total_questions: number
  percentage: number
  is_reassessment?: boolean | null
}
export type AttemptSelection = {
  latest: SelectableQuizAttempt | null
  best: SelectableQuizAttempt | null
  first: SelectableQuizAttempt | null
  count: number
}
function assertValid(row: SelectableQuizAttempt) {
  if (!row.id || !row.quiz_id || !Number.isFinite(Date.parse(row.completed_at)) ||
    !Number.isInteger(row.score) || !Number.isInteger(row.total_questions) ||
    row.total_questions <= 0 || row.score < 0 || row.score > row.total_questions ||
    !Number.isFinite(row.percentage) || row.percentage < 0 || row.percentage > 100) {
    throw new Error('Invalid quiz attempt record')
  }
  const calculated = Math.round((row.score / row.total_questions) * 100)
  if (Math.abs(calculated - row.percentage) > 0.51) {
    throw new Error('Quiz attempt percentage contradicts raw score')
  }
}
export function selectCanonicalQuizAttempts(
  attempts: readonly SelectableQuizAttempt[],
  quizId: string,
): AttemptSelection {
  if (!quizId) throw new Error('quizId required')
  const candidates = attempts.filter(a => a.quiz_id === quizId && a.is_reassessment !== true)
  candidates.forEach(assertValid)
  const ids = new Set<string>()
  for (const row of candidates) {
    if (ids.has(row.id)) throw new Error('Duplicate attempt ID')
    ids.add(row.id)
  }
  const chronological = [...candidates].sort((a,b) =>
    Date.parse(a.completed_at) - Date.parse(b.completed_at) || a.id.localeCompare(b.id))
  const ranked = [...candidates].sort((a,b) =>
    (b.score / b.total_questions) - (a.score / a.total_questions) ||
    Date.parse(b.completed_at) - Date.parse(a.completed_at) ||
    a.id.localeCompare(b.id))
  return {
    latest: chronological.at(-1) ?? null,
    first: chronological[0] ?? null,
    best: ranked[0] ?? null,
    count: candidates.length,
  }
}
