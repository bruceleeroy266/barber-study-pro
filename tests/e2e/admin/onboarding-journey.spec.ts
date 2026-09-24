/**
 * Pilot onboarding certification
 *
 * This is intentionally a single deterministic browser journey against LOCAL
 * Supabase only. It proves the real onboarding handoffs instead of checking
 * that pages merely render.
 */

import { test, expect, Browser, BrowserContext, Page } from '@playwright/test'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SCHOOL_NAME = 'ASCYN Pilot Certification School'
const SCHOOL_ADMIN_NAME = 'Pilot Certification School Admin'
const SCHOOL_ADMIN_EMAIL = 'cert-school-admin@ascynpro.test'
const INSTRUCTOR_NAME = 'Pilot Certification Instructor'
const INSTRUCTOR_EMAIL = 'cert-instructor@ascynpro.test'
const STUDENT_NAME = 'Pilot Certification Student'
const STUDENT_EMAIL = 'cert-student@ascynpro.test'
const PLATFORM_ADMIN_EMAIL = 'cert-platform-admin@ascynpro.test'
const PLATFORM_ADMIN_PASSWORD = 'PilotCert2026!'
const SCHOOL_ADMIN_PASSWORD = 'SchoolAdmin2026!'
const INSTRUCTOR_PASSWORD = 'Instructor2026!'
const STUDENT_PASSWORD = 'Student2026!'

function requireLocalCertificationEnvironment() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  if (
    process.env.ASCYN_TEST_ENVIRONMENT !== 'true' ||
    !/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?(?:\/|$)/i.test(url)
  ) {
    throw new Error(
      'Pilot onboarding certification is LOCAL-ONLY. ASCYN_TEST_ENVIRONMENT=true and a localhost Supabase URL are required.'
    )
  }
}

function getServiceClient(): SupabaseClient {
  requireLocalCertificationEnvironment()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Local Supabase service credentials are missing.')
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function getMailpitUrl() {
  return process.env.TEST_MAILPIT_URL || 'http://127.0.0.1:54324'
}

function collectStrings(value: unknown, output: string[] = []): string[] {
  if (typeof value === 'string') {
    output.push(value)
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, output))
  } else if (value && typeof value === 'object') {
    Object.values(value as Record<string, unknown>).forEach((item) => collectStrings(item, output))
  }
  return output
}

