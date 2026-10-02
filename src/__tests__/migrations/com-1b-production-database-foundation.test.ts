import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (file: string) =>
  fs.readFileSync(path.join(process.cwd(), file), 'utf8')

const base = read(
  'supabase/migrations/20261001224500_com1b_communication_foundation.sql',
)
const completion = read(
  'supabase/migrations/20261001230500_com_1b_foundation_completion.sql',
)

const combined = [base, completion].join('\n')

describe('COM-1B communication database foundation', () => {
  it('creates all eight locked communication tables', () => {
    for (const table of [
      'student_instructor_assignments',
      'communication_threads',
      'communication_messages',
      'communication_message_reads',
      'bulletins',
      'bulletin_audiences',
      'bulletin_acknowledgments',
      'communication_audit_events',
    ]) {
      expect(combined).toContain(`public.${table}`)
    }
  })

  it('keeps every communication table protected by RLS', () => {
    for (const table of [
      'student_instructor_assignments',
      'communication_threads',
      'communication_messages',
      'communication_message_reads',
      'bulletins',
      'bulletin_audiences',
      'bulletin_acknowledgments',
      'communication_audit_events',
    ]) {
      expect(combined).toContain(
        `alter table public.${table} enable row level security`,
      )
    }
  })

  it('enforces one active instructor assignment per student', () => {
    expect(base).toContain(
      'uq_student_instructor_assignments_one_active_student',
    )
    expect(base).toContain('where is_active = true')
    expect(base).toContain(
      'check ((is_active and ended_at is null) or (not is_active and ended_at is not null))',
    )
  })

  it('validates communication assignments against authoritative profile roles and school', () => {
    expect(completion).toContain(
      'create or replace function public.validate_communication_assignment_row()',
    )
    expect(completion).toContain(
      "v_student.role not in ('student', 'apprentice')",
    )
    expect(completion).toContain("v_instructor.role <> 'instructor'")
    expect(completion).toContain(
      'v_student.school_id is distinct from new.school_id',
    )
    expect(completion).toContain(
      'v_instructor.school_id is distinct from new.school_id',
    )
    expect(completion).toContain(
      'create trigger trg_validate_communication_assignment',
    )
  })

  it('requires an active assignment before a private thread may be created', () => {
    expect(completion).toContain(
      'create or replace function public.has_active_communication_assignment(',
    )
    expect(completion).toContain('a.is_active = true')
    expect(completion).toContain('a.ended_at is null')
    expect(completion).toContain(
      'create or replace function public.validate_communication_thread_insert()',
    )
    expect(completion).toContain(
      "raise exception 'Communication thread requires an active student-instructor assignment'",
    )
    expect(completion).toContain(
      'new.created_by not in (new.student_id, new.instructor_id)',
    )
  })

  it('prevents retargeting a historical thread to different participants or school', () => {
    expect(completion).toContain(
      'create or replace function public.prevent_communication_thread_retargeting()',
    )
    expect(completion).toContain(
      "raise exception 'Communication thread participant identity is immutable'",
    )
    expect(completion).toContain(
      'before update of school_id, student_id, instructor_id, created_by',
    )
  })

  it('keeps message, read, acknowledgment, and audit evidence append-only', () => {
    expect(completion).toContain(
      'create or replace function public.prevent_communication_evidence_mutation()',
    )
    expect(completion).toContain('trg_communication_messages_append_only')
    expect(completion).toContain('trg_communication_message_reads_append_only')
    expect(completion).toContain('trg_bulletin_acknowledgments_append_only')
    expect(completion).toContain('trg_communication_audit_events_append_only')
    expect(completion).toContain('before update or delete')
  })

  it('keeps ordinary users closed out until COM-1C ships exact RLS policies', () => {
    for (const table of [
      'student_instructor_assignments',
      'communication_threads',
      'communication_messages',
      'communication_message_reads',
      'bulletins',
      'bulletin_audiences',
      'bulletin_acknowledgments',
      'communication_audit_events',
    ]) {
      expect(completion).toContain(
        `revoke all on table public.${table} from anon, authenticated`,
      )
      expect(completion).toContain(
        `grant select, insert, update, delete on table public.${table} to service_role`,
      )
    }
  })

  it('keeps assignment helpers private until the authorization slice', () => {
    expect(completion).toContain(
      'revoke execute on function public.has_active_communication_assignment(uuid, uuid, uuid)',
    )
    expect(completion).toContain('from public, anon, authenticated')
    expect(completion).toContain('to service_role')
  })

  it('does not activate communication UI, realtime, TLS, H&A, or learning runtime', () => {
    expect(completion).not.toContain("from '@/")
    expect(completion.toLowerCase()).not.toContain('remediation_cycles')
    expect(completion.toLowerCase()).not.toContain('hour_logs')
    expect(completion.toLowerCase()).not.toContain('quiz_attempts')
    expect(completion.toLowerCase()).not.toContain('student_progress')
    expect(completion.toLowerCase()).not.toContain('realtime publication')
  })
})
