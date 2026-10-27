'use server'

import { createClient as createAdminSupabase } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-server'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { isStudentAssignedToInstructor } from '@/lib/instructor/assignments'
import { chapter5ConceptFamilies } from '@/lib/chapter-5-concepts/concepts'
import { chapter5ContentConceptMappings, chapter5FlashcardConceptMappings } from '@/lib/chapter-5-concepts/mappings'
import { revalidatePath } from 'next/cache'

export async function assignChapter5Review(studentId: string, conceptId: string): Promise<{success:boolean;message:string}> {
  const supabase = await createClient()
  const {data:{user}} = await supabase.auth.getUser()
  if (!user) return {success:false,message:'Sign in required'}
  const {data:staff} = await supabase.from('profiles').select('school_id,role').eq('id',user.id).single()
  if (!staff?.school_id || !isInstructorOrAdmin(staff.role)) return {success:false,message:'Instructor or school admin required'}
  const {data:student} = await supabase.from('profiles').select('school_id,role').eq('id',studentId).eq('school_id',staff.school_id).in('role',['student','apprentice']).single()
  if (!student || student.school_id !== staff.school_id) return {success:false,message:'Student is not in your school'}
  if (staff.role === 'instructor' && !(await isStudentAssignedToInstructor(supabase,staff.school_id,user.id,studentId))) {
    return {success:false,message:'Student is not assigned to this instructor'}
  }
  if (!chapter5ConceptFamilies.some(c=>c.id===conceptId)) return {success:false,message:'Invalid Chapter 5 concept'}
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return {success:false,message:'Remediation service unavailable'}
  // Admin credentials remain exclusively on the server after caller and school checks.
  const admin=createAdminSupabase(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
  const {data:existing,error:lookupError}=await admin.from('remediation_cycles').select('id').eq('user_id',studentId).eq('concept_id',conceptId).neq('status','evaluated').is('outcome',null).maybeSingle()
  if (lookupError) return {success:false,message:'Unable to check active remediation'}
  if (existing) return {success:true,message:'Review already assigned'}
  const content=chapter5ContentConceptMappings.filter(m=>m.conceptFamilyId===conceptId).map(m=>({assignment_type:'content_block',asset_id:m.contentBlockId,is_primary:true}))
  const cards=chapter5FlashcardConceptMappings.filter(m=>m.conceptFamilyId===conceptId).map(m=>({assignment_type:'flashcard',asset_id:m.flashcardId,is_primary:false}))
  const assets=[...content,...cards].map((a,index)=>({...a,priority:index+1}))
  if (!content.length || !cards.length) return {success:false,message:'Review materials unavailable'}
  const {data:last,error:lastError}=await admin.from('remediation_cycles').select('cycle_number').eq('user_id',studentId).eq('concept_id',conceptId).order('cycle_number',{ascending:false}).limit(1).maybeSingle()
  if (lastError) return {success:false,message:'Unable to validate cycle history'}
  const cycleNumber=(last?.cycle_number??0)+1
  if (cycleNumber>3) return {success:false,message:'Maximum review cycles reached'}
  const {data,error}=await admin.rpc('create_remediation_cycle_with_assignments',{
    p_user_id:studentId,p_concept_id:conceptId,p_chapter_id:'ch-5',p_cycle_number:cycleNumber,
    p_detection_state:'emerging_weakness',p_detection_confidence:'low',
    p_detection_evidence:{source:'instructor_assignment',assigned_by:user.id,school_id:staff.school_id},
    p_status:'targeted',p_assignments:assets
  })
  if(error) return {success:false,message:'Unable to create review assignment'}
  if (!data) return {success:true,message:'Review already assigned'}
  revalidatePath('/instructor/student/'+studentId)
  revalidatePath('/dashboard')
  return {success:true,message:'Review assigned to student'}
}

export async function getChapter5ReviewStatus(studentId:string):Promise<{conceptId:string;status:string;done:number;total:number}[]> {
  const supabase=await createClient()
  const {data:{user}}=await supabase.auth.getUser()
  if(!user) return []
  const {data:staff}=await supabase.from('profiles').select('school_id,role').eq('id',user.id).single()
  if(!staff?.school_id || !isInstructorOrAdmin(staff.role)) return []
  const {data:student}=await supabase.from('profiles').select('school_id').eq('id',studentId).eq('school_id',staff.school_id).in('role',['student','apprentice']).single()
  if(!student || (staff.role==='instructor' && !(await isStudentAssignedToInstructor(supabase,staff.school_id,user.id,studentId)))) return []
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY
  if(!url||!key) return []
  const admin=createAdminSupabase(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
  const {data:cycles}=await admin.from('remediation_cycles').select('id,concept_id,status').eq('user_id',studentId).eq('chapter_id','ch-5')
  if(!cycles?.length) return []
  const {data:assignments}=await admin.from('remediation_assignments').select('cycle_id,status').in('cycle_id',cycles.map(c=>c.id))
  return cycles.map(c=>{const mine=(assignments??[]).filter(a=>a.cycle_id===c.id);return {conceptId:c.concept_id,status:c.status,done:mine.filter(a=>a.status==='completed').length,total:mine.length}})
}
