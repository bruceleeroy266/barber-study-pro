import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
export async function PUT(request:NextRequest,{params}:{params:Promise<{attemptId:string}>}) {
 const {attemptId}=await params
 const supabase=await createClient()
 const {data:{user}}=await supabase.auth.getUser()
 if(!user)return NextResponse.json({error:'Authentication required'},{status:401})
 const body=await request.json().catch(()=>null)
 const position=body?.position
 if(!Number.isInteger(position)||position<1||position>110)return NextResponse.json({error:'Invalid question position'},{status:400})
 const {data,error}=await supabase.rpc('set_comprehensive_exam_current_question',{p_attempt_id:attemptId,p_position:position})
 if(error||!data)return NextResponse.json({error:'Position not saved'},{status:403})
 return NextResponse.json({saved:true})
}
