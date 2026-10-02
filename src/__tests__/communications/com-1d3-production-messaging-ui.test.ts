import fs from 'fs'
import path from 'path'
import { beforeAll, describe, expect, it } from 'vitest'

const INSTRUCTOR_PAGE = path.join(
  process.cwd(),
  'src/app/instructor/messages/page.tsx'
)
const STUDENT_PAGE = path.join(
  process.cwd(),
  'src/app/(dashboard)/dashboard/messages/page.tsx'
)
const NEW_MESSAGE_PAGE = path.join(
  process.cwd(),
  'src/app/instructor/messages/new/page.tsx'
)
const PRODUCTION_CENTER = path.join(
  process.cwd(),
  'src/components/messaging/ProductionMessageCenter.tsx'
)

describe('COM-1D.3 production messaging UI integration', () => {
  let instructorPage = ''
  let studentPage = ''
  let newMessagePage = ''
  let center = ''

  beforeAll(() => {
    instructorPage = fs.readFileSync(INSTRUCTOR_PAGE, 'utf-8')
    studentPage = fs.readFileSync(STUDENT_PAGE, 'utf-8')
    newMessagePage = fs.readFileSync(NEW_MESSAGE_PAGE, 'utf-8')
    center = fs.readFileSync(PRODUCTION_CENTER, 'utf-8')
  })

  it('replaces the production placeholder for instructor participants with the certified message center', () => {
    expect(instructorPage).toContain('ProductionMessageCenter')
    expect(instructorPage).toContain('loadCommunicationThreads')
    expect(instructorPage).toContain("instructorProfile.role !== 'instructor'")
    expect(instructorPage).toContain(
      ".from('student_instructor_assignments')"
    )
    expect(instructorPage).toContain(".eq('instructor_id', user.id)")
    expect(instructorPage).toContain(".eq('is_active', true)")
  })

  it('replaces the student production placeholder with assigned-instructor messaging only', () => {
    expect(studentPage).toContain('ProductionMessageCenter')
    expect(studentPage).toContain('loadCommunicationThreads')
    expect(studentPage).toContain(
      "!['student', 'apprentice'].includes(profile.role)"
    )
    expect(studentPage).toContain(
      ".from('student_instructor_assignments')"
    )
    expect(studentPage).toContain(".eq('student_id', user.id)")
    expect(studentPage).toContain(".eq('is_active', true)")
  })

  it('uses only the certified server runtime for production message actions', () => {
    expect(center).toContain('loadCommunicationThreadMessages')
    expect(center).toContain('markCommunicationThreadRead')
    expect(center).toContain('openCommunicationThread')
    expect(center).toContain('sendCommunicationMessage')
    expect(center).not.toContain("from '@/lib/supabase")
    expect(center).not.toContain('createClient(')
    expect(center).not.toContain('SUPABASE_SERVICE_ROLE')
  })

  it('supports thread selection, reply, and assignment-safe conversation creation', () => {
    expect(center).toContain('handleSelect')
    expect(center).toContain('handleSend')
    expect(center).toContain('handleOpenConversation')
    expect(center).toContain('availableCounterparts')
    expect(center).toContain('Open conversation')
    expect(center).toContain('Private to your assigned')
  })

  it('keeps the old multi-recipient compose route out of production', () => {
    expect(newMessagePage).toContain(
      "const isSafeDemo = isExplicitDemoMode() && !isSupabaseConfigured()"
    )
    expect(newMessagePage).toContain("redirect('/instructor/messages')")
    expect(newMessagePage).toContain('NewMessageClient')
  })

  it('preserves safe demo messaging separately from production runtime', () => {
    expect(instructorPage).toContain('InstructorMessageDashboard')
    expect(instructorPage).toContain('getDemoNotificationsForUser')
    expect(studentPage).toContain('MessageCenter')
    expect(studentPage).toContain('getDemoNotificationsForUser')
  })

  it('does not add realtime, group messaging, or bulletin behavior in this slice', () => {
    expect(center).not.toContain('.channel(')
    expect(center).not.toContain('realtime')
    expect(center).not.toContain('recipientIds')
    expect(center).not.toContain('bulletin')
  })
})
