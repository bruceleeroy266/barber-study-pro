import { expect, type Page } from '@playwright/test'
import type { SupabaseClient } from '@supabase/supabase-js'

/** Only call with verified localhost Supabase and localhost Next.js. Never production. */
export async function verifySyntheticExamReadyApi(service: SupabaseClient, studentPage: Page) {
  if (process.env.ASCYN_TEST_ENVIRONMENT !== 'true' ||
      !/^https?:\/\/(127\.0\.0\.1|localhost):\d+/.test(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '') ||
      !/^https?:\/\/(127\.0\.0\.1|localhost):\d+/.test(studentPage.url())) {
    throw new Error('Synthetic Exam Ready fixture is strictly localhost-only')
  }
  const domains = [
    ['scientific_concepts', 35],
    ['implements_equipment', 10],
    ['hair_care_services', 40],
    ['facial_hair_skin_care_services', 15],
  ] as const
  const qs = domains.flatMap(([domain, count]) => Array.from({length:count}, (_, i) => ({
    source_question_id: `qa-synthetic-${domain}-${i}`,
    source_kind: 'certified_original',
    domain,
    prompt: `Synthetic QA question ${domain} ${i}? No source content.`,
    option_a:'Synthetic choice A', option_b:'Synthetic choice B',
    option_c:'Synthetic choice C', option_d:'Synthetic choice D',
    correct_option:'a', explanation:'Synthetic QA only',
    content_version:'qa-local-1', provenance:{sourceBasis:'INTERNAL_QA_NOT_PUBLIC'},
  })))
  for(let i=0;i<10;i++) qs.push({
    source_question_id:`qa-synthetic-spare-${i}`,source_kind:'certified_original',
    domain:'scientific_concepts',prompt:`Synthetic QA spare item ${i}?`,
    option_a:'Synthetic choice A',option_b:'Synthetic choice B',
    option_c:'Synthetic choice C',option_d:'Synthetic choice D',
    correct_option:'a',explanation:'Synthetic QA only',content_version:'qa-local-1',
    provenance:{sourceBasis:'INTERNAL_QA_NOT_PUBLIC'},
  })
  const {data:cfg,error:cfgError}=await service.from('comprehensive_exam_configs').insert({
    slug:'qa-synthetic-only',version:1,title:'Synthetic QA Exam',
    status:'active',blueprint_version:'qa-blueprint',
    question_bank_version:'qa-local-1',scoring_policy_version:'qa-scoring',
    time_limit_seconds:5400,passing_percentage:75,
    scored_question_count:100,unscored_question_count:10,
    activated_at:new Date().toISOString(),
  }).select('id').single()
  if(cfgError || !cfg) throw new Error('QA config: '+cfgError?.message)
  const {data:questions,error:questionError}=await service.from('comprehensive_exam_questions').insert(qs).select('id,source_question_id')
  if(questionError || !questions || questions.length!==110) throw new Error('QA questions: '+questionError?.message)
  const {error:mapError}=await service.from('comprehensive_exam_config_questions').insert(questions.map(q=>({
    config_id:cfg.id,question_id:q.id,
    scored_eligible:!q.source_question_id.includes('spare'),
    unscored_eligible:q.source_question_id.includes('spare'),is_active:true,
  })))
  if(mapError) throw new Error('QA mapping: '+mapError.message)
  const result = await studentPage.evaluate(async (configId)=>{
    const get = async (path:string)=>{const r=await fetch(path);return {status:r.status,body:await r.json()}}
    const config=await get('/api/comprehensive-exam/config')
    const created=await fetch('/api/comprehensive-exam/attempts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({configId})})
    const attempt=await created.json()
    const id=attempt.attempt?.attemptId
    const detail=id?await get('/api/comprehensive-exam/attempts/'+id):null
    return {config,createdStatus:created.status,attempt,detail}
  },cfg.id)
  expect(result.config.status).toBe(200)
  expect(result.config.body.config?.configId).toBe(cfg.id)
  expect(result.createdStatus).toBe(200)
  expect(result.detail?.status).toBe(200)
  const detail = result.detail?.body?.attempt
  expect(detail?.items).toHaveLength(110)
  const serialized=JSON.stringify(result)
  expect(serialized).not.toMatch(/sourceBasis|sourceProvenance|correct_option_snapshot|correctOptionSnapshot|INTERNAL_QA_NOT_PUBLIC/)
  expect(detail?.items?.[0]?.prompt).toContain('Synthetic QA')
  console.log('Authenticated 110-item synthetic Exam Ready API response verified (no private metadata/answer key)')
}
