import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const MIGRATION_PATH = path.join(
  process.cwd(),
  'supabase/migrations/20261002000500_com1c4_bulletin_delivery_ack_authorization.sql'
)

describe('COM-1C.4 bulletin delivery + acknowledgment authorization', () => {
  let sql = ''

  beforeAll(() => {
    sql = fs.readFileSync(MIGRATION_PATH, 'utf-8')
  })

  it('resolves only student-applicable audience rows', () => {
    expect(sql).toContain(
      'create policy "bulletin audiences student delivery select"'
    )
    expect(sql).toContain("audience_type = 'school'")
    expect(sql).toContain("audience_type = 'student'")
    expect(sql).toContain('student_id = (select auth.uid())')
    expect(sql).toContain("audience_type = 'program'")
    expect(sql).toContain(
      'student_record.profile_id = (select auth.uid())'
    )
    expect(sql).toContain(
      'enrollment.program_id = bulletin_audiences.program_id'
    )
  })

  it('limits student bulletin delivery to active published windows', () => {
    expect(sql).toContain(
      'create policy "bulletins student delivery select"'
    )
    expect(sql).toContain("status = 'published'")
    expect(sql).toContain(
      '(publish_at is null or publish_at <= now())'
    )
    expect(sql).toContain(
      '(expires_at is null or expires_at > now())'
    )
  })

  it('requires a matching school, student, or active program audience', () => {
    expect(sql).toContain(
      'audience.bulletin_id = bulletins.id'
    )
    expect(sql).toContain(
      'audience.school_id = bulletins.school_id'
    )
    expect(sql).toContain(
      'student_record.school_id = bulletins.school_id'
    )
    expect(sql).toContain(
      'coalesce(enrollment.is_active, true) = true'
    )
    expect(sql).toContain('enrollment.deleted_at is null')
  })

  it('limits students to their own acknowledgment rows', () => {
    expect(sql).toContain(
      'create policy "bulletin acknowledgments student self select"'
    )
    expect(sql).toContain(
      'student_id = (select auth.uid())'
    )
    expect(sql).toContain(
      'school_id = (select public.current_user_school_id())'
    )
  })

  it('allows managers to read acknowledgments only for managed bulletins', () => {
    expect(sql).toContain(
      'create policy "bulletin acknowledgments managers select"'
    )
    expect(sql).toContain(
      'bulletin.id = bulletin_acknowledgments.bulletin_id'
    )
    expect(sql).toContain(
      'bulletin.author_id = (select auth.uid())'
    )
    expect(sql).toContain('public.is_school_admin(bulletin.school_id)')
  })

  it('requires self identity, visible publication, and acknowledgment-required for inserts', () => {
    expect(sql).toContain(
      'create policy "bulletin acknowledgments student insert"'
    )
    expect(sql).toContain(
      'student_id = (select auth.uid())'
    )
    expect(sql).toContain('bulletin.acknowledgment_required = true')
    expect(sql).toContain("bulletin.status = 'published'")
    expect(sql).toContain(
      '(bulletin.publish_at is null or bulletin.publish_at <= now())'
    )
    expect(sql).toContain(
      '(bulletin.expires_at is null or bulletin.expires_at > now())'
    )
  })

  it('keeps acknowledgment timestamps server-controlled and evidence append-only', () => {
    expect(sql).toContain(
      'grant insert (bulletin_id, school_id, student_id)'
    )
    expect(sql).not.toContain(
      'grant insert (bulletin_id, school_id, student_id, acknowledged_at)'
    )
    expect(sql.toLowerCase()).not.toMatch(/grant\s+update/)
    expect(sql.toLowerCase()).not.toMatch(/grant\s+delete/)
    expect(sql.toLowerCase()).not.toMatch(/grant\s+truncate/)
  })

  it('keeps anon closed for acknowledgments', () => {
    expect(sql).toContain(
      'revoke all on table public.bulletin_acknowledgments from anon, authenticated'
    )
    expect(sql).not.toMatch(/grant[^;]+\bto anon\b/i)
  })

  it('does not open realtime, audit events, or messaging authorization', () => {
    expect(sql).not.toContain('on public.communication_audit_events')
    expect(sql).not.toContain('on public.communication_messages')
    expect(sql).not.toContain('on public.communication_message_reads')
    expect(sql).not.toContain('realtime.messages')
  })
})
