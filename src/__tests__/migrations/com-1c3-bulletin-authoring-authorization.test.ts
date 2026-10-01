import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const MIGRATION_PATH = path.join(
  process.cwd(),
  'supabase/migrations/20261001234500_com1c3_bulletin_authoring_authorization.sql'
)

describe('COM-1C.3 bulletin authoring + audience authorization', () => {
  let sql = ''

  beforeAll(() => {
    sql = fs.readFileSync(MIGRATION_PATH, 'utf-8')
  })

  it('keeps direct bulletin creation draft-only', () => {
    expect(sql).toContain('create policy "bulletins managers insert"')
    expect(sql).toContain("status = 'draft'")
    expect(sql).toContain('author_id = (select auth.uid())')
    expect(sql).toContain(
      'school_id = (select public.current_user_school_id())'
    )
  })

  it('limits instructor bulletin management to the author and same school', () => {
    expect(sql).toContain(
      "author_id = (select auth.uid())"
    )
    expect(sql).toContain(
      "(select public.current_user_role()) = 'instructor'"
    )
    expect(sql).toContain('public.is_school_admin(school_id)')
  })

  it('requires at least one audience before publication', () => {
    expect(sql).toContain("status <> 'published'")
    expect(sql).toContain(
      'from public.bulletin_audiences audience'
    )
    expect(sql).toContain(
      'audience.bulletin_id = bulletins.id'
    )
  })

  it('limits instructor publication to actively assigned students only', () => {
    expect(sql).toContain("audience.audience_type <> 'student'")
    expect(sql).toContain(
      'assignment.student_id = audience.student_id'
    )
    expect(sql).toContain(
      'assignment.instructor_id = (select auth.uid())'
    )
    expect(sql).toContain('assignment.is_active = true')
    expect(sql).toContain('assignment.ended_at is null')
  })

  it('validates school-admin program and student targets stay in the bulletin school', () => {
    expect(sql).toContain(
      'program.school_id = bulletins.school_id'
    )
    expect(sql).toContain(
      'student_profile.school_id = bulletins.school_id'
    )
    expect(sql).toContain(
      "student_profile.role in ('student', 'apprentice')"
    )
  })

  it('allows audience edits only while the bulletin is a draft', () => {
    expect(sql).toContain(
      'create policy "bulletin audiences managers insert"'
    )
    expect(sql).toContain(
      'create policy "bulletin audiences managers delete draft"'
    )
    expect(sql).toContain("bulletin.status = 'draft'")
  })

  it('avoids circular audience-select dependency on bulletins', () => {
    const selectStart = sql.indexOf(
      'create policy "bulletin audiences managers select"'
    )
    const insertStart = sql.indexOf(
      'create policy "bulletin audiences managers insert"'
    )
    const audienceSelectPolicy = sql.slice(selectStart, insertStart)

    expect(audienceSelectPolicy).not.toContain('from public.bulletins')
    expect(audienceSelectPolicy).toContain(
      'from public.student_instructor_assignments assignment'
    )
  })

  it('uses least-privilege grants and keeps bulletin identities immutable', () => {
    expect(sql).toContain(
      'revoke all on table public.bulletins from anon, authenticated'
    )
    expect(sql).toContain(
      'revoke all on table public.bulletin_audiences from anon, authenticated'
    )
    expect(sql).toContain('grant select on table public.bulletins to authenticated')
    expect(sql).toContain('grant update (')
    expect(sql).not.toMatch(
      /grant\s+update\s+on table public\.bulletins/i
    )
    expect(sql).not.toMatch(
      /grant\s+delete\s+on table public\.bulletins/i
    )
    expect(sql).not.toMatch(
      /grant\s+update\s+on table public\.bulletin_audiences/i
    )
  })

  it('does not open student acknowledgment, realtime, or messaging authorization', () => {
    expect(sql).not.toContain('on public.bulletin_acknowledgments')
    expect(sql).not.toContain('on public.communication_messages')
    expect(sql).not.toContain('on public.communication_message_reads')
    expect(sql).not.toContain('realtime.messages')
  })
})
