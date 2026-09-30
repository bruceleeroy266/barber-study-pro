import { supabase } from '@/lib/supabase'
import {
  getFlashcardEvidenceInventory,
  getScenarioEvidenceInventory,
  isUnifiedActivityEvidenceChapter,
} from './activity-evidence-registry'

export type ChapterActivityEvidenceSource = 'flashcard' | 'scenario_application'

export interface ChapterActivityEvidenceRow {
  id: string
  user_id: string
  chapter_id: string
  concept_id: string
  source: ChapterActivityEvidenceSource
  item_id: string
  selected_answer: string | null
  is_correct: boolean
  answered_at: string
  created_at: string
}

export interface ChapterActivityEvidenceInsert {
  userId: string
  chapterId: string
  conceptId: string
  source: ChapterActivityEvidenceSource
  itemId: string
  selectedAnswer?: string | null
  isCorrect: boolean
}

export interface ActivityEvidencePercent {
  percent: number | null
  correctCount: number
  evidencedCount: number
  totalEligibleCount: number
  coveragePercent: number
}

function round(value: number) {
  return Math.round(value * 100) / 100
}

export function calculateActivityEvidencePercent(
  rows: readonly ChapterActivityEvidenceRow[],
  source: ChapterActivityEvidenceSource,
  eligibleItemIds: readonly string[],
): ActivityEvidencePercent {
  const eligible = new Set(eligibleItemIds)
  const unique = new Map<string, ChapterActivityEvidenceRow>()

  for (const row of rows) {
    if (row.source !== source || !eligible.has(row.item_id) || unique.has(row.item_id)) continue
    unique.set(row.item_id, row)
  }

  const totalEligibleCount = eligible.size
  const evidencedCount = unique.size
  const correctCount = [...unique.values()].filter((row) => row.is_correct).length
  const coveragePercent = totalEligibleCount > 0 ? round((evidencedCount / totalEligibleCount) * 100) : 0

  return {
    percent: totalEligibleCount > 0 ? round((correctCount / totalEligibleCount) * 100) : null,
    correctCount,
    evidencedCount,
    totalEligibleCount,
    coveragePercent,
  }
}

export function calculateChapterFlashcardStudyPercent(
  chapterId: string,
  rows: readonly ChapterActivityEvidenceRow[],
) {
  return calculateActivityEvidencePercent(rows, 'flashcard', getFlashcardEvidenceInventory(chapterId))
}

export function calculateChapterScenarioApplicationPercent(
  chapterId: string,
  rows: readonly ChapterActivityEvidenceRow[],
) {
  return calculateActivityEvidencePercent(rows, 'scenario_application', getScenarioEvidenceInventory(chapterId))
}

export async function loadChapterActivityEvidence(
  userId: string,
  chapterId: string,
): Promise<ChapterActivityEvidenceRow[]> {
  if (!isUnifiedActivityEvidenceChapter(chapterId)) return []

  const { data, error } = await supabase
    .from('chapter_activity_evidence')
    .select('*')
    .eq('user_id', userId)
    .eq('chapter_id', chapterId)
    .order('answered_at', { ascending: true })

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[activity-evidence] load failed:', error.message)
    }
    return []
  }

  return (data ?? []) as ChapterActivityEvidenceRow[]
}

export async function persistChapterActivityEvidence(
  input: ChapterActivityEvidenceInsert,
): Promise<ChapterActivityEvidenceRow | null> {
  if (!isUnifiedActivityEvidenceChapter(input.chapterId)) return null

  if (input.chapterId === 'ch-19' || input.chapterId === 'ch-20') {
    try {
      const response = await fetch(`/api/${input.chapterId === 'ch-19' ? 'chapter-19' : 'chapter-20'}/activity-evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: input.source,
          itemId: input.itemId,
          selectedAnswer: input.selectedAnswer ?? null,
        }),
      })
      const body = (await response.json().catch(() => ({}))) as {
        row?: ChapterActivityEvidenceRow | null
        error?: string
      }

      if (!response.ok) {
        console.error(
          '[activity-evidence] authoritative persist failed:',
          body.error ?? response.statusText,
        )
        return null
      }

      return body.row ?? null
    } catch (error) {
      console.error(
        '[activity-evidence] authoritative persist failed:',
        error instanceof Error ? error.message : String(error),
      )
      return null
    }
  }

  const payload = {
    user_id: input.userId,
    chapter_id: input.chapterId,
    concept_id: input.conceptId,
    source: input.source,
    item_id: input.itemId,
    selected_answer: input.selectedAnswer ?? null,
    is_correct: input.isCorrect,
  }

  const { data, error } = await supabase
    .from('chapter_activity_evidence')
    .insert(payload)
    .select('*')
    .single()

  if (!error) return data as ChapterActivityEvidenceRow

  // First-attempt evidence is immutable. A duplicate means the original
  // evidence already exists, so return that row instead of overwriting it.
  if (error.code === '23505') {
    const { data: existing, error: readError } = await supabase
      .from('chapter_activity_evidence')
      .select('*')
      .eq('user_id', input.userId)
      .eq('chapter_id', input.chapterId)
      .eq('source', input.source)
      .eq('item_id', input.itemId)
      .maybeSingle()

    if (readError) {
      console.error('[activity-evidence] duplicate read failed:', readError.message)
      return null
    }
    return (existing ?? null) as ChapterActivityEvidenceRow | null
  }

  console.error('[activity-evidence] persist failed:', error.message)
  return null
}