function extractInviteUrl(value: unknown): string | null {
  for (const text of collectStrings(value)) {
    const urls = text.match(/https?:\/\/[^\s"'<>]+/g) || []
    for (const raw of urls) {
      const url = raw
        .replace(/&amp;/g, '&')
        .replace(/\\u0026/g, '&')
        .replace(/[),.;]+$/, '')
      if (
        url.includes('/auth/v1/verify') &&
        (url.includes('type=invite') || url.includes('type%3Dinvite'))
      ) {
        return url
      }
    }
  }

  return null
}

async function waitForInviteUrl(email: string): Promise<string> {
  const mailpit = getMailpitUrl()

  for (let attempt = 0; attempt < 60; attempt += 1) {
    const response = await fetch(`${mailpit}/api/v1/messages`)
    if (response.ok) {
      const body = await response.json() as Record<string, unknown>
      const messages = Array.isArray(body.messages)
        ? body.messages
        : Array.isArray(body.Messages)
          ? body.Messages
          : []

      for (const message of messages) {
        const summaryText = collectStrings(message).join(' ').toLowerCase()
        if (!summaryText.includes(email.toLowerCase())) continue

        const record = message as Record<string, unknown>
        const id = record.ID ?? record.Id ?? record.id
        if (!id) continue

        const detailResponse = await fetch(`${mailpit}/api/v1/message/${encodeURIComponent(String(id))}`)
        if (!detailResponse.ok) continue
        const detail = await detailResponse.json()

        const url = extractInviteUrl(detail)
        if (url) return url
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  throw new Error(`No invitation email/link arrived in Mailpit for ${email}`)
}

async function createPlatformAdmin(service: SupabaseClient) {
  const { data: users } = await service.auth.admin.listUsers()
  const existing = users.users.find((user) => user.email?.toLowerCase() === PLATFORM_ADMIN_EMAIL)

  let userId = existing?.id

  if (userId) {
    const { error } = await service.auth.admin.updateUserById(userId, {
      password: PLATFORM_ADMIN_PASSWORD,
      email_confirm: true,
    })
    if (error) throw error
  } else {
    const { data, error } = await service.auth.admin.createUser({
      email: PLATFORM_ADMIN_EMAIL,
      password: PLATFORM_ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: 'Pilot Certification Platform Admin' },
    })
    if (error || !data.user) {
      throw new Error(`Failed to create platform admin: ${error?.message || 'missing user'}`)
    }
    userId = data.user.id
  }

  const { error: profileError } = await service
    .from('profiles')
    .upsert({
      id: userId,
      email: PLATFORM_ADMIN_EMAIL,
      full_name: 'Pilot Certification Platform Admin',
      role: 'admin',
      school_id: null,
      approval_status: 'approved',
      is_disabled: false,
      requires_password_change: false,
    }, { onConflict: 'id' })

  if (profileError) throw profileError
}

async function login(page: Page, email: string, password: string, expectedPath: RegExp) {
  await page.goto('/login')
  await page.locator('input[type="email"]').fill(email)
  await page.locator('input[type="password"]').fill(password)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL(expectedPath, { timeout: 20_000 })
}

async function acceptInvitationAndFirstLogin(
  browser: Browser,
  email: string,
  password: string,
  expectedPath: RegExp,
  options: { betaAgreementName?: string } = {}
): Promise<{ context: BrowserContext; page: Page }> {
  const inviteUrl = await waitForInviteUrl(email)

  const activationContext = await browser.newContext()
  const activationPage = await activationContext.newPage()
  await activationPage.goto(inviteUrl)
  await activationPage.waitForURL(/\/auth\/set-password/, { timeout: 20_000 })

  const passwordInputs = activationPage.locator('input[type="password"]')
  await expect(passwordInputs).toHaveCount(2)
  await passwordInputs.nth(0).fill(password)
  await passwordInputs.nth(1).fill(password)
  await activationPage.locator('button[type="submit"]').click()

  if (options.betaAgreementName) {
    await activationPage.waitForURL(/\/beta-agreement(?:\?|$)/, { timeout: 20_000 })
    await expect(
      activationPage.getByText('Loading agreement status…')
    ).toBeHidden({ timeout: 10_000 })

    const testerName = activationPage.locator('#tester-name')
    const testerEmail = activationPage.locator('#tester-email')
    const agreementCheckbox = activationPage.locator('#agree-checkbox')

    await testerName.fill(options.betaAgreementName)
    await expect(testerName).toHaveValue(options.betaAgreementName)
    await testerEmail.fill(email)
    await expect(testerEmail).toHaveValue(email)

    await agreementCheckbox.scrollIntoViewIfNeeded()
    await expect(agreementCheckbox).toBeEnabled()
    await agreementCheckbox.click()

    await expect(
      activationPage.getByText('Agreement accepted. You may continue to the checklist.')
    ).toBeVisible({ timeout: 10_000 })
    await activationPage.getByRole('button', { name: 'Continue' }).click()
    await activationPage.waitForURL(/\/dashboard\/beta-checklist(?:\?|$)/, { timeout: 20_000 })
    await expect(
      activationPage.getByRole('heading', { name: 'Beta Tester Checklist' })
    ).toBeVisible()

    await activationPage.goto('/dashboard')
    await activationPage.waitForURL(expectedPath, { timeout: 20_000 })
  } else {
    await activationPage.waitForURL(expectedPath, { timeout: 20_000 })
  }

  await activationContext.close()

  // Prove a fresh credential login works after activation.
  const context = await browser.newContext()
  const page = await context.newPage()
  await login(page, email, password, expectedPath)
  return { context, page }
}

async function inviteSchoolUser(
  page: Page,
  schoolId: string,
  input: { name: string; email: string; role: 'instructor' | 'student' }
) {
  await page.goto('/admin/users')
  await page.getByRole('button', { name: 'Invite User' }).click()

  const form = page.locator('form').filter({
    has: page.getByRole('button', { name: 'Send Invitation' }),
  })

  await form.locator('input[name="full_name"]').fill(input.name)
  await form.locator('input[name="email"]').fill(input.email)
  await form.locator('select[name="role"]').selectOption(input.role)
  await form.locator('select[name="school_id"]').selectOption(schoolId)
  await form.locator('select[name="approval_status"]').selectOption('approved')
  await form.getByRole('button', { name: 'Send Invitation' }).click()

  await expect(page.getByRole('status')).toContainText('Invitation sent successfully')
}

test.describe('Pilot onboarding certification', () => {
  test.describe.configure({ retries: 0 })
  test('inquiry → approval → school → invites → acceptance → enrollment → instructor visibility', async ({ browser }) => {
    requireLocalCertificationEnvironment()
    const service = getServiceClient()

    await createPlatformAdmin(service)

    // -----------------------------------------------------------------------
    // 1. Public pilot inquiry submission
    // -----------------------------------------------------------------------
    const publicContext = await browser.newContext()
    const publicPage = await publicContext.newPage()
    await publicPage.goto('/pilot')
    await publicPage.locator('input[name="schoolName"]').fill(SCHOOL_NAME)
    await publicPage.locator('input[name="contactName"]').fill(SCHOOL_ADMIN_NAME)
    await publicPage.locator('input[name="email"]').fill(SCHOOL_ADMIN_EMAIL)
    await publicPage.locator('select[name="programType"]').selectOption('Barbering')
    await publicPage.locator('input[name="cohortSize"]').fill('12')
    await publicPage.getByRole('button', { name: 'Request Pilot Access' }).click()
    await expect(publicPage.getByRole('heading', { name: 'Thank You!' })).toBeVisible()
    await publicContext.close()

    const { data: inquiry, error: inquiryError } = await service
      .from('pilot_inquiries')
      .select('id, status, school_id, program_type')
      .eq('email', SCHOOL_ADMIN_EMAIL)
      .single()

    expect(inquiryError).toBeNull()
    expect(inquiry).toMatchObject({
      status: 'new',
      school_id: null,
      program_type: 'Barbering',
    })

    // -----------------------------------------------------------------------
    // 2. Platform admin approval and school creation through the UI
    // -----------------------------------------------------------------------
    const adminContext = await browser.newContext()
    const adminPage = await adminContext.newPage()
    await login(adminPage, PLATFORM_ADMIN_EMAIL, PLATFORM_ADMIN_PASSWORD, /\/admin(?:\/|$)/)

    await adminPage.goto('/admin/pilot-inquiries')
    await expect(adminPage.getByRole('heading', { name: SCHOOL_NAME })).toBeVisible()

    await adminPage.getByRole('button', { name: 'Approve' }).click()
    await adminPage.getByRole('button', { name: 'Confirm Approval' }).click()

    // The modal is intentionally transient under revalidation. The persisted
    // status transition is the certification boundary.
    await expect.poll(async () => {
      const { data } = await service
        .from('pilot_inquiries')
        .select('status')
        .eq('id', inquiry!.id)
        .single()
      return data?.status
    }, { timeout: 10_000 }).toBe('approved')

    await adminPage.reload()
    await expect(adminPage.getByRole('button', { name: 'Create School' })).toBeVisible()
    await adminPage.getByRole('button', { name: 'Create School' }).click()
    await adminPage.getByRole('button', { name: 'Confirm & Create School' }).click()

    // School creation revalidates the page, so the durable "School Created"
    // state is authoritative rather than a transient modal success message.
    await expect(adminPage.getByText('School Created')).toBeVisible()

    const { data: provisionedInquiry, error: provisionError } = await service
      .from('pilot_inquiries')
      .select('school_id, school_created_at')
      .eq('id', inquiry!.id)
      .single()

    expect(provisionError).toBeNull()
    expect(provisionedInquiry?.school_id).toBeTruthy()
    expect(provisionedInquiry?.school_created_at).toBeTruthy()
    const schoolId = String(provisionedInquiry!.school_id)

    const [{ data: school }, { data: settings }, { data: programs }, { data: adminInvitation }] =
      await Promise.all([
        service.from('schools').select('id, name').eq('id', schoolId).single(),
        service.from('school_settings').select('school_id').eq('school_id', schoolId).single(),
        service.from('programs').select('id, name').eq('school_id', schoolId).eq('is_active', true),
        service
          .from('school_onboarding_invitations')
          .select('id, status, auth_user_id')
          .eq('school_id', schoolId)
          .eq('email', SCHOOL_ADMIN_EMAIL)
          .eq('role', 'school_admin')
          .single(),
      ])

    expect(school).toMatchObject({ id: schoolId, name: SCHOOL_NAME })
    expect(settings?.school_id).toBe(schoolId)
    expect(programs).toHaveLength(1)
    expect(programs?.[0]?.name).toBe('Barbering')
    expect(adminInvitation?.status).toBe('pending')
    expect(adminInvitation?.auth_user_id).toBeTruthy()

    await adminContext.close()

    // -----------------------------------------------------------------------
    // 3. School-admin invitation acceptance + first login
    // -----------------------------------------------------------------------
    const schoolAdminSession = await acceptInvitationAndFirstLogin(
      browser,
      SCHOOL_ADMIN_EMAIL,
      SCHOOL_ADMIN_PASSWORD,
      /\/school(?:\/|$)/
    )

    const { data: acceptedAdminInvitation } = await service
      .from('school_onboarding_invitations')
      .select('status, accepted_at')
      .eq('school_id', schoolId)
      .eq('email', SCHOOL_ADMIN_EMAIL)
      .eq('role', 'school_admin')
      .single()

    expect(acceptedAdminInvitation?.status).toBe('accepted')
    expect(acceptedAdminInvitation?.accepted_at).toBeTruthy()

    // -----------------------------------------------------------------------
    // 4. School admin invites instructor, instructor accepts + first login
    // -----------------------------------------------------------------------
    await inviteSchoolUser(schoolAdminSession.page, schoolId, {
      name: INSTRUCTOR_NAME,
      email: INSTRUCTOR_EMAIL,
      role: 'instructor',
    })

    const { data: pendingInstructorInvite } = await service
      .from('school_onboarding_invitations')
      .select('status, auth_user_id')
      .eq('school_id', schoolId)
      .eq('email', INSTRUCTOR_EMAIL)
      .eq('role', 'instructor')
      .single()

    expect(pendingInstructorInvite?.status).toBe('pending')

    const instructorSession = await acceptInvitationAndFirstLogin(
      browser,
      INSTRUCTOR_EMAIL,
      INSTRUCTOR_PASSWORD,
      /\/instructor(?:\/|$)/
    )

    const { data: acceptedInstructorInvite } = await service
      .from('school_onboarding_invitations')
      .select('status, accepted_at')
      .eq('school_id', schoolId)
      .eq('email', INSTRUCTOR_EMAIL)
      .eq('role', 'instructor')
      .single()

    expect(acceptedInstructorInvite?.status).toBe('accepted')
    expect(acceptedInstructorInvite?.accepted_at).toBeTruthy()

    // -----------------------------------------------------------------------
    // 5. School admin invites student, student accepts + first login
    // -----------------------------------------------------------------------
    await inviteSchoolUser(schoolAdminSession.page, schoolId, {
      name: STUDENT_NAME,
      email: STUDENT_EMAIL,
      role: 'student',
    })

    const { data: pendingStudentInvite } = await service
      .from('school_onboarding_invitations')
      .select('status, auth_user_id')
      .eq('school_id', schoolId)
      .eq('email', STUDENT_EMAIL)
      .eq('role', 'student')
      .single()

    expect(pendingStudentInvite?.status).toBe('pending')

    const studentSession = await acceptInvitationAndFirstLogin(
      browser,
      STUDENT_EMAIL,
      STUDENT_PASSWORD,
      /\/dashboard(?:\/|$)/,
      { betaAgreementName: STUDENT_NAME }
    )

    const { data: acceptedStudentInvite } = await service
      .from('school_onboarding_invitations')
      .select('status, accepted_at')
      .eq('school_id', schoolId)
      .eq('email', STUDENT_EMAIL)
      .eq('role', 'student')
      .single()

    expect(acceptedStudentInvite?.status).toBe('accepted')
    expect(acceptedStudentInvite?.accepted_at).toBeTruthy()

    // -----------------------------------------------------------------------
    // 6. School admin enrolls the student in the provisioned Barbering program
    // -----------------------------------------------------------------------
    await schoolAdminSession.page.goto('/admin/users')
    const search = schoolAdminSession.page.locator('input[placeholder="Search name or email"]')
    await search.fill(STUDENT_EMAIL)
    await schoolAdminSession.page.getByRole('button', { name: 'Search' }).click()

    const studentRow = schoolAdminSession.page.getByRole('row').filter({ hasText: STUDENT_EMAIL })
    await expect(studentRow).toBeVisible()
    await studentRow.getByRole('button', { name: 'Enroll' }).click()

    const enrollmentDialog = schoolAdminSession.page.getByRole('dialog', {
      name: new RegExp(`Enrollments.*${STUDENT_NAME}`),
    })
    await expect(enrollmentDialog).toBeVisible()
    await enrollmentDialog.locator('select').selectOption({ label: 'Barbering' })
    await enrollmentDialog.getByRole('button', { name: 'Enroll Student' }).click()
    await expect(enrollmentDialog.getByText('Student enrolled successfully')).toBeVisible()

    const { data: studentProfile } = await service
      .from('profiles')
      .select('id, school_id, role')
      .eq('email', STUDENT_EMAIL)
      .single()

    expect(studentProfile).toMatchObject({ school_id: schoolId, role: 'student' })

    const { data: studentDomain } = await service
      .from('students')
      .select('id, school_id')
      .eq('profile_id', studentProfile!.id)
      .eq('school_id', schoolId)
      .single()

    const barberProgram = programs![0]
    const { data: enrollment, error: enrollmentError } = await service
      .from('enrollments')
      .select('id, status, is_active, student_id, program_id')
      .eq('student_id', studentDomain!.id)
      .eq('program_id', barberProgram.id)
      .single()

    expect(enrollmentError).toBeNull()
    expect(enrollment).toMatchObject({
      status: 'active',
      is_active: true,
      student_id: studentDomain!.id,
      program_id: barberProgram.id,
    })

    // -----------------------------------------------------------------------
    // 7. Instructor verifies the newly onboarded student is visible
    // -----------------------------------------------------------------------
    await instructorSession.page.goto('/instructor/students')
    const instructorStudentRow = instructorSession.page
      .getByRole('row')
      .filter({ hasText: STUDENT_EMAIL })
    await expect(instructorStudentRow).toBeVisible()
    await expect(instructorStudentRow.getByText(STUDENT_NAME, { exact: true })).toBeVisible()
    await expect(instructorStudentRow.getByText(STUDENT_EMAIL, { exact: true })).toBeVisible()

    // Also prove the instructor stayed tenant-bound to the provisioned school.
    const { data: instructorProfile } = await service
      .from('profiles')
      .select('school_id, role')
      .eq('email', INSTRUCTOR_EMAIL)
      .single()
    expect(instructorProfile).toMatchObject({ school_id: schoolId, role: 'instructor' })

    await studentSession.context.close()
    await instructorSession.context.close()
    await schoolAdminSession.context.close()
  })
})
