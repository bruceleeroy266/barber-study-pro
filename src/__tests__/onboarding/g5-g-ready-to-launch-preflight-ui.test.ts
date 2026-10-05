import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), 'utf-8')

describe('G5-G ready-to-launch preflight UI', () => {
  it('uses the canonical launch preflight in the School Setup Center', () => {
    const center = read('src/components/school-owner/SchoolSetupCenter.tsx')

    expect(center).toContain('buildSchoolLaunchPreflight(status)')
    expect(center).toContain('Ready-to-Launch Preflight')
    expect(center).toContain('Launch Authorized')
    expect(center).toContain('Launch Locked')
  })

  it('does not recreate onboarding readiness queries in the UI', () => {
    const center = read('src/components/school-owner/SchoolSetupCenter.tsx')

    expect(center).not.toContain("from('profiles')")
    expect(center).not.toContain("from('school_onboarding_invitations')")
    expect(center).not.toContain("from('enrollments')")
    expect(center).not.toContain("from('student_instructor_assignments')")
  })
})
