import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// We need to test the AdminDashboard server component's role-based card filtering.
// Since it's an async server component, we test the logic by checking the rendered output.

// Mock the modules that AdminDashboard depends on
const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  from: vi.fn(),
}))

vi.mock('@/lib/supabase-server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: mocks.getUser,
    },
    from: mocks.from,
  }),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT: ${url}`)
  }),
}))

// Use the REAL permission helpers - do not mock authorization logic
vi.mock('@/lib/auth-helpers', async () => {
  const actual = await vi.importActual('@/lib/security/permissions')
  return actual
})

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// Helper to create a chainable supabase query mock
function createQueryMock(result: { data?: unknown; count?: number; error?: unknown }) {
  const chainable = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    then: undefined as unknown,
  }
  // Make it thenable for Promise.all
  chainable.then = (resolve: (v: unknown) => void) => resolve(result)
  return chainable
}

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getUser.mockResolvedValue({
      data: { user: { id: 'user-1', email: 'test@test.com' } },
    })
  })

  function setupMocks(role: string) {
    const profileQuery = createQueryMock({
      data: { role, school_id: role === 'school_admin' ? 'school-1' : null },
    })

    const countQuery = createQueryMock({ count: 10 })
    const schoolQuery = createQueryMock({ data: { name: 'Test School' } })

    let callIndex = 0
    mocks.from.mockImplementation((table: string) => {
      if (table === 'profiles') {
        callIndex++
        if (callIndex === 1) return profileQuery
        return countQuery
      }
      if (table === 'schools') {
        return schoolQuery
      }
      return countQuery
    })
  }

  describe('admin role (platform admin)', () => {
    it('shows platform-admin cards for admin', async () => {
      setupMocks('admin')

      const { default: AdminDashboard } = await import('./page')
      const result = await AdminDashboard()
      render(result)

      expect(screen.getByText('Pilot Inquiries')).toBeInTheDocument()
      expect(screen.getByText('Audit History')).toBeInTheDocument()
      expect(screen.getByText('System Health')).toBeInTheDocument()
      expect(screen.getByText('Maintenance Mode')).toBeInTheDocument()
      expect(screen.getByText('Notifications')).toBeInTheDocument()
      expect(screen.getByText('Feature Flags')).toBeInTheDocument()
      expect(screen.getByText('Backup & Recovery')).toBeInTheDocument()
      expect(screen.getByText('Content Management')).toBeInTheDocument()
      expect(screen.getByText('System Status')).toBeInTheDocument()
    })

    it('shows platform subtitle for admin', async () => {
      setupMocks('admin')

      const { default: AdminDashboard } = await import('./page')
      const result = await AdminDashboard()
      render(result)

      expect(screen.getByText('Platform management and overview')).toBeInTheDocument()
    })

    it('shows platform statistics for admin', async () => {
      setupMocks('admin')

      const { default: AdminDashboard } = await import('./page')
      const result = await AdminDashboard()
      render(result)

      expect(screen.getByText('Total Platform Users')).toBeInTheDocument()
      expect(screen.getByText('Total Schools')).toBeInTheDocument()
    })

    it('does NOT show school-scoped dashboard for admin', async () => {
      setupMocks('admin')

      const { default: AdminDashboard } = await import('./page')
      const result = await AdminDashboard()
      render(result)

      expect(screen.queryByText('School Dashboard')).not.toBeInTheDocument()
      expect(screen.queryByText(/School management/)).not.toBeInTheDocument()
    })
  })

  describe('platform_super_admin role', () => {
    it('shows platform-admin cards for platform_super_admin', async () => {
      setupMocks('platform_super_admin')

      const { default: AdminDashboard } = await import('./page')
      const result = await AdminDashboard()
      render(result)

      expect(screen.getByText('Pilot Inquiries')).toBeInTheDocument()
      expect(screen.getByText('Audit History')).toBeInTheDocument()
      expect(screen.getByText('System Health')).toBeInTheDocument()
      expect(screen.getByText('Maintenance Mode')).toBeInTheDocument()
    })

    it('shows platform subtitle for platform_super_admin', async () => {
      setupMocks('platform_super_admin')

      const { default: AdminDashboard } = await import('./page')
      const result = await AdminDashboard()
      render(result)

      expect(screen.getByText('Platform management and overview')).toBeInTheDocument()
    })
  })

  describe('school_admin role', () => {
    it('hides platform-admin cards from school_admin', async () => {
      setupMocks('school_admin')

      const { default: AdminDashboard } = await import('./page')
      const result = await AdminDashboard()
      render(result)

      expect(screen.queryByText('Pilot Inquiries')).not.toBeInTheDocument()
      expect(screen.queryByText('Audit History')).not.toBeInTheDocument()
      expect(screen.queryByText('System Health')).not.toBeInTheDocument()
      expect(screen.queryByText('Maintenance Mode')).not.toBeInTheDocument()
      expect(screen.queryByText('Notifications')).not.toBeInTheDocument()
      expect(screen.queryByText('Feature Flags')).not.toBeInTheDocument()
      expect(screen.queryByText('Backup & Recovery')).not.toBeInTheDocument()
      expect(screen.queryByText('Content Management')).not.toBeInTheDocument()
      expect(screen.queryByText('System Status')).not.toBeInTheDocument()
    })

    it('shows school-admin cards for school_admin', async () => {
      setupMocks('school_admin')

      const { default: AdminDashboard } = await import('./page')
      const result = await AdminDashboard()
      render(result)

      expect(screen.getByText('School Settings')).toBeInTheDocument()
      expect(screen.getByText('School Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Users')).toBeInTheDocument()
    })

    it('shows school name in subtitle for school_admin', async () => {
      setupMocks('school_admin')

      const { default: AdminDashboard } = await import('./page')
      const result = await AdminDashboard()
      render(result)

      expect(screen.getByText(/School management/)).toBeInTheDocument()
    })

    it('shows school-scoped statistics for school_admin', async () => {
      setupMocks('school_admin')

      const { default: AdminDashboard } = await import('./page')
      const result = await AdminDashboard()
      render(result)

      expect(screen.getByText('School Users')).toBeInTheDocument()
      expect(screen.getByText('Your School')).toBeInTheDocument()
    })
  })

  describe('instructor role', () => {
    it('redirects instructor away from admin dashboard', async () => {
      setupMocks('instructor')

      const { default: AdminDashboard } = await import('./page')
      
      await expect(AdminDashboard()).rejects.toThrow('NEXT_REDIRECT: /dashboard')
    })
  })

  describe('student role', () => {
    it('redirects student away from admin dashboard', async () => {
      setupMocks('student')

      const { default: AdminDashboard } = await import('./page')
      
      await expect(AdminDashboard()).rejects.toThrow('NEXT_REDIRECT: /dashboard')
    })
  })

  describe('unauthenticated', () => {
    it('redirects to login when no user', async () => {
      mocks.getUser.mockResolvedValue({
        data: { user: null },
      })

      const { default: AdminDashboard } = await import('./page')
      
      await expect(AdminDashboard()).rejects.toThrow('NEXT_REDIRECT: /login')
    })
  })
})
