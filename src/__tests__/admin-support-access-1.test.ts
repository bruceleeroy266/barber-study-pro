import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')

describe('ADMIN-SUPPORT-ACCESS-1', () => {
  const adminDashboard = read('src/app/admin/page.tsx')
  const supportHub = read('src/app/admin/support-access/page.tsx')
  const supportActions = read('src/app/admin/support-access/actions.ts')
  const supportRuntime = read('src/lib/support-access.ts')
  const instructorDashboard = read('src/app/instructor/page.tsx')

  it('adds Support Access to the platform admin dashboard', () => {
    expect(adminDashboard).toContain('href="/admin/support-access"')
    expect(adminDashboard).toContain('Support Access')
  })

  it('keeps cross-school support access platform-admin only', () => {
    expect(supportHub).toContain('isPlatformAdminProfile(caller)')
    expect(supportHub).toContain("redirect('/admin')")
    expect(supportRuntime).toContain('isPlatformAdminProfile(actorProfile)')
  })

  it('lists instructor and school-admin dashboards and starts persistent mode', () => {
    expect(supportHub).toContain("['instructor', 'school_admin', 'admin']")
    expect(supportHub).toContain('Instructor Dashboards')
    expect(supportHub).toContain('School Admin Dashboards')
    expect(supportHub).toContain('action={startSupportMode}')
    expect(supportHub).toContain('name="targetProfileId"')
    expect(supportActions).toContain('startSupportAccess(targetProfileId)')
  })

  it('scopes the instructor dashboard to the selected effective instructor', () => {
    expect(instructorDashboard).toContain('resolveSupportAccessContext()')
    expect(instructorDashboard).toContain('context.effectiveProfile')
    expect(instructorDashboard).toContain('loadAssignedStudentIds(supabase, schoolId, dashboardInstructorId)')
  })

  it('retains the true platform admin while support context is active', () => {
    expect(supportRuntime).toContain('actorUserId: user.id')
    expect(supportRuntime).toContain('effectiveProfile: targetProfile')
    expect(supportRuntime).toContain("httpOnly: true")
    expect(supportRuntime).toContain("sameSite: 'strict'")
  })
})
