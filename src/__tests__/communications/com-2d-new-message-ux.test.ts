import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const COMPONENT_PATH = path.join(
  process.cwd(),
  'src/components/messaging/ProductionMessageCenter.tsx'
)

describe('COM-2D new message UX', () => {
  let source = ''

  beforeAll(() => {
    source = fs.readFileSync(COMPONENT_PATH, 'utf-8')
  })

  it('presents the direct New Message flow', () => {
    expect(source).toContain('New Message')
    expect(source).toContain('Pick Person')
    expect(source).toContain('Type your message…')
    expect(source).toContain('Send')
  })

  it('renders recipient choices only from availableCounterparts', () => {
    expect(source).toContain('{availableCounterparts.map((person) => (')
    expect(source).not.toContain('{people.map((person) => (')
    expect(source).toContain('Only authorized recipients appear here.')
  })

  it('creates or reuses the authorized thread and sends in one action', () => {
    const normalized = source.replace(/\s+/g, ' ')

    expect(normalized).toContain(
      "const threadResult = await openCommunicationThread( counterpartId, 'Conversation' )"
    )
    expect(normalized).toContain(
      'const messageResult = await sendCommunicationMessage( threadResult.data.thread.id, bodyToSend )'
    )
  })

  it('does not require a subject before sending the first message', () => {
    expect(source).not.toContain('Conversation subject')
    expect(source).not.toContain('Open conversation')
  })

  it('locks duplicate first-send interaction while pending', () => {
    expect(source).toContain('composeLockedRef.current')
    expect(source).toContain('isPending ||')
    expect(source).toContain('!newMessageBody.trim()')
  })

  it('keeps inbox, unread, archived, and existing reply behavior intact', () => {
    expect(source).toContain("type ThreadFilter = 'inbox' | 'unread' | 'archived'")
    expect(source).toContain('handleSend')
    expect(source).toContain('handleArchive')
  })
})
