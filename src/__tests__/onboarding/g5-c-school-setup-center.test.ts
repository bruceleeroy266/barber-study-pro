import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), 'utf-8')

describe('G5-C School Setup Center', () => {
  it('wires the frozen G5-B resolver into the school dashboard', () => {
    const dashboard = read('src/components/school-owner/SchoolDashboard.tsx')

    expect(dashboard).toContain("import { loadSchoolOnboardingStatus } from '@/lib/onboarding'")
    expect(dashboard).toContain('const onboardingStatus = await loadSchoolOnboardingStatus(supabase, schoolId)')
    expect(dashboard).toContain('<SchoolSetupCenter status={onboardingStatus} />')
  })

  it('shows persistent setup progress and the canonical next action', () => {
    const center = read('src/components/school-owner/SchoolSetupCenter.tsx')

    expect(center).toContain('Setup progress')
    expect(center).toContain('status.progressPercent')
    expect(center).toContain('status.completedSteps')
    expect(center).toContain('status.totalSteps')
    expect(center).toContain('status.nextAction')
    expect(center).toContain('resolveGuidedOnboardingAction(status.nextAction)')
    expect(center).toContain('nextAction.label')
    expect(center).toContain('nextAction.href')
  })

  it('renders resolver-owned steps and blockers instead of recreating readiness rules', () => {
    const center = read('src/components/school-owner/SchoolSetupCenter.tsx')

    expect(center).toContain('status.steps.map')
    expect(center).toContain('status.blockers.map')
    expect(center).toContain('status.readyToLaunch')
    expect(center).not.toContain("from('profiles')")
    expect(center).not.toContain("from('enrollments')")
    expect(center).not.toContain("from('student_instructor_assignments')")
    expect(center).not.toContain("from('school_onboarding_invitations')")
  })

  it('keeps Ready to Launch explicit and accessible', () => {
    const center = read('src/components/school-owner/SchoolSetupCenter.tsx')

    expect(center).toContain('Ready to Launch')
    expect(center).toContain('role="progressbar"')
    expect(center).toContain('aria-valuenow={status.progressPercent}')
    expect(center).toContain('role="status"')
  })
})
