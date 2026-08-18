/**
 * MISSED QUESTION BANK
 * ASCYN PRO / ASCYN PRO V2
 *
 * Utilities for storing, filtering, and retaking missed questions.
 *
 * Persistence: missed questions are now stored in Supabase so they survive
 * logout/login and work across devices. localStorage is kept as a transparent
 * read-fallback when Supabase is unavailable.
 */

import { supabase } from '@/lib/supabase'
import { isSupabaseConfigured } from '@/lib/demo-helpers'
import { MissedQuestion, QuizQuestion } from '@/types'

const STORAGE_KEY = 'ascyn_missed_questions'

export interface FilterOptions {
  chapterNumber?: number
  category?: string
  search?: string
}

export interface MissedQuestionInput {
  userId: string
  questionId: string
  quizId: string
  question: string
  correctAnswer: string
  studentAnswer: string
  explanation: string | null
  chapterId: string
  chapterNumber: number | null
  category: string
}

interface DbMissedQuestion {
  id: string
  user_id: string
  question_id: string
  quiz_id: string
  question_text: string
  correct_answer: string
  student_answer: string
  explanation: string | null
  chapter_id: string | null
  chapter_number: number | null
  category: string | null
  times_missed: number
  missed_at: string
  retaken_at: string | null
  created_at: string
  updated_at: string
}

function dbToMissedQuestion(row: DbMissedQuestion): MissedQuestion {
  return {
    id: row.id,
    userId: row.user_id,
    questionId: row.question_id,
    quizId: row.quiz_id,
    question: row.question_text,
    correctAnswer: row.correct_answer,
    studentAnswer: row.student_answer,
    explanation: row.explanation,
    chapterId: row.chapter_id ?? '',
    chapterNumber: row.chapter_number ?? 0,
    category: row.category ?? 'General',
    missedAt: row.missed_at,
    retakenAt: row.retaken_at,
    timesMissed: row.times_missed,
  }
}

export async function loadMissedQuestions(userId: string): Promise<MissedQuestion[]> {
  if (!isSupabaseConfigured()) {
    return loadLocalMissedQuestions(userId)
  }

  const { data, error } = await supabase
    .from('missed_questions')
    .select('*')
    .eq('user_id', userId)
    .order('missed_at', { ascending: false })

  if (error) {
    console.error('[MissedQuestions] Failed to load from Supabase:', error)
    return loadLocalMissedQuestions(userId)
  }

  return (data as DbMissedQuestion[] | null)?.map(dbToMissedQuestion) ?? []
}

export function loadLocalMissedQuestions(userId: string): MissedQuestion[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
    if (!raw) return []
    return JSON.parse(raw) as MissedQuestion[]
  } catch {
    return []
  }
}

export async function saveMissedQuestions(
  userId: string,
  inputs: MissedQuestionInput[]
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    saveLocalMissedQuestions(userId, inputs)
    return { ok: true }
  }

  // Two-step upsert: increment times_missed for existing records, insert new ones.
  // We use the unique (user_id, question_id) constraint to avoid duplicates.
  const questionIds = inputs.map((i) => i.questionId)

  // Step 1: Fetch existing records to determine current times_missed values.
  const { data: existingRows, error: fetchError } = await supabase
    .from('missed_questions')
    .select('question_id, times_missed')
    .eq('user_id', userId)
    .in('question_id', questionIds)

  if (fetchError) {
    console.error('[MissedQuestions] Failed to fetch existing records:', fetchError)
    return { ok: false, error: fetchError.message }
  }

  const existingMap = new Map(
    (existingRows as { question_id: string; times_missed: number }[] | null)?.map(
      (r) => [r.question_id, r.times_missed]
    ) ?? []
  )

  const now = new Date().toISOString()
  const toInsert: Record<string, unknown>[] = []
  const toUpdate: { question_id: string; times_missed: number }[] = []

  for (const input of inputs) {
    const existingTimesMissed = existingMap.get(input.questionId)
    if (existingTimesMissed !== undefined) {
      // Existing record: increment times_missed
      toUpdate.push({
        question_id: input.questionId,
        times_missed: existingTimesMissed + 1,
      })
    } else {
      // New record: insert with times_missed = 1
      toInsert.push({
        user_id: userId,
        question_id: input.questionId,
        quiz_id: input.quizId,
        question_text: input.question,
        correct_answer: input.correctAnswer,
        student_answer: input.studentAnswer,
        explanation: input.explanation,
        chapter_id: input.chapterId,
        chapter_number: input.chapterNumber,
        category: input.category,
        times_missed: 1,
        missed_at: now,
      })
    }
  }

  // Step 2a: Insert new records
  if (toInsert.length > 0) {
    const { error: insertError } = await supabase
      .from('missed_questions')
      .insert(toInsert)

    if (insertError) {
      console.error('[MissedQuestions] Failed to insert new records:', insertError)
      return { ok: false, error: insertError.message }
    }
  }

  // Step 2b: Update existing records (increment times_missed, refresh missed_at)
  for (const update of toUpdate) {
    const { error: updateError } = await supabase
      .from('missed_questions')
      .update({
        times_missed: update.times_missed,
        missed_at: now,
        student_answer: inputs.find((i) => i.questionId === update.question_id)?.studentAnswer,
        correct_answer: inputs.find((i) => i.questionId === update.question_id)?.correctAnswer,
        explanation: inputs.find((i) => i.questionId === update.question_id)?.explanation,
      })
      .eq('user_id', userId)
      .eq('question_id', update.question_id)

    if (updateError) {
      console.error('[MissedQuestions] Failed to update record:', updateError)
      return { ok: false, error: updateError.message }
    }
  }

  return { ok: true }
}

