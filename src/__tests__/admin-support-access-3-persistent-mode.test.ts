import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')

describe('ADMIN-SUPPORT-ACCESS-3 persistent support mode', () => {
  const runtime = read('src/lib/support-access.ts')
  const logger = read('src/lib/security/audit-logger.ts')
  const instructorLayout = read('src/app/instructor/layout.tsx')
  const schoolLayout = read('src/app/school/layout.tsx')
  const adminLayout = read('src/app/admin/layout.tsx')
  const gradeActions = read('src/app/instructor/gradebook/actions.ts')
  const assessmentActions = read('src/app/instructor/assessments/actions.ts')
  const hourActions = read('src/app/instructor/hours/actions.ts')
  const messagingActions = read('src/app/communications/actions.ts')
  const userActions = read('src/app/admin/users/actions.ts')
  const configActions = read('src/app/admin/school/configuration/actions.ts')

  it('uses a secure persistent support target cookie without changing auth identity', () => {
    expect(runtime).toContain("SUPPORT_ACCESS_COOKIE = 'ascyn_support_target'")
    expect(runtime).toContain('httpOnly: true')
    expect(runtime).toContain("sameSite: 'strict'")
    expect(runtime).toContain('actorUserId: user.id')
    expect(runtime).toContain('effectiveProfile: targetProfile')
  })

  it('renders persistent support mode across instructor, school, and admin shells', () => {
    for (const source of [instructorLayout, schoolLayout, adminLayout]) {
      expect(source).toContain('resolveSupportAccessContext()')
      expect(source).toContain('SupportModeBanner')
    }
  })

  it('records dedicated support-access security events', () => {
    expect(logger).toContain("| 'support_access'")
    expect(runtime).toContain("logSecurityEvent('support_access'")
    expect(runtime).toContain('trueActorId')
    expect(runtime).toContain('targetProfileId')
  })

  it('enforces selected instructor scope on consequential learning actions', () => {
    expect(gradeActions).toContain("profile.role === 'instructor'")
    expect(gradeActions).toContain("'student_instructor_assignments'")
    expect(assessmentActions).toContain("profile.role === 'instructor'")
    expect(assessmentActions).toContain("'student_instructor_assignments'")
    expect(hourActions).toContain('context.effectiveProfile')
  })

  it('audits support-mode mutations while retaining true actor attribution', () => {
    expect(gradeActions).toContain('logSupportAction(context')
    expect(assessmentActions).toContain('logSupportAction(context')
    expect(hourActions).toContain('logSupportAction(context')
    expect(messagingActions).toContain('logSupportAction(supportContext')
  })

  it('reduces platform-admin privileges to school-admin scope while supporting a school', () => {
    expect(userActions).toContain('context.supportActive ? false : isPlatformAdminProfile(profile)')
    expect(configActions).toContain('!context.supportActive && isPlatformAdminProfile(profile)')
  })
})
