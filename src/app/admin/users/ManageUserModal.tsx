'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import type { AppRole } from '@/types'
import {
  assignUserSchool,
  changeUserRole,
  requirePasswordChange,
  resendUserSetupLink,
  resetUserPassword,
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

  if (!user) return null

  const selectedRole = roleDraft ?? user.role
  const selectedSchool = schoolDraft === undefined ? user.school_id : schoolDraft
  const selectedStatus = statusDraft ?? (user.approval_status === 'pending' ? 'approved' : user.approval_status)
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
        `${user.id}:role`,
        () => changeUserRole(user.id, selectedRole),
        `Role updated to ${roleLabel(selectedRole)}`
      )
      return
    }

    if (confirmation.kind === 'school') {
      await runAction(
        `${user.id}:school`,
        () => assignUserSchool(user.id, selectedSchool ?? null),
        `School updated to ${schoolLabel(selectedSchool ?? null)}`
      )
      return
    }

    if (confirmation.kind === 'status') {
      await runAction(
        `${user.id}:status`,
        () => updateUserStatus(user.id, selectedStatus),
        `Approval status updated to ${statusLabel(selectedStatus)}`
      )
      return
    }

    await runAction(
      `${user.id}:disabled`,
      () => toggleUserDisabled(user.id, !user.is_disabled),
      user.is_disabled ? 'Account enabled' : 'Account disabled'
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
      title={`Manage — ${user.full_name}`}
      size="md"
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] p-4">
          <p className="font-medium text-white">{user.full_name}</p>
          <p className="mt-1 break-all text-sm text-[var(--color-text-muted)]">{user.email}</p>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Current role</dt>
              <dd className="mt-1 text-white">{roleLabel(user.role)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Current school</dt>
              <dd className="mt-1 text-white">{user.school_name ?? 'No school'}</dd>
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
                  `${user.id}:setup-link`,
                  () => resendUserSetupLink(user.id),
                  'Setup link sent'
                )
              }
              disabled={!!pendingKey || user.is_disabled || user.approval_status === 'rejected'}
              className="min-h-11 rounded-lg border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 px-3 py-2 text-sm text-[var(--color-brand-gold)] disabled:opacity-40"
            >
              {pendingKey === `${user.id}:setup-link` ? 'Sending…' : 'Send setup link'}
            </button>
            <button
              type="button"
              onClick={() =>
                runAction(
                  `${user.id}:require-password-reset`,
                  () => requirePasswordChange(user.id),
                  'Password reset required'
                )
              }
              disabled={!!pendingKey}
              className="min-h-11 rounded-lg border border-[var(--color-border-primary)] px-3 py-2 text-sm text-white disabled:opacity-40"
            >
              {pendingKey === `${user.id}:require-password-reset` ? 'Saving…' : 'Require password reset'}
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
                `${user.id}:password-reset`,
                () => resetUserPassword(user.id, temporaryPassword),
                'Temporary password reset successfully'
              )
            }
            disabled={!!pendingKey || temporaryPassword.length < 8 || temporaryPassword.length > 72}
            className="min-h-11 w-full rounded-lg border border-[var(--color-border-primary)] px-3 py-2 text-sm text-white disabled:opacity-40"
          >
            {pendingKey === `${user.id}:password-reset` ? 'Resetting…' : 'Reset temporary password'}
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
                from: statusLabel(user.approval_status),
                to: statusLabel(selectedStatus),
              })
            }
            disabled={!!pendingKey || selectedStatus === user.approval_status}
            className="min-h-11 w-full rounded-lg border border-[var(--color-border-primary)] px-3 py-2 text-sm text-white disabled:opacity-40"
          >
            Review status change
          </button>
          <button
            type="button"
            onClick={() =>
              setConfirmation({
                kind: 'disabled',
                from: user.is_disabled ? 'Disabled' : 'Enabled',
                to: user.is_disabled ? 'Enabled' : 'Disabled',
              })
            }
            disabled={!!pendingKey}
            className="min-h-11 w-full rounded-lg border border-silver/30 bg-silver/10 px-3 py-2 text-sm text-silver disabled:opacity-40"
          >
            {user.is_disabled ? 'Review enable account' : 'Review disable account'}
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
                from: roleLabel(user.role),
                to: roleLabel(selectedRole),
              })
            }
            disabled={!!pendingKey || selectedRole === user.role}
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
                    from: schoolLabel(user.school_id),
                    to: schoolLabel(selectedSchool ?? null),
                  })
                }
                disabled={!!pendingKey || selectedSchool === user.school_id}
                className="min-h-11 w-full rounded-lg border border-[var(--color-border-primary)] px-3 py-2 text-sm text-white disabled:opacity-40"
              >
                Review school change
              </button>
            </>
          )}
        </section>

        {user.role === 'student' && (
          <section className="space-y-3 border-t border-[var(--color-border-primary)] pt-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Enrollment</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {typeof user.enrollment_count === 'number'
                ? `${user.enrollment_count} active program${user.enrollment_count === 1 ? '' : 's'}`
                : 'Enrollment count unavailable'}
            </p>
            <button
              type="button"
              onClick={() => onManageEnrollment(user)}
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
            onClick={() => onDelete(user)}
            disabled={!!pendingKey || user.id === currentUserId}
            className="min-h-11 w-full rounded-lg border border-silver/30 bg-silver/10 px-3 py-2 text-sm text-silver disabled:opacity-40"
          >
            Delete user
          </button>
          {user.id === currentUserId && (
            <p className="text-xs text-[var(--color-text-muted)]">You cannot delete your own account.</p>
          )}
        </section>
      </div>
    </Modal>
  )
}
