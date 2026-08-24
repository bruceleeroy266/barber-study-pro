import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotFound from './not-found'

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  getUser: vi.fn(),
  from: vi.fn(),
}))

vi.mock('@/lib/supabase-server', () => ({
  createClient: mocks.createClient,
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={String(href)} {...props}>{children}</a>
  ),
}))

function profileQuery(role: string | null) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: role ? { role } : null, error: null }),
  }
}

describe('NotFound session-aware navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.createClient.mockResolvedValue({
      auth: { getUser: mocks.getUser },
      from: mocks.from,
    })
  })

  it('preserves Sign In navigation for unauthenticated visitors', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null })

    render(await NotFound())

    expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute('href', '/login')
    expect(screen.queryByRole('link', { name: 'Return to Dashboard' })).not.toBeInTheDocument()
    expect(mocks.from).not.toHaveBeenCalled()
  })

  it.each([
    ['student', '/dashboard'],
    ['apprentice', '/dashboard'],
    ['instructor', '/instructor'],
    ['admin', '/admin'],
    ['school_admin', '/admin'],
  ])('routes an authenticated %s to the correct dashboard', async (role, href) => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
    mocks.from.mockReturnValue(profileQuery(role))

    render(await NotFound())

    expect(screen.getByRole('link', { name: 'Return to Dashboard' })).toHaveAttribute('href', href)
    expect(screen.queryByRole('link', { name: 'Sign In' })).not.toBeInTheDocument()
  })

  it('does not imply sign-out when an authenticated profile has no recognized role', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
    mocks.from.mockReturnValue(profileQuery('unknown_role'))

    render(await NotFound())

    expect(screen.queryByRole('link', { name: 'Sign In' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Return to Dashboard' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Return Home' })).toHaveAttribute('href', '/')
  })

  it('still renders neutral navigation when session resolution fails', async () => {
    mocks.createClient.mockRejectedValue(new Error('Supabase unavailable'))

    render(await NotFound())

    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Return Home' })).toHaveAttribute('href', '/')
    expect(screen.queryByRole('link', { name: 'Sign In' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Return to Dashboard' })).not.toBeInTheDocument()
  })
})
