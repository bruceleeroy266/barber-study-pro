import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createServiceRoleClient } from '@/lib/supabase-service-role'
import {
  resolveRegisteredMicroCheckQuestion,
} from '@/lib/micro-checks/registry'
import type { MicroCheckAnswerKey } from '@/lib/micro-checks/randomization'

const validAnswers = new Set<MicroCheckAnswerKey>(['a', 'b', 'c', 'd'])
const columns =
  'id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at'

async function authenticatedUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return error || !user ? null : user
}

export async function GET(request: NextRequest) {
  const user = await authenticatedUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const chapterId = request.nextUrl.searchParams.get('chapterId')
  const questionId = request.nextUrl.searchParams.get('questionId')
  if (!chapterId || !questionId) {
    return NextResponse.json({ error: 'chapterId and questionId are required' }, { status: 400 })
  }

  if (!resolveRegisteredMicroCheckQuestion(chapterId, questionId)) {
    return NextResponse.json({ error: 'Unknown micro-check question' }, { status: 404 })
  }

  const admin = createServiceRoleClient()
  const { data, error } = await admin
    .from('chapter_micro_check_remediation_attempts')
    .select(columns)
    .eq('user_id', user.id)
    .eq('chapter_id', chapterId)
    .eq('question_id', questionId)
    .maybeSingle()

  if (error) {
    console.error('[Micro-check remediation API] lookup failed:', error.message)
    return NextResponse.json({ error: 'Unable to load remediation evidence' }, { status: 500 })
  }

  return NextResponse.json({ row: data ?? null })
}

export async function POST(request: NextRequest) {
  const user = await authenticatedUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  let body: {
    chapterId?: unknown
    questionId?: unknown
    selectedAnswer?: unknown
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (
    typeof body.chapterId !== 'string' ||
    typeof body.questionId !== 'string' ||
    typeof body.selectedAnswer !== 'string' ||
    !validAnswers.has(body.selectedAnswer as MicroCheckAnswerKey)
  ) {
    return NextResponse.json({ error: 'Invalid remediation submission' }, { status: 400 })
  }

  const resolved = resolveRegisteredMicroCheckQuestion(body.chapterId, body.questionId)
  if (!resolved) {
    return NextResponse.json({ error: 'Unknown micro-check question' }, { status: 404 })
  }

  const selectedAnswer = body.selectedAnswer as MicroCheckAnswerKey
  const { question, checkId, chapterId } = resolved
  const admin = createServiceRoleClient()

  const payload = {
    user_id: user.id,
    chapter_id: chapterId,
    check_id: checkId,
    question_id: question.id,
    concept_id: question.conceptFamilyId,
    difficulty: question.difficulty,
    selected_answer: selectedAnswer,
    is_correct: selectedAnswer === question.correctAnswer,
    answered_at: new Date().toISOString(),
  }

  const { data, error } = await admin
    .from('chapter_micro_check_remediation_attempts')
    .insert(payload)
    .select(columns)
    .single()

  if (!error && data) {
    return NextResponse.json({ row: data, alreadyRecorded: false })
  }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await admin
      .from('chapter_micro_check_remediation_attempts')
      .select(columns)
      .eq('user_id', user.id)
      .eq('chapter_id', chapterId)
      .eq('question_id', question.id)
      .maybeSingle()

    if (existingError) {
      return NextResponse.json(
        { error: 'Unable to recover preserved remediation evidence' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      row: existing ?? null,
      alreadyRecorded: true,
    })
  }

  console.error('[Micro-check remediation API] insert failed:', error?.message)
  return NextResponse.json({ error: 'Unable to save remediation answer' }, { status: 500 })
}
