'use client'

import { useState } from 'react'
import { AttendanceRecord, AttendanceStatus, Profile } from '@/types'
import { X, AlertCircle } from 'lucide-react'
import StatusSelector from './StatusSelector'

interface CorrectionModalProps {
  record: AttendanceRecord | null
  student: Profile | undefined
  onClose: () => void
  onSubmit: (recordId: string, newStatus: AttendanceStatus, reason: string) => Promise<void>
}

export default function CorrectionModal({ record, student, onClose, onSubmit }: CorrectionModalProps) {
  const [newStatus, setNewStatus] = useState<AttendanceStatus>(record?.status || 'Present')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!record) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!reason.trim()) {
      setError('Please provide a reason for the correction.')
      return
    }

    if (newStatus === record.status) {
      setError('New status must differ from the current status.')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(record.id, newStatus, reason.trim())
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit correction.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Submit Correction</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-2">
            <div className="text-sm text-gray-400">Student</div>
            <div className="text-white font-medium">{student?.full_name || 'Unknown'}</div>
            <div className="text-sm text-gray-400">Date</div>
            <div className="text-white font-medium">{record.date}</div>
            <div className="text-sm text-gray-400">Current Status</div>
            <div className="text-white font-medium">{record.status}</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">New Status</label>
            <StatusSelector value={newStatus} onChange={setNewStatus} />
          </div>

          <div className="space-y-2">
            <label htmlFor="correction-reason" className="text-sm text-gray-300">
              Reason for Correction
            </label>
            <textarea
              id="correction-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] resize-none"
              placeholder="Explain why this correction is needed..."
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-[#D4AF37] hover:bg-[#F4E4A6] text-gray-950 font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Correction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
