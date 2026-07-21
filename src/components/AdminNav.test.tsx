import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminNav from './AdminNav'
import type { Profile } from '@/types'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
  signOut: vi.fn().mockResolvedValue({ error: null }),
  getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'admin-1', email: 'admin@test.com' } }, error: null }),
  logLogout: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin',
  useRouter: () => ({
    push: mocks.push,
    refresh: mocks.refresh,
  }),
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: mocks.getUser,
      signOut: mocks.signOut,
    },
  },
}))

vi.mock('@/app/(auth)/actions', () => ({
  logLogout: mocks.logLogout,
}))

const adminProfile: Profile = {
  id: 'admin-1',
  email: 'admin@test.com',
  full_name: 'Test Admin',
  role: 'admin',
  school_id: null,
  barber_shop_name: null,
  mentor_name: null,
  avatar_url: null,
  approval_status: 'approved',
  is_disabled: false,
  approved_by: null,
  approved_at: '2026-07-01T00:00:00Z',
  requires_password_change: false,
  created_at: '2026-07-01T00:00:00Z',
  updated_at: '2026-07-01T00:00:00Z',
}

describe('AdminNav', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.push.mockClear()
    mocks.refresh.mockClear()
    mocks.signOut.mockClear()
    mocks.getUser.mockClear()
    mocks.logLogout.mockClear()
  })

  it('renders admin name and role', () => {
    render(<AdminNav user={adminProfile} />)
    expect(screen.getByText('Test Admin')).toBeInTheDocument()
    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('renders all admin navigation links for platform admin', () => {
    render(<AdminNav user={adminProfile} />)
    expect(screen.getByRole('link', { name: /Dashboard/i })).toHaveAttribute('href', '/admin')
    expect(screen.getByRole('link', { name: /Users/i })).toHaveAttribute('href', '/admin/users')
    expect(screen.getByRole('link', { name: /School Settings/i })).toHaveAttribute('href', '/admin/school/configuration')
    expect(screen.getByRole('link', { name: /Pilot Inquiries/i })).toHaveAttribute('href', '/admin/pilot-inquiries')
    expect(screen.getByRole('link', { name: /Audit History/i })).toHaveAttribute('href', '/admin/audit')
    expect(screen.getByRole('link', { name: /System Health/i })).toHaveAttribute('href', '/admin/health')
    expect(screen.getByRole('link', { name: /Maintenance/i })).toHaveAttribute('href', '/admin/maintenance')
  })

  it('renders a logout button', () => {
    render(<AdminNav user={adminProfile} />)
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument()
  })

  it('signs out and redirects to login when logout is clicked', async () => {
    render(<AdminNav user={adminProfile} />)
    fireEvent.click(screen.getByRole('button', { name: /Logout/i }))

    await waitFor(() => {
      expect(mocks.logLogout).toHaveBeenCalledWith('admin-1', 'admin@test.com')
      expect(mocks.signOut).toHaveBeenCalled()
      expect(mocks.push).toHaveBeenCalledWith('/login')
      expect(mocks.refresh).toHaveBeenCalled()
    })
  })

  it('limits navigation links for school_admin', () => {
    const schoolAdmin: Profile = { ...adminProfile, role: 'school_admin', full_name: 'School Admin' }
    render(<AdminNav user={schoolAdmin} />)

    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Users/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Audit History/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /System Health/i })).not.toBeInTheDocument()
  })
})
