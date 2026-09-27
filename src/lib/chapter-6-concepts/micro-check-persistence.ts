import { supabase } from '@/lib/supabase'
import type { Chapter6ConceptFamilyId } from './types'
import type {
  Chapter6Confidence,
  Chapter6EvidenceRecord,
  Chapter6GradeInput,
} from './grading'
import { calculateChapter6ConceptMastery } from './grading'
import type {
  Chapter6MicroCheck,
  Chapter6MicroCheckAnswer,
  Chapter6MicroCheckQuestion,
} from './micro-checks'

export interface Chapter6MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-6'
  check_id: string
  question_id: string
  concept_id: Chapter6ConceptFamilyId
  difficulty: Chapter6MicroCheckQuestion['difficulty']
  selected_answer: Chapter6MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

export async function loadChapter6MicroCheckAttempts(
  userId: string,
): Promise<Chapter6MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-6')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C6 micro-check] Failed to load attempts:', error.message)
    return []
  }

  return (data ?? []) as Chapter6MicroCheckAttemptRow[]
}

export async function persistChapter6MicroCheckAttempt(
  userId: string,
  check: Chapter6MicroCheck,
  question: Chapter6MicroCheckQuestion,
  selectedAnswer: Chapter6MicroCheckAnswer,
): Promise<{
  row: Chapter6MicroCheckAttemptRow | null
  alreadyRecorded: boolean
  error: string | null
}> {
  if (check.conceptFamilyId !== question.conceptFamilyId) {
    return { row: null, alreadyRecorded: false, error: 'Concept mapping mismatch.' }
  }

  const payload = {
    user_id: userId,
    chapter_id: 'ch-6',
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
      row: data as Chapter6MicroCheckAttemptRow,
      alreadyRecorded: false,
      error: null,
    }
  }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await supabase
      .from('chapter_micro_check_attempts')
      .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
      .eq('user_id', userId)
      .eq('chapter_id', 'ch-6')
      .eq('question_id', question.id)
      .maybeSingle()

    return {
      row: (existing ?? null) as Chapter6MicroCheckAttemptRow | null,
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

export function chapter6MicroCheckRowsToEvidence(
  rows: readonly Chapter6MicroCheckAttemptRow[],
): Chapter6EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-6',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter6MicroCheckPercent(
  rows: readonly Chapter6MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter6MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter6ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter6Confidence
}

export function buildChapter6MicroCheckDiagnostics(
  rows: readonly Chapter6MicroCheckAttemptRow[],
  conceptIds: readonly Chapter6ConceptFamilyId[],
  referenceTime: string,
): Chapter6MicroCheckConceptDiagnostic[] {
  const evidence = chapter6MicroCheckRowsToEvidence(rows)

  return conceptIds.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter6ConceptMastery(
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

export function withPersistedChapter6MicroCheckGrade(
  input: Chapter6GradeInput,
  rows: readonly Chapter6MicroCheckAttemptRow[],
): Chapter6GradeInput {
  return {
    ...input,
    microCheckPercent: calculatePersistedChapter6MicroCheckPercent(rows),
  }
}
