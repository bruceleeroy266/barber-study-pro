'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Mail, UserPlus, RefreshCw, ArrowRightLeft, UserMinus, AlertTriangle } from 'lucide-react'
import { SchoolConfiguration } from '@/types'
import {
  getSchools,
  getUsers,
  inviteUser,
  resendUserSetupLink,
  type UserListItem,
} from '@/app/admin/users/actions'
import {
  getInstructorAssignmentImpact,
  guardedMoveInstructor,
} from '@/app/admin/school/configuration/instructor-actions'

interface Props {
  config: SchoolConfiguration
}

interface SchoolOption {
  id: string
  name: string
}

export default function InstructorsSection({ config }: Props) {
  const schoolId = config.school.id
  const [instructors, setInstructors] = useState<UserListItem[]>([])
  const [schools, setSchools] = useState<SchoolOption[]>([])
  const [assignmentCounts, setAssignmentCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [reassigning, setReassigning] = useState<UserListItem | null>(null)
  const [targetSchoolId, setTargetSchoolId] = useState('')

  const otherSchools = useMemo(
    () => schools.filter((school) => school.id !== schoolId),
    [schools, schoolId]
  )

  const load = useCallback(async () => {
    setLoading(true)
    setMessage(null)

    const [usersResult, schoolsResult] = await Promise.all([
      getUsers({ role: 'instructor', schoolId, limit: 100, offset: 0 }),
      getSchools(),
    ])

    if (!usersResult.success || !usersResult.data) {
      setMessage({ type: 'error', text: usersResult.error || 'Failed to load instructors' })
      setLoading(false)
      return
    }

    const nextInstructors = usersResult.data.users
    setInstructors(nextInstructors)

    if (schoolsResult.success && schoolsResult.data) {
      setSchools(schoolsResult.data)
    }

    const impacts = await Promise.all(
      nextInstructors.map(async (instructor) => {
        const result = await getInstructorAssignmentImpact(instructor.id)
        return [instructor.id, result.success && result.data ? result.data.activeStudentCount : 0] as const
      })
    )
    setAssignmentCounts(Object.fromEntries(impacts))
    setLoading(false)
  }, [schoolId])

  useEffect(() => {
    void load()
  }, [load])

  async function handleInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const fullName = String(form.get('full_name') || '').trim()
    const email = String(form.get('email') || '').trim()

    if (!fullName || !email) return

    setBusyId('invite')
    setMessage(null)
    const result = await inviteUser({
      full_name: fullName,
      email,
      role: 'instructor',
      school_id: schoolId,
      approval_status: 'approved',
    })
    setBusyId(null)

    if (!result.success) {
      setMessage({ type: 'error', text: result.error || 'Failed to add instructor' })
      return
    }

    setMessage({
      type: 'success',
      text: result.data?.recoverySent
        ? 'Instructor already existed. A fresh setup link was sent.'
        : result.data?.alreadyInvited
          ? 'Instructor invitation already exists.'
          : 'Instructor invitation sent.',
    })
    setShowAdd(false)
    event.currentTarget.reset()
    await load()
  }

  async function handleResend(instructor: UserListItem) {
    setBusyId(instructor.id)
    setMessage(null)
    const result = await resendUserSetupLink(instructor.id)
    setBusyId(null)

    if (result.success) {
      setMessage({ type: 'success', text: `Fresh setup link sent to ${instructor.email}.` })
      await load()
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to send setup link' })
    }
  }

  async function handleRemove(instructor: UserListItem) {
    const assigned = assignmentCounts[instructor.id] ?? 0
    if (assigned > 0) {
      setMessage({
        type: 'error',
        text: `${instructor.full_name || instructor.email} still has ${assigned} active student assignment${assigned === 1 ? '' : 's'}. Reassign those students first.`,
      })
      return
    }

    const confirmed = window.confirm(
      `Remove ${instructor.full_name || instructor.email} from ${config.school.name}? Their account will NOT be deleted.`
    )
    if (!confirmed) return

    setBusyId(instructor.id)
    const result = await guardedMoveInstructor(instructor.id, null)
    setBusyId(null)

    if (result.success) {
      setMessage({ type: 'success', text: 'Instructor removed from this school. Account preserved.' })
      await load()
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to remove instructor' })
    }
  }

  async function handleReassign() {
    if (!reassigning || !targetSchoolId) return

    const assigned = assignmentCounts[reassigning.id] ?? 0
    if (assigned > 0) {
      setMessage({
        type: 'error',
        text: `This instructor still has ${assigned} active student assignment${assigned === 1 ? '' : 's'}. Reassign those students first.`,
      })
      setReassigning(null)
      return
    }

    const target = schools.find((school) => school.id === targetSchoolId)
    const confirmed = window.confirm(
      `Move ${reassigning.full_name || reassigning.email} from ${config.school.name} to ${target?.name || 'the selected school'}?`
    )
    if (!confirmed) return

    setBusyId(reassigning.id)
    const result = await guardedMoveInstructor(reassigning.id, targetSchoolId)
    setBusyId(null)

    if (result.success) {
      setMessage({ type: 'success', text: 'Instructor reassigned successfully.' })
      setReassigning(null)
      setTargetSchoolId('')
      await load()
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to reassign instructor' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Instructor Management</h2>
          <p className="text-sm text-silver">
            Add, recover, move, or remove instructors assigned to {config.school.name}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd((value) => !value)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-brand-gold)]"
        >
          <UserPlus className="h-4 w-4" />
          {showAdd ? 'Cancel' : 'Add Instructor'}
        </button>
      </div>

      {message && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-lg border p-4 text-sm ${
            message.type === 'success'
              ? 'border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)]'
              : 'border-red-500/30 bg-red-500/10 text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      {showAdd && (
        <form onSubmit={handleInvite} className="grid gap-4 rounded-xl border border-graphite bg-black p-4 md:grid-cols-2">
          <div>
            <label htmlFor="instructor-name" className="mb-1 block text-sm text-silver">Full name</label>
            <input
              id="instructor-name"
              name="full_name"
              required
              className="min-h-11 w-full rounded-lg border border-graphite bg-charcoal px-3 py-2 text-white"
            />
          </div>
          <div>
            <label htmlFor="instructor-email" className="mb-1 block text-sm text-silver">Email</label>
            <input
              id="instructor-email"
              name="email"
              type="email"
              required
              className="min-h-11 w-full rounded-lg border border-graphite bg-charcoal px-3 py-2 text-white"
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-between gap-3">
            <p className="text-xs text-silver-gray">
              ASCYN PRO will create/invite the instructor directly into this school.
            </p>
            <button
              type="submit"
              disabled={busyId === 'invite'}
              className="min-h-11 rounded-lg bg-[var(--color-brand-gold)] px-4 py-2 font-semibold text-black disabled:opacity-50"
            >
              {busyId === 'invite' ? 'Sending…' : 'Send Instructor Invite'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-silver">Loading instructors…</p>
      ) : instructors.length === 0 ? (
        <div className="rounded-xl border border-graphite bg-black p-6 text-sm text-silver-gray">
          No instructors are currently assigned to this school.
        </div>
      ) : (
        <div className="space-y-3">
          {instructors.map((instructor) => {
            const assigned = assignmentCounts[instructor.id] ?? 0
            return (
              <div key={instructor.id} className="rounded-xl border border-graphite bg-black p-4">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-gold)]/10 text-lg font-bold text-[var(--color-brand-gold)]">
                      {(instructor.full_name || instructor.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-white">{instructor.full_name || 'Instructor'}</h3>
                      <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-silver">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        {instructor.email}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full border border-silver/20 bg-silver/10 px-2 py-1 text-silver">
                          {instructor.approval_status}
                        </span>
                        {instructor.invitation_status && (
                          <span className="rounded-full border border-[var(--color-brand-gold)]/20 bg-[var(--color-brand-gold)]/10 px-2 py-1 text-[var(--color-brand-gold)]">
                            Invite: {instructor.invitation_status}
                          </span>
                        )}
                        <span className={`rounded-full border px-2 py-1 ${
                          assigned > 0
                            ? 'border-amber-400/30 bg-amber-400/10 text-amber-300'
                            : 'border-silver/20 bg-silver/10 text-silver'
                        }`}>
                          {assigned} active student{assigned === 1 ? '' : 's'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleResend(instructor)}
                      disabled={busyId === instructor.id}
                      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-graphite px-3 py-2 text-sm text-white disabled:opacity-50"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Resend Setup Link
                    </button>
                    {otherSchools.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (assigned > 0) {
                            setMessage({
                              type: 'error',
                              text: `Reassign the instructor's ${assigned} active student assignment${assigned === 1 ? '' : 's'} before moving schools.`,
                            })
                            return
                          }
                          setTargetSchoolId('')
                          setReassigning(instructor)
                        }}
                        disabled={busyId === instructor.id}
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-graphite px-3 py-2 text-sm text-white disabled:opacity-50"
                      >
                        <ArrowRightLeft className="h-4 w-4" />
                        Reassign
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(instructor)}
                      disabled={busyId === instructor.id}
                      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-300 disabled:opacity-50"
                    >
                      <UserMinus className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>

                {assigned > 0 && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-400/20 bg-amber-400/10 p-3 text-xs text-amber-200">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    Moving or removing this instructor is blocked until all active students are reassigned.
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {reassigning && (
        <div className="rounded-xl border border-[var(--color-brand-gold)]/30 bg-black p-4">
          <h3 className="font-semibold text-white">Reassign {reassigning.full_name || reassigning.email}</h3>
          <p className="mt-1 text-sm text-silver">
            Choose the new school. The move will not proceed if active student assignments exist.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <select
              value={targetSchoolId}
              onChange={(event) => setTargetSchoolId(event.target.value)}
              className="min-h-11 flex-1 rounded-lg border border-graphite bg-charcoal px-3 py-2 text-white"
            >
              <option value="">Select new school</option>
              {otherSchools.map((school) => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleReassign}
              disabled={!targetSchoolId || busyId === reassigning.id}
              className="min-h-11 rounded-lg bg-[var(--color-brand-gold)] px-4 py-2 font-semibold text-black disabled:opacity-50"
            >
              Confirm Reassignment
            </button>
            <button
              type="button"
              onClick={() => setReassigning(null)}
              className="min-h-11 rounded-lg border border-graphite px-4 py-2 text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-graphite bg-black p-4">
        <p className="text-sm text-silver">
          Removing an instructor from a school preserves their account. Account deletion remains a separate User Management action.
        </p>
      </div>
    </div>
  )
}
