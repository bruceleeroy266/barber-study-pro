import { supabase } from '@/lib/supabase'
import { CHAPTER11_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter11ConceptFamilyId } from './types'
import type { Chapter11EvidenceRecord, Chapter11GradeInput, Chapter11Confidence } from './grading'
import { calculateChapter11ConceptMastery } from './grading'
import type {
  Chapter11MicroCheck,
  Chapter11MicroCheckAnswer,
  Chapter11MicroCheckQuestion,
} from './micro-checks'

export interface Chapter11MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-11'
  check_id: string
  question_id: string
  concept_id: Chapter11ConceptFamilyId
  difficulty: Chapter11MicroCheckQuestion['difficulty']
  selected_answer: Chapter11MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

const columns = 'id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at'

export async function loadChapter11MicroCheckAttempts(
  userId: string,
): Promise<Chapter11MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select(columns)
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-11')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C11 micro-check] Failed to load attempts:', error.message)
    return []
  }

  return (data ?? []) as Chapter11MicroCheckAttemptRow[]
}

export async function persistChapter11MicroCheckAttempt(
  userId: string,
  check: Chapter11MicroCheck,
  question: Chapter11MicroCheckQuestion,
  selectedAnswer: Chapter11MicroCheckAnswer,
): Promise<{ row: Chapter11MicroCheckAttemptRow | null; alreadyRecorded: boolean; error: string | null }> {
  if (check.conceptFamilyId !== question.conceptFamilyId) {
    return { row: null, alreadyRecorded: false, error: 'Concept mapping mismatch.' }
  }

  // The server validates the trusted question definition and derives correctness.
  const response = await fetch('/api/academic/micro-check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chapterId: 'ch-11', questionId: question.id, selectedAnswer }),
  })
  const result = await response.json() as { row?: Chapter11MicroCheckAttemptRow; alreadyRecorded?: boolean; error?: string }
  if (response.ok && result.row) {
    return { row: result.row, alreadyRecorded: Boolean(result.alreadyRecorded), error: null }
  }
  return { row: null, alreadyRecorded: false, error: result.error ?? 'Unable to save micro-check answer.' }

}

export function chapter11MicroCheckRowsToEvidence(
  rows: readonly Chapter11MicroCheckAttemptRow[],
): Chapter11EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-11',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter11MicroCheckPercent(
  rows: readonly Chapter11MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter11MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter11ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter11Confidence
}

export function buildChapter11MicroCheckDiagnostics(
  rows: readonly Chapter11MicroCheckAttemptRow[],
  referenceTime: string,
): Chapter11MicroCheckConceptDiagnostic[] {
  const evidence = chapter11MicroCheckRowsToEvidence(rows)

  return CHAPTER11_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter11ConceptMastery(
      evidence.filter((record) => record.conceptFamilyId === conceptFamilyId),
      referenceTime,
    )
    const correct = conceptRows.filter((row) => row.is_correct).length

    return {
      conceptFamilyId,
      answered: conceptRows.length,
      correct,
      percent: conceptRows.length ? Math.round((correct / conceptRows.length) * 10000) / 100 : 0,
      masteryFromMicroChecks: mastery.mastery,
      confidenceFromMicroChecks: mastery.confidence,
    }
  })
}

export function withPersistedChapter11MicroCheckGrade(
  input: Chapter11GradeInput,
  rows: readonly Chapter11MicroCheckAttemptRow[],
): Chapter11GradeInput {
  return {
    ...input,
    microCheckPercent: calculatePersistedChapter11MicroCheckPercent(rows),
  }
}
