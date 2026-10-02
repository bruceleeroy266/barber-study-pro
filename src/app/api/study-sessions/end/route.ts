import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : ''
  if (!sessionId) return NextResponse.json({ error: 'Session required' }, { status: 400 })

  const { error } = await supabase.rpc('end_study_session', {
    p_session_id: sessionId,
    p_reason: 'explicit_end',
  })

  if (error) {
    console.error('[StudyTelemetry] end session failed:', error.message)
    return NextResponse.json({ error: 'Could not end study session' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
