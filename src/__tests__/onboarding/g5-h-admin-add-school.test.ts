import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), 'utf-8')

describe('G5-H platform-admin Add School flow', () => {
  it('shows Add School from the platform admin dashboard', () => {
    const admin = read('src/app/admin/page.tsx')

    expect(admin).toContain('Add School')
    expect(admin).toContain('/admin/pilot-inquiries?add=school')
    expect(admin).toContain('{isPlatformAdmin && (')
  })

  it('gates the Add School control to platform admins on Pilot Inquiries', () => {
    const page = read('src/app/admin/pilot-inquiries/page.tsx')

    expect(page).toContain("const isPlatformAdmin = profile.role === 'admin' && profile.school_id === null")
    expect(page).toContain('isPlatformAdmin && <AddSchoolModal')
  })

  it('reuses the certified inquiry approval and school provisioning pipeline', () => {
    const actions = read('src/app/admin/pilot-inquiries/actions.ts')

    expect(actions).toContain('export async function addSchoolFromAdmin')
    expect(actions).toContain("profile.role !== 'admin' || profile.school_id !== null")
    expect(actions).toContain("from('pilot_inquiries')")
    expect(actions).toContain('const approval = await approvePilotInquiry(inquiryId)')
    expect(actions).toContain('const creation = await createSchoolFromInquiry(inquiryId)')
    expect(actions).not.toContain("from('school_settings').insert")
    expect(actions).not.toContain("from('programs').insert")
  })

  it('keeps admin-created pilot schools Barbering-only and cohort-limited', () => {
    const actions = read('src/app/admin/pilot-inquiries/actions.ts')

    expect(actions).toContain("program_type: 'Barbering'")
    expect(actions).toContain('Number(cohortSize) > 30')
  })
})
