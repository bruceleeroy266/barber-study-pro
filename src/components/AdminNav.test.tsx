import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import AdminNav from './AdminNav'
import type { Profile } from '@/types'

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin',
  useRouter: () => ({
    back: vi.fn(),
    push: vi.fn(),
  }),
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

  it('renders logout as a server-backed navigation link', () => {
    render(<AdminNav user={adminProfile} />)
    expect(screen.getByRole('link', { name: /Logout/i })).toHaveAttribute('href', '/auth/logout')
  })

  it('limits navigation links for school_admin', () => {
    const schoolAdmin: Profile = { ...adminProfile, role: 'school_admin', full_name: 'School Admin' }
    render(<AdminNav user={schoolAdmin} />)

    // Use exact text matching to avoid ambiguity with 'School Dashboard'
    expect(screen.getAllByRole('link', { name: /^Dashboard$/i }).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /Users/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /School Settings/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /School Dashboard/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Pilot Inquiries/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Audit History/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /System Health/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Maintenance/i })).not.toBeInTheDocument()
  })

  it('school admin sees School Dashboard link pointing to /admin/school', () => {
    const schoolAdmin: Profile = { ...adminProfile, role: 'school_admin', full_name: 'School Admin' }
    render(<AdminNav user={schoolAdmin} />)

    const schoolDashboardLink = screen.getByRole('link', { name: /School Dashboard/i })
    expect(schoolDashboardLink).toHaveAttribute('href', '/admin/school')
  })

  it('platform admin does not see School Dashboard link in nav', () => {
    render(<AdminNav user={adminProfile} />)

    // Platform admin sees the full admin links but not the school-specific dashboard link
    expect(screen.queryByRole('link', { name: /School Dashboard/i })).not.toBeInTheDocument()
  })
})
