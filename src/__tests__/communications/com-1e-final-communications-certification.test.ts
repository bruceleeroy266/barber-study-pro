import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const ROOT = process.cwd()

const read = (relative: string) =>
  fs.readFileSync(path.join(ROOT, relative), 'utf-8')

describe('COM-1E final communications certification guardrails', () => {
  const actions = read('src/app/communications/actions.ts')
  const bulletins = read('src/app/communications/bulletin-actions.ts')
  const messageCenter = read(
    'src/components/messaging/ProductionMessageCenter.tsx'
  )
  const realtimeDecision = read(
    'docs/communications/COM-1D.7-REALTIME-DECISION.md'
  )

  it('formally defers Realtime for the pilot', () => {
    expect(realtimeDecision).toContain('Status: DEFERRED FOR PILOT')
    expect(actions).not.toContain('.channel(')
    expect(bulletins).not.toContain('.channel(')
    expect(messageCenter).not.toContain('.channel(')
  })

  it('retains hardened messaging organization and archive controls', () => {
    expect(messageCenter).toContain(
      "type ThreadFilter = 'inbox' | 'unread' | 'archived'"
    )
    expect(actions).toContain('unreadCount: number')
    expect(actions).toContain(
      'export async function archiveCommunicationThread'
    )
    expect(messageCenter).toContain('archiveCommunicationThread(')
    expect(messageCenter).toContain('This conversation is archived')
  })

  it('retains production bulletin runtime boundaries', () => {
    expect(bulletins).toContain('loadManagedBulletins')
    expect(bulletins).toContain('loadStudentBulletins')
    expect(bulletins).toContain('publishBulletin')
    expect(bulletins).toContain('acknowledgeBulletin')
    expect(bulletins).toContain('archiveBulletin')
  })

  it('does not introduce service-role communication bypasses', () => {
    expect(actions.toLowerCase()).not.toContain('service_role')
    expect(bulletins.toLowerCase()).not.toContain('service_role')
  })
})
