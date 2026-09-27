import { supabase } from '@/lib/supabase'
import type { Chapter4ConceptFamilyId } from './types'
import type {
  Chapter4Confidence,
  Chapter4EvidenceRecord,
  Chapter4GradeInput,
} from './grading'
import { calculateChapter4ConceptMastery } from './grading'
import type {
  Chapter4MicroCheck,
  Chapter4MicroCheckAnswer,
  Chapter4MicroCheckQuestion,
} from './micro-checks'

export interface Chapter4MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-4'
  check_id: string
  question_id: string
  concept_id: Chapter4ConceptFamilyId
  difficulty: Chapter4MicroCheckQuestion['difficulty']
  selected_answer: Chapter4MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

export async function loadChapter4MicroCheckAttempts(
  userId: string,
): Promise<Chapter4MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-4')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C4 micro-check] Failed to load attempts:', error.message)
    return []
  }

  return (data ?? []) as Chapter4MicroCheckAttemptRow[]
}

export async function persistChapter4MicroCheckAttempt(
  userId: string,
  check: Chapter4MicroCheck,
  question: Chapter4MicroCheckQuestion,
  selectedAnswer: Chapter4MicroCheckAnswer,
): Promise<{
  row: Chapter4MicroCheckAttemptRow | null
  alreadyRecorded: boolean
  error: string | null
}> {
  if (check.conceptFamilyId !== question.conceptFamilyId) {
    return { row: null, alreadyRecorded: false, error: 'Concept mapping mismatch.' }
  }

  const payload = {
    user_id: userId,
    chapter_id: 'ch-4',
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
    .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
    .single()

  if (!error && data) {
    return {
      row: data as Chapter4MicroCheckAttemptRow,
      alreadyRecorded: false,
      error: null,
    }
  }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await supabase
      .from('chapter_micro_check_attempts')
      .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
      .eq('user_id', userId)
      .eq('chapter_id', 'ch-4')
      .eq('question_id', question.id)
      .maybeSingle()

    return {
      row: (existing ?? null) as Chapter4MicroCheckAttemptRow | null,
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

export function chapter4MicroCheckRowsToEvidence(
  rows: readonly Chapter4MicroCheckAttemptRow[],
): Chapter4EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-4',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter4MicroCheckPercent(
  rows: readonly Chapter4MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter4MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter4ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter4Confidence
}

export function buildChapter4MicroCheckDiagnostics(
  rows: readonly Chapter4MicroCheckAttemptRow[],
  conceptIds: readonly Chapter4ConceptFamilyId[],
  referenceTime: string,
): Chapter4MicroCheckConceptDiagnostic[] {
  const evidence = chapter4MicroCheckRowsToEvidence(rows)

  return conceptIds.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter4ConceptMastery(
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

export function withPersistedChapter4MicroCheckGrade(
  input: Chapter4GradeInput,
  rows: readonly Chapter4MicroCheckAttemptRow[],
): Chapter4GradeInput {
  return {
    ...input,
    microCheckPercent: calculatePersistedChapter4MicroCheckPercent(rows),
  }
}
