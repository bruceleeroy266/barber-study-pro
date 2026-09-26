import { supabase } from '@/lib/supabase'
import type { Chapter7ConceptFamilyId } from './types'
import { CHAPTER7_CONCEPT_FAMILY_IDS } from './concepts'
import type { Chapter7EvidenceRecord, Chapter7Confidence } from './grading'
import { calculateChapter7ConceptMastery } from './grading'
import type {
  Chapter7MicroCheck,
  Chapter7MicroCheckAnswer,
  Chapter7MicroCheckQuestion,
} from './micro-checks'

export interface Chapter7MicroCheckAttemptRow {
  id: string
  user_id: string
  chapter_id: 'ch-7'
  check_id: string
  question_id: string
  concept_id: Chapter7ConceptFamilyId
  difficulty: Chapter7MicroCheckQuestion['difficulty']
  selected_answer: Chapter7MicroCheckAnswer
  is_correct: boolean
  answered_at: string
  created_at: string
}

export interface Chapter7MicroCheckPersistResult {
  row: Chapter7MicroCheckAttemptRow | null
  alreadyRecorded: boolean
  error: string | null
}

export async function loadChapter7MicroCheckAttempts(
  userId: string,
): Promise<Chapter7MicroCheckAttemptRow[]> {
  const { data, error } = await supabase
    .from('chapter_micro_check_attempts')
    .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
    .eq('user_id', userId)
    .eq('chapter_id', 'ch-7')
    .order('answered_at', { ascending: true })

  if (error) {
    console.error('[C7 micro-check] Failed to load attempts:', error.message)
    return []
  }

  return (data ?? []) as Chapter7MicroCheckAttemptRow[]
}

export async function persistChapter7MicroCheckAttempt(
  userId: string,
  check: Chapter7MicroCheck,
  question: Chapter7MicroCheckQuestion,
  selectedAnswer: Chapter7MicroCheckAnswer,
): Promise<Chapter7MicroCheckPersistResult> {
  if (check.conceptFamilyId !== question.conceptFamilyId) {
    return { row: null, alreadyRecorded: false, error: 'Concept mapping mismatch.' }
  }

  const payload = {
    user_id: userId,
    chapter_id: 'ch-7',
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
    return {
      row: data as Chapter7MicroCheckAttemptRow,
      alreadyRecorded: false,
      error: null,
    }
  }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await supabase
      .from('chapter_micro_check_attempts')
      .select('id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at')
      .eq('user_id', userId)
      .eq('chapter_id', 'ch-7')
      .eq('question_id', question.id)
      .maybeSingle()

    return {
      row: (existing ?? null) as Chapter7MicroCheckAttemptRow | null,
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

export function chapter7MicroCheckRowsToEvidence(
  rows: readonly Chapter7MicroCheckAttemptRow[],
): Chapter7EvidenceRecord[] {
  return rows.map((row) => ({
    studentId: row.user_id,
    chapterId: 'ch-7',
    conceptFamilyId: row.concept_id,
    source: 'micro_check',
    itemId: row.question_id,
    difficulty: row.difficulty,
    correct: row.is_correct,
    attemptPhase: 'initial',
    timestamp: row.answered_at,
  }))
}

export interface Chapter7MicroCheckConceptDiagnostic {
  conceptFamilyId: Chapter7ConceptFamilyId
  answered: number
  correct: number
  percent: number
  masteryFromMicroChecks: number
  confidenceFromMicroChecks: Chapter7Confidence
}

export function calculatePersistedChapter7MicroCheckPercent(
  rows: readonly Chapter7MicroCheckAttemptRow[],
): number | null {
  if (rows.length === 0) return null
  const correct = rows.filter((row) => row.is_correct).length
  return Math.round((correct / rows.length) * 10000) / 100
}

export function buildChapter7MicroCheckDiagnostics(
  rows: readonly Chapter7MicroCheckAttemptRow[],
  referenceTime: string,
): Chapter7MicroCheckConceptDiagnostic[] {
  const evidence = chapter7MicroCheckRowsToEvidence(rows)

  return CHAPTER7_CONCEPT_FAMILY_IDS.map((conceptFamilyId) => {
    const conceptRows = rows.filter((row) => row.concept_id === conceptFamilyId)
    const conceptEvidence = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    const mastery = calculateChapter7ConceptMastery(conceptEvidence, referenceTime)
    const correct = conceptRows.filter((row) => row.is_correct).length

    return {
      conceptFamilyId,
      answered: conceptRows.length,
      correct,
      percent: conceptRows.length > 0 ? Math.round((correct / conceptRows.length) * 10000) / 100 : 0,
      masteryFromMicroChecks: mastery.mastery,
      confidenceFromMicroChecks: mastery.confidence,
    }
  })
}

export async function loadChapter7MicroCheckDiagnosticsForStudent(
  studentId: string,
  referenceTime: string,
): Promise<{
  microCheckPercent: number | null
  evidence: Chapter7EvidenceRecord[]
  concepts: Chapter7MicroCheckConceptDiagnostic[]
}> {
  const rows = await loadChapter7MicroCheckAttempts(studentId)
  return {
    microCheckPercent: calculatePersistedChapter7MicroCheckPercent(rows),
    evidence: chapter7MicroCheckRowsToEvidence(rows),
    concepts: buildChapter7MicroCheckDiagnostics(rows, referenceTime),
  }
}
