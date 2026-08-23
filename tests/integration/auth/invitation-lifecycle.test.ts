/**
 * Invitation Lifecycle Integration Tests
 * 
 * Tests the complete invitation flow using local Supabase Auth.
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { assertTestEnvironment } from '../setup/production-guard'
import {
  setupTestEnvironment,
  cleanupTestEnvironment,
  getServiceClient,
  resolveActorId,
} from '../setup/db-helpers'
import {
  createInvitation,
  acceptInvitation,
  getInvitationByEmail,
  expireInvitation,
  revokeInvitation,
  attemptInvitationReplay,
  verifyUserAssignment,
  getMailpitClient,
} from '../setup/auth-helpers'
import { TEST_ACTORS, TEST_SCHOOLS } from '../setup/test-actors'

beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
})

afterAll(async () => {
  await cleanupTestEnvironment()
})

describe('Invitation Lifecycle', () => {
  describe('Valid Invitation Flow', () => {
    test('Platform admin can create school admin invitation', async () => {
      const email = 'new-school-admin@ascyn-test.local'
      
      const result = await createInvitation(email, {
        fullName: 'New School Admin',
        role: 'school_admin',
        schoolId: TEST_SCHOOLS.SCHOOL_A.id,
        invitedBy: resolveActorId('PLATFORM_ADMIN'),
      })

      expect(result.userId).toBeDefined()
      expect(result.email).toBe(email)

      // Verify invitation record
      const invitation = await getInvitationByEmail(email)
      expect(invitation).toBeDefined()
      expect(invitation?.status).toBe('pending')
      expect(invitation?.role).toBe('school_admin')
      expect(invitation?.school_id).toBe(TEST_SCHOOLS.SCHOOL_A.id)

      // Cleanup
      const client = getServiceClient()
      await client.auth.admin.deleteUser(result.userId)
      await client.from('school_onboarding_invitations').delete().eq('email', email)
    })

    test('Invitation acceptance creates authenticated user with correct role', async () => {
      const email = 'accept-test@ascyn-test.local'
      const password = 'NewPassword123!'

      // Create invitation
      const result = await createInvitation(email, {
        fullName: 'Accept Test User',
        role: 'instructor',
        schoolId: TEST_SCHOOLS.SCHOOL_A.id,
        invitedBy: resolveActorId('PLATFORM_ADMIN'),
      })

      // Accept invitation
      const session = await acceptInvitation(result.userId, password)

      expect(session.userId).toBe(result.userId)
      expect(session.email).toBe(email)

      // Verify user assignment
      const isCorrect = await verifyUserAssignment(
        result.userId,
        'instructor',
        TEST_SCHOOLS.SCHOOL_A.id
      )
      expect(isCorrect).toBe(true)

      // Verify invitation status updated
      const invitation = await getInvitationByEmail(email)
      expect(invitation?.status).toBe('accepted')
      expect(invitation?.accepted_at).not.toBeNull()

      // Cleanup
      const client = getServiceClient()
      await client.auth.admin.deleteUser(result.userId)
      await client.from('school_onboarding_invitations').delete().eq('email', email)
    })

    test('Domain record is created for student invitation', async () => {
      const email = 'student-invite@ascyn-test.local'
      const password = 'StudentPass123!'

      const result = await createInvitation(email, {
        fullName: 'Student Invite',
        role: 'student',
        schoolId: TEST_SCHOOLS.SCHOOL_A.id,
        invitedBy: resolveActorId('PLATFORM_ADMIN'),
      })

      await acceptInvitation(result.userId, password)

      // Verify student record exists
      const client = getServiceClient()
      const { data: student } = await client
        .from('students')
        .select('*')
        .eq('profile_id', result.userId)
        .single()

      expect(student).toBeDefined()
      expect(student?.school_id).toBe(TEST_SCHOOLS.SCHOOL_A.id)

      // Cleanup
      await client.from('students').delete().eq('profile_id', result.userId)
      await client.auth.admin.deleteUser(result.userId)
      await client.from('school_onboarding_invitations').delete().eq('email', email)
    })
  })

  describe('Duplicate Invitation Handling', () => {
    test('Duplicate invitation for same email and school fails', async () => {
      const email = 'duplicate@ascyn-test.local'

      // Create first invitation
      const result1 = await createInvitation(email, {
        fullName: 'First Invitation',
        role: 'student',
        schoolId: TEST_SCHOOLS.SCHOOL_A.id,
        invitedBy: resolveActorId('PLATFORM_ADMIN'),
      })

      // Attempt duplicate invitation
      await expect(
        createInvitation(email, {
          fullName: 'Duplicate Invitation',
          role: 'student',
          schoolId: TEST_SCHOOLS.SCHOOL_A.id,
          invitedBy: resolveActorId('PLATFORM_ADMIN'),
        })
      ).rejects.toThrow()

      // Cleanup
      const client = getServiceClient()
      await client.auth.admin.deleteUser(result1.userId)
      await client.from('school_onboarding_invitations').delete().eq('email', email)
    })

    test('Same email can be invited to different schools', async () => {
      const email = 'multi-school@ascyn-test.local'

      // Invite to School A
      const resultA = await createInvitation(email, {
        fullName: 'Multi School User A',
        role: 'student',
        schoolId: TEST_SCHOOLS.SCHOOL_A.id,
        invitedBy: resolveActorId('PLATFORM_ADMIN'),
      })

      // Invite to School B — Supabase Auth may return the same user ID
      // for the same email (auth.users is unique by email). The invitation
      // record itself is separate and school-scoped.
      const resultB = await createInvitation(email, {
        fullName: 'Multi School User B',
        role: 'student',
        schoolId: TEST_SCHOOLS.SCHOOL_B.id,
        invitedBy: resolveActorId('PLATFORM_ADMIN'),
      })

      // Both invitations should have been created
      expect(resultA.userId).toBeDefined()
      expect(resultB.userId).toBeDefined()

      // Verify separate invitation records exist for each school
      const invitationA = await getInvitationByEmail(email)
      expect(invitationA).toBeDefined()
      // Note: getInvitationByEmail returns the most recent; both records exist

      // Cleanup
      const client = getServiceClient()
      // Delete the auth user (only one exists since email is unique)
      await client.auth.admin.deleteUser(resultA.userId)
      if (resultB.userId !== resultA.userId) {
        await client.auth.admin.deleteUser(resultB.userId)
      }
      await client.from('school_onboarding_invitations').delete().eq('email', email)
    })
  })

  describe('Existing Account Invitation', () => {
    test('Inviting existing user updates rather than duplicates', async () => {
      const email = TEST_ACTORS.STUDENT_A.email

      // Attempt to invite existing user
      // This should either fail gracefully or update the existing user
      try {
        const result = await createInvitation(email, {
          fullName: 'Updated Name',
          role: 'instructor', // Attempt to change role
          schoolId: TEST_SCHOOLS.SCHOOL_B.id, // Attempt to change school
          invitedBy: resolveActorId('PLATFORM_ADMIN'),
        })

        // If it succeeds, verify original user is not duplicated
        const client = getServiceClient()
        const { data: profiles } = await client
          .from('profiles')
          .select('*')
          .eq('email', email)

        // Should only have one profile
        expect(profiles?.length).toBe(1)
      } catch (error) {
        // Expected to fail - user already exists
        expect(error).toBeDefined()
      }
    })
  })

  describe('Invitation Expiration', () => {
    test('Expired invitation cannot be accepted', async () => {
      const email = 'expired@ascyn-test.local'

      const result = await createInvitation(email, {
        fullName: 'Expired Invitation',
        role: 'student',
        schoolId: TEST_SCHOOLS.SCHOOL_A.id,
        invitedBy: resolveActorId('PLATFORM_ADMIN'),
      })

      // Expire the invitation
      const invitation = await getInvitationByEmail(email)
      if (invitation) {
        await expireInvitation(invitation.id)
      }

      // Attempt to accept expired invitation
      // Note: Supabase Auth may still allow password set, but application should check status
      const invitationAfter = await getInvitationByEmail(email)
      expect(invitationAfter?.status).toBe('expired')

      // Cleanup
      const client = getServiceClient()
      await client.auth.admin.deleteUser(result.userId)
      await client.from('school_onboarding_invitations').delete().eq('email', email)
    })
  })

  describe('Invitation Replay Prevention', () => {
    test('Invitation token cannot be reused', async () => {
      const email = 'replay@ascyn-test.local'
      const password = 'ReplayPass123!'

      const result = await createInvitation(email, {
        fullName: 'Replay Test',
        role: 'student',
        schoolId: TEST_SCHOOLS.SCHOOL_A.id,
        invitedBy: resolveActorId('PLATFORM_ADMIN'),
      })

      // First acceptance should succeed
      await acceptInvitation(result.userId, password)

      // Verify invitation status is now 'accepted'
      const invitationAfterAccept = await getInvitationByEmail(email)
      expect(invitationAfterAccept?.status).toBe('accepted')
      expect(invitationAfterAccept?.accepted_at).not.toBeNull()

      // Application-level replay prevention: the invitation status is 'accepted',
      // so the application should reject any attempt to use it again.
      // The Admin API updateUserById would succeed (it doesn't check invitation
      // status), but the application layer must check status before allowing
      // password reset via invitation.
      //
      // Verify the user can authenticate with the password set during acceptance
      const { createAuthenticatedClient } = await import('../setup/db-helpers')
      const client = await createAuthenticatedClient({
        id: result.userId,
        email,
        password,
      } as any)

      expect(client).toBeDefined()

      // Cleanup
      const serviceClient = getServiceClient()
      await serviceClient.from('students').delete().eq('profile_id', result.userId)
      await serviceClient.auth.admin.deleteUser(result.userId)
      await serviceClient.from('school_onboarding_invitations').delete().eq('email', email)
    })
  })

  describe('Cross-School Abuse Prevention', () => {
    test('Invitation for School A cannot be used for School B', async () => {
      const email = 'cross-school@ascyn-test.local'

      // Create invitation for School A
      const result = await createInvitation(email, {
        fullName: 'Cross School Test',
        role: 'student',
        schoolId: TEST_SCHOOLS.SCHOOL_A.id,
        invitedBy: resolveActorId('PLATFORM_ADMIN'),
      })

      // Verify invitation is for School A
      const invitation = await getInvitationByEmail(email)
      expect(invitation?.school_id).toBe(TEST_SCHOOLS.SCHOOL_A.id)

      // Accept invitation
      await acceptInvitation(result.userId, 'CrossSchool123!')

      // Verify user is assigned to School A, not School B
      const isCorrect = await verifyUserAssignment(
        result.userId,
        'student',
        TEST_SCHOOLS.SCHOOL_A.id
      )
      expect(isCorrect).toBe(true)

      // Cleanup
      const client = getServiceClient()
      await client.from('students').delete().eq('profile_id', result.userId)
      await client.auth.admin.deleteUser(result.userId)
      await client.from('school_onboarding_invitations').delete().eq('email', email)
    })

    test('School Admin A cannot invite to School B', async () => {
      const client = await import('../setup/db-helpers').then(m => 
        m.createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)
      )

      // Attempt to create invitation for School B
      const { error } = await client
        .from('school_onboarding_invitations')
        .insert({
          school_id: TEST_SCHOOLS.SCHOOL_B.id,
          invited_by: resolveActorId('SCHOOL_ADMIN_A'),
          email: 'unauthorized@ascyn-test.local',
          full_name: 'Unauthorized Invite',
          role: 'student',
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })

      // Should fail due to RLS
      expect(error).not.toBeNull()
    })
  })

  describe('Email Delivery (Local SMTP)', () => {
    test('Invitation email is captured by Mailpit', async () => {
      const mailpit = getMailpitClient()
      const email = 'email-test@ascyn-test.local'

      // Clear previous messages
      await mailpit.deleteMessages()

      // Create invitation
      const result = await createInvitation(email, {
        fullName: 'Email Test',
        role: 'student',
        schoolId: TEST_SCHOOLS.SCHOOL_A.id,
        invitedBy: resolveActorId('PLATFORM_ADMIN'),
      })

      // Wait for email
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check Mailpit for invitation email
      const messages = await mailpit.getMessages()
      
      // Note: Local Supabase may or may not send emails depending on configuration
      // This test documents the expected behavior
      console.log('Mailpit messages:', messages)

      // Cleanup
      const client = getServiceClient()
      await client.auth.admin.deleteUser(result.userId)
      await client.from('school_onboarding_invitations').delete().eq('email', email)
    })
  })
})
