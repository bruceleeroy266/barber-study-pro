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
  getUsers,
  getSchools,
  UserListItem,
} from './actions'
import { AppRole } from '@/types'

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
    const form = new FormData(e.currentTarget)

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
      await loadUsers(0)
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to create user' })
    }
  }

  async function handleInviteUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const result = await inviteUser({
      full_name: String(form.get('full_name') || ''),
      email: String(form.get('email') || ''),
      role: String(form.get('role') || 'student') as AppRole,
      school_id: String(form.get('school_id') || '') || null,
      approval_status: String(form.get('approval_status') || 'pending') as 'pending' | 'approved' | 'rejected',
    })

    if (result.success) {
      setMessage({ type: 'success', text: 'Invitation sent successfully' })
      setShowInviteForm(false)
      await loadUsers(0)
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to send invitation' })
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

  function formatDate(date: string): string {
    return new Date(date).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-lg border p-4 ${
            message.type === 'success'
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
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
            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
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
            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
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
              className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
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
            className="px-4 py-2 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#c4a030] disabled:opacity-50"
          >
            {isPending ? 'Loading...' : 'Search'}
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm)
              setShowInviteForm(false)
            }}
            className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg hover:border-[#D4AF37]/50"
          >
            {showCreateForm ? 'Cancel' : 'Create User'}
          </button>
          <button
            onClick={() => {
              setShowInviteForm(!showInviteForm)
              setShowCreateForm(false)
            }}
            className="px-4 py-2 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg hover:bg-[#D4AF37]/20"
          >
            {showInviteForm ? 'Cancel Invite' : 'Invite User'}
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Create User</h2>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full name</label>
              <input
                name="full_name"
                type="text"
                required
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Temporary password</label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                maxLength={72}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <p className="text-xs text-gray-500 mt-1">8–72 characters. User will be forced to change it on first login.</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Role</label>
              <select
                name="role"
                required
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              >
                {manageableRoles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">School</label>
              <select
                name="school_id"
                required
                defaultValue={currentUser.schoolId ?? ''}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="">No school</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Approval status</label>
              <select
                name="approval_status"
                required
                defaultValue="pending"
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
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
                className="px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#c4a030]"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      )}

      {showInviteForm && (
        <div className="bg-gray-900 border border-[#D4AF37]/30 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Invite User</h2>
          <p className="text-sm text-gray-400 mb-4">
            Sends an email invitation. The recipient chooses their own password and is redirected to the platform.
          </p>
          <form onSubmit={handleInviteUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full name</label>
              <input
                name="full_name"
                type="text"
                required
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Role</label>
              <select
                name="role"
                required
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              >
                {manageableRoles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">School</label>
              <select
                name="school_id"
                required
                defaultValue={currentUser.schoolId ?? ''}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="">No school</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Approval status</label>
              <select
                name="approval_status"
                required
                defaultValue="pending"
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
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
                className="px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#c4a030]"
              >
                Send Invitation
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-950 border-b border-gray-800">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Name</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Email</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Role</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">School</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Disabled</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Pwd Change</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Created</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-white">{user.full_name}</td>
                  <td className="px-4 py-3 text-gray-300">{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleAction(changeUserRole, user.id, e.target.value as AppRole)}
                      className="bg-gray-950 border border-gray-800 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      {manageableRoles.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {currentUser.isPlatformAdmin ? (
                      <select
                        value={user.school_id ?? ''}
                        onChange={(e) => handleAction(assignUserSchool, user.id, e.target.value || null)}
                        className="bg-gray-950 border border-gray-800 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
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
                      className="bg-gray-950 border border-gray-800 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
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
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}
                    >
                      {user.is_disabled ? 'Disabled' : 'Enabled'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        user.requires_password_change
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-gray-700 text-gray-300 border border-gray-600'
                      }`}
                    >
                      {user.requires_password_change ? 'Required' : 'None'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{formatDate(user.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleAction(requirePasswordChange, user.id)}
                        className="px-2 py-1 text-xs bg-gray-800 text-gray-300 border border-gray-700 rounded hover:border-[#D4AF37]/50"
                      >
                        Require pwd change
                      </button>
                      <button
                        onClick={() => {
                          const password = prompt('Enter new temporary password (8-72 chars):')
                          if (password) handleAction(resetUserPassword, user.id, password)
                        }}
                        className="px-2 py-1 text-xs bg-gray-800 text-gray-300 border border-gray-700 rounded hover:border-[#D4AF37]/50"
                      >
                        Reset password
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between text-sm text-gray-400">
          <span>
            Showing {users.length} of {count} users
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => loadUsers(Math.max(0, offset - LIMIT))}
              disabled={offset === 0}
              className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => loadUsers(offset + LIMIT)}
              disabled={offset + LIMIT >= count}
              className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
