import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), 'utf8')

describe('G6-A admin metrics inclusion control', () => {
  it('exposes an audited learner-level school metrics control without disabling the account', () => {
    const modal = read('src/app/admin/users/ManageUserModal.tsx')
    const actions = read('src/app/admin/users/actions.ts')

    expect(modal).toContain('School Metrics')
    expect(modal).toContain('setUserSchoolMetricsInclusion')
    expect(modal).toContain('Individual scores, progress, hours, and activity stay visible either way')
    expect(actions).toContain("'set_school_metrics_inclusion'")
    expect(actions).toContain("learner.role !== 'student' && learner.role !== 'apprentice'")
    expect(actions).toContain("revalidatePath('/school')")
    expect(actions).toContain("revalidatePath('/instructor')")
  })

  it('keeps the database default inclusive for existing and future learners', () => {
    const migration = read('supabase/migrations/20261005162000_g6a_school_metrics_inclusion.sql')
    expect(migration).toContain('include_in_school_metrics boolean NOT NULL DEFAULT true')
  })
})
