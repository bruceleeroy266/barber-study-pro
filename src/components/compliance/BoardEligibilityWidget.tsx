'use client'

import { BoardEligibilityResult } from '@/types'
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'

interface Props {
  eligibility: BoardEligibilityResult
}

export default function BoardEligibilityWidget({ eligibility }: Props) {
  const Icon =
    eligibility.status === 'eligible' ? CheckCircle : eligibility.status === 'near_eligible' ? AlertCircle : XCircle

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Board Eligibility</h2>
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-full bg-opacity-10 ${eligibility.colorClass.replace('text-', 'bg-')}`}>
          <Icon className={`w-8 h-8 ${eligibility.colorClass}`} />
        </div>
        <div>
          <p className={`text-2xl font-bold ${eligibility.colorClass}`}>{eligibility.label}</p>
          <p className="text-sm text-gray-400">{eligibility.reasons[0]}</p>
        </div>
      </div>

      {eligibility.missingRequirements.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-300 mb-2">Missing Requirements</p>
          <ul className="space-y-1.5">
            {eligibility.missingRequirements.map((req, idx) => (
              <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
