/**
 * Dashboard sidebar active-route matcher tests.
 *
 * Covers the reported defect (Chapters and Flashcards appearing active at
 * the same time) and the general mutual-exclusion contract: at most one
 * sidebar destination may be active for any pathname.
 */

import { describe, it, expect } from 'vitest'
import { isDashboardNavItemActive } from './nav-active'

// Mirror of the sidebar destinations (post-repair: no duplicate hrefs).
const SIDEBAR_HREFS = [
  '/dashboard',
  '/dashboard/chapters',
  '/dashboard/missed-questions',
  '/dashboard/progress',
  '/dashboard/grades',
  '/dashboard/assessments',
  '/dashboard/compliance',
  '/dashboard/messages',
  '/dashboard/profile',
] as const

function activeHrefs(pathname: string): string[] {
  return SIDEBAR_HREFS.filter((href) => isDashboardNavItemActive(pathname, href))
}

describe('isDashboardNavItemActive', () => {
  it('activates only Chapters on the Chapters index', () => {
    expect(activeHrefs('/dashboard/chapters')).toEqual(['/dashboard/chapters'])
  })

  it('activates only Chapters on chapter sub-routes', () => {
    expect(activeHrefs('/dashboard/chapters/3')).toEqual(['/dashboard/chapters'])
    expect(activeHrefs('/dashboard/chapters/12')).toEqual(['/dashboard/chapters'])
  })

  it('activates only the matching destination on other sidebar routes', () => {
    expect(activeHrefs('/dashboard/missed-questions')).toEqual([
      '/dashboard/missed-questions',
    ])
    expect(activeHrefs('/dashboard/progress')).toEqual(['/dashboard/progress'])
    expect(activeHrefs('/dashboard/messages')).toEqual(['/dashboard/messages'])
    expect(activeHrefs('/dashboard/profile')).toEqual(['/dashboard/profile'])
  })

  it('activates Dashboard only on the exact dashboard root', () => {
    expect(activeHrefs('/dashboard')).toEqual(['/dashboard'])
    expect(isDashboardNavItemActive('/dashboard/chapters', '/dashboard')).toBe(false)
    expect(isDashboardNavItemActive('/dashboard/missed-questions', '/dashboard')).toBe(false)
  })

  it('does not prefix-match across segment boundaries', () => {
    expect(isDashboardNavItemActive('/dashboard/chaptersx', '/dashboard/chapters')).toBe(false)
    expect(isDashboardNavItemActive('/dashboard/progress2', '/dashboard/progress')).toBe(false)
  })

  it('never produces more than one active destination for any sidebar pathname', () => {
    const pathnames = [
      '/dashboard',
      '/dashboard/chapters',
      '/dashboard/chapters/1',
      '/dashboard/chapters/21',
      '/dashboard/missed-questions',
      '/dashboard/progress',
      '/dashboard/grades',
      '/dashboard/assessments',
      '/dashboard/compliance',
      '/dashboard/messages',
      '/dashboard/profile',
    ]
    for (const pathname of pathnames) {
      expect(activeHrefs(pathname).length, pathname).toBeLessThanOrEqual(1)
    }
  })
})
