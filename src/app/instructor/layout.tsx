import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import BackButtonPrevention from '@/components/auth/BackButtonPrevention'
import InstructorNav from '@/components/InstructorNav'

// Instructor pages require an authenticated instructor/admin user, so they must
// be rendered dynamically at request time. Static generation would call
// createClient() without a user session and fail when Supabase env vars are missing.
export const dynamic = 'force-dynamic'

export default async function InstructorLayout({
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
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !isInstructorOrAdmin(profile.role)) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-black">
      <BackButtonPrevention />
      <InstructorNav user={profile} />
      <main id="main-content" className="min-h-screen pt-16 lg:pl-64 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
