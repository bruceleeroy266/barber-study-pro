import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/DashboardNav'
import { BETA_AGREEMENT_VERSION } from '@/lib/beta'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'

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
    <div className="min-h-screen bg-gray-950">
      <DashboardNav user={profile} />
      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
