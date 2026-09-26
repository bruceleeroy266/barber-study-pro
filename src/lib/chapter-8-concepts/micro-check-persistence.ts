import { supabase } from '@/lib/supabase'
import type { Chapter8ConceptFamilyId } from './types'
import type { Chapter8EvidenceRecord, Chapter8GradeInput, Chapter8Confidence } from './grading'
import { calculateChapter8ConceptMastery } from './grading'
import type { Chapter8MicroCheck, Chapter8MicroCheckAnswer, Chapter8MicroCheckQuestion } from './micro-checks'

export interface Chapter8MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-8'
  check_id: string
  question_id: string
  concept_id: Chapter8ConceptFamilyId
  difficulty: Chapter8MicroCheckQuestion['difficulty']
  selected_answer: Chapter8MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

export async function loadChapter8MicroCheckAttempts(userId: string): Promise<Chapter8MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-8')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C8 micro-check] Failed to load attempts:', error.message)
    return []
  }
  return (data ?? []) as Chapter8MicroCheckAttemptRow[]
}

export async function persistChapter8MicroCheckAttempt(
  userId: string,
  check: Chapter8MicroCheck,
  question: Chapter8MicroCheckQuestion,
  selectedAnswer: Chapter8MicroCheckAnswer,
): Promise<{ row: Chapter8MicroCheckAttemptRow | null; alreadyRecorded: boolean; error: string | null }> {
  if (check.conceptFamilyId !== question.conceptFamilyId) {
    return { row: null, alreadyRecorded: false, error: 'Concept mapping mismatch.' }
  }

  const payload = {
    user_id: userId,
    chapter_id: 'ch-8',
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

  if (!error && data) return { row: data as Chapter8MicroCheckAttemptRow, alreadyRecorded: false, error: null }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await supabase
      .from('chapter_micro_check_attempts')
      .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
      .eq('user_id', userId)
      .eq('chapter_id', 'ch-8')
      .eq('question_id', question.id)
      .maybeSingle()
    return {
      row: (existing ?? null) as Chapter8MicroCheckAttemptRow | null,
      alreadyRecorded: true,
      error: existingError?.message ?? null,
    }
  }

  return { row: null, alreadyRecorded: false, error: error?.message ?? 'Unable to save micro-check answer.' }
}

export function chapter8MicroCheckRowsToEvidence(
  rows: readonly Chapter8MicroCheckAttemptRow[],
): Chapter8EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-8',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export function calculatePersistedChapter8MicroCheckPercent(
  rows: readonly Chapter8MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export interface Chapter8MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter8ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter8Confidence
}

const CHAPTER8_CONCEPT_IDS: readonly Chapter8ConceptFamilyId[] = [
  'ch8-electricity-circuits','ch8-current-conversion','ch8-electrical-measurements',
  'ch8-equipment-safety','ch8-electrotherapy-terminology','ch8-galvanic-current',
  'ch8-microcurrent-high-frequency','ch8-electromagnetic-spectrum','ch8-light-modalities',
  'ch8-light-therapy-safety',
]

export function buildChapter8MicroCheckDiagnostics(
  rows: readonly Chapter8MicroCheckAttemptRow[],
  referenceTime: string,
): Chapter8MicroCheckConceptDiagnostic[] {
  const evidence = chapter8MicroCheckRowsToEvidence(rows)
  return CHAPTER8_CONCEPT_IDS.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const mastery = calculateChapter8ConceptMastery(
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

export function withPersistedChapter8MicroCheckGrade(
  input: Chapter8GradeInput,
  rows: readonly Chapter8MicroCheckAttemptRow[],
): Chapter8GradeInput {
  return { ...input, microCheckPercent: calculatePersistedChapter8MicroCheckPercent(rows) }
}
