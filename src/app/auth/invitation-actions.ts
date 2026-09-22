'use server'

import { createClient } from '@/lib/supabase-server'
import { createServiceRoleClient } from '@/lib/supabase-service-role'

export interface InvitationAcceptanceResult {
  success: boolean
  tracked?: boolean
  error?: string
}

const TRACKED_ROLES = new Set(['school_admin', 'instructor', 'student'])

export async function markCurrentInvitationAccepted(): Promise<InvitationAcceptanceResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const serviceClient = createServiceRoleClient()
  const { data: profile, error: profileError } = await serviceClient
    .from('profiles')
    .select('id, email, role, school_id')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { success: false, error: 'Account profile could not be verified.' }
  }

  const role = String(profile.role)
  const schoolId = profile.school_id ? String(profile.school_id) : null
  const email = String(profile.email || user.email || '').toLowerCase().trim()

  // Some account types (platform admin/apprentice) do not use the school
  // invitation lifecycle table. Their password setup should still succeed.
  if (!schoolId || !email || !TRACKED_ROLES.has(role)) {
    return { success: true, tracked: false }
  }

  const { data: invitation, error: invitationError } = await serviceClient
    .from('school_onboarding_invitations')
    .select('id, status, auth_user_id')
    .eq('school_id', schoolId)
    .eq('email', email)
    .eq('role', role)
    .maybeSingle()

  if (invitationError) {
    return { success: false, error: `Invitation lifecycle lookup failed: ${invitationError.message}` }
  }

  // Accounts created before lifecycle tracking may have no row. Do not block
  // successful password setup; simply report that there was nothing to close.
  if (!invitation) {
    return { success: true, tracked: false }
  }

  if (invitation.status === 'accepted') {
    return { success: true, tracked: true }
  }

  if (invitation.status === 'revoked') {
    return { success: false, error: 'This invitation has been revoked. Ask your administrator for a new setup link.' }
  }

  const now = new Date().toISOString()
  const { error: updateError } = await serviceClient
    .from('school_onboarding_invitations')
    .update({
      auth_user_id: user.id,
      status: 'accepted',
      accepted_at: now,
      updated_at: now,
    })
    .eq('id', invitation.id)
    .eq('status', 'pending')

  if (updateError) {
    return { success: false, error: `Failed to complete invitation lifecycle: ${updateError.message}` }
  }

  return { success: true, tracked: true }
}
