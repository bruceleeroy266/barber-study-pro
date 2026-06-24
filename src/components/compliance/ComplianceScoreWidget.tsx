'use client'

import { ComplianceScore } from '@/types'

interface Props {
  score: ComplianceScore
}

export default function ComplianceScoreWidget({ score }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Compliance Score</h2>
      <div className="flex flex-col items-center">
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
              className={score.colorClass}
              strokeDasharray={`${score.score}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${score.colorClass}`}>{score.score}</span>
            <span className="text-xs text-gray-400">/100</span>
          </div>
        </div>
        <p className={`text-lg font-semibold mt-2 ${score.colorClass}`}>{score.label}</p>
      </div>

      <div className="mt-6 space-y-3">
        {score.requirements.map((req) => (
          <div key={req.id} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">{req.name}</span>
              <span
                className={`font-medium ${
                  req.status === 'met'
                    ? 'text-green-400'
                    : req.status === 'partial'
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}
              >
                {req.actualValue}
                {req.unit === '%' || req.unit === 'score' ? '' : ''} {req.unit === '%' ? '%' : req.unit === 'score' ? '' : req.unit}
                {' / '}
                {req.requiredValue}
                {req.unit === '%' ? '%' : req.unit === 'score' ? '' : req.unit}
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  req.status === 'met' ? 'bg-green-500' : req.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{
                  width: `${Math.min(100, (req.actualValue / req.requiredValue) * 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
