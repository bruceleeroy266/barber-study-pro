import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  const { attemptId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { data, error } = await supabase.rpc('get_comprehensive_exam_attempt', {
    p_attempt_id: attemptId,
  })

  if (error) {
    console.error('[ComprehensiveExam] attempt fetch failed:', error.message)
    return NextResponse.json({ error: 'Could not load exam attempt' }, { status: 400 })
  }

  return NextResponse.json({ attempt: data })
}
