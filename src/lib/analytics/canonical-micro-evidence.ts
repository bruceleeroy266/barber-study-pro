import { scoreEvidence, type AnswerEvidence, type AcademicScore } from './academic-contract-v1'

export interface PersistedMicroCheckRow {
  user_id: string
  chapter_id: string
  question_id: string
  concept_id: string
  is_correct: boolean
  answered_at: string
}

export interface MicroConceptAccuracy extends AcademicScore {
  conceptId: string
  evidenceStatus: 'limited' | 'supported'
}

/** Require records to match the already-authorized student and chapter.
 * Query authorization is enforced separately by Supabase RLS.
 */
export function canonicalMicroEvidence(input: {
  rows: readonly PersistedMicroCheckRow[]
  studentId: string
  chapterId: string
}): AnswerEvidence[] {
  const seen = new Set<string>()
  return input.rows.map(row => {
    if (row.user_id !== input.studentId || row.chapter_id !== input.chapterId ||
      !row.question_id || !row.concept_id || typeof row.is_correct !== 'boolean' ||
      !Number.isFinite(Date.parse(row.answered_at))) {
      throw new Error('Invalid or out-of-scope micro-check evidence')
    }
    if (seen.has(row.question_id)) throw new Error('Duplicate first-attempt micro-check evidence')
    seen.add(row.question_id)
    return {
      attemptId: `micro:${input.chapterId}:${row.question_id}`,
      questionId: row.question_id,
      conceptId: row.concept_id,
      source: 'micro_check' as const,
      correct: row.is_correct,
      answeredAt: row.answered_at,
    }
  })
}

export function summarizeMicroConcepts(rows: readonly AnswerEvidence[]): MicroConceptAccuracy[] {
  const groups = new Map<string, AnswerEvidence[]>()
  for (const row of rows) {
    if (row.source !== 'micro_check') throw new Error('Unexpected assessment evidence')
    groups.set(row.conceptId, [...(groups.get(row.conceptId) ?? []), row])
  }
  return [...groups].map(([conceptId, evidence]) => ({
    conceptId, ...scoreEvidence(evidence),
    evidenceStatus: evidence.length >= 3 ? 'supported' as const : 'limited' as const,
  })).sort((a,b)=>a.conceptId.localeCompare(b.conceptId))
}
