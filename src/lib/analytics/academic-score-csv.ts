import type { NullableChapterAcademicScore } from './nullable-chapter-scores'
import type { ChapterMeta } from './types'

/**
 * One deterministic export representation for the same academic scores used
 * by student and instructor displays. This function accepts already-authorized
 * analytics only; permissions remain the responsibility of the caller.
 */
export function academicScoreCsv(
  chapters: readonly ChapterMeta[],
  scores: readonly NullableChapterAcademicScore[],
): string {
  const names = new Map(chapters.map(ch => [ch.id, ch.title]))
  const quote = (v: string | number | null) => {
    const text = v === null ? 'Not assessed' : String(v)
    return '"' + text.replace(/"/g, '""') + '"'
  }
  const header = ['Chapter ID', 'Chapter', 'Latest quiz accuracy', 'Best quiz accuracy',
    'First quiz accuracy', 'Latest correct', 'Latest total', 'Quiz attempts', 'Evidence state']
  const rows = scores.map(score => [
    score.chapterId,
    names.get(score.chapterId) ?? score.chapterId,
    score.latestPercent,
    score.bestPercent,
    score.firstPercent,
    score.latestCorrect,
    score.latestTotal,
    score.attemptCount,
    score.state,
  ])
  return [header, ...rows].map(row => row.map(quote).join(',')).join('\r\n') + '\r\n'
}
