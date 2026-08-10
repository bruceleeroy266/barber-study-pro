'use client'

import { BoardReadiness } from '@/types'
import { getReadinessColorClass, getReadinessBgClass } from '@/lib/readiness'
import { Award, Target, BookOpen, Zap, Calendar } from 'lucide-react'
import { Card, ProgressBar } from '@/components/ui'

interface BoardReadinessCardProps {
  readiness: BoardReadiness
}

export default function BoardReadinessCard({ readiness }: BoardReadinessCardProps) {
  const colorClass = getReadinessColorClass(readiness.score)
  const bgClass = getReadinessBgClass(readiness.score)

  return (
    <Card variant="default" padding="lg" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--color-brand-gold)]" />
            Board Readiness
          </h2>
          <p className="text-sm text-silver mt-1">
            Updated {new Date(readiness.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className={`text-4xl font-bold ${colorClass}`}>{readiness.score}</p>
            <p className={`text-sm font-medium ${colorClass}`}>{readiness.level}</p>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-light-gray"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className={colorClass}
                strokeDasharray={`${readiness.score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-silver mb-1">
          <span>At Risk</span>
          <span>Needs Review</span>
          <span>Nearly Ready</span>
          <span>Ready</span>
        </div>
        <ProgressBar value={readiness.score} variant="default" size="lg" showLabel={false} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="ghost" padding="sm">
          <div className="flex items-center gap-2 text-silver text-xs mb-1">
            <Target className="w-4 h-4" />
            Avg Quiz Score
          </div>
          <p className="text-xl font-bold text-white">{readiness.quizAverage}%</p>
        </Card>
        <Card variant="ghost" padding="sm">
          <div className="flex items-center gap-2 text-silver text-xs mb-1">
            <BookOpen className="w-4 h-4" />
            Chapters Done
          </div>
          <p className="text-xl font-bold text-white">
            {readiness.chaptersCompleted}/{readiness.totalChapters}
          </p>
        </Card>
        <Card variant="ghost" padding="sm">
          <div className="flex items-center gap-2 text-silver text-xs mb-1">
            <Zap className="w-4 h-4" />
            Questions
          </div>
          <p className="text-xl font-bold text-white">{readiness.totalQuestionsAnswered}</p>
        </Card>
        <Card variant="ghost" padding="sm">
          <div className="flex items-center gap-2 text-silver text-xs mb-1">
            <Calendar className="w-4 h-4" />
            Study Time
          </div>
          <p className="text-xl font-bold text-white">{readiness.recommendedStudyMinutes}m</p>
        </Card>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-silver">Recent trend:</span>
        <span
          className={`font-medium ${
            readiness.improvementTrend === 'improving'
              ? 'text-gold'
              : readiness.improvementTrend === 'declining'
              ? 'text-silver'
              : 'text-warm-bronze'
          }`}
        >
          {readiness.improvementTrend.charAt(0).toUpperCase() +
            readiness.improvementTrend.slice(1)}
        </span>
      </div>
    </Card>
  )
}
