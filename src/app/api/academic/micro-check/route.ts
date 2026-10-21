import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createServiceRoleClient } from '@/lib/supabase-service-role'
import { chapter1MicroChecks } from '@/lib/chapter-1-concepts/micro-checks'
import { chapter2MicroChecks } from '@/lib/chapter-2-concepts/micro-checks'
import { chapter3MicroChecks } from '@/lib/chapter-3-concepts/micro-checks'
import { chapter5MicroChecks } from '@/lib/chapter-5-concepts/micro-checks'
import { chapter6MicroChecks } from '@/lib/chapter-6-concepts/micro-checks'
import { chapter7MicroChecks } from '@/lib/chapter-7-concepts/micro-checks'
import { chapter8MicroChecks } from '@/lib/chapter-8-concepts/micro-checks'
import { chapter9MicroChecks } from '@/lib/chapter-9-concepts/micro-checks'
import { chapter10MicroChecks } from '@/lib/chapter-10-concepts/micro-checks'
import { chapter11MicroChecks } from '@/lib/chapter-11-concepts/micro-checks'
import { chapter12MicroChecks } from '@/lib/chapter-12-concepts/micro-checks'
import { chapter13MicroChecks } from '@/lib/chapter-13-concepts/micro-checks'
import { chapter14MicroChecks } from '@/lib/chapter-14-concepts/micro-checks'
import { chapter15MicroChecks } from '@/lib/chapter-15-concepts/micro-checks'
import { chapter16MicroChecks } from '@/lib/chapter-16-concepts/micro-checks'
import { chapter17MicroChecks } from '@/lib/chapter-17-concepts/micro-checks'
import { chapter18MicroChecks } from '@/lib/chapter-18-concepts/micro-checks'

