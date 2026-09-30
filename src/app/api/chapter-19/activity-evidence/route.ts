import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createServiceRoleClient } from '@/lib/supabase-service-role'
import { getFlashcardEvidenceConcept } from '@/lib/concept-mastery/activity-evidence-registry'

type Chapter19FlashcardSignal = 'got_it' | 'needs_practice'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  let body: { source?: unknown; itemId?: unknown; selectedAnswer?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (body.source !== 'flashcard') {
    return NextResponse.json(
      { error: 'Chapter 19 has no certified scenario/application evidence source' },
      { status: 400 },
    )
  }

  if (typeof body.itemId !== 'string') {
    return NextResponse.json({ error: 'Invalid Chapter 19 activity item' }, { status: 400 })
  }

  if (body.selectedAnswer !== 'got_it' && body.selectedAnswer !== 'needs_practice') {
    return NextResponse.json({ error: 'Invalid Chapter 19 flashcard signal' }, { status: 400 })
  }

  const conceptId = getFlashcardEvidenceConcept('ch-19', body.itemId)
  if (!conceptId) {
    return NextResponse.json({ error: 'Unknown Chapter 19 flashcard' }, { status: 404 })
  }

  const selectedAnswer = body.selectedAnswer as Chapter19FlashcardSignal
  const admin = createServiceRoleClient()
  const payload = {
    user_id: user.id,
    chapter_id: 'ch-19',
    concept_id: conceptId,
    source: 'flashcard',
    item_id: body.itemId,
    selected_answer: selectedAnswer,
    is_correct: selectedAnswer === 'got_it',
    answered_at: new Date().toISOString(),
  }

  const { data, error } = await admin
    .from('chapter_activity_evidence')
    .insert(payload)
    .select('*')
    .single()

  if (!error && data) {
    return NextResponse.json({ row: data, alreadyRecorded: false })
  }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await admin
      .from('chapter_activity_evidence')
      .select('*')
      .eq('user_id', user.id)
      .eq('chapter_id', 'ch-19')
      .eq('source', 'flashcard')
      .eq('item_id', body.itemId)
      .maybeSingle()

    if (existingError) {
      return NextResponse.json({ error: 'Unable to recover preserved first-attempt evidence' }, { status: 500 })
    }

    return NextResponse.json({ row: existing ?? null, alreadyRecorded: true })
  }

  console.error('[C19 activity-evidence API] insert failed:', error?.message)
  return NextResponse.json({ error: 'Unable to save Chapter 19 activity evidence' }, { status: 500 })
}
