import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import { getUsers, getSchools } from './actions'
import { UserManagementClient } from './UserManagementClient'
import BackButton from '@/components/ui/BackButton'

export const metadata = {
  title: 'User Management | ASCYN PRO Admin',
}

export default async function UserManagementPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || !(isAdmin(profile.role) || isSchoolAdmin(profile.role))) {
    redirect('/dashboard')
  }

  const isPlatformAdmin = isAdmin(profile.role)
  const initialUsers = await getUsers({ limit: 50 })
  const initialSchools = await getSchools()

  return (
    <div className="min-h-screen bg-gray-950 p-6 lg:p-8">
        <BackButton fallbackHref="/admin" label="Back to admin dashboard" />
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">
            {isPlatformAdmin
              ? 'Manage platform users, roles, and approvals'
              : 'Manage users in your school'}
          </p>
        </div>

        <UserManagementClient
          currentUser={{
            id: user.id,
            role: profile.role,
            schoolId: profile.school_id,
            isPlatformAdmin,
          }}
          initialUsers={initialUsers.success ? initialUsers.data?.users ?? [] : []}
          initialCount={initialUsers.success ? initialUsers.data?.count ?? 0 : 0}
          schools={initialSchools.success ? initialSchools.data ?? [] : []}
          error={!initialUsers.success ? initialUsers.error : undefined}
        />
      </div>
    </div>
  )
}
