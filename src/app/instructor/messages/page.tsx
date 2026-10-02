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
import ProductionMessagingPlaceholder from '@/components/messaging/ProductionMessagingPlaceholder'
import BackButton from '@/components/ui/BackButton'
import { loadCommunicationThreads } from '@/app/communications/actions'

interface PersonRow {
  id: string
  full_name: string
  role: string
}

interface AssignmentRow {
  student_id: string
}

export default async function InstructorMessagesPage() {
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

  if (!profile || !isInstructorOrAdmin(profile.role)) {
    redirect('/dashboard')
  }

  if (!profile.school_id) {
    redirect('/dashboard')
  }

  const instructorProfile = profile as Profile
  const demoMode = isExplicitDemoMode()
  const supabaseConfigured = isSupabaseConfigured()
  const isSafeDemo = demoMode && !supabaseConfigured

  if (!isSafeDemo) {
    // COM-1A explicitly keeps private thread access participant-only.
    // Admin roles retain their existing route but do not gain private-message browsing.
    if (instructorProfile.role !== 'instructor') {
      return (
        <ProductionMessagingPlaceholder
          title="Instructor Messaging"
          backHref="/instructor"
          backLabel="Back to Instructor Dashboard"
        />
      )
    }

    const threadsResult = await loadCommunicationThreads()
    const initialThreads = threadsResult.success ? threadsResult.data : []

    const { data: assignmentRows } = await supabase
      .from('student_instructor_assignments')
      .select('student_id')
      .eq('school_id', instructorProfile.school_id)
      .eq('instructor_id', user.id)
      .eq('is_active', true)
      .is('ended_at', null)

    const assignedStudentIds = (assignmentRows || []).map(
      (assignment: AssignmentRow) => assignment.student_id
    )

    const participantIds = Array.from(
      new Set([
        ...assignedStudentIds,
        ...initialThreads.flatMap((thread) => [thread.studentId, thread.instructorId]),
      ])
    ).filter((id) => id !== user.id)

    let peopleRows: PersonRow[] = []
    if (participantIds.length > 0) {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('school_id', instructorProfile.school_id)
        .in('id', participantIds)

      peopleRows = (data || []) as PersonRow[]
    }

    const people: ProductionMessagingPerson[] = peopleRows
      .filter((person) =>
        ['student', 'apprentice', 'instructor'].includes(person.role)
      )
      .map((person) => ({
        id: person.id,
        name: person.full_name,
        role: person.role as ProductionMessagingPerson['role'],
      }))

    const assignedSet = new Set(assignedStudentIds)
    const availableCounterparts = people.filter((person) =>
      assignedSet.has(person.id)
    )

    return (
      <div className="min-h-screen bg-[var(--color-background-primary)] p-6 md:p-8">
        <BackButton
          fallbackHref="/instructor"
          label="Back to instructor dashboard"
        />
        <div className="max-w-7xl mx-auto mt-6">
          <ProductionMessageCenter
            currentUserId={user.id}
            currentUserName={instructorProfile.full_name}
            currentUserRole="instructor"
            initialThreads={initialThreads}
            people={people}
            availableCounterparts={availableCounterparts}
            title="Instructor Messaging"
            subtitle="Private conversations with your assigned students."
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

  const demoNotifications = getDemoNotificationsForUser(user.id)

  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] p-6 md:p-8">
      <BackButton
        fallbackHref="/instructor"
        label="Back to instructor dashboard"
      />
      <div className="max-w-7xl mx-auto mt-6">
        <InstructorMessageDashboard
          instructorId={user.id}
          instructorName={instructorProfile.full_name}
          instructorRole={instructorProfile.role}
          initialNotifications={demoNotifications}
          students={rosterStudents}
        />
      </div>
    </div>
  )
}
