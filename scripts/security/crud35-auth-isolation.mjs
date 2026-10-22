/**
 * SCHOOL-ADMIN-CRUD-35 — isolated authenticated smoke test.
 * Run only with a disposable branch URL, publishable/anon key and service-role key.
 * Never log tokens or credentials. Does NOT test rollback; use a separate branch snapshot.
 * Invocation: ASCYN_TEST_URL=... ASCYN_TEST_ANON_KEY=... ASCYN_TEST_SERVICE_KEY=...
 *             node scripts/security/crud35-auth-isolation.mjs
 */
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const EXPECTED_REF = 'iarbvjfueumrengsgabx'
const url = process.env.ASCYN_TEST_URL
const pub = process.env.ASCYN_TEST_ANON_KEY
const secret = process.env.ASCYN_TEST_SERVICE_KEY
assert(url && pub && secret, 'Missing isolated-test credentials')
const host = new URL(url).hostname
assert.equal(host, EXPECTED_REF + '.supabase.co', 'Refusing to use unexpected Supabase project')
assert.notEqual(pub, secret, 'Never use service key as client key')
assert.equal(process.env.ASCYN_ALLOW_DISPOSABLE_WRITES, 'yes', 'Explicit disposable-write gate required')
const admin = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } })
const tag = 'crud35-' + randomUUID()
const users = []
const schools = []
let failed = false
const client = () => createClient(url, pub, { auth: { persistSession: false, autoRefreshToken: false } })
const must = ({ data, error }, label) => { if (error) throw new Error(label + ': ' + error.message); return data }
const check = (result, label) => { assert(!result.error, label + ': ' + result.error?.message); return result.data }
const rowSignature = rows => JSON.stringify((rows ?? []).map(({ created_at, updated_at, ...r }) => r).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))))
async function createSchool(suffix) {
  const result = must(await admin.from('schools').insert({ name: tag + '-' + suffix, slug: tag + '-' + suffix }).select('id').single(), 'create school')
  schools.push(result.id)
  return result.id
}
async function createUser(role, school, suffix) {
  const email = tag + '-' + suffix + '@example.invalid'
  const password = randomUUID() + 'aA!8'
  const created = must(await admin.auth.admin.createUser({ email, password, email_confirm: true }), 'create disposable auth user').user
  users.push(created.id)
  must(await admin.from('profiles').upsert({ id: created.id, email, full_name: tag + ' ' + suffix, role, school_id: school, approval_status: 'approved', is_disabled: false }), 'create profile')
  const c = client()
  const login = must(await c.auth.signInWithPassword({ email, password }), 'real login')
  assert(login.session?.access_token, 'No JWT issued')
  return { id: created.id, c, jwt: login.session.access_token }
}
async function main() {
  const schoolA = await createSchool('A')
  const schoolB = await createSchool('B')
  const studentA = await createUser('student', schoolA, 'studentA')
  const studentB = await createUser('student', schoolB, 'studentB')
  const adminA = await createUser('school_admin', schoolA, 'adminA')
  const adminB = await createUser('school_admin', schoolB, 'adminB')
  // This test uses a safe, non-production quiz attempt and progress record.
  const quiz = must(await admin.from('quiz_attempts').insert({ user_id: studentA.id, quiz_id: tag, score: 1, total_questions: 2, percentage: 50 }).select('id').single(), 'seed quiz')
  const progress = must(await admin.from('student_progress').insert({ user_id: studentA.id, chapter_id: tag, best_quiz_score: 50 }).select('id').single(), 'seed progress')
  const records = [
    { table: 'quiz_attempts', id: quiz.id },
    { table: 'student_progress', id: progress.id }
  ]
  const snapshot = async () => {
    const output = {}
    for (const {table,id} of records) output[table] = rowSignature(must(await admin.from(table).select('*').eq('id', id), 'snapshot ' + table))
    return output
  }
  const before = await snapshot()
  const own = await studentA.c.from('profiles').select('id').eq('id',studentA.id)
  assert.equal(check(own,'active own profile').length,1)
  const other = await studentA.c.from('profiles').select('id').eq('id',studentB.id)
  assert.equal(check(other,'cross-school student profile').length,0)
  const otherAdmin = await adminB.c.from('profiles').select('id').eq('id',studentA.id)
  assert.equal(check(otherAdmin,'cross-school admin profile').length,0)
  // Disable AFTER logging in. No refresh or new login is allowed before denial assertions.
  must(await admin.from('profiles').update({is_disabled:true}).eq('id',studentA.id), 'disable student A')
  must(await admin.from('profiles').update({is_disabled:true}).eq('id',adminA.id), 'disable admin A')
  for (const {account,label} of [{account:studentA,label:'studentA'},{account:adminA,label:'adminA'}]) {
    const v = await account.c.from('profiles').select('id').eq('id',account.id)
    assert.equal(check(v,label + ' retained JWT profile read').length,0)
    const q = await account.c.from('quiz_attempts').select('id').eq('id',quiz.id)
    assert.equal(check(q,label + ' retained JWT quiz read').length,0)
  }
  assert.equal(check(await studentB.c.from('profiles').select('id').eq('id',studentB.id),'student B uninterrupted').length,1)
  assert.equal(check(await adminB.c.from('profiles').select('id').eq('id',studentB.id),'admin B uninterrupted').length,1)
  must(await admin.from('profiles').update({is_disabled:false}).eq('id',studentA.id), 'reactivate student A')
  must(await admin.from('profiles').update({is_disabled:false}).eq('id',adminA.id), 'reactivate admin A')
  assert.equal(check(await studentA.c.from('profiles').select('id').eq('id',studentA.id),'reactivated student A').length,1)
  assert.deepEqual(await snapshot(),before,'academic records changed across disable/reactivate')
  console.log(JSON.stringify({test:'CRUD-35 isolated JWT and row-retention',passed:true,branch:EXPECTED_REF,checks:['School A/B','retained JWT','disable/reactivate','quiz/progress preservation']}))
}
try { await main() } catch (error) { failed=true; console.error('FAIL:',error.message); process.exitCode=1 }
finally {
 // Cleanup only identities and rows created under this unique tag.
 // Explicitly delete seeded children before auth users, and never touch existing accounts.
 for (const id of users) {
   await admin.from('quiz_attempts').delete().eq('user_id',id).eq('quiz_id',tag)
   await admin.from('student_progress').delete().eq('user_id',id).eq('chapter_id',tag)
 }
 for (const id of users.reverse()) {
   const { error } = await admin.auth.admin.deleteUser(id)
   if(error) { console.error('Disposable auth cleanup failed:',error.message); process.exitCode=1 }
 }
 for (const id of schools.reverse()) {
   const {error} = await admin.from('schools').delete().eq('id',id)
   if(error) { console.error('Disposable school cleanup failed:',error.message); process.exitCode=1 }
 }
 if(failed) console.error('Certification withheld. Verify cleanup manually within the isolated project.')
}
