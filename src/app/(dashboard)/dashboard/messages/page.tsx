import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Profile } from '@/types'
import { getDemoNotificationsForUser, getDemoThreadsForUser } from '@/lib/demo-data'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import MessageCenter from '@/components/messaging/MessageCenter'

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

  const userProfile = (profile as Profile) || {
    id: user.id,
    email: user.email || '',
    full_name: 'Demo Student',
    role: 'student',
    school_id: null,
    barber_shop_name: null,
    mentor_name: null,
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Demo notifications fallback
  const demoNotifications = isDemoFallbackEnabled()
    ? getDemoNotificationsForUser(user.id)
    : []

  return (
    <MessageCenter
      userId={user.id}
      userName={userProfile.full_name}
      userRole={userProfile.role}
      initialNotifications={demoNotifications}
    />
  )
}
