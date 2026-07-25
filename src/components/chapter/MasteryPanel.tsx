'use client'

import { Trophy, Target, CheckCircle2, Circle, GraduationCap } from 'lucide-react'
import type {
  ChapterLearningObjective,
  ChapterCompetency,
  ChapterMasteryConfig,
  ChapterTheme,
} from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface MasteryPanelProps {
  learningObjectives?: ChapterLearningObjective[]
  competencies?: ChapterCompetency[]
  mastery?: ChapterMasteryConfig
  bestAttemptPercentage?: number | null
  theme?: ChapterTheme
}

export default function MasteryPanel({
  learningObjectives = [],
  competencies = [],
  mastery,
  bestAttemptPercentage,
  theme,
}: MasteryPanelProps) {
  const t = theme || defaultTheme

  const passingScore = mastery?.passingScore ?? 80
  const remediationThreshold = mastery?.remediationRequiredBelow ?? 80
  const passed = bestAttemptPercentage !== null && bestAttemptPercentage !== undefined && bestAttemptPercentage >= passingScore

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
          <Trophy className="w-6 h-6" style={{ color: t.primary }} aria-hidden="true" />
          <div>
            <h3 className="text-lg font-semibold" style={{ color: t.text }}>
              Mastery Expectations
            </h3>
            <p className="text-sm" style={{ color: t.textMuted }}>
              Passing score: {passingScore}% · Remediation suggested below: {remediationThreshold}%
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {bestAttemptPercentage !== null && bestAttemptPercentage !== undefined && (
          <div
            className="rounded-xl p-4 flex items-center justify-between"
            style={{
              backgroundColor: passed ? 'rgba(34, 197, 94, 0.08)' : 'rgba(234, 179, 8, 0.08)',
              borderColor: passed ? 'rgba(34, 197, 94, 0.25)' : 'rgba(234, 179, 8, 0.25)',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div className="flex items-center gap-3">
              {passed ? (
                <CheckCircle2 className="w-6 h-6 text-green-400" aria-hidden="true" />
              ) : (
                <Circle className="w-6 h-6 text-yellow-400" aria-hidden="true" />
              )}
              <div>
                <p className="text-sm font-medium" style={{ color: t.text }}>
                  {passed ? 'Mastery Achieved' : 'Mastery In Progress'}
                </p>
                <p className="text-xs" style={{ color: t.textMuted }}>
                  Best quiz score: {bestAttemptPercentage}%
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold" style={{ color: passed ? '#4ade80' : '#facc15' }}>
              {bestAttemptPercentage}%
            </span>
          </div>
        )}

        {competencies.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4" style={{ color: t.primary }} aria-hidden="true" />
              <h4 className="text-sm font-bold uppercase tracking-wide" style={{ color: t.primary }}>
                Competencies
              </h4>
            </div>
            <ul className="space-y-2">
              {competencies.map((comp) => (
                <li
                  key={comp.id}
                  className="text-sm rounded-lg p-3"
                  style={{
                    backgroundColor: t.background,
                    color: t.text,
                    borderColor: t.border,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                >
                  <span className="font-medium">{comp.title}</span>
                  <span className="block text-xs mt-1" style={{ color: t.textMuted }}>
                    {comp.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {learningObjectives.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4" style={{ color: t.primary }} aria-hidden="true" />
              <h4 className="text-sm font-bold uppercase tracking-wide" style={{ color: t.primary }}>
                Learning Objectives
              </h4>
            </div>
            <ol className="space-y-2 list-decimal list-inside">
              {learningObjectives.map((lo) => (
                <li
                  key={lo.id}
                  className="text-sm rounded-lg p-3"
                  style={{
                    backgroundColor: t.background,
                    color: t.text,
                    borderColor: t.border,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                >
                  {lo.description}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
