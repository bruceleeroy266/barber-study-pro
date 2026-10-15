import 'server-only'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase-server'
import { isPlatformAdminProfile } from '@/lib/auth-helpers'
import { logSecurityEvent } from '@/lib/security/audit-logger'

export const SUPPORT_ACCESS_COOKIE = 'ascyn_support_target'
const SUPPORT_MAX_AGE_SECONDS = 60 * 60 * 4

export type SupportRole = 'instructor' | 'school_admin' | 'admin'

export interface SupportProfile {
  id: string
  email: string | null
  full_name: string | null
  role: string
  school_id: string | null
  approval_status: string | null
  is_disabled: boolean | null
}

export interface SupportAccessContext {
  actorUserId: string
  actorEmail: string | null
  actorProfile: SupportProfile
  effectiveProfile: SupportProfile
  supportActive: boolean
  targetProfile: SupportProfile | null
}

function isSupportRole(role: string | null | undefined): role is SupportRole {
  return role === 'instructor' || role === 'school_admin' || role === 'admin'
}

export async function resolveSupportAccessContext(): Promise<SupportAccessContext | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: actor } = await supabase
    .from('profiles')
    .select('id,email,full_name,role,school_id,approval_status,is_disabled')
    .eq('id', user.id)
    .single()

  if (!actor) return null

  const actorProfile = actor as SupportProfile
  const cookieStore = await cookies()
  const targetId = cookieStore.get(SUPPORT_ACCESS_COOKIE)?.value ?? null

  if (!targetId || !isPlatformAdminProfile(actorProfile)) {
    return {
      actorUserId: user.id,
      actorEmail: user.email ?? actorProfile.email ?? null,
      actorProfile,
      effectiveProfile: actorProfile,
      supportActive: false,
      targetProfile: null,
    }
  }

  const { data: target } = await supabase
    .from('profiles')
    .select('id,email,full_name,role,school_id,approval_status,is_disabled')
    .eq('id', targetId)
    .maybeSingle()

  const targetProfile = target as SupportProfile | null
  const validTarget = Boolean(
    targetProfile &&
    isSupportRole(targetProfile.role) &&
    targetProfile.school_id &&
    targetProfile.approval_status === 'approved' &&
    targetProfile.is_disabled !== true
  )

  if (!validTarget || !targetProfile) {
    await logSecurityEvent('support_access', 'blocked', 'Invalid or unavailable support target', {
      userId: user.id,
      email: user.email,
      role: actorProfile.role,
      resource: 'support_access',
      action: 'resolve_context',
      metadata: { requestedTargetId: targetId },
    })
    return {
      actorUserId: user.id,
      actorEmail: user.email ?? actorProfile.email ?? null,
      actorProfile,
      effectiveProfile: actorProfile,
      supportActive: false,
      targetProfile: null,
    }
  }

  await logSecurityEvent('support_access', 'allowed', 'Platform admin support context resolved', {
    userId: user.id,
    email: user.email ?? actorProfile.email,
    role: actorProfile.role,
    schoolId: targetProfile.school_id,
    resource: 'support_access',
    resourceId: targetProfile.id,
    action: 'resolve_context',
    metadata: {
      trueActorId: user.id,
      targetProfileId: targetProfile.id,
      targetRole: targetProfile.role,
      targetEmail: targetProfile.email,
    },
  })

  return {
    actorUserId: user.id,
    actorEmail: user.email ?? actorProfile.email ?? null,
    actorProfile,
    effectiveProfile: targetProfile,
    supportActive: true,
    targetProfile,
  }
}

export async function startSupportAccess(targetProfileId: string): Promise<{ ok: boolean; route?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Authentication required.' }

  const { data: actor } = await supabase
    .from('profiles')
    .select('id,email,full_name,role,school_id,approval_status,is_disabled')
    .eq('id', user.id)
    .maybeSingle()

  if (!actor || !isPlatformAdminProfile(actor as SupportProfile)) {
    await logSecurityEvent('support_access', 'denied', 'Non-platform-admin attempted support mode', {
      userId: user.id,
      email: user.email,
      role: actor?.role ?? null,
      resource: 'support_access',
      action: 'start',
    })
    return { ok: false, error: 'Platform administrator access required.' }
  }

  const { data: target } = await supabase
    .from('profiles')
    .select('id,email,full_name,role,school_id,approval_status,is_disabled')
    .eq('id', targetProfileId)
    .maybeSingle()

  const targetProfile = target as SupportProfile | null
  if (
    !targetProfile ||
    !isSupportRole(targetProfile.role) ||
    !targetProfile.school_id ||
    targetProfile.approval_status !== 'approved' ||
    targetProfile.is_disabled === true
  ) {
    return { ok: false, error: 'That support target is not available.' }
  }

  const cookieStore = await cookies()
  cookieStore.set(SUPPORT_ACCESS_COOKIE, targetProfile.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SUPPORT_MAX_AGE_SECONDS,
  })

  await logSecurityEvent('support_access', 'success', 'Platform admin support mode started', {
    userId: user.id,
    email: user.email ?? actor.email,
    role: actor.role,
    schoolId: targetProfile.school_id,
    resource: 'support_access',
    resourceId: targetProfile.id,
    action: 'start',
    metadata: {
      trueActorId: user.id,
      targetProfileId: targetProfile.id,
      targetRole: targetProfile.role,
      targetEmail: targetProfile.email,
    },
  })

  return {
    ok: true,
    route: targetProfile.role === 'instructor' ? '/instructor' : '/school',
  }
}

export async function stopSupportAccess(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const cookieStore = await cookies()
  const targetId = cookieStore.get(SUPPORT_ACCESS_COOKIE)?.value ?? null
  cookieStore.delete(SUPPORT_ACCESS_COOKIE)

  if (user) {
    await logSecurityEvent('support_access', 'success', 'Platform admin support mode ended', {
      userId: user.id,
      email: user.email,
      resource: 'support_access',
      resourceId: targetId ?? undefined,
      action: 'stop',
    })
  }
}

export async function logSupportAction(
  context: SupportAccessContext | null,
  action: string,
  resource: string,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  if (!context?.supportActive || !context.targetProfile) return

  await logSecurityEvent('support_access', 'success', 'Support-mode action executed', {
    userId: context.actorUserId,
    email: context.actorEmail,
    role: context.actorProfile.role,
    schoolId: context.targetProfile.school_id,
    resource,
    resourceId: context.targetProfile.id,
    action,
    metadata: {
      ...metadata,
      trueActorId: context.actorUserId,
      targetProfileId: context.targetProfile.id,
      targetRole: context.targetProfile.role,
      targetEmail: context.targetProfile.email,
    },
  })
}
