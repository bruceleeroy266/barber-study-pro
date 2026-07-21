import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { UserManagementClient } from './UserManagementClient'

const mockDeleteUser = vi.fn()
const mockGetUsers = vi.fn()
const mockGetSchools = vi.fn()

vi.mock('./actions', () => ({
  createUser: vi.fn(),
  inviteUser: vi.fn(),
  updateUserStatus: vi.fn(),
  toggleUserDisabled: vi.fn(),
  changeUserRole: vi.fn(),
  assignUserSchool: vi.fn(),
  requirePasswordChange: vi.fn(),
  resetUserPassword: vi.fn(),
  deleteUser: (...args: unknown[]) => mockDeleteUser(...args),
  getUsers: (...args: unknown[]) => mockGetUsers(...args),
  getSchools: (...args: unknown[]) => mockGetSchools(...args),
}))

vi.mock('@/components/ui/Modal', () => ({
  default: ({
    isOpen,
    onClose,
    title,
    children,
    footer,
  }: {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
    footer: ReactNode
  }) =>
    isOpen ? (
      <div role="dialog" aria-modal="true">
        <h2>{title}</h2>
        <div>{children}</div>
        <div>{footer}</div>
        <button onClick={onClose}>Close modal</button>
      </div>
    ) : null,
}))

const currentUser = {
  id: 'admin-id',
  role: 'admin',
  schoolId: null,
  isPlatformAdmin: true,
}

const targetUser = {
  id: 'target-id',
  full_name: 'Target User',
  email: 'target@ascynpro.test',
  role: 'instructor' as const,
  school_id: 'school-1',
  school_name: 'RISE Program',
  approval_status: 'approved' as const,
  is_disabled: false,
  requires_password_change: false,
  created_at: '2026-07-21T00:00:00Z',
  updated_at: '2026-07-21T00:00:00Z',
}

describe('UserManagementClient — delete user', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDeleteUser.mockResolvedValue({ success: true })
    mockGetUsers.mockResolvedValue({
      success: true,
      data: { users: [], count: 0 },
    })
  })

  it('opens a confirmation dialog when Delete is clicked', () => {
    render(
      <UserManagementClient
        currentUser={currentUser}
        initialUsers={[targetUser]}
        initialCount={1}
        schools={[{ id: 'school-1', name: 'RISE Program' }]}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByText(/permanently delete/i)).toBeInTheDocument()
    expect(within(dialog).getByText('Target User')).toBeInTheDocument()
  })

  it('calls deleteUser and reloads the list after confirming', async () => {
    render(
      <UserManagementClient
        currentUser={currentUser}
        initialUsers={[targetUser]}
        initialCount={1}
        schools={[{ id: 'school-1', name: 'RISE Program' }]}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm delete' }))

    await waitFor(() => {
      expect(mockDeleteUser).toHaveBeenCalledWith('target-id')
      expect(mockGetUsers).toHaveBeenCalled()
    })
  })

  it('disables the Delete button for the current user', () => {
    render(
      <UserManagementClient
        currentUser={{ ...currentUser, id: 'target-id' }}
        initialUsers={[targetUser]}
        initialCount={1}
        schools={[{ id: 'school-1', name: 'RISE Program' }]}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    expect(deleteButton).toBeDisabled()
  })

  it('shows an error message when delete fails', async () => {
    mockDeleteUser.mockResolvedValue({ success: false, error: 'Delete failed' })

    render(
      <UserManagementClient
        currentUser={currentUser}
        initialUsers={[targetUser]}
        initialCount={1}
        schools={[{ id: 'school-1', name: 'RISE Program' }]}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm delete' }))

    await waitFor(() => {
      expect(screen.getByText(/delete failed/i)).toBeInTheDocument()
    })
  })
})