export function saveLocalMissedQuestions(
  userId: string,
  inputs: MissedQuestionInput[]
): void {
  if (typeof window === 'undefined') return
  try {
    const existing = loadLocalMissedQuestions(userId)
    const merged = [...existing]

    for (const input of inputs) {
      const idx = merged.findIndex((q) => q.questionId === input.questionId)
      if (idx >= 0) {
        merged[idx] = {
          ...merged[idx],
          studentAnswer: input.studentAnswer,
          correctAnswer: input.correctAnswer,
          explanation: input.explanation,
          missedAt: new Date().toISOString(),
          timesMissed: (merged[idx].timesMissed || 1) + 1,
        }
      } else {
        merged.push({
          id: `local-${input.questionId}`,
          userId,
          questionId: input.questionId,
          quizId: input.quizId,
          question: input.question,
          correctAnswer: input.correctAnswer,
          studentAnswer: input.studentAnswer,
          explanation: input.explanation,
          chapterId: input.chapterId,
          chapterNumber: input.chapterNumber ?? 0,
          category: input.category,
          missedAt: new Date().toISOString(),
          retakenAt: null,
          timesMissed: 1,
        })
      }
    }

    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(merged))
  } catch {
    // Ignore storage errors
  }
}

export function filterMissedQuestions(
  questions: MissedQuestion[],
  options: FilterOptions
): MissedQuestion[] {
  return questions.filter((q) => {
    if (options.chapterNumber !== undefined && q.chapterNumber !== options.chapterNumber) {
      return false
    }
    if (options.category && q.category !== options.category) {
      return false
    }
    if (options.search) {
      const term = options.search.toLowerCase()
      const match =
        q.question.toLowerCase().includes(term) ||
        q.category.toLowerCase().includes(term) ||
        q.correctAnswer.toLowerCase().includes(term)
      if (!match) return false
    }
    return true
  })
}

export function getUniqueCategories(questions: MissedQuestion[]): string[] {
  return Array.from(new Set(questions.map((q) => q.category))).sort()
}

export function getUniqueChapters(
  questions: MissedQuestion[]
): { number: number; title: string }[] {
  const map = new Map<number, string>()
  for (const q of questions) {
    if (!map.has(q.chapterNumber)) {
      map.set(q.chapterNumber, `Chapter ${q.chapterNumber}`)
    }
  }
  return Array.from(map.entries())
    .map(([number]) => ({ number, title: `Chapter ${number}` }))
    .sort((a, b) => a.number - b.number)
}

export async function markMissedQuestionRetaken(
  userId: string,
  questionId: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: true }
  }

  const { error } = await supabase
    .from('missed_questions')
    .update({ retaken_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('question_id', questionId)

  if (error) {
    console.error('[MissedQuestions] Failed to mark retaken:', error)
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

export function missedQuestionToQuizQuestion(missed: MissedQuestion): QuizQuestion {
  return {
    id: missed.questionId,
    quiz_id: missed.quizId,
    question: missed.question,
    answer_a: missed.correctAnswer,
    answer_b: missed.studentAnswer,
    answer_c: 'Option C',
    answer_d: 'Option D',
    correct_answer: 'a',
    explanation: missed.explanation,
    difficulty: 'medium',
    order_index: 1,
  }
}

export function buildWeakAreaQuiz(
  missedQuestions: MissedQuestion[],
  limit = 20
): QuizQuestion[] {
  return missedQuestions.slice(0, limit).map((m, idx) => ({
    id: `weak-${m.questionId}`,
    quiz_id: `weak-area-quiz`,
    question: m.question,
    answer_a: m.correctAnswer,
    answer_b: m.studentAnswer,
    answer_c: 'Neither',
    answer_d: 'Both',
    correct_answer: 'a',
    explanation: m.explanation,
    difficulty: 'medium',
    order_index: idx + 1,
  }))
}
