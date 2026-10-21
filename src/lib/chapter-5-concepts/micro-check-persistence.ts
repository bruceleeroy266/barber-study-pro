import { supabase } from '@/lib/supabase'
import type { Chapter5ConceptFamilyId } from './types'
import type {
  Chapter5Confidence,
  Chapter5EvidenceRecord,
  Chapter5GradeInput,
} from './grading'
import { calculateChapter5ConceptMastery } from './grading'
import type {
  Chapter5MicroCheck,
  Chapter5MicroCheckAnswer,
  Chapter5MicroCheckQuestion,
} from './micro-checks'

export interface Chapter5MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-5'
  check_id: string
  question_id: string
  concept_id: Chapter5ConceptFamilyId
  difficulty: Chapter5MicroCheckQuestion['difficulty']
  selected_answer: Chapter5MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

export async function loadChapter5MicroCheckAttempts(
  userId: string,
): Promise<Chapter5MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-5')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C5 micro-check] Failed to load attempts:', error.message)
    return []
  }

  return (data ?? []) as Chapter5MicroCheckAttemptRow[]
}

export async function persistChapter5MicroCheckAttempt(
  userId: string,
  check: Chapter5MicroCheck,
  question: Chapter5MicroCheckQuestion,
  selectedAnswer: Chapter5MicroCheckAnswer,
): Promise<{
  row: Chapter5MicroCheckAttemptRow | null
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
    body: JSON.stringify({ chapterId: 'ch-5', questionId: question.id, selectedAnswer }),
  })
  const result = await response.json() as { row?: Chapter5MicroCheckAttemptRow; alreadyRecorded?: boolean; error?: string }
  if (response.ok && result.row) {
    return { row: result.row, alreadyRecorded: Boolean(result.alreadyRecorded), error: null }
  }
  return { row: null, alreadyRecorded: false, error: result.error ?? 'Unable to save micro-check answer.' }

}

export function chapter5MicroCheckRowsToEvidence(
  rows: readonly Chapter5MicroCheckAttemptRow[],
): Chapter5EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-5',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter5MicroCheckPercent(
  rows: readonly Chapter5MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter5MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter5ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter5Confidence
}

export function buildChapter5MicroCheckDiagnostics(
  rows: readonly Chapter5MicroCheckAttemptRow[],
  conceptIds: readonly Chapter5ConceptFamilyId[],
  referenceTime: string,
): Chapter5MicroCheckConceptDiagnostic[] {
  const evidence = chapter5MicroCheckRowsToEvidence(rows)

  return conceptIds.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter5ConceptMastery(
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

export function withPersistedChapter5MicroCheckGrade(
  input: Chapter5GradeInput,
  rows: readonly Chapter5MicroCheckAttemptRow[],
): Chapter5GradeInput {
  return {
    ...input,
    microCheckPercent: calculatePersistedChapter5MicroCheckPercent(rows),
  }
}
