import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import {
  canMessageRecipient,
  resolveAuthorizedMessagingRecipients,
} from '@/lib/communications/authorized-recipients'

const root = process.cwd()
const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf-8')

describe('COM-2 heavy adversarial audit', () => {
  const schoolA = 'school-a'
  const schoolB = 'school-b'
  const assignment = {
    studentId: 'student-1',
    instructorId: 'instructor-1',
    schoolId: schoolA,
    isActive: true,
    endedAt: null,
  }

  const actor = (
    id: string,
    role: 'student' | 'apprentice' | 'instructor' | 'school_admin' | 'admin',
    schoolId: string | null = schoolA,
    overrides: Record<string, unknown> = {}
  ) => ({
    id,
    role,
    schoolId,
    approvalStatus: 'approved' as const,
    isDisabled: false,
    ...overrides,
  })

  const candidate = (
    id: string,
    role: 'student' | 'apprentice' | 'instructor' | 'school_admin' | 'admin',
    schoolId: string | null = schoolA,
    overrides: Record<string, unknown> = {}
  ) => ({
    id,
    fullName: id,
    role,
    schoolId,
    approvalStatus: 'approved' as const,
    isDisabled: false,
    ...overrides,
  })

  it('blocks hostile recipient combinations and stale assignment evidence', () => {
    expect(canMessageRecipient(actor('student-1', 'student'), candidate('student-2', 'student'), [assignment])).toBe(false)
    expect(canMessageRecipient(actor('student-1', 'student'), candidate('instructor-2', 'instructor'), [assignment])).toBe(false)
    expect(canMessageRecipient(actor('student-1', 'student'), candidate('admin-b', 'school_admin', schoolB), [assignment])).toBe(false)
    expect(canMessageRecipient(actor('student-1', 'student'), candidate('instructor-1', 'instructor'), [{ ...assignment, isActive: false }])).toBe(false)
    expect(canMessageRecipient(actor('student-1', 'student'), candidate('instructor-1', 'instructor'), [{ ...assignment, endedAt: '2026-10-04T00:00:00Z' }])).toBe(false)
  })

  it('blocks disabled/unapproved actors and recipients before recipient resolution', () => {
    expect(resolveAuthorizedMessagingRecipients(actor('student-1', 'student', schoolA, { isDisabled: true }), [candidate('admin-1', 'school_admin')], [])).toEqual([])
    expect(resolveAuthorizedMessagingRecipients(actor('student-1', 'student', schoolA, { approvalStatus: 'pending' }), [candidate('admin-1', 'school_admin')], [])).toEqual([])
    expect(resolveAuthorizedMessagingRecipients(actor('student-1', 'student'), [candidate('admin-1', 'school_admin', schoolA, { isDisabled: true })], [])).toEqual([])
  })

  it('keeps platform admin from inheriting unrestricted recipient access', () => {
    expect(resolveAuthorizedMessagingRecipients(actor('platform-admin', 'admin', null), [
      candidate('student-1', 'student'),
      candidate('instructor-1', 'instructor'),
      candidate('admin-1', 'school_admin'),
    ], [assignment])).toEqual([])
  })

  it('keeps injected recipient authorization enforced by the database helper', () => {
    const actions = read('src/app/communications/actions.ts')
    const rls = read('supabase/migrations/20261003220000_com2c_database_rls_enforcement.sql')
    expect(actions).toContain('communication_pair_authorized')
    expect(rls).toContain('public.communication_pair_authorized')
    expect(rls).toContain("actor_approval_status = 'approved'")
    expect(rls).toContain('actor_is_disabled = false')
    expect(rls).toContain('recipient_is_disabled = false')
  })

  it('repairs the direct database archive bypass found by the heavy audit', () => {
    const repair = read('supabase/migrations/20261004022000_com2_heavy_audit_archive_authorization.sql')
    expect(repair).toContain('drop policy if exists "communication threads participants update"')
    expect(repair).toContain('create policy "communication threads instructor archive update"')
    expect(repair).toContain("actor.role = 'instructor'")
    expect(repair).toContain("actor.approval_status = 'approved'")
    expect(repair).toContain('coalesce(actor.is_disabled, false) = false')
    expect(repair).toContain("status = 'archived'")
    expect(repair).toContain('grant update (status, updated_at)')
  })

  it('keeps the server archive rule aligned with the repaired database rule', () => {
    const actions = read('src/app/communications/actions.ts')
    expect(actions).toContain("if (actor.role !== 'instructor')")
    expect(actions).toContain('Only instructors can archive conversations.')
  })

  it('keeps send authorization rechecked after thread creation', () => {
    const rls = read('supabase/migrations/20261003220000_com2c_database_rls_enforcement.sql')
    expect(rls).toContain('thread.status = \'active\'')
    expect(rls).toContain('public.communication_pair_authorized(')
  })

  it('keeps read receipts restricted to incoming messages for the current participant', () => {
    const rls = read('supabase/migrations/20261003220000_com2c_database_rls_enforcement.sql')
    expect(rls).toContain('reader_id = (select auth.uid())')
    expect(rls).toContain('message.sender_id <> (select auth.uid())')
    expect(rls).toContain('message.sender_id = thread.participant_one_id')
    expect(rls).toContain('message.sender_id = thread.participant_two_id')
  })

  it('keeps raw database failures out of user-facing messaging results', () => {
    const actions = read('src/app/communications/actions.ts')
    expect(actions).not.toMatch(/return\s*\{\s*success:\s*false,\s*message:\s*[A-Za-z]+Error\.message/)
    expect(actions).not.toMatch(/return\s*\{\s*success:\s*false,\s*message:\s*error\?\.message/)
    expect(actions).toContain('logMessagingFailure')
  })

  it('keeps Bulletins and Realtime outside the private messaging workstream', () => {
    const center = read('src/components/messaging/ProductionMessageCenter.tsx')
    const actions = read('src/app/communications/actions.ts')
    expect(center.toLowerCase()).not.toContain('bulletin')
    expect(actions).not.toContain('.channel(')
  })
})
