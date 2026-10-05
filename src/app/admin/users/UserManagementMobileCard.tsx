'use client'

import type { UserListItem } from './actions'

const ROLE_LABELS: Record<string, string> = {
  student: 'Student',
  apprentice: 'Apprentice',
  instructor: 'Instructor',
  school_admin: 'School Admin',
  admin: 'Admin',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
}

interface UserManagementMobileCardProps {
  user: UserListItem
  onManage: (user: UserListItem) => void
}

function formatCreatedAt(date: string): string {
  return new Date(date).toLocaleDateString()
}

export default function UserManagementMobileCard({
  user,
  onManage,
}: UserManagementMobileCardProps) {
  return (
    <article
      data-testid="mobile-user-card"
      className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-primary)] p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-white">{user.full_name}</h3>
          <p className="mt-1 break-all text-sm text-[var(--color-text-secondary)]">{user.email}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-1 text-xs font-medium text-gold">
            {ROLE_LABELS[user.role] ?? user.role}
          </span>
          <span className="rounded-full border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] px-2 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
            {STATUS_LABELS[user.approval_status] ?? user.approval_status}
          </span>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div className="min-w-0">
          <dt className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">School</dt>
          <dd className="mt-1 truncate text-white">{user.school_name ?? 'No school'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Account</dt>
          <dd className="mt-1 text-white">{user.is_disabled ? 'Disabled' : 'Enabled'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Password</dt>
          <dd className="mt-1 text-white">
            {user.requires_password_change ? 'Reset required' : 'No reset required'}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Created</dt>
          <dd className="mt-1 text-white">{formatCreatedAt(user.created_at)}</dd>
        </div>
        {(user.role === 'student' || user.role === 'apprentice') && (
          <>
            <div>
              <dt className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Metrics</dt>
              <dd className="mt-1 text-white">
                {user.include_in_school_metrics === false ? 'Excluded' : 'Included'}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Instructor</dt>
              <dd className="mt-1 text-white">
                {user.assigned_instructor_name ?? 'Unassigned'}
              </dd>
            </div>
          </>
        )}
      </dl>

      {user.role === 'student' && typeof user.enrollment_count === 'number' && (
        <div className="mt-4 rounded-lg border border-gold/20 bg-gold/5 px-3 py-2 text-sm text-gold">
          {user.enrollment_count} active program{user.enrollment_count === 1 ? '' : 's'}
        </div>
      )}

      <button
        type="button"
        onClick={() => onManage(user)}
        className="mt-4 min-h-11 w-full rounded-lg border border-[var(--color-brand-gold)]/40 bg-[var(--color-brand-gold)]/10 px-4 py-2.5 font-medium text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
      >
        Manage user
      </button>
    </article>
  )
}
