'use server'

import { createClient } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/auth-helpers'
import { hasPermission } from '@/lib/security/permissions'
import { setMaintenanceMode } from '@/lib/maintenance/maintenance-mode'

export async function toggleMaintenanceMode(
  enabled: boolean,
  message: string,
  allowedRoles: string[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !isAdmin(profile.role)) {
    return { success: false, error: 'Forbidden' }
  }

  if (!hasPermission(profile.role, 'manage_platform')) {
    return { success: false, error: 'Only platform super admins can manage maintenance mode.' }
  }

  return setMaintenanceMode(enabled, message, allowedRoles)
}
