import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs'

/** Only disposable local Supabase. Fails closed if schema/auth differs. */
const origin = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!origin || !key || !['127.0.0.1','localhost'].includes(new URL(origin).hostname) ||
    process.env.ASCYN_TEST_ENVIRONMENT !== 'true')
  throw new Error('Refusing to seed outside disposable local Supabase')
const admin = createClient(origin, key, {auth:{persistSession:false,autoRefreshToken:false}})
const passwd = randomUUID()+'aA!9'
const aId=randomUUID(), bId=randomUUID()
const schools=[
  {id:aId,name:'4D5 Fixture School A',slug:'4d5-a-'+aId.slice(0,8)},
  {id:bId,name:'4D5 Fixture School B',slug:'4d5-b-'+bId.slice(0,8)},
]
const inserted=await admin.from('schools').insert(schools).select('id')
if(inserted.error || inserted.data?.length!==2) throw new Error('School seed failed: '+inserted.error?.message)
const users=[]
for(const [side,school] of [['A',schools[0]],['B',schools[1]]]){
 const email='4d5-'+side.toLowerCase()+'-'+randomUUID()+'@example.test'
 const r=await admin.auth.admin.createUser({email,password:passwd,email_confirm:true})
 if(r.error || !r.data.user) throw new Error('Real Auth creation failed for '+side+': '+r.error?.message)
 users.push({side,school,email,id:r.data.user.id})
 const profile=await admin.from('profiles').upsert({
   id:r.data.user.id,school_id:school.id,email,full_name:'4D5 '+side+' School Admin',
   role:'school_admin',approval_status:'approved',is_disabled:false,requires_password_change:false
 },{onConflict:'id'})
 if(profile.error) throw new Error('Profile seed failed for '+side+': '+profile.error.message)
}
const out=[
 'EXAM_ISOLATION_URL='+origin,
 'EXAM_ISOLATION_ANON_KEY='+process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
 'EXAM_ISOLATION_A_EMAIL='+users[0].email,
 'EXAM_ISOLATION_A_PASSWORD='+passwd,
 'EXAM_ISOLATION_B_EMAIL='+users[1].email,
 'EXAM_ISOLATION_B_PASSWORD='+passwd,
 'EXAM_ISOLATION_A_SCHOOL_ID='+aId,
 'EXAM_ISOLATION_B_SCHOOL_ID='+bId,
 'EXAM_ISOLATION_REPORT_URL=http://127.0.0.1:3000'
].join('\n')+'\n'
fs.writeFileSync('/tmp/ascyn-4d5-fixture.env',out,{mode:0o600})
fs.appendFileSync(process.env.GITHUB_ENV || '/tmp/ascyn-4d5-ci.env',out)
// Do not log passwords or tokens.
console.log('4D5 disposable real Auth identities/profiles provisioned, schools='+schools.length)
