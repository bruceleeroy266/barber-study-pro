import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const migrationPath = path.join(
  process.cwd(),
  'supabase/migrations/20261002024000_com1d4_bulletin_rls_recursion_fix.sql'
)

describe('COM-1D.4 bulletin RLS recursion hardening', () => {
  const sql = fs.readFileSync(migrationPath, 'utf-8')

  it('moves audience resolution behind a private security-definer helper', () => {
    expect(sql).toContain('create schema if not exists private')
    expect(sql).toContain('private.can_current_user_receive_bulletin')
    expect(sql).toContain('security definer')
    expect(sql).toContain("set search_path = ''")
    expect(sql).toContain('from public.bulletin_audiences audience')
  })

  it('anchors delivery to the current authenticated user and same school', () => {
    expect(sql).toContain('audience.school_id = p_school_id')
    expect(sql).toContain('audience.student_id = (select auth.uid())')
    expect(sql).toContain('student_record.profile_id = (select auth.uid())')
    expect(sql).toContain('student_record.school_id = p_school_id')
  })

  it('keeps the helper out of anonymous execution and only callable for authenticated policy evaluation', () => {
    expect(sql).toContain(
      'revoke all on function private.can_current_user_receive_bulletin(uuid, uuid) from public'
    )
    expect(sql).toContain(
      'revoke all on function private.can_current_user_receive_bulletin(uuid, uuid) from anon'
    )
    expect(sql).toContain('grant usage on schema private to authenticated')
    expect(sql).toContain(
      'grant execute on function private.can_current_user_receive_bulletin(uuid, uuid) to authenticated'
    )
  })

  it('replaces only the student delivery policy with the helper-backed version', () => {
    expect(sql).toContain(
      'drop policy if exists "bulletins student delivery select" on public.bulletins'
    )
    expect(sql).toContain('create policy "bulletins student delivery select"')
    expect(sql).toContain(
      '(select private.can_current_user_receive_bulletin(id, school_id))'
    )
    expect(sql).toContain("and status = 'published'")
  })
})
