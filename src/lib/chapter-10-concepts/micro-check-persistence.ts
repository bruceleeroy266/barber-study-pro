import { supabase } from '@/lib/supabase'
import { CHAPTER10_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter10ConceptFamilyId } from './types'
import type { Chapter10EvidenceRecord, Chapter10GradeInput, Chapter10Confidence } from './grading'
import { calculateChapter10ConceptMastery } from './grading'
import type {
  Chapter10MicroCheck,
  Chapter10MicroCheckAnswer,
  Chapter10MicroCheckQuestion,
} from './micro-checks'

export interface Chapter10MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-10'
  check_id: string
  question_id: string
  concept_id: Chapter10ConceptFamilyId
  difficulty: Chapter10MicroCheckQuestion['difficulty']
  selected_answer: Chapter10MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

export async function loadChapter10MicroCheckAttempts(
  userId: string,
): Promise<Chapter10MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-10')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C10 micro-check] Failed to load attempts:', error.message)
    return []
  }

  return (data ?? []) as Chapter10MicroCheckAttemptRow[]
}

export async function persistChapter10MicroCheckAttempt(
  userId: string,
  check: Chapter10MicroCheck,
  question: Chapter10MicroCheckQuestion,
  selectedAnswer: Chapter10MicroCheckAnswer,
): Promise<{ row: Chapter10MicroCheckAttemptRow | null; alreadyRecorded: boolean; error: string | null }> {
  if (check.conceptFamilyId !== question.conceptFamilyId) {
    return { row: null, alreadyRecorded: false, error: 'Concept mapping mismatch.' }
  }

  const payload = {
    user_id: userId,
    chapter_id: 'ch-10',
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
    return { row: data as Chapter10MicroCheckAttemptRow, alreadyRecorded: false, error: null }
  }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await supabase
      .from('chapter_micro_check_attempts')
      .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
      .eq('user_id', userId)
      .eq('chapter_id', 'ch-10')
      .eq('question_id', question.id)
      .maybeSingle()

    return {
      row: (existing ?? null) as Chapter10MicroCheckAttemptRow | null,
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

export function chapter10MicroCheckRowsToEvidence(
  rows: readonly Chapter10MicroCheckAttemptRow[],
): Chapter10EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-10',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter10MicroCheckPercent(
  rows: readonly Chapter10MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter10MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter10ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter10Confidence
}

export function buildChapter10MicroCheckDiagnostics(
  rows: readonly Chapter10MicroCheckAttemptRow[],
  referenceTime: string,
): Chapter10MicroCheckConceptDiagnostic[] {
  const evidence = chapter10MicroCheckRowsToEvidence(rows)

  return CHAPTER10_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter10ConceptMastery(
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

export function withPersistedChapter10MicroCheckGrade(
  input: Chapter10GradeInput,
  rows: readonly Chapter10MicroCheckAttemptRow[],
): Chapter10GradeInput {
  return {
    ...input,
    microCheckPercent: calculatePersistedChapter10MicroCheckPercent(rows),
  }
}
