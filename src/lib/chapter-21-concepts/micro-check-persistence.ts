import { supabase } from '@/lib/supabase'
import { CHAPTER21_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter21ConceptFamilyId } from './types'
import type {
  Chapter21EvidenceRecord,
  Chapter21GradeInput,
  Chapter21Confidence,
} from './grading'
import { calculateChapter21ConceptMastery } from './grading'
import type {
  Chapter21MicroCheck,
  Chapter21MicroCheckAnswer,
  Chapter21MicroCheckQuestion,
} from './micro-checks'

export interface Chapter21MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-21'
  check_id: string
  question_id: string
  concept_id: Chapter21ConceptFamilyId
  difficulty: Chapter21MicroCheckQuestion['difficulty']
  selected_answer: Chapter21MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

const columns =
  'id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at'

export async function loadChapter21MicroCheckAttempts(
  userId: string,
): Promise<Chapter21MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select(columns)
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-21')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C21 micro-check] Failed to load attempts:', error.message)
    return []
  }

  return (data ?? []) as Chapter21MicroCheckAttemptRow[]
}

export async function persistChapter21MicroCheckAttempt(
  _userId: string,
  check: Chapter21MicroCheck,
  question: Chapter21MicroCheckQuestion,
  selectedAnswer: Chapter21MicroCheckAnswer,
): Promise<{
  row: Chapter21MicroCheckAttemptRow | null
  alreadyRecorded: boolean
  error: string | null
}> {
  if (
    check.conceptFamilyId !== question.conceptFamilyId ||
    check.learningObjectiveId !== question.learningObjectiveId
  ) {
    return {
      row: null,
      alreadyRecorded: false,
      error: 'Concept or learning-objective mapping mismatch.',
    }
  }

  try {
    const response = await fetch('/api/chapter-21/micro-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: question.id, selectedAnswer }),
    })
    const body = (await response.json().catch(() => ({}))) as {
      row?: Chapter21MicroCheckAttemptRow | null
      alreadyRecorded?: boolean
      error?: string
    }

    if (!response.ok) {
      return {
        row: null,
        alreadyRecorded: false,
        error: body.error ?? 'Unable to save micro-check answer.',
      }
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
      error:
        error instanceof Error
          ? error.message
          : 'Unable to save micro-check answer.',
    }
  }
}

export function chapter21MicroCheckRowsToEvidence(
  rows: readonly Chapter21MicroCheckAttemptRow[],
): Chapter21EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-21',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter21MicroCheckPercent(
  rows: readonly Chapter21MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter21MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter21ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter21Confidence
}

export function buildChapter21MicroCheckDiagnostics(
  rows: readonly Chapter21MicroCheckAttemptRow[],
  referenceTime: string,
): Chapter21MicroCheckConceptDiagnostic[] {
  const evidence = chapter21MicroCheckRowsToEvidence(rows)

  return CHAPTER21_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const conceptRows = rows.filter(
      (row) => row.concept_id === conceptFamilyId,
    )
    const mastery = calculateChapter21ConceptMastery(
      evidence.filter(
        (record) => record.conceptFamilyId === conceptFamilyId,
      ),
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

export function withPersistedChapter21MicroCheckGrade(
  input: Chapter21GradeInput,
  rows: readonly Chapter21MicroCheckAttemptRow[],
): Chapter21GradeInput {
  return {
    ...input,
    microCheckPercent: calculatePersistedChapter21MicroCheckPercent(rows),
  }
}
