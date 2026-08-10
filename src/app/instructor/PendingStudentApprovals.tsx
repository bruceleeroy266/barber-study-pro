'use client'

import { useState } from 'react'
import { approveStudent, rejectStudent } from '@/app/admin/students/actions'

interface PendingStudentApprovalsProps {
  students: Array<{
    id: string
    full_name: string
    email: string
    created_at: string
    school_id: string | null
    approval_status: string
  }>
  schoolName: string
}

export function PendingStudentApprovals({ students, schoolName }: PendingStudentApprovalsProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleApprove(studentId: string) {
    setLoadingId(studentId)
    setActionType('approve')
    setMessage(null)

    const result = await approveStudent(studentId)

    setLoadingId(null)
    setActionType(null)

    if (result.success) {
      setMessage({ type: 'success', text: result.message })
      // Refresh the page to show updated list
      window.location.reload()
    } else {
      setMessage({ type: 'error', text: result.message })
    }
  }

  async function handleReject(studentId: string) {
    setLoadingId(studentId)
    setActionType('reject')
    setMessage(null)

    const result = await rejectStudent(studentId)

    setLoadingId(null)
    setActionType(null)

    if (result.success) {
      setMessage({ type: 'success', text: result.message })
      // Refresh the page to show updated list
      window.location.reload()
    } else {
      setMessage({ type: 'error', text: result.message })
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (students.length === 0) {
    return null
  }

  return (
    <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
      <div className="p-6 border-b border-graphite">
        <h2 className="text-xl font-semibold text-white">Pending Student Approvals</h2>
        <p className="text-sm text-silver mt-1">
          {students.length} student{students.length === 1 ? '' : 's'} awaiting approval
        </p>
      </div>

      {message && (
        <div className={`px-6 py-3 border-b border-graphite ${
          message.type === 'success' ? 'bg-gold/10' : 'bg-silver/10'
        }`}>
          <p className={`text-sm ${
            message.type === 'success' ? 'text-gold' : 'text-silver'
          }`}>
            {message.text}
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-silver border-b border-graphite">
              <th className="p-4">Student Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Registration Date</th>
              <th className="p-4">School</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {students.map((student) => (
              <tr key={student.id} className="border-b border-graphite/50 hover:bg-graphite/30 transition-colors">
                <td className="p-4">
                  <div className="text-white font-medium">{student.full_name}</div>
                </td>
                <td className="p-4 text-silver">
                  {student.email}
                </td>
                <td className="p-4 text-silver">
                  {formatDate(student.created_at)}
                </td>
                <td className="p-4 text-silver">
                  {schoolName}
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-warm-bronze/20 text-warm-bronze border border-warm-bronze/30">
                    🟡 Pending
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(student.id)}
                      disabled={loadingId === student.id}
                      className="px-3 py-1.5 bg-gold hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {loadingId === student.id && actionType === 'approve' ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(student.id)}
                      disabled={loadingId === student.id}
                      className="px-3 py-1.5 bg-silver hover:bg-silver disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {loadingId === student.id && actionType === 'reject' ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
