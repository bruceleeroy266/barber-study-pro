import { beforeAll, describe, expect, it } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

const MIGRATION_PATH = path.join(
  __dirname,
  '../../../supabase/migrations/20261001230329_um_h1_user_management_integrity.sql'
)

describe('UM-H1 — User Management Integrity Hardening', () => {
  let sql = ''

  beforeAll(() => {
    sql = fs.readFileSync(MIGRATION_PATH, 'utf-8')
  })

  it('creates a transaction-scoped identity reconciliation function', () => {
    expect(sql).toContain('create or replace function public.reconcile_user_management_identity')
    expect(sql).toContain('security invoker')
    expect(sql).toContain('set search_path = public, pg_temp')
  })

  it('updates profile role and school in the same database function', () => {
    expect(sql).toContain('update public.profiles')
    expect(sql).toContain('role = p_role')
    expect(sql).toContain('school_id = p_school_id')
  })

  it('requires school assignment for student and instructor identities', () => {
    expect(sql).toContain("p_role in ('student', 'instructor') and p_school_id is null")
  })

  it('reconciles student and instructor domain records without hard-deleting history', () => {
    expect(sql).toContain('update public.students')
    expect(sql).toContain('update public.instructors')
    expect(sql).toContain('deleted_at = coalesce(deleted_at, now())')
    expect(sql).toContain('insert into public.students')
    expect(sql).toContain('insert into public.instructors')
    expect(sql).not.toContain('delete from public.students')
    expect(sql).not.toContain('delete from public.instructors')
  })

  it('fails closed when a target-school historical domain collision exists', () => {
    expect(sql).toContain('manual reconciliation is required')
  })

  it('is callable only by service_role', () => {
    expect(sql).toContain('revoke all on function public.reconcile_user_management_identity(uuid, text, uuid) from public')
    expect(sql).toContain('from anon')
    expect(sql).toContain('from authenticated')
    expect(sql).toContain('grant execute on function public.reconcile_user_management_identity(uuid, text, uuid) to service_role')
  })
})
