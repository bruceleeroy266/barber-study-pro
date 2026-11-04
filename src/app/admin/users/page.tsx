import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin, isSchoolAdmin, isPlatformAdminProfile } from '@/lib/auth-helpers'
import { getUsers, getSchools } from './actions'
import { UserManagementClient } from './UserManagementClient'
import BackButton from '@/components/ui/BackButton'
import { resolveSupportAccessContext } from '@/lib/support-access'

export const metadata = {
  title: 'User Management | ASCYN PRO Admin',
}

interface UserManagementPageProps {
  searchParams: Promise<{ setup?: string }>
}

export default async function UserManagementPage({ searchParams }: UserManagementPageProps) {
  const context = await resolveSupportAccessContext()
  if (!context) redirect('/login')

  const profile = context.effectiveProfile
  if (!(isAdmin(profile.role) || isSchoolAdmin(profile.role))) {
    redirect(context.supportActive ? '/admin/support-access' : '/dashboard')
  }

  const isPlatformAdmin = context.supportActive ? false : isPlatformAdminProfile(profile)
  const { setup } = await searchParams
  const initialUsers = await getUsers({ limit: 50 })
  const initialSchools = await getSchools()

  return (
    <div className="min-h-screen bg-black p-6 lg:p-8">
        <BackButton fallbackHref="/admin" label="Back to admin dashboard" />
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-silver">
            {isPlatformAdmin
              ? 'Manage platform users, roles, and approvals'
              : 'Manage users in your school'}
          </p>
        </div>

        <UserManagementClient
          currentUser={{
            id: profile.id,
            role: profile.role,
            schoolId: profile.school_id,
            isPlatformAdmin,
          }}
          initialUsers={initialUsers.success ? initialUsers.data?.users ?? [] : []}
          initialCount={initialUsers.success ? initialUsers.data?.count ?? 0 : 0}
          schools={initialSchools.success ? initialSchools.data ?? [] : []}
          error={!initialUsers.success ? initialUsers.error : undefined}
          setupMode={setup ?? null}
        />
      </div>
    </div>
  )
}
