/**
 * Authentication Helpers for Integration Tests
 * 
 * Provides utilities for auth operations including invitation lifecycle.
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { getServiceClient, createAuthenticatedClient } from './db-helpers'
import { getTestEnvironment } from './test-environment'
import { TestActor } from './test-actors'

export interface InvitationResult {
  userId: string
  email: string
  invitationToken?: string
  expiresAt?: string
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  userId: string
  email: string
}

/**
 * Creates an invitation for a new user.
 * Uses Supabase Auth Admin API to generate invitation.
 */
export async function createInvitation(
  email: string,
  options: {
    fullName: string
    role: 'school_admin' | 'instructor' | 'student'
    schoolId: string
    invitedBy: string
    pilotInquiryId?: string
  }
): Promise<InvitationResult> {
  const client = getServiceClient()
  const env = getTestEnvironment()

  // Create invitation record in database
  const { data: invitation, error: inviteError } = await client
    .from('school_onboarding_invitations')
    .insert({
      school_id: options.schoolId,
      pilot_inquiry_id: options.pilotInquiryId || null,
      invited_by: options.invitedBy,
      email,
      full_name: options.fullName,
      role: options.role,
      status: 'pending',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    })
    .select()
    .single()

  if (inviteError) {
    throw new Error(`Failed to create invitation record: ${inviteError.message}`)
  }

  // Create auth user with invitation
  const { data: authData, error: authError } = await client.auth.admin.inviteUserByEmail(
    email,
    {
      data: {
        full_name: options.fullName,
        role: options.role,
        school_id: options.schoolId,
        invitation_id: invitation.id,
      },
      redirectTo: `${env.siteUrl}/auth/callback`,
    }
  )

  if (authError) {
    // Clean up invitation record if auth creation fails
    await client.from('school_onboarding_invitations').delete().eq('id', invitation.id)
    throw new Error(`Failed to create auth invitation: ${authError.message}`)
  }

  // Link the auth user ID to the invitation record so acceptInvitation can find it
  const { error: linkError } = await client
    .from('school_onboarding_invitations')
    .update({ auth_user_id: authData.user.id })
    .eq('id', invitation.id)

  if (linkError) {
    console.warn(`Failed to link auth_user_id to invitation: ${linkError.message}`)
  }

  return {
    userId: authData.user.id,
    email: authData.user.email!,
  }
}

/**
 * Accepts an invitation by setting a password.
 * Simulates the user clicking the invitation link and setting their password.
 * Also updates the profile with role/school from the invitation and creates
 * domain records (student/instructor), simulating the complete application
 * invitation acceptance flow.
 */
