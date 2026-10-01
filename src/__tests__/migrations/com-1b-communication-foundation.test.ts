import fs from 'fs'
import path from 'path'
import { describe, expect, it, beforeAll } from 'vitest'

const MIGRATION_PATH = path.join(
  process.cwd(),
  'supabase/migrations/20261001224500_com1b_communication_foundation.sql'
)

describe('COM-1B communication database foundation', () => {
  let sql = ''

  beforeAll(() => {
    sql = fs.readFileSync(MIGRATION_PATH, 'utf-8')
  })

  it('creates all eight communication foundation tables', () => {
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
      expect(sql).toContain(`create table if not exists public.${table}`)
    }
  })

  it('enforces one active instructor assignment per student', () => {
    expect(sql).toContain('uq_student_instructor_assignments_one_active_student')
    expect(sql).toContain('where is_active = true')
  })

  it('keeps messages immutable at the schema-foundation layer', () => {
    expect(sql).toContain('communication_messages')
    expect(sql).toContain('on delete restrict')
    expect(sql).not.toMatch(/create policy[\s\S]*communication_messages[\s\S]*for update/i)
    expect(sql).not.toMatch(/create policy[\s\S]*communication_messages[\s\S]*for delete/i)
  })

  it('deduplicates message reads and bulletin acknowledgments', () => {
    expect(sql).toContain('communication_message_reads_unique unique (message_id, reader_id)')
    expect(sql).toContain('bulletin_acknowledgments_unique unique (bulletin_id, student_id)')
  })

  it('locks bulletin audience shapes', () => {
    expect(sql).toContain("audience_type in ('school', 'program', 'student')")
    expect(sql).toContain("audience_type = 'school'")
    expect(sql).toContain("audience_type = 'program'")
    expect(sql).toContain("audience_type = 'student'")
  })

  it('enables RLS on every exposed communication table', () => {
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
      expect(sql).toContain(`alter table public.${table} enable row level security`)
    }
  })

  it('does not create authenticated access policies before COM-1C', () => {
    expect(sql.toLowerCase()).not.toContain('create policy')
  })

  it('indexes foreign-key and primary access paths used by Communications', () => {
    expect(sql).toContain('idx_student_instructor_assignments_school_instructor_active')
    expect(sql).toContain('idx_student_instructor_assignments_school_student_active')
    expect(sql).toContain('idx_communication_messages_thread_sent_at')
    expect(sql).toContain('idx_bulletin_audiences_program')
    expect(sql).toContain('idx_bulletin_audiences_student')
    expect(sql).toContain('idx_bulletin_acknowledgments_student_acknowledged_at')
  })
})
