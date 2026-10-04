import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Profile } from '@/types'
import { getDemoNotificationsForUser } from '@/lib/demo-data'
import { isExplicitDemoMode, isSupabaseConfigured } from '@/lib/demo-helpers'
import MessageCenter from '@/components/messaging/MessageCenter'
import ProductionMessageCenter, {
  type ProductionMessagingPerson,
} from '@/components/messaging/ProductionMessageCenter'
import { loadCommunicationThreads } from '@/app/communications/actions'
import { resolveAuthorizedMessagingRecipients } from '@/lib/communications/authorized-recipients'

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

export default async function StudentMessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const demoMode = isExplicitDemoMode()
  const supabaseConfigured = isSupabaseConfigured()
  const isSafeDemo = demoMode && !supabaseConfigured

  if (!isSafeDemo) {
    if (
      !profile ||
      !profile.school_id ||
      !['student', 'apprentice'].includes(profile.role)
    ) {
      redirect('/dashboard')
    }

    const studentProfile = profile as Profile
    const threadsResult = await loadCommunicationThreads()
    const initialThreads = threadsResult.success ? threadsResult.data : []

    const { data: peopleData } = await supabase
      .from('profiles')
      .select('id, full_name, role, school_id, approval_status, is_disabled')
      .eq('school_id', studentProfile.school_id)
      .neq('id', user.id)

    const { data: assignmentData } = await supabase
      .from('student_instructor_assignments')
      .select('student_id, instructor_id, school_id, is_active, ended_at')
      .eq('school_id', studentProfile.school_id)
      .eq('student_id', user.id)
      .eq('is_active', true)
      .is('ended_at', null)

    const peopleRows = (peopleData || []) as PersonRow[]
    const assignmentRows = (assignmentData || []) as AssignmentRow[]

    const authorizedRecipients = resolveAuthorizedMessagingRecipients(
      {
        id: user.id,
        role: studentProfile.role,
        schoolId: studentProfile.school_id,
        approvalStatus: studentProfile.approval_status,
        isDisabled: studentProfile.is_disabled,
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

    return (
      <div className="space-y-6">
        <ProductionMessageCenter
          currentUserId={user.id}
          currentUserName={studentProfile.full_name}
          currentUserRole={
            studentProfile.role === 'apprentice' ? 'apprentice' : 'student'
          }
          initialThreads={initialThreads}
          people={people}
          availableCounterparts={availableCounterparts}
          title="Messages"
          subtitle="Private conversations with your assigned instructor and authorized school administrators."
        />
      </div>
    )
  }

  const userProfile = (profile as Profile) || {
    id: user.id,
    email: user.email || '',
    full_name: 'Demo Student',
    role: 'student',
    school_id: null,
    barber_shop_name: null,
    mentor_name: null,
    avatar_url: null,
    approval_status: 'approved',
    is_disabled: false,
    approved_by: null,
    approved_at: null,
    requires_password_change: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const demoNotifications = getDemoNotificationsForUser(user.id)

  return (
    <MessageCenter
      userId={user.id}
      userName={userProfile.full_name}
      userRole={userProfile.role}
      initialNotifications={demoNotifications}
    />
  )
}
