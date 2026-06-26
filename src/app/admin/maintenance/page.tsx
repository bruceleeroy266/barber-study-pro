import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth-helpers'
import { hasPermission } from '@/lib/security/permissions'
import { getMaintenanceMode } from '@/lib/maintenance/maintenance-mode'
import MaintenanceModePanel from '@/components/admin/maintenance/MaintenanceModePanel'

export default async function MaintenancePage() {
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

  if (!profile || !isAdmin(profile.role)) {
    redirect('/dashboard')
  }

  if (!hasPermission(profile.role, 'manage_platform')) {
    redirect('/admin')
  }

  const { state } = await getMaintenanceMode()

  return (
    <div className="min-h-screen bg-gray-950 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <MaintenanceModePanel initialState={state} />
      </div>
    </div>
  )
}
