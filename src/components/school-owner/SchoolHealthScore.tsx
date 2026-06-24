'use client'

import { SchoolHealthScore as Score } from '@/types'
import { Users, Target, Calculator, ClipboardCheck, Clock } from 'lucide-react'

interface Props {
  health: Score
}

export default function SchoolHealthScore({ health }: Props) {
  const components = [
    { label: 'Attendance', value: health.componentScores.attendance, icon: Users },
    { label: 'Readiness', value: health.componentScores.readiness, icon: Target },
    { label: 'Grades', value: health.componentScores.grades, icon: Calculator },
    { label: 'Assessments', value: health.componentScores.assessmentCompletion, icon: ClipboardCheck },
    { label: 'Hours', value: health.componentScores.hoursCompletion, icon: Clock },
  ]

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex flex-col items-center justify-center">
          <div className="w-36 h-36 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-800"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className={health.colorClass}
                strokeDasharray={`${health.score}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${health.colorClass}`}>{health.score}</span>
              <span className="text-xs text-gray-400">/100</span>
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className={`text-lg font-semibold ${health.colorClass}`}>{health.label}</p>
            <p className="text-xs text-gray-500">School Health Score</p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {components.map((c) => {
            const Icon = c.icon
            return (
              <div key={c.label} className="bg-gray-950 border border-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-400">{c.label}</span>
                </div>
                <div className="text-xl font-bold text-white">{c.value}</div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                  <div
                    className={`h-full rounded-full ${
                      c.value >= 80 ? 'bg-green-500' : c.value >= 70 ? 'bg-yellow-500' : c.value >= 60 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.max(0, Math.min(100, c.value))}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
