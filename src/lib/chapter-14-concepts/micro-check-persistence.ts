import { supabase } from '@/lib/supabase'
import { CHAPTER14_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter14ConceptFamilyId } from './types'
import type { Chapter14EvidenceRecord, Chapter14GradeInput, Chapter14Confidence } from './grading'
import { calculateChapter14ConceptMastery } from './grading'
import type {
  Chapter14MicroCheck,
  Chapter14MicroCheckAnswer,
  Chapter14MicroCheckQuestion,
} from './micro-checks'

export interface Chapter14MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-14'
  check_id: string
  question_id: string
  concept_id: Chapter14ConceptFamilyId
  difficulty: Chapter14MicroCheckQuestion['difficulty']
  selected_answer: Chapter14MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

const columns = 'id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at'

export async function loadChapter14MicroCheckAttempts(userId: string): Promise<Chapter14MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select(columns)
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-14')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C14 micro-check] Failed to load attempts:', error.message)
    return []
  }
  return (data ?? []) as Chapter14MicroCheckAttemptRow[]
}

export async function persistChapter14MicroCheckAttempt(
  userId: string,
  check: Chapter14MicroCheck,
  question: Chapter14MicroCheckQuestion,
  selectedAnswer: Chapter14MicroCheckAnswer,
): Promise<{ row: Chapter14MicroCheckAttemptRow | null; alreadyRecorded: boolean; error: string | null }> {
  if (check.conceptFamilyId !== question.conceptFamilyId) {
    return { row: null, alreadyRecorded: false, error: 'Concept mapping mismatch.' }
  }

  const payload = {
    user_id: userId,
    chapter_id: 'ch-14',
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

  if (!error && data) return { row: data as Chapter14MicroCheckAttemptRow, alreadyRecorded: false, error: null }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await supabase
      .from('chapter_micro_check_attempts')
      .select(columns)
      .eq('user_id', userId)
      .eq('chapter_id', 'ch-14')
      .eq('question_id', question.id)
      .maybeSingle()

    return {
      row: (existing ?? null) as Chapter14MicroCheckAttemptRow | null,
      alreadyRecorded: true,
      error: existingError?.message ?? null,
    }
  }

  return { row: null, alreadyRecorded: false, error: error?.message ?? 'Unable to save micro-check answer.' }
}

export function chapter14MicroCheckRowsToEvidence(
  rows: readonly Chapter14MicroCheckAttemptRow[],
): Chapter14EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-14',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter14MicroCheckPercent(
  rows: readonly Chapter14MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter14MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter14ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter14Confidence
}

export function buildChapter14MicroCheckDiagnostics(
  rows: readonly Chapter14MicroCheckAttemptRow[],
  referenceTime: string,
): Chapter14MicroCheckConceptDiagnostic[] {
  const evidence = chapter14MicroCheckRowsToEvidence(rows)
  return CHAPTER14_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter14ConceptMastery(
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

export function withPersistedChapter14MicroCheckGrade(
  input: Chapter14GradeInput,
  rows: readonly Chapter14MicroCheckAttemptRow[],
): Chapter14GradeInput {
  return { ...input, microCheckPercent: calculatePersistedChapter14MicroCheckPercent(rows) }
}
