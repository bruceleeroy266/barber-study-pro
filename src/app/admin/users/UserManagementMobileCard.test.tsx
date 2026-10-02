import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import UserManagementMobileCard from './UserManagementMobileCard'

const user = {
  id: 'student-1',
  full_name: 'Patty Pineda',
  email: 'patty@example.com',
  role: 'student' as const,
  school_id: 'school-1',
  school_name: 'RISE Program',
  approval_status: 'approved' as const,
  is_disabled: false,
  requires_password_change: true,
  created_at: '2026-09-01T12:00:00.000Z',
  updated_at: '2026-09-01T12:00:00.000Z',
  enrollment_count: 2,
}

describe('UserManagementMobileCard', () => {
  it('renders the locked mobile information hierarchy', () => {
    render(<UserManagementMobileCard user={user} onManage={vi.fn()} />)

    expect(screen.getByText('Patty Pineda')).toBeInTheDocument()
    expect(screen.getByText('patty@example.com')).toBeInTheDocument()
    expect(screen.getByText('Student')).toBeInTheDocument()
    expect(screen.getByText('Approved')).toBeInTheDocument()
    expect(screen.getByText('RISE Program')).toBeInTheDocument()
    expect(screen.getByText('Enabled')).toBeInTheDocument()
    expect(screen.getByText('Reset required')).toBeInTheDocument()
    expect(screen.getByText('2 active programs')).toBeInTheDocument()
  })

  it('shows No school when the user has no school assignment', () => {
    render(
      <UserManagementMobileCard
        user={{ ...user, role: 'admin', school_id: null, school_name: null, enrollment_count: undefined }}
        onManage={vi.fn()}
      />
    )

    expect(screen.getByText('No school')).toBeInTheDocument()
  })

  it('passes the exact user to the Manage user action', () => {
    const onManage = vi.fn()
    render(<UserManagementMobileCard user={user} onManage={onManage} />)

    fireEvent.click(screen.getByRole('button', { name: 'Manage user' }))

    expect(onManage).toHaveBeenCalledTimes(1)
    expect(onManage).toHaveBeenCalledWith(user)
  })
})
