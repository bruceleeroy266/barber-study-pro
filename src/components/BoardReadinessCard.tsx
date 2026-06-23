'use client'

import { BoardReadiness } from '@/types'
import { getReadinessColorClass, getReadinessBgClass } from '@/lib/readiness'
import { Award, Target, BookOpen, Zap, Calendar } from 'lucide-react'

interface BoardReadinessCardProps {
  readiness: BoardReadiness
}

export default function BoardReadinessCard({ readiness }: BoardReadinessCardProps) {
  const colorClass = getReadinessColorClass(readiness.score)
  const bgClass = getReadinessBgClass(readiness.score)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-[#D4AF37]" />
            Board Readiness
          </h2>
          <p className="text-sm text-gray-400 mt-1">
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
                className="text-gray-800"
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
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>At Risk</span>
          <span>Needs Review</span>
          <span>Nearly Ready</span>
          <span>Ready</span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${bgClass} transition-all duration-500`}
            style={{ width: `${readiness.score}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Target className="w-4 h-4" />
            Avg Quiz Score
          </div>
          <p className="text-xl font-bold text-white">{readiness.quizAverage}%</p>
        </div>
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <BookOpen className="w-4 h-4" />
            Chapters Done
          </div>
          <p className="text-xl font-bold text-white">
            {readiness.chaptersCompleted}/{readiness.totalChapters}
          </p>
        </div>
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Zap className="w-4 h-4" />
            Questions
          </div>
          <p className="text-xl font-bold text-white">{readiness.totalQuestionsAnswered}</p>
        </div>
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Calendar className="w-4 h-4" />
            Study Time
          </div>
          <p className="text-xl font-bold text-white">{readiness.recommendedStudyMinutes}m</p>
        </div>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">Recent trend:</span>
        <span
          className={`font-medium ${
            readiness.improvementTrend === 'improving'
              ? 'text-green-400'
              : readiness.improvementTrend === 'declining'
              ? 'text-red-400'
              : 'text-yellow-400'
          }`}
        >
          {readiness.improvementTrend.charAt(0).toUpperCase() +
            readiness.improvementTrend.slice(1)}
        </span>
      </div>
    </div>
  )
}
