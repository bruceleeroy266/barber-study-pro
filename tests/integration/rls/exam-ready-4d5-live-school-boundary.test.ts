/**
 * 4D-5 live authenticated cross-school denial probe.
 * Explicitly opt-in, disposable LOCAL instance only. No fixture creation or production writes.
 * Must be run after a separate fixture setup has populated distinct School A and B attempts
 * and finalized checkpoint reports. The probe NEVER logs answer keys or student data.
 *
 * EXAM_ISOLATION_URL=http://127.0.0.1:54321
 * EXAM_ISOLATION_ANON_KEY=<local publishable/anon key>
 * EXAM_ISOLATION_A_EMAIL / _PASSWORD ; _B_EMAIL / _PASSWORD
 * EXAM_ISOLATION_A_SCHOOL_ID / _B_SCHOOL_ID
 * EXAM_ISOLATION_B_ATTEMPT_ID (preseeded B-only record)
 * EXAM_ISOLATION_REPORT_URL (local app origin; e.g. http://127.0.0.1:3000)
 * EXAM_ISOLATION_EXPORT_PATH (actual existing CSV URL path, not a hypothetical endpoint)
 */
import { createClient } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'

const e = process.env
const vars = [
  'EXAM_ISOLATION_URL', 'EXAM_ISOLATION_ANON_KEY',
  'EXAM_ISOLATION_A_EMAIL', 'EXAM_ISOLATION_A_PASSWORD',
  'EXAM_ISOLATION_B_EMAIL', 'EXAM_ISOLATION_B_PASSWORD',
  'EXAM_ISOLATION_A_SCHOOL_ID', 'EXAM_ISOLATION_B_SCHOOL_ID',
  'EXAM_ISOLATION_B_ATTEMPT_ID', 'EXAM_ISOLATION_REPORT_URL',
  'EXAM_ISOLATION_EXPORT_PATH',
] as const

const value = (name: typeof vars[number]): string => {
  const x = e[name]
  if (!x) throw new Error('Missing mandatory isolated fixture: ' + name)
  return x
}

describe('4D-5 real signed-in A/B tenant isolation — local-only integration', () => {
  it('denies A access to populated B rows, report and CSV bytes', async () => {
    for (const name of vars) value(name)
    const db = new URL(value('EXAM_ISOLATION_URL'))
    const web = new URL(value('EXAM_ISOLATION_REPORT_URL'))
    const local = (u: URL) => ['localhost','127.0.0.1','::1','[::1]'].includes(u.hostname)
    if (!local(db) || !local(web) || !['http:','https:'].includes(db.protocol) ||
        !['http:','https:'].includes(web.protocol)) {
      throw new Error('Refusing non-local Supabase/app target; disposable local-only test')
    }
    const aSchool = value('EXAM_ISOLATION_A_SCHOOL_ID')
    const bSchool = value('EXAM_ISOLATION_B_SCHOOL_ID')
    expect(aSchool).not.toBe(bSchool)
    const make = () => createClient(db.toString(), value('EXAM_ISOLATION_ANON_KEY'), {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const a = make(), b = make()
    const logIn = async (client: ReturnType<typeof make>, side: 'A'|'B') => {
      const { data, error } = await client.auth.signInWithPassword({
        email: value(side === 'A' ? 'EXAM_ISOLATION_A_EMAIL' : 'EXAM_ISOLATION_B_EMAIL'),
        password: value(side === 'A' ? 'EXAM_ISOLATION_A_PASSWORD' : 'EXAM_ISOLATION_B_PASSWORD'),
      })
      if (error || !data.session || !data.user) throw new Error('Fixture sign-in failed: ' + side)
      return data
    }
    const as = await logIn(a, 'A')
    await logIn(b, 'B')
    const [{data: ap,error: ape},{data: bp,error: bpe}] = await Promise.all([
      a.from('profiles').select('id,school_id').eq('id',as.user.id).single(),
      b.from('profiles').select('id,school_id').eq('id',(await b.auth.getUser()).data.user!.id).single(),
    ])
    if (ape || bpe) throw new Error('Fixture profile lookup failed')
    expect(ap?.school_id).toBe(aSchool)
    expect(bp?.school_id).toBe(bSchool)

    // Confirm B record genuinely exists under B's authenticated visibility.
    const bId = value('EXAM_ISOLATION_B_ATTEMPT_ID')
    const {data: ownedB,error: ownErr} = await b.from('comprehensive_exam_attempts')
      .select('id,school_id').eq('id',bId).single()
    if (ownErr || ownedB?.school_id !== bSchool) throw new Error('B fixture attempt missing')
    const {data: leaked,error: denialError} = await a.from('comprehensive_exam_attempts')
      .select('id,school_id').eq('id',bId)
    if (denialError) throw new Error('A direct read errored rather than yielding empty rows')
    expect(leaked).toEqual([])
    const {data: foreign,error: foreignError} = await a.from('comprehensive_exam_attempts')
      .select('id,school_id').eq('school_id',bSchool)
    if (foreignError) throw new Error('A tenant query failed unexpectedly')
    expect(foreign).toEqual([])

    // Real Next.js browser session via Supabase auth cookies is NOT the same as bearer auth.
    // Explicitly require the app endpoint to support a signed-in bearer session for this probe.
    const request = async (path: string) => {
      const target = new URL(path,web)
      if (target.origin !== web.origin) throw new Error('Cross-origin test URL rejected')
      return fetch(target, { headers: {Authorization: 'Bearer '+as.session.access_token}, redirect:'manual' })
    }
    const report = await request('/school/pilot-measurement/report/baseline?school='+encodeURIComponent(bSchool))
    const reportText = await report.text()
    if (report.status === 401 || report.status === 403 || (report.status >= 300 && report.status < 400)) {
      expect(reportText).not.toContain(bId)
    } else {
      // A 200 response is only meaningful with real cookie/session support and seeded report data.
      throw new Error('Report returned unexpected status; do not certify bearer-only route test')
    }
    const exportPath = value('EXAM_ISOLATION_EXPORT_PATH')
    if (!exportPath.startsWith('/')) throw new Error('CSV path must be a local absolute route')
    const csv = await request(exportPath)
    const csvText = await csv.text()
    if (![401,403,404].includes(csv.status) && !(csv.status >= 300 && csv.status < 400)) {
      throw new Error('CSV endpoint was not denied; inspect real CSV body and endpoint auth')
    }
    expect(csvText).not.toContain(bId)
  })
})
