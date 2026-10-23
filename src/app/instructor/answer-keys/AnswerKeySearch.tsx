'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

export interface AnswerKeySearchEntry {
  id: string
  chapterNumber: number
  chapterTitle: string
  questionNumber: number
  question: string
  answers: {
    a: string
    b: string
    c: string
    d: string
  }
  correctAnswer: 'a' | 'b' | 'c' | 'd'
  explanation: string
}

interface AnswerKeySearchProps {
  entries: AnswerKeySearchEntry[]
}

export default function AnswerKeySearch({ entries }: AnswerKeySearchProps) {
  const [query, setQuery] = useState('')
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const [showAllDetails, setShowAllDetails] = useState(false)

  const normalizedQuery = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!normalizedQuery) return []

    return entries.filter((entry) => {
      const correctText = entry.answers[entry.correctAnswer]
      const haystack = [
        entry.chapterTitle,
        `chapter ${entry.chapterNumber}`,
        `question ${entry.questionNumber}`,
        entry.question,
        entry.answers.a,
        entry.answers.b,
        entry.answers.c,
        entry.answers.d,
        correctText,
        entry.explanation,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedQuery)
    })
  }, [entries, normalizedQuery])

  return (
    <section className="bg-charcoal border border-graphite rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor="answer-key-search" className="text-sm font-semibold text-white">
          Search all chapter answer keys
        </label>
        <p className="text-sm text-silver">
          Search by question wording, topic, answer choice, correct answer, explanation, or chapter.
        </p>
      </div>

      <input
        id="answer-key-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search questions, answers, or topics..."
        className="w-full rounded-xl border border-graphite bg-black/40 px-4 py-3 text-white placeholder:text-silver focus:border-[var(--color-brand-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-gold)]"
      />

      {normalizedQuery && (
        <div className="mt-5">
          {results.length > 0 && (
            <button type="button" onClick={() => setShowAllDetails((value) => !value)} className="mb-3 min-h-11 rounded-lg border border-graphite px-4 py-2 text-sm text-white hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
              {showAllDetails ? "Collapse all coaching details" : "Expand all coaching details"}
            </button>
          )}
          <p className="text-sm text-silver mb-3">
            {results.length} {results.length === 1 ? 'match' : 'matches'}
          </p>

          {results.length === 0 ? (
            <div className="rounded-xl border border-graphite bg-black/20 p-5 text-sm text-silver">
              No answer-key matches found. Try a shorter keyword or concept name.
            </div>
          ) : (
            <div className="space-y-3 max-h-[36rem] overflow-y-auto pr-1">
              {results.map((entry) => (
                <article
                  key={entry.id}
                  className="min-w-0 rounded-xl border border-graphite bg-black/20 p-3 sm:p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-gold">
                        Chapter {entry.chapterNumber} · Question {entry.questionNumber}
                      </p>
                      <h3 className="text-base font-semibold text-white mt-1">
                        {entry.chapterTitle}
                      </h3>
                    </div>
                    <Link
                      href={`/instructor/answer-keys/${entry.chapterNumber}#${entry.id}`}
                      className="text-sm font-semibold text-gold hover:text-[var(--color-brand-gold-light)]"
                    >
                      Open in chapter →
                    </Link>
                  </div>

                  <p className="mt-3 text-sm text-light-gray leading-relaxed">
                    {entry.question}
                  </p>

                  <button type="button" aria-expanded={showAllDetails || expandedIds.includes(entry.id)} onClick={() => setExpandedIds((old) => old.includes(entry.id) ? old.filter((id) => id !== entry.id) : [...old, entry.id])} className="mt-3 min-h-11 w-full rounded-lg border border-graphite px-3 py-2 text-left text-sm font-medium text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                    {showAllDetails || expandedIds.includes(entry.id) ? "Hide answer and coaching" : "Show answer and coaching"}
                  </button>
                  {(showAllDetails || expandedIds.includes(entry.id)) && <div className="mt-4 rounded-lg border border-[var(--color-brand-gold)]/40 bg-[var(--color-brand-gold)]/10 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-gold mb-1">
                      Correct Answer
                    </p>
                    <p className="text-sm text-white">
                      <span className="font-bold uppercase mr-2">{entry.correctAnswer}.</span>
                      {entry.answers[entry.correctAnswer]}
                    </p>
                  </div>

                  {(showAllDetails || expandedIds.includes(entry.id)) && entry.explanation && (
                    <div className="mt-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-silver mb-1">
                        Explanation
                      </p>
                      <p className="text-sm text-silver leading-relaxed">
                        {entry.explanation}
                      </p>
                    </div>
                  )}
                  {(showAllDetails || expandedIds.includes(entry.id)) && (
                    <div className="mt-3 rounded-lg border border-graphite p-3 text-sm text-silver">
                      <p className="font-semibold text-white">Instructor coaching prompt</p>
                      <p className="mt-1">Ask the learner to explain the underlying concept, compare the options, and justify their reasoning before discussing the answer. This is general guidance, not an academically validated question-specific hint.</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
