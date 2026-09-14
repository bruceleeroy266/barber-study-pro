import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('instructor active escalation list', () => {
  it('only queries active escalation statuses so cleared/resolved history does not remain in the active list', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/instructor/supabase-client.ts'),
      'utf8',
    )

    const listMethod = source.slice(
      source.indexOf('async listEscalationsForSchool'),
      source.indexOf('async getEscalationForSchool'),
    )

    expect(listMethod).toContain(".in('status', ['pending', 'acknowledged', 'in_progress'])")
    expect(listMethod).not.toContain('auto_cleared')
    expect(listMethod).not.toContain('resolved')
    expect(listMethod).not.toContain('expired')
  })
})
