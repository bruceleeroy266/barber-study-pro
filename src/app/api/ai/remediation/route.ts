import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { aiRemediationEngine } from '@/lib/ai/remediation-engine'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { targetWeakArea, focusChapter } = body
    
    const plan = await aiRemediationEngine.generatePlan(
      user.id,
      targetWeakArea,
      focusChapter
    )
    
    return NextResponse.json(plan)
    
  } catch (error) {
    console.error('AI Remediation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
