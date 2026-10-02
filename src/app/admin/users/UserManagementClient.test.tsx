import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { UserManagementClient } from './UserManagementClient'

const mockCreateUser = vi.fn()
const mockInviteUser = vi.fn()
const mockDeleteUser = vi.fn()
const mockGetUsers = vi.fn()
const mockGetSchools = vi.fn()

vi.mock('./actions', () => ({
  createUser: (...args: unknown[]) => mockCreateUser(...args),
  inviteUser: (...args: unknown[]) => mockInviteUser(...args),
  updateUserStatus: vi.fn(),
  toggleUserDisabled: vi.fn(),
  changeUserRole: vi.fn(),
  assignUserSchool: vi.fn(),
  requirePasswordChange: vi.fn(),
  resetUserPassword: vi.fn(),
  resendUserSetupLink: vi.fn(),
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

    fireEvent.click(within(screen.getByTestId('mobile-user-list')).getByRole('button', { name: 'Manage user' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete user' }))

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

    fireEvent.click(within(screen.getByTestId('mobile-user-list')).getByRole('button', { name: 'Manage user' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete user' }))
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

    fireEvent.click(within(screen.getByTestId('mobile-user-list')).getByRole('button', { name: 'Manage user' }))
    const deleteButton = within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete user' })
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

    fireEvent.click(within(screen.getByTestId('mobile-user-list')).getByRole('button', { name: 'Manage user' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete user' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm delete' }))

    await waitFor(() => {
      expect(screen.getByText(/delete failed/i)).toBeInTheDocument()
    })
  })
})


describe('UserManagementClient — UM-H2.1 responsive presentation', () => {
  it('renders a mobile card list and keeps the desktop table behind the md breakpoint', () => {
    render(
      <UserManagementClient
        currentUser={currentUser}
        initialUsers={[targetUser]}
        initialCount={1}
        schools={[{ id: 'school-1', name: 'RISE Program' }]}
      />
    )

    const mobileList = screen.getByTestId('mobile-user-list')
    const desktopTable = screen.getByTestId('desktop-user-table')

    expect(mobileList).toHaveClass('md:hidden')
    expect(desktopTable).toHaveClass('hidden', 'md:block')
    expect(screen.getByTestId('mobile-user-card')).toBeInTheDocument()
  })

  it('opens the mobile Manage user shell for the selected user', () => {
    render(
      <UserManagementClient
        currentUser={currentUser}
        initialUsers={[targetUser]}
        initialCount={1}
        schools={[{ id: 'school-1', name: 'RISE Program' }]}
      />
    )

    fireEvent.click(within(screen.getByTestId('mobile-user-list')).getByRole('button', { name: 'Manage user' }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Manage — Target User')).toBeInTheDocument()
    expect(within(dialog).getByText('target@ascynpro.test')).toBeInTheDocument()
    expect(within(dialog).getAllByText('RISE Program').length).toBeGreaterThanOrEqual(1)
  })
})


describe('UserManagementClient — UM-H2.3 Create/Invite mobile safety', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUsers.mockResolvedValue({
      success: true,
      data: { users: [], count: 0 },
    })
    mockCreateUser.mockResolvedValue({ success: true, data: { id: 'created-id' } })
    mockInviteUser.mockResolvedValue({ success: true, data: { id: 'invited-id' } })
  })

  it('requires a school for Student but allows No school for Admin', () => {
    render(
      <UserManagementClient
        currentUser={currentUser}
        initialUsers={[]}
        initialCount={0}
        schools={[{ id: 'school-1', name: 'RISE Program' }]}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Create User' }))

    const createPanel = screen.getByRole('heading', { name: 'Create User' }).parentElement!
    const schoolSelect = within(createPanel).getByLabelText('School')
    const roleSelect = within(createPanel).getByLabelText('Role')

    expect(schoolSelect).toBeRequired()
    expect(within(schoolSelect).getByRole('option', { name: 'Select a school' })).toBeInTheDocument()

    fireEvent.change(roleSelect, { target: { value: 'admin' } })

    expect(schoolSelect).not.toBeRequired()
    expect(within(schoolSelect).getByRole('option', { name: 'No school' })).toBeInTheDocument()
  })

  it('locks Create User while the request is pending and prevents duplicate submission', async () => {
    let resolveCreate: ((value: { success: boolean; data: { id: string } }) => void) | undefined
    mockCreateUser.mockImplementation(
      () => new Promise((resolve) => { resolveCreate = resolve })
    )

    render(
      <UserManagementClient
        currentUser={currentUser}
        initialUsers={[]}
        initialCount={0}
        schools={[{ id: 'school-1', name: 'RISE Program' }]}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Create User' }))
    const createPanel = screen.getByRole('heading', { name: 'Create User' }).parentElement!

    fireEvent.change(within(createPanel).getByLabelText('Full name'), { target: { value: 'New Student' } })
    fireEvent.change(within(createPanel).getByLabelText('Email'), { target: { value: 'new@student.test' } })
    fireEvent.change(within(createPanel).getByLabelText('Temporary password'), { target: { value: 'Temporary123!' } })
    fireEvent.change(within(createPanel).getByLabelText('School'), { target: { value: 'school-1' } })

    fireEvent.submit(within(createPanel).getByRole('button', { name: 'Create User' }).closest('form')!)

    await waitFor(() => {
      expect(within(createPanel).getByRole('button', { name: 'Creating…' })).toBeDisabled()
    })

    fireEvent.submit(within(createPanel).getByRole('button', { name: 'Creating…' }).closest('form')!)
    expect(mockCreateUser).toHaveBeenCalledTimes(1)

    resolveCreate?.({ success: true, data: { id: 'created-id' } })
    await waitFor(() => expect(mockGetUsers).toHaveBeenCalled())
  })

  it('locks Send Invitation while pending and prevents duplicate submission', async () => {
    let resolveInvite: ((value: { success: boolean; data: { id: string } }) => void) | undefined
    mockInviteUser.mockImplementation(
      () => new Promise((resolve) => { resolveInvite = resolve })
    )

    render(
      <UserManagementClient
        currentUser={currentUser}
        initialUsers={[]}
        initialCount={0}
        schools={[{ id: 'school-1', name: 'RISE Program' }]}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Invite User' }))
    const invitePanel = screen.getByRole('heading', { name: 'Invite User' }).parentElement!

    fireEvent.change(within(invitePanel).getByLabelText('Full name'), { target: { value: 'Invited Student' } })
    fireEvent.change(within(invitePanel).getByLabelText('Email'), { target: { value: 'invite@student.test' } })
    fireEvent.change(within(invitePanel).getByLabelText('School'), { target: { value: 'school-1' } })

    fireEvent.submit(within(invitePanel).getByRole('button', { name: 'Send Invitation' }).closest('form')!)

    await waitFor(() => {
      expect(within(invitePanel).getByRole('button', { name: 'Sending…' })).toBeDisabled()
    })

    fireEvent.submit(within(invitePanel).getByRole('button', { name: 'Sending…' }).closest('form')!)
    expect(mockInviteUser).toHaveBeenCalledTimes(1)

    resolveInvite?.({ success: true, data: { id: 'invited-id' } })
    await waitFor(() => expect(mockGetUsers).toHaveBeenCalled())
  })

  it('locks a school admin to their own school without a No school selector', () => {
    render(
      <UserManagementClient
        currentUser={{
          id: 'school-admin-id',
          role: 'school_admin',
          schoolId: 'school-1',
          isPlatformAdmin: false,
        }}
        initialUsers={[]}
        initialCount={0}
        schools={[{ id: 'school-1', name: 'RISE Program' }]}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Invite User' }))
    const invitePanel = screen.getByRole('heading', { name: 'Invite User' }).parentElement!

    expect(within(invitePanel).queryByRole('combobox', { name: 'School' })).not.toBeInTheDocument()
    expect(within(invitePanel).getByText('RISE Program')).toBeInTheDocument()

    const hiddenSchool = invitePanel.querySelector('input[name="school_id"]') as HTMLInputElement
    expect(hiddenSchool.value).toBe('school-1')
  })
})


describe('UserManagementClient — UM-H2.4 final desktop safety', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUsers.mockResolvedValue({
      success: true,
      data: { users: [targetUser], count: 1 },
    })
  })

  it('keeps the desktop table but routes sensitive mutations through Manage user', () => {
    render(
      <UserManagementClient
        currentUser={currentUser}
        initialUsers={[targetUser]}
        initialCount={1}
        schools={[{ id: 'school-1', name: 'RISE Program' }]}
      />
    )

    const desktopTable = screen.getByTestId('desktop-user-table')
    expect(desktopTable).toHaveClass('hidden', 'md:block')
    expect(within(desktopTable).getByText('Instructor')).toBeInTheDocument()
    expect(within(desktopTable).getByText('RISE Program')).toBeInTheDocument()
    expect(within(desktopTable).getByText('Approved')).toBeInTheDocument()
    expect(within(desktopTable).getByText('Enabled')).toBeInTheDocument()
    expect(within(desktopTable).getByRole('button', { name: 'Manage user' })).toBeInTheDocument()

    expect(within(desktopTable).queryByRole('button', { name: /reset password/i })).not.toBeInTheDocument()
    expect(within(desktopTable).queryByRole('button', { name: /send setup link/i })).not.toBeInTheDocument()
  })

  it('does not invoke window.prompt from the desktop user-management table', () => {
    const promptSpy = vi.spyOn(window, 'prompt')

    render(
      <UserManagementClient
        currentUser={currentUser}
        initialUsers={[targetUser]}
        initialCount={1}
        schools={[{ id: 'school-1', name: 'RISE Program' }]}
      />
    )

    fireEvent.click(within(screen.getByTestId('desktop-user-table')).getByRole('button', { name: 'Manage user' }))

    expect(promptSpy).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    promptSpy.mockRestore()
  })
})
