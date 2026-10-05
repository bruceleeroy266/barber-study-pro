'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/ui/Modal'
import type { AppRole } from '@/types'
import {
  assignStudentInstructor,
  assignUserSchool,
  changeUserRole,
  requirePasswordChange,
  resendUserSetupLink,
  getInstructorAssignmentOptions,
  resetUserPassword,
  setUserSchoolMetricsInclusion,
  toggleUserDisabled,
  updateUserStatus,
  type UserListItem,
} from './actions'

const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'apprentice', label: 'Apprentice' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'school_admin', label: 'School Admin' },
  { value: 'admin', label: 'Admin' },
] as const

const STATUSES = [
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
] as const

type Confirmation =
  | { kind: 'role'; from: string; to: string }
  | { kind: 'school'; from: string; to: string }
  | { kind: 'status'; from: string; to: string }
  | { kind: 'disabled'; from: string; to: string }
  | { kind: 'metrics'; from: string; to: string }
  | null

interface Props {
  user: UserListItem | null
  currentUserId: string
  isPlatformAdmin: boolean
  schools: { id: string; name: string }[]
  onClose: () => void
  onUpdated: (message: string) => Promise<void>
  onManageEnrollment: (user: UserListItem) => void
  onDelete: (user: UserListItem) => void
}

