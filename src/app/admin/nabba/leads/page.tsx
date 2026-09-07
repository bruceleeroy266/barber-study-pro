import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import LeadDashboard from '@/components/nabba/LeadDashboard'

export const metadata = {
  title: 'NABBA 2026 Leads | ASCYN PRO',
}

export default async function NabbaLeadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // ── AUTHORIZATION: admin or school_admin only ──
  if (!profile || !(isAdmin(profile.role) || isSchoolAdmin(profile.role))) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] text-white">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-charcoal/95 backdrop-blur-sm border-b border-graphite px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">NABBA 2026</h1>
          <span className="text-xs text-silver-gray">Lead Capture</span>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Desktop title */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">NABBA 2026 Leads</h1>
              <p className="text-sm text-silver-gray">Capture and manage conference contacts</p>
            </div>
          </div>

          <LeadDashboard />
        </div>
      </div>
    </div>
  )
}
