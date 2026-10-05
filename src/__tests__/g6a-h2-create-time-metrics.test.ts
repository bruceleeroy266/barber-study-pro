import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), 'utf8')

describe('G6-A H2 create-time school metrics classification', () => {
  it('exposes School Metrics on both learner creation paths with Included as the default', () => {
    const client = read('src/app/admin/users/UserManagementClient.tsx')

    expect(client).toContain('id="create-school-metrics"')
    expect(client).toContain('id="invite-school-metrics"')
    expect(client).toContain('name="include_in_school_metrics"')
    expect(client).toContain('defaultValue="true"')
    expect(client).toContain('Included — counts toward school/class performance')
    expect(client).toContain('Excluded — individual data stays visible, does not affect aggregates')
    expect(client).toContain("createRole === 'student' || createRole === 'apprentice'")
    expect(client).toContain("inviteRole === 'student' || inviteRole === 'apprentice'")
  })

  it('submits the selected value through both Create User and Invite User', () => {
    const client = read('src/app/admin/users/UserManagementClient.tsx')
    const matches = client.match(/include_in_school_metrics: String\(form\.get\('include_in_school_metrics'\) \?\? 'true'\) !== 'false'/g) ?? []

    expect(matches).toHaveLength(2)
  })

  it('persists create-time classification and clamps non-learners to Included on the server', () => {
    const actions = read('src/app/admin/users/actions.ts')

    expect(actions).toContain('include_in_school_metrics?: boolean')
    expect(actions).toContain("if (role !== 'student' && role !== 'apprentice') return true")
    expect(actions).toContain('return requested !== false')
    expect(actions).toContain('include_in_school_metrics: resolveSchoolMetricsInclusion(')

    const resolverUses = actions.match(/resolveSchoolMetricsInclusion\(/g) ?? []
    expect(resolverUses.length).toBeGreaterThanOrEqual(5)
  })

  it('records create and invite metrics classification in audit payloads', () => {
    const actions = read('src/app/admin/users/actions.ts')
    const createAudit = actions.slice(actions.indexOf("'create_user'"), actions.indexOf("'create_user'") + 900)
    const inviteAudit = actions.slice(actions.indexOf("'invite_user'"), actions.indexOf("'invite_user'") + 900)

    expect(createAudit).toContain('include_in_school_metrics')
    expect(inviteAudit).toContain('include_in_school_metrics')
  })
})
