import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import ManageUserModal from './ManageUserModal'

const mockAssignUserSchool = vi.fn()
const mockChangeUserRole = vi.fn()
const mockRequirePasswordChange = vi.fn()
const mockResendUserSetupLink = vi.fn()
const mockResetUserPassword = vi.fn()
const mockToggleUserDisabled = vi.fn()
const mockUpdateUserStatus = vi.fn()

vi.mock('./actions', () => ({
  assignUserSchool: (...args: unknown[]) => mockAssignUserSchool(...args),
  changeUserRole: (...args: unknown[]) => mockChangeUserRole(...args),
  requirePasswordChange: (...args: unknown[]) => mockRequirePasswordChange(...args),
  resendUserSetupLink: (...args: unknown[]) => mockResendUserSetupLink(...args),
  resetUserPassword: (...args: unknown[]) => mockResetUserPassword(...args),
  toggleUserDisabled: (...args: unknown[]) => mockToggleUserDisabled(...args),
  updateUserStatus: (...args: unknown[]) => mockUpdateUserStatus(...args),
}))

vi.mock('@/components/ui/Modal', () => ({
  default: ({
    isOpen,
    title,
    children,
  }: {
    isOpen: boolean
    title: string
    children: ReactNode
  }) => isOpen ? (
    <div role="dialog" aria-label={title}>
      {children}
    </div>
  ) : null,
}))

const user = {
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

const props = {
  user,
  currentUserId: 'admin-id',
  isPlatformAdmin: true,
  schools: [
    { id: 'school-1', name: 'RISE Program' },
    { id: 'school-2', name: 'Elevate Academy' },
  ],
  onClose: vi.fn(),
  onUpdated: vi.fn(async () => {}),
  onManageEnrollment: vi.fn(),
  onDelete: vi.fn(),
}

describe('ManageUserModal — UM-H2.2 action safety', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAssignUserSchool.mockResolvedValue({ success: true })
    mockChangeUserRole.mockResolvedValue({ success: true })
    mockRequirePasswordChange.mockResolvedValue({ success: true })
    mockResendUserSetupLink.mockResolvedValue({ success: true })
    mockResetUserPassword.mockResolvedValue({ success: true })
    mockToggleUserDisabled.mockResolvedValue({ success: true })
    mockUpdateUserStatus.mockResolvedValue({ success: true })
  })

  it('does not change role until the explicit confirmation is accepted', async () => {
    render(<ManageUserModal {...props} />)

    fireEvent.change(screen.getByLabelText('Role'), { target: { value: 'student' } })
    expect(mockChangeUserRole).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Review role change' }))
    expect(mockChangeUserRole).not.toHaveBeenCalled()
    expect(screen.getByText(/Change role from Instructor to Student/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Confirm change' }))

    await waitFor(() => {
      expect(mockChangeUserRole).toHaveBeenCalledTimes(1)
      expect(mockChangeUserRole).toHaveBeenCalledWith('target-id', 'student')
    })
  })

  it('does not move school until the explicit confirmation is accepted', async () => {
    render(<ManageUserModal {...props} />)

    fireEvent.change(screen.getByLabelText('School'), { target: { value: 'school-2' } })
    expect(mockAssignUserSchool).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Review school change' }))
    expect(screen.getByText(/RISE Program to Elevate Academy/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Confirm change' }))

    await waitFor(() => {
      expect(mockAssignUserSchool).toHaveBeenCalledWith('target-id', 'school-2')
    })
  })

  it('requires confirmation before disabling an account', async () => {
    render(<ManageUserModal {...props} />)

    fireEvent.click(screen.getByRole('button', { name: 'Review disable account' }))
    expect(mockToggleUserDisabled).not.toHaveBeenCalled()
    expect(screen.getByText(/Enabled to Disabled/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Confirm change' }))

    await waitFor(() => {
      expect(mockToggleUserDisabled).toHaveBeenCalledWith('target-id', true)
    })
  })

  it('uses an in-app password field instead of window.prompt', async () => {
    const promptSpy = vi.spyOn(window, 'prompt')
    render(<ManageUserModal {...props} />)

    fireEvent.change(screen.getByLabelText('New temporary password'), {
      target: { value: 'TemporaryPass123!' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Reset temporary password' }))

    await waitFor(() => {
      expect(mockResetUserPassword).toHaveBeenCalledWith('target-id', 'TemporaryPass123!')
    })
    expect(promptSpy).not.toHaveBeenCalled()
    promptSpy.mockRestore()
  })

  it('locks an action while it is pending so duplicate taps cannot resubmit', async () => {
    let resolveAction: ((value: { success: boolean }) => void) | undefined
    mockResendUserSetupLink.mockImplementation(
      () => new Promise((resolve) => { resolveAction = resolve })
    )

    render(<ManageUserModal {...props} />)

    const sendButton = screen.getByRole('button', { name: 'Send setup link' })
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Sending…' }))
    expect(mockResendUserSetupLink).toHaveBeenCalledTimes(1)

    resolveAction?.({ success: true })
    await waitFor(() => expect(props.onUpdated).toHaveBeenCalled())
  })

  it('never exposes cross-school reassignment to school admins', () => {
    render(<ManageUserModal {...props} isPlatformAdmin={false} />)

    expect(screen.queryByLabelText('School')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Review school change' })).not.toBeInTheDocument()
  })
})
