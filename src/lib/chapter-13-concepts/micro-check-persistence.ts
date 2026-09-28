import { supabase } from '@/lib/supabase'
import { CHAPTER13_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter13ConceptFamilyId } from './types'
import type { Chapter13EvidenceRecord, Chapter13GradeInput, Chapter13Confidence } from './grading'
import { calculateChapter13ConceptMastery } from './grading'
import type {
  Chapter13MicroCheck,
  Chapter13MicroCheckAnswer,
  Chapter13MicroCheckQuestion,
} from './micro-checks'

export interface Chapter13MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-13'
  check_id: string
  question_id: string
  concept_id: Chapter13ConceptFamilyId
  difficulty: Chapter13MicroCheckQuestion['difficulty']
  selected_answer: Chapter13MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

const columns = 'id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at'

export async function loadChapter13MicroCheckAttempts(userId: string): Promise<Chapter13MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select(columns)
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-13')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C13 micro-check] Failed to load attempts:', error.message)
    return []
  }

  return (data ?? []) as Chapter13MicroCheckAttemptRow[]
}

export async function persistChapter13MicroCheckAttempt(
  userId: string,
  check: Chapter13MicroCheck,
  question: Chapter13MicroCheckQuestion,
  selectedAnswer: Chapter13MicroCheckAnswer,
): Promise<{ row: Chapter13MicroCheckAttemptRow | null; alreadyRecorded: boolean; error: string | null }> {
  if (check.conceptFamilyId !== question.conceptFamilyId) {
    return { row: null, alreadyRecorded: false, error: 'Concept mapping mismatch.' }
  }

  const payload = {
    user_id: userId,
    chapter_id: 'ch-13',
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
    return { row: data as Chapter13MicroCheckAttemptRow, alreadyRecorded: false, error: null }
  }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await supabase
      .from('chapter_micro_check_attempts')
      .select(columns)
      .eq('user_id', userId)
      .eq('chapter_id', 'ch-13')
      .eq('question_id', question.id)
      .maybeSingle()

    return {
      row: (existing ?? null) as Chapter13MicroCheckAttemptRow | null,
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

export function chapter13MicroCheckRowsToEvidence(
  rows: readonly Chapter13MicroCheckAttemptRow[],
): Chapter13EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-13',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter13MicroCheckPercent(
  rows: readonly Chapter13MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter13MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter13ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter13Confidence
}

export function buildChapter13MicroCheckDiagnostics(
  rows: readonly Chapter13MicroCheckAttemptRow[],
  referenceTime: string,
): Chapter13MicroCheckConceptDiagnostic[] {
  const evidence = chapter13MicroCheckRowsToEvidence(rows)

  return CHAPTER13_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter13ConceptMastery(
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

export function withPersistedChapter13MicroCheckGrade(
  input: Chapter13GradeInput,
  rows: readonly Chapter13MicroCheckAttemptRow[],
): Chapter13GradeInput {
  return {
    ...input,
    microCheckPercent: calculatePersistedChapter13MicroCheckPercent(rows),
  }
}
