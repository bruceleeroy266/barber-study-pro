import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const migrationPath = path.join(
  process.cwd(),
  'supabase/migrations/20261002025500_com1d5_communication_audit_writing.sql'
)

describe('COM-1D.5 server-authoritative communication audit writing', () => {
  const sql = fs.readFileSync(migrationPath, 'utf-8')

  it('uses private security-definer trigger functions with locked search paths', () => {
    expect(sql).toContain('private.audit_student_instructor_assignment()')
    expect(sql).toContain('private.audit_communication_thread()')
    expect(sql).toContain('private.audit_bulletin()')
    expect(sql.match(/security definer/g)?.length).toBe(3)
    expect(sql.match(/set search_path = ''/g)?.length).toBe(3)
  })

  it('prevents ordinary clients from invoking audit trigger helpers directly', () => {
    expect(sql).toContain(
      'revoke all on function private.audit_student_instructor_assignment() from public, anon, authenticated'
    )
    expect(sql).toContain(
      'revoke all on function private.audit_communication_thread() from public, anon, authenticated'
    )
    expect(sql).toContain(
      'revoke all on function private.audit_bulletin() from public, anon, authenticated'
    )
  })

  it('records the locked COM-1A assignment and thread lifecycle events', () => {
    expect(sql).toContain("'assignment_created'")
    expect(sql).toContain("'assignment_ended'")
    expect(sql).toContain("'thread_archived'")
    expect(sql).toContain("old.is_active is true")
    expect(sql).toContain("new.is_active is false")
    expect(sql).toContain("new.status = 'archived'")
  })

  it('records the locked COM-1A bulletin lifecycle events', () => {
    expect(sql).toContain("'bulletin_created'")
    expect(sql).toContain("'bulletin_published'")
    expect(sql).toContain("'bulletin_updated'")
    expect(sql).toContain("'bulletin_archived'")
    expect(sql).toContain("'changed_fields'")
    expect(sql).toContain("'previous'")
    expect(sql).toContain("'current'")
  })

  it('does not duplicate message, read-receipt, or acknowledgment evidence', () => {
    expect(sql).not.toContain("'message_sent'")
    expect(sql).not.toContain("'message_read'")
    expect(sql).not.toContain("'bulletin_acknowledged'")
    expect(sql).not.toContain('on public.communication_messages')
    expect(sql).not.toContain('on public.communication_message_reads')
    expect(sql).not.toContain('on public.bulletin_acknowledgments')
  })

  it('keeps communication audit rows append-only to ordinary clients', () => {
    expect(sql).toContain(
      'revoke all on table public.communication_audit_events from anon, authenticated'
    )
    expect(sql).toContain(
      'grant select on table public.communication_audit_events to authenticated'
    )
    expect(sql).not.toContain(
      'grant insert on table public.communication_audit_events to authenticated'
    )
    expect(sql).not.toContain(
      'grant update on table public.communication_audit_events to authenticated'
    )
    expect(sql).not.toContain(
      'grant delete on table public.communication_audit_events to authenticated'
    )
  })

  it('attaches only the authoritative source-table triggers required by the contract', () => {
    expect(sql).toContain('after insert or update on public.student_instructor_assignments')
    expect(sql).toContain('after update on public.communication_threads')
    expect(sql).toContain('after insert or update on public.bulletins')
  })
})