export async function acceptInvitation(
  userId: string,
  password: string
): Promise<AuthSession> {
  const client = getServiceClient()

  // Update user password
  const { error: updateError } = await client.auth.admin.updateUserById(userId, {
    password,
    email_confirm: true,
  })

  if (updateError) {
    throw new Error(`Failed to set password: ${updateError.message}`)
  }

  // Get user details
  const { data: userData, error: userError } = await client.auth.admin.getUserById(userId)
  if (userError || !userData.user) {
    throw new Error(`Failed to get user: ${userError?.message}`)
  }

  // Get the invitation record to extract role and school_id
  const { data: invitation } = await client
    .from('school_onboarding_invitations')
    .select('*')
    .eq('auth_user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Update invitation status
  await client
    .from('school_onboarding_invitations')
    .update({
      status: 'accepted',
      accepted_at: new Date().toISOString(),
      auth_user_id: userId,
    })
    .eq('auth_user_id', userId)

  // Update profile with role and school_id from invitation
  // (The handle_new_user trigger creates the profile but does not set school_id
  // from invitation metadata — the application layer handles this)
  if (invitation) {
    await client
      .from('profiles')
      .update({
        role: invitation.role,
        school_id: invitation.school_id,
        approval_status: 'approved',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    // Create domain records for students
    if (invitation.role === 'student' && invitation.school_id) {
      const { error: studentError } = await client
        .from('students')
        .upsert({
          profile_id: userId,
          school_id: invitation.school_id,
          student_number: `STU-${userId.slice(0, 8)}`,
          enrollment_date: new Date().toISOString().split('T')[0],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'profile_id,school_id',
        })

      if (studentError) {
        throw new Error(`Failed to create student domain record: ${studentError.message}`)
      }
    }

    // Create domain records for instructors
    if (invitation.role === 'instructor' && invitation.school_id) {
      const { error: instructorError } = await client
        .from('instructors')
        .upsert({
          profile_id: userId,
          school_id: invitation.school_id,
          license_number: `LIC-${userId.slice(0, 8)}`,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'profile_id,school_id',
        })

      if (instructorError) {
        throw new Error(`Failed to create instructor domain record: ${instructorError.message}`)
      }
    }
  }

  return {
    accessToken: 'session-access-token',
    refreshToken: 'session-refresh-token',
    userId,
    email: userData.user.email!,
  }
}

/**
 * Gets invitation details from the database.
 */
export async function getInvitationByEmail(email: string) {
  const client = getServiceClient()

  const { data, error } = await client
    .from('school_onboarding_invitations')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    return null
  }

  return data
}

/**
 * Gets invitation by ID.
 */
export async function getInvitationById(id: string) {
  const client = getServiceClient()

  const { data, error } = await client
    .from('school_onboarding_invitations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return null
  }

  return data
}

/**
 * Expires an invitation (for testing expiration behavior).
 */
export async function expireInvitation(invitationId: string): Promise<void> {
  const client = getServiceClient()

  await client
    .from('school_onboarding_invitations')
    .update({
      status: 'expired',
      expires_at: new Date(Date.now() - 1000).toISOString(), // Already expired
    })
    .eq('id', invitationId)
}

/**
 * Revokes an invitation.
 */
export async function revokeInvitation(invitationId: string, revokedBy: string): Promise<void> {
  const client = getServiceClient()

  await client
    .from('school_onboarding_invitations')
    .update({
      status: 'revoked',
      revoked_at: new Date().toISOString(),
      revoked_by: revokedBy,
    })
    .eq('id', invitationId)
}

/**
 * Simulates invitation replay by attempting to use the same token twice.
 */
export async function attemptInvitationReplay(
  userId: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await acceptInvitation(userId, password)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Creates a session for an existing user.
 */
export async function createSession(actor: TestActor): Promise<AuthSession> {
  const client = await createAuthenticatedClient(actor)
  const { data: { session } } = await client.auth.getSession()

  if (!session) {
    throw new Error('Failed to create session')
  }

  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    userId: session.user.id,
    email: session.user.email!,
  }
}

/**
 * Signs out a user.
 */
export async function signOut(client: SupabaseClient): Promise<void> {
  await client.auth.signOut()
}

/**
 * Verifies that a user has the expected role and school assignment.
 */
export async function verifyUserAssignment(
  userId: string,
  expectedRole: string,
  expectedSchoolId: string | null
): Promise<boolean> {
  const client = getServiceClient()

  const { data: profile, error } = await client
    .from('profiles')
    .select('role, school_id')
    .eq('id', userId)
    .single()

  if (error || !profile) {
    return false
  }

  return profile.role === expectedRole && profile.school_id === expectedSchoolId
}

/**
 * Gets the Mailpit API client for email testing.
 */
export function getMailpitClient() {
  const env = getTestEnvironment()
  const baseUrl = env.mailpitUrl

  return {
    async getMessages() {
      const response = await fetch(`${baseUrl}/api/v1/messages`)
      return response.json()
    },
    async getMessage(id: string) {
      const response = await fetch(`${baseUrl}/api/v1/message/${id}`)
      return response.json()
    },
    async deleteMessages() {
      await fetch(`${baseUrl}/api/v1/messages`, { method: 'DELETE' })
    },
    async searchMessages(query: string) {
      const response = await fetch(`${baseUrl}/api/v1/search?query=${encodeURIComponent(query)}`)
      return response.json()
    },
  }
}
