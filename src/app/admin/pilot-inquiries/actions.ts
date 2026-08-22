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

/**
 * Returns the canonical site URL for auth redirects.
 * Mirrors the established inviteUser() implementation: in production always
 * returns the approved ascynpro.com origin to prevent redirect manipulation
 * through environment variables.
 */
function getSiteUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    return 'https://ascynpro.com'
  }
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000'
}

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
// Phase 7A Slice 5.5 (P0-1) — Approve Pilot Inquiry
// ============================================================================

export type ApprovePilotInquiryResult = {
  success: boolean
  /** The resulting status after the call ('approved' on success). */
  status?: string
  /** True when the inquiry was already approved (idempotent no-op). */
  alreadyApproved?: boolean
  error?: string
}

/**
 * Approve a pilot inquiry (platform-admin only).
 *
 * Authorization: independently verifies the caller is a platform admin
 * (role='admin', school_id IS NULL) using the caller's own session, then
 * invokes the approve_pilot_inquiry() RPC which re-validates authorization
 * and transition legality database-side. Direct API/RPC invocation cannot
 * bypass authorization because the RPC performs its own platform-admin check.
 *
 * Legal transitions (enforced by the RPC):
 *   new | contacted -> approved (allowed)
 *   approved -> approved (idempotent no-op)
 *   declined | spam -> approved (rejected)
 *
 * Approval and school creation remain separate explicit actions: this action
 * only transitions the inquiry to 'approved'; createSchoolFromInquiry()
 * performs school provisioning as a distinct, separately authorized step.
 */
