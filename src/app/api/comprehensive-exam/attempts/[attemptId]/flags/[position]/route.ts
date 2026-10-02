import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string; position: string }> }
) {
  const { attemptId, position } = await params
  const parsedPosition = Number(position)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const flagged = typeof body?.flagged === 'boolean' ? body.flagged : null

  if (!Number.isInteger(parsedPosition) || parsedPosition < 1 || parsedPosition > 110) {
    return NextResponse.json({ error: 'Invalid question position' }, { status: 400 })
  }
  if (flagged === null) {
    return NextResponse.json({ error: 'flagged must be boolean' }, { status: 400 })
  }

  const { data, error } = await supabase.rpc('set_comprehensive_exam_flag', {
    p_attempt_id: attemptId,
    p_position: parsedPosition,
    p_flagged: flagged,
  })

  if (error) {
    console.error('[ComprehensiveExam] flag save failed:', error.message)
    return NextResponse.json({ error: 'Could not save flag' }, { status: 400 })
  }

  return NextResponse.json({ result: data })
}
