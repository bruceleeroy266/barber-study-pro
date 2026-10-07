import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import Link from 'next/link'
import { Logo } from '@/components/brand'
import { getRoleBasedRedirect } from '@/lib/auth-access'
import SchoolAdminMenu from '@/components/school-owner/SchoolAdminMenu'
import BackButton from '@/components/ui/BackButton'
import SupportModeBanner from '@/components/support/SupportModeBanner'
import { resolveSupportAccessContext } from '@/lib/support-access'

export const dynamic = 'force-dynamic'

export default async function SchoolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const context = await resolveSupportAccessContext()
  if (!context) redirect('/login')

  const profile = context.effectiveProfile
  if (!(isAdmin(profile.role) || isSchoolAdmin(profile.role))) {
    redirect(context.supportActive ? '/admin/support-access' : '/dashboard')
  }

  let schoolName: string | null = null
  if (profile.school_id) {
    const supabase = await createClient()
    const { data: school } = await supabase.from('schools').select('name').eq('id', profile.school_id).maybeSingle()
    schoolName = school?.name ?? null
  }

  const dashboardHref = context.supportActive ? '/admin/support-access' : getRoleBasedRedirect(profile.role)

  return (
    <div className="min-h-screen bg-black">
      {context.supportActive && context.targetProfile && (
        <SupportModeBanner
          actorEmail={context.actorEmail}
          targetName={context.targetProfile.full_name}
          targetEmail={context.targetProfile.email}
          targetRole={context.targetProfile.role}
          schoolName={schoolName}
        />
      )}
      <header className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur-sm border-b border-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center justify-between gap-2 h-16">
            <div className="flex min-w-0 items-center gap-2 sm:gap-4">
              <BackButton fallbackHref={dashboardHref} label="Back" />
              {isSchoolAdmin(profile.role) && <SchoolAdminMenu />}
              <div className="hidden h-6 w-px bg-graphite sm:block" />
              <Link href="/school" className="flex shrink-0 items-center">
                <Logo variant="compact" size="md" className="lg:hidden" />
                <Logo variant="full" size="3xl" className="hidden lg:block" />
              </Link>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <span className="text-sm text-silver hidden sm:block">
                {profile.full_name || 'School Admin'}
              </span>
              <span className="max-w-[7rem] truncate px-2 py-1 bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] text-xs rounded capitalize sm:max-w-none">
                {profile.role}
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="overflow-x-hidden p-3 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}
