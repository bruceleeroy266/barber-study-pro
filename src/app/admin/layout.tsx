import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import AdminNav from '@/components/AdminNav'
import BackButtonPrevention from '@/components/auth/BackButtonPrevention'
import SupportModeBanner from '@/components/support/SupportModeBanner'
import { resolveSupportAccessContext } from '@/lib/support-access'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const context = await resolveSupportAccessContext()
  if (!context) redirect('/login')

  const profile = context.effectiveProfile

  // The support hub itself must remain reachable by the real platform admin
  // even if a support target is an instructor. Instructor support routes live
  // under /instructor and do not use this layout after the session starts.
  if (!(isAdmin(profile.role) || isSchoolAdmin(profile.role)) && context.supportActive) {
    redirect('/instructor')
  }
  if (!(isAdmin(profile.role) || isSchoolAdmin(profile.role))) {
    redirect('/dashboard')
  }

  let schoolName: string | null = null
  if (context.supportActive && profile.school_id) {
    const supabase = await createClient()
    const { data: school } = await supabase.from('schools').select('name').eq('id', profile.school_id).maybeSingle()
    schoolName = school?.name ?? null
  }

  return (
    <div className="min-h-screen bg-black flex">
      <BackButtonPrevention />
      <AdminNav user={profile as any} />
      <main id="main-content" className="flex-1 min-w-0 lg:pl-64">
        <div className="lg:hidden h-14" />
        {context.supportActive && context.targetProfile && (
          <SupportModeBanner
            actorEmail={context.actorEmail}
            targetName={context.targetProfile.full_name}
            targetEmail={context.targetProfile.email}
            targetRole={context.targetProfile.role}
            schoolName={schoolName}
          />
        )}
        {children}
      </main>
    </div>
  )
}
