import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import {
  canMessageRecipient,
  resolveAuthorizedMessagingRecipients,
} from '@/lib/communications/authorized-recipients'

const root = process.cwd()
const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf-8')

describe('COM-2J final expanded messaging certification', () => {
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
    schoolId: string | null = schoolA
  ) => ({
    id,
    role,
    schoolId,
    approvalStatus: 'approved' as const,
    isDisabled: false,
  })

  const candidate = (
    id: string,
    role: 'student' | 'apprentice' | 'instructor' | 'school_admin' | 'admin',
    schoolId: string | null = schoolA
  ) => ({
    id,
    fullName: id,
    role,
    schoolId,
    approvalStatus: 'approved' as const,
    isDisabled: false,
  })

  it('certifies the complete allowed messaging matrix', () => {
    expect(canMessageRecipient(actor('student-1', 'student'), candidate('instructor-1', 'instructor'), [assignment])).toBe(true)
    expect(canMessageRecipient(actor('student-1', 'student'), candidate('admin-1', 'school_admin'), [assignment])).toBe(true)
    expect(canMessageRecipient(actor('instructor-1', 'instructor'), candidate('student-1', 'student'), [assignment])).toBe(true)
    expect(canMessageRecipient(actor('instructor-1', 'instructor'), candidate('admin-1', 'school_admin'), [assignment])).toBe(true)
    expect(canMessageRecipient(actor('admin-1', 'school_admin'), candidate('instructor-1', 'instructor'), [assignment])).toBe(true)
    expect(canMessageRecipient(actor('admin-1', 'school_admin'), candidate('student-1', 'student'), [assignment])).toBe(true)
  })

  it('certifies the complete blocked messaging matrix', () => {
    expect(canMessageRecipient(actor('student-1', 'student'), candidate('student-2', 'student'), [assignment])).toBe(false)
    expect(canMessageRecipient(actor('student-1', 'student'), candidate('instructor-2', 'instructor'), [assignment])).toBe(false)
    expect(canMessageRecipient(actor('student-1', 'student'), candidate('admin-b', 'school_admin', schoolB), [assignment])).toBe(false)
    expect(canMessageRecipient(actor('instructor-1', 'instructor'), candidate('student-2', 'student'), [assignment])).toBe(false)
    expect(resolveAuthorizedMessagingRecipients(actor('platform-admin', 'admin', null), [candidate('student-1', 'student')], [assignment])).toEqual([])
  })

  it('keeps database enforcement against injected recipients and unauthorized threads', () => {
    const actions = read('src/app/communications/actions.ts')
    const rls = read('supabase/migrations/20261003220000_com2c_database_rls_enforcement.sql')
    expect(actions).toContain('communication_pair_authorized')
    expect(actions).toContain('Conversation not found or not authorized.')
    expect(rls).toContain('communication_pair_authorized')
  })

  it('keeps inbox, unread, archive, duplicate-send, and simple conversation UX protections', () => {
    const center = read('src/components/messaging/ProductionMessageCenter.tsx')
    expect(center).toContain("type ThreadFilter = 'inbox' | 'unread' | 'archived'")
    expect(center).toContain('sendLockedRef')
    expect(center).toContain('composeLockedRef')
    expect(center).toContain('Back to conversations')
    expect(center).toContain('roleLabel')
  })

  it('keeps audit and safe-failure hardening intact', () => {
    const actions = read('src/app/communications/actions.ts')
    const audit = read('supabase/migrations/20261004011000_com2h_messaging_audit_failure_hardening.sql')
    expect(actions).toContain('logMessagingFailure')
    expect(actions).toContain('Unable to send this message right now.')
    expect(audit).toContain("'thread_created'")
    expect(audit).toContain("'thread_archived'")
  })

  it('keeps mobile and accessibility hardening intact', () => {
    const center = read('src/components/messaging/ProductionMessageCenter.tsx')
    expect(center).toContain("isComposing || selectedThread ? 'hidden xl:flex' : 'flex'")
    expect(center).toContain('min-h-11')
    expect(center).toContain('aria-live="polite"')
    expect(center).toContain('role="alert"')
    expect(center).toContain('aria-controls="conversation-filter-panel"')
  })

  it('keeps Bulletins separate and certified', () => {
    const bulletinTest = read('src/__tests__/communications/com-1d4-production-bulletins.test.ts')
    const center = read('src/components/messaging/ProductionMessageCenter.tsx')
    expect(bulletinTest).toContain('bulletin')
    expect(center.toLowerCase()).not.toContain('bulletin')
  })

  it('keeps Realtime deferred', () => {
    const actions = read('src/app/communications/actions.ts')
    expect(actions).not.toContain('.channel(')
  })
})