const records = new Map<string, { chapter: string; check: string; question: string; concept: string; difficulty: string; answer: string }>()
for (const check of chapter1MicroChecks) for (const question of check.questions) {
  records.set('ch-1:' + question.id, {
    chapter: 'ch-1', check: check.id, question: question.id,
    concept: question.conceptFamilyId,
    difficulty: question.difficulty, answer: question.correctAnswer,
  })
}
for (const check of chapter2MicroChecks) for (const question of check.questions) {
  records.set('ch-2:' + question.id, {
    chapter: 'ch-2', check: check.id, question: question.id,
    concept: question.conceptId,
    difficulty: question.difficulty, answer: question.correctAnswer,
  })
}
for (const check of chapter3MicroChecks) for (const question of check.questions) {
  records.set('ch-3:' + question.id, {
    chapter: 'ch-3', check: check.id, question: question.id,
    concept: question.conceptFamilyId,
    difficulty: question.difficulty, answer: question.correctAnswer,
  })
}
for (const check of chapter5MicroChecks) for (const question of check.questions) {
  records.set('ch-5:' + question.id, {
    chapter: 'ch-5', check: check.id, question: question.id,
    concept: question.conceptFamilyId,
    difficulty: question.difficulty, answer: question.correctAnswer,
  })
}
for (const check of chapter6MicroChecks) for (const question of check.questions) {
  records.set('ch-6:' + question.id, {
    chapter: 'ch-6', check: check.id, question: question.id,
    concept: question.conceptFamilyId,
    difficulty: question.difficulty, answer: question.correctAnswer,
  })
}
for (const check of chapter7MicroChecks) for (const question of check.questions) {
  records.set('ch-7:' + question.id, {
    chapter: 'ch-7', check: check.id, question: question.id,
    concept: question.conceptFamilyId,
    difficulty: question.difficulty, answer: question.correctAnswer,
  })
}
for (const check of chapter8MicroChecks) for (const question of check.questions) {
  records.set('ch-8:' + question.id, {
    chapter: 'ch-8', check: check.id, question: question.id,
    concept: question.conceptFamilyId,
    difficulty: question.difficulty, answer: question.correctAnswer,
  })
}
for (const check of chapter9MicroChecks) for (const question of check.questions) {
  records.set('ch-9:' + question.id, {
    chapter: 'ch-9', check: check.id, question: question.id,
    concept: question.conceptFamilyId,
    difficulty: question.difficulty, answer: question.correctAnswer,
  })
}
for (const check of chapter10MicroChecks) for (const question of check.questions) {
  records.set('ch-10:' + question.id, {
    chapter: 'ch-10', check: check.id, question: question.id,
    concept: question.conceptFamilyId,
    difficulty: question.difficulty, answer: question.correctAnswer,
  })
}
for (const check of chapter11MicroChecks) for (const question of check.questions) {
  records.set('ch-11:' + question.id, {
    chapter: 'ch-11', check: check.id, question: question.id,
    concept: question.conceptFamilyId,
    difficulty: question.difficulty, answer: question.correctAnswer,
  })
}
for (const check of chapter12MicroChecks) for (const question of check.questions) {
  records.set('ch-12:' + question.id, {
    chapter: 'ch-12', check: check.id, question: question.id,
    concept: question.conceptFamilyId,
    difficulty: question.difficulty, answer: question.correctAnswer,
  })
}
for (const check of chapter13MicroChecks) for (const question of check.questions) {
  records.set('ch-13:' + question.id, {
    chapter: 'ch-13', check: check.id, question: question.id,
    concept: question.conceptFamilyId,
    difficulty: question.difficulty, answer: question.correctAnswer,
  })
}
for (const check of chapter14MicroChecks) for (const question of check.questions) {
  records.set('ch-14:' + question.id, {
    chapter: 'ch-14', check: check.id, question: question.id,
    concept: question.conceptFamilyId,
    difficulty: question.difficulty, answer: question.correctAnswer,
  })
}
for (const check of chapter15MicroChecks) for (const question of check.questions) {
  records.set('ch-15:' + question.id, {
    chapter: 'ch-15', check: check.id, question: question.id,
    concept: question.conceptFamilyId,
    difficulty: question.difficulty, answer: question.correctAnswer,
  })
}
for (const check of chapter16MicroChecks) for (const question of check.questions) {
  records.set('ch-16:' + question.id, {
    chapter: 'ch-16', check: check.id, question: question.id,
    concept: question.conceptFamilyId,
    difficulty: question.difficulty, answer: question.correctAnswer,
  })
}
for (const check of chapter17MicroChecks) for (const question of check.questions) {
  records.set('ch-17:' + question.id, {
    chapter: 'ch-17', check: check.id, question: question.id,
    concept: question.conceptFamilyId,
    difficulty: question.difficulty, answer: question.correctAnswer,
  })
}
for (const check of chapter18MicroChecks) for (const question of check.questions) {
  records.set('ch-18:' + question.id, {
    chapter: 'ch-18', check: check.id, question: question.id,
    concept: question.conceptFamilyId,
    difficulty: question.difficulty, answer: question.correctAnswer,
  })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  const body = raw as Record<string, unknown>
  if (Object.keys(body).some(key => !['chapterId', 'questionId', 'selectedAnswer'].includes(key)) ||
    typeof body.chapterId !== 'string' || typeof body.questionId !== 'string' ||
    typeof body.selectedAnswer !== 'string' || !['a','b','c','d'].includes(body.selectedAnswer)) {
    return NextResponse.json({ error: 'Invalid academic evidence payload' }, { status: 400 })
  }
  const question = records.get(body.chapterId + ':' + body.questionId)
  if (!question) return NextResponse.json({ error: 'Unknown question' }, { status: 404 })
  const columns = 'id,user_id,chapter_id,check_id,question_id,concept_id,difficulty,selected_answer,is_correct,answered_at,created_at'
  const admin = createServiceRoleClient()
  const record = { user_id: user.id, chapter_id: question.chapter, check_id: question.check,
    question_id: question.question, concept_id: question.concept, difficulty: question.difficulty,
    selected_answer: body.selectedAnswer, is_correct: body.selectedAnswer === question.answer }
  const { data, error } = await admin.from('chapter_micro_check_attempts').insert(record).select(columns).single()
  if (!error && data) return NextResponse.json({ row: data, alreadyRecorded: false })
  if (error?.code === '23505') {
    const { data: prior, error: priorError } = await admin.from('chapter_micro_check_attempts')
      .select(columns).eq('user_id', user.id).eq('chapter_id', question.chapter)
      .eq('question_id', question.question).maybeSingle()
    if (!priorError && prior) return NextResponse.json({ row: prior, alreadyRecorded: true })
  }
  return NextResponse.json({ error: 'Unable to record answer' }, { status: 500 })
}
