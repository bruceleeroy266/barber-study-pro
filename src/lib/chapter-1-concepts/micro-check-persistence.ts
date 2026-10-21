import { supabase } from '@/lib/supabase'
import type { Chapter1ConceptFamilyId } from './types'
import type {
  Chapter1Confidence,
  Chapter1EvidenceRecord,
  Chapter1GradeInput,
} from './grading'
import { calculateChapter1ConceptMastery } from './grading'
import type {
  Chapter1MicroCheck,
  Chapter1MicroCheckAnswer,
  Chapter1MicroCheckQuestion,
} from './micro-checks'

export interface Chapter1MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-1'
  check_id: string
  question_id: string
  concept_id: Chapter1ConceptFamilyId
  difficulty: Chapter1MicroCheckQuestion['difficulty']
  selected_answer: Chapter1MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

export async function loadChapter1MicroCheckAttempts(
  userId: string,
): Promise<Chapter1MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-1')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C1 micro-check] Failed to load attempts:', error.message)
    return []
  }

  return (data ?? []) as Chapter1MicroCheckAttemptRow[]
}

export async function persistChapter1MicroCheckAttempt(
  userId: string,
  check: Chapter1MicroCheck,
  question: Chapter1MicroCheckQuestion,
  selectedAnswer: Chapter1MicroCheckAnswer,
): Promise<{
  row: Chapter1MicroCheckAttemptRow | null
  alreadyRecorded: boolean
  error: string | null
}> {
  if (check.conceptFamilyId !== question.conceptFamilyId) {
    return { row: null, alreadyRecorded: false, error: 'Concept mapping mismatch.' }
  }

  // The server validates the trusted question definition and derives correctness.
  const response = await fetch('/api/academic/micro-check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chapterId: 'ch-1', questionId: question.id, selectedAnswer }),
  })
  const result = await response.json() as { row?: Chapter1MicroCheckAttemptRow; alreadyRecorded?: boolean; error?: string }
  if (response.ok && result.row) {
    return { row: result.row, alreadyRecorded: Boolean(result.alreadyRecorded), error: null }
  }
  return { row: null, alreadyRecorded: false, error: result.error ?? 'Unable to save micro-check answer.' }

}

export function chapter1MicroCheckRowsToEvidence(
  rows: readonly Chapter1MicroCheckAttemptRow[],
): Chapter1EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-1',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter1MicroCheckPercent(
  rows: readonly Chapter1MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter1MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter1ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter1Confidence
}

export function buildChapter1MicroCheckDiagnostics(
  rows: readonly Chapter1MicroCheckAttemptRow[],
  conceptIds: readonly Chapter1ConceptFamilyId[],
  referenceTime: string,
): Chapter1MicroCheckConceptDiagnostic[] {
  const evidence = chapter1MicroCheckRowsToEvidence(rows)

  return conceptIds.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter1ConceptMastery(
      evidence.filter((record) => record.conceptFamilyId === conceptFamilyId),
      referenceTime,
    )
    const correct = conceptRows.filter((row) => row.is_correct).length

    return {
      conceptFamilyId,
      answered: conceptRows.length,
      correct,
      percent: conceptRows.length
        ? Math.round((correct / conceptRows.length) * 10000) / 100
        : 0,
      masteryFromMicroChecks: mastery.mastery,
      confidenceFromMicroChecks: mastery.confidence,
    }
  })
}

export function withPersistedChapter1MicroCheckGrade(
  input: Chapter1GradeInput,
  rows: readonly Chapter1MicroCheckAttemptRow[],
): Chapter1GradeInput {
  return {
    ...input,
    microCheckPercent: calculatePersistedChapter1MicroCheckPercent(rows),
  }
}
