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

interface PersonRow {
  id: string
  full_name: string
  role: string
}

interface AssignmentRow {
  instructor_id: string
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

    const { data: assignmentRows } = await supabase
      .from('student_instructor_assignments')
      .select('instructor_id')
      .eq('school_id', studentProfile.school_id)
      .eq('student_id', user.id)
      .eq('is_active', true)
      .is('ended_at', null)

    const assignedInstructorIds = (assignmentRows || []).map(
      (assignment: AssignmentRow) => assignment.instructor_id
    )

    const participantIds = Array.from(
      new Set([
        ...assignedInstructorIds,
        ...initialThreads.flatMap((thread) => [
          thread.participantOneId,
          thread.participantTwoId,
        ]),
      ])
    ).filter((id) => id !== user.id)

    let peopleRows: PersonRow[] = []
    if (participantIds.length > 0) {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('school_id', studentProfile.school_id)
        .in('id', participantIds)

      peopleRows = (data || []) as PersonRow[]
    }

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

    const assignedSet = new Set(assignedInstructorIds)
    const availableCounterparts = people.filter((person) =>
      assignedSet.has(person.id)
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
          subtitle="Private conversations with your assigned instructor."
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
