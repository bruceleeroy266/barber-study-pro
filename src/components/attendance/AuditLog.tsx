'use client'

import { useEffect, useState } from 'react'
import { AttendanceAuditEntry, AttendanceRecord, Profile } from '@/types'
import { X, Clock, User, FileText } from 'lucide-react'

interface AuditLogProps {
  record: AttendanceRecord | null
  student: Profile | undefined
  onClose: () => void
  fetchAuditHistory: (recordId: string) => Promise<AttendanceAuditEntry[]>
}

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function AuditLog({ record, student, onClose, fetchAuditHistory }: AuditLogProps) {
  const [entries, setEntries] = useState<AttendanceAuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!record) return

    let cancelled = false

    fetchAuditHistory(record.id)
      .then((data) => {
        if (!cancelled) setEntries(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load audit history')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [record, fetchAuditHistory])

  if (!record) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg shadow-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-white">Audit History</h3>
            <p className="text-sm text-gray-400">
              {student?.full_name || 'Unknown'} — {record.date}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-3 flex-1">
          {loading ? (
            <p className="text-center text-gray-400">Loading audit history...</p>
          ) : error ? (
            <p className="text-center text-red-400">{error}</p>
          ) : entries.length === 0 ? (
            <p className="text-center text-gray-400">No audit entries for this record.</p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      entry.action === 'correct'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : entry.action === 'create'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}
                  >
                    {entry.action}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(entry.timestamp)}
                  </span>
                </div>

                <div className="text-sm text-gray-300 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-gray-500" />
                  {entry.userName || entry.userId}
                </div>

                {Object.entries(entry.changedFields).map(([field, change]) => (
                  <div key={field} className="text-sm text-gray-400 pl-5 border-l-2 border-gray-700">
                    <span className="text-gray-500 capitalize">{field}:</span>{' '}
                    <span className="text-red-400 line-through">{change.old === null ? '—' : String(change.old)}</span>{' '}
                    <span className="text-gray-500">→</span>{' '}
                    <span className="text-green-400">{change.new === null ? '—' : String(change.new)}</span>
                  </div>
                ))}

                {entry.reason && (
                  <div className="text-sm text-gray-400 flex items-start gap-2 pt-1">
                    <FileText className="w-3.5 h-3.5 text-gray-500 mt-0.5" />
                    <span>{entry.reason}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
