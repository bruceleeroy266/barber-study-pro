import { createClient } from '@/lib/supabase-server'
import { validateLoginAccess } from '@/lib/auth-access'

/**
 * A JWT remains valid after the underlying account is disabled. Service-role
 * evidence APIs must recheck the caller's current database profile before
 * performing any privileged read or write.
 */
export async function canRecordAcademicEvidence(
  sessionClient: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<boolean> {
  const { data: actor, error } = await sessionClient
    .from('profiles')
    .select('role, school_id, approval_status, is_disabled, requires_password_change')
    .eq('id', userId)
    .maybeSingle()

  return !error && !!actor &&
    validateLoginAccess(actor).ok &&
    ['student', 'apprentice'].includes(actor.role) &&
    actor.is_disabled === false &&
    actor.requires_password_change === false &&
    !!actor.school_id
}
