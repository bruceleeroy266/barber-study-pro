import { supabase } from '@/lib/supabase'
import { CHAPTER19_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter19ConceptFamilyId } from './types'
import type {
  Chapter19EvidenceRecord,
  Chapter19GradeInput,
  Chapter19Confidence,
} from './grading'
import { calculateChapter19ConceptMastery } from './grading'
import type {
  Chapter19MicroCheck,
  Chapter19MicroCheckAnswer,
  Chapter19MicroCheckQuestion,
} from './micro-checks'

export interface Chapter19MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-19'
  check_id: string
  question_id: string
  concept_id: Chapter19ConceptFamilyId
  difficulty: Chapter19MicroCheckQuestion['difficulty']
  selected_answer: Chapter19MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

const columns =
  'id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at'

export async function loadChapter19MicroCheckAttempts(
  userId: string,
): Promise<Chapter19MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select(columns)
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-19')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C19 micro-check] Failed to load attempts:', error.message)
    return []
  }

  return (data ?? []) as Chapter19MicroCheckAttemptRow[]
}

export async function persistChapter19MicroCheckAttempt(
  userId: string,
  check: Chapter19MicroCheck,
  question: Chapter19MicroCheckQuestion,
  selectedAnswer: Chapter19MicroCheckAnswer,
): Promise<{
  row: Chapter19MicroCheckAttemptRow | null
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

  const payload = {
    user_id: userId,
    chapter_id: 'ch-19',
    check_id: check.id,
    question_id: question.id,
    concept_id: question.conceptFamilyId,
    difficulty: question.difficulty,
    selected_answer: selectedAnswer,
    is_correct: selectedAnswer === question.correctAnswer,
    answered_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .insert(payload)
    .select(columns)
    .single()

  if (!error && data) {
    return {
      row: data as Chapter19MicroCheckAttemptRow,
      alreadyRecorded: false,
      error: null,
    }
  }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await supabase
      .from('chapter_micro_check_attempts')
      .select(columns)
      .eq('user_id', userId)
      .eq('chapter_id', 'ch-19')
      .eq('question_id', question.id)
      .maybeSingle()

    return {
      row: (existing ?? null) as Chapter19MicroCheckAttemptRow | null,
      alreadyRecorded: true,
      error: existingError?.message ?? null,
    }
  }

  return {
    row: null,
    alreadyRecorded: false,
    error: error?.message ?? 'Unable to save micro-check answer.',
  }
}

export function chapter19MicroCheckRowsToEvidence(
  rows: readonly Chapter19MicroCheckAttemptRow[],
): Chapter19EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-19',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter19MicroCheckPercent(
  rows: readonly Chapter19MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter19MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter19ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter19Confidence
}

export function buildChapter19MicroCheckDiagnostics(
  rows: readonly Chapter19MicroCheckAttemptRow[],
  referenceTime: string,
): Chapter19MicroCheckConceptDiagnostic[] {
  const evidence = chapter19MicroCheckRowsToEvidence(rows)
  return CHAPTER19_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter19ConceptMastery(
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

export function withPersistedChapter19MicroCheckGrade(
  input: Chapter19GradeInput,
  rows: readonly Chapter19MicroCheckAttemptRow[],
): Chapter19GradeInput {
  return {
    ...input,
    microCheckPercent: calculatePersistedChapter19MicroCheckPercent(rows),
  }
}
