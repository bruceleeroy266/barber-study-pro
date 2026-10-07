import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('ADMIN-SUPPORT-ACCESS-2 navigation', () => {
  const nav = fs.readFileSync(path.join(process.cwd(), 'src/components/AdminNav.tsx'), 'utf8')

  it('shows Support Access in platform admin navigation', () => {
    expect(nav).toContain("href: '/admin/support-access'")
    expect(nav).toContain("label: 'Support Access'")
    expect(nav).toContain('LifeBuoy')
  })
})
