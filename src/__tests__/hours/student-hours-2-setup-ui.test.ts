import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')

const manager = read('src/components/hours/StaffHoursManager.tsx')
const form = read('src/components/hours/StudentHoursSetupForm.tsx')
const actions = read('src/app/instructor/hours/actions.ts')
const schoolPage = read('src/app/school/hours/page.tsx')
const instructorPage = read('src/app/instructor/hours/page.tsx')

describe('STUDENT-HOURS-2 instructor/admin setup UI', () => {
  it('uses the canonical adaptive-hours calculation in the shared staff hours view', () => {
    expect(manager).toContain("calculateAdaptiveStudentHours")
    expect(manager).toContain('priorCreditMinutes: contract?.prior_credit_minutes ?? 0')
    expect(manager).toContain('requirementOverrideMinutes: contract?.requirement_override_minutes ?? null')
    expect(manager).toContain('creditedAndEarnedMinutes')
    expect(manager).toContain('effectiveRequiredMinutes')
  })

  it('keeps the setup flow simple and plain-language', () => {
    expect(form).toContain('Is this student starting from zero hours?')
    expect(form).toContain('Accepted prior / transfer hours')
    expect(form).toContain('Does this student have a special total-hour requirement?')
    expect(form).toContain('Student-specific total required hours')
    expect(manager).toContain('How ASCYN PRO calculated this:')
    expect(manager).toContain('Program standard')
    expect(manager).toContain('Prior / transfer')
    expect(manager).toContain('Earned here')
    expect(manager).toContain('Remaining')
  })

  it('allows school administrators to edit while instructors receive a read-only explanation', () => {
    expect(manager).toContain('isSchoolAdministrator ? (')
    expect(manager).toContain('<StudentHoursSetupForm')
    expect(manager).toContain('Instructors can view this breakdown.')
    expect(actions).toContain("!isSchoolAdmin(actor.role)")
  })

  it('writes official changes through the locked database RPC rather than direct contract table mutation', () => {
    expect(actions).toContain("supabase.rpc('set_enrollment_hour_contract'")
    expect(actions).toContain('p_expected_version: expectedVersion')
    expect(actions).toContain('p_prior_credit_minutes: priorCreditMinutes')
    expect(actions).toContain('p_requirement_override_minutes: requirementOverrideMinutes')
    expect(actions).not.toContain(".from('enrollment_hour_contracts')\n    .update(")
    expect(actions).not.toContain(".from('enrollment_hour_contract_events')\n    .insert(")
  })

  it('requires audit context and surfaces immutable history', () => {
    expect(form).toContain('Why is this change being made?')
    expect(form).toContain('Source / document reference')
    expect(form).toContain('This reason is stored in the permanent audit history.')
    expect(manager).toContain('Setup audit history')
    expect(manager).toContain('contract_version')
    expect(manager).toContain('Changed by')
    expect(manager).toContain('event.reason')
  })

  it('keeps setup feedback wired on both school-admin and instructor hours routes', () => {
    expect(schoolPage).toContain('contractSaved')
    expect(instructorPage).toContain('contractSaved')
    expect(manager).toContain('Student hours setup saved.')
    expect(manager).toContain('student-contract-stale')
  })
})
