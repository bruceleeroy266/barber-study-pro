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
import ProductionMessagingPlaceholder from '@/components/messaging/ProductionMessagingPlaceholder'

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

  // Phase 13C.1: messaging is only functional in explicit safe demo mode.
  // In production (Supabase configured), show a disabled/coming-soon state
  // instead of fake demo threads and notifications.
  const demoMode = isExplicitDemoMode()
  const supabaseConfigured = isSupabaseConfigured()
  const isSafeDemo = demoMode && !supabaseConfigured

  if (!isSafeDemo) {
    return (
      <ProductionMessagingPlaceholder
        title="Instructor Messaging"
        backHref="/instructor"
        backLabel="Back to Instructor Dashboard"
      />
    )
  }

  // Demo-only path: load the school roster and demo notifications.
  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('school_id', instructorProfile.school_id)
    .in('role', ['student', 'apprentice'])

  let rosterStudents: Profile[] = (students as Profile[]) || []
  if (rosterStudents.length === 0) {
    rosterStudents = demoStudents.filter(
      (s) => s.school_id === instructorProfile.school_id || !instructorProfile.school_id
    )
  }

  const demoNotifications = getDemoNotificationsForUser(user.id)

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
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
