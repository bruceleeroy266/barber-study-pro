import { supabase } from '@/lib/supabase'
import { CHAPTER18_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter18ConceptFamilyId } from './types'
import type { Chapter18EvidenceRecord, Chapter18GradeInput, Chapter18Confidence } from './grading'
import { calculateChapter18ConceptMastery } from './grading'
import type {
  Chapter18MicroCheck,
  Chapter18MicroCheckAnswer,
  Chapter18MicroCheckQuestion,
} from './micro-checks'

export interface Chapter18MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-18'
  check_id: string
  question_id: string
  concept_id: Chapter18ConceptFamilyId
  difficulty: Chapter18MicroCheckQuestion['difficulty']
  selected_answer: Chapter18MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

const columns = 'id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at'

export async function loadChapter18MicroCheckAttempts(userId: string): Promise<Chapter18MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select(columns)
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-18')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C18 micro-check] Failed to load attempts:', error.message)
    return []
  }

  return (data ?? []) as Chapter18MicroCheckAttemptRow[]
}

export async function persistChapter18MicroCheckAttempt(
  userId: string,
  check: Chapter18MicroCheck,
  question: Chapter18MicroCheckQuestion,
  selectedAnswer: Chapter18MicroCheckAnswer,
): Promise<{ row: Chapter18MicroCheckAttemptRow | null; alreadyRecorded: boolean; error: string | null }> {
  if (check.conceptFamilyId !== question.conceptFamilyId) {
    return { row: null, alreadyRecorded: false, error: 'Concept mapping mismatch.' }
  }

  const payload = {
    user_id: userId,
    chapter_id: 'ch-18',
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
    return { row: data as Chapter18MicroCheckAttemptRow, alreadyRecorded: false, error: null }
  }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await supabase
      .from('chapter_micro_check_attempts')
      .select(columns)
      .eq('user_id', userId)
      .eq('chapter_id', 'ch-18')
      .eq('question_id', question.id)
      .maybeSingle()

    return {
      row: (existing ?? null) as Chapter18MicroCheckAttemptRow | null,
      alreadyRecorded: true,
      error: existingError?.message ?? null,
    }
  }

  return { row: null, alreadyRecorded: false, error: error?.message ?? 'Unable to save micro-check answer.' }
}

export function chapter18MicroCheckRowsToEvidence(
  rows: readonly Chapter18MicroCheckAttemptRow[],
): Chapter18EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-18',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter18MicroCheckPercent(
  rows: readonly Chapter18MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter18MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter18ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter18Confidence
}

export function buildChapter18MicroCheckDiagnostics(
  rows: readonly Chapter18MicroCheckAttemptRow[],
  referenceTime: string,
): Chapter18MicroCheckConceptDiagnostic[] {
  const evidence = chapter18MicroCheckRowsToEvidence(rows)
  return CHAPTER18_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter18ConceptMastery(
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

export function withPersistedChapter18MicroCheckGrade(
  input: Chapter18GradeInput,
  rows: readonly Chapter18MicroCheckAttemptRow[],
): Chapter18GradeInput {
  return { ...input, microCheckPercent: calculatePersistedChapter18MicroCheckPercent(rows) }
}
