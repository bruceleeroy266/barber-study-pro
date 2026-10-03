import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const migrationPath = path.join(
  process.cwd(),
  'supabase/migrations/20261003054500_adm1c_service_role_assignment_privileges.sql'
)

describe('ADM-1C service-role assignment privileges', () => {
  const sql = fs.readFileSync(migrationPath, 'utf-8')
  const normalized = sql.toLowerCase().replace(/\s+/g, ' ')

  it('explicitly restores server read access to the canonical assignment table', () => {
    expect(normalized).toContain(
      'grant select on table public.student_instructor_assignments to service_role'
    )
  })

  it('allows service-role assignment creation only through required identity columns', () => {
    expect(normalized).toContain(
      'grant insert (school_id, student_id, instructor_id, assigned_by) on table public.student_instructor_assignments to service_role'
    )
    expect(normalized).not.toContain(
      'grant insert on table public.student_instructor_assignments to service_role'
    )
  })

  it('limits service-role assignment mutation to lifecycle columns', () => {
    expect(normalized).toContain(
      'grant update (is_active, ended_at, updated_at) on table public.student_instructor_assignments to service_role'
    )
    expect(normalized).not.toContain(
      'grant update on table public.student_instructor_assignments to service_role'
    )
  })

  it('does not grant destructive delete or truncate privileges', () => {
    expect(normalized).not.toMatch(/grant\s+delete/)
    expect(normalized).not.toMatch(/grant\s+truncate/)
  })

  it('does not broaden anon or authenticated privileges', () => {
    expect(normalized).not.toMatch(/\bto anon\b/)
    expect(normalized).not.toMatch(/\bto authenticated\b/)
  })
})
