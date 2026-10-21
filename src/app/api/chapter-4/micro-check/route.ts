import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createServiceRoleClient } from '@/lib/supabase-service-role'
import { chapter4MicroChecks } from '@/lib/chapter-4-concepts/micro-checks'

/** Chapter 4 pilot of server-graded legacy evidence. Caller may submit ONLY the selected answer. */
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  const payload = body as Record<string, unknown>
  if (Object.keys(payload).some(k => !['questionId', 'selectedAnswer'].includes(k)) ||
    typeof payload.questionId !== 'string' ||
    !['a', 'b', 'c', 'd'].includes(String(payload.selectedAnswer))) {
    return NextResponse.json({ error: 'Unsupported academic evidence fields' }, { status: 400 })
  }
  const check = chapter4MicroChecks.find(c => c.questions.some(q => q.id === payload.questionId))
  const question = check?.questions.find(q => q.id === payload.questionId)
  if (!check || !question) return NextResponse.json({ error: 'Unknown question' }, { status: 404 })

  const admin = createServiceRoleClient()
  const record = {
    user_id: user.id, chapter_id: 'ch-4', check_id: check.id, question_id: question.id,
    concept_id: question.conceptFamilyId, difficulty: question.difficulty,
    selected_answer: payload.selectedAnswer as 'a' | 'b' | 'c' | 'd',
    is_correct: payload.selectedAnswer === question.correctAnswer,
  }
  const columns = 'id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at'
  const { data, error } = await admin.from('chapter_micro_check_attempts').insert(record).select(columns).single()
  if (!error && data) return NextResponse.json({ row: data, alreadyRecorded: false })
  if (error?.code === '23505') {
    const { data: existing, error: readError } = await admin.from('chapter_micro_check_attempts')
      .select(columns).eq('user_id', user.id).eq('chapter_id', 'ch-4')
      .eq('question_id', question.id).maybeSingle()
    if (!readError && existing) return NextResponse.json({ row: existing, alreadyRecorded: true })
  }
  return NextResponse.json({ error: 'Unable to record answer' }, { status: 500 })
}
