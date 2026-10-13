import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// QA-only experimental raw event transport. No browser-supplied seconds accepted.
// Disabled in all environments unless specifically enabled by operators.
const enabled = () => process.env.ENABLE_READING_QA_PROTOTYPE === 'true'
const kinds = new Set(['scroll','reader_action','visible','hidden','tick'])
export async function POST(request:NextRequest) {
  if (!enabled()) return NextResponse.json({error:'Not found'},{status:404})
  const supabase=await createClient()
  const {data:{user}}=await supabase.auth.getUser()
  if(!user) return NextResponse.json({error:'Authentication required'},{status:401})
  const data=await request.json().catch(()=>null)
  const type=data?.eventType
  if(data?.chapterId!=='ch-1'||!kinds.has(type) ||
     typeof data?.eventId!=='string'|| !/^[a-f0-9-]{36}$/i.test(data.eventId) ||
     (data?.scrollDepthPercent!==null && data?.scrollDepthPercent!==undefined &&
       (!Number.isInteger(data.scrollDepthPercent)||data.scrollDepthPercent<0||data.scrollDepthPercent>100)))
    return NextResponse.json({error:'Invalid QA event'},{status:400})
  const {error}=await supabase.rpc('qa_record_reading_event',{
    p_event_id:data.eventId,p_event_type:type,
    p_scroll_depth_percent:data.scrollDepthPercent ?? null
  })
  if(error)return NextResponse.json({error:'QA event rejected'},{status:403})
  return NextResponse.json({ok:true})
}
export async function GET() {
  if (!enabled()) return NextResponse.json({error:'Not found'},{status:404})
  const supabase=await createClient()
  const {data:{user}}=await supabase.auth.getUser()
  if(!user) return NextResponse.json({error:'Authentication required'},{status:401})
  const {data,error}=await supabase.rpc('qa_read_reading_events')
  if(error)return NextResponse.json({error:'QA read rejected'},{status:403})
  return NextResponse.json({chapterId:'ch-1',events:data},{headers:{'Cache-Control':'no-store'}})
}
