import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : ''
  const quizAttemptId = typeof body?.quizAttemptId === 'string' ? body.quizAttemptId : ''

  if (!sessionId || !quizAttemptId) {
    return NextResponse.json({ error: 'Session and quiz attempt are required' }, { status: 400 })
  }

  const { error } = await supabase.rpc('link_study_quiz_attempt', {
    p_session_id: sessionId,
    p_quiz_attempt_id: quizAttemptId,
  })

  if (error) {
    console.error('[StudyTelemetry] quiz link failed:', error.message)
    return NextResponse.json({ error: 'Could not link quiz telemetry' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
