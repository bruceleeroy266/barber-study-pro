import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createServiceRoleClient } from '@/lib/supabase-service-role'
import { getChapterContent } from '@/lib/chapter-content'
import {
  getFlashcardEvidenceConcept,
  getScenarioEvidenceConcept,
} from '@/lib/concept-mastery/activity-evidence-registry'

type Chapter21FlashcardSignal = 'got_it' | 'needs_practice'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    )
  }

  let body: {
    source?: unknown
    itemId?: unknown
    selectedAnswer?: unknown
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    )
  }

  if (
    body.source !== 'flashcard' &&
    body.source !== 'scenario_application'
  ) {
    return NextResponse.json(
      { error: 'Invalid Chapter 21 activity source' },
      { status: 400 },
    )
  }

  if (typeof body.itemId !== 'string') {
    return NextResponse.json(
      { error: 'Invalid Chapter 21 activity item' },
      { status: 400 },
    )
  }

  let conceptId: string | null = null
  let selectedAnswer: string | null = null
  let isCorrect = false

  if (body.source === 'flashcard') {
    if (
      body.selectedAnswer !== 'got_it' &&
      body.selectedAnswer !== 'needs_practice'
    ) {
      return NextResponse.json(
        { error: 'Invalid Chapter 21 flashcard signal' },
        { status: 400 },
      )
    }

    conceptId = getFlashcardEvidenceConcept('ch-21', body.itemId)
    selectedAnswer = body.selectedAnswer as Chapter21FlashcardSignal
    isCorrect = selectedAnswer === 'got_it'
  } else {
    if (typeof body.selectedAnswer !== 'string') {
      return NextResponse.json(
        { error: 'Invalid Chapter 21 scenario answer' },
        { status: 400 },
      )
    }

    const separator = body.itemId.lastIndexOf(':')
    const sectionId =
      separator >= 0 ? body.itemId.slice(0, separator) : ''
    const scenarioIndex = Number(
      separator >= 0 ? body.itemId.slice(separator + 1) : Number.NaN,
    )

    if (
      !sectionId ||
      !Number.isInteger(scenarioIndex) ||
      scenarioIndex < 0
    ) {
      return NextResponse.json(
        { error: 'Invalid Chapter 21 scenario item' },
        { status: 400 },
      )
    }

    conceptId = getScenarioEvidenceConcept(
      'ch-21',
      sectionId,
      scenarioIndex,
    )

    const content = getChapterContent(21)
    const section = content?.sections.find(
      (candidate) => candidate.id === sectionId,
    )

    if (
      !section ||
      (section.type !== 'scenarioBlock' &&
        section.type !== 'proScenario')
    ) {
      return NextResponse.json(
        { error: 'Unknown Chapter 21 scenario section' },
        { status: 404 },
      )
    }

    const scenario = section.scenarios[scenarioIndex]
    if (!scenario) {
      return NextResponse.json(
        { error: 'Unknown Chapter 21 scenario' },
        { status: 404 },
      )
    }

    selectedAnswer = body.selectedAnswer
    isCorrect = selectedAnswer === scenario.correctAnswer
  }

  if (!conceptId) {
    return NextResponse.json(
      { error: 'Unknown Chapter 21 activity mapping' },
      { status: 404 },
    )
  }

  const admin = createServiceRoleClient()
  const payload = {
    user_id: user.id,
    chapter_id: 'ch-21',
    concept_id: conceptId,
    source: body.source,
    item_id: body.itemId,
    selected_answer: selectedAnswer,
    is_correct: isCorrect,
    answered_at: new Date().toISOString(),
  }

  const { data, error } = await admin
    .from('chapter_activity_evidence')
    .insert(payload)
    .select('*')
    .single()

  if (!error && data) {
    return NextResponse.json({
      row: data,
      alreadyRecorded: false,
    })
  }

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await admin
      .from('chapter_activity_evidence')
      .select('*')
      .eq('user_id', user.id)
      .eq('chapter_id', 'ch-21')
      .eq('source', body.source)
      .eq('item_id', body.itemId)
      .maybeSingle()

    if (existingError) {
      return NextResponse.json(
        {
          error:
            'Unable to recover preserved first-attempt evidence',
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      row: existing ?? null,
      alreadyRecorded: true,
    })
  }

  console.error(
    '[C21 activity-evidence API] insert failed:',
    error?.message,
  )

  return NextResponse.json(
    { error: 'Unable to save Chapter 21 activity evidence' },
    { status: 500 },
  )
}
