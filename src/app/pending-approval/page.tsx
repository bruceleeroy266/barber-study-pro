import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// This page requires an authenticated user, so it must be rendered dynamically.
export const dynamic = 'force-dynamic'

export default async function PendingApprovalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  // Only instructors can be in a pending-approval state. Everyone else routes
  // to their normal dashboard.
  if (!profile || profile.role !== 'instructor') {
    redirect('/dashboard')
  }

  let schoolActive = false
  if (profile.school_id) {
    const { data: school } = await supabase
      .from('schools')
      .select('is_active')
      .eq('id', profile.school_id)
      .single()
    schoolActive = school?.is_active ?? false
  }

  // School is active → instructor has been approved.
  if (schoolActive) {
    redirect('/instructor')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="bg-charcoal/80 backdrop-blur-sm border border-graphite rounded-2xl p-8 shadow-2xl max-w-md w-full text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-white mb-4">
          Account Pending Approval
        </h1>
        <p className="text-silver mb-6">
          Your instructor account and school have been submitted for administrator
          review. You will receive an email once your school is activated.
        </p>
        <p className="text-sm text-silver-gray mb-6">
          If you believe this is an error, please contact your platform
          administrator.
        </p>
        <Link
          href="/login"
          className="inline-block py-3 px-6 bg-graphite text-white font-semibold rounded-lg hover:bg-[var(--color-border-secondary)] transition-all duration-200 border border-silver-gray"
        >
          Go to Login
        </Link>
      </div>
    </div>
  )
}
