'use client'

import { useState, useMemo } from 'react'
import { MissedQuestion } from '@/types'
import {
  filterMissedQuestions,
  getUniqueCategories,
  getUniqueChapters,
} from '@/lib/missed-questions'
import { Search, Filter, BookOpen, RotateCcw, XCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface MissedQuestionBankProps {
  questions: MissedQuestion[]
}

export default function MissedQuestionBank({ questions }: MissedQuestionBankProps) {
  const [chapterFilter, setChapterFilter] = useState<number | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const categories = useMemo(() => getUniqueCategories(questions), [questions])
  const chapters = useMemo(() => getUniqueChapters(questions), [questions])

  const filtered = useMemo(() => {
    return filterMissedQuestions(questions, {
      chapterNumber: chapterFilter === 'all' ? undefined : chapterFilter,
      category: categoryFilter === 'all' ? undefined : categoryFilter,
      search: search.trim() || undefined,
    })
  }, [questions, chapterFilter, categoryFilter, search])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search missed questions..."
              className="w-full bg-gray-950 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={chapterFilter}
                onChange={(e) =>
                  setChapterFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))
                }
                className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="all">All Chapters</option>
                {chapters.map((ch) => (
                  <option key={ch.number} value={ch.number}>
                    {ch.title}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            Showing {filtered.length} of {questions.length} missed question
            {questions.length === 1 ? '' : 's'}
          </p>
          <Link
            href="/dashboard/missed-questions/retest"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-gray-950 font-semibold rounded-lg hover:bg-[#F4E4A6] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retest Weak Areas
          </Link>
        </div>
      </div>

      {/* Questions */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((q) => (
            <div
              key={q.id}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                className="w-full p-5 text-left hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded">
                        Ch. {q.chapterNumber}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded">
                        {q.category}
                      </span>
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                        Missed {q.timesMissed}x
                      </span>
                    </div>
                    <p className="text-white font-medium">{q.question}</p>
                  </div>
                  <div className="text-gray-500 text-sm shrink-0">
                    {new Date(q.missedAt).toLocaleDateString()}
                  </div>
                </div>
              </button>

              {expandedId === q.id && (
                <div className="px-5 pb-5 border-t border-gray-800 pt-4 space-y-3">
                  <div className="flex items-start gap-2 text-red-400">
                    <XCircle className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Your answer</p>
                      <p className="text-sm">{q.studentAnswer}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Correct answer</p>
                      <p className="text-sm">{q.correctAnswer}</p>
                    </div>
                  </div>
                  {q.explanation && (
                    <div className="flex items-start gap-2 text-gray-300">
                      <BookOpen className="w-5 h-5 shrink-0 text-[#D4AF37]" />
                      <div>
                        <p className="text-sm font-medium text-[#D4AF37]">Explanation</p>
                        <p className="text-sm">{q.explanation}</p>
                      </div>
                    </div>
                  )}
                  <div className="pt-2">
                    <Link
                      href={`/dashboard/chapters/${q.chapterNumber}`}
                      className="inline-flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#F4E4A6] font-medium"
                    >
                      Study Chapter {q.chapterNumber}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-400 font-medium">No missed questions match your filters.</p>
          <p className="text-sm text-gray-500 mt-2">
            {questions.length > 0
              ? 'Try adjusting your search or filters.'
              : 'Great job — you have no missed questions!'}
          </p>
        </div>
      )}
    </div>
  )
}