export default function ManageUserModal({
  user,
  currentUserId,
  isPlatformAdmin,
  schools,
  onClose,
  onUpdated,
  onManageEnrollment,
  onDelete,
}: Props) {
  const [roleDraft, setRoleDraft] = useState<AppRole | null>(null)
  const [schoolDraft, setSchoolDraft] = useState<string | null | undefined>(undefined)
  const [statusDraft, setStatusDraft] = useState<'approved' | 'rejected' | null>(null)
  const [temporaryPassword, setTemporaryPassword] = useState('')
  const [confirmation, setConfirmation] = useState<Confirmation>(null)
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [instructorOptions, setInstructorOptions] = useState<Array<{ id: string; full_name: string }>>([])
  const [instructorDraft, setInstructorDraft] = useState<string>('')
  const [assignmentLoadedFor, setAssignmentLoadedFor] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadAssignment() {
      if (!user || (user.role !== 'student' && user.role !== 'apprentice')) {
        setInstructorOptions([])
        setInstructorDraft('')
        setAssignmentLoadedFor(null)
        return
      }

      const result = await getInstructorAssignmentOptions(user.id)
      if (cancelled) return

      if (!result.success || !result.data) {
        setLocalError(result.error || 'Failed to load instructor assignment')
        setInstructorOptions([])
        setInstructorDraft('')
        setAssignmentLoadedFor(user.id)
        return
      }

      setInstructorOptions(result.data.instructors)
      setInstructorDraft(result.data.current_instructor_id ?? '')
      setAssignmentLoadedFor(user.id)
    }

    loadAssignment()
    return () => {
      cancelled = true
    }
  }, [user])

  if (!user) return null

  const managedUser = user
  const selectedRole = roleDraft ?? managedUser.role
  const selectedSchool = schoolDraft === undefined ? managedUser.school_id : schoolDraft
  const selectedStatus = statusDraft ?? (managedUser.approval_status === 'pending' ? 'approved' : managedUser.approval_status)
  const manageableRoles = isPlatformAdmin
    ? ROLES
    : ROLES.filter((role) => role.value !== 'admin' && role.value !== 'school_admin')

  const roleLabel = (value: string) => ROLES.find((role) => role.value === value)?.label ?? value
  const statusLabel = (value: string) =>
    value === 'pending' ? 'Pending' : STATUSES.find((status) => status.value === value)?.label ?? value
  const schoolLabel = (value: string | null) =>
    value ? schools.find((school) => school.id === value)?.name ?? 'Unknown school' : 'No school'

  async function runAction(
    key: string,
    action: () => Promise<{ success: boolean; error?: string }>,
    successMessage: string
  ) {
    if (pendingKey) return
    setPendingKey(key)
    setLocalError(null)
    const result = await action()
    setPendingKey(null)

    if (!result.success) {
      setLocalError(result.error || 'Action failed')
      return
    }

    setConfirmation(null)
    setTemporaryPassword('')
    await onUpdated(successMessage)
    onClose()
  }

  async function confirmPendingChange() {
    if (!confirmation) return

    if (confirmation.kind === 'role') {
      await runAction(
        `${managedUser.id}:role`,
        () => changeUserRole(managedUser.id, selectedRole),
        `Role updated to ${roleLabel(selectedRole)}`
      )
      return
    }

    if (confirmation.kind === 'school') {
      await runAction(
        `${managedUser.id}:school`,
        () => assignUserSchool(managedUser.id, selectedSchool ?? null),
        `School updated to ${schoolLabel(selectedSchool ?? null)}`
      )
      return
    }

    if (confirmation.kind === 'status') {
      await runAction(
        `${managedUser.id}:status`,
        () => updateUserStatus(managedUser.id, selectedStatus),
        `Approval status updated to ${statusLabel(selectedStatus)}`
      )
      return
    }

    if (confirmation.kind === 'metrics') {
      const nextValue = managedUser.include_in_school_metrics === false
      await runAction(
        `${managedUser.id}:metrics`,
        () => setUserSchoolMetricsInclusion(managedUser.id, nextValue),
        nextValue
          ? 'Student included in school metrics'
          : 'Student excluded from school metrics'
      )
      return
    }

    await runAction(
      `${managedUser.id}:disabled`,
      () => toggleUserDisabled(managedUser.id, !managedUser.is_disabled),
      managedUser.is_disabled ? 'Account enabled' : 'Account disabled'
    )
  }

  const confirmationLabel = confirmation
    ? `Change ${confirmation.kind} from ${confirmation.from} to ${confirmation.to}?`
    : ''

  return (
    <Modal
      isOpen={!!user}
      onClose={() => {
        if (!pendingKey) onClose()
      }}
      title={`Manage — ${managedUser.full_name}`}
      size="md"
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] p-4">
          <p className="font-medium text-white">{managedUser.full_name}</p>
          <p className="mt-1 break-all text-sm text-[var(--color-text-muted)]">{managedUser.email}</p>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Current role</dt>
              <dd className="mt-1 text-white">{roleLabel(managedUser.role)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Current school</dt>
              <dd className="mt-1 text-white">{managedUser.school_name ?? 'No school'}</dd>
            </div>
          </dl>
        </div>

        {localError && (
          <div role="alert" className="rounded-lg border border-silver/30 bg-silver/10 p-3 text-sm text-silver">
            {localError}
          </div>
        )}

        {confirmation && (
          <div className="rounded-lg border border-[var(--color-brand-gold)]/40 bg-[var(--color-brand-gold)]/10 p-4">
            <p className="text-sm font-medium text-white">{confirmationLabel}</p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Nothing changes until you confirm this action.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmation(null)}
                disabled={!!pendingKey}
                className="min-h-10 rounded-lg border border-[var(--color-border-primary)] px-3 py-2 text-sm text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPendingChange}
                disabled={!!pendingKey}
                className="min-h-10 rounded-lg bg-[var(--color-brand-gold)] px-3 py-2 text-sm font-medium text-black disabled:opacity-50"
              >
                {pendingKey ? 'Saving…' : 'Confirm change'}
              </button>
            </div>
          </div>
        )}

        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Access</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                runAction(
                  `${managedUser.id}:setup-link`,
                  () => resendUserSetupLink(managedUser.id),
                  'Setup link sent'
                )
              }
              disabled={!!pendingKey || managedUser.is_disabled || managedUser.approval_status === 'rejected'}
              className="min-h-11 rounded-lg border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 px-3 py-2 text-sm text-[var(--color-brand-gold)] disabled:opacity-40"
            >
              {pendingKey === `${managedUser.id}:setup-link` ? 'Sending…' : 'Send setup link'}
            </button>
            <button
              type="button"
              onClick={() =>
                runAction(
                  `${managedUser.id}:require-password-reset`,
                  () => requirePasswordChange(managedUser.id),
                  'Password reset required'
                )
              }
              disabled={!!pendingKey}
              className="min-h-11 rounded-lg border border-[var(--color-border-primary)] px-3 py-2 text-sm text-white disabled:opacity-40"
            >
              {pendingKey === `${managedUser.id}:require-password-reset` ? 'Saving…' : 'Require password reset'}
            </button>
          </div>

          <label className="block text-sm text-[var(--color-text-muted)]">
            New temporary password
            <input
              type="password"
              value={temporaryPassword}
              minLength={8}
              maxLength={72}
              onChange={(event) => setTemporaryPassword(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-primary)] px-3 py-2 text-white"
            />
          </label>
          <button
            type="button"
            onClick={() =>
              runAction(
                `${managedUser.id}:password-reset`,
                () => resetUserPassword(managedUser.id, temporaryPassword),
                'Temporary password reset successfully'
              )
            }
            disabled={!!pendingKey || temporaryPassword.length < 8 || temporaryPassword.length > 72}
            className="min-h-11 w-full rounded-lg border border-[var(--color-border-primary)] px-3 py-2 text-sm text-white disabled:opacity-40"
          >
            {pendingKey === `${managedUser.id}:password-reset` ? 'Resetting…' : 'Reset temporary password'}
          </button>
        </section>

        <section className="space-y-3 border-t border-[var(--color-border-primary)] pt-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Status</h3>
          <label className="block text-sm text-[var(--color-text-muted)]">
            Approval status
            <select
              value={selectedStatus}
              onChange={(event) => {
                setStatusDraft(event.target.value as 'approved' | 'rejected')
                setConfirmation(null)
              }}
              className="mt-1 min-h-11 w-full rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-primary)] px-3 py-2 text-white"
            >
              {STATUSES.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() =>
              setConfirmation({
                kind: 'status',
                from: statusLabel(managedUser.approval_status),
                to: statusLabel(selectedStatus),
              })
            }
            disabled={!!pendingKey || selectedStatus === managedUser.approval_status}
            className="min-h-11 w-full rounded-lg border border-[var(--color-border-primary)] px-3 py-2 text-sm text-white disabled:opacity-40"
          >
            Review status change
          </button>
          <button
            type="button"
            onClick={() =>
              setConfirmation({
                kind: 'disabled',
                from: managedUser.is_disabled ? 'Disabled' : 'Enabled',
                to: managedUser.is_disabled ? 'Enabled' : 'Disabled',
              })
            }
            disabled={!!pendingKey}
            className="min-h-11 w-full rounded-lg border border-silver/30 bg-silver/10 px-3 py-2 text-sm text-silver disabled:opacity-40"
          >
            {managedUser.is_disabled ? 'Review enable account' : 'Review disable account'}
          </button>
        </section>

        <section className="space-y-3 border-t border-[var(--color-border-primary)] pt-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Role & School</h3>
          <label className="block text-sm text-[var(--color-text-muted)]">
            Role
            <select
              value={selectedRole}
              onChange={(event) => {
                setRoleDraft(event.target.value as AppRole)
                setConfirmation(null)
              }}
              className="mt-1 min-h-11 w-full rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-primary)] px-3 py-2 text-white"
            >
              {manageableRoles.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() =>
              setConfirmation({
                kind: 'role',
                from: roleLabel(managedUser.role),
                to: roleLabel(selectedRole),
              })
            }
            disabled={!!pendingKey || selectedRole === managedUser.role}
            className="min-h-11 w-full rounded-lg border border-[var(--color-border-primary)] px-3 py-2 text-sm text-white disabled:opacity-40"
          >
            Review role change
          </button>

          {isPlatformAdmin && (
            <>
              <label className="block text-sm text-[var(--color-text-muted)]">
                School
                <select
                  value={selectedSchool ?? ''}
                  onChange={(event) => {
                    setSchoolDraft(event.target.value || null)
                    setConfirmation(null)
                  }}
                  className="mt-1 min-h-11 w-full rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-primary)] px-3 py-2 text-white"
                >
                  <option value="">No school</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>{school.name}</option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={() =>
                  setConfirmation({
                    kind: 'school',
                    from: schoolLabel(managedUser.school_id),
                    to: schoolLabel(selectedSchool ?? null),
                  })
                }
                disabled={!!pendingKey || selectedSchool === managedUser.school_id}
                className="min-h-11 w-full rounded-lg border border-[var(--color-border-primary)] px-3 py-2 text-sm text-white disabled:opacity-40"
              >
                Review school change
              </button>
            </>
          )}
        </section>

        {(managedUser.role === 'student' || managedUser.role === 'apprentice') && (
          <section className="space-y-3 border-t border-[var(--color-border-primary)] pt-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">School Metrics</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Individual scores, progress, hours, and activity stay visible either way. This setting only controls whether this learner contributes to school and class aggregate percentages, counts, health scores, and summary reports.
            </p>
            <div className="rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-primary)] p-3">
              <p className="text-sm font-medium text-white">
                {managedUser.include_in_school_metrics === false
                  ? 'Excluded from aggregate school metrics'
                  : 'Included in aggregate school metrics'}
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Default is included. Use exclusion for supplemental or cross-program pilot learners whose activity should not change the primary cohort baseline.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setConfirmation({
                  kind: 'metrics',
                  from: managedUser.include_in_school_metrics === false ? 'Excluded' : 'Included',
                  to: managedUser.include_in_school_metrics === false ? 'Included' : 'Excluded',
                })
              }
              disabled={!!pendingKey}
              className="min-h-11 w-full rounded-lg border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 px-3 py-2 text-sm text-[var(--color-brand-gold)] disabled:opacity-40"
            >
              {managedUser.include_in_school_metrics === false
                ? 'Review include in school metrics'
                : 'Review exclude from school metrics'}
            </button>
          </section>
        )}

        {(managedUser.role === 'student' || managedUser.role === 'apprentice') && (
          <section className="space-y-3 border-t border-[var(--color-border-primary)] pt-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Instructor Assignment</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              This assignment controls the instructor roster, private messaging relationship, student-detail access, and instructor analytics.
            </p>
            <label className="block text-sm text-[var(--color-text-muted)]">
              Assigned instructor
              <select
                value={instructorDraft}
                onChange={(event) => setInstructorDraft(event.target.value)}
                disabled={!!pendingKey || assignmentLoadedFor !== managedUser.id}
                className="mt-1 min-h-11 w-full rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-primary)] px-3 py-2 text-white disabled:opacity-50"
              >
                <option value="">Unassigned</option>
                {instructorOptions.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>{instructor.full_name}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() =>
                runAction(
                  `${managedUser.id}:instructor-assignment`,
                  () => assignStudentInstructor(managedUser.id, instructorDraft || null),
                  instructorDraft
                    ? 'Instructor assignment updated'
                    : 'Instructor assignment cleared'
                )
              }
              disabled={
                !!pendingKey ||
                assignmentLoadedFor !== managedUser.id ||
                instructorDraft === (managedUser.assigned_instructor_id ?? '')
              }
              className="min-h-11 w-full rounded-lg border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 px-3 py-2 text-sm text-[var(--color-brand-gold)] disabled:opacity-40"
            >
              {pendingKey === `${managedUser.id}:instructor-assignment` ? 'Saving…' : 'Save instructor assignment'}
            </button>
          </section>
        )}

        {managedUser.role === 'student' && (
          <section className="space-y-3 border-t border-[var(--color-border-primary)] pt-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Enrollment</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {typeof managedUser.enrollment_count === 'number'
                ? `${managedUser.enrollment_count} active program${managedUser.enrollment_count === 1 ? '' : 's'}`
                : 'Enrollment count unavailable'}
            </p>
            <button
              type="button"
              onClick={() => onManageEnrollment(managedUser)}
              disabled={!!pendingKey}
              className="min-h-11 w-full rounded-lg border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 px-3 py-2 text-sm text-[var(--color-brand-gold)] disabled:opacity-40"
            >
              Manage enrollment
            </button>
          </section>
        )}

        <section className="space-y-3 border-t border-silver/30 pt-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-silver">Danger zone</h3>
          <button
            type="button"
            onClick={() => onDelete(managedUser)}
            disabled={!!pendingKey || managedUser.id === currentUserId}
            className="min-h-11 w-full rounded-lg border border-silver/30 bg-silver/10 px-3 py-2 text-sm text-silver disabled:opacity-40"
          >
            Delete user
          </button>
          {managedUser.id === currentUserId && (
            <p className="text-xs text-[var(--color-text-muted)]">You cannot delete your own account.</p>
          )}
        </section>
      </div>
    </Modal>
  )
}
