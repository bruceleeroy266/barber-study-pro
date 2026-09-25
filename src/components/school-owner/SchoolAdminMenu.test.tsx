import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import SchoolAdminMenu from './SchoolAdminMenu'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
  signOut: vi.fn().mockResolvedValue({ error: null }),
  getUser: vi.fn().mockResolvedValue({
    data: { user: { id: 'school-admin-1', email: 'school-admin@test.com' } },
    error: null,
  }),
  logLogout: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('next/navigation', () => ({
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

describe('SchoolAdminMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens a school-scoped management menu', () => {
    render(<SchoolAdminMenu />)

    fireEvent.click(screen.getByRole('button', { name: /School Management/i }))

    expect(screen.getByRole('menuitem', { name: /School Dashboard/i })).toHaveAttribute('href', '/school')
    expect(screen.getByRole('menuitem', { name: /Manage Users/i })).toHaveAttribute('href', '/admin/users')
    expect(screen.getByRole('menuitem', { name: /School Settings/i })).toHaveAttribute('href', '/admin/school/configuration')
    expect(screen.getByRole('menuitem', { name: /Student & Instructor Performance/i })).toHaveAttribute('href', '/school#performance')
    expect(screen.getByRole('menuitem', { name: /Reports & Compliance/i })).toHaveAttribute('href', '/school#reports-compliance')
    expect(screen.queryByText(/Pilot Inquiries/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/System Health/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Maintenance/i)).not.toBeInTheDocument()
  })

  it('shows a mobile backdrop and closes when it is tapped', () => {
    render(<SchoolAdminMenu />)

    fireEvent.click(screen.getByRole('button', { name: /School Management/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    const backdrop = screen.getByRole('button', { name: /Close School Menu/i })
    expect(backdrop).toHaveClass('sm:hidden')
    expect(backdrop).toHaveClass('bg-black/60')

    fireEvent.click(backdrop)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes on Escape', () => {
    render(<SchoolAdminMenu />)

    fireEvent.click(screen.getByRole('button', { name: /School Management/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('logs out safely', async () => {
    render(<SchoolAdminMenu />)

    fireEvent.click(screen.getByRole('button', { name: /School Management/i }))
    fireEvent.click(screen.getByRole('menuitem', { name: /Logout/i }))

    await waitFor(() => {
      expect(mocks.logLogout).toHaveBeenCalledWith('school-admin-1', 'school-admin@test.com')
      expect(mocks.signOut).toHaveBeenCalled()
      expect(mocks.push).toHaveBeenCalledWith('/login')
      expect(mocks.refresh).toHaveBeenCalled()
    })
  })
})
