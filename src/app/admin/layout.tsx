import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import AdminNav from '@/components/AdminNav'

// Admin pages require an authenticated admin/school_admin user, so they must
// be rendered dynamically at request time. Static generation would call
// createClient() without a user session and fail when Supabase env vars are missing.
export const dynamic = 'force-dynamic'

export default async function AdminLayout({
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

  if (!profile || !(isAdmin(profile.role) || isSchoolAdmin(profile.role))) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <AdminNav user={profile} />
      <main className="flex-1 min-w-0 lg:pl-64">
        {/* Mobile top spacing for the fixed header */}
        <div className="lg:hidden h-14" />
        {children}
      </main>
    </div>
  )
}
