import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Profile } from '@/types'
import { getDemoNotificationsForUser } from '@/lib/demo-data'
import { isExplicitDemoMode, isSupabaseConfigured } from '@/lib/demo-helpers'
import MessageCenter from '@/components/messaging/MessageCenter'
import ProductionMessagingPlaceholder from '@/components/messaging/ProductionMessagingPlaceholder'

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

  // Phase 13C.1: messaging is only functional in explicit safe demo mode.
  // In production (Supabase configured), show a disabled/coming-soon state
  // instead of fake demo threads and notifications.
  const demoMode = isExplicitDemoMode()
  const supabaseConfigured = isSupabaseConfigured()
  const isSafeDemo = demoMode && !supabaseConfigured

  if (!isSafeDemo) {
    return <ProductionMessagingPlaceholder title="Messages" backHref="/dashboard" backLabel="Back to Dashboard" />
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
