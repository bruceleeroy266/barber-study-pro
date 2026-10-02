import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { data, error } = await supabase.rpc('get_active_comprehensive_exam_config')
  if (error) {
    console.error('[ComprehensiveExam] config failed:', error.message)
    return NextResponse.json({ error: 'Could not load exam configuration' }, { status: 400 })
  }

  return NextResponse.json({ config: data })
}
