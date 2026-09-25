import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/DashboardNav'
import { BETA_AGREEMENT_VERSION } from '@/lib/beta'
import { isInstructorOrAdmin, isLearner } from '@/lib/auth-helpers'
import { getRoleBasedRedirect } from '@/lib/auth-access'
import BackButtonPrevention from '@/components/auth/BackButtonPrevention'
import StudyActivityTracker from '@/components/StudyActivityTracker'

// All dashboard pages require an authenticated user, so they must be rendered
// dynamically at request time. Static generation would call createClient()
// without a user session and fail when Supabase env vars are missing.
export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  // The /dashboard subtree is learner-only. Keep staff roles inside their
  // canonical portals even when they navigate directly to a nested student route.
  if (profile?.role && !isLearner(profile.role)) {
    redirect(getRoleBasedRedirect(profile.role))
  }

  // ── BETA AGREEMENT FALLBACK ENFORCEMENT ──
  // Students and apprentices must accept the current beta agreement before
  // accessing any dashboard page. Admins and instructors are exempt.
  if (profile && !isInstructorOrAdmin(profile.role)) {
    const { data: agreement } = await supabase
      .from('beta_agreements')
      .select('id')
      .eq('user_id', user.id)
      .eq('agreement_version', BETA_AGREEMENT_VERSION)
      .maybeSingle()

    if (!agreement) {
      redirect('/beta-agreement')
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <BackButtonPrevention />
      <StudyActivityTracker />
      <DashboardNav user={profile} />
      <main id="main-content" className="lg:pl-64 min-h-screen">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
