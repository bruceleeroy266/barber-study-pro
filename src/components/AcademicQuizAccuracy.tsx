import type { NullableChapterAcademicScore } from '@/lib/analytics/nullable-chapter-scores'
import type { ChapterMeta } from '@/lib/analytics/types'

/** Shared display for student and instructor academic accuracy (not completion). */
export default function AcademicQuizAccuracy({
  chapters,
  scores,
}: {
  chapters: readonly ChapterMeta[]
  scores: readonly NullableChapterAcademicScore[]
}) {
  const names = new Map(chapters.map(chapter => [chapter.id, chapter.title]))
  return (
    <section aria-label="Academic quiz scores" className="rounded-xl border border-graphite p-5">
      <h2 className="text-xl font-semibold">Academic quiz accuracy</h2>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Scores represent correct answers, not chapter completion. Latest and best attempts are reported separately.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-graphite">
            <th scope="col" className="p-2">Chapter</th>
            <th scope="col" className="p-2">Latest</th>
            <th scope="col" className="p-2">Best</th>
            <th scope="col" className="p-2">Attempts</th>
          </tr></thead>
          <tbody>{scores.map(score => (
            <tr key={score.chapterId} className="border-b border-graphite">
              <th scope="row" className="p-2 font-normal">{names.get(score.chapterId) ?? score.chapterId}</th>
              <td className="p-2">{score.latestPercent === null ? 'Not assessed' : `${score.latestPercent}% (${score.latestCorrect}/${score.latestTotal})`}</td>
              <td className="p-2">{score.bestPercent === null ? 'Not assessed' : `${score.bestPercent}%`}</td>
              <td className="p-2">{score.attemptCount}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  )
}
