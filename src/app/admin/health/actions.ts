'use server'

import { createClient } from '@/lib/supabase-server'
import { validateLoginAccess } from '@/lib/auth-access'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth-helpers'
import { runDiagnostics } from '@/lib/diagnostics/diagnostics'

export async function refreshDiagnostics() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, approval_status, is_disabled')
    .eq('id', user.id)
    .single()

  if (!profile || !validateLoginAccess(profile).ok || !isAdmin(profile.role)) {
    redirect('/dashboard')
  }

  return runDiagnostics()
}
