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
// Seed real student identities and populated cross-tenant evidence, using only local service-role API.
const studentIds=[]
for(const [i,school] of schools.entries()){
 const studentEmail='4d5-student-'+i+'-'+randomUUID()+'@example.test'
 const u=await admin.auth.admin.createUser({email:studentEmail,password:passwd,email_confirm:true})
 if(u.error || !u.data.user) throw new Error('Student Auth seed failed: '+u.error?.message)
 studentIds.push(u.data.user.id)
 const pr=await admin.from('profiles').upsert({
   id:u.data.user.id,school_id:school.id,email:studentEmail,
   full_name:i===0?'4D5-A-CSV-MARKER':'4D5-B-CSV-MARKER',
   role:'student',approval_status:'approved',is_disabled:false,
   requires_password_change:false
 },{onConflict:'id'})
 if(pr.error) throw new Error('Student profile fixture failed: '+pr.error.message)
}
const config=await admin.from('comprehensive_exam_configs').insert({
 slug:'4d5-fixture-'+randomUUID(),version:1,title:'4D5 synthetic fixture',
 status:'draft',blueprint_version:'4d5-fixture',question_bank_version:'4d5-synthetic',
 scoring_policy_version:'4d5-fixture',scored_question_count:100,unscored_question_count:10
}).select('id').single()
if(config.error || !config.data) throw new Error('Config seed failed: '+config.error?.message)
const now=new Date()
const start=new Date(now.getTime()-3600000).toISOString()
const end=new Date(now.getTime()+3600000).toISOString()
const sess=await admin.from('study_sessions').insert(schools.map((school,i)=>({
 user_id:studentIds[i],school_id:school.id,surface_type:'quiz',
 surface_id:'4d5-fixture',opened_at:start
}))).select('id,school_id')
if(sess.error || sess.data?.length!==2) throw new Error('Study session seed failed: '+sess.error?.message)
const attempts=await admin.from('comprehensive_exam_attempts').insert(schools.map((school,i)=>({
 user_id:studentIds[i],school_id:school.id,config_id:config.data.id,
 config_version:1,blueprint_version:'4d5-fixture',
 question_bank_version:'4d5-synthetic',scoring_policy_version:'4d5-fixture',
 status:'active',started_at:start,expires_at:end,attempt_number:1,
 study_session_id:sess.data.find(x=>x.school_id===school.id)?.id
}))).select('id,school_id')
if(attempts.error || attempts.data?.length!==2) throw new Error('Exam attempt seed failed: '+attempts.error?.message)
const periods=await admin.from('pilot_measurement_periods').insert(schools.map((school,i)=>({
 school_id:school.id,status:'active',pilot_start_date:'2026-09-01',
 pilot_end_date:'2026-11-30',timezone:'UTC',created_by:users[i].id,
 activated_by:users[i].id,activated_at:start
}))).select('id,school_id')
if(periods.error || periods.data?.length!==2) throw new Error('Pilot period seed failed: '+periods.error?.message)
const checkpoint=await admin.from('pilot_measurement_checkpoints').insert(schools.map((school,i)=>({
 pilot_period_id:periods.data.find(x=>x.school_id===school.id)?.id,
 school_id:school.id,checkpoint_type:'baseline',target_date:'2026-09-01',
 cutoff_at:start,generated_by:users[i].id,status:'finalized',
 finalized_at:start,included_student_count:1,included_student_ids:[studentIds[i]],
 excluded_student_count:0,excluded_student_ids:[],
 coverage:{activity:{measured:0,total:1},examReady:{measured:1,total:1},
 chapterQuiz:{measured:0,total:1},readiness:{measured:0,total:1}},
 metrics:{totalActiveStudySeconds:0,averageActiveStudySeconds:null,
 activeLearnerCount:0,noActivityLearnerCount:1,averageLatestExamPercentage:i===0?61:93,
 examPassingRate:i===0?0:100,averageExamElapsedSeconds:null,averageExamUnanswered:null,
 examDomainPercentages:{},averageOverallProgress:null,averageReadinessScore:null,
 needsAttentionCount:i===0?1:0,activeRemediationLearnerCount:0},
 notes:{fixture:i===0?'4D5-A-REPORT-MARKER':'4D5-B-REPORT-MARKER'}
}))).select('id,school_id')
if(checkpoint.error || checkpoint.data?.length!==2) throw new Error('Checkpoint seed failed: '+checkpoint.error?.message)
const bAttempt=attempts.data.find(x=>x.school_id===bId)?.id
if(!bAttempt)throw new Error('B attempt missing from seeded database')
const out=[
 'EXAM_ISOLATION_URL='+origin,
 'EXAM_ISOLATION_ANON_KEY='+process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
 'EXAM_ISOLATION_A_EMAIL='+users[0].email,
 'EXAM_ISOLATION_A_PASSWORD='+passwd,
 'EXAM_ISOLATION_B_EMAIL='+users[1].email,
 'EXAM_ISOLATION_B_PASSWORD='+passwd,
 'EXAM_ISOLATION_A_SCHOOL_ID='+aId,
 'EXAM_ISOLATION_B_SCHOOL_ID='+bId,
 'EXAM_ISOLATION_B_ATTEMPT_ID='+bAttempt,
 'EXAM_ISOLATION_B_REPORT_MARKER=93%',
 'EXAM_ISOLATION_A_CSV_MARKER=4D5-A-CSV-MARKER',
 'EXAM_ISOLATION_B_CSV_MARKER=4D5-B-CSV-MARKER',
 'EXAM_ISOLATION_REPORT_URL=http://127.0.0.1:3000'
].join('\n')+'\n'
fs.writeFileSync('/tmp/ascyn-4d5-fixture.env',out,{mode:0o600})
fs.appendFileSync(process.env.GITHUB_ENV || '/tmp/ascyn-4d5-ci.env',out)
// Do not log passwords or tokens.
console.log('4D5 disposable real Auth identities/profiles provisioned, schools='+schools.length)
