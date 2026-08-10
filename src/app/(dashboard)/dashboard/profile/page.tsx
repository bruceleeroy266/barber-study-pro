import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Phase 4 Design System Components
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Query profile WITHOUT school join — school_id may be NULL
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Optionally fetch school name separately if school_id exists
  let schoolName: string | null = null
  if (profile?.school_id) {
    const { data: school } = await supabase
      .from('schools')
      .select('name')
      .eq('id', profile.school_id)
      .single()
    if (school) {
      schoolName = school.name
    }
  }

  // Fallbacks for display
  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Not set'
  const displayEmail = profile?.email || user?.email || 'Not set'
  const displayRole = profile?.role || 'student'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Account Information</h2>
            </div>
            
            <Card variant="default" padding="lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Full Name</label>
                  <div className="px-4 py-3 bg-[var(--color-background-secondary)] rounded-lg text-white">
                    {displayName}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Email Address</label>
                  <div className="px-4 py-3 bg-[var(--color-background-secondary)] rounded-lg text-white">
                    {displayEmail}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Role</label>
                  <Badge variant="gold" size="md" className="capitalize">
                    {displayRole}
                  </Badge>
                </div>

                {schoolName && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">School</label>
                    <div className="px-4 py-3 bg-[var(--color-background-secondary)] rounded-lg text-white">
                      {schoolName}
                    </div>
                  </div>
                )}

                {profile?.barber_shop_name && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Barber Shop</label>
                    <div className="px-4 py-3 bg-[var(--color-background-secondary)] rounded-lg text-white">
                      {profile.barber_shop_name}
                    </div>
                  </div>
                )}

                {profile?.mentor_name && (
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Mentor</label>
                    <div className="px-4 py-3 bg-[var(--color-background-secondary)] rounded-lg text-white">
                      {profile.mentor_name}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Account Stats</h2>
            </div>
            
            <Card variant="default" padding="lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--color-background-secondary)] rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--color-brand-gold)]">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : '—'}
                  </div>
                  <div className="text-sm text-[var(--color-text-muted)]">Member Since</div>
                </div>

                <div className="p-4 bg-[var(--color-background-secondary)] rounded-lg text-center">
                  <div className="text-2xl font-bold text-silver">
                    {profile?.updated_at
                      ? new Date(profile.updated_at).toLocaleDateString()
                      : '—'}
                  </div>
                  <div className="text-sm text-[var(--color-text-muted)]">Last Updated</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
            </div>
            
            <Card variant="default" padding="md">
              <div className="space-y-3">
                <Link
                  href="/update-password"
                  className="block w-full text-center px-4 py-3 bg-[var(--color-background-secondary)] text-white rounded-lg hover:bg-[var(--color-border-secondary)] transition-colors"
                >
                  Change Password
                </Link>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Need Help?</h2>
            </div>
            
            <Card variant="default" padding="md">
              <p className="text-[var(--color-text-muted)] text-sm">
                Contact your instructor or school administrator for assistance with your account.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
