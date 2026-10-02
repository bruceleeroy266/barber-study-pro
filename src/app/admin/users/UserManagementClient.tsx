'use client'

import { useState, useTransition } from 'react'
import {
  createUser,
  inviteUser,
  updateUserStatus,
  toggleUserDisabled,
  changeUserRole,
  assignUserSchool,
  requirePasswordChange,
  resetUserPassword,
  resendUserSetupLink,
  deleteUser,
  getUsers,
  getSchools,
  UserListItem,
} from './actions'
import { AppRole } from '@/types'
import Modal from '@/components/ui/Modal'
import EnrollmentModal from './EnrollmentModal'
import UserManagementMobileCard from './UserManagementMobileCard'
import ManageUserModal from './ManageUserModal'

interface CurrentUser {
  id: string
  role: string
  schoolId: string | null
  isPlatformAdmin: boolean
}

interface Props {
  currentUser: CurrentUser
  initialUsers: UserListItem[]
  initialCount: number
  schools: { id: string; name: string }[]
  error?: string
}

const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'apprentice', label: 'Apprentice' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'school_admin', label: 'School Admin' },
  { value: 'admin', label: 'Admin' },
]

const APPROVAL_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

export function UserManagementClient({ currentUser, initialUsers, initialCount, schools, error }: Props) {
  const [users, setUsers] = useState<UserListItem[]>(initialUsers)
  const [count, setCount] = useState(initialCount)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [schoolFilter, setSchoolFilter] = useState<string>(currentUser.schoolId ?? 'all')
  const [offset, setOffset] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    error ? { type: 'error', text: error } : null
  )
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [createRole, setCreateRole] = useState<AppRole>('student')
  const [inviteRole, setInviteRole] = useState<AppRole>('student')
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [isInvitingUser, setIsInvitingUser] = useState(false)
  const [deleteCandidate, setDeleteCandidate] = useState<UserListItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [enrollmentStudent, setEnrollmentStudent] = useState<UserListItem | null>(null)
  const [manageCandidate, setManageCandidate] = useState<UserListItem | null>(null)
  const [isPending, startTransition] = useTransition()

  const LIMIT = 50

  const manageableRoles = currentUser.isPlatformAdmin
    ? ROLES
    : ROLES.filter((r) => r.value !== 'admin' && r.value !== 'school_admin')

  async function loadUsers(newOffset = 0) {
    const result = await getUsers({
      search,
      role: roleFilter as AppRole | 'all',
      approvalStatus: statusFilter as 'pending' | 'approved' | 'rejected' | 'all',
      schoolId: schoolFilter,
      limit: LIMIT,
      offset: newOffset,
    })

    if (result.success && result.data) {
      setUsers(result.data.users)
      setCount(result.data.count)
      setOffset(newOffset)
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to load users' })
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(() => loadUsers(0))
  }

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isCreatingUser) return

    const form = new FormData(e.currentTarget)
    setIsCreatingUser(true)

    try {
      const result = await createUser({
        full_name: String(form.get('full_name') || ''),
        email: String(form.get('email') || ''),
        password: String(form.get('password') || ''),
        role: String(form.get('role') || 'student') as AppRole,
        school_id: String(form.get('school_id') || '') || null,
        approval_status: String(form.get('approval_status') || 'pending') as 'pending' | 'approved' | 'rejected',
      })

      if (result.success) {
        setMessage({ type: 'success', text: 'User created successfully' })
        setShowCreateForm(false)
        setCreateRole('student')
        await loadUsers(0)
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create user' })
      }
    } finally {
      setIsCreatingUser(false)
    }
  }

  async function handleDeleteUser() {
    if (!deleteCandidate) return

    setIsDeleting(true)
    const result = await deleteUser(deleteCandidate.id)
    setIsDeleting(false)

    if (result.success) {
      setMessage({ type: 'success', text: `User ${deleteCandidate.email} deleted successfully` })
      setDeleteCandidate(null)
      await loadUsers(0)
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to delete user' })
    }
  }

  async function handleInviteUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isInvitingUser) return

    const form = new FormData(e.currentTarget)
    setIsInvitingUser(true)

    try {
      const result = await inviteUser({
        full_name: String(form.get('full_name') || ''),
        email: String(form.get('email') || ''),
        role: String(form.get('role') || 'student') as AppRole,
        school_id: String(form.get('school_id') || '') || null,
        approval_status: String(form.get('approval_status') || 'pending') as 'pending' | 'approved' | 'rejected',
      })

      if (result.success) {
        setMessage({
          type: 'success',
          text: result.data?.alreadyInvited
            ? 'Invitation already exists. No duplicate email was sent.'
            : result.data?.recoverySent
              ? 'Account already existed. A fresh setup link was sent safely.'
              : 'Invitation sent successfully',
        })
        setShowInviteForm(false)
        setInviteRole('student')
        await loadUsers(0)
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to send invitation' })
      }
    } finally {
      setIsInvitingUser(false)
    }
  }

  async function handleAction<T extends unknown[]>(
    action: (...args: T) => Promise<{ success: boolean; error?: string }>,
    ...args: T
  ) {
    const result = await action(...args)
    if (result.success) {
      setMessage({ type: 'success', text: 'Action completed' })
      await loadUsers(offset)
    } else {
      setMessage({ type: 'error', text: result.error || 'Action failed' })
    }
  }

  function roleRequiresSchool(role: AppRole): boolean {
    return role === 'student' || role === 'instructor' || role === 'school_admin'
  }

  function currentSchoolName(): string {
    if (!currentUser.schoolId) return 'Assigned school unavailable'
    return schools.find((school) => school.id === currentUser.schoolId)?.name ?? 'Assigned school'
  }

  function formatDate(date: string): string {
    return new Date(date).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-lg border p-4 ${
            message.type === 'success'
              ? 'border-gold/30 bg-gold/10 text-gold'
              : 'border-silver/30 bg-silver/10 text-silver'
          }`}
        >
          {message.text}
          <button
            onClick={() => setMessage(null)}
            className="ml-4 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-2 text-white placeholder-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)]"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
          >
            <option value="all">All roles</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
          >
            <option value="all">All statuses</option>
            {APPROVAL_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {currentUser.isPlatformAdmin && (
            <select
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
            >
              <option value="all">All schools</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-[var(--color-brand-gold)] text-black font-medium rounded-lg hover:bg-[var(--color-brand-gold)] disabled:opacity-50"
          >
            {isPending ? 'Loading...' : 'Search'}
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm)
              setShowInviteForm(false)
              setCreateRole('student')
            }}
            className="px-4 py-2 bg-[var(--color-background-secondary)] text-white border border-[var(--color-border-primary)] rounded-lg hover:border-[var(--color-brand-gold)]/50"
          >
            {showCreateForm ? 'Cancel' : 'Create User'}
          </button>
          <button
            onClick={() => {
              setShowInviteForm(!showInviteForm)
              setShowCreateForm(false)
              setInviteRole('student')
            }}
            className="px-4 py-2 bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/30 rounded-lg hover:bg-[var(--color-brand-gold)]/20"
          >
            {showInviteForm ? 'Cancel Invite' : 'Invite User'}
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Create User</h2>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="create-full-name" className="block text-sm text-[var(--color-text-muted)] mb-1">Full name</label>
              <input
                id="create-full-name"
                name="full_name"
                type="text"
                required
                className="min-h-11 w-full bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              />
            </div>
            <div>
              <label htmlFor="create-email" className="block text-sm text-[var(--color-text-muted)] mb-1">Email</label>
              <input
                id="create-email"
                name="email"
                type="email"
                required
                className="min-h-11 w-full bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              />
            </div>
            <div>
              <label htmlFor="create-password" className="block text-sm text-[var(--color-text-muted)] mb-1">Temporary password</label>
              <input
                id="create-password"
                name="password"
                type="password"
                required
                minLength={8}
                maxLength={72}
                className="min-h-11 w-full bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              />
              <p className="text-xs text-[var(--color-text-muted)] mt-1">8–72 characters. User will be forced to change it on first login.</p>
            </div>
            <div>
              <label htmlFor="create-role" className="block text-sm text-[var(--color-text-muted)] mb-1">Role</label>
              <select
                id="create-role"
                name="role"
                required
                value={createRole}
                onChange={(e) => setCreateRole(e.target.value as AppRole)}
                className="min-h-11 w-full bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              >
                {manageableRoles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="create-school" className="block text-sm text-[var(--color-text-muted)] mb-1">School</label>
              {currentUser.isPlatformAdmin ? (
                <select
                  id="create-school"
                  name="school_id"
                  required={roleRequiresSchool(createRole)}
                  defaultValue=""
                  className="min-h-11 w-full bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
                >
                  <option value="">
                    {roleRequiresSchool(createRole) ? 'Select a school' : 'No school'}
                  </option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <input type="hidden" name="school_id" value={currentUser.schoolId ?? ''} />
                  <div className="min-h-11 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] px-4 py-2 text-white">
                    {currentSchoolName()}
                  </div>
                </>
              )}
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                {roleRequiresSchool(createRole) ? 'A school is required for this role.' : 'School assignment is optional for this role.'}
              </p>
            </div>
            <div>
              <label htmlFor="create-approval-status" className="block text-sm text-[var(--color-text-muted)] mb-1">Approval status</label>
              <select
                id="create-approval-status"
                name="approval_status"
                required
                defaultValue="pending"
                className="min-h-11 w-full bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              >
                {APPROVAL_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isCreatingUser}
                className="min-h-11 w-full sm:w-auto px-6 py-2 bg-[var(--color-brand-gold)] text-black font-medium rounded-lg hover:bg-[var(--color-brand-gold)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreatingUser ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {showInviteForm && (
        <div className="bg-[var(--color-background-primary)] border border-[var(--color-brand-gold)]/30 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Invite User</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            Sends an email invitation. The recipient chooses their own password and is redirected to the platform.
          </p>
          <form onSubmit={handleInviteUser} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="invite-full-name" className="block text-sm text-[var(--color-text-muted)] mb-1">Full name</label>
              <input
                id="invite-full-name"
                name="full_name"
                type="text"
                required
                className="min-h-11 w-full bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              />
            </div>
            <div>
              <label htmlFor="invite-email" className="block text-sm text-[var(--color-text-muted)] mb-1">Email</label>
              <input
                id="invite-email"
                name="email"
                type="email"
                required
                className="min-h-11 w-full bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              />
            </div>
            <div>
              <label htmlFor="invite-role" className="block text-sm text-[var(--color-text-muted)] mb-1">Role</label>
              <select
                id="invite-role"
                name="role"
                required
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as AppRole)}
                className="min-h-11 w-full bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              >
                {manageableRoles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="invite-school" className="block text-sm text-[var(--color-text-muted)] mb-1">School</label>
              {currentUser.isPlatformAdmin ? (
                <select
                  id="invite-school"
                  name="school_id"
                  required={roleRequiresSchool(inviteRole)}
                  defaultValue=""
                  className="min-h-11 w-full bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
                >
                  <option value="">
                    {roleRequiresSchool(inviteRole) ? 'Select a school' : 'No school'}
                  </option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <input type="hidden" name="school_id" value={currentUser.schoolId ?? ''} />
                  <div className="min-h-11 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)] px-4 py-2 text-white">
                    {currentSchoolName()}
                  </div>
                </>
              )}
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                {roleRequiresSchool(inviteRole) ? 'A school is required for this role.' : 'School assignment is optional for this role.'}
              </p>
            </div>
            <div>
              <label htmlFor="invite-approval-status" className="block text-sm text-[var(--color-text-muted)] mb-1">Approval status</label>
              <select
                id="invite-approval-status"
                name="approval_status"
                required
                defaultValue="pending"
                className="min-h-11 w-full bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              >
                {APPROVAL_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isInvitingUser}
                className="min-h-11 w-full sm:w-auto px-6 py-2 bg-[var(--color-brand-gold)] text-black font-medium rounded-lg hover:bg-[var(--color-brand-gold)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isInvitingUser ? 'Sending…' : 'Send Invitation'}
              </button>
            </div>
          </form>
        </div>
      )}

      <section data-testid="mobile-user-list" className="space-y-3 md:hidden" aria-label="Users">
        {users.map((user) => (
          <UserManagementMobileCard
            key={user.id}
            user={user}
            onManage={setManageCandidate}
          />
        ))}
        {users.length === 0 && (
          <div className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-primary)] px-4 py-8 text-center text-[var(--color-text-muted)]">
            No users found
          </div>
        )}
        <div className="flex items-center justify-between gap-3 pt-1 text-sm text-[var(--color-text-muted)]">
          <span>
            Showing {users.length} of {count} users
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => loadUsers(Math.max(0, offset - LIMIT))}
              disabled={offset === 0}
              className="min-h-10 rounded-lg bg-[var(--color-background-secondary)] px-3 py-2 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => loadUsers(offset + LIMIT)}
              disabled={offset + LIMIT >= count}
              className="min-h-10 rounded-lg bg-[var(--color-background-secondary)] px-3 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <div data-testid="desktop-user-table" className="hidden md:block bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl overflow-hidden">
        <div className="max-h-[calc(100vh-16rem)] min-h-[20rem] overflow-auto overscroll-contain">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="sticky top-0 z-10 bg-[var(--color-background-primary)] border-b border-[var(--color-border-primary)]">
              <tr>
                <th scope="col" className="px-4 py-3 text-sm font-medium text-[var(--color-text-muted)]">Name</th>
                <th scope="col" className="px-4 py-3 text-sm font-medium text-[var(--color-text-muted)]">Email</th>
                <th scope="col" className="px-4 py-3 text-sm font-medium text-[var(--color-text-muted)]">Role</th>
                <th scope="col" className="px-4 py-3 text-sm font-medium text-[var(--color-text-muted)]">School</th>
                <th scope="col" className="px-4 py-3 text-sm font-medium text-[var(--color-text-muted)]">Status</th>
                <th scope="col" className="px-4 py-3 text-sm font-medium text-[var(--color-text-muted)]">Disabled</th>
                <th scope="col" className="px-4 py-3 text-sm font-medium text-[var(--color-text-muted)]">Password Reset</th>
                <th scope="col" className="px-4 py-3 text-sm font-medium text-[var(--color-text-muted)]">Created</th>
                <th scope="col" className="px-4 py-3 text-sm font-medium text-[var(--color-text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--color-background-secondary)]/50">
                  <td className="px-4 py-3 text-white">{user.full_name}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleAction(changeUserRole, user.id, e.target.value as AppRole)}
                      className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
                    >
                      {manageableRoles.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {currentUser.isPlatformAdmin ? (
                      <select
                        value={user.school_id ?? ''}
                        onChange={(e) => handleAction(assignUserSchool, user.id, e.target.value || null)}
                        className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
                      >
                        <option value="">No school</option>
                        {schools.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      user.school_name ?? '—'
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.approval_status}
                      onChange={(e) => handleAction(updateUserStatus, user.id, e.target.value as 'approved' | 'rejected')}
                      className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
                    >
                      {APPROVAL_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleAction(toggleUserDisabled, user.id, !user.is_disabled)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.is_disabled
                          ? 'bg-silver/20 text-silver border border-silver/30'
                          : 'bg-gold/20 text-gold border border-gold/30'
                      }`}
                    >
                      {user.is_disabled ? 'Disabled' : 'Enabled'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        user.requires_password_change
                          ? 'bg-warm-bronze/20 text-warm-bronze border border-warm-bronze/30'
                          : 'bg-[var(--color-border-secondary)] text-[var(--color-text-secondary)] border border-silver-gray'
                      }`}
                    >
                      {user.requires_password_change ? 'Required' : 'None'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] text-sm">{formatDate(user.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleAction(resendUserSetupLink, user.id)}
                        disabled={user.is_disabled || user.approval_status === 'rejected'}
                        title={
                          user.is_disabled
                            ? 'Re-enable this account before sending an access link'
                            : user.approval_status === 'rejected'
                              ? 'Approve this account before sending an access link'
                              : 'Send a fresh account setup / password recovery link'
                        }
                        className="px-2 py-1 text-xs bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/30 rounded hover:bg-[var(--color-brand-gold)]/20 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Send setup link
                      </button>
                      <button
                        onClick={() => handleAction(requirePasswordChange, user.id)}
                        className="px-2 py-1 text-xs bg-[var(--color-background-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border-primary)] rounded hover:border-[var(--color-brand-gold)]/50"
                      >
                        Require password reset
                      </button>
                      <button
                        onClick={() => {
                          const password = prompt('Enter new temporary password (8-72 chars):')
                          if (password) handleAction(resetUserPassword, user.id, password)
                        }}
                        className="px-2 py-1 text-xs bg-[var(--color-background-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border-primary)] rounded hover:border-[var(--color-brand-gold)]/50"
                      >
                        Reset password
                      </button>
                      {user.role === 'student' && (
                        <span className="inline-flex items-center gap-1">
                          {typeof user.enrollment_count === 'number' && (
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 text-xs rounded-full ${
                                user.enrollment_count > 0
                                  ? 'bg-gold/10 text-gold border border-gold/20'
                                  : 'bg-[var(--color-border-secondary)] text-[var(--color-text-muted)] border border-silver-gray'
                              }`}
                              title={`${user.enrollment_count} active enrollment${user.enrollment_count !== 1 ? 's' : ''}`}
                            >
                              {user.enrollment_count} program{user.enrollment_count !== 1 ? 's' : ''}
                            </span>
                          )}
                          <button
                            onClick={() => setEnrollmentStudent(user)}
                            className="px-2 py-1 text-xs bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/30 rounded hover:bg-[var(--color-brand-gold)]/20"
                          >
                            Enroll
                          </button>
                        </span>
                      )}
                      <button
                        onClick={() => setDeleteCandidate(user)}
                        disabled={user.id === currentUser.id}
                        title={user.id === currentUser.id ? 'You cannot delete your own account' : 'Delete user'}
                        className="px-2 py-1 text-xs bg-silver/10 text-silver border border-silver/30 rounded hover:bg-silver/20 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[var(--color-text-muted)]">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-[var(--color-border-primary)] flex items-center justify-between text-sm text-[var(--color-text-muted)]">
          <span>
            Showing {users.length} of {count} users
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => loadUsers(Math.max(0, offset - LIMIT))}
              disabled={offset === 0}
              className="px-3 py-1 bg-[var(--color-background-secondary)] rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => loadUsers(offset + LIMIT)}
              disabled={offset + LIMIT >= count}
              className="px-3 py-1 bg-[var(--color-background-secondary)] rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <ManageUserModal
        user={manageCandidate}
        currentUserId={currentUser.id}
        isPlatformAdmin={currentUser.isPlatformAdmin}
        schools={schools}
        onClose={() => setManageCandidate(null)}
        onUpdated={async (text) => {
          setMessage({ type: 'success', text })
          await loadUsers(offset)
        }}
        onManageEnrollment={(user) => {
          setManageCandidate(null)
          setEnrollmentStudent(user)
        }}
        onDelete={(user) => {
          setManageCandidate(null)
          setDeleteCandidate(user)
        }}
      />

      {/* Enrollment Modal */}
      {enrollmentStudent && (
        <EnrollmentModal
          isOpen={!!enrollmentStudent}
          onClose={() => setEnrollmentStudent(null)}
          studentId={enrollmentStudent.id}
          studentName={enrollmentStudent.full_name}
          studentEmail={enrollmentStudent.email}
        />
      )}

      <Modal
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        title="Delete user"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteCandidate(null)}
              disabled={isDeleting}
              className="px-4 py-2 bg-[var(--color-background-secondary)] text-white rounded-lg hover:bg-[var(--color-border-secondary)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteUser}
              disabled={isDeleting}
              aria-label="Confirm delete"
              className="px-4 py-2 bg-silver text-white rounded-lg hover:bg-silver disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        }
      >
        {deleteCandidate && (
          <div className="space-y-3">
            <p className="text-[var(--color-text-secondary)]">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-white">{deleteCandidate.full_name}</span> (
              <span className="text-[var(--color-text-muted)]">{deleteCandidate.email}</span>)?
            </p>
            <p className="text-sm text-silver">
              This will remove the user from Authentication and delete their profile and associated
              records. This action cannot be undone.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
