import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

const SURFACES = new Set(['lesson', 'flashcards', 'quiz', 'remediation', 'reassessment'])

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const surfaceType = typeof body?.surfaceType === 'string' ? body.surfaceType : ''
  const surfaceId = typeof body?.surfaceId === 'string' ? body.surfaceId : null

  if (!SURFACES.has(surfaceType)) {
    return NextResponse.json({ error: 'Unsupported study surface' }, { status: 400 })
  }

  const { data, error } = await supabase.rpc('begin_study_session', {
    p_surface_type: surfaceType,
    p_surface_id: surfaceId,
  })

  if (error) {
    console.error('[StudyTelemetry] begin session failed:', error.message)
    return NextResponse.json({ error: 'Could not start study session' }, { status: 400 })
  }

  return NextResponse.json({ sessionId: data })
}
