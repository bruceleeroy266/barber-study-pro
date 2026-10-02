import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  const { attemptId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { data, error } = await supabase.rpc('submit_comprehensive_exam_attempt', {
    p_attempt_id: attemptId,
  })

  if (error) {
    console.error('[ComprehensiveExam] submit failed:', error.message)
    return NextResponse.json({ error: 'Could not submit exam' }, { status: 400 })
  }

  return NextResponse.json({ attempt: data })
}
