import { supabase } from '@/lib/supabase'
import type { Chapter9ConceptFamilyId } from './types'
import type { Chapter9EvidenceRecord, Chapter9GradeInput, Chapter9Confidence } from './grading'
import { calculateChapter9ConceptMastery } from './grading'
import type { Chapter9MicroCheck, Chapter9MicroCheckAnswer, Chapter9MicroCheckQuestion } from './micro-checks'

export interface Chapter9MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-9'
  check_id: string
  question_id: string
  concept_id: Chapter9ConceptFamilyId
  difficulty: Chapter9MicroCheckQuestion['difficulty']
  selected_answer: Chapter9MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

export async function loadChapter9MicroCheckAttempts(userId: string): Promise<Chapter9MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-9')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C9 micro-check] Failed to load attempts:', error.message)
    return []
  }
  return (data ?? []) as Chapter9MicroCheckAttemptRow[]
}

export async function persistChapter9MicroCheckAttempt(
  userId: string,
  check: Chapter9MicroCheck,
  question: Chapter9MicroCheckQuestion,
  selectedAnswer: Chapter9MicroCheckAnswer,
): Promise<{ row: Chapter9MicroCheckAttemptRow | null; alreadyRecorded: boolean; error: string | null }> {
  if (check.conceptFamilyId !== question.conceptFamilyId) {
    return { row: null, alreadyRecorded: false, error: 'Concept mapping mismatch.' }
  }

  const payload = {
    user_id: userId,
    chapter_id: 'ch-9',
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

  if (!error && data) return { row: data as Chapter9MicroCheckAttemptRow, alreadyRecorded: false, error: null }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await supabase
      .from('chapter_micro_check_attempts')
      .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
      .eq('user_id', userId)
      .eq('chapter_id', 'ch-9')
      .eq('question_id', question.id)
      .maybeSingle()
    return {
      row: (existing ?? null) as Chapter9MicroCheckAttemptRow | null,
      alreadyRecorded: true,
      error: existingError?.message ?? null,
    }
  }

  return { row: null, alreadyRecorded: false, error: error?.message ?? 'Unable to save micro-check answer.' }
}

export function chapter9MicroCheckRowsToEvidence(
  rows: readonly Chapter9MicroCheckAttemptRow[],
): Chapter9EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-9',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter9MicroCheckPercent(
  rows: readonly Chapter9MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter9MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter9ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter9Confidence
}

const CHAPTER9_CONCEPT_IDS: readonly Chapter9ConceptFamilyId[] = [
  'ch9-epidermis-skin-barrier',
  'ch9-dermis-subcutaneous-support',
  'ch9-skin-functions-glands',
  'ch9-primary-lesions',
  'ch9-secondary-lesions',
  'ch9-sebaceous-sudoriferous-disorders',
  'ch9-inflammatory-infectious-conditions',
  'ch9-pigmentation-hypertrophies',
  'ch9-skin-cancer-recognition',
  'ch9-service-safety-referral',
]

export function buildChapter9MicroCheckDiagnostics(
  rows: readonly Chapter9MicroCheckAttemptRow[],
  referenceTime: string,
): Chapter9MicroCheckConceptDiagnostic[] {
  const evidence = chapter9MicroCheckRowsToEvidence(rows)
  return CHAPTER9_CONCEPT_IDS.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter9ConceptMastery(
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

export function withPersistedChapter9MicroCheckGrade(
  input: Chapter9GradeInput,
  rows: readonly Chapter9MicroCheckAttemptRow[],
): Chapter9GradeInput {
  return { ...input, microCheckPercent: calculatePersistedChapter9MicroCheckPercent(rows) }
}
