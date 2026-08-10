'use client'

import Link from 'next/link'
import { RotateCcw, BookOpen, Layers, MessageSquare, Target } from 'lucide-react'
import type {
  ChapterRemediationPath,
  ChapterCompetency,
  ChapterTheme,
} from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface RemediationPanelProps {
  remediation: ChapterRemediationPath[]
  competencies: ChapterCompetency[]
  missedQuestionIds?: string[]
  chapterNumber?: number
  theme?: ChapterTheme
  onRetryQuiz?: () => void
}

export default function RemediationPanel({
  remediation,
  competencies,
  missedQuestionIds = [],
  chapterNumber,
  theme,
  onRetryQuiz,
}: RemediationPanelProps) {
  const t = theme || defaultTheme

  // Identify weak competencies from missed questions.
  const weakRemediation = missedQuestionIds.length
    ? remediation.filter((item) =>
        item.boardQuestionIds.some((id) => missedQuestionIds.includes(id))
      )
    : remediation

  if (weakRemediation.length === 0) {
    return null
  }

  const getCompetency = (competencyId: string) =>
    competencies.find((c) => c.id === competencyId)

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: t.backgroundAlt,
        borderColor: t.border,
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      <div
        className="p-6"
        style={{
          background: `linear-gradient(135deg, ${t.primary}10, ${t.primary}04)`,
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6" style={{ color: t.primary }} aria-hidden="true" />
          <div>
            <h3 className="text-lg font-semibold" style={{ color: t.text }}>
              Remediation Review
            </h3>
            <p className="text-sm" style={{ color: t.textMuted }}>
              Focus on these concepts before retaking the quiz.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {weakRemediation.map((item) => {
          const competency = getCompetency(item.competencyId)
          return (
            <div
              key={item.id}
              className="rounded-xl p-5"
              style={{
                backgroundColor: t.background,
                borderColor: t.border,
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                <BookOpen className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: t.primary }} aria-hidden="true" />
                <div>
                  <h4 className="font-semibold" style={{ color: t.text }}>
                    {competency?.title || 'Concept Review'}
                  </h4>
                  {competency && (
                    <p className="text-sm mt-1" style={{ color: t.textMuted }}>
                      {competency.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4 mt-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: t.primary }} aria-hidden="true" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: t.primary }}>
                      Coaching Guidance
                    </p>
                    <p className="text-sm mt-1" style={{ color: t.textMuted }}>
                      {item.instructorNote}
                    </p>
                  </div>
                </div>

                {item.lessonIds.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Layers className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: t.primary }} aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: t.primary }}>
                        Recommended Review
                      </p>
                      <p className="text-sm mt-1" style={{ color: t.textMuted }}>
                        Revisit the lesson sections for this competency, then review the related flashcards below.
                      </p>
                    </div>
                  </div>
                )}

                {item.flashcardIds.length > 0 && (
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: t.primary }} aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: t.primary }}>
                        Suggested Flashcards
                      </p>
                      <p className="text-sm mt-1" style={{ color: t.textMuted }}>
                        {item.flashcardIds.length} flashcard{item.flashcardIds.length === 1 ? '' : 's'} to study
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          {chapterNumber && (
            <Link
              href={`/dashboard/chapters/${chapterNumber}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
              style={{
                backgroundColor: t.background,
                color: t.text,
                borderColor: t.border,
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              Review Chapter
            </Link>
          )}
          {onRetryQuiz && (
            <button
              onClick={onRetryQuiz}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
              style={{
                background: `linear-gradient(135deg, ${t.primary}, ${t.primaryDark})`,
                color: 'var(--color-brand-white)',
              }}
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Retake Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
