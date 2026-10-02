import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const ACTIONS_PATH = path.join(
  process.cwd(),
  'src/app/communications/actions.ts'
)

describe('COM-1D.1 server messaging runtime', () => {
  let source = ''

  beforeAll(() => {
    source = fs.readFileSync(ACTIONS_PATH, 'utf-8')
  })

  it('is server-only runtime code and does not activate messaging UI', () => {
    expect(source.startsWith("'use server'")).toBe(true)
    expect(source).not.toContain("from '@/components/")
    expect(source).not.toContain('MessageCenter')
    expect(source).not.toContain('InstructorMessageDashboard')
  })

  it('authenticates through the server Supabase session and school profile', () => {
    expect(source).toContain("from '@/lib/supabase-server'")
    expect(source).toContain('supabase.auth.getUser()')
    expect(source).toContain(".from('profiles')")
    expect(source).toContain("'student', 'apprentice', 'instructor'")
    expect(source).toContain('profile.school_id')
  })

  it('loads threads through the RLS-protected production table', () => {
    expect(source).toContain('export async function loadCommunicationThreads')
    expect(source).toContain(".from('communication_threads')")
    expect(source).toContain(".order('last_message_at', { ascending: false })")
  })

  it('loads only the selected authorized thread message history and receipts', () => {
    expect(source).toContain('export async function loadCommunicationThreadMessages')
    expect(source).toContain(".from('communication_messages')")
    expect(source).toContain(".eq('thread_id', threadId)")
    expect(source).toContain(".from('communication_message_reads')")
    expect(source).toContain(".eq('reader_id', actor.id)")
  })

  it('validates and sends messages as the authenticated actor without service-role bypass', () => {
    expect(source).toContain('export async function sendCommunicationMessage')
    expect(source).toContain('body.trim()')
    expect(source).toContain('trimmedBody.length > 4000')
    expect(source).toContain('sender_id: actor.id')
    expect(source).toContain('school_id: thread.school_id')
    expect(source).not.toContain('SUPABASE_SERVICE_ROLE')
    expect(source).not.toContain('createAdmin')
  })

  it('marks only incoming messages read and remains idempotent', () => {
    expect(source).toContain('export async function markCommunicationThreadRead')
    expect(source).toContain(".neq('sender_id', actor.id)")
    expect(source).toContain(".eq('reader_id', actor.id)")
    expect(source).toContain('existingIds')
    expect(source).toContain('unreadIds')
    expect(source).toContain('reader_id: actor.id')
  })

  it('does not create threads, wire realtime, or activate bulletin runtime in this slice', () => {
    expect(source).not.toContain('createCommunicationThread')
    expect(source).not.toContain('.channel(')
    expect(source).not.toContain('realtime')
    expect(source).not.toContain(".from('bulletins')")
    expect(source).not.toContain(".from('bulletin_acknowledgments')")
  })
})
