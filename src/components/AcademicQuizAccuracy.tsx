'use client'

import { academicScoreCsv } from '@/lib/analytics/academic-score-csv'
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
  const downloadCsv = () => {
    const blob = new Blob(['\\uFEFF' + academicScoreCsv(chapters, scores)], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'academic-quiz-accuracy.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }
  return (
    <section aria-label="Academic quiz scores" className="rounded-xl border border-graphite p-5">
      <h2 className="text-xl font-semibold">Academic quiz accuracy</h2>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Scores represent correct answers, not chapter completion. Latest and best attempts are reported separately.
      </p>
      <button type="button" onClick={downloadCsv} className="mt-3 rounded-lg border border-graphite px-3 py-2 text-sm font-semibold">Download academic accuracy CSV</button>
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
              <td className="p-2">{score.attemptCount}{score.invalidAttemptCount > 0 && <span className="block text-amber-500"> {score.invalidAttemptCount} inconsistent record(s) excluded</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  )
}
