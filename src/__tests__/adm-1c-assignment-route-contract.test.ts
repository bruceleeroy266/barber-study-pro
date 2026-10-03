import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

function source(path: string): string {
  return readFileSync(path, 'utf8')
}

describe('ADM-1C route assignment boundaries', () => {
  it('scopes both instructor roster surfaces through active assignments', () => {
    for (const path of [
      'src/app/instructor/page.tsx',
      'src/app/instructor/students/page.tsx',
    ]) {
      const text = source(path)
      expect(text).toContain('loadAssignedStudentIds')
      expect(text).toContain("profile.role === 'instructor'")
      expect(text).toContain("assignedStudentIds.length > 0 ? assignedStudentIds : ['__none__']")
    }
  })

  it('blocks instructor detail access when the student is not actively assigned', () => {
    const text = source('src/app/instructor/student/[studentId]/page.tsx')
    expect(text).toContain('isStudentAssignedToInstructor')
    expect(text).toContain("instructorProfile.role === 'instructor'")
    expect(text).toContain('if (!assigned)')
    expect(text).toContain('notFound()')
  })

  it('keeps private messaging on the same canonical assignment relationship', () => {
    const instructorMessages = source('src/app/instructor/messages/page.tsx')
    const studentMessages = source('src/app/(dashboard)/dashboard/messages/page.tsx')
    const actions = source('src/app/communications/actions.ts')

    expect(instructorMessages).toContain("from('student_instructor_assignments')")
    expect(studentMessages).toContain("from('student_instructor_assignments')")
    expect(actions).toContain("from('student_instructor_assignments')")
    expect(actions).toContain(".eq('is_active', true)")
    expect(actions).toContain(".is('ended_at', null)")
  })

  it('keeps the student dashboard self-scoped rather than exposing another learner', () => {
    const dashboard = source('src/app/(dashboard)/dashboard/page.tsx')
    const progress = source('src/app/(dashboard)/dashboard/progress/page.tsx')

    expect(dashboard).toContain(".eq('id', user.id)")
    expect(dashboard).toContain(".eq('user_id', user.id)")
    expect(progress).toContain(".eq('id', user.id)")
    expect(progress).toContain(".eq('user_id', user.id)")
  })

  it('surfaces assignment ownership to administrators', () => {
    const actions = source('src/app/admin/users/actions.ts')
    const desktop = source('src/app/admin/users/UserManagementClient.tsx')
    const mobile = source('src/app/admin/users/UserManagementMobileCard.tsx')
    const school = source('src/components/school-owner/SchoolDashboard.tsx')

    expect(actions).toContain("from('student_instructor_assignments')")
    expect(actions).toContain('assigned_instructor_name')
    expect(desktop).toContain("user.assigned_instructor_name ?? 'Unassigned'")
    expect(mobile).toContain("user.assigned_instructor_name ?? 'Unassigned'")
    expect(school).toContain('loadActiveStudentInstructorAssignments')
  })
})
