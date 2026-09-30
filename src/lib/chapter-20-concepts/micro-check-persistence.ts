import { supabase } from '@/lib/supabase'
import { CHAPTER20_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter20ConceptFamilyId } from './types'
import type {
  Chapter20EvidenceRecord,
  Chapter20GradeInput,
  Chapter20Confidence,
} from './grading'
import { calculateChapter20ConceptMastery } from './grading'
import type {
  Chapter20MicroCheck,
  Chapter20MicroCheckAnswer,
  Chapter20MicroCheckQuestion,
} from './micro-checks'

export interface Chapter20MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-20'
  check_id: string
  question_id: string
  concept_id: Chapter20ConceptFamilyId
  difficulty: Chapter20MicroCheckQuestion['difficulty']
  selected_answer: Chapter20MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

const columns =
  'id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at'

export async function loadChapter20MicroCheckAttempts(
  userId: string,
): Promise<Chapter20MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select(columns)
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-20')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C20 micro-check] Failed to load attempts:', error.message)
    return []
  }
  return (data ?? []) as Chapter20MicroCheckAttemptRow[]
}

export async function persistChapter20MicroCheckAttempt(
  _userId: string,
  check: Chapter20MicroCheck,
  question: Chapter20MicroCheckQuestion,
  selectedAnswer: Chapter20MicroCheckAnswer,
): Promise<{ row: Chapter20MicroCheckAttemptRow | null; alreadyRecorded: boolean; error: string | null }> {
  if (
    check.conceptFamilyId !== question.conceptFamilyId ||
    check.learningObjectiveId !== question.learningObjectiveId
  ) {
    return { row: null, alreadyRecorded: false, error: 'Concept or learning-objective mapping mismatch.' }
  }

  try {
    const response = await fetch('/api/chapter-20/micro-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: question.id, selectedAnswer }),
    })
    const body = (await response.json().catch(() => ({}))) as {
      row?: Chapter20MicroCheckAttemptRow | null
      alreadyRecorded?: boolean
      error?: string
    }
    if (!response.ok) {
      return { row: null, alreadyRecorded: false, error: body.error ?? 'Unable to save micro-check answer.' }
    }
    return {
      row: body.row ?? null,
      alreadyRecorded: body.alreadyRecorded ?? false,
      error: body.row ? null : body.error ?? 'Unable to save micro-check answer.',
    }
  } catch (error) {
    return {
      row: null,
      alreadyRecorded: false,
      error: error instanceof Error ? error.message : 'Unable to save micro-check answer.',
    }
  }
}

export function chapter20MicroCheckRowsToEvidence(
  rows: readonly Chapter20MicroCheckAttemptRow[],
): Chapter20EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-20',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter20MicroCheckPercent(
  rows: readonly Chapter20MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter20MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter20ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter20Confidence
}

export function buildChapter20MicroCheckDiagnostics(
  rows: readonly Chapter20MicroCheckAttemptRow[],
  referenceTime: string,
): Chapter20MicroCheckConceptDiagnostic[] {
  const evidence = chapter20MicroCheckRowsToEvidence(rows)
  return CHAPTER20_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter20ConceptMastery(
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

export function withPersistedChapter20MicroCheckGrade(
  input: Chapter20GradeInput,
  rows: readonly Chapter20MicroCheckAttemptRow[],
): Chapter20GradeInput {
  return { ...input, microCheckPercent: calculatePersistedChapter20MicroCheckPercent(rows) }
}
