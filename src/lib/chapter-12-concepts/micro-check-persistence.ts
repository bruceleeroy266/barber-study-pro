import { supabase } from '@/lib/supabase'
import { CHAPTER12_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter12ConceptFamilyId } from './types'
import type { Chapter12EvidenceRecord, Chapter12GradeInput, Chapter12Confidence } from './grading'
import { calculateChapter12ConceptMastery } from './grading'
import type {
  Chapter12MicroCheck,
  Chapter12MicroCheckAnswer,
  Chapter12MicroCheckQuestion,
} from './micro-checks'

export interface Chapter12MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-12'
  check_id: string
  question_id: string
  concept_id: Chapter12ConceptFamilyId
  difficulty: Chapter12MicroCheckQuestion['difficulty']
  selected_answer: Chapter12MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

const columns = 'id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at'

export async function loadChapter12MicroCheckAttempts(
  userId: string,
): Promise<Chapter12MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select(columns)
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-12')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C12 micro-check] Failed to load attempts:', error.message)
    return []
  }

  return (data ?? []) as Chapter12MicroCheckAttemptRow[]
}

export async function persistChapter12MicroCheckAttempt(
  userId: string,
  check: Chapter12MicroCheck,
  question: Chapter12MicroCheckQuestion,
  selectedAnswer: Chapter12MicroCheckAnswer,
): Promise<{ row: Chapter12MicroCheckAttemptRow | null; alreadyRecorded: boolean; error: string | null }> {
  if (check.conceptFamilyId !== question.conceptFamilyId) {
    return { row: null, alreadyRecorded: false, error: 'Concept mapping mismatch.' }
  }

  const payload = {
    user_id: userId,
    chapter_id: 'ch-12',
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
    return { row: data as Chapter12MicroCheckAttemptRow, alreadyRecorded: false, error: null }
  }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await supabase
      .from('chapter_micro_check_attempts')
      .select(columns)
      .eq('user_id', userId)
      .eq('chapter_id', 'ch-12')
      .eq('question_id', question.id)
      .maybeSingle()

    return {
      row: (existing ?? null) as Chapter12MicroCheckAttemptRow | null,
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

export function chapter12MicroCheckRowsToEvidence(
  rows: readonly Chapter12MicroCheckAttemptRow[],
): Chapter12EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-12',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter12MicroCheckPercent(
  rows: readonly Chapter12MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter12MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter12ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter12Confidence
}

export function buildChapter12MicroCheckDiagnostics(
  rows: readonly Chapter12MicroCheckAttemptRow[],
  referenceTime: string,
): Chapter12MicroCheckConceptDiagnostic[] {
  const evidence = chapter12MicroCheckRowsToEvidence(rows)

  return CHAPTER12_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter12ConceptMastery(
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

export function withPersistedChapter12MicroCheckGrade(
  input: Chapter12GradeInput,
  rows: readonly Chapter12MicroCheckAttemptRow[],
): Chapter12GradeInput {
  return {
    ...input,
    microCheckPercent: calculatePersistedChapter12MicroCheckPercent(rows),
  }
}
