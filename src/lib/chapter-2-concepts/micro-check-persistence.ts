import { supabase } from '@/lib/supabase'
import type { ConceptId } from './types'
import type {
  Chapter2Confidence,
  Chapter2EvidenceRecord,
  Chapter2GradeInput,
} from './grading'
import { calculateChapter2ConceptMastery } from './grading'
import type {
  Chapter2MicroCheck,
  Chapter2MicroCheckAnswer,
  Chapter2MicroCheckQuestion,
} from './micro-checks'

export interface Chapter2MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-2'
  check_id: string
  question_id: string
  concept_id: ConceptId
  difficulty: Chapter2MicroCheckQuestion['difficulty']
  selected_answer: Chapter2MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

export async function loadChapter2MicroCheckAttempts(
  userId: string,
): Promise<Chapter2MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-2')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C2 micro-check] Failed to load attempts:', error.message)
    return []
  }

  return (data ?? []) as Chapter2MicroCheckAttemptRow[]
}

export async function persistChapter2MicroCheckAttempt(
  userId: string,
  check: Chapter2MicroCheck,
  question: Chapter2MicroCheckQuestion,
  selectedAnswer: Chapter2MicroCheckAnswer,
): Promise<{
  row: Chapter2MicroCheckAttemptRow | null
  alreadyRecorded: boolean
  error: string | null
}> {
  if (check.conceptId !== question.conceptId) {
    return { row: null, alreadyRecorded: false, error: 'Concept mapping mismatch.' }
  }

  const payload = {
    user_id: userId,
    chapter_id: 'ch-2',
    check_id: check.id,
    question_id: question.id,
    concept_id: question.conceptId,
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
      row: data as Chapter2MicroCheckAttemptRow,
      alreadyRecorded: false,
      error: null,
    }
  }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await supabase
      .from('chapter_micro_check_attempts')
      .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
      .eq('user_id', userId)
      .eq('chapter_id', 'ch-2')
      .eq('question_id', question.id)
      .maybeSingle()

    return {
      row: (existing ?? null) as Chapter2MicroCheckAttemptRow | null,
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

export function chapter2MicroCheckRowsToEvidence(
  rows: readonly Chapter2MicroCheckAttemptRow[],
): Chapter2EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-2',
    conceptId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter2MicroCheckPercent(
  rows: readonly Chapter2MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter2MicroCheckConceptDiagnostic {
  conceptId: ConceptId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter2Confidence
}

export function buildChapter2MicroCheckDiagnostics(
  rows: readonly Chapter2MicroCheckAttemptRow[],
  conceptIds: readonly ConceptId[],
  referenceTime: string,
): Chapter2MicroCheckConceptDiagnostic[] {
  const evidence = chapter2MicroCheckRowsToEvidence(rows)

  return conceptIds.map((conceptId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptId)
    const mastery = calculateChapter2ConceptMastery(
      evidence.filter((record) => record.conceptId === conceptId),
      referenceTime,
    )
    const correct = conceptRows.filter((row) => row.is_correct).length

    return {
      conceptId,
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

export function withPersistedChapter2MicroCheckGrade(
  input: Chapter2GradeInput,
  rows: readonly Chapter2MicroCheckAttemptRow[],
): Chapter2GradeInput {
  return {
    ...input,
    microCheckPercent: calculatePersistedChapter2MicroCheckPercent(rows),
  }
}
