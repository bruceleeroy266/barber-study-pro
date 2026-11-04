import { NextResponse } from 'next/server'
import { resolveSupportAccessContext } from '@/lib/support-access'

export async function GET() {
  const context = await resolveSupportAccessContext()
  if (!context) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({
    authenticated: true,
    supportActive: context.supportActive,
    actorUserId: context.actorUserId,
    effectiveProfile: {
      id: context.effectiveProfile.id,
      email: context.effectiveProfile.email,
      full_name: context.effectiveProfile.full_name,
      role: context.effectiveProfile.role,
      school_id: context.effectiveProfile.school_id,
      approval_status: context.effectiveProfile.approval_status,
      is_disabled: context.effectiveProfile.is_disabled,
    },
  })
}
