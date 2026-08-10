'use client'

import { GradeHistory, Grade } from '@/types'
import { X } from 'lucide-react'

interface GradeHistoryModalProps {
  grade: Grade | null
  histories: GradeHistory[]
  onClose: () => void
}

export default function GradeHistoryModal({ grade, histories, onClose }: GradeHistoryModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-charcoal border border-graphite rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-graphite">
          <div>
            <h2 className="text-lg font-semibold text-white">Grade Edit History</h2>
            {grade && (
              <p className="text-sm text-silver">
                Current: {grade.score}/{grade.maxScore} ({grade.percentage}%)
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-silver hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {histories.length === 0 ? (
            <p className="text-center text-silver-gray">No edit history available for this grade.</p>
          ) : (
            <ul className="space-y-3">
              {histories.map((h) => (
                <li
                  key={h.id}
                  className="bg-black border border-graphite rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-silver">
                      {new Date(h.changedAt).toLocaleString()}
                    </span>
                    <span className="text-xs text-silver-gray">by {h.changedBy}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-silver">
                      {h.previousScore} ({h.previousPercentage}%)
                    </span>
                    <span className="text-silver-gray">→</span>
                    <span className="text-white font-medium">
                      {h.newScore} ({h.newPercentage}%)
                    </span>
                  </div>
                  {h.reason && (
                    <p className="mt-2 text-xs text-silver-gray">Reason: {h.reason}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-5 border-t border-graphite">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-graphite hover:bg-[var(--color-border-secondary)] text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
