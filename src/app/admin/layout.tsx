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

  const actorProfile = context.actorProfile
  const effectiveProfile = context.effectiveProfile

  if (!(isAdmin(actorProfile.role) || isSchoolAdmin(actorProfile.role))) {
    redirect('/dashboard')
  }

  const navProfile =
    isAdmin(effectiveProfile.role) || isSchoolAdmin(effectiveProfile.role)
      ? effectiveProfile
      : actorProfile

  let schoolName: string | null = null
  if (context.supportActive && effectiveProfile.school_id) {
    const supabase = await createClient()
    const { data: school } = await supabase.from('schools').select('name').eq('id', effectiveProfile.school_id).maybeSingle()
    schoolName = school?.name ?? null
  }

  return (
    <div className="min-h-screen bg-black flex">
      <BackButtonPrevention />
      <AdminNav user={navProfile as any} />
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
