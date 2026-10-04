import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const CENTER = path.join(
  process.cwd(),
  'src/components/messaging/ProductionMessageCenter.tsx'
)

describe('COM-2G inbox and conversation simplicity', () => {
  let center = ''

  beforeAll(() => {
    center = fs.readFileSync(CENTER, 'utf-8')
  })

  it('keeps the three simple inbox filters', () => {
    expect(center).toContain("type ThreadFilter = 'inbox' | 'unread' | 'archived'")
    expect(center).toContain('<span>Inbox</span>')
    expect(center).toContain('<span>Unread</span>')
    expect(center).toContain('<span>Archived</span>')
  })

  it('provides an obvious way back from compose and conversation views', () => {
    expect(center).toContain('returnToInbox')
    expect(center.match(/Back to conversations/g)?.length ?? 0).toBeGreaterThanOrEqual(2)
    expect(center).toContain('ArrowLeft')
  })

  it('shows the counterpart name and plain-language role', () => {
    expect(center).toContain('counterpartForThread')
    expect(center).toContain('roleLabel')
    expect(center).toContain("if (role === 'instructor') return 'Instructor'")
    expect(center).toContain("return 'School Admin'")
    expect(center).toContain("return 'Apprentice'")
    expect(center).toContain("return 'Student'")
  })

  it('keeps the conversation composer simple', () => {
    expect(center).toContain('Reply')
    expect(center).toContain('Reply to this conversation…')
    expect(center).toContain('aria-label="Send message"')
  })

  it('keeps existing unread, archive, and duplicate-send protections intact', () => {
    expect(center).toContain('unreadCount')
    expect(center).toContain('archiveCommunicationThread')
    expect(center).toContain('sendLockedRef')
    expect(center).toContain('composeLockedRef')
  })

  it('does not introduce Bulletin or Realtime behavior', () => {
    expect(center.toLowerCase()).not.toContain('bulletin')
    expect(center.toLowerCase()).not.toContain('realtime')
  })
})
