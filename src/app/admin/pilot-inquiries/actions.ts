'use server'

import { createClient } from '@/lib/supabase-server'
import { createServiceRoleClient } from '@/lib/supabase-service-role'
import { Resend } from 'resend'
import { revalidatePath } from 'next/cache'
import { logSecurityEvent } from '@/lib/security/audit-logger'
import { NotificationService } from '@/lib/notifications/NotificationService'
import type { OwnerNotificationPayload } from '@/lib/notifications/types'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'ASCYN PRO <hello@ascynpro.com>'

export async function sendPilotInquiryReply(
  inquiryId: string,
  subject: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!resend) {
      return { success: false, error: 'Resend is not configured.' }
    }

    if (!subject.trim() || !message.trim()) {
      return { success: false, error: 'Subject and message are required.' }
    }

    const supabase = createServiceRoleClient()

    const { data: inquiry, error: fetchError } = await supabase
      .from('pilot_inquiries')
      .select('id, email, contact_name, school_name')
      .eq('id', inquiryId)
      .single()

    if (fetchError || !inquiry) {
      return { success: false, error: fetchError?.message ?? 'Inquiry not found.' }
    }

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#0a0a0a; color:#ffffff; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="var(--color-brand-black)">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background-color:#111111; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden;">
          <tr>
            <td style="padding:32px 24px; color:#ffffff; font-size:16px; line-height:1.6;">
              <p style="margin:0 0 16px;">Hello ${inquiry.contact_name || 'there'},</p>
              <div style="margin:0 0 16px; white-space:pre-wrap;">${message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
              <p style="margin:24px 0 0; color:#888888; font-size:13px;">
                — The ASCYN PRO Team
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim()

    const text = message

    const { error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: inquiry.email,
      subject,
      html,
      text,
    })

    if (sendError) {
      return { success: false, error: sendError.message }
    }

    const { error: updateError } = await supabase
      .from('pilot_inquiries')
      .update({
        status: 'contacted',
        notes: `Replied on ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}.\nSubject: ${subject}\n\n${message}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', inquiryId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    revalidatePath('/admin/pilot-inquiries')

    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

// ============================================================================
// Phase 7A Slice 2 — Create School from Approved Pilot Inquiry
// ============================================================================

export type CreateSchoolResult = {
  success: boolean
  schoolId?: string
  schoolName?: string
  /** True when the school was created but a downstream side-effect failed. */
  partialSuccess?: boolean
  /** Describes which side-effect failed when partialSuccess is true. */
  sideEffectError?: string
  /** True when the school already existed (idempotent retry). */
  alreadyExisted?: boolean
  error?: string
}

/**
 * Create a school from an approved pilot inquiry.
 *
 * Authorization: independently verifies the caller is a platform admin
 * (role='admin', school_id IS NULL) using the caller's own session.
 * The Slice 1 RPC provides the final database-side authorization boundary.
 *
 * Side-effect model:
 *   1. RPC (transactional) — school, settings, program, inquiry update
 *   2. Invitation (non-transactional) — school_onboarding_invitations record
 *   3. Owner notification (non-transactional) — NotificationService
 *   4. Audit log (non-transactional) — security_logs
 *
 * If the RPC fails, no downstream side-effects execute.
 * If the RPC succeeds but a side-effect fails, the school is preserved
 * and a partial-success state is returned for remediation.
 */
export async function createSchoolFromInquiry(
  inquiryId: string
): Promise<CreateSchoolResult> {
  try {
    // ==========================================================================
    // 1. AUTHENTICATE AND AUTHORIZE THE CALLER (SERVER-SIDE)
    // ==========================================================================
    // Use the caller's own session client — NOT the service-role client —
    // so we evaluate the caller's actual identity and role.
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Authentication required.' }
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, school_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return { success: false, error: 'Profile not found.' }
    }

    // Only platform admins (role='admin', school_id IS NULL) may create schools.
    if (profile.role !== 'admin' || profile.school_id !== null) {
      // Fire-and-forget audit log for the denied attempt.
      void logSecurityEvent('permission_denied', 'denied', 'Non-platform-admin attempted school creation', {
        userId: user.id,
        email: user.email,
        role: profile.role,
        schoolId: profile.school_id,
        resource: '/admin/pilot-inquiries',
        resourceId: inquiryId,
        action: 'create_school',
      })
      return { success: false, error: 'Only platform administrators may create schools.' }
    }

    // ==========================================================================
    // 2. VALIDATE INPUT
    // ==========================================================================
    if (!inquiryId || typeof inquiryId !== 'string' || inquiryId.trim().length === 0) {
      return { success: false, error: 'Inquiry ID is required.' }
    }

    // Validate UUID format to prevent unnecessary database calls.
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(inquiryId.trim())) {
      return { success: false, error: 'Invalid inquiry ID format.' }
    }

    const trimmedInquiryId = inquiryId.trim()

    // ==========================================================================
    // 3. VERIFY INQUIRY STATE (SERVER-SIDE, USING CALLER'S SESSION)
    // ==========================================================================
    // Fetch the inquiry to verify it exists and is approved before calling
    // the RPC. This provides early feedback and avoids unnecessary RPC calls.
    // The RPC itself re-validates everything; this is a UX optimization.
    const { data: inquiry, error: inquiryError } = await supabase
      .from('pilot_inquiries')
      .select('id, school_name, contact_name, email, status, school_id')
      .eq('id', trimmedInquiryId)
      .single()

    if (inquiryError || !inquiry) {
      return { success: false, error: 'Pilot inquiry not found.' }
    }

    if (inquiry.status !== 'approved') {
      return {
        success: false,
        error: `Inquiry must be approved before school creation. Current status: ${inquiry.status}.`,
      }
    }

    // ==========================================================================
    // 4. INVOKE THE SLICE 1 RPC (TRANSACTIONAL)
    // ==========================================================================
    // The RPC handles:
    //   - Platform-admin authorization (defense in depth)
    //   - Inquiry approval re-validation
    //   - Idempotency (returns existing school_id if already created)
    //   - Atomic school + settings + program creation
    //   - Concurrency protection (SELECT FOR UPDATE + UNIQUE constraint)
    //
    // We use the caller's session client so the RPC's auth.uid() returns
    // the actual caller's user ID for authorization.
    const { data: rpcSchoolId, error: rpcError } = await supabase
      .rpc('create_school_from_inquiry', { p_pilot_inquiry_id: trimmedInquiryId })

    if (rpcError) {
      // RPC failure: do NOT invite, do NOT notify, do NOT report success.
      void logSecurityEvent('sensitive_config_change', 'failure', `School creation RPC failed: ${rpcError.message}`, {
        userId: user.id,
        email: user.email,
        role: profile.role,
        resource: '/admin/pilot-inquiries',
        resourceId: trimmedInquiryId,
        action: 'create_school',
        metadata: { rpcError: rpcError.message, inquiryId: trimmedInquiryId },
      })
      return { success: false, error: `School creation failed: ${rpcError.message}` }
    }

    if (!rpcSchoolId) {
      return { success: false, error: 'School creation failed: no school ID returned.' }
    }

    const schoolId = rpcSchoolId as string
    const alreadyExisted = inquiry.school_id === schoolId

    // ==========================================================================
    // 5. CREATE SCHOOL ADMIN INVITATION (NON-TRANSACTIONAL)
    // ==========================================================================
    // Use the service-role client for the invitation insert because:
    //   - The school_onboarding_invitations table has no INSERT policy for
    //     authenticated users (by design from Slice 1).
    //   - The service-role client bypasses RLS for server-side operations.
    //
    // The invitation targets the school returned by the RPC — never a
    // client-supplied school_id.
    let invitationError: string | null = null
    try {
      const serviceClient = createServiceRoleClient()

      // Check for existing invitation to prevent duplicates.
      const { data: existingInvitation } = await serviceClient
        .from('school_onboarding_invitations')
        .select('id')
        .eq('school_id', schoolId)
        .eq('email', inquiry.email)
        .eq('role', 'school_admin')
        .neq('status', 'revoked')
        .maybeSingle()

      if (!existingInvitation) {
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7) // 7-day expiration

        const { error: inviteError } = await serviceClient
          .from('school_onboarding_invitations')
          .insert({
            school_id: schoolId,
            pilot_inquiry_id: trimmedInquiryId,
            invited_by: user.id,
            email: inquiry.email,
            full_name: inquiry.contact_name || inquiry.school_name,
            role: 'school_admin',
            status: 'pending',
            expires_at: expiresAt.toISOString(),
          })

        if (inviteError) {
          // 23505 = unique violation — invitation already exists (race condition)
          if (inviteError.code !== '23505') {
            invitationError = inviteError.message
          }
        }
      }
    } catch (err) {
      invitationError = err instanceof Error ? err.message : String(err)
    }

    // ==========================================================================
    // 6. SEND OWNER NOTIFICATION (NON-TRANSACTIONAL)
    // ==========================================================================
    let notificationError: string | null = null
    try {
      const notificationService = NotificationService.createDefault(resend)
      const notificationPayload: OwnerNotificationPayload = {
        timeSubmitted: new Date().toLocaleString('en-US', {
          timeZone: 'America/Chicago',
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
        schoolName: inquiry.school_name,
        contactName: inquiry.contact_name,
        email: inquiry.email,
        message: alreadyExisted
          ? `School already existed for inquiry ${trimmedInquiryId}. School ID: ${schoolId}`
          : `New school created from pilot inquiry. School: ${inquiry.school_name}. School ID: ${schoolId}`,
      }

      const notificationResult = await notificationService.notifyOwner(
        'school_approval',
        notificationPayload,
        { sourceType: 'pilot_inquiries', sourceId: trimmedInquiryId }
      )

      if (!notificationResult.success && !notificationResult.duplicate) {
        notificationError = notificationResult.error || 'Notification delivery failed'
      }
    } catch (err) {
      notificationError = err instanceof Error ? err.message : String(err)
    }

    // ==========================================================================
    // 7. WRITE AUDIT LOG (NON-TRANSACTIONAL)
    // ==========================================================================
    // Audit logging is fire-and-forget: logSecurityEvent never throws.
    // If the audit event is lost, the operation is still considered
    // successful because the school exists and the audit-logger itself
    // logs the failure to console. This is the defined policy: audit
    // failure does not block school creation but is surfaced in logs.
    void logSecurityEvent(
      'sensitive_config_change',
      'success',
      alreadyExisted
        ? `School already existed for inquiry ${trimmedInquiryId}`
        : `School created from pilot inquiry ${trimmedInquiryId}`,
      {
        userId: user.id,
        email: user.email,
        role: profile.role,
        schoolId,
        resource: '/admin/pilot-inquiries',
        resourceId: trimmedInquiryId,
        action: 'create_school',
        metadata: {
          inquiryId: trimmedInquiryId,
          schoolId,
          schoolName: inquiry.school_name,
          alreadyExisted,
          invitationError,
          notificationError,
        },
      }
    )

    // ==========================================================================
    // 8. DETERMINE RESULT
    // ==========================================================================
    revalidatePath('/admin/pilot-inquiries')

    // Collect side-effect errors for partial-success reporting.
    const sideEffectErrors: string[] = []
    if (invitationError) sideEffectErrors.push(`Invitation: ${invitationError}`)
    if (notificationError) sideEffectErrors.push(`Notification: ${notificationError}`)

    if (sideEffectErrors.length > 0) {
      return {
        success: true,
        schoolId,
        schoolName: inquiry.school_name,
        partialSuccess: true,
        sideEffectError: sideEffectErrors.join('; '),
        alreadyExisted,
      }
    }

    return {
      success: true,
      schoolId,
      schoolName: inquiry.school_name,
      alreadyExisted,
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}
