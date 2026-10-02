import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { data, error } = await supabase.rpc('get_my_comprehensive_exam_history')
  if (error) {
    console.error('[ComprehensiveExam] history failed:', error.message)
    return NextResponse.json({ error: 'Could not load exam history' }, { status: 400 })
  }

  return NextResponse.json({ history: data })
}
