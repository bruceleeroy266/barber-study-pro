import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const configId = typeof body?.configId === 'string' ? body.configId : ''
  if (!configId) return NextResponse.json({ error: 'configId is required' }, { status: 400 })

  const { data, error } = await supabase.rpc('start_or_resume_comprehensive_exam', {
    p_config_id: configId,
  })

  if (error) {
    console.error('[ComprehensiveExam] start/resume failed:', error.message)
    return NextResponse.json({ error: 'Could not start or resume exam' }, { status: 400 })
  }

  return NextResponse.json({ attempt: data })
}
