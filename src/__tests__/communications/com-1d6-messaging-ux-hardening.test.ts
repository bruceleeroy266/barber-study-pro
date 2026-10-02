import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const ACTIONS = path.join(process.cwd(), 'src/app/communications/actions.ts')
const CENTER = path.join(
  process.cwd(),
  'src/components/messaging/ProductionMessageCenter.tsx'
)

describe('COM-1D.6 messaging UX hardening', () => {
  let actions = ''
  let center = ''

  beforeAll(() => {
    actions = fs.readFileSync(ACTIONS, 'utf-8')
    center = fs.readFileSync(CENTER, 'utf-8')
  })

  it('derives per-thread unread counts from incoming messages and read receipts', () => {
    expect(actions).toContain('unreadCount: number')
    expect(actions).toContain("neq('sender_id', actor.id)")
    expect(actions).toContain("from('communication_message_reads')")
    expect(actions).toContain('unreadByThread')
    expect(actions).toContain('unreadCount: unreadByThread.get(row.id) || 0')
  })

  it('makes read marking idempotent under uniqueness races', () => {
    expect(actions).toContain("insertError.code === '23505'")
    expect(actions).toContain('markedRead: 0')
  })

  it('exposes instructor-only archive runtime without widening student behavior', () => {
    expect(actions).toContain('export async function archiveCommunicationThread')
    expect(actions).toContain("actor.role !== 'instructor'")
    expect(actions).toContain("status: 'archived'")
    expect(actions).toContain(".eq('instructor_id', actor.id)")
    expect(actions).toContain(".eq('status', 'active')")
  })

  it('organizes threads into Inbox, Unread, and Archived views', () => {
    expect(center).toContain("type ThreadFilter = 'inbox' | 'unread' | 'archived'")
    expect(center).toContain("filter === 'unread'")
    expect(center).toContain("filter === 'archived'")
    expect(center).toContain('Conversation filters')
    expect(center).toContain('unreadTotal')
  })

  it('clears unread state after a thread is successfully read', () => {
    expect(center).toContain('unreadCount: 0')
    expect(center).toContain('markCommunicationThreadRead(threadId)')
  })

  it('prevents duplicate open/send submissions at the client interaction boundary', () => {
    expect(center).toContain('sendLockedRef')
    expect(center).toContain('openLockedRef')
    expect(center).toContain('sendLockedRef.current')
    expect(center).toContain('openLockedRef.current')
    expect(center).toContain(
      'current.some((message) => message.id === result.data.id)'
    )
  })

  it('provides accessible loading, status, tab, and focus behavior', () => {
    expect(center).toContain('aria-live="polite"')
    expect(center).toContain('aria-atomic="true"')
    expect(center).toContain('role="tablist"')
    expect(center).toContain('aria-selected=')
    expect(center).toContain('aria-busy=')
    expect(center).toContain('focus-visible:ring-2')
    expect(center).toContain('Loading conversation')
    expect(center).toContain('Message sent')
  })

  it('keeps archived conversations non-sendable and offers instructor archive control', () => {
    expect(center).toContain("selectedThread.status !== 'active'")
    expect(center).toContain("currentUserRole === 'instructor'")
    expect(center).toContain('archiveCommunicationThread(selectedThread.id)')
    expect(center).toContain('This conversation is archived')
  })

  it('does not enable Realtime', () => {
    expect(actions).not.toContain('.channel(')
    expect(center).not.toContain('.channel(')
    expect(center.toLowerCase()).not.toContain('realtime')
  })
})
