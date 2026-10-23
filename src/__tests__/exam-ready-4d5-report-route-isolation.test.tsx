import { beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  user: { id: 'school-a-admin' } as { id: string } | null,
  profile: { role: 'school_admin', school_id: 'school-a' } as { role: string, school_id: string | null } | null,
  schools: [{ id: 'school-a' }, { id: 'school-b' }],
  calls: [] as Array<{ table: string, field: string, value: unknown }>,
}))

vi.mock('next/navigation', () => ({
  notFound: () => { throw new Error('NOT_FOUND') },
  redirect: (url: string) => { throw new Error('REDIRECT:' + url) },
}))
vi.mock('@/lib/auth-helpers', () => ({
  isAdmin: (role: string) => role === 'admin',
  isSchoolAdmin: (role: string) => role === 'school_admin',
  isPlatformAdminProfile: (profile: { role: string, school_id: string | null }) =>
    profile.role === 'admin' && profile.school_id === null,
}))
vi.mock('@/lib/supabase-server', () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: state.user } }) },
    from: (table: string) => {
      const conditions: Record<string, unknown> = {}
      const chain = {
        select: () => chain,
        eq: (field: string, value: unknown) => {
          conditions[field] = value
          state.calls.push({ table, field, value })
          return chain
        },
        is: () => chain,
        single: async () => ({ data: table === 'profiles' ? state.profile : null }),
        maybeSingle: async () => ({
          data: table === 'schools'
            ? state.schools.find(s => s.id === conditions.id) ?? null
            : null,
        }),
      }
      return chain
    },
  }),
}))

import SchoolReport from '@/app/school/pilot-measurement/report/[checkpoint]/page'
import AdminReport from '@/app/admin/school/pilot-measurement/report/[checkpoint]/page'

const args = (school: string) => ({
  params: Promise.resolve({ checkpoint: 'baseline' }),
  searchParams: Promise.resolve({ school }),
})

describe('4D-5 authenticated school A/B pilot report route isolation (negative tests)', () => {
  beforeEach(() => {
    state.user = { id: 'school-a-admin' }
    state.profile = { role: 'school_admin', school_id: 'school-a' }
    state.calls.length = 0
  })

  it('school A report stays bound to authenticated school A (no school B selection)', async () => {
    const element = await SchoolReport({ params: args('school-b').params })
    expect(element.props.schoolId).toBe('school-a')
    expect(JSON.stringify(element.props)).not.toContain('school-b')
  })

  it('school A cannot override the admin report target to school B', async () => {
    const element = await AdminReport(args('school-b'))
    expect(element.props.schoolId).toBe('school-a')
    expect(state.calls.some(c => c.table === 'schools' && c.value === 'school-b')).toBe(false)
  })

  it('unauthenticated and student sessions are denied both report entrypoints', async () => {
    state.user = null
    await expect(SchoolReport({ params: args('school-b').params })).rejects.toThrow('REDIRECT:/login')
    await expect(AdminReport(args('school-b'))).rejects.toThrow('REDIRECT:/login')
    state.user = { id: 'school-a-student' }
    state.profile = { role: 'student', school_id: 'school-a' }
    await expect(SchoolReport({ params: args('school-b').params })).rejects.toThrow('REDIRECT:/dashboard')
    await expect(AdminReport(args('school-b'))).rejects.toThrow('REDIRECT:/dashboard')
  })

  it('platform administrator alone can select verified active school B', async () => {
    state.profile = { role: 'admin', school_id: null }
    const element = await AdminReport(args('school-b'))
    expect(element.props.schoolId).toBe('school-b')
    expect(state.calls).toContainEqual({ table: 'schools', field: 'id', value: 'school-b' })
  })

  it('unknown school is denied to platform administrator', async () => {
    state.profile = { role: 'admin', school_id: null }
    await expect(AdminReport(args('missing-school'))).rejects.toThrow('REDIRECT:/admin/school/pilot-measurement')
  })
})
