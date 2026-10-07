import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')

const migration = read(
  'supabase/migrations/20261007014500_enrollment_integrity_single_active.sql',
)
const actions = read('src/app/admin/users/actions.ts')
const modal = read('src/app/admin/users/EnrollmentModal.tsx')

describe('ENROLLMENT-INTEGRITY-1 single active enrollment contract', () => {
  it('fails closed if duplicate active enrollments still exist before protection is enabled', () => {
    expect(migration).toContain('having count(*) > 1')
    expect(migration).toContain(
      'Cannot enable single-active-enrollment protection while duplicate active enrollments exist',
    )
  })

  it('enforces one active non-deleted enrollment per student at the database boundary', () => {
    expect(migration).toContain(
      'create unique index if not exists enrollments_one_active_per_student_idx',
    )
    expect(migration).toContain('on public.enrollments(student_id)')
    expect(migration).toContain("where status = 'active'")
    expect(migration).toContain('and is_active = true')
    expect(migration).toContain('and deleted_at is null')
  })

  it('preserves historical withdrawn/completed enrollment rows', () => {
    expect(migration).toContain('partial unique index')
    expect(migration).not.toContain('delete from public.enrollments')
  })

  it('returns a clear conflict message for a database uniqueness race', () => {
    expect(actions).toContain("insertError.code === '23505'")
    expect(actions).toContain('already enrolled in an active program')
    expect(actions).toContain('Withdraw the current enrollment before enrolling the student in another program.')
  })

  it('prevents admins from selecting another program while one is active', () => {
    expect(modal).toContain("enrollments.find((e) => e.is_active && e.status === 'active')")
    expect(modal).toContain('const availablePrograms = activeEnrollment ? [] : programs')
    expect(modal).toContain('One active program at a time')
    expect(modal).toContain('Withdraw that enrollment before assigning a different program.')
  })
})
