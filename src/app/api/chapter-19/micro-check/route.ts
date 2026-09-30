import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createServiceRoleClient } from '@/lib/supabase-service-role'
import {
  chapter19MicroChecks,
  type Chapter19MicroCheckAnswer,
} from '@/lib/chapter-19-concepts/micro-checks'

const validAnswers = new Set<Chapter19MicroCheckAnswer>(['a', 'b', 'c', 'd'])

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  let body: { questionId?: unknown; selectedAnswer?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (
    typeof body.questionId !== 'string' ||
    typeof body.selectedAnswer !== 'string' ||
    !validAnswers.has(body.selectedAnswer as Chapter19MicroCheckAnswer)
  ) {
    return NextResponse.json({ error: 'Invalid Chapter 19 micro-check submission' }, { status: 400 })
  }

  const check = chapter19MicroChecks.find((candidate) =>
    candidate.questions.some((question) => question.id === body.questionId),
  )
  const question = check?.questions.find((candidate) => candidate.id === body.questionId)

  if (!check || !question) {
    return NextResponse.json({ error: 'Unknown Chapter 19 micro-check question' }, { status: 404 })
  }

  const selectedAnswer = body.selectedAnswer as Chapter19MicroCheckAnswer
  const admin = createServiceRoleClient()
  const payload = {
    user_id: user.id,
    chapter_id: 'ch-19',
    check_id: check.id,
    question_id: question.id,
    concept_id: question.conceptFamilyId,
    difficulty: question.difficulty,
    selected_answer: selectedAnswer,
    is_correct: selectedAnswer === question.correctAnswer,
    answered_at: new Date().toISOString(),
  }

  const columns =
    'id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at'

  const { data, error } = await admin
    .from('chapter_micro_check_attempts')
    .insert(payload)
    .select(columns)
    .single()

  if (!error && data) {
    return NextResponse.json({ row: data, alreadyRecorded: false })
  }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await admin
      .from('chapter_micro_check_attempts')
      .select(columns)
      .eq('user_id', user.id)
      .eq('chapter_id', 'ch-19')
      .eq('question_id', question.id)
      .maybeSingle()

    if (existingError) {
      return NextResponse.json({ error: 'Unable to recover preserved first-attempt evidence' }, { status: 500 })
    }

    return NextResponse.json({ row: existing ?? null, alreadyRecorded: true })
  }

  console.error('[C19 micro-check API] insert failed:', error?.message)
  return NextResponse.json({ error: 'Unable to save micro-check answer' }, { status: 500 })
}
