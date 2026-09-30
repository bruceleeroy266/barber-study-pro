import { supabase } from '@/lib/supabase'
import { CHAPTER16_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter16ConceptFamilyId } from './types'
import type { Chapter16EvidenceRecord, Chapter16GradeInput, Chapter16Confidence } from './grading'
import { calculateChapter16ConceptMastery } from './grading'
import type {
  Chapter16MicroCheck,
  Chapter16MicroCheckAnswer,
  Chapter16MicroCheckQuestion,
} from './micro-checks'

export interface Chapter16MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-16'
  check_id: string
  question_id: string
  concept_id: Chapter16ConceptFamilyId
  difficulty: Chapter16MicroCheckQuestion['difficulty']
  selected_answer: Chapter16MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

const columns = 'id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at'

export async function loadChapter16MicroCheckAttempts(userId: string): Promise<Chapter16MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select(columns)
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-16')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C16 micro-check] Failed to load attempts:', error.message)
    return []
  }
  return (data ?? []) as Chapter16MicroCheckAttemptRow[]
}

export async function persistChapter16MicroCheckAttempt(
  userId: string,
  check: Chapter16MicroCheck,
  question: Chapter16MicroCheckQuestion,
  selectedAnswer: Chapter16MicroCheckAnswer,
): Promise<{ row: Chapter16MicroCheckAttemptRow | null; alreadyRecorded: boolean; error: string | null }> {
  if (check.conceptFamilyId !== question.conceptFamilyId) {
    return { row: null, alreadyRecorded: false, error: 'Concept mapping mismatch.' }
  }

  const payload = {
    user_id: userId,
    chapter_id: 'ch-16',
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

  if (!error && data) return { row: data as Chapter16MicroCheckAttemptRow, alreadyRecorded: false, error: null }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await supabase
      .from('chapter_micro_check_attempts')
      .select(columns)
      .eq('user_id', userId)
      .eq('chapter_id', 'ch-16')
      .eq('question_id', question.id)
      .maybeSingle()

    return {
      row: (existing ?? null) as Chapter16MicroCheckAttemptRow | null,
      alreadyRecorded: true,
      error: existingError?.message ?? null,
    }
  }

  return { row: null, alreadyRecorded: false, error: error?.message ?? 'Unable to save micro-check answer.' }
}

export function chapter16MicroCheckRowsToEvidence(
  rows: readonly Chapter16MicroCheckAttemptRow[],
): Chapter16EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-16',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter16MicroCheckPercent(
  rows: readonly Chapter16MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter16MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter16ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter16Confidence
}

export function buildChapter16MicroCheckDiagnostics(
  rows: readonly Chapter16MicroCheckAttemptRow[],
  referenceTime: string,
): Chapter16MicroCheckConceptDiagnostic[] {
  const evidence = chapter16MicroCheckRowsToEvidence(rows)
  return CHAPTER16_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter16ConceptMastery(
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

export function withPersistedChapter16MicroCheckGrade(
  input: Chapter16GradeInput,
  rows: readonly Chapter16MicroCheckAttemptRow[],
): Chapter16GradeInput {
  return { ...input, microCheckPercent: calculatePersistedChapter16MicroCheckPercent(rows) }
}
