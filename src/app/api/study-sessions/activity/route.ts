import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

const EVENTS = new Set(['qualifying_activity', 'heartbeat'])

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : ''
  const eventType = typeof body?.eventType === 'string' ? body.eventType : ''

  if (!sessionId || !EVENTS.has(eventType)) {
    return NextResponse.json({ error: 'Invalid telemetry request' }, { status: 400 })
  }

  const { data, error } = await supabase.rpc('record_learning_activity', {
    p_session_id: sessionId,
    p_event_type: eventType,
    p_client_event_at: new Date().toISOString(),
  })

  if (error) {
    console.error('[StudyTelemetry] activity failed:', error.message)
    return NextResponse.json({ error: 'Could not record study activity' }, { status: 400 })
  }

  return NextResponse.json({ result: Array.isArray(data) ? data[0] ?? null : data })
}
