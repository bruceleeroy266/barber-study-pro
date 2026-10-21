import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createServiceRoleClient } from '@/lib/supabase-service-role'
import { getLocalQuiz, getLocalQuizQuestions } from '@/lib/local-data'
import { calculateQuizScore } from '@/lib/quiz-scoring'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  const { data: profile, error: profileError } = await supabase.from('profiles')
    .select('role,school_id,approval_status,is_disabled').eq('id', user.id).single()
  if (profileError || !profile || !['student','apprentice'].includes(profile.role) ||
      profile.approval_status !== 'approved' || profile.is_disabled || !profile.school_id) {
    return NextResponse.json({ error: 'Active student enrollment required' }, { status: 403 })
  }
  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  const body = raw as Record<string, unknown>
  if (Object.keys(body).some(k => !['quizId','answers'].includes(k)) ||
      typeof body.quizId !== 'string' || !/^quiz-\d+$/.test(body.quizId) ||
      !body.answers || typeof body.answers !== 'object' || Array.isArray(body.answers)) {
    return NextResponse.json({ error: 'Unsupported assessment fields' }, { status: 400 })
  }
  const quiz = getLocalQuiz('ch-' + body.quizId.slice(5))
  if (!quiz || quiz.id !== body.quizId) return NextResponse.json({ error: 'Unknown quiz' }, { status: 404 })
  const questions = getLocalQuizQuestions(quiz.id)
  if (!questions.length) return NextResponse.json({ error: 'Quiz question bank unavailable' }, { status: 503 })
  const answers = body.answers as Record<string, unknown>
  const questionIds = new Set(questions.map(q => q.id))
  if (Object.keys(answers).length !== questionIds.size || Object.entries(answers)
    .some(([id, answer]) => !questionIds.has(id) || !['a','b','c','d'].includes(String(answer)))) {
    return NextResponse.json({ error: 'Incomplete or invalid quiz answers' }, { status: 400 })
  }
  const scoringAnswers = answers as Record<string, string>
  const computed = calculateQuizScore(questions.map(q => ({ id: q.id, correctKey: q.correct_answer })), scoringAnswers)
  const { data, error } = await createServiceRoleClient().from('quiz_attempts').insert({
    user_id: user.id, quiz_id: quiz.id, score: computed.score,
    total_questions: computed.total, percentage: computed.percentage,
    answers_json: scoringAnswers, completed_at: new Date().toISOString(),
  }).select('id,score,total_questions,percentage').single()
  if (error || !data) return NextResponse.json({ error: 'Failed to record quiz score' }, { status: 500 })
  return NextResponse.json({ attempt: data })
}
