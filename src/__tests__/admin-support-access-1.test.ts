import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')

describe('ADMIN-SUPPORT-ACCESS-1', () => {
  const adminDashboard = read('src/app/admin/page.tsx')
  const supportHub = read('src/app/admin/support-access/page.tsx')
  const instructorDashboard = read('src/app/instructor/page.tsx')

  it('adds Support Access to the platform admin dashboard', () => {
    expect(adminDashboard).toContain('href="/admin/support-access"')
    expect(adminDashboard).toContain('Support Access')
  })

  it('keeps cross-school support access platform-admin only', () => {
    expect(supportHub).toContain('isPlatformAdminProfile(caller)')
    expect(supportHub).toContain("redirect('/admin')")
  })

  it('lists instructor and school-admin dashboards', () => {
    expect(supportHub).toContain("['instructor', 'school_admin', 'admin']")
    expect(supportHub).toContain('Instructor Dashboards')
    expect(supportHub).toContain('School Admin Dashboards')
    expect(supportHub).toContain('/instructor?viewAs=')
    expect(supportHub).toContain('/admin/school?school=')
  })

  it('scopes instructor support view to the selected approved instructor', () => {
    expect(instructorDashboard).toContain('isPlatformAdminProfile(callerProfile)')
    expect(instructorDashboard).toContain("targetInstructor.role !== 'instructor'")
    expect(instructorDashboard).toContain("targetInstructor.approval_status !== 'approved'")
    expect(instructorDashboard).toContain('loadAssignedStudentIds(supabase, schoolId, dashboardInstructorId)')
  })

  it('uses privileged server-side reads only for validated platform school support view', () => {
    const schoolAdminPage = read('src/app/admin/school/page.tsx')
    const schoolDashboard = read('src/components/school-owner/SchoolDashboard.tsx')

    expect(schoolAdminPage).toContain('<SchoolDashboard schoolId={selected.id} privilegedRead />')
    expect(schoolAdminPage).toContain('<SchoolDashboard schoolId={profile.school_id} />')
    expect(schoolDashboard).toContain('privilegedRead ? createServiceRoleClient() : await createClient()')
  })

  it('preserves platform admin identity and provides a return path', () => {
    expect(instructorDashboard).toContain('Platform Admin Support View')
    expect(instructorDashboard).toContain('You remain signed in as platform administrator.')
    expect(instructorDashboard).toContain('href="/admin/support-access"')
  })
})
