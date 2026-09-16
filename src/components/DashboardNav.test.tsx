/**
 * DashboardNav active-state regression test.
 *
 * Defect: on the Chapters page, both "Chapters" and "Flashcards" sidebar
 * entries appeared active simultaneously. Root cause: two nav items shared
 * the href '/dashboard/chapters'. The phantom duplicate is removed and the
 * active matcher is shared; this test pins the behavior at the component
 * level using the real sidebar.
 */

import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import DashboardNav from './DashboardNav'
import type { Profile } from '@/types'

const mockPathname = vi.fn(() => '/dashboard/chapters')

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signOut: vi.fn().mockResolvedValue({}),
    },
  },
}))

vi.mock('@/app/(auth)/actions', () => ({
  logLogout: vi.fn().mockResolvedValue(undefined),
}))

const student = {
  id: 'user-1',
  full_name: 'Test Student',
  role: 'student',
} as unknown as Profile

const ACTIVE_CLASS = 'text-gold'

function desktopNavLinks(container: HTMLElement): HTMLAnchorElement[] {
  const aside = container.querySelector('aside')
  if (!aside) throw new Error('desktop sidebar not rendered')
  return Array.from(aside.querySelectorAll('nav a'))
}

describe('DashboardNav active-route styling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('highlights only Chapters on /dashboard/chapters (no simultaneous Flashcards active state)', () => {
    mockPathname.mockReturnValue('/dashboard/chapters')
    const { container } = render(<DashboardNav user={student} />)

    const links = desktopNavLinks(container)
    const active = links.filter((a) => a.className.includes(ACTIVE_CLASS))
    const labels = links.map((a) => a.textContent)

    // The phantom duplicate-href Flashcards entry is gone from the sidebar.
    expect(labels).not.toContain('Flashcards')

    expect(active).toHaveLength(1)
    expect(active[0].textContent).toBe('Chapters')
    expect(active[0]).toHaveAttribute('href', '/dashboard/chapters')
  })

  it('highlights only Chapters on a chapter sub-route', () => {
    mockPathname.mockReturnValue('/dashboard/chapters/3')
    const { container } = render(<DashboardNav user={student} />)

    const active = desktopNavLinks(container).filter((a) =>
      a.className.includes(ACTIVE_CLASS),
    )
    expect(active).toHaveLength(1)
    expect(active[0].textContent).toBe('Chapters')
  })

  it('highlights only Missed Questions on its route, never two entries at once', () => {
    mockPathname.mockReturnValue('/dashboard/missed-questions')
    const { container } = render(<DashboardNav user={student} />)

    const active = desktopNavLinks(container).filter((a) =>
      a.className.includes(ACTIVE_CLASS),
    )
    expect(active).toHaveLength(1)
    expect(active[0].textContent).toBe('Missed Questions')
  })

  it('keeps inactive entries on hover styling, visually distinct from the persistent active style', () => {
    mockPathname.mockReturnValue('/dashboard/chapters')
    const { container } = render(<DashboardNav user={student} />)

    const links = desktopNavLinks(container)
    const inactive = links.filter((a) => !a.className.includes(ACTIVE_CLASS))
    expect(inactive.length).toBeGreaterThan(0)
    for (const link of inactive) {
      expect(link.className).toContain('hover:')
      expect(link.className).not.toContain('bg-gold/10')
    }
    // Active entry carries the persistent active treatment instead.
    const active = links.filter((a) => a.className.includes(ACTIVE_CLASS))
    expect(active[0].className).toContain('bg-gold/10')
  })
})
