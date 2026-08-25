// School admin pages require an authenticated school_admin/admin user, so they
// must be rendered dynamically at request time. Static generation would call
// createClient() without a user session and fail when Supabase env vars are missing.
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import Link from 'next/link'
import { Logo } from '@/components/brand'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SchoolLayout({
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
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || !(isAdmin(profile.role) || isSchoolAdmin(profile.role))) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur-sm border-b border-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-silver hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-graphite" />
              <Link href="/school" className="flex items-center">
                <Logo variant="compact" size="md" className="lg:hidden" />
                <Logo variant="full" size="3xl" className="hidden lg:block" />
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-silver hidden sm:block">
                {profile.full_name || 'School Admin'}
              </span>
              <span className="px-2 py-1 bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] text-xs rounded capitalize">
                {profile.role}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}
