/**
 * ASCYN PRO — Instructor Chapter Notes Route Tests (Phase 2B)
 *
 * Verifies:
 *   - Chapter 2 notes render on the instructor route
 *   - chapters without notes 404
 *   - role architecture: student/anon are redirected by the instructor layout
 *   - the student chapter page does NOT expose instructor notes
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import InstructorChapterNotesPage from './chapters/[chapterNumber]/page'
import InstructorLayout from './layout'

// ── Page render tests (layout gate mocked as passed) ─────────────

describe('InstructorChapterNotesPage', () => {
  it('renders Chapter 2 teaching notes', async () => {
    const page = await InstructorChapterNotesPage({
      params: Promise.resolve({ chapterNumber: '2' }),
    })
    render(page)

    expect(screen.getByText('Life Skills for Barbers — Instructor Notes')).toBeInTheDocument()
    expect(screen.getByText(/Instructor Only — Not Student-Facing/i)).toBeInTheDocument()
    expect(screen.getByText(/Learning Objectives \(14\)/)).toBeInTheDocument()
    expect(screen.getByText('Teaching Emphasis')).toBeInTheDocument()
    expect(screen.getByText('Common Student Confusions')).toBeInTheDocument()
    expect(screen.getByText('Remediation Guidance')).toBeInTheDocument()
    expect(screen.getByText('Assessment Guidance')).toBeInTheDocument()
    expect(screen.getByText('Source & Provenance Boundaries')).toBeInTheDocument()
  })

  it('renders all 14 LO references', async () => {
    const page = await InstructorChapterNotesPage({
      params: Promise.resolve({ chapterNumber: '2' }),
    })
    render(page)
    for (const n of Array.from({ length: 14 }, (_, i) => `LO-2-${String(i + 1).padStart(2, '0')}`)) {
      expect(screen.getAllByText(new RegExp(n)).length).toBeGreaterThan(0)
    }
  })

  it('404s for chapters without notes and for invalid input', async () => {
    await expect(
      InstructorChapterNotesPage({ params: Promise.resolve({ chapterNumber: '3' }) })
    ).rejects.toThrow()
    await expect(
      InstructorChapterNotesPage({ params: Promise.resolve({ chapterNumber: 'abc' }) })
    ).rejects.toThrow()
  })
})

// ── Role-gating tests (real layout, mocked auth) ─────────────────

describe('Instructor route role gating', () => {
  function mockAuth(role: string | null) {
    vi.doMock('@/lib/supabase-server', () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({ data: { user: role === null ? null : { id: 'uid' } } }),
        },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: async () => ({ data: role === null ? null : { role } }),
            }),
          }),
        }),
      }),
    }))
    vi.doMock('next/navigation', () => ({
      redirect: vi.fn((destination: string) => {
        throw new Error(`REDIRECT:${destination}`)
      }),
      notFound: vi.fn(() => {
        throw new Error('NOT_FOUND')
      }),
    }))
    vi.doMock('@/components/auth/BackButtonPrevention', () => ({ default: () => null }))
    vi.doMock('@/components/InstructorNav', () => ({ default: () => null }))
  }

  it('redirects students away from the instructor subtree (incl. chapters notes)', async () => {
    vi.resetModules()
    mockAuth('student')
    const Layout = (await import('./layout')).default
    await expect(Layout({ children: null })).rejects.toThrow('REDIRECT:/dashboard')
  })

  it('redirects unauthenticated users to login', async () => {
    vi.resetModules()
    mockAuth(null)
    const Layout = (await import('./layout')).default
    await expect(Layout({ children: null })).rejects.toThrow('REDIRECT:/login')
  })
})

// ── Student surface isolation ────────────────────────────────────

describe('Student surface isolation', () => {
  it('the student chapter page does not import instructor notes', async () => {
    const { readFileSync } = await import('fs')
    const { resolve } = await import('path')
    const pageSource = readFileSync(
      resolve(process.cwd(), 'src/app/(dashboard)/dashboard/chapters/[chapterNumber]/page.tsx'),
      'utf-8'
    )
    expect(pageSource).not.toMatch(/chapter-2-instructor-notes|chapterInstructorNotes/)
  })

  it('the student KeyTermsPanel receives no instructor-note content', async () => {
    const { readFileSync } = await import('fs')
    const { resolve } = await import('path')
    const panelSource = readFileSync(
      resolve(process.cwd(), 'src/components/chapter/KeyTermsPanel.tsx'),
      'utf-8'
    )
    expect(panelSource).not.toMatch(/chapter-2-instructor-notes|chapterInstructorNotes/)
  })
})
