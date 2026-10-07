import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const ACTIONS = path.join(process.cwd(), 'src/app/communications/bulletin-actions.ts')
const MANAGER = path.join(process.cwd(), 'src/components/messaging/BulletinManager.tsx')
const FEED = path.join(process.cwd(), 'src/components/messaging/StudentBulletinFeed.tsx')
const INSTRUCTOR_PAGE = path.join(process.cwd(), 'src/app/instructor/bulletins/page.tsx')
const ADMIN_PAGE = path.join(process.cwd(), 'src/app/admin/bulletins/page.tsx')
const STUDENT_PAGE = path.join(process.cwd(), 'src/app/(dashboard)/dashboard/bulletins/page.tsx')

describe('COM-1D.4 production bulletins runtime + UI', () => {
  let actions = ''
  let manager = ''
  let feed = ''
  let instructorPage = ''
  let adminPage = ''
  let studentPage = ''

  beforeAll(() => {
    actions = fs.readFileSync(ACTIONS, 'utf-8')
    manager = fs.readFileSync(MANAGER, 'utf-8')
    feed = fs.readFileSync(FEED, 'utf-8')
    instructorPage = fs.readFileSync(INSTRUCTOR_PAGE, 'utf-8')
    adminPage = fs.readFileSync(ADMIN_PAGE, 'utf-8')
    studentPage = fs.readFileSync(STUDENT_PAGE, 'utf-8')
  })

  it('uses server-only authenticated Supabase runtime and preserves RLS authority', () => {
    expect(actions.startsWith("'use server'")).toBe(true)
    expect(actions).toContain("from '@/lib/supabase-server'")
    expect(actions).toContain('supabase.auth.getUser()')
    expect(actions).not.toContain('SUPABASE_SERVICE_ROLE')
    expect(actions).not.toContain('createAdmin')
  })

  it('publishes atomically through the database reliability boundary', () => {
    expect(actions).toContain("supabase.rpc(\n    'publish_bulletin_atomic'")
    expect(actions).toContain('Choose at least one bulletin audience.')
    expect(actions).toContain('operationId')
    expect(actions).not.toContain('Bulletin draft was saved, but audience targeting failed')
  })

  it('supports priority, pinning, scheduling, expiration, and acknowledgment-required state', () => {
    expect(actions).toContain('p_priority: input.priority')
    expect(actions).toContain('p_is_pinned: input.isPinned')
    expect(actions).toContain('p_acknowledgment_required: input.acknowledgmentRequired')
    expect(actions).toContain('p_publish_at: publishAt')
    expect(actions).toContain('p_expires_at: expiresAt')
    expect(manager).toContain('type="datetime-local"')
    expect(manager).toContain('Require acknowledgment')
    expect(manager).toContain('Pin bulletin')
  })

  it('keeps instructor targets limited to selected students and active assignments', () => {
    expect(actions).toContain("actor.role === 'instructor'")
    expect(actions).toContain("audience.type !== 'student'")
    expect(instructorPage).toContain(".from('student_instructor_assignments')")
    expect(instructorPage).toContain(".eq('instructor_id', user.id)")
    expect(instructorPage).toContain(".eq('is_active', true)")
    expect(instructorPage).toContain(".is('ended_at', null)")
  })

  it('allows school admins to select school, program, or same-school student targets', () => {
    expect(adminPage).toContain(".from('programs')")
    expect(adminPage).toContain(".eq('school_id', profile.school_id)")
    expect(adminPage).toContain(".in('role', ['student', 'apprentice'])")
    expect(manager).toContain("audienceMode === 'school'")
    expect(manager).toContain("audienceMode === 'program'")
    expect(manager).toContain("{ type: 'student' as const, studentId: id }")
  })

  it('delivers student bulletins and supports append-only acknowledgment', () => {
    expect(studentPage).toContain('loadStudentBulletins')
    expect(actions).toContain('export async function acknowledgeBulletin')
    expect(actions).toContain(".from('bulletin_acknowledgments')")
    expect(actions).toContain("onConflict: 'bulletin_id,student_id'")
    expect(actions).toContain('ignoreDuplicates: true')
    expect(feed).toContain('Acknowledged')
    expect(feed).toContain('Acknowledge')
  })

  it('sorts student delivery explicitly by pin, priority, then recency', () => {
    expect(actions).toContain('priorityRank')
    expect(actions).toContain('if (a.isPinned !== b.isPinned)')
    expect(actions).toContain('priorityRank[b.priority] - priorityRank[a.priority]')
    expect(actions).toContain('return bTime - aTime')
  })

  it('exposes manager acknowledgment names/timestamps through authorized detail reads', () => {
    expect(actions).toContain('export async function loadBulletinAcknowledgments')
    expect(manager).toContain('loadBulletinAcknowledgments')
    expect(manager).toContain('ack.acknowledgedAt')
    expect(manager).toContain("audienceOptions.find")
  })

  it('does not enable realtime, comments, replies, or reaction behavior', () => {
    expect(actions).not.toContain('.channel(')
    expect(actions).not.toContain('realtime')
    expect(manager).not.toContain('reaction')
    expect(feed).not.toContain('reply')
    expect(feed).not.toContain('comment')
  })
})
