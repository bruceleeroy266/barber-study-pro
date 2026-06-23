'use client'

import { AreaPerformance } from '@/types'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Award } from 'lucide-react'
import { scoreToColor } from '@/lib/analytics'

interface WeakAreaAnalyticsProps {
  weakAreas: AreaPerformance[]
  strongAreas: AreaPerformance[]
}

function TrendIcon({ trend }: { trend: 'improving' | 'stable' | 'declining' }) {
  if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-green-400" />
  if (trend === 'declining') return <TrendingDown className="w-4 h-4 text-red-400" />
  return <Minus className="w-4 h-4 text-yellow-400" />
}

function AreaList({ areas, type }: { areas: AreaPerformance[]; type: 'weak' | 'strong' }) {
  if (areas.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        {type === 'weak'
          ? 'No weak areas detected — keep up the good work!'
          : 'Complete more quizzes to identify strong areas.'}
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {areas.map((area) => (
        <div
          key={area.id}
          className={`p-4 rounded-lg border ${
            type === 'weak'
              ? 'bg-red-950/20 border-red-900/30'
              : 'bg-green-950/20 border-green-900/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-medium">{area.name}</p>
            <p className={`text-xl font-bold ${scoreToColor(area.score)}`}>{area.score}%</p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-gray-400">
              <span>{area.attempts} attempt{area.attempts === 1 ? '' : 's'}</span>
              <span className="flex items-center gap-1">
                <TrendIcon trend={area.trend} />
                {area.trend.charAt(0).toUpperCase() + area.trend.slice(1)}
              </span>
            </div>
            <span className="text-xs text-gray-500">{area.category}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function WeakAreaAnalytics({ weakAreas, strongAreas }: WeakAreaAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-semibold text-white">Top 5 Weakest Areas</h3>
        </div>
        <AreaList areas={weakAreas} type="weak" />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Top 5 Strongest Areas</h3>
        </div>
        <AreaList areas={strongAreas} type="strong" />
      </div>
    </div>
  )
}
