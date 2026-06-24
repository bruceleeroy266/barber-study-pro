'use client'

import { StudentGradePerformance } from '@/types'
import { getLetterGrade, getGradeColorClass } from '@/lib/gradebook'
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react'

interface StudentGradeWidgetProps {
  performance: StudentGradePerformance
}

export default function StudentGradeWidget({ performance }: StudentGradeWidgetProps) {
  const TrendIcon =
    performance.trendDirection === 'improving'
      ? TrendingUp
      : performance.trendDirection === 'declining'
      ? TrendingDown
      : Minus

  const trendColor =
    performance.trendDirection === 'improving'
      ? 'text-green-400'
      : performance.trendDirection === 'declining'
      ? 'text-red-400'
      : 'text-gray-400'

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Grade Overview</h3>
          <p className="text-sm text-gray-400">Current overall grade</p>
        </div>
        {performance.isAtRisk && (
          <div className="flex items-center gap-1 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>At Risk</span>
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-3 mb-4">
        <span className={`text-5xl font-bold ${getGradeColorClass(performance.overallGrade)}`}>
          {performance.overallGrade}%
        </span>
        <span className="text-xl text-gray-400">{getLetterGrade(performance.overallGrade)}</span>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <TrendIcon className={`w-5 h-5 ${trendColor}`} />
        <span className={`text-sm capitalize ${trendColor}`}>
          {performance.trendDirection} trend
        </span>
      </div>

      {performance.missingAssignments > 0 && (
        <div className="mb-4 text-sm text-yellow-400">
          {performance.missingAssignments} missing assignment
          {performance.missingAssignments === 1 ? '' : 's'}
        </div>
      )}

      <div className="space-y-2">
        {performance.gradeBreakdown.map((breakdown) => (
          <div key={breakdown.categoryId} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">
                {breakdown.categoryName} ({Math.round(breakdown.weight * 100)}%)
              </span>
              <span className="text-white">
                {breakdown.gradeCount > 0 ? `${breakdown.averagePercentage}%` : '—'}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${
                  breakdown.averagePercentage >= 70 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{
                  width: `${breakdown.averagePercentage > 0 ? breakdown.averagePercentage : 0}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