export async function approvePilotInquiry(
  inquiryId: string
): Promise<ApprovePilotInquiryResult> {
  try {
    // ========================================================================
    // 1. AUTHENTICATE AND AUTHORIZE THE CALLER (SERVER-SIDE)
    // ========================================================================
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

    // Only platform admins (role='admin', school_id IS NULL) may approve inquiries.
    if (profile.role !== 'admin' || profile.school_id !== null) {
      void logSecurityEvent('permission_denied', 'denied', 'Non-platform-admin attempted pilot inquiry approval', {
        userId: user.id,
        email: user.email,
        role: profile.role,
        schoolId: profile.school_id,
        resource: '/admin/pilot-inquiries',
        resourceId: inquiryId,
        action: 'approve_inquiry',
      })
      return { success: false, error: 'Only platform administrators may approve pilot inquiries.' }
    }

    // ========================================================================
    // 2. VALIDATE INPUT
    // ========================================================================
    if (!inquiryId || typeof inquiryId !== 'string' || inquiryId.trim().length === 0) {
      return { success: false, error: 'Inquiry ID is required.' }
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(inquiryId.trim())) {
      return { success: false, error: 'Invalid inquiry ID format.' }
    }

    const trimmedInquiryId = inquiryId.trim()

    // ========================================================================
    // 3. FETCH CURRENT STATUS (UX OPTIMIZATION; RPC IS AUTHORITATIVE)
    // ========================================================================
    const { data: inquiry, error: inquiryError } = await supabase
      .from('pilot_inquiries')
      .select('id, status')
      .eq('id', trimmedInquiryId)
      .single()

    if (inquiryError || !inquiry) {
      return { success: false, error: 'Pilot inquiry not found.' }
    }

    const wasAlreadyApproved = inquiry.status === 'approved'

    // ========================================================================
    // 4. INVOKE THE APPROVAL RPC (TRANSACTIONAL, AUTHORITATIVE)
    // ========================================================================
    // The RPC enforces platform-admin authorization and legal transitions
    // database-side under a SELECT ... FOR UPDATE row lock.
    const { data: rpcStatus, error: rpcError } = await supabase
      .rpc('approve_pilot_inquiry', { p_pilot_inquiry_id: trimmedInquiryId })

    if (rpcError) {
      void logSecurityEvent('sensitive_config_change', 'failure', `Pilot inquiry approval RPC failed: ${rpcError.message}`, {
        userId: user.id,
        email: user.email,
        role: profile.role,
        resource: '/admin/pilot-inquiries',
        resourceId: trimmedInquiryId,
        action: 'approve_inquiry',
        metadata: { rpcError: rpcError.message, inquiryId: trimmedInquiryId },
      })
      return { success: false, error: `Approval failed: ${rpcError.message}` }
    }

    // ========================================================================
    // 5. WRITE AUDIT LOG (NON-TRANSACTIONAL, FIRE-AND-FORGET)
    // ========================================================================
    void logSecurityEvent(
      'sensitive_config_change',
      'success',
      wasAlreadyApproved
        ? `Pilot inquiry ${trimmedInquiryId} was already approved (idempotent)`
        : `Pilot inquiry ${trimmedInquiryId} approved`,
      {
        userId: user.id,
        email: user.email,
        role: profile.role,
        resource: '/admin/pilot-inquiries',
        resourceId: trimmedInquiryId,
        action: 'approve_inquiry',
        metadata: {
          inquiryId: trimmedInquiryId,
          previousStatus: inquiry.status,
          newStatus: rpcStatus,
          alreadyApproved: wasAlreadyApproved,
        },
      }
    )

    revalidatePath('/admin/pilot-inquiries')

    return {
      success: true,
      status: (rpcStatus as string) ?? 'approved',
      alreadyApproved: wasAlreadyApproved,
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    }
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
    // 5. SEND SCHOOL ADMIN AUTHENTICATION INVITATION (NON-TRANSACTIONAL)
    // ==========================================================================
    // Phase 7A Slice 5.5 (P0-2): completes the school-creation workflow so
    // the designated school administrator receives a REAL ASCYN PRO
    // authentication invitation.
    //
    // This reuses the established production inviteUser()/Supabase invitation
    // architecture (serviceClient.auth.admin.inviteUserByEmail + profile
    // upsert through the safe service-role path) rather than creating a
    // second authentication system.
    //
    // Security properties:
    //   - The invited user is associated ONLY with the school returned by the
    //     RPC (never a client-supplied school_id) -> cross-school assignment
    //     is impossible through this path.
    //   - The assigned role is hardcoded 'school_admin' -> role escalation is
    //     impossible through this path.
    //   - The profile is created/updated through the established safe upsert
    //     path (onConflict: 'id'), identical to inviteUser().
    //   - The school_onboarding_invitations lifecycle record is maintained
    //     (auth_user_id backfilled; duplicate/revoked/expired states handled).
    //   - Existing-account state is handled safely: if the email already has
    //     an auth account, we do NOT reassign that account across tenants;
    //     the failure is surfaced for manual remediation.
    //   - If the authentication invitation fails, the flow reports a partial
    //     success (school preserved) and does NOT falsely report full success.
    let invitationError: string | null = null
    try {
      const serviceClient = createServiceRoleClient()
      const normalizedEmail = inquiry.email.toLowerCase().trim()

      // ----------------------------------------------------------------------
      // 5a. Check for an existing auth account (existing-account state).
      // ----------------------------------------------------------------------
      const { data: existingUsers, error: listError } = await serviceClient.auth.admin.listUsers()
      if (listError) {
        invitationError = `Failed to check existing auth users: ${listError.message}`
      } else {
        const existingAuthUser = existingUsers.users.find(
          (u) => u.email?.toLowerCase() === normalizedEmail
        )

        // --------------------------------------------------------------------
        // 5b. Check the invitation lifecycle record for this school+email+role.
        // --------------------------------------------------------------------
        const { data: existingInvitation } = await serviceClient
          .from('school_onboarding_invitations')
          .select('id, status, auth_user_id, expires_at')
          .eq('school_id', schoolId)
          .eq('email', normalizedEmail)
          .eq('role', 'school_admin')
          .maybeSingle()

        const invitationExpired =
          existingInvitation?.expires_at != null &&
          new Date(existingInvitation.expires_at).getTime() < Date.now()

        // Determine whether we need to (re)send the auth invitation:
        //   - No lifecycle record -> send.
        //   - Record exists but is revoked or expired -> send (retry path).
        //   - Record is pending/accepted and unexpired -> do not resend
        //     (duplicate-invitation prevention; idempotent retry returns the
        //     existing state).
        const shouldSendInvite =
          !existingInvitation ||
          existingInvitation.status === 'revoked' ||
          existingInvitation.status === 'expired' ||
          invitationExpired

        if (existingAuthUser) {
          // ------------------------------------------------------------------
          // Existing-account state: the email already has an auth account.
          // ------------------------------------------------------------------
          // We must NOT silently reassign an existing account across tenants
          // or escalate its role. Check whether the existing profile already
          // belongs to THIS school with the school_admin role (idempotent
          // retry of a previously completed onboarding).
          const { data: existingProfile } = await serviceClient
            .from('profiles')
            .select('id, role, school_id')
            .eq('id', existingAuthUser.id)
            .maybeSingle()

          const alreadyOnboarded =
            existingProfile?.role === 'school_admin' &&
            existingProfile?.school_id === schoolId

          if (alreadyOnboarded) {
            // Idempotent retry: ensure the lifecycle record exists and is
            // linked to the auth user. No new invitation email is sent.
            if (!existingInvitation) {
              const expiresAt = new Date()
              expiresAt.setDate(expiresAt.getDate() + 7)
              const { error: insertError } = await serviceClient
                .from('school_onboarding_invitations')
                .insert({
                  school_id: schoolId,
                  pilot_inquiry_id: trimmedInquiryId,
                  invited_by: user.id,
                  email: normalizedEmail,
                  full_name: inquiry.contact_name || inquiry.school_name,
                  role: 'school_admin',
                  auth_user_id: existingAuthUser.id,
                  status: 'accepted',
                  accepted_at: new Date().toISOString(),
                  expires_at: expiresAt.toISOString(),
                })
              // 23505 = unique violation — record already exists (race).
              if (insertError && insertError.code !== '23505') {
                invitationError = `Invitation lifecycle record failed: ${insertError.message}`
              }
            } else if (!existingInvitation.auth_user_id) {
              const { error: linkError } = await serviceClient
                .from('school_onboarding_invitations')
                .update({ auth_user_id: existingAuthUser.id })
                .eq('id', existingInvitation.id)
              if (linkError) {
                invitationError = `Invitation lifecycle link failed: ${linkError.message}`
              }
            }
          } else {
            // The email belongs to a DIFFERENT tenant or a different role.
            // Reassigning would be a cross-school assignment / role-escalation
            // risk. Surface for manual remediation; do NOT modify the
            // existing account.
            invitationError =
              'An auth account with this email already exists and is not the school administrator for this school. Manual remediation is required to avoid cross-school assignment.'
          }
        } else if (shouldSendInvite) {
          // ------------------------------------------------------------------
          // 5c. Send the real Supabase authentication invitation email.
          // ------------------------------------------------------------------
          // inviteUserByEmail sends the actual invitation email; the user
          // sets their own password via the /auth/callback -> /auth/set-password
          // flow (established production path).
          const redirectTo = `${getSiteUrl()}/auth/callback`
          const { data: inviteData, error: inviteError } =
            await serviceClient.auth.admin.inviteUserByEmail(normalizedEmail, {
              redirectTo,
              data: {
                full_name: inquiry.contact_name || inquiry.school_name,
                role: 'school_admin',
              },
            })

          if (inviteError || !inviteData.user) {
            // Invitation-provider failure: the school is preserved, but the
            // flow must NOT report full success.
            invitationError =
              inviteError?.message ?? 'Invitation provider returned no user.'
          } else {
            // ----------------------------------------------------------------
            // 5d. Create/update the profile through the established safe path.
            // ----------------------------------------------------------------
            // The Supabase Auth trigger on_auth_user_created inserts a profile
            // when the auth user is created, but it cannot set school_id or
            // approval_status. Upsert guarantees exactly one profile and
            // safely overwrites trigger-created defaults with the validated
            // values. Role is hardcoded 'school_admin'; school_id is the
            // RPC-returned school.
            const { error: profileError } = await serviceClient
              .from('profiles')
              .upsert(
                {
                  id: inviteData.user.id,
                  email: normalizedEmail,
                  full_name: inquiry.contact_name || inquiry.school_name,
                  role: 'school_admin',
                  school_id: schoolId,
                  approval_status: 'approved',
                  is_disabled: false,
                  requires_password_change: false,
                },
                { onConflict: 'id' }
              )

            if (profileError) {
              // Best-effort cleanup: delete the invited auth user if the
              // profile upsert failed (mirrors inviteUser() behavior).
              await serviceClient.auth.admin.deleteUser(inviteData.user.id)
              invitationError = `Profile creation failed: ${profileError.message}`
            } else {
              // ------------------------------------------------------------
              // 5e. Maintain the school_onboarding_invitations lifecycle record.
              // ------------------------------------------------------------
              const expiresAt = new Date()
              expiresAt.setDate(expiresAt.getDate() + 7) // 7-day expiration

              if (existingInvitation && (existingInvitation.status === 'revoked' || existingInvitation.status === 'expired' || invitationExpired)) {
                // Retry path: revoke the stale record and create a fresh one
                // so the (school_id, email, role) uniqueness constraint is
                // preserved while the lifecycle reflects the new invitation.
                await serviceClient
                  .from('school_onboarding_invitations')
                  .update({
                    status: 'revoked',
                    revoked_at: new Date().toISOString(),
                    revoked_by: user.id,
                  })
                  .eq('id', existingInvitation.id)

                const { error: reinsertError } = await serviceClient
                  .from('school_onboarding_invitations')
                  .insert({
                    school_id: schoolId,
                    pilot_inquiry_id: trimmedInquiryId,
                    invited_by: user.id,
                    email: normalizedEmail,
                    full_name: inquiry.contact_name || inquiry.school_name,
                    role: 'school_admin',
                    auth_user_id: inviteData.user.id,
                    status: 'pending',
                    expires_at: expiresAt.toISOString(),
                  })

                if (reinsertError) {
                  if (reinsertError.code === '23505') {
                    // Unique conflict on retry: update the surviving record.
                    const { error: updateError } = await serviceClient
                      .from('school_onboarding_invitations')
                      .update({
                        auth_user_id: inviteData.user.id,
                        status: 'pending',
                        invited_by: user.id,
                        pilot_inquiry_id: trimmedInquiryId,
                        expires_at: expiresAt.toISOString(),
                        revoked_at: null,
                        revoked_by: null,
                      })
                      .eq('school_id', schoolId)
                      .eq('email', normalizedEmail)
                      .eq('role', 'school_admin')
                    if (updateError) {
                      invitationError = `Invitation lifecycle record failed: ${updateError.message}`
                    }
                  } else {
                    invitationError = `Invitation lifecycle record failed: ${reinsertError.message}`
                  }
                }
              } else if (!existingInvitation) {
                const { error: insertError } = await serviceClient
                  .from('school_onboarding_invitations')
                  .insert({
                    school_id: schoolId,
                    pilot_inquiry_id: trimmedInquiryId,
                    invited_by: user.id,
                    email: normalizedEmail,
                    full_name: inquiry.contact_name || inquiry.school_name,
                    role: 'school_admin',
                    auth_user_id: inviteData.user.id,
                    status: 'pending',
                    expires_at: expiresAt.toISOString(),
                  })

                if (insertError) {
                  // 23505 = unique violation — invitation already exists (race
                  // condition). Backfill auth_user_id on the surviving record.
                  if (insertError.code === '23505') {
                    const { error: linkError } = await serviceClient
                      .from('school_onboarding_invitations')
                      .update({ auth_user_id: inviteData.user.id })
                      .eq('school_id', schoolId)
                      .eq('email', normalizedEmail)
                      .eq('role', 'school_admin')
                    if (linkError) {
                      invitationError = `Invitation lifecycle link failed: ${linkError.message}`
                    }
                  } else {
                    invitationError = `Invitation lifecycle record failed: ${insertError.message}`
                  }
                }
              } else {
                // Existing pending/accepted unexpired record: backfill the
                // auth_user_id if missing (idempotent retry after a prior
                // partial failure).
                if (!existingInvitation.auth_user_id) {
                  const { error: linkError } = await serviceClient
                    .from('school_onboarding_invitations')
                    .update({ auth_user_id: inviteData.user.id })
                    .eq('id', existingInvitation.id)
                  if (linkError) {
                    invitationError = `Invitation lifecycle link failed: ${linkError.message}`
                  }
                }
              }
            }
          }
        }
        // else: existing pending/accepted unexpired invitation and no auth
        // account yet -> duplicate-invitation prevention; nothing to do.
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
