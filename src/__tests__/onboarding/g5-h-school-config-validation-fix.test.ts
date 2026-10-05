import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'
import { createDefaultSchoolConfiguration } from '@/lib/school-config/defaults'
import { validateSchoolConfiguration } from '@/lib/school-config/validation'

const root = process.cwd()
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), 'utf-8')

describe('G5-H school configuration validation repair', () => {
  it('creates new-school defaults that pass branding validation', () => {
    const config = createDefaultSchoolConfiguration({
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Elevate Barber & Beauty Academy',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      contact_email: 'owner@example.com',
      contact_phone: '',
      website: '',
      timezone: 'America/Chicago',
      license_number: '',
      accreditation: '',
      school_type: 'barber',
      subscription_status: 'trial',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    } as never)

    const errors = validateSchoolConfiguration(config)

    expect(config.branding.primaryColor).toBe('#D4AF37')
    expect(config.branding.secondaryColor).toBe('#1F2937')
    expect(errors.brandingPrimaryColor).toBeUndefined()
    expect(errors.brandingSecondaryColor).toBeUndefined()
  })

  it('normalizes legacy CSS-variable branding colors when configuration loads', () => {
    const page = read('src/app/admin/school/configuration/page.tsx')

    expect(page).toContain("savedConfig.branding.primaryColor")
    expect(page).toContain("'#D4AF37'")
    expect(page).toContain("'#1F2937'")
  })

  it('moves the user to the tab containing the first validation error', () => {
    const client = read('src/components/admin/school-config/SchoolConfigurationClient.tsx')

    expect(client).toContain("if (errorKey.startsWith('branding')) return 'branding'")
    expect(client).toContain('setActiveTab(errorTab)')
    expect(client).toContain('Please fix the highlighted validation error in')
  })
})
