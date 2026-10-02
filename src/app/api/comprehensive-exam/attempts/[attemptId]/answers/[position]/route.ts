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
  const selectedOption = typeof body?.selectedOption === 'string' ? body.selectedOption : ''

  if (!Number.isInteger(parsedPosition) || parsedPosition < 1 || parsedPosition > 110) {
    return NextResponse.json({ error: 'Invalid question position' }, { status: 400 })
  }
  if (!['a', 'b', 'c', 'd'].includes(selectedOption)) {
    return NextResponse.json({ error: 'Invalid selected option' }, { status: 400 })
  }

  const { data, error } = await supabase.rpc('save_comprehensive_exam_answer', {
    p_attempt_id: attemptId,
    p_position: parsedPosition,
    p_selected_option: selectedOption,
  })

  if (error) {
    console.error('[ComprehensiveExam] answer save failed:', error.message)
    return NextResponse.json({ error: 'Could not save answer' }, { status: 400 })
  }

  return NextResponse.json({ result: data })
}
