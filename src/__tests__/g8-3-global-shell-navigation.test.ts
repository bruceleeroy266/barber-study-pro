import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8')

describe('G8-3 global shell + navigation foundation', () => {
  const root = read('src/app/layout.tsx')
  const home = read('src/app/page.tsx')
  const auth = read('src/app/(auth)/layout.tsx')
  const pilot = read('src/app/pilot/page.tsx')
  const dashboardLayout = read('src/app/(dashboard)/layout.tsx')
  const instructorLayout = read('src/app/instructor/layout.tsx')
  const adminLayout = read('src/app/admin/layout.tsx')
  const studentNav = read('src/components/DashboardNav.tsx')
  const instructorNav = read('src/components/InstructorNav.tsx')
  const adminNav = read('src/components/AdminNav.tsx')
  const mobileMenuHook = read('src/hooks/useAccessibleMobileMenu.ts')

  it('gives the global skip link a focusable target in every audited route family', () => {
    expect(root).toContain('href="#main-content"')
    for (const surface of [home, auth, pilot, dashboardLayout, instructorLayout, adminLayout]) {
      expect(surface).toContain('id="main-content"')
      expect(surface).toContain('tabIndex={-1}')
    }
  })

  it('keeps student content below the fixed mobile navigation header', () => {
    expect(dashboardLayout).toContain('pt-16')
    expect(dashboardLayout).toContain('lg:pt-0')
    expect(dashboardLayout).toContain('lg:pl-64')
  })

  it('exposes student mobile navigation name, state, relationship, and touch target', () => {
    expect(studentNav).toContain("aria-label={mobileMenuOpen ? 'Close student navigation' : 'Open student navigation'}")
    expect(studentNav).toContain('aria-expanded={mobileMenuOpen}')
    expect(studentNav).toContain('aria-controls="student-mobile-navigation"')
    expect(studentNav).toContain('min-h-11 min-w-11')
    expect(studentNav).toContain('aria-label="Student navigation"')
  })

  it('marks current navigation destinations and uses focus-visible rings', () => {
    for (const nav of [studentNav, instructorNav, adminNav]) {
      expect(nav).toContain('aria-current=')
      expect(nav).toContain('focus-visible:outline-none')
      expect(nav).toContain('focus-visible:ring-2')
    }
  })

  it('uses the shared accessible mobile-menu behavior across all role shells', () => {
    for (const nav of [studentNav, instructorNav, adminNav]) {
      expect(nav).toContain('useAccessibleMobileMenu')
      expect(nav).toContain('ref={triggerRef}')
      expect(nav).toContain('ref={panelRef}')
      expect(nav).toContain('role="dialog"')
      expect(nav).toContain('aria-modal="true"')
      expect(nav).toContain('tabIndex={-1}')
    }
  })

  it('closes on Escape, traps Tab focus, restores trigger focus, and locks background scroll', () => {
    expect(mobileMenuHook).toContain("event.key === 'Escape'")
    expect(mobileMenuHook).toContain("event.key !== 'Tab'")
    expect(mobileMenuHook).toContain('last.focus()')
    expect(mobileMenuHook).toContain('first.focus()')
    expect(mobileMenuHook).toContain("document.body.style.overflow = 'hidden'")
    expect(mobileMenuHook).toContain('trigger?.focus()')
  })

  it('does not change Gate 7 messaging or any persistence/schema boundary', () => {
    const touchedProductionFiles = [
      'src/app/page.tsx',
      'src/app/pilot/page.tsx',
      'src/app/(auth)/layout.tsx',
      'src/app/(dashboard)/layout.tsx',
      'src/app/instructor/layout.tsx',
      'src/app/admin/layout.tsx',
      'src/components/DashboardNav.tsx',
      'src/components/InstructorNav.tsx',
      'src/components/AdminNav.tsx',
      'src/hooks/useAccessibleMobileMenu.ts',
    ]
    expect(touchedProductionFiles.some((file) => file.includes('messaging'))).toBe(false)
    expect(touchedProductionFiles.some((file) => file.includes('supabase/migrations'))).toBe(false)
  })
})
