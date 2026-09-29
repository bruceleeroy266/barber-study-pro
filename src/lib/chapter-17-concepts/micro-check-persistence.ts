import { supabase } from '@/lib/supabase'
import { CHAPTER17_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter17ConceptFamilyId } from './types'
import type { Chapter17EvidenceRecord, Chapter17GradeInput, Chapter17Confidence } from './grading'
import { calculateChapter17ConceptMastery } from './grading'
import type {
  Chapter17MicroCheck,
  Chapter17MicroCheckAnswer,
  Chapter17MicroCheckQuestion,
} from './micro-checks'

export interface Chapter17MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-17'
  check_id: string
  question_id: string
  concept_id: Chapter17ConceptFamilyId
  difficulty: Chapter17MicroCheckQuestion['difficulty']
  selected_answer: Chapter17MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

const columns = 'id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at'

export async function loadChapter17MicroCheckAttempts(userId: string): Promise<Chapter17MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select(columns)
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-17')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C17 micro-check] Failed to load attempts:', error.message)
    return []
  }
  return (data ?? []) as Chapter17MicroCheckAttemptRow[]
}

export async function persistChapter17MicroCheckAttempt(
  userId: string,
  check: Chapter17MicroCheck,
  question: Chapter17MicroCheckQuestion,
  selectedAnswer: Chapter17MicroCheckAnswer,
): Promise<{ row: Chapter17MicroCheckAttemptRow | null; alreadyRecorded: boolean; error: string | null }> {
  if (check.conceptFamilyId !== question.conceptFamilyId) {
    return { row: null, alreadyRecorded: false, error: 'Concept mapping mismatch.' }
  }

  const payload = {
    user_id: userId,
    chapter_id: 'ch-17',
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

  if (!error && data) return { row: data as Chapter17MicroCheckAttemptRow, alreadyRecorded: false, error: null }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await supabase
      .from('chapter_micro_check_attempts')
      .select(columns)
      .eq('user_id', userId)
      .eq('chapter_id', 'ch-17')
      .eq('question_id', question.id)
      .maybeSingle()

    return {
      row: (existing ?? null) as Chapter17MicroCheckAttemptRow | null,
      alreadyRecorded: true,
      error: existingError?.message ?? null,
    }
  }

  return { row: null, alreadyRecorded: false, error: error?.message ?? 'Unable to save micro-check answer.' }
}

export function chapter17MicroCheckRowsToEvidence(
  rows: readonly Chapter17MicroCheckAttemptRow[],
): Chapter17EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-17',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter17MicroCheckPercent(
  rows: readonly Chapter17MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter17MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter17ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter17Confidence
}

export function buildChapter17MicroCheckDiagnostics(
  rows: readonly Chapter17MicroCheckAttemptRow[],
  referenceTime: string,
): Chapter17MicroCheckConceptDiagnostic[] {
  const evidence = chapter17MicroCheckRowsToEvidence(rows)
  return CHAPTER17_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter17ConceptMastery(
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

export function withPersistedChapter17MicroCheckGrade(
  input: Chapter17GradeInput,
  rows: readonly Chapter17MicroCheckAttemptRow[],
): Chapter17GradeInput {
  return { ...input, microCheckPercent: calculatePersistedChapter17MicroCheckPercent(rows) }
}
