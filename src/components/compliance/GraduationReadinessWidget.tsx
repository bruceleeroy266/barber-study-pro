'use client'

import { GraduationReadiness } from '@/types'
import { Clock, ClipboardCheck, Wrench, AlertTriangle, CheckCircle } from 'lucide-react'

interface Props {
  readiness: GraduationReadiness
}

export default function GraduationReadinessWidget({ readiness }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Graduation Readiness</h2>
      <div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 relative">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-800"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className={readiness.isReady ? 'text-green-400' : 'text-yellow-400'}
              strokeDasharray={`${readiness.percentage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${readiness.isReady ? 'text-green-400' : 'text-yellow-400'}`}>
              {readiness.percentage}%
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {readiness.isReady ? (
            <span className="inline-flex items-center gap-1 text-green-400">
              <CheckCircle className="w-4 h-4" /> Ready for graduation
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-yellow-400">
              <AlertTriangle className="w-4 h-4" /> Requirements remain
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Clock className="w-3.5 h-3.5" /> Hours
          </div>
          <p className="text-white font-medium">
            {readiness.completedHours}/{readiness.requiredHours}
          </p>
        </div>
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <ClipboardCheck className="w-3.5 h-3.5" /> Assessments
          </div>
          <p className="text-white font-medium">
            {readiness.completedAssessments}/{readiness.requiredAssessments}
          </p>
        </div>
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Wrench className="w-3.5 h-3.5" /> Practicals
          </div>
          <p className="text-white font-medium">
            {readiness.completedPracticals}/{readiness.requiredPracticals}
          </p>
        </div>
      </div>

      {!readiness.isReady && readiness.remainingItems.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-300 mb-2">Remaining Items</p>
          <ul className="space-y-1.5">
            {readiness.remainingItems.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
