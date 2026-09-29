import { supabase } from '@/lib/supabase'
import { CHAPTER15_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter15ConceptFamilyId } from './types'
import type { Chapter15EvidenceRecord, Chapter15GradeInput, Chapter15Confidence } from './grading'
import { calculateChapter15ConceptMastery } from './grading'
import type {
  Chapter15MicroCheck,
  Chapter15MicroCheckAnswer,
  Chapter15MicroCheckQuestion,
} from './micro-checks'

export interface Chapter15MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-15'
  check_id: string
  question_id: string
  concept_id: Chapter15ConceptFamilyId
  difficulty: Chapter15MicroCheckQuestion['difficulty']
  selected_answer: Chapter15MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

const columns = 'id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at'

export async function loadChapter15MicroCheckAttempts(userId: string): Promise<Chapter15MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select(columns)
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-15')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C15 micro-check] Failed to load attempts:', error.message)
    return []
  }
  return (data ?? []) as Chapter15MicroCheckAttemptRow[]
}

export async function persistChapter15MicroCheckAttempt(
  userId: string,
  check: Chapter15MicroCheck,
  question: Chapter15MicroCheckQuestion,
  selectedAnswer: Chapter15MicroCheckAnswer,
): Promise<{ row: Chapter15MicroCheckAttemptRow | null; alreadyRecorded: boolean; error: string | null }> {
  if (check.conceptFamilyId !== question.conceptFamilyId) {
    return { row: null, alreadyRecorded: false, error: 'Concept mapping mismatch.' }
  }

  const payload = {
    user_id: userId,
    chapter_id: 'ch-15',
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

  if (!error && data) return { row: data as Chapter15MicroCheckAttemptRow, alreadyRecorded: false, error: null }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await supabase
      .from('chapter_micro_check_attempts')
      .select(columns)
      .eq('user_id', userId)
      .eq('chapter_id', 'ch-15')
      .eq('question_id', question.id)
      .maybeSingle()

    return {
      row: (existing ?? null) as Chapter15MicroCheckAttemptRow | null,
      alreadyRecorded: true,
      error: existingError?.message ?? null,
    }
  }

  return { row: null, alreadyRecorded: false, error: error?.message ?? 'Unable to save micro-check answer.' }
}

export function chapter15MicroCheckRowsToEvidence(
  rows: readonly Chapter15MicroCheckAttemptRow[],
): Chapter15EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-15',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter15MicroCheckPercent(
  rows: readonly Chapter15MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter15MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter15ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter15Confidence
}

export function buildChapter15MicroCheckDiagnostics(
  rows: readonly Chapter15MicroCheckAttemptRow[],
  referenceTime: string,
): Chapter15MicroCheckConceptDiagnostic[] {
  const evidence = chapter15MicroCheckRowsToEvidence(rows)
  return CHAPTER15_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter15ConceptMastery(
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

export function withPersistedChapter15MicroCheckGrade(
  input: Chapter15GradeInput,
  rows: readonly Chapter15MicroCheckAttemptRow[],
): Chapter15GradeInput {
  return { ...input, microCheckPercent: calculatePersistedChapter15MicroCheckPercent(rows) }
}
