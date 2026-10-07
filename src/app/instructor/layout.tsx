import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import BackButtonPrevention from '@/components/auth/BackButtonPrevention'
import InstructorNav from '@/components/InstructorNav'
import SupportModeBanner from '@/components/support/SupportModeBanner'
import { resolveSupportAccessContext } from '@/lib/support-access'

export const dynamic = 'force-dynamic'

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const context = await resolveSupportAccessContext()
  if (!context) redirect('/login')

  const profile = context.effectiveProfile
  if (!isInstructorOrAdmin(profile.role)) {
    redirect(context.supportActive ? '/admin/support-access' : '/dashboard')
  }

  let schoolName: string | null = null
  if (context.supportActive && profile.school_id) {
    const supabase = await createClient()
    const { data: school } = await supabase.from('schools').select('name').eq('id', profile.school_id).maybeSingle()
    schoolName = school?.name ?? null
  }

  return (
    <div className="min-h-screen bg-black">
      <BackButtonPrevention />
      {context.supportActive && context.targetProfile && (
        <SupportModeBanner
          actorEmail={context.actorEmail}
          targetName={context.targetProfile.full_name}
          targetEmail={context.targetProfile.email}
          targetRole={context.targetProfile.role}
          schoolName={schoolName}
        />
      )}
      <InstructorNav user={{ role: profile.role }} />
      <main id="main-content" className="min-h-screen pt-16 lg:pl-64 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
