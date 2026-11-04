import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Profile } from '@/types'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import {
  demoStudents,
  getDemoNotificationsForUser,
} from '@/lib/demo-data'
import { isExplicitDemoMode, isSupabaseConfigured } from '@/lib/demo-helpers'
import InstructorMessageDashboard from '@/components/messaging/InstructorMessageDashboard'
import ProductionMessageCenter, {
  type ProductionMessagingPerson,
} from '@/components/messaging/ProductionMessageCenter'
import BackButton from '@/components/ui/BackButton'
import { loadCommunicationThreads } from '@/app/communications/actions'
import { resolveAuthorizedMessagingRecipients } from '@/lib/communications/authorized-recipients'
import { resolveSupportAccessContext } from '@/lib/support-access'

interface PersonRow {
  id: string
  full_name: string
  role: Profile['role']
  school_id: string | null
  approval_status: string | null
  is_disabled: boolean | null
}

interface AssignmentRow {
  student_id: string
  instructor_id: string
  school_id: string
  is_active: boolean
  ended_at: string | null
}

export default async function InstructorMessagesPage() {
  const supabase = await createClient()
  const context = await resolveSupportAccessContext()
  if (!context) redirect('/login')

  const profile = context.effectiveProfile
  if (!isInstructorOrAdmin(profile.role)) {
    redirect(context.supportActive ? '/admin/support-access' : '/dashboard')
  }

  if (!profile.school_id) {
    redirect(context.supportActive ? '/admin/support-access' : '/dashboard')
  }

  const instructorProfile = profile as unknown as Profile
  const effectiveUserId = profile.id
  const demoMode = isExplicitDemoMode()
  const supabaseConfigured = isSupabaseConfigured()
  const isSafeDemo = demoMode && !supabaseConfigured

  if (!isSafeDemo) {
    const threadsResult = await loadCommunicationThreads()
    const initialThreads = threadsResult.success ? threadsResult.data : []

    const { data: peopleData } = await supabase
      .from('profiles')
      .select('id, full_name, role, school_id, approval_status, is_disabled')
      .eq('school_id', instructorProfile.school_id)
      .neq('id', effectiveUserId)

    const { data: assignmentData } = await supabase
      .from('student_instructor_assignments')
      .select('student_id, instructor_id, school_id, is_active, ended_at')
      .eq('school_id', instructorProfile.school_id)
      .eq('is_active', true)
      .is('ended_at', null)

    const peopleRows = (peopleData || []) as PersonRow[]
    const assignmentRows = (assignmentData || []) as AssignmentRow[]

    const authorizedRecipients = resolveAuthorizedMessagingRecipients(
      {
        id: effectiveUserId,
        role: instructorProfile.role,
        schoolId: instructorProfile.school_id,
        approvalStatus: instructorProfile.approval_status,
        isDisabled: instructorProfile.is_disabled,
      },
      peopleRows.map((person) => ({
        id: person.id,
        fullName: person.full_name,
        role: person.role,
        schoolId: person.school_id,
        approvalStatus: person.approval_status,
        isDisabled: person.is_disabled,
      })),
      assignmentRows.map((assignment) => ({
        studentId: assignment.student_id,
        instructorId: assignment.instructor_id,
        schoolId: assignment.school_id,
        isActive: assignment.is_active,
        endedAt: assignment.ended_at,
      }))
    )

    const people: ProductionMessagingPerson[] = peopleRows
      .filter((person) =>
        ['student', 'apprentice', 'instructor', 'school_admin', 'admin'].includes(
          person.role
        )
      )
      .map((person) => ({
        id: person.id,
        name: person.full_name,
        role: person.role as ProductionMessagingPerson['role'],
      }))

    const authorizedIds = new Set(
      authorizedRecipients.map((recipient) => recipient.id)
    )
    const availableCounterparts = people.filter((person) =>
      authorizedIds.has(person.id)
    )

    const adminLike =
      instructorProfile.role === 'school_admin' || instructorProfile.role === 'admin'

    return (
      <div className="min-h-screen bg-[var(--color-background-primary)] p-6 md:p-8">
        <BackButton
          fallbackHref={adminLike ? '/admin' : '/instructor'}
          label={adminLike ? 'Back to admin dashboard' : 'Back to instructor dashboard'}
        />
        <div className="max-w-7xl mx-auto mt-6">
          <ProductionMessageCenter
            currentUserId={effectiveUserId}
            currentUserName={instructorProfile.full_name}
            currentUserRole={instructorProfile.role as ProductionMessagingPerson['role']}
            initialThreads={initialThreads}
            people={people}
            availableCounterparts={availableCounterparts}
            title={adminLike ? 'School Messaging' : 'Instructor Messaging'}
            subtitle={
              adminLike
                ? 'Private conversations with authorized students and instructors at your school.'
                : 'Private conversations with assigned students and your school administrators.'
            }
          />
        </div>
      </div>
    )
  }

  // Safe demo path remains unchanged.
  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('school_id', instructorProfile.school_id)
    .in('role', ['student', 'apprentice'])

  let rosterStudents: Profile[] = (students as Profile[]) || []
  if (rosterStudents.length === 0) {
    rosterStudents = demoStudents.filter(
      (student) =>
        student.school_id === instructorProfile.school_id ||
        !instructorProfile.school_id
    )
  }

  const demoNotifications = getDemoNotificationsForUser(effectiveUserId)

  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] p-6 md:p-8">
      <BackButton
        fallbackHref="/instructor"
        label="Back to instructor dashboard"
      />
      <div className="max-w-7xl mx-auto mt-6">
        <InstructorMessageDashboard
          instructorId={effectiveUserId}
          instructorName={instructorProfile.full_name}
          instructorRole={instructorProfile.role}
          initialNotifications={demoNotifications}
          students={rosterStudents}
        />
      </div>
    </div>
  )
}
