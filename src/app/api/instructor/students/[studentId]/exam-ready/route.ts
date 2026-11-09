import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { studentId } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(studentId)) {
    return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 })
  }

  // The SECURITY DEFINER RPC rechecks instructor role, school and active assignment.
  // Never retrieve question snapshots, answer keys, or provenance in this route.
  const { data, error } = await supabase.rpc('get_assigned_student_comprehensive_exam_results', {
    p_student_id: studentId,
  })
  if (error) {
    return NextResponse.json({ error: 'Exam results unavailable or access denied' }, { status: 403 })
  }
  return NextResponse.json({ attempts: data ?? [] })
}
