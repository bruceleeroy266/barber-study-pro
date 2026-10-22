/** Direct RPC adversarial tests; disposable local Supabase only. */
import { beforeAll, afterAll, describe, expect, test } from 'vitest'
import { assertTestEnvironment } from '../setup/production-guard'
import { setupTestEnvironment, cleanupTestEnvironment, createAuthenticatedClient, getServiceClient, resolveActorId } from '../setup/db-helpers'
import { TEST_ACTORS, TEST_SCHOOLS } from '../setup/test-actors'
const seeded:string[]=[]
const date='2027-05-11'
beforeAll(async()=>{
  assertTestEnvironment()
  await setupTestEnvironment()
  const service=getServiceClient()
  for(const side of ['A','B'] as const){
    const {data,error}=await service.from('student_instructor_assignments').insert({
      school_id:TEST_SCHOOLS[`SCHOOL_${side}`].id,
      student_id:resolveActorId(`STUDENT_${side}`),
      instructor_id:resolveActorId(`INSTRUCTOR_${side}`),is_active:true,
    }).select('id').single()
    if(error||!data)throw new Error(error?.message||'assignment seed failed')
    seeded.push(data.id)
  }
  for(const key of ['PLATFORM_ADMIN','INSTRUCTOR_A','INSTRUCTOR_B','SCHOOL_ADMIN_A','SCHOOL_ADMIN_B'] as const){
    const {error}=await service.from('profiles').update({approval_status:'approved',is_disabled:false}).eq('id',resolveActorId(key))
    if(error)throw new Error(error.message)
  }
  const schoolAdmin=await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)
  expect((await schoolAdmin.rpc('set_school_support_authorization',{p_enable:true})).error).toBeNull()
})
afterAll(async()=>{
  const service=getServiceClient()
  await service.from('student_schedule_overrides').delete().eq('override_date',date)
    .in('school_id',[TEST_SCHOOLS.SCHOOL_A.id,TEST_SCHOOLS.SCHOOL_B.id])
  if(seeded.length)await service.from('student_instructor_assignments').delete().in('id',seeded)
  await cleanupTestEnvironment()
})
const args=(target:string,student:string)=>({
  p_target_instructor:target,p_student:student,p_override_date:date,
  p_override_type:'off',p_start_time:null,p_end_time:null,p_break_minutes:0,
  p_reason:'disposable-rpc-adversarial-test',
})
async function counts(){
  const {data,error}=await getServiceClient().from('student_schedule_overrides')
    .select('id,school_id,student_id,created_by').eq('override_date',date)
    .in('school_id',[TEST_SCHOOLS.SCHOOL_A.id,TEST_SCHOOLS.SCHOOL_B.id])
  if(error)throw new Error(error.message)
  return data??[]
}
describe('direct authenticated Support Mode schedule RPC',()=>{
  test('school administrator controls consent and revocation immediately stops support',async()=>{
    const platform=await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)
    const schoolA=await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)
    const schoolB=await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_B)
    const instructor=await createAuthenticatedClient(TEST_ACTORS.INSTRUCTOR_A)
    const target=resolveActorId('INSTRUCTOR_A')
    expect((await schoolA.rpc('set_school_support_authorization',{p_enable:true})).error).toBeNull()
    expect((await platform.rpc('set_school_support_authorization',{p_enable:true})).error).not.toBeNull()
    expect((await instructor.rpc('set_school_support_authorization',{p_enable:true})).error).not.toBeNull()
    // A school-scoped generic admin does not acquire consent-authorizer
    // privilege. Platform admins cannot self-grant either.
    // Consent rows are intentionally not directly readable by API roles.
    // Query the school-scoped SECURITY DEFINER status RPC instead.
    const {data:grantRows,error:grantError}=await schoolA.rpc('get_school_support_authorization')
    expect(grantError).toBeNull()
    expect(grantRows).toHaveLength(1)
    expect(grantRows?.[0].active).toBe(true)
    expect(grantRows?.[0].authorized_by).toBe(resolveActorId('SCHOOL_ADMIN_A'))

    expect((await platform.rpc('set_support_access_session',{p_target:resolveActorId('INSTRUCTOR_B'),p_enable:true})).error).not.toBeNull()
    expect((await platform.rpc('set_support_access_session',{p_target:target,p_enable:true})).error).toBeNull()
    expect((await platform.rpc('is_support_access_session_active',{p_target:target})).data).toBe(true)
    const before=await counts()
    expect((await schoolB.rpc('set_school_support_authorization',{p_enable:false})).error).toBeNull()
    expect((await platform.rpc('is_support_access_session_active',{p_target:target})).data).toBe(true)
    expect((await schoolA.rpc('set_school_support_authorization',{p_enable:false})).error).toBeNull()
    expect((await platform.rpc('is_support_access_session_active',{p_target:target})).data).toBe(false)
    expect((await platform.rpc('support_upsert_student_schedule_override',args(target,resolveActorId('STUDENT_A')))).error).not.toBeNull()
    expect((await platform.rpc('set_support_access_session',{p_target:target,p_enable:true})).error).not.toBeNull()
    expect(await counts()).toEqual(before)
    expect((await schoolA.rpc('set_school_support_authorization',{p_enable:true})).error).toBeNull()
  })
  test('direct privileged RPC requires an active session and rejects revoked sessions',async()=>{
    const admin=await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)
    await admin.rpc('set_support_access_session',{p_target:resolveActorId('INSTRUCTOR_A'),p_enable:false})
    const before=await counts()
    const inactive=await admin.rpc('is_support_access_session_active',{p_target:resolveActorId('INSTRUCTOR_A')})
    expect(inactive.error).toBeNull()
    expect(inactive.data).toBe(false)
    const noSession=await admin.rpc('support_upsert_student_schedule_override',args(resolveActorId('INSTRUCTOR_A'),resolveActorId('STUDENT_A')))
    expect(noSession.error).not.toBeNull()
    expect(await counts()).toEqual(before)
    const {error:activateError}=await admin.rpc('set_support_access_session',{p_target:resolveActorId('INSTRUCTOR_A'),p_enable:true})
    expect(activateError).toBeNull()
    expect((await admin.rpc('is_support_access_session_active',{p_target:resolveActorId('INSTRUCTOR_A')})).data).toBe(true)
    const wrongTarget=await admin.rpc('support_upsert_student_schedule_override',args(resolveActorId('INSTRUCTOR_B'),resolveActorId('STUDENT_B')))
    expect(wrongTarget.error).not.toBeNull()
    expect(await counts()).toEqual(before)
    const {error:revokeError}=await admin.rpc('set_support_access_session',{p_target:resolveActorId('INSTRUCTOR_A'),p_enable:false})
    expect(revokeError).toBeNull()
    expect((await admin.rpc('is_support_access_session_active',{p_target:resolveActorId('INSTRUCTOR_A')})).data).toBe(false)
    const revoked=await admin.rpc('support_upsert_student_schedule_override',args(resolveActorId('INSTRUCTOR_A'),resolveActorId('STUDENT_A')))
    expect(revoked.error).not.toBeNull()
    expect(await counts()).toEqual(before)
  })
  test('expired database session denies resolver check and privileged schedule mutation',async()=>{
    const admin=await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)
    const target=resolveActorId('INSTRUCTOR_A')
    expect((await admin.rpc('set_support_access_session',{p_target:target,p_enable:true})).error).toBeNull()
    const service=getServiceClient()
    const {error:expireError}=await service.from('support_access_sessions')
      .update({expires_at:'2020-01-01T00:00:00.000Z'})
      .eq('actor_id',resolveActorId('PLATFORM_ADMIN'))
    if(expireError)throw new Error(expireError.message)
    const active=await admin.rpc('is_support_access_session_active',{p_target:target})
    expect(active.error).toBeNull()
    expect(active.data).toBe(false)
    const before=await counts()
    const attempt=await admin.rpc('support_upsert_student_schedule_override',
      args(target,resolveActorId('STUDENT_A')))
    expect(attempt.error).not.toBeNull()
    expect(await counts()).toEqual(before)
    expect((await admin.rpc('set_support_access_session',{p_target:target,p_enable:false})).error).toBeNull()
  })
  test('authorized School A success persists true actor only in A',async()=>{
    const admin=await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)
    expect((await admin.rpc('set_support_access_session',{p_target:resolveActorId('INSTRUCTOR_A'),p_enable:true})).error).toBeNull()
    const {error}=await admin.rpc('support_upsert_student_schedule_override',
      args(resolveActorId('INSTRUCTOR_A'),resolveActorId('STUDENT_A')))
    expect(error).toBeNull()
    const rows=await counts()
    expect(rows.filter(r=>r.school_id===TEST_SCHOOLS.SCHOOL_A.id)).toHaveLength(1)
    expect(rows.find(r=>r.school_id===TEST_SCHOOLS.SCHOOL_A.id)?.created_by).toBe(resolveActorId('PLATFORM_ADMIN'))
    expect(rows.filter(r=>r.school_id===TEST_SCHOOLS.SCHOOL_B.id)).toHaveLength(0)
  })
  test('School A instructor paired with School B student is denied, without write',async()=>{
    const before=await counts()
    const admin=await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)
    const {error}=await admin.rpc('support_upsert_student_schedule_override',
      args(resolveActorId('INSTRUCTOR_A'),resolveActorId('STUDENT_B')))
    expect(error).not.toBeNull()
    expect(await counts()).toEqual(before)
  })
  test('student or instructor cannot invoke privileged RPC',async()=>{
    const before=await counts()
    for(const key of ['INSTRUCTOR_A','STUDENT_A'] as const){
      const caller=await createAuthenticatedClient(TEST_ACTORS[key])
      const {error}=await caller.rpc('support_upsert_student_schedule_override',
        args(resolveActorId('INSTRUCTOR_A'),resolveActorId('STUDENT_A')))
      expect(error).not.toBeNull()
    }
    expect(await counts()).toEqual(before)
  })
  test('invalid target instructor and invalid schedule fields are denied',async()=>{
    const before=await counts()
    const admin=await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)
    for(const variant of [
      args(resolveActorId('STUDENT_A'),resolveActorId('STUDENT_A')),
      {...args(resolveActorId('INSTRUCTOR_A'),resolveActorId('STUDENT_A')),p_override_type:'invalid'},
      {...args(resolveActorId('INSTRUCTOR_A'),resolveActorId('STUDENT_A')),p_break_minutes:-1},
    ]){
      const {error}=await admin.rpc('support_upsert_student_schedule_override',variant)
      expect(error).not.toBeNull()
    }
    expect(await counts()).toEqual(before)
  })
})
