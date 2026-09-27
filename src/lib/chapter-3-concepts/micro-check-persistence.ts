import { supabase } from '@/lib/supabase'
import type { Chapter3ConceptFamilyId } from './types'
import type {
  Chapter3Confidence,
  Chapter3EvidenceRecord,
  Chapter3GradeInput,
} from './grading'
import { calculateChapter3ConceptMastery } from './grading'
import type {
  Chapter3MicroCheck,
  Chapter3MicroCheckAnswer,
  Chapter3MicroCheckQuestion,
} from './micro-checks'

export interface Chapter3MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-3'
  check_id: string
  question_id: string
  concept_id: Chapter3ConceptFamilyId
  difficulty: Chapter3MicroCheckQuestion['difficulty']
  selected_answer: Chapter3MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

export async function loadChapter3MicroCheckAttempts(
  userId: string,
): Promise<Chapter3MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-3')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C2 micro-check] Failed to load attempts:', error.message)
    return []
  }

  return (data ?? []) as Chapter3MicroCheckAttemptRow[]
}

export async function persistChapter3MicroCheckAttempt(
  userId: string,
  check: Chapter3MicroCheck,
  question: Chapter3MicroCheckQuestion,
  selectedAnswer: Chapter3MicroCheckAnswer,
): Promise<{
  row: Chapter3MicroCheckAttemptRow | null
  alreadyRecorded: boolean
  error: string | null
}> {
  if (check.conceptId !== question.conceptId) {
    return { row: null, alreadyRecorded: false, error: 'Concept mapping mismatch.' }
  }

  const payload = {
    user_id: userId,
    chapter_id: 'ch-3',
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
      row: data as Chapter3MicroCheckAttemptRow,
      alreadyRecorded: false,
      error: null,
    }
  }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await supabase
      .from('chapter_micro_check_attempts')
      .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
      .eq('user_id', userId)
      .eq('chapter_id', 'ch-3')
      .eq('question_id', question.id)
      .maybeSingle()

    return {
      row: (existing ?? null) as Chapter3MicroCheckAttemptRow | null,
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

export function chapter3MicroCheckRowsToEvidence(
  rows: readonly Chapter3MicroCheckAttemptRow[],
): Chapter3EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-3',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter3MicroCheckPercent(
  rows: readonly Chapter3MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter3MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter3ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter3Confidence
}

export function buildChapter3MicroCheckDiagnostics(
  rows: readonly Chapter3MicroCheckAttemptRow[],
  conceptIds: readonly Chapter3ConceptFamilyId[],
  referenceTime: string,
): Chapter3MicroCheckConceptDiagnostic[] {
  const evidence = chapter3MicroCheckRowsToEvidence(rows)

  return conceptIds.map((conceptId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter3ConceptMastery(
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

export function withPersistedChapter3MicroCheckGrade(
  input: Chapter3GradeInput,
  rows: readonly Chapter3MicroCheckAttemptRow[],
): Chapter3GradeInput {
  return {
    ...input,
    microCheckPercent: calculatePersistedChapter3MicroCheckPercent(rows),
  }
}
