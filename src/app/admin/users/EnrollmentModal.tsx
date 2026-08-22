'use client'

import { useState, useCallback } from 'react'
import Modal from '@/components/ui/Modal'
import {
  enrollStudent,
  unenrollStudent,
  getStudentEnrollments,
  getSchoolPrograms,
  EnrollmentRecord,
  ProgramOption,
} from './actions'

interface EnrollmentModalProps {
  isOpen: boolean
  onClose: () => void
  studentId: string
  studentName: string
  studentEmail: string
}

export default function EnrollmentModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  studentEmail,
}: EnrollmentModalProps) {
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([])
  const [programs, setPrograms] = useState<ProgramOption[]>([])
  const [selectedProgramId, setSelectedProgramId] = useState('')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setMessage(null)
    setSelectedProgramId('')
    setNotes('')

    const [enrollmentsResult, programsResult] = await Promise.all([
      getStudentEnrollments(studentId),
      getSchoolPrograms(),
    ])

    if (enrollmentsResult.success && enrollmentsResult.data) {
      setEnrollments(enrollmentsResult.data)
    } else {
      setMessage({ type: 'error', text: enrollmentsResult.error || 'Failed to load enrollments' })
    }

    if (programsResult.success && programsResult.data) {
      setPrograms(programsResult.data)
    } else {
      setMessage({ type: 'error', text: programsResult.error || 'Failed to load programs' })
    }

    setIsLoading(false)
    setHasLoaded(true)
  }, [studentId])

  // Trigger load when modal opens and not yet loaded
  if (isOpen && !hasLoaded && !isLoading) {
    loadData()
  }

  // Reset loaded state when modal closes
  if (!isOpen && hasLoaded) {
    setHasLoaded(false)
    setEnrollments([])
    setPrograms([])
    setMessage(null)
    setSelectedProgramId('')
    setNotes('')
  }

  async function handleEnroll(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedProgramId || isSubmitting) return

    setIsSubmitting(true)
    setMessage(null)

    const result = await enrollStudent(studentId, selectedProgramId, undefined, undefined, notes || undefined)

    if (result.success) {
      setMessage({ type: 'success', text: 'Student enrolled successfully' })
      setSelectedProgramId('')
      setNotes('')
      // Reload enrollments
      const enrollmentsResult = await getStudentEnrollments(studentId)
      if (enrollmentsResult.success && enrollmentsResult.data) {
        setEnrollments(enrollmentsResult.data)
      }
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to enroll student' })
    }

    setIsSubmitting(false)
  }

  async function handleWithdraw(enrollmentId: string) {
    if (withdrawingId) return

    setWithdrawingId(enrollmentId)
    setMessage(null)

    const result = await unenrollStudent(enrollmentId)

    if (result.success) {
      setMessage({ type: 'success', text: 'Student withdrawn successfully' })
      // Reload enrollments
      const enrollmentsResult = await getStudentEnrollments(studentId)
      if (enrollmentsResult.success && enrollmentsResult.data) {
        setEnrollments(enrollmentsResult.data)
      }
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to withdraw student' })
    }

    setWithdrawingId(null)
  }

  // Filter out programs the student is already actively enrolled in
  const activeProgramIds = new Set(
    enrollments.filter((e) => e.is_active && e.status === 'active').map((e) => e.program_id)
  )
  const availablePrograms = programs.filter((p) => !activeProgramIds.has(p.id))

  function statusBadge(status: string, isActive: boolean) {
    if (!isActive || status === 'withdrawn') {
      return (
        <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-silver/20 text-silver border border-silver/30">
          Withdrawn
        </span>
      )
    }
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-gold/20 text-gold border border-gold/30">
            Active
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Completed
          </span>
        )
      case 'on_hold':
        return (
          <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-warm-bronze/20 text-warm-bronze border border-warm-bronze/30">
            On Hold
          </span>
        )
      default:
        return (
          <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-[var(--color-border-secondary)] text-[var(--color-text-secondary)] border border-silver-gray">
            {status}
          </span>
        )
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Enrollments — ${studentName}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Student info */}
        <div className="text-sm text-[var(--color-text-muted)]">
          <span className="text-white font-medium">{studentName}</span>
          {' · '}
          <span>{studentEmail}</span>
        </div>

        {/* Status message */}
        {message && (
          <div
            className={`rounded-lg border p-3 text-sm ${
              message.type === 'success'
                ? 'border-gold/30 bg-gold/10 text-gold'
                : 'border-silver/30 bg-silver/10 text-silver'
            }`}
          >
            {message.text}
            <button
              onClick={() => setMessage(null)}
              className="ml-3 text-xs underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8 text-[var(--color-text-muted)]">Loading enrollments...</div>
        ) : (
          <>
            {/* Current enrollments */}
            <div>
              <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3 uppercase tracking-wider">
                Current Enrollments
              </h3>
              {enrollments.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)] py-4 text-center">
                  No enrollments found
                </p>
              ) : (
                <div className="space-y-2">
                  {enrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">
                          {enrollment.program_name ?? 'Unknown Program'}
                        </div>
                        <div className="text-xs text-[var(--color-text-muted)] mt-1">
                          Started {new Date(enrollment.start_date).toLocaleDateString()}
                          {enrollment.expected_end_date &&
                            ` · Expected completion ${new Date(enrollment.expected_end_date).toLocaleDateString()}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        {statusBadge(enrollment.status, enrollment.is_active)}
                        {enrollment.is_active && enrollment.status === 'active' && (
                          <button
                            onClick={() => handleWithdraw(enrollment.id)}
                            disabled={withdrawingId === enrollment.id}
                            className="px-3 py-1 text-xs bg-silver/10 text-silver border border-silver/30 rounded hover:bg-silver/20 disabled:opacity-40"
                          >
                            {withdrawingId === enrollment.id ? 'Withdrawing...' : 'Withdraw'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Enroll in new program */}
            {availablePrograms.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3 uppercase tracking-wider">
                  Enroll in Program
                </h3>
                <form onSubmit={handleEnroll} className="space-y-4">
                  <div>
                    <label className="block text-sm text-[var(--color-text-muted)] mb-1">
                      Program
                    </label>
                    <select
                      value={selectedProgramId}
                      onChange={(e) => setSelectedProgramId(e.target.value)}
                      required
                      className="w-full bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
                    >
                      <option value="">Select a program</option>
                      {availablePrograms.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--color-text-muted)] mb-1">
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="w-full bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-gold)] resize-none"
                      placeholder="Optional enrollment notes..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!selectedProgramId || isSubmitting}
                    className="px-6 py-2 bg-[var(--color-brand-gold)] text-black font-medium rounded-lg hover:bg-[var(--color-brand-gold)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Enrolling...' : 'Enroll Student'}
                  </button>
                </form>
              </div>
            )}

            {availablePrograms.length === 0 && programs.length > 0 && (
              <p className="text-sm text-[var(--color-text-muted)] text-center py-2">
                Student is enrolled in all available programs.
              </p>
            )}

            {programs.length === 0 && (
              <p className="text-sm text-[var(--color-text-muted)] text-center py-2">
                No active programs available for this school.
              </p>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}
